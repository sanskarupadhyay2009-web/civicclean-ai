import axios from "axios";

const API = axios.create({
  baseURL: "https://civicclean-ai.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Separate instance for multipart requests (no forced JSON content-type,
// so axios can set the correct multipart/form-data boundary itself).
const UploadAPI = axios.create({
  baseURL: "https://civicclean-ai.onrender.com/api",
});

UploadAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const chatWithAI = async (message) => {
  return API.post("/ai/chat", {
    message,
  });
};

export const chatWithImage = async (message, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("message", message || "");

  return UploadAPI.post("/ai/chat-image", formData);
};

export default API;
