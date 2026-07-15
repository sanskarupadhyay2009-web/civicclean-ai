import axios from "axios";

const API = axios.create({
  baseURL: "https://civicclean-ai.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      // Prevent redirect loop
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const register = (userData) =>
  API.post("/auth/register", userData);

export const login = (userData) =>
  API.post("/auth/login", userData);

export const getCurrentUser = () =>
  API.get("/auth/me");

export default API;
