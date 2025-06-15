import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import pluginPromise from "eslint-plugin-promise";
export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.node },
  },
  { ignores: [".node_modules/*", "./generated/*", "./prisma/*"] },

  js.configs.recommended,
  tseslint.configs.recommended,
  pluginPromise.configs["flat/recommended"]
]);
