import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

import path from "node:path";
/// <reference types="vite/client" />

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      "@pages": path.resolve(__dirname, "src/pages"),
      "@store": path.resolve(__dirname, "src/app/store"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@features": path.resolve(__dirname, "src/features"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@widgets": path.resolve(__dirname, "src/widgets"),
      "@types": path.resolve(__dirname, "src/types"),
      "@entities": path.resolve(__dirname, "src/entities"),
    },
  },
  define: {

    __BASE_URL__: JSON.stringify(
      process.env.BASE_URL ?? "http://31.42.190.94:8080"
    ),
   //   __BASE_URL__: JSON.stringify("http://localhost:8080"),

    __NP_API_KEY__: JSON.stringify("7dfd5d6f925fb348715f4ae2c97b7949"),

    //    __BASE_URL__: JSON.stringify(process.env.BASE_URL ??  "http://localhost:8080" ),
  },
});
