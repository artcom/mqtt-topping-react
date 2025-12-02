import js from "@eslint/js"
import tseslint from "typescript-eslint"
import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"
import reactRefreshPlugin from "eslint-plugin-react-refresh"
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort"
import vitestPlugin from "@vitest/eslint-plugin"
import { fixupPluginRules } from "@eslint/compat"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import globals from "globals"

/**
 * The 2025 "Golden" ESLint Configuration for React/TypeScript Libraries.
 *
 * Architecture:
 * - Format: Flat Config (ESLint v9+)
 * - Engine: TypeScript-ESLint v8+ (Strict Type-Checked Profile)
 * - Framework: React (w/ Compat Shim for Hooks), Vite Refresh
 * - Utilities: Simple Import Sort, Vitest
 */
export default tseslint.config(
  // 1. GLOBAL IGNORES
  // These must be in a standalone object to act globally.
  // Critical for preventing performance degradation on build artifacts.
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "eslint.config.js", // Ignore the config itself to avoid circular dependencies
    ],
  },

  // 2. BASE JS & TS CONFIGURATIONS
  // We extend the recommended JS rules and the STRICT TypeScript rules.
  // The 'strictTypeChecked' profile is chosen to enforce API contract safety.
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // 3. GLOBAL LANGUAGE OPTIONS
  // Configures the parser to use the TypeScript Project Service.
  // This enables high-performance type-aware linting via tsserver.
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.config.ts"],
          defaultProject: "tsconfig.json",
        },
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.es2025,
      },
    },
  },

  // 4. REACT CONFIGURATION
  // Native Flat Config support from eslint-plugin-react.
  {
    files: ["**/*.{ts,tsx}"],
    ...reactPlugin.configs.flat.recommended,
    ...reactPlugin.configs.flat["jsx-runtime"], // React 17+ JSX transform support

    settings: {
      react: {
        version: "detect", // Auto-detect React version from package.json
      },
    },
  },

  // 5. REACT HOOKS CONFIGURATION
  // Uses fixupPluginRules to bridge compatibility gaps in ESLint v9.
  // This ensures 'rules-of-hooks' runs correctly despite legacy plugin internals.
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": fixupPluginRules(reactHooksPlugin),
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      // Fatal error for rule violations; critical for React Compiler safety
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // 6. REACT REFRESH CONFIGURATION
  // Enforces HMR safety for Vite projects.
  // Applied only to JSX/TSX to avoid false positives in .ts utility files.
  {
    files: ["**/*.{tsx,jsx}"],
    plugins: {
      "react-refresh": reactRefreshPlugin,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },

  // 7. IMPORT SORTING
  // Enforces deterministic sorting of imports.
  // Runs on all JS/TS files.
  {
    plugins: {
      "simple-import-sort": simpleImportSortPlugin,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  // 8. VITEST CONFIGURATION
  // Applies testing rules only to test files.
  // Prevents testing globals from leaking into library source.
  {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      "vitest/max-nested-describe": ["error", { max: 3 }],
    },
  },

  // 9. CUSTOM RULE OVERRIDES
  // Fine-tuning the strict profile for library development.
  {
    rules: {
      // Allow unused vars if prefixed with underscore (common convention)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // Warn on non-null assertions instead of erroring, allowing for
      // specific escape hatches when the type system is too rigid.
      "@typescript-eslint/no-non-null-assertion": "warn",

      // Enforce T over Array<T> for consistency
      "@typescript-eslint/array-type": ["error", { default: "array" }],
    },
  },
  eslintConfigPrettier,
)
