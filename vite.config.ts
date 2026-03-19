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
      lineWidth: 40, // 1行の最大文字数
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
    rules: {
      // インポート順を強制する設定
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // node.js標準モジュール (fs, pathなど)
            "external", // 外部ライブラリ (react, viteなど)
            "internal", // プロジェクト内部のモジュール
            ["parent", "sibling"], // 親ディレクトリや同階層のファイル
            "index", // indexファイル
            "object",
            "type", // 型インポート (import type ...)
          ],
          "newlines-between": "always", // グループ間に空行を入れる
          alphabetize: { order: "asc" }, // 昇順に並べる
        },
      ],
    },
  },
  plugins: [tailwindcss()],
});
