import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "ec65bcff-2c4f-4a35-a914-3590af0d5464-00-2n1ylc803f741.sisko.replit.dev",
      ".replit.dev"
    ]
  },
  css: {
    postcss: "./postcss.config.js",
  },
});
