// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Works for both local dev + GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/autoprocv/" : "/", // 👈 very important
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
