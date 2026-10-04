import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Used by `npm run solution`. Serves the finished app on port 5174 and
// shares the repo's public/ folder, so the Anatomy Lab link works here too.
export default defineConfig({
  plugins: [react()],
  publicDir: "../../public",
  server: { port: 5174, open: true },
});
