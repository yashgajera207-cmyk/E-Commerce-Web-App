import express from "express";
import authRoutes from "./authRoutes.js";
import orderRoutes from "./orderRoutes.js";
import cartRoutes from "./cartRoutes.js";
import catalogRoutes from "./catalogRoutes.js";
import validateRoutes from "./validateRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "ShopZone Backend API",
    db: "PostgreSQL (Prisma)",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/validate", validateRoutes);
router.use("/orders", orderRoutes);
router.use("/cart", cartRoutes);
router.use("/admin", adminRoutes);
router.use("/", catalogRoutes);

export default router;
