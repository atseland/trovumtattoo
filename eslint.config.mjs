import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "playwright-report/**",
    "test-results/**",
    ".playwright-cli/**",
    "next-env.d.ts",
    ".claude/**",
  ]),
]);

export default eslintConfig;
