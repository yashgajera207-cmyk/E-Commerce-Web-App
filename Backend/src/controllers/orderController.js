import prisma from "../lib/prisma.js";

// CREATE ORDER
export async function createOrder(req, res, next) {
  try {
    const { items, deliveryAddress, paymentMethod, totalAmount, total, discount, deliveryFee } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item." });
    }

    // Normalise each item — frontend sends { product: {...}, quantity: N }
    // or flat { id, name, price, quantity }. Support both shapes.
    const normalisedItems = items.map((item) => {
      const p = item.product || item; // unwrap nested product if present
      const qty = Number(item.quantity || 1);
      const price = Number(p.price ?? item.price ?? 0);
      const mrp = p.mrp ?? item.mrp ?? null;
      return {
        productId: String(p.id ?? p.productId ?? item.id ?? item.productId ?? "unknown"),
        productName: String(p.name ?? p.title ?? item.name ?? item.title ?? "Product"),
        productImage: p.image ?? (p.images && p.images[0]) ?? item.image ?? null,
        price,
        mrp: mrp !== null ? Number(mrp) : undefined,
        quantity: qty,
      };
    });

    // Compute total server-side as fallback if frontend sent NaN / missing
    const computedTotal = normalisedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const finalTotal = Number(totalAmount ?? total ?? computedTotal) || computedTotal;

    const orderNumber = "OD" + Math.floor(100000000000 + Math.random() * 900000000000);
    const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          // Use Prisma relation connect instead of raw scalar userId
          user: { connect: { id: req.user.id } },
          totalAmount: finalTotal,
          discount: Number(discount || 0),
          deliveryFee: Number(deliveryFee || 0),
          paymentMethod: paymentMethod || "COD",
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "COMPLETED",
          orderStatus: "CONFIRMED",
          deliveryDate: estimatedDelivery,
          address: deliveryAddress
            ? (typeof deliveryAddress === "object" ? JSON.stringify(deliveryAddress) : deliveryAddress)
            : null,
          items: {
            create: normalisedItems,
          },
        },
        include: { items: true },
      });

      // Award SuperCoins (10 coins per order)
      await tx.user.update({
        where: { id: req.user.id },
        data: { superCoins: { increment: 10 } },
      });

      // Clear user's active cart in database
      await tx.cartItem.deleteMany({
        where: { userId: req.user.id },
      });

      return newOrder;
    });

    return res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    next(error);
  }
}

// GET USER'S ORDERS
export async function getUserOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ orders });
  } catch (error) {
    next(error);
  }
}

// GET SINGLE ORDER DETAIL
export async function getOrderById(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: isNaN(orderId) ? -1 : Number(orderId) },
          { orderNumber: orderId },
        ],
        userId: req.user.id,
      },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.json({ order });
  } catch (error) {
    next(error);
  }
}

// CANCEL ORDER
export async function cancelOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: isNaN(orderId) ? -1 : Number(orderId) },
          { orderNumber: orderId },
        ],
        userId: req.user.id,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (["DELIVERED", "CANCELLED"].includes(order.orderStatus)) {
      return res.status(400).json({ message: `Cannot cancel an order that is already ${order.orderStatus.toLowerCase()}.` });
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { orderStatus: "CANCELLED" },
    });

    return res.json({ message: "Order cancelled successfully.", order: updated });
  } catch (error) {
    next(error);
  }
}
