import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { sendOtpEmail, sendOtpSms } from "../lib/emailService.js";
import { validatePhoneNumber } from "../services/phoneValidator.js";

function signToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "shopzone-super-secure-jwt-secret-key-2026-prod",
    { expiresIn: "30d" }
  );
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Validation helpers
export function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

export function cleanAndValidateMobile(mobile) {
  if (!mobile || typeof mobile !== "string") return { valid: false, mobile: null };
  const trimmed = mobile.trim();
  const phoneRes = validatePhoneNumber(trimmed);
  if (phoneRes.valid) {
    const digitsOnly = trimmed.replace(/^(\+91|0)/, "").replace(/\D/g, "");
    return { valid: true, mobile: digitsOnly || trimmed.replace(/\D/g, "") };
  }
  return { valid: false, mobile: null };
}

export function parseIdentifier(target) {
  if (!target || typeof target !== "string") {
    return { type: "invalid", value: null, original: "" };
  }
  const trimmed = target.trim();
  if (trimmed.includes("@")) {
    if (isValidEmail(trimmed)) {
      return { type: "email", value: trimmed.toLowerCase(), original: trimmed };
    }
    return { type: "invalid_email", value: trimmed, original: trimmed };
  } else {
    const { valid, mobile } = cleanAndValidateMobile(trimmed);
    if (valid) {
      return { type: "mobile", value: mobile, original: trimmed };
    }
    return { type: "invalid_mobile", value: trimmed, original: trimmed };
  }
}

// CHECK IDENTIFIER (EMAIL OR MOBILE)
export async function checkIdentifier(req, res, next) {
  try {
    const rawTarget = req.body.identifier || req.body.email || req.body.mobile;
    if (!rawTarget) {
      return res.status(400).json({ valid: false, message: "Please provide an email or mobile number." });
    }

    const { type, value } = parseIdentifier(String(rawTarget));

    if (type === "invalid_email") {
      return res.status(400).json({
        valid: false,
        type: "email",
        message: "Email is not valid. Please enter a valid email address.",
      });
    }
    if (type === "invalid_mobile") {
      return res.status(400).json({
        valid: false,
        type: "mobile",
        message: "Mobile number is not valid. Please enter a valid 10-digit mobile number.",
      });
    }
    if (type === "invalid") {
      return res.status(400).json({
        valid: false,
        message: "Please enter a valid email address or 10-digit mobile number.",
      });
    }

    const existing = await prisma.user.findFirst({
      where: type === "email" ? { email: value } : { mobile: value },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
      },
    });

    return res.json({
      valid: true,
      type,
      value,
      exists: !!existing,
      user: existing || null,
      message: existing
        ? `Account exists for ${type === "email" ? "email" : "mobile"}: ${value}`
        : `No account exists yet for ${type === "email" ? "email" : "mobile"}: ${value}`,
    });
  } catch (error) {
    next(error);
  }
}

// REGISTER USER (BOTH EMAIL AND MOBILE VALIDATED & UNIQUE)
export async function register(req, res, next) {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "Full Name, email ID, mobile number, and password are all required." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Email is not valid. Please enter a valid email address." });
    }

    const { valid: mobileValid, mobile: cleanMobile } = cleanAndValidateMobile(mobile);
    if (!mobileValid) {
      return res.status(400).json({ message: "Phone number is invalid. Please enter a valid telephone number." });
    }

    if (password.length < 4) {
      return res.status(400).json({ message: "Password must be at least 4 characters long." });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (existingEmail) {
      return res.status(409).json({ message: "An account with this email address already exists. Please log in." });
    }

    // Check if mobile already exists
    const existingMobile = await prisma.user.findUnique({
      where: { mobile: cleanMobile },
    });
    if (existingMobile) {
      return res.status(409).json({ message: "An account with this mobile number already exists. Please log in." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        mobile: cleanMobile,
        passwordHash,
        role: "user",
        superCoins: 50, // Welcome SuperCoins bonus!
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        superCoins: true,
      },
    });

    const token = signToken(user.id);
    return res.status(201).json({
      message: "Registration successful! Welcome to ShopZone.",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
}

// LOGIN WITH PASSWORD
export async function login(req, res, next) {
  try {
    const { identifier, email, mobile, password } = req.body;
    const loginTarget = identifier || email || mobile;

    if (!loginTarget || !password) {
      return res.status(400).json({ message: "Email/Mobile and password are required." });
    }

    const { type, value } = parseIdentifier(String(loginTarget));
    if (type === "invalid_email") {
      return res.status(400).json({ message: "Email is not valid. Please enter a valid email address." });
    }
    if (type === "invalid_mobile") {
      return res.status(400).json({ message: "Mobile number is not valid. Please enter a valid 10-digit mobile number." });
    }
    if (type === "invalid") {
      return res.status(400).json({ message: "Please provide a valid email address or 10-digit mobile number." });
    }

    const user = await prisma.user.findFirst({
      where: type === "email" ? { email: value } : { mobile: value },
    });

    if (!user) {
      return res.status(404).json({
        message: `No ShopZone account found with this ${type === "email" ? "email" : "mobile number"}. Please sign up first.`,
      });
    }

    if (!user.passwordHash) {
      return res.status(400).json({
        message: "No password has been set for this account. Please log in using OTP.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password. Please try again or request an OTP." });
    }

    const token = signToken(user.id);
    return res.json({
      message: "Logged in successfully!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        superCoins: user.superCoins,
      },
    });
  } catch (error) {
    next(error);
  }
}

// SEND OTP (WORKS FOR REGISTERED EMAIL OR MOBILE NUMBER)
export async function sendOtp(req, res, next) {
  try {
    const rawTarget = req.body.identifier || req.body.email || req.body.mobile;
    if (!rawTarget) {
      return res.status(400).json({ message: "Email ID or 10-digit mobile number is required." });
    }

    const { type, value } = parseIdentifier(String(rawTarget));

    if (type === "invalid_email") {
      return res.status(400).json({ message: "Email is not valid. Please enter a valid email address." });
    }
    if (type === "invalid_mobile") {
      return res.status(400).json({ message: "Mobile number is not valid. Please enter a valid 10-digit mobile number." });
    }
    if (type === "invalid") {
      return res.status(400).json({ message: "Please enter a valid email address or 10-digit mobile number." });
    }

    // CHECK IF USER IS REGISTERED
    let existingUser;
    if (type === "email") {
      existingUser = await prisma.user.findUnique({ where: { email: value } });
      if (!existingUser) {
        return res.status(404).json({
          message: "This email ID is not registered with ShopZone. Please create an account first.",
        });
      }
    } else {
      existingUser = await prisma.user.findUnique({ where: { mobile: value } });
      if (!existingUser) {
        return res.status(404).json({
          message: "This mobile number is not registered with ShopZone. Please create an account first.",
        });
      }
    }

    // Generate fresh OTP valid for 10 minutes
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { otp, otpExpiresAt },
    });

    // Send OTP to registered email or mobile number
    if (type === "email") {
      await sendOtpEmail(value, otp);
    } else {
      await sendOtpSms(value, otp);
    }

    const destinationText = type === "email" ? `email (${value})` : `mobile (+91 ${value})`;

    // NOTE: OTP is never returned in client JSON response to prevent exposing it in the browser!
    return res.json({
      success: true,
      message: `OTP sent successfully to your registered ${destinationText}. Please check your ${type === "email" ? "inbox or spam folder" : "messages"}.`,
      type,
      destination: value,
    });
  } catch (error) {
    next(error);
  }
}

