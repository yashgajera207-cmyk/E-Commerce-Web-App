import express from "express";
import cors from "cors";
import pkg from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/shopzone",
});

let useMemoryStore = false;
let categories = [
  { id: 1, name: "Mobiles", icon: "📱" },
  { id: 2, name: "Fashion", icon: "👗" },
  { id: 3, name: "Electronics", icon: "💻" },
  { id: 4, name: "Home", icon: "🏠" },
  { id: 5, name: "Beauty", icon: "🧴" },
];

let products = [
  {
    id: 1,
    name: "iPhone 15",
    description: "Flagship smartphone with premium camera",
    price: 999,
    image: "📱",
    category_id: 1,
  },
  {
    id: 2,
    name: "Nike Air Max",
    description: "Everyday comfort and style",
    price: 129,
    image: "👟",
    category_id: 2,
  },
  {
    id: 3,
    name: "Galaxy Book",
    description: "Slim laptop for work and play",
    price: 799,
    image: "💻",
    category_id: 3,
  },
  {
    id: 4,
    name: "Smart Lamp",
    description: "Ambient lighting for modern homes",
    price: 59,
    image: "💡",
    category_id: 4,
  },
  {
    id: 5,
    name: "Glow Serum",
    description: "Hydrating skincare serum",
    price: 29,
    image: "🧴",
    category_id: 5,
  },
];

let offers = [
  { id: 1, title: "Big Fashion Fest", subtitle: "Up to 70% off" },
  { id: 2, title: "Electronics Bonanza", subtitle: "Extra 10% cashback" },
  { id: 3, title: "Weekend Super Saver", subtitle: "Free delivery" },
];

let users = [];
let otps = new Map();
let orderIdCounter = 1;
let orderStore = [];
let orderItemStore = [];

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "shopzone-secret", {
    expiresIn: "7d",
  });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "shopzone-secret",
    );
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

