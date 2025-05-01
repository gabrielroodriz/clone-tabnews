import pluginJs from "@eslint/js";
import next from "eslint-config-next";
import prettier from "eslint-config-prettier";
import jest from "eslint-plugin-jest";
import globals from "globals";

export default [
    {
        files: ["**/*.js", "**/*.jsx"],
        ignores: [".next", "node_modules", ".swc"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        files: ["**/*.test.js", "**/*.spec.js"],
        plugins: {
            jest,
        },
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
        rules: {
            ...jest.configs.recommended.rules,
        },
    },
    pluginJs.configs.recommended,
    next,
    prettier,
];
