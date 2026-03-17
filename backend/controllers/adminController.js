import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export async function adminLogin(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const jwtSecret = process.env.JWT_SECRET || "";

  if (!jwtSecret) {
    return res.status(500).json({ message: "Server misconfigured" });
  }

  const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });
  const ok = admin ? await bcrypt.compare(String(password), admin.password) : false;
  if (!admin || !ok) return res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign(
    { adminId: String(admin._id), email: admin.email },
    jwtSecret,
    { expiresIn: "7d" }
  );

  return res.json({ token });
}