async function adminMiddleware(req, res, next) {
  authMiddleware(req, res, async () => {
    let dbUser;
    if (useMemoryStore) {
      dbUser = users.find(u => Number(u.id) === Number(req.user.id));
    } else {
      try {
        const check = await pool.query("SELECT role FROM users WHERE id = $1", [req.user.id]);
        dbUser = check.rows[0];
      } catch (err) {
        console.error("Admin verification DB error", err);
      }
    }
    
    if (dbUser && dbUser.role === "admin") {
      req.user.role = "admin";
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
  });
}

async function initDb() {
  // Seed a default admin user in memory store first
  const adminEmail = "admin@shipzone.com";
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  if (!users.some(u => u.email === adminEmail)) {
    users.push({
      id: 999,
      name: "Admin User",
      email: adminEmail,
      mobile: "9999999999",
      password: adminPasswordHash,
      role: "admin",
      created_at: new Date()
    });
  }

  try {
    await pool.query("SELECT 1");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        icon VARCHAR(50) DEFAULT '🛍️'
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        price NUMERIC(10,2) NOT NULL DEFAULT 0,
        mrp NUMERIC(10,2),
        discount INTEGER,
        rating NUMERIC(3,1),
        rating_count INTEGER,
        image VARCHAR(100),
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        section VARCHAR(50)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS offers (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        subtitle VARCHAR(200)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        mobile VARCHAR(20) UNIQUE,
        password VARCHAR(200),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total NUMERIC(10,2) NOT NULL DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        price NUMERIC(10,2) NOT NULL
      );
    `);

    // Alter products table to add new columns if they don't exist
    try { await pool.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS mrp NUMERIC(10,2)"); } catch {}
    try { await pool.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS discount INTEGER"); } catch {}
    try { await pool.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1)"); } catch {}
    try { await pool.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_count INTEGER"); } catch {}
    try { await pool.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS section VARCHAR(50)"); } catch {}

    // Update categories names and icons if old emojis present
    try {
      await pool.query("UPDATE categories SET name = 'Home & Kitchen', icon = 'sofa' WHERE name = 'Home'");
    } catch {}

    const seedCategories = [
      { name: "Mobiles", icon: "smartphone" },
      { name: "Electronics", icon: "headphones" },
      { name: "Fashion", icon: "shirt" },
      { name: "Home & Kitchen", icon: "sofa" },
      { name: "Beauty", icon: "sparkles" },
      { name: "Sports", icon: "dumbbell" },
      { name: "Stores", icon: "store" },
      { name: "Toys", icon: "gamepad-2" }
    ];

    for (const cat of seedCategories) {
      await pool.query(
        "INSERT INTO categories (name, icon) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET icon = $2",
        [cat.name, cat.icon]
      );
    }

    const initialProducts = [
      // Deals of the day
      { name: "boAt Airdopes 141", description: "boAt Airdopes 141 wireless earbuds", price: 1299, mrp: 2490, discount: 47, rating: 4.2, rating_count: 128453, image: "🎧", category: "Electronics", section: "deal" },
      { name: "Noise ColorFit Pulse 2", description: "Noise ColorFit Pulse 2 smart watch", price: 1299, mrp: 2999, discount: 57, rating: 4.1, rating_count: 34521, image: "⌚", category: "Electronics", section: "deal" },
      { name: "Sony WH-CH520", description: "Sony WH-CH520 wireless on-ear headphones", price: 1999, mrp: 3990, discount: 49, rating: 4.4, rating_count: 6721, image: "🎧", category: "Electronics", section: "deal" },
      { name: "Realme TechLife T100", description: "Realme TechLife T100 wireless earbuds", price: 1299, mrp: 2499, discount: 47, rating: 4.0, rating_count: 2145, image: "🎧", category: "Electronics", section: "deal" },
      { name: "pTron Bassbuds Duo", description: "pTron Bassbuds Duo in-ear earbuds", price: 699, mrp: 1499, discount: 53, rating: 3.9, rating_count: 8934, image: "🎧", category: "Electronics", section: "deal" },
      // Trending Now
      { name: "Noise ColorFit Pro 4 Smartwatch", description: "Noise ColorFit Pro 4 Smartwatch", price: 1799, mrp: 5999, discount: 70, rating: 4.1, rating_count: 34521, image: "⌚", category: "Electronics", section: "trending" },
      { name: "Levi's Men Slim Fit Jeans", description: "Levi's Men Slim Fit Jeans", price: 1399, mrp: 2999, discount: 53, rating: 4.3, rating_count: 8934, image: "👖", category: "Fashion", section: "trending" },
      { name: "Milton Thermosteel Bottle 1L", description: "Milton Thermosteel Bottle 1L", price: 599, mrp: 999, discount: 40, rating: 4.5, rating_count: 12045, image: "🍶", category: "Home & Kitchen", section: "trending" },
      { name: "Sony WH-CH520 Wireless Headphones", description: "Sony WH-CH520 Wireless Headphones", price: 2990, mrp: 4990, discount: 40, rating: 4.4, rating_count: 6721, image: "🎧", category: "Electronics", section: "trending" },
      { name: "Boldfit Yoga Mat 6mm", description: "Boldfit Yoga Mat 6mm", price: 499, mrp: 1299, discount: 62, rating: 4.2, rating_count: 3456, image: "🧘", category: "Sports", section: "trending" },
      // New Arrivals
      { name: "OnePlus Nord CE 4 Lite 5G", description: "OnePlus Nord CE 4 Lite 5G Smartphone", price: 18999, mrp: 21999, discount: 14, rating: 4.3, rating_count: 2103, image: "📱", category: "Mobiles", section: "new" },
      { name: "H&M Regular Fit Cotton T-Shirt", description: "H&M Regular Fit Cotton T-Shirt", price: 799, mrp: 1299, discount: 38, rating: 4.0, rating_count: 567, image: "👕", category: "Fashion", section: "new" },
      { name: "Ergonomic Study Chair", description: "Ergonomic Study Chair", price: 5499, mrp: 8999, discount: 39, rating: 4.1, rating_count: 342, image: "🪑", category: "Home & Kitchen", section: "new" },
      { name: "Mamaearth Vitamin C Face Serum 30ml", description: "Mamaearth Vitamin C Face Serum 30ml", price: 449, mrp: 699, discount: 36, rating: 4.4, rating_count: 891, image: "🧴", category: "Beauty", section: "new" },
      { name: "boAt Rockerz 255 Pro+ Neckband", description: "boAt Rockerz 255 Pro+ Neckband", price: 999, mrp: 2490, discount: 60, rating: 4.2, rating_count: 4521, image: "🎧", category: "Electronics", section: "new" }
    ];

    const productCount = await pool.query(
      "SELECT COUNT(*)::int AS count FROM products",
    );
    if (productCount.rows[0].count < 15) {
      await pool.query("DELETE FROM products");
      for (const p of initialProducts) {
        const catRes = await pool.query("SELECT id FROM categories WHERE name = $1", [p.category]);
        const catId = catRes.rows[0]?.id;
        await pool.query(`
          INSERT INTO products (name, description, price, mrp, discount, rating, rating_count, image, category_id, section)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [p.name, p.description, p.price, p.mrp, p.discount, p.rating, p.rating_count, p.image, catId, p.section]);
      }
    }

    const offerCount = await pool.query(
      "SELECT COUNT(*)::int AS count FROM offers",
    );
    if (offerCount.rows[0].count === 0) {
      await pool.query(
        "INSERT INTO offers (title, subtitle) VALUES ('Big Fashion Fest', 'Up to 70% off'), ('Electronics Bonanza', 'Extra 10% cashback'), ('Weekend Super Saver', 'Free delivery')",
      );
    }

    // Seed admin user in PostgreSQL
    const adminCheck = await pool.query("SELECT * FROM users WHERE email = $1", [adminEmail]);
    if (adminCheck.rows.length === 0) {
      await pool.query(
        "INSERT INTO users (name, email, mobile, password, role) VALUES ($1, $2, $3, $4, $5)",
        ["Admin User", adminEmail, "9999999999", adminPasswordHash, "admin"]
      );
      console.log("Admin user seeded in PostgreSQL");
    }

    console.log("Connected to PostgreSQL");
  } catch (error) {
    useMemoryStore = true;
    console.warn(
      "PostgreSQL unavailable, using in-memory store:",
      error.message,
    );
  }
}

