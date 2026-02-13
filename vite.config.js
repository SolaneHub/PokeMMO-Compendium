import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "master-ball.png"],
      manifest: {
        name: "PokeMMO Compendium",
        short_name: "PokeMMO",
        description: "Your ultimate guide for PokéMMO strategies and data.",
        theme_color: "#1a1b20",
        background_color: "#1a1b20",
        display: "standalone",
        icons: [
          {
            src: "master-ball.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "master-ball.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  base: command === "serve" ? "/" : "/PokeMMO-Compendium/",
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1600,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
}));
