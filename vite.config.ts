import { defineConfig } from "vite-plus";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/vite-vite/", // Github Pagesでのレポジトリ名
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    options: {
      maxEmptyLines: 1,
      indentStyle: "tab", // インデントの種類（space or tab）
      indentWidth: 2, // インデントの幅
      lineWidth: 80, // 1行の最大文字数
      files: {
        insertFinalNewline: true,
      },
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {},
  },
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    include: ["src/**/*.test.ts"],
  },
  plugins: [tailwindcss()],
});
