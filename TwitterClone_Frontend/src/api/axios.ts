import axios from "axios";

// Create a single axios instance that all API calls use
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: automatically attach the JWT token to every request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("authUser");
  if (stored) {
    const parsed = JSON.parse(stored);
    // Backend expects: Authorization: Bearer <token>
    config.headers["Authorization"] = `Bearer ${parsed.token}`;
  }
  return config;
});

export default api;
