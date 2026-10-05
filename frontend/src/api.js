import axios from "axios";

const API = axios.create({
  baseURL: "http://13.51.106.80:3000"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;