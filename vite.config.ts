import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

import path from "node:path";
import { loadEnv } from "vite";
/// <reference types="vite/client" />

export default defineConfig(({ mode }) => {
  // Load env variables based on the current mode
  const env = loadEnv(mode, process.cwd(), "");

  return {
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
      __BASE_URL__: JSON.stringify(env.BASE_URL ?? "http://31.42.190.94:8080"),
      __NP_API_KEY__: JSON.stringify(env.NP_API_KEY ?? ""),
    },
  };
});
