import axios from "axios";

// У дев-режимі ходимо від фронта на відносний шлях `/api`,
// Vite проксить його на потрібний бекенд (див. vite.config.ts).
// У проді можна перекрити базовий URL через VITE_API_URL.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
