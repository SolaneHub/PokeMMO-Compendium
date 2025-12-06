import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import pluginReact from "eslint-plugin-react";
import pluginReactCompiler from "eslint-plugin-react-compiler";
import pluginReactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

export default defineConfig([
  globalIgnores(["dist/**"]),

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

  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

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

  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      "react-hooks": pluginReactHooks,
      "react-compiler": pluginReactCompiler,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react-compiler/react-compiler": "error",
    },
  },
]);
