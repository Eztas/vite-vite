## dependabot

1. バージョン更新（Version Updates）
   目的: ライブラリを常に最新に保ち、負債を貯めないこと。

   仕組み: 今回作成した .github/dependabot.yml の設定に従って動きます。

   動作: 指定したスケジュール（毎週月曜など）に、「新しいバージョンが出ていないか」をチェックし、あればPRを作ります。

2. セキュリティアップデート（Security Updates）
   目的: 脆弱性（セキュリティの穴）を即座に塞ぐこと。

   仕組み: GitHubが持っている「脆弱性データベース」と、あなたのリポジトリの pnpm-lock.yaml を照合します。

   動作: スケジュールに関係なく、危険な脆弱性が見つかった瞬間に「これ危ないからこのバージョンに上げて！」とPRを投げてきます。

もし変更するべき内容があれば自動でPRを作成してくれる
さらに、CIを作っていればCIも動かして、その依存変更を取り入れても問題ないか確認してくれる

- [dependabot公式Docs](https://docs.github.com/ja/code-security/tutorials/secure-your-dependencies/dependabot-quickstart-guide#%E3%83%AA%E3%83%9D%E3%82%B8%E3%83%88%E3%83%AA%E3%81%AB%E5%AF%BE%E3%81%99%E3%82%8B-dependabot-%E3%81%AE%E6%9C%89%E5%8A%B9%E5%8C%96)
- https://www.kdkwakaba.com/articles/introduction-to-github-dependabot-in-2025
- https://qiita.com/tsuzuki_takaaki/items/2e0e13544fefd9f55611
