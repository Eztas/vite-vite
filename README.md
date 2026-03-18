# vite-vite

## 手順(Mac)
1. `curl -fsSL https://vite.plus | bash`でVite+をインストール
2. `vp create`で環境構築（今回は`Vite+ Application: Create vite applications`で作成）
3. `vite.config.ts`のConfigで、`base: "/<repository-name>/",`を追加
4. `.github/workflows/deploy.yml`の作成（`vp`コマンドをCIで利用するための[参考](https://github.com/voidzero-dev/setup-vp/blob/main/README.md)）
5. GithubのSettings -> PagesのBuild and deploymentでGithub Actionsを選択

## 参考文献
- [【Alpha版】Vite+ を試してみる！【VoidZero帝国】](https://zenn.dev/hiruno_tarte/articles/vite-plus-alpha)
- [Announcing Vite+ Alpha](https://voidzero.dev/posts/announcing-vite-plus-alpha)
- [CI用のGithub公式](https://github.com/voidzero-dev/setup-vp)

2026/03/18から作成
