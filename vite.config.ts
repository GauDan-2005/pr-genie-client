import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: process.env.VITE_BACKEND_URL, // Use process.env to access environment variables
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
