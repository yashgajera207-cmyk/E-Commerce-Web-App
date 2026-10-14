import prisma from "../lib/prisma.js";

// GET DASHBOARD STATS
export async function getAdminStats(req, res, next) {
  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      revenueAgg,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { orderStatus: { not: "CANCELLED" } },
      }),
      // Last 7 days sales trend
      prisma.order.findMany({
        where: {
          orderStatus: { not: "CANCELLED" },
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        select: { createdAt: true, totalAmount: true },
      }),
    ]);

    const totalSales = revenueAgg._sum.totalAmount || 0;

    // Build daily sales trend for the last 7 days
    const dayLabels = [];
    const trendMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
      const key = d.toISOString().split("T")[0];
      dayLabels.push({ label, key });
      trendMap[key] = { day: label, sales: 0, orders: 0 };
    }

    for (const order of recentOrders) {
      const key = order.createdAt.toISOString().split("T")[0];
      if (trendMap[key]) {
        trendMap[key].sales += Number(order.totalAmount || 0);
        trendMap[key].orders += 1;
      }
    }

    const salesTrend = dayLabels.map(({ key }) => trendMap[key]);

    return res.json({
      totalSales,
      totalOrders,
      totalProducts,
      totalUsers,
      salesTrend,
    });
  } catch (error) {
    next(error);
  }
}

// GET ALL ORDERS (ADMIN)
export async function getAdminOrders(req, res, next) {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {};
    if (status && status !== "all") where.orderStatus = status.toUpperCase();
    if (search) {
      where.OR = [
        { orderNumber: { contains: String(search), mode: "insensitive" } },
        { user: { name: { contains: String(search), mode: "insensitive" } } },
        { user: { email: { contains: String(search), mode: "insensitive" } } },
      ];
    }

    const [rawOrders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          user: {
            select: { id: true, name: true, email: true, mobile: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.order.count({ where }),
    ]);

    const orders = rawOrders.map((o) => ({
      ...o,
      total: Number(o.totalAmount ?? 0),
      totalAmount: Number(o.totalAmount ?? 0),
      status: (o.orderStatus || "pending").toLowerCase(),
      orderStatus: o.orderStatus || "CONFIRMED",
      created_at: o.createdAt,
      user: o.user || { name: "Customer", email: "", mobile: "" },
      items: (o.items || []).map((item) => ({
        ...item,
        quantity: item.quantity || 1,
        price: Number(item.price || 0),
        product: {
          id: item.productId || item.id,
          name: item.productName || "Product",
          image: item.productImage || "🛍️",
          price: Number(item.price || 0),
        },
      })),
    }));

    return res.json({ orders, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    next(error);
  }
}

// UPDATE ORDER STATUS (ADMIN)
export async function updateOrderStatus(req, res, next) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURNED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const order = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { orderStatus: status },
      include: { user: { select: { name: true, email: true } }, items: true },
    });

    return res.json({ message: "Order status updated.", order });
  } catch (error) {
    next(error);
  }
}

// GET ALL USERS (ADMIN)
export async function getAdminUsers(req, res, next) {
  try {
    const { search, role, page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {};
    if (role && role !== "all") where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: "insensitive" } },
        { email: { contains: String(search), mode: "insensitive" } },
        { mobile: { contains: String(search), mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          role: true,
          superCoins: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.user.count({ where }),
    ]);

    return res.json({ users, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    next(error);
  }
}

// UPDATE USER ROLE (ADMIN)
export async function updateUserRole(req, res, next) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "admin", "seller"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be user, admin, or seller." });
    }

    // Prevent self-demotion
    if (Number(userId) === req.user.id && role !== "admin") {
      return res.status(400).json({ message: "You cannot change your own admin role." });
    }

    const updated = await prisma.user.update({
      where: { id: Number(userId) },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return res.json({ message: "User role updated.", user: updated });
  } catch (error) {
    next(error);
  }
}

// DELETE PRODUCT (ADMIN)
export async function deleteProduct(req, res, next) {
  try {
    const { productId } = req.params;
    await prisma.product.delete({ where: { id: Number(productId) } });
    return res.json({ message: "Product deleted successfully." });
  } catch (error) {
    next(error);
  }
}

// CREATE PRODUCT (ADMIN)
export async function createProduct(req, res, next) {
  try {
    const { name, description, price, mrp, discount, image, category_id, section, brand } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({ message: "name, price, and category_id are required." });
    }

    const product = await prisma.product.create({
      data: {
        name: String(name),
        description: description || "",
        price: Number(price),
        mrp: mrp ? Number(mrp) : null,
        discount: discount ? Number(discount) : null,
        image: image || "🛍️",
        section: section || "regular",
        brand: brand || null,
        categoryId: Number(category_id),
      },
      include: { category: true },
    });

    return res.status(201).json({ message: "Product created.", product });
  } catch (error) {
    next(error);
  }
}

// UPDATE PRODUCT (ADMIN)
export async function updateProduct(req, res, next) {
  try {
    const { productId } = req.params;
    const { name, description, price, mrp, discount, image, category_id, section, brand } = req.body;

    const data = {};
    if (name !== undefined) data.name = String(name);
    if (description !== undefined) data.description = String(description);
    if (price !== undefined) data.price = Number(price);
    if (mrp !== undefined) data.mrp = mrp ? Number(mrp) : null;
    if (discount !== undefined) data.discount = discount ? Number(discount) : null;
    if (image !== undefined) data.image = String(image);
    if (section !== undefined) data.section = String(section);
    if (brand !== undefined) data.brand = brand || null;
    if (category_id !== undefined) data.categoryId = Number(category_id);

    const product = await prisma.product.update({
      where: { id: Number(productId) },
      data,
      include: { category: true },
    });

    return res.json({ message: "Product updated.", product });
  } catch (error) {
    next(error);
  }
}

// CREATE CATEGORY (ADMIN)
export async function createCategory(req, res, next) {
  try {
    const { name, icon } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required." });
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const category = await prisma.category.create({
      data: {
        name: String(name),
        icon: icon || "🛍️",
        slug: slug || `cat-${Date.now()}`,
      },
    });
    return res.status(201).json({ message: "Category created.", category });
  } catch (error) {
    next(error);
  }
}

// UPDATE CATEGORY (ADMIN)
export async function updateCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const { name, icon } = req.body;
    const data = {};
    if (name) {
      data.name = String(name);
      data.slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }
    if (icon) data.icon = String(icon);
    const category = await prisma.category.update({
      where: { id: Number(categoryId) },
      data,
    });
    return res.json({ message: "Category updated.", category });
  } catch (error) {
    next(error);
  }
}

// DELETE CATEGORY (ADMIN)
export async function deleteCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    await prisma.category.delete({
      where: { id: Number(categoryId) },
    });
    return res.json({ message: "Category deleted." });
  } catch (error) {
    next(error);
  }
}

