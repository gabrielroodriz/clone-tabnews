import pluginJs from "@eslint/js";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["*"] },
  { ignores: [".next", "node_modules", ".swc"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];
