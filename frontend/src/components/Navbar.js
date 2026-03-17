import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminAuthed = Boolean(localStorage.getItem("adminToken"));

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          className="flex items-center gap-2 font-semibold tracking-tight text-slate-900"
          to="/"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            DA
          </span>
          <span className="hidden sm:block">Dentist Appointment</span>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLinkButton active={location.pathname === "/"} to="/">
            Dentists
          </NavLinkButton>
          <NavLinkButton active={location.pathname.startsWith("/admin")} to="/admin">
            Admin
          </NavLinkButton>
          {isAdminAuthed ? (
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("adminToken");
                navigate("/admin/login");
              }}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

function NavLinkButton({ active, to, children }) {
  return (
    <Link
      to={to}
      className={[
        "rounded-xl px-3 py-2 text-sm font-medium transition",
        active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

