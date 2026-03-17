import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0, max: 130 },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    appointmentDate: { type: Date, required: true },
    dentistId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Dentist" },
    dentistName: { type: String, required: true, trim: true },
    clinicName: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Booked", "Completed"], default: "Booked" }
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);

