import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: [
      "src/pages/breeding/utils/**/*.test.ts",
      "src/pages/catch-calculator/utils/**/*.test.ts",
      "src/types/**/*.test.ts",
      "src/utils/**/*.test.ts",
      "scripts/**/*.test.ts",
      "src/test/tools/**/*.test.ts",
    ],
  },
});
