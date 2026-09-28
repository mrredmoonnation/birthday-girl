import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/birthday-girl/",
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: false,
    watch: {
      ignored: ["**/photo komal/**", "**/priyanshu/**"],
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    strictPort: false,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
});
