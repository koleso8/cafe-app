import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const apiTarget = process.env.VITE_PROXY_TARGET || "http://localhost:3000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // слухати на всіх інтерфейсах (для Docker/ngrok)
    // дозволяємо доступ з будь‑якого хоста (у т.ч. *.ngrok-free.app)
    allowedHosts: true,
    // Проксі для API: запити з фронта на /api → бекенд (локальний або в Docker)
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
