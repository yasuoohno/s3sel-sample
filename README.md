# Sample Code for Insight Japan 2022 Digital

郵便番号データは日本郵便株式会社様の
[郵便番号データダウンロード](https://www.post.japanpost.jp/zipcode/download.html)から
ダウンロードしたCSVファイルの、文字コードをUTF-8、改行コードをLFのみに変更したものを利用しました。

## ローカルでサーバのテスト

S3アクセスに必要な `AWS_ACCESS_KEY_ID` 及び `AWS_SECRET_ACCESS_KEY` を環境変数に設定した上で
以下を実行するとAPIサーバが起動します。

```bash
cd apiserver
npm install
npm start
```

サーバにアクセスして、S3Selectの呼び出しに成功すると、
郵便番号に対応したデータが得られます。

```console
$ curl http://localhost:8080/1040031 | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    46  100    46    0     0    342      0 --:--:-- --:--:-- --:--:--   345
[
  [
    "1040031",
    "東京都",
    "中央区",
    "京橋"
  ]
]
```

## コンテナ化とレポジトリへのアップロード

apiserverのフォルダで イメージをビルドします。
下記は `img` コマンドを使った場合の例です。

```bash
img login
img build -t ユーザ名/レポジトリ名:tag .
img push ユーザ名/レポジトリ名:tag
```

## Knative で起動

s3access.yaml内のkey pairを環境にあわせて更新し、K8sに投入します。

```bash
kubectl apply s3access.yaml
```

`kn` コマンドを使うか、`knative/Service` を作成してサービスを起動します。

```bash
kn service create s3sel-sample --image ユーザ名/レポジトリ名:tag --revision-name=1.0.0 --env-from secret:s3access
```

または

```bash
kubectl apply -f ./ksvc.yaml
```
