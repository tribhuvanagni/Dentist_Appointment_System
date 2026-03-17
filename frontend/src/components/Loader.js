export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 py-6">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}

