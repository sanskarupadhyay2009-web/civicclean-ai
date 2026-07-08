import axios from "axios";

const API = axios.create({
  baseURL: "https://civicclean-ai.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const register = (userData) =>
  API.post("/auth/register", userData);

export const login = (userData) =>
  API.post("/auth/login", userData);

export const getCurrentUser = () =>
  API.get("/auth/me");

export default API;
