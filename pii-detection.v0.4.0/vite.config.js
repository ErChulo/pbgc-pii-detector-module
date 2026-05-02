import { defineConfig } from "vite";

export default defineConfig({
  appType: "spa",
  server: {
    host: "127.0.0.1",
    strictPort: false
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
