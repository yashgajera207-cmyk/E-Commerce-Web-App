import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeCartItem,
  syncCart,
} from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCart);
router.post("/", addToCart);
router.post("/sync", syncCart);
router.put("/:productId", updateQuantity);
router.delete("/:productId", removeCartItem);

export default router;
