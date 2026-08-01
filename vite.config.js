import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Exposed on the LAN so the mobile keypad path can be tested on a real phone.
    host: "0.0.0.0",
  },
});
