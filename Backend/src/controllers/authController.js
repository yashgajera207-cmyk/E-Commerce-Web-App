import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function registerUser(req, res) {
  const { name, email, mobile, password } = req.body;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { mobile }] },
  });

  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, mobile, passwordHash, role: "user" },
  });

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "shopzone-super-secret",
  );
  return res
    .status(201)
    .json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "shopzone-super-secret",
  );
  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
  });
}

export async function sendOtp(req, res) {
  const { mobile } = req.body;
  if (!mobile)
    return res.status(400).json({ message: "Mobile number required" });

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.user.upsert({
    where: { mobile },
    update: { otp, otpExpiresAt: expiresAt },
    create: {
      name: "Guest",
      email: `${mobile}@shopzone.local`,
      mobile,
      otp,
      otpExpiresAt: expiresAt,
    },
  });

  return res.json({ message: "OTP sent", otp });
}

export async function verifyOtp(req, res) {
  const { mobile, otp } = req.body;
  const user = await prisma.user.findUnique({ where: { mobile } });
  if (!user || !user.otp || user.otp !== otp)
    return res.status(401).json({ message: "Invalid OTP" });
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "shopzone-super-secret",
  );
  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
  });
}
