import { defineConfig } from "vite-plus";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "/vite-vite/", // Github Pagesでのレポジトリ名
  staged: {
    "*": "vp check --fix",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [
    tailwindcss(),
  ],
});