// VERIFY OTP (WORKS FOR BOTH EMAIL AND MOBILE)
export async function verifyOtp(req, res, next) {
  try {
    const rawTarget = req.body.identifier || req.body.email || req.body.mobile;
    const { otp } = req.body;

    if (!rawTarget || !otp) {
      return res.status(400).json({ message: "Email/Mobile and 6-digit OTP are required." });
    }

    const { type, value } = parseIdentifier(String(rawTarget));
    if (type === "invalid" || type === "invalid_email" || type === "invalid_mobile") {
      return res.status(400).json({ message: "Invalid email or mobile format." });
    }

    const cleanOtp = String(otp).trim();
    const user = await prisma.user.findFirst({
      where: type === "email" ? { email: value } : { mobile: value },
    });

    if (!user) {
      return res.status(404).json({ message: "No account found. Please request a new OTP." });
    }

    if (!user.otp || user.otp !== cleanOtp) {
      return res.status(401).json({ message: "Invalid OTP. Please check and try again." });
    }

    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      return res.status(401).json({ message: "OTP has expired. Please request a new one." });
    }

    // Clear OTP after successful verification
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiresAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        superCoins: true,
      },
    });

    const token = signToken(updated.id);
    return res.json({
      message: "OTP verified successfully! Welcome to ShopZone.",
      token,
      user: updated,
    });
  } catch (error) {
    next(error);
  }
}

// GET CURRENT USER PROFILE
export async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        superCoins: true,
        createdAt: true,
        addresses: {
          orderBy: { isDefault: "desc" },
        },
        _count: {
          select: { orders: true, cartItems: true },
        },
      },
    });

    return res.json({ user });
  } catch (error) {
    next(error);
  }
}

// UPDATE USER PROFILE
export async function updateProfile(req, res, next) {
  try {
    const { name, email, mobile } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (mobile) updateData.mobile = mobile.trim();

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        superCoins: true,
      },
    });

    return res.json({ message: "Profile updated successfully.", user: updated });
  } catch (error) {
    next(error);
  }
}

// GET ADDRESSES
export async function getAddresses(req, res, next) {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return res.json({ addresses });
  } catch (error) {
    next(error);
  }
}

// ADD ADDRESS
export async function addAddress(req, res, next) {
  try {
    const { fullName, mobile, pincode, locality, address, city, state, landmark, addressType, isDefault } = req.body;

    if (!fullName || !mobile || !pincode || !address || !city || !state) {
      return res.status(400).json({ message: "Please fill in all required address fields." });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const created = await prisma.address.create({
      data: {
        userId: req.user.id,
        fullName,
        mobile,
        pincode,
        locality: locality || city,
        address,
        city,
        state,
        landmark,
        addressType: addressType || "HOME",
        isDefault: Boolean(isDefault),
      },
    });

    return res.status(201).json({ message: "Address added successfully.", address: created });
  } catch (error) {
    next(error);
  }
}

// BECOME SELLER (Switch user role to admin/seller)
export async function becomeSeller(req, res, next) {
  try {
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { role: "admin" },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        superCoins: true,
      },
    });

    const token = signToken(updated.id);
    return res.json({
      message: "Congratulations! You are now registered as a ShopZone Seller.",
      token,
      user: updated,
    });
  } catch (error) {
    next(error);
  }
}

