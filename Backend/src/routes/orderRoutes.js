import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:orderId", getOrderById);
router.patch("/:orderId/cancel", cancelOrder);

export default router;
