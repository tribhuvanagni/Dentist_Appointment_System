import express from "express";
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus
} from "../controllers/appointmentController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", requireAdmin, getAppointments);
router.put("/:id/status", requireAdmin, updateAppointmentStatus);

export default router;