function serializeProducts(items) {
  return items.map((item) => ({
    ...item,
    price: Number(item.price),
    mrp: item.mrp ? Number(item.mrp) : undefined,
    discount: item.discount ? Number(item.discount) : undefined,
    rating: item.rating ? Number(item.rating) : undefined,
    ratingCount: item.rating_count !== undefined ? Number(item.rating_count) : (item.ratingCount !== undefined ? Number(item.ratingCount) : undefined),
  }));
}

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", mode: useMemoryStore ? "memory" : "postgres" }),
);

app.get("/api/home", async (_req, res) => {
  if (useMemoryStore) {
    res.json({ products: serializeProducts(products), categories, offers });
    return;
  }

  const [productsResult, categoriesResult, offersResult] = await Promise.all([
    pool.query(
      `SELECT p.id, p.name, p.description, p.price, p.mrp, p.discount, p.rating, 
              p.rating_count AS "ratingCount", p.image, p.category_id, p.section, 
              c.name AS category_name 
       FROM products p 
       LEFT JOIN categories c ON c.id = p.category_id 
       ORDER BY p.id ASC`
    ),
    pool.query("SELECT * FROM categories ORDER BY id ASC"),
    pool.query("SELECT * FROM offers ORDER BY id ASC"),
  ]);
  res.json({
    products: serializeProducts(productsResult.rows),
    categories: categoriesResult.rows,
    offers: offersResult.rows,
  });
});

