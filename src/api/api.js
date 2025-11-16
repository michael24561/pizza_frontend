// src/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 👈 Importante para sesiones/cookies si tu backend las usa
});

// Agregar token automáticamente a cada request (si existe)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Token ${token}`; 
    // 👆 IMPORTANTE: Porque tu backend usa TokenAuth de DRF
  }

  return config;
});

export default api;
