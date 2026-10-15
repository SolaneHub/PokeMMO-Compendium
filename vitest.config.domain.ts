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
      "src/utils/idUtils.test.ts",
      "src/utils/typeUtils.test.ts",
      "src/utils/pokemonColors.test.ts",
      "src/utils/pokemonHelpers.test.ts",
      "src/utils/pokemonImageHelper.test.ts",
      "src/utils/pokedexDataExtraction.test.ts",
      "src/utils/eliteFourMembers.test.ts",
    ],
  },
});
