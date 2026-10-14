import express from "express";
import {
  register,
  login,
  sendOtp,
  verifyOtp,
  checkIdentifier,
  getMe,
  updateProfile,
  getAddresses,
  addAddress,
  becomeSeller,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import { authLimiter } from "../middleware/security.js";

const router = express.Router();

// Public Authentication endpoints (rate-limited)
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/send-otp", authLimiter, sendOtp);
router.post("/verify-otp", authLimiter, verifyOtp);
router.post("/check-identifier", authLimiter, checkIdentifier);

// Protected endpoints
router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);
router.get("/addresses", authMiddleware, getAddresses);
router.post("/addresses", authMiddleware, addAddress);
router.post("/become-seller", authMiddleware, becomeSeller);

export default router;
