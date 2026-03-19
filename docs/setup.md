## 環境構築からデプロイまでの手順(Mac)

1. `curl -fsSL https://vite.plus | bash`でVite+をインストール
2. `vp create`で環境構築（今回は`Vite+ Application: Create vite applications`で作成）
3. `vite.config.ts`のConfigで、`base: "/<repository-name>/",`を追加
4. `.github/workflows/deploy.yml`の作成（`vp`コマンドをCIで利用するための[参考](https://github.com/voidzero-dev/setup-vp/blob/main/README.md)）
5. GithubのSettings -> PagesのBuild and deploymentでGithub Actionsを選択

## tailwindcss

従来のように初期のセットアップではtailwindcssは入らない

1. `vp install tailwindcss @tailwindcss/vite` \* 警告は出るがおそらく問題ない
2. `style.css`の全文を`@import "tailwindcss";`に変更
3. `vite.config.ts`に`import tailwindcss from '@tailwindcss/vite'`と

```ts
plugins: [
    tailwindcss(),
],
```

を追加

## vp check

インストールするだけでlinterとformatterが既に作られている

さらに、`tsconfig.json`と`vite.config.ts`を修正するだけで良い

Oxlint（リント）、Oxfmt（フォーマット）、型チェック、pre-commit hook

- [`oxfmt`によるフォーマット](https://viteplus.dev/guide/fmt)
- [`oxlint`によるリント](https://viteplus.dev/guide/lint)
- `tsgolint`による type-aware なリント (ついでに型チェック)

### フォーマッター

初期状態で既にある[Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)により実装されている

コードの見た目(TypeScriptに関する設定ではない)なので、`vite.config.ts`で主に設定

### リンター

初期状態で既に存在するリンターを組み合わせて利用されている

`oxlint`により未使用変数などの一般的なものを設定せずにそのまま利用できる

ここにさらに`vite.config.ts`で設定されたリンター、Goで書かれている`tsgolint`もある

- `typeAware: true`: Promiseにawaitやcatchを使っているかなどの細かい厳格な型推論
- `typeCheck: true`: Linterはファイル単体を見るが、これを有効にすることで「別ファイルで型が変わったことによるエラー」もチェック

TypeScript由来の[lint](https://www.typescriptlang.org/tsconfig/)は`tsconfig.json`、
JavaScriptでも必要なlint設定は`vite.config.ts`で行うイメージ

## vpのコマンド

Next.jsも`vp create create-next-app `で作れる

参考:[新登場したVite+が速すぎる！— ESLint 100倍、しかも Next.js でも動く](https://zenn.dev/ashunar0/articles/26d33059997e38)
