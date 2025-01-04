import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
        rewrite: path => path,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.error("Erreur proxy:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Requête envoyée au backend:", {
              method: req.method,
              path: proxyReq.path,
              headers: req.headers
            });
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("Réponse reçue du backend:", {
              statusCode: proxyRes.statusCode,
              url: req.url,
              headers: proxyRes.headers
            });
          });
        }
      }
    }
  }
});