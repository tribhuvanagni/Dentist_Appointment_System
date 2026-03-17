import { useEffect, useMemo, useState } from "react";
import Loader from "./Loader";
import { fetchAppointments, updateAppointmentStatus } from "../services/api";

export default function AdminPanel() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    fetchAppointments()
      .then((data) => {
        if (!mounted) return;
        setAppointments(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message || "Failed to fetch appointments.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const rows = useMemo(() => {
    return appointments.map((a) => ({
      id: a._id,
      patientName: a.patientName,
      age: a.age,
      gender: a.gender,
      appointmentDate: a.appointmentDate,
      dentistName: a.dentistName,
      clinicName: a.clinicName,
      status: a.status || "Booked"
    }));
  }, [appointments]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Admin Panel
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          View all booked appointments.
        </p>
      </div>

      {loading ? <Loader label="Loading appointments..." /> : null}
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <Th>Patient Name</Th>
                  <Th>Age</Th>
                  <Th>Gender</Th>
                  <Th>Appointment Date</Th>
                  <Th>Dentist Name</Th>
                  <Th>Clinic Name</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-slate-600" colSpan={8}>
                      No appointments yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <Td strong>{r.patientName}</Td>
                      <Td>{r.age}</Td>
                      <Td>{r.gender}</Td>
                      <Td>{new Date(r.appointmentDate).toLocaleString()}</Td>
                      <Td>{r.dentistName}</Td>
                      <Td>{r.clinicName}</Td>
                      <Td>
                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                            r.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-800"
                          ].join(" ")}
                        >
                          {r.status}
                        </span>
                      </Td>
                      <Td>
                        {r.status === "Completed" ? (
                          <span className="text-xs font-semibold text-slate-500">*</span>
                        ) : (
                          <button
                            type="button"
                            disabled={savingId === r.id}
                            onClick={async () => {
                              setError("");
                              setSavingId(r.id);
                              try {
                                const updated = await updateAppointmentStatus(r.id, "Completed");
                                setAppointments((prev) =>
                                  prev.map((a) => (a._id === updated._id ? updated : a))
                                );
                              } catch (err) {
                                setError(err?.message || "Failed to update status.");
                              } finally {
                                setSavingId("");
                              }
                            }}
                            className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {savingId === r.id ? "Saving..." : "Mark Completed"}
                          </button>
                        )}
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Th({ children }) {
  return <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide">{children}</th>;
}

function Td({ children, strong }) {
  return (
    <td className={["whitespace-nowrap px-4 py-3", strong ? "font-medium text-slate-900" : "text-slate-700"].join(" ")}>
      {children}
    </td>
  );
}

