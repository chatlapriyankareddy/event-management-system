import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const baseURL = configuredBaseUrl
  ? configuredBaseUrl.replace(/\/+$/, "")
  : import.meta.env.DEV
    ? "http://localhost:8082"
    : undefined;

if (!baseURL && import.meta.env.PROD) {
  console.warn("VITE_API_BASE_URL is not configured; API requests will use the current origin.");
}

const API = axios.create({
  baseURL,
});

// Attach JWT token automatically if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
