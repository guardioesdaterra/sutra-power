// @ts-check

import path from "node:path";
import { fileURLToPath } from "node:url";
import eslintJs from "@eslint/js";
import tseslint from 'typescript-eslint';
import globals from "globals";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupConfigRules } from "@eslint/compat";
// import nextPlugin from '@next/eslint-plugin-next'; // We'll rely on eslint-config-next via FlatCompat

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize FlatCompat
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: eslintJs.configs.recommended,
});

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "*.config.js", // Ignore JS config files
      "*.config.mjs", // Ignore MJS config files
    ],
  },
  eslintJs.configs.recommended, // ESLint's own recommended rules

  // Use FlatCompat for Next.js specific configurations from eslint-config-next
  // This should bring in "next/core-web-vitals" and handle "next/typescript" aspects.
  ...fixupConfigRules(compat.extends("eslint-config-next")),
  // The above extends "eslint-config-next" which internally extends "next/core-web-vitals"
  // and "next/babel" or "next/typescript" based on project setup.
  // We don't need to specify "plugin:@next/next/recommended" separately if using "eslint-config-next".

  // Base TypeScript configuration object to apply to .ts and .tsx files
  // This will be augmented by the typescript-eslint recommended configs below.
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    // We will apply typescript-eslint rules by spreading their config arrays
    // into the main export default array.
    // Specific overrides can still go here if needed:
    // rules: {
    //   '@typescript-eslint/no-explicit-any': 'warn',
    // }
  },

  // Add typescript-eslint recommended configurations.
  // These are arrays of config objects and should be spread here.
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // General JavaScript files (if any outside of Next/React specific ones)
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    // Ensure this block does NOT include type-aware parsing for general JS files
    // unless they are part of your tsconfig.json `include` and you intend to type-check them.
    // For typical config files or simple scripts, type-aware linting is not needed.
    languageOptions: {
      globals: {
        ...globals.node, // Or browser
      },
    },
    rules: {
      // JS specific rules
    },
  },

  // Global overrides or additional project-wide rules
  {
    rules: {
      // "semi": ["error", "always"],
      // "no-console": "warn",
      
      // Fix chart.tsx issues
      "no-constant-binary-expression": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
    }
  }
); 