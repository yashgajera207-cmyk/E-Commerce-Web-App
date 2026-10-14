import prisma from "../lib/prisma.js";

// GET USER'S CART
export async function getCart(req, res, next) {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ items });
  } catch (error) {
    next(error);
  }
}

// ADD TO CART
export async function addToCart(req, res, next) {
  try {
    const { productId, name, image, price, mrp, discount, quantity = 1 } = req.body;
    if (!productId || !name || price === undefined) {
      return res.status(400).json({ message: "Product ID, name, and price are required." });
    }

    const item = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: String(productId),
        },
      },
      update: {
        quantity: { increment: Number(quantity) },
      },
      create: {
        userId: req.user.id,
        productId: String(productId),
        name,
        image,
        price: Number(price),
        mrp: mrp ? Number(mrp) : undefined,
        discount: discount ? Number(discount) : undefined,
        quantity: Number(quantity),
      },
    });

    return res.status(201).json({ message: "Item added to cart", item });
  } catch (error) {
    next(error);
  }
}

// UPDATE CART ITEM QUANTITY
export async function updateQuantity(req, res, next) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({
        where: { userId: req.user.id, productId: String(productId) },
      });
      return res.json({ message: "Item removed from cart" });
    }

    const item = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: String(productId),
        },
      },
      data: { quantity: Number(quantity) },
    });

    return res.json({ message: "Cart updated", item });
  } catch (error) {
    next(error);
  }
}

// REMOVE ITEM FROM CART
export async function removeCartItem(req, res, next) {
  try {
    const { productId } = req.params;
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id, productId: String(productId) },
    });
    return res.json({ message: "Item removed from cart" });
  } catch (error) {
    next(error);
  }
}

// SYNC GUEST CART AFTER LOGIN
export async function syncCart(req, res, next) {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Items must be an array." });
    }

    for (const item of items) {
      await prisma.cartItem.upsert({
        where: {
          userId_productId: {
            userId: req.user.id,
            productId: String(item.id || item.productId),
          },
        },
        update: {
          quantity: { increment: Number(item.quantity || 1) },
        },
        create: {
          userId: req.user.id,
          productId: String(item.id || item.productId),
          name: item.name || item.title,
          image: item.image,
          price: Number(item.price),
          mrp: item.mrp ? Number(item.mrp) : undefined,
          discount: item.discount ? Number(item.discount) : undefined,
          quantity: Number(item.quantity || 1),
        },
      });
    }

    const updatedCart = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ message: "Cart synchronized", items: updatedCart });
  } catch (error) {
    next(error);
  }
}
