import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import bcrypt from "bcryptjs";

import { connectDB } from "./config/db.js";
import dentistRoutes from "./routes/dentistRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import Admin from "./models/Admin.js";

dotenv.config({ path: new URL("./.env", import.meta.url) });

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Allow non-browser clients (curl, server-to-server) with no Origin header.
      if (!origin) return cb(null, true);
      // If no allowlist is configured, behave permissively (useful for early dev).
      if (allowedOrigins.length === 0) return cb(null, true);
      return cb(null, allowedOrigins.includes(origin));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "dentist-appointment-backend" });
});

app.use("/api/dentists", dentistRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err?.statusCode || 500;
  res.status(status).json({
    message: err?.message || "Server error"
  });
});

const port = Number(process.env.PORT || 5000);

await connectDB();
await ensureDefaultAdmin();
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

async function ensureDefaultAdmin() {
  const existing = await Admin.findOne({});
  if (existing) return;

  const email = "admin@clinic.com";
  const password = "Admin@123";
  const hash = await bcrypt.hash(password, 10);

  await Admin.create({ email, password: hash });
  console.log(`Default admin created: ${email}`);
}

