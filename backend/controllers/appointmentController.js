import Appointment from "../models/Appointment.js";
import Dentist from "../models/Dentist.js";

export async function createAppointment(req, res) {
  const { patientName, age, gender, appointmentDate, dentistId } = req.body || {};

  if (!patientName || age === undefined || !gender || !appointmentDate || !dentistId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const parsedAge = Number(age);
  if (!Number.isFinite(parsedAge) || parsedAge < 0 || parsedAge > 130) {
    return res.status(400).json({ message: "Invalid age" });
  }

  const dentist = await Dentist.findById(dentistId);
  if (!dentist) {
    return res.status(404).json({ message: "Dentist not found" });
  }

  const dt = new Date(appointmentDate);
  if (Number.isNaN(dt.getTime())) {
    return res.status(400).json({ message: "Invalid appointmentDate" });
  }

  const appointment = await Appointment.create({
    patientName,
    age: parsedAge,
    gender,
    appointmentDate: dt,
    dentistId: dentist._id,
    dentistName: dentist.name,
    clinicName: dentist.clinicName
  });

  res.status(201).json(appointment);
}

export async function getAppointments(req, res) {
  const appointments = await Appointment.find({}).sort({ createdAt: -1 });
  res.json(appointments);
}

export async function updateAppointmentStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body || {};

  if (!status || !["Booked", "Completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  res.json(appointment);
}

