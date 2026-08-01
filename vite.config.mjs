import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Plain ESM config (.mjs) — loaded natively by Vite without bundling,
// avoids writing temporary files that OneDrive-managed folders block.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});

