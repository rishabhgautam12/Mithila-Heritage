const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function getToken() {
  return localStorage.getItem("mh_admin_token");
}
export function setToken(t) {
  localStorage.setItem("mh_admin_token", t);
}
export function clearToken() {
  localStorage.removeItem("mh_admin_token");
}

export function getCustToken() {
  return localStorage.getItem("mh_cust_token");
}
export function setCustToken(t) {
  localStorage.setItem("mh_cust_token", t);
}
export function clearCustToken() {
  localStorage.removeItem("mh_cust_token");
}

async function request(path, { method = "GET", body, auth = false, custAuth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  if (custAuth) headers.Authorization = `Bearer ${getCustToken()}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth) clearToken();
    if (res.status === 401 && custAuth) clearCustToken();
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export const api = {
  createBooking: (payload) =>
    request("/api/bookings", { method: "POST", body: payload, custAuth: !!getCustToken() }),
  custRequestOtp: (identifier) =>
    request("/api/customer/request-otp", { method: "POST", body: { identifier } }),
  custVerifyOtp: (identifier, otp) =>
    request("/api/customer/verify-otp", { method: "POST", body: { identifier, otp } }),
  custMe: () => request("/api/customer/me", { custAuth: true }),
  custUpdateName: (name) =>
    request("/api/customer/me", { method: "PATCH", body: { name }, custAuth: true }),
  custRequestUpdate: (payload) =>
    request("/api/customer/request-update", { method: "POST", body: payload, custAuth: true }),
  custConfirmUpdate: (otp) =>
    request("/api/customer/confirm-update", { method: "POST", body: { otp }, custAuth: true }),
  verifyPayment: (payload) => request("/api/payments/verify", { method: "POST", body: payload }),
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: { email, password } }),
  getBookings: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== "" && v != null)
    ).toString();
    return request(`/api/bookings${qs ? `?${qs}` : ""}`, { auth: true });
  },
  updateStatus: (id, status, cancelReason = "") =>
    request(`/api/bookings/${id}/status`, { method: "PATCH", body: { status, cancelReason }, auth: true }),
  getDashboard: () => request("/api/bookings/dashboard", { auth: true }),
  adminCreateBooking: (payload) =>
    request("/api/bookings/admin", { method: "POST", body: payload, auth: true }),
  getCustomers: (search = "") =>
    request(`/api/customers${search ? `?search=${encodeURIComponent(search)}` : ""}`, { auth: true }),
  getCustomer: (email) => request(`/api/customers/${encodeURIComponent(email)}`, { auth: true }),
  getMe: () => request("/api/auth/me", { auth: true }),
  requestCredentialChange: () => request("/api/auth/request-change", { method: "POST", auth: true }),
  confirmCredentialChange: (payload) =>
    request("/api/auth/confirm-change", { method: "POST", body: payload, auth: true }),
  deleteBooking: (id) => request(`/api/bookings/${id}`, { method: "DELETE", auth: true }),
  getAvailability: (year, month) => request(`/api/availability?year=${year}&month=${month}`),
  saveAdjustment: (payload) =>
    request("/api/availability/adjustment", { method: "PUT", body: payload, auth: true }),
  setAvailabilityAdjustment: (payload) =>
    request("/api/availability/adjust", { method: "PUT", body: payload, auth: true }),
};
