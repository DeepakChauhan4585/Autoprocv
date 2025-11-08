// vite.config.js
import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Auto base fix (works for both local + GitHub Pages)
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/autoprocv/" : "/", 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
