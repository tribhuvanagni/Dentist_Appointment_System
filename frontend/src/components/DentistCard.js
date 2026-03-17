export default function DentistCard({ dentist, onBook }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={dentist.photo}
          alt={dentist.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{dentist.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{dentist.qualification}</p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            {dentist.experience} yrs
          </span>
        </div>

        <div className="mt-3 space-y-1 text-sm text-slate-700">
          <p className="font-medium text-slate-900">{dentist.clinicName}</p>
          <p className="text-slate-600">{dentist.address}</p>
          <p className="text-slate-600">
            <span className="font-medium text-slate-700">Location:</span> {dentist.location}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onBook(dentist)}
          className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}