app.get("/api/products", async (_req, res) => {
  if (useMemoryStore) {
    res.json(serializeProducts(products));
    return;
  }

  const result = await pool.query(
    `SELECT p.id, p.name, p.description, p.price, p.mrp, p.discount, p.rating, 
            p.rating_count AS "ratingCount", p.image, p.category_id, p.section, 
            c.name AS category_name 
     FROM products p 
     LEFT JOIN categories c ON c.id = p.category_id 
     ORDER BY p.id ASC`
  );
  res.json(serializeProducts(result.rows));
});

app.post("/api/products", authMiddleware, async (req, res) => {
  const { name, description, price, image, categoryId, category_id, mrp, discount, rating, ratingCount, section } = req.body;
  if (useMemoryStore) {
    const item = {
      id: products.length + 1,
      name,
      description,
      price: Number(price),
      mrp: mrp ? Number(mrp) : undefined,
      discount: discount ? Number(discount) : undefined,
      rating: rating ? Number(rating) : undefined,
      ratingCount: ratingCount ? Number(ratingCount) : undefined,
      image,
      category_id: Number(categoryId || category_id || 1),
      section
    };
    products.push(item);
    res.status(201).json(item);
    return;
  }

  const result = await pool.query(
    "INSERT INTO products (name, description, price, mrp, discount, rating, rating_count, image, category_id, section) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
    [name, description, price, mrp, discount, rating, ratingCount, image, categoryId || category_id, section],
  );
  res.status(201).json(result.rows[0]);
});

app.get("/api/categories", async (_req, res) => {
  if (useMemoryStore) {
    res.json(categories);
    return;
  }

  const result = await pool.query("SELECT * FROM categories ORDER BY id ASC");
  res.json(result.rows);
});

app.post("/api/categories", authMiddleware, async (req, res) => {
  const { name, icon } = req.body;
  if (useMemoryStore) {
    const item = { id: categories.length + 1, name, icon: icon || "🛍️" };
    categories.push(item);
    res.status(201).json(item);
    return;
  }

  const result = await pool.query(
    "INSERT INTO categories (name, icon) VALUES ($1, $2) RETURNING *",
    [name, icon || "🛍️"],
  );
  res.status(201).json(result.rows[0]);
});

app.get("/api/offers", async (_req, res) => {
  if (useMemoryStore) {
    res.json(offers);
    return;
  }

  const result = await pool.query("SELECT * FROM offers ORDER BY id ASC");
  res.json(result.rows);
});

app.post("/api/offers", authMiddleware, async (req, res) => {
  const { title, subtitle } = req.body;
  if (useMemoryStore) {
    const item = { id: offers.length + 1, title, subtitle };
    offers.push(item);
    res.status(201).json(item);
    return;
  }

  const result = await pool.query(
    "INSERT INTO offers (title, subtitle) VALUES ($1, $2) RETURNING *",
    [title, subtitle],
  );
  res.status(201).json(result.rows[0]);
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, mobile, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  try {
    if (useMemoryStore) {
      const existingUser = users.find(
        (user) => user.email === email || (mobile && user.mobile === mobile),
      );
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: users.length + 1,
        name,
        email,
        mobile,
        password: hashedPassword,
        role: "user",
      };
      users.push(user);
      return res.status(201).json({
        token: signToken({ id: user.id, role: user.role, email: user.email }),
        user: { id: user.id, name, email, mobile, role: user.role },
      });
    } else {
      const existing = await pool.query(
        "SELECT * FROM users WHERE email = $1 OR (mobile IS NOT NULL AND mobile = $2)",
        [email, mobile || ""]
      );
      if (existing.rows.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        "INSERT INTO users (name, email, mobile, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, email, mobile || null, hashedPassword, "user"]
      );
      const user = result.rows[0];
      return res.status(201).json({
        token: signToken({ id: user.id, role: user.role, email: user.email }),
        user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile, role: user.role },
      });
    }
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, mobile, password } = req.body;
  const loginIdentifier = email || mobile;
  if (!loginIdentifier || !password) {
    return res.status(400).json({ message: "Identifier and password are required" });
  }

  try {
    let user;
    if (useMemoryStore) {
      user = users.find(
        (entry) => entry.email === loginIdentifier || entry.mobile === loginIdentifier
      );
    } else {
      const result = await pool.query(
        "SELECT * FROM users WHERE email = $1 OR mobile = $2",
        [loginIdentifier, loginIdentifier]
      );
      user = result.rows[0];
    }

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: signToken({ id: user.id, role: user.role, email: user.email }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.post("/api/auth/send-otp", async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) {
    return res.status(400).json({ message: "Mobile number required" });
  }
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  otps.set(mobile, otp);
  res.json({ message: "OTP sent", otp });
});

