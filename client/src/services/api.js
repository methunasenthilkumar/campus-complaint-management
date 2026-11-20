const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function api(path, options = {}) {
  const token = localStorage.getItem("campusToken");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({ message: "The server returned an invalid response" }));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export function saveSession(token, user) {
  localStorage.setItem("campusToken", token);
  localStorage.setItem("campusUser", JSON.stringify(user));
}

export function getSession() {
  const stored = localStorage.getItem("campusUser");
  return stored ? JSON.parse(stored) : null;
}

export function clearSession() {
  localStorage.removeItem("campusToken");
  localStorage.removeItem("campusUser");
}
