import ember from "eslint-plugin-ember";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "blueprints/*/files/",
      "dist/",
      "coverage/",
      "config/*",
      "!**/.*",
      "**/.*/",
      ".node_modules.ember-try/",
      ".prettierrc.js",
      ".stylelintrc.js",
      ".template-lintrc.js",
      "ember-cli-build.js",
      "testem.js",
    ],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:ember/recommended",
    "plugin:prettier/recommended",
  ),
  {
    plugins: {
      ember,
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "script",
    },

    rules: {},
  },
  ...compat
    .extends(
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
    )
    .map((config) => ({
      ...config,
      files: ["**/*.ts"],
    })),
  {
    files: ["**/*.ts"],
    rules: {},
  },
  ...compat.extends("plugin:n/recommended").map((config) => ({
    ...config,

    files: [
      "./.eslintrc.js",
      "./.prettierrc.js",
      "./.stylelintrc.js",
      "./.template-lintrc.js",
      "./ember-cli-build.js",
      "./testem.js",
      "./blueprints/*/index.js",
      "./config/**/*.js",
      "./lib/*/index.js",
      "./server/**/*.js",
    ],
  })),
  {
    files: [
      "./.eslintrc.js",
      "./.prettierrc.js",
      "./.stylelintrc.js",
      "./.template-lintrc.js",
      "./ember-cli-build.js",
      "./testem.js",
      "./blueprints/*/index.js",
      "./config/**/*.js",
      "./lib/*/index.js",
      "./server/**/*.js",
    ],

    languageOptions: {
      globals: {
        ...Object.fromEntries(
          Object.entries(globals.browser).map(([key]) => [key, "off"]),
        ),
        ...globals.node,
      },
    },
  },
  ...compat.extends("plugin:qunit/recommended").map((config) => ({
    ...config,
    files: ["tests/**/*-test.{js,ts}"],
  })),
];