app.post("/api/auth/verify-otp", async (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    return res.status(400).json({ message: "Mobile and OTP are required" });
  }
  const expected = otps.get(mobile);
  if (!expected || expected !== otp) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  try {
    let user;
    if (useMemoryStore) {
      user = users.find((u) => u.mobile === mobile);
      if (!user) {
        user = {
          id: users.length + 1,
          name: "Guest",
          email: `${mobile}@shopzone.local`,
          mobile,
          password: await bcrypt.hash("123456", 10),
          role: "user",
        };
        users.push(user);
      }
    } else {
      const existing = await pool.query("SELECT * FROM users WHERE mobile = $1", [mobile]);
      if (existing.rows.length === 0) {
        const dummyPassword = await bcrypt.hash("123456", 10);
        const result = await pool.query(
          "INSERT INTO users (name, email, mobile, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          ["Guest", `${mobile}@shopzone.local`, mobile, dummyPassword, "user"]
        );
        user = result.rows[0];
      } else {
        user = existing.rows[0];
      }
    }

    res.json({
      token: signToken({ id: user.id, role: user.role, email: user.email }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
});

app.post("/api/orders", authMiddleware, async (req, res) => {
  const { items, total } = req.body;
  const userId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Order must have items" });
  }

  try {
    if (useMemoryStore) {
      const orderId = orderIdCounter++;
      const order = {
        id: orderId,
        user_id: userId,
        total: Number(total),
        status: "pending",
        created_at: new Date()
      };
      orderStore.push(order);
      
      for (const item of items) {
        orderItemStore.push({
          id: orderItemStore.length + 1,
          order_id: orderId,
          product_id: Number(item.product.id),
          quantity: Number(item.quantity),
          price: Number(item.product.price)
        });
      }

      return res.status(201).json({ id: orderId, message: "Order placed successfully" });
    } else {
      const orderRes = await pool.query(
        "INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING *",
        [userId, total, "pending"]
      );
      const orderId = orderRes.rows[0].id;

      for (const item of items) {
        await pool.query(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
          [orderId, item.product.id, item.quantity, item.product.price]
        );
      }

      return res.status(201).json({ id: orderId, message: "Order placed successfully" });
    }
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Server error placing order" });
  }
});

app.get("/api/orders", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    if (useMemoryStore) {
      const userOrders = orderStore.filter((o) => o.user_id === userId);
      const results = userOrders.map((order) => {
        const items = orderItemStore
          .filter((item) => item.order_id === order.id)
          .map((item) => {
            const prod = products.find((p) => p.id === item.product_id);
            return {
              id: item.id,
              quantity: item.quantity,
              price: item.price,
              product: prod || { id: item.product_id, name: "Unknown Product" }
            };
          });
        return {
          id: order.id,
          user_id: order.user_id,
          total: order.total,
          status: order.status,
          created_at: order.created_at,
          items
        };
      });
      return res.json(results);
    } else {
      const ordersRes = await pool.query(
        "SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC",
        [userId]
      );
      
      const results = [];
      for (const order of ordersRes.rows) {
        const itemsRes = await pool.query(
          `SELECT oi.*, p.name, p.image, p.price as prod_price, p.mrp, p.discount 
           FROM order_items oi 
           JOIN products p ON oi.product_id = p.id 
           WHERE oi.order_id = $1`,
          [order.id]
        );
        const items = itemsRes.rows.map((oi) => ({
          id: oi.id,
          quantity: oi.quantity,
          price: Number(oi.price),
          product: {
            id: oi.product_id,
            name: oi.name,
            image: oi.image,
            price: Number(oi.prod_price),
            mrp: oi.mrp ? Number(oi.mrp) : undefined,
            discount: oi.discount
          }
        }));
        results.push({
          id: order.id,
          user_id: order.user_id,
          total: Number(order.total),
          status: order.status,
          created_at: order.created_at,
          items
        });
      }
      return res.json(results);
    }
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Server error getting orders" });
  }
});

