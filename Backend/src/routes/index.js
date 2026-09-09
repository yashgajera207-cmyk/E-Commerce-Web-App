import express from "express";
import {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
} from "../controllers/authController.js";
import {
  getHomeData,
  getProducts,
  createProduct,
  getCategories,
  createCategory,
  getOffers,
  createOffer,
} from "../controllers/catalogController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/health", (_req, res) => res.json({ status: "ok" }));
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/send-otp", sendOtp);
router.post("/auth/verify-otp", verifyOtp);

router.get("/home", getHomeData);
router.get("/products", getProducts);
router.get("/categories", getCategories);
router.get("/offers", getOffers);

router.post("/products", authMiddleware, createProduct);
router.post("/categories", authMiddleware, createCategory);
router.post("/offers", authMiddleware, createOffer);

export default router;
