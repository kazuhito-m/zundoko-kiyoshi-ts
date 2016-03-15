# セットアップ

このプロジェクトを動かす(および開発する)ためのセットアップ方法を書く。

主に[このサイト](http://blog.syati.info/post/typescript_coverage/)をトレースした内容となっている。

## 前段作業

以下がすでに行われていることが前提。

- npmインストール済み


## 必要ライブラリインストール

テスト、カバレッジ、逆トランスパイル用のライブラリをインストール。

(東方ubuntu linuxなのでsudoでグローバルインストール運用)

```bash
sudo npm install -g typescript typings
sudo npm install -g mocha istanbul remap-istanbul
sudo npm install -g intelli-espower-loader power-assert
```

## 型ファイルダウンロード

```bash
typings install
```

## 番外「tsdからtypingsへ」

サンプルがtsdで型ファイル持ってこようとしてたので、typingsに置き換え。

以下のようなコマンドで `typings.json` 作った。


```bash
sudo npm install -g typings

typings init

for i in mocha power-assert power-assert-formatter empower sinon; do
  typings install ${i} --save --ambient
done

git add ./typings.json
git commit ./typings.json -m 'なんだかんだ'

```
