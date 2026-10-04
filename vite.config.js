import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `npm run dev` starts the app at http://localhost:5173 and opens it in your browser.
// The Component Anatomy Lab is at http://localhost:5173/anatomy.html
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
});
