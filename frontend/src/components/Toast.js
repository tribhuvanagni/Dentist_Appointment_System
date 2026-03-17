export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const variantStyles =
    toast.variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : toast.variant === "error"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-slate-200 bg-white text-slate-800";

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 w-[min(420px,calc(100vw-2rem))]">
      <div
        className={[
          "pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg",
          variantStyles
        ].join(" ")}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">{toast.title || "Notice"}</div>
            {toast.message ? (
              <div className="mt-1 text-sm opacity-90">{toast.message}</div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-2 py-1 text-sm font-semibold hover:bg-black/5"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

