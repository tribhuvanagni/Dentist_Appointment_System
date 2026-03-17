const DEFAULT_HEADERS = {
  "Content-Type": "application/json"
};

const API_BASE = process.env.REACT_APP_API_URL || "";

async function request(path, options = {}) {
  const token = localStorage.getItem("adminToken");
  const authHeader =
    token && options.auth === "admin" ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...authHeader,
      ...(options.headers || {})
    }
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const message =
      (body && typeof body === "object" && body.message) ||
      (typeof body === "string" && body) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}

export function fetchDentists({ search } = {}) {
  const qs = search ? `?search=${encodeURIComponent(search)}` : "";
  return request(`/api/dentists${qs}`);
}

export function fetchDentistsPaged({ search, page = 1, limit = 6 } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  params.set("page", String(page));
  params.set("limit", String(limit));
  return request(`/api/dentists?${params.toString()}`);
}

export function createAppointment(payload) {
  return request("/api/appointments", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchAppointments() {
  return request("/api/appointments", { auth: "admin" });
}

export function updateAppointmentStatus(id, status) {
  return request(`/api/appointments/${encodeURIComponent(id)}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
    auth: "admin"
  });
}

export function adminLogin({ email, password }) {
  return request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

