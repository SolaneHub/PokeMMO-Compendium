import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
  // ignora dist
  globalIgnores(["dist/**"]),

  // Regole JS di base
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Regole React
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      ...(pluginReact.configs.flat.recommended.settings || {}),
      react: {
        version: "detect",
      },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },

  // 🔚 Prettier per ultimo (disattiva regole in conflitto e aggiunge prettier/prettier)
  eslintPluginPrettierRecommended,
]);
