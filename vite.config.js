import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// host + allowedHosts let Replit's preview pane reach the dev server
export default defineConfig({
  plugins: [react()],
  server: { host: "0.0.0.0", port: 5173, allowedHosts: true },
  preview: { host: "0.0.0.0", port: 5173, allowedHosts: true },
});
