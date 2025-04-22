import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { tempo } from "tempo-devtools/dist/vite"; // Add tempo import

// Load environment variables from .env files
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tempo()], // Add tempo plugin
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
    // proxy: {
    //   "/auth": {
    //     target: process.env.VITE_BACKEND_URL,
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
});
