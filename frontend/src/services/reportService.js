import axios from "axios";

const API = axios.create({
  baseURL: "https://civicclean-ai.onrender.com/api",
});

// Attach JWT automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const analyzeReport = async ({ image, description, location }) => {
  const formData = new FormData();
  formData.append("image", image);

  if (description) formData.append("description", description);

  if (location) {
    if (location.latitude != null)
      formData.append("latitude", location.latitude);
    if (location.longitude != null)
      formData.append("longitude", location.longitude);
    if (location.address) formData.append("address", location.address);
    if (location.city) formData.append("city", location.city);
    if (location.state) formData.append("state", location.state);
    if (location.country) formData.append("country", location.country);
  }

  // Let the browser set the multipart/form-data boundary itself.
  return API.post("/reports/analyze", formData);
};

export default API;
