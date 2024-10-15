import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Load environment variables from .env files
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: process.env.VITE_BACKEND_URL, // Access the backend URL
        changeOrigin: true, // Change origin to match the backend server
        secure: false, // Not needed unless using self-signed certificates
        cookieDomainRewrite: "", // Optional: rewrite domain to handle cookies
        cookiePathRewrite: "/", // Optional: rewrite path for cookies
      },
    },
  },
});
