import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bcrypt from "bcryptjs";
import prisma from "./src/lib/prisma.js";
import { securityHeaders, corsConfig, apiLimiter } from "./src/middleware/security.js";
import { notFoundHandler, globalErrorHandler } from "./src/middleware/errorHandler.js";
import apiRoutes from "./src/routes/index.js";
import { seedIfEmpty } from "./src/controllers/catalogController.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(securityHeaders);
app.use(corsConfig);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api", apiLimiter);

// Seed admin and default data in PostgreSQL on startup
async function initDatabase() {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma successfully!");

    // Seed default admin
    const adminEmail = "admin@shopzone.com";
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      await prisma.user.create({
        data: {
          name: "Admin User",
          email: adminEmail,
          mobile: "9999999999",
          passwordHash,
          role: "admin",
          superCoins: 1000,
        },
      });
      console.log("[ShopZone Init] Default admin seeded (admin@shopzone.com / admin123)");
    }

    // Seed ShopZone categories and products
    await seedIfEmpty();
  } catch (error) {
    console.error("[Database Connection Error]:", error.message);
  }
}

initDatabase();

// Mount Routes
app.use("/api", apiRoutes);

// Root greeting
app.get("/", (_req, res) => {
  res.json({
    message: "ShopZone E-Commerce API Server Running",
    status: "online",
    docs: "/api/health",
  });
});

// Error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`\n✅ ShopZone API Server running on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health\n`);
});

// Handle port already in use — show clear message instead of crashing
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ Port ${PORT} is already in use!\n`);
    console.error(`   Fix: Run this command to free the port, then restart:\n`);
    console.error(`   Windows PowerShell:`);
    console.error(`     netstat -ano | findstr :${PORT}`);
    console.error(`     taskkill /PID <PID_FROM_ABOVE> /F\n`);
    console.error(`   Or kill all Node processes:`);
    console.error(`     taskkill /IM node.exe /F\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

// Graceful shutdown on Ctrl+C
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  server.close(async () => {
    await prisma.$disconnect();
    console.log("✅ Prisma disconnected. Server stopped.");
    process.exit(0);
  });
});
