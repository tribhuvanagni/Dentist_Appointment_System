import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import DentistList from "./components/DentistList";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import Toast from "./components/Toast";

function App() {
  const [toast, setToast] = useState(null);
  const location = useLocation();
  const toastKey = useMemo(() => `${toast?.title || ""}:${toast?.message || ""}:${toast?.variant || ""}`, [toast]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), toast.durationMs || 3500);
    return () => clearTimeout(t);
  }, [toastKey, toast]);

  return (
    <div className="min-h-full">
      <Navbar key={location.pathname} />
      <main>
        <Routes>
          <Route path="/" element={<DentistList onToast={setToast} />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
