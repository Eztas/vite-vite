import { defineConfig } from "vite-plus";

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
  },
});
