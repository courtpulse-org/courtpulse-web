import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

/**
 * ESLint configuration for the Vite + React apps. Errors are real errors here
 * (unlike the library config), because an app is where `pnpm lint` must fail
 * the build.
 *
 * @type {import("eslint").Linter.Config[]} */
export const config = tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "error",
      "react-refresh/only-export-components": "off",
    },
  },
]);
