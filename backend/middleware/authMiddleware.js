import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "Server misconfigured" });
  }

  try {
    const payload = jwt.verify(token, secret);
    if (!payload?.adminId) return res.status(401).json({ message: "Invalid token" });
    req.admin = payload; // { adminId, email, iat, exp }
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

