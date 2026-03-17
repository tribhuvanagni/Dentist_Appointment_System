import { useEffect, useMemo, useState } from "react";
import DentistCard from "./DentistCard";
import Loader from "./Loader";
import BookAppointment from "./BookAppointment";
import { fetchDentistsPaged } from "../services/api";

const PAGE_SIZE = 6;

export default function DentistList({ onToast }) {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const effectiveSearch = useMemo(() => search.trim(), [search]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    fetchDentistsPaged({ search: effectiveSearch, page: currentPage, limit: PAGE_SIZE })
      .then((data) => {
        if (!mounted) return;
        setDentists(Array.isArray(data?.dentists) ? data.dentists : []);
        setCurrentPage(Number(data?.currentPage || 1));
        setTotalPages(Number(data?.totalPages || 1));
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message || "Failed to fetch dentists.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [effectiveSearch, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [effectiveSearch]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Find a Dentist
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse dentists and book an appointment in seconds.
          </p>
        </div>

        <div className="w-full sm:w-80">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, clinic, location..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
          </label>
        </div>
      </div>

      {loading ? <Loader label="Loading dentists..." /> : null}
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {!loading && !error && dentists.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600">
          No dentists found. Try a different search.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {dentists.map((d) => (
          <DentistCard key={d._id} dentist={d} onBook={setSelectedDentist} />
        ))}
      </div>

      {!loading && !error && totalPages > 1 ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <PageButton
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </PageButton>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PageButton
              key={p}
              active={p === currentPage}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </PageButton>
          ))}
          <PageButton
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </PageButton>
        </div>
      ) : null}

      {selectedDentist ? (
        <BookAppointment
          dentist={selectedDentist}
          onClose={() => setSelectedDentist(null)}
          onBooked={(appt) => {
            setSelectedDentist(null);
            onToast?.({
              variant: "success",
              title: "Appointment booked",
              message: `Booked for ${appt.patientName} with ${appt.dentistName} on ${new Date(
                appt.appointmentDate
              ).toLocaleDateString()}.`
            });
          }}
          onToast={onToast}
        />
      ) : null}
    </div>
  );
}

function PageButton({ children, onClick, disabled, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-xl px-3 py-2 text-sm font-semibold transition",
        active ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-100",
        "border border-slate-200",
        disabled ? "cursor-not-allowed opacity-50 hover:bg-white" : ""
      ].join(" ")}
    >
      {children}
    </button>
  );
}

