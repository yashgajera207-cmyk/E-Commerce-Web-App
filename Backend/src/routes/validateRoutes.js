import express from "express";
import rateLimit from "express-rate-limit";
import { validateEmail } from "../services/emailValidator.js";
import { validatePhoneNumber } from "../services/phoneValidator.js";

const router = express.Router();

// Strict rate limiting on validation endpoints to prevent abuse and SMTP flooding
const validateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 30, // max 30 validation requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    valid: false,
    status: "unknown",
    reason: "Too many validation requests. Please try again in a minute.",
  },
});

router.use(validateLimiter);

/**
 * POST /api/validate/email
 * Progressive email validation (Syntax, Domain MX, and Mailbox existence via SMTP)
 */
router.post("/email", async (req, res) => {
  try {
    const rawEmail = req.body.email;
    if (!rawEmail || typeof rawEmail !== "string") {
      return res.status(400).json({
        valid: false,
        status: "invalid",
        reason: "Email is required",
      });
    }

    // Safety timeout to prevent any hanging validation request
    const result = await Promise.race([
      validateEmail(rawEmail),
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              valid: false,
              status: "unknown",
              reason: "Mailbox existence could not be reliably determined (timeout)",
            }),
          4500
        )
      ),
    ]);

    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      valid: false,
      status: "unknown",
      reason: "An error occurred during email validation",
    });
  }
});

/**
 * POST /api/validate/phone
 * International phone number validation using numbering-plan metadata
 */
router.post("/phone", (req, res) => {
  try {
    const rawPhone = req.body.phone;
    if (!rawPhone || typeof rawPhone !== "string") {
      return res.status(400).json({
        valid: false,
        status: "invalid",
        reason: "Phone number is required",
      });
    }

    const defaultCountry = req.body.country || "IN";
    const result = validatePhoneNumber(rawPhone, defaultCountry);

    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      valid: false,
      status: "invalid",
      reason: "An error occurred during phone number validation",
    });
  }
});

export default router;
