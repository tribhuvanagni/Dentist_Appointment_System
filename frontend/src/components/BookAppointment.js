import { useMemo, useState } from "react";
import { createAppointment } from "../services/api";

const GENDERS = ["Male", "Female", "Other"];

export default function BookAppointment({ dentist, onClose, onBooked }) {
  const minDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }, []);

  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [appointmentDate, setAppointmentDate] = useState(minDate);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const trimmedName = patientName.trim();
    const parsedAge = Number(age);
    const nextErrors = {};

    if (!trimmedName) nextErrors.patientName = "Patient name is required.";
    else if (trimmedName.length < 3) nextErrors.patientName = "Minimum 3 characters.";

    if (!age) nextErrors.age = "Age is required.";
    else if (!Number.isFinite(parsedAge)) nextErrors.age = "Age must be a number.";
    else if (parsedAge < 1 || parsedAge > 120) nextErrors.age = "Age must be between 1 and 120.";

    if (!gender || !GENDERS.includes(gender)) nextErrors.gender = "Gender is required.";

    if (!appointmentDate) nextErrors.appointmentDate = "Appointment date is required.";
    else {
      const dt = new Date(appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dt.setHours(0, 0, 0, 0);
      if (Number.isNaN(dt.getTime())) nextErrors.appointmentDate = "Invalid date.";
      else if (dt < today) nextErrors.appointmentDate = "Date cannot be in the past.";
    }

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        patientName: trimmedName,
        age: parsedAge,
        gender,
        appointmentDate,
        dentistId: dentist._id
      };
      const created = await createAppointment(payload);
      onBooked?.(created);
    } catch (err) {
      setError(err?.message || "Failed to book appointment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Book Appointment</h2>
            <p className="mt-1 text-sm text-slate-600">
              {dentist.name} • {dentist.clinicName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-5">
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <Field label="Patient Name">
            <input
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Enter full name"
              autoFocus
            />
            {fieldErrors.patientName ? (
              <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.patientName}</p>
            ) : null}
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Age">
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="e.g., 28"
                inputMode="numeric"
              />
              {fieldErrors.age ? (
                <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.age}</p>
              ) : null}
            </Field>

            <Field label="Gender">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {fieldErrors.gender ? (
                <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.gender}</p>
              ) : null}
            </Field>
          </div>

          <Field label="Appointment Date">
            <input
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              type="date"
              min={minDate}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
            {fieldErrors.appointmentDate ? (
              <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.appointmentDate}</p>
            ) : null}
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

