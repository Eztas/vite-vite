## 環境構築からデプロイまでの手順(Mac)
1. `curl -fsSL https://vite.plus | bash`でVite+をインストール
2. `vp create`で環境構築（今回は`Vite+ Application: Create vite applications`で作成）
3. `vite.config.ts`のConfigで、`base: "/<repository-name>/",`を追加
4. `.github/workflows/deploy.yml`の作成（`vp`コマンドをCIで利用するための[参考](https://github.com/voidzero-dev/setup-vp/blob/main/README.md)）
5. GithubのSettings -> PagesのBuild and deploymentでGithub Actionsを選択

## tailwindcss
従来のように初期のセットアップではtailwindcssは入らない
1. `vp install tailwindcss @tailwindcss/vite` * 警告は出るがおそらく問題ない
2. `style.css`の全文を`@import "tailwindcss";`に変更
3. `vite.config.ts`に`import tailwindcss from '@tailwindcss/vite'`と
```ts
plugins: [
    tailwindcss(),
],
```
を追加