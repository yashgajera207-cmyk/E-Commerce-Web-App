import express from "express";
import { adminMiddleware } from "../middleware/auth.js";
import {
  getAdminStats,
  getAdminOrders,
  updateOrderStatus,
  getAdminUsers,
  updateUserRole,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require admin JWT
router.use(adminMiddleware);

// Dashboard stats
router.get("/stats", getAdminStats);

// Orders management
router.get("/orders", getAdminOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

// Users management
router.get("/users", getAdminUsers);
router.patch("/users/:userId/role", updateUserRole);

// Product CRUD (admin only)
router.post("/products", createProduct);
router.put("/products/:productId", updateProduct);
router.delete("/products/:productId", deleteProduct);

// Category CRUD (admin only)
router.post("/categories", createCategory);
router.put("/categories/:categoryId", updateCategory);
router.delete("/categories/:categoryId", deleteCategory);

export default router;