// Admin stats
app.get("/api/admin/stats", adminMiddleware, async (req, res) => {
  try {
    let stats = {
      totalSales: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalUsers: 0,
      salesTrend: []
    };
    
    if (useMemoryStore) {
      stats.totalOrders = orderStore.length;
      stats.totalProducts = products.length;
      stats.totalUsers = users.length;
      stats.totalSales = orderStore
        .filter(o => o.status !== "cancelled")
        .reduce((sum, o) => sum + Number(o.total), 0);
        
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const trendMap = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = days[d.getDay()];
        trendMap[dayName] = { day: dayName, sales: 0, orders: 0 };
      }
      
      orderStore.forEach(o => {
        const orderDate = new Date(o.created_at || new Date());
        const dayName = days[orderDate.getDay()];
        if (trendMap[dayName]) {
          trendMap[dayName].orders += 1;
          if (o.status !== "cancelled") {
            trendMap[dayName].sales += Number(o.total);
          }
        }
      });
      stats.salesTrend = Object.values(trendMap);
    } else {
      const ordersCount = await pool.query("SELECT COUNT(*)::int as count FROM orders");
      const productsCount = await pool.query("SELECT COUNT(*)::int as count FROM products");
      const usersCount = await pool.query("SELECT COUNT(*)::int as count FROM users");
      const salesSum = await pool.query("SELECT SUM(total)::float as total FROM orders WHERE status != 'cancelled'");
      
      stats.totalOrders = ordersCount.rows[0].count;
      stats.totalProducts = productsCount.rows[0].count;
      stats.totalUsers = usersCount.rows[0].count;
      stats.totalSales = salesSum.rows[0].total || 0;
      
      const trendRes = await pool.query(`
        SELECT 
          TO_CHAR(created_at, 'FMDay') AS day,
          SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END)::float AS sales,
          COUNT(*)::int AS orders,
          MIN(created_at) as first_date
        FROM orders
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY TO_CHAR(created_at, 'FMDay')
        ORDER BY first_date ASC
      `);
      
      stats.salesTrend = trendRes.rows.map(row => ({
        day: row.day,
        sales: row.sales,
        orders: row.orders
      }));
      
      if (stats.salesTrend.length === 0) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        stats.salesTrend = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return { day: days[d.getDay()], sales: 0, orders: 0 };
        });
      }
    }
    
    res.json(stats);
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin promote user to admin
app.post("/api/auth/become-seller", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    if (useMemoryStore) {
      const idx = users.findIndex(u => Number(u.id) === Number(userId));
      if (idx !== -1) {
        users[idx].role = "admin";
        const updatedUser = users[idx];
        const token = signToken({ id: updatedUser.id, role: "admin", email: updatedUser.email });
        return res.json({
          message: "Successfully promoted to seller/admin",
          token,
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            mobile: updatedUser.mobile,
            role: "admin"
          }
        });
      }
    } else {
      const result = await pool.query(
        "UPDATE users SET role = 'admin' WHERE id = $1 RETURNING *",
        [userId]
      );
      if (result.rows.length > 0) {
        const updatedUser = result.rows[0];
        const token = signToken({ id: updatedUser.id, role: "admin", email: updatedUser.email });
        return res.json({
          message: "Successfully promoted to seller/admin",
          token,
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            mobile: updatedUser.mobile,
            role: "admin"
          }
        });
      }
    }
    res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error("Become seller error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin product update & delete
app.put("/api/products/:id", adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, categoryId, category_id, mrp, discount, rating, ratingCount, section } = req.body;
  
  try {
    const catId = Number(categoryId || category_id || 1);
    if (useMemoryStore) {
      const idx = products.findIndex(p => Number(p.id) === Number(id));
      if (idx !== -1) {
        products[idx] = {
          ...products[idx],
          name: name ?? products[idx].name,
          description: description ?? products[idx].description,
          price: price !== undefined ? Number(price) : products[idx].price,
          mrp: mrp !== undefined ? Number(mrp) : products[idx].mrp,
          discount: discount !== undefined ? Number(discount) : products[idx].discount,
          rating: rating !== undefined ? Number(rating) : products[idx].rating,
          ratingCount: ratingCount !== undefined ? Number(ratingCount) : products[idx].ratingCount,
          image: image ?? products[idx].image,
          category_id: catId,
          section: section ?? products[idx].section
        };
        return res.json(serializeProducts([products[idx]])[0]);
      }
    } else {
      const result = await pool.query(
        `UPDATE products 
         SET name = COALESCE($1, name), 
             description = COALESCE($2, description), 
             price = COALESCE($3, price), 
             mrp = COALESCE($4, mrp), 
             discount = COALESCE($5, discount), 
             rating = COALESCE($6, rating), 
             rating_count = COALESCE($7, rating_count), 
             image = COALESCE($8, image), 
             category_id = COALESCE($9, category_id), 
             section = COALESCE($10, section)
         WHERE id = $11 RETURNING *`,
        [name, description, price, mrp, discount, rating, ratingCount, image, catId, section, id]
      );
      if (result.rows.length > 0) {
        return res.json(serializeProducts(result.rows)[0]);
      }
    }
    res.status(404).json({ message: "Product not found" });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/products/:id", adminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    if (useMemoryStore) {
      const idx = products.findIndex(p => Number(p.id) === Number(id));
      if (idx !== -1) {
        products.splice(idx, 1);
        return res.json({ message: "Product deleted successfully" });
      }
    } else {
      const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
      if (result.rows.length > 0) {
        return res.json({ message: "Product deleted successfully" });
      }
    }
    res.status(404).json({ message: "Product not found" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin category update & delete
app.put("/api/categories/:id", adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, icon } = req.body;
  try {
    if (useMemoryStore) {
      const idx = categories.findIndex(c => Number(c.id) === Number(id));
      if (idx !== -1) {
        categories[idx] = {
          ...categories[idx],
          name: name ?? categories[idx].name,
          icon: icon ?? categories[idx].icon
        };
        return res.json(categories[idx]);
      }
    } else {
      const result = await pool.query(
        "UPDATE categories SET name = COALESCE($1, name), icon = COALESCE($2, icon) WHERE id = $3 RETURNING *",
        [name, icon, id]
      );
      if (result.rows.length > 0) {
        return res.json(result.rows[0]);
      }
    }
    res.status(404).json({ message: "Category not found" });
  } catch (err) {
    console.error("Update category error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/categories/:id", adminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    if (useMemoryStore) {
      const idx = categories.findIndex(c => Number(c.id) === Number(id));
      if (idx !== -1) {
        categories.splice(idx, 1);
        return res.json({ message: "Category deleted successfully" });
      }
    } else {
      const result = await pool.query("DELETE FROM categories WHERE id = $1 RETURNING *", [id]);
      if (result.rows.length > 0) {
        return res.json({ message: "Category deleted successfully" });
      }
    }
    res.status(404).json({ message: "Category not found" });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin get all orders
app.get("/api/admin/orders", adminMiddleware, async (req, res) => {
  try {
    if (useMemoryStore) {
      const results = orderStore.map((order) => {
        const items = orderItemStore
          .filter((item) => item.order_id === order.id)
          .map((item) => {
            const prod = products.find((p) => p.id === item.product_id);
            return {
              id: item.id,
              quantity: item.quantity,
              price: item.price,
              product: prod || { id: item.product_id, name: "Unknown Product" }
            };
          });
        const orderUser = users.find(u => Number(u.id) === Number(order.user_id));
        return {
          id: order.id,
          user_id: order.user_id,
          user: orderUser ? { name: orderUser.name, email: orderUser.email, mobile: orderUser.mobile } : { name: "Guest User" },
          total: order.total,
          status: order.status,
          created_at: order.created_at,
          items
        };
      });
      return res.json(results.reverse());
    } else {
      const ordersRes = await pool.query(
        `SELECT o.*, u.name as user_name, u.email as user_email, u.mobile as user_mobile 
         FROM orders o 
         LEFT JOIN users u ON o.user_id = u.id 
         ORDER BY o.id DESC`
      );
      
      const results = [];
      for (const order of ordersRes.rows) {
        const itemsRes = await pool.query(
          `SELECT oi.*, p.name, p.image, p.price as prod_price, p.mrp, p.discount 
           FROM order_items oi 
           JOIN products p ON oi.product_id = p.id 
           WHERE oi.order_id = $1`,
          [order.id]
        );
        const items = itemsRes.rows.map((oi) => ({
          id: oi.id,
          quantity: oi.quantity,
          price: Number(oi.price),
          product: {
            id: oi.product_id,
            name: oi.name,
            image: oi.image,
            price: Number(oi.prod_price),
            mrp: oi.mrp ? Number(oi.mrp) : undefined,
            discount: oi.discount
          }
        }));
        results.push({
          id: order.id,
          user_id: order.user_id,
          user: {
            name: order.user_name,
            email: order.user_email,
            mobile: order.user_mobile
          },
          total: Number(order.total),
          status: order.status,
          created_at: order.created_at,
          items
        });
      }
      return res.json(results);
    }
  } catch (err) {
    console.error("Admin get orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update order status
app.put("/api/orders/:id/status", adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }
  
  try {
    if (useMemoryStore) {
      const idx = orderStore.findIndex(o => Number(o.id) === Number(id));
      if (idx !== -1) {
        orderStore[idx].status = status;
        return res.json({ message: "Order status updated successfully", order: orderStore[idx] });
      }
    } else {
      const result = await pool.query(
        "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
        [status, id]
      );
      if (result.rows.length > 0) {
        return res.json({ message: "Order status updated successfully", order: result.rows[0] });
      }
    }
    res.status(404).json({ message: "Order not found" });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin get users & update roles
app.get("/api/admin/users", adminMiddleware, async (req, res) => {
  try {
    if (useMemoryStore) {
      const cleanUsers = users.map(({ id, name, email, mobile, role, created_at }) => ({
        id, name, email, mobile, role, created_at: created_at || new Date()
      }));
      return res.json(cleanUsers);
    } else {
      const result = await pool.query(
        "SELECT id, name, email, mobile, role, created_at FROM users ORDER BY id ASC"
      );
      return res.json(result.rows);
    }
  } catch (err) {
    console.error("Get users admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/admin/users/:id/role", adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role) return res.status(400).json({ message: "Role is required" });
  
  try {
    if (useMemoryStore) {
      const idx = users.findIndex(u => Number(u.id) === Number(id));
      if (idx !== -1) {
        users[idx].role = role;
        return res.json({ message: "Role updated successfully", user: { id: users[idx].id, role: users[idx].role } });
      }
    } else {
      const result = await pool.query(
        "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, role",
        [role, id]
      );
      if (result.rows.length > 0) {
        return res.json({ message: "Role updated successfully", user: result.rows[0] });
      }
    }
    res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error("Update user role error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/", (_req, res) => res.send("ShopZone API running"));

initDb()
  .then(() => {
    app.listen(5000, () =>
      console.log("ShopZone API listening on http://localhost:5000"),
    );
  })
  .catch((err) => {
    console.error("Database init failed", err);
    process.exit(1);
  });
