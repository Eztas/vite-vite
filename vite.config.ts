import { defineConfig } from "vite-plus";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/vite-vite/", // Github Pagesでのレポジトリ名
  staged: {
    "*": "vp check --fix",
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
