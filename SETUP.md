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
sudo epm install -g mocha istanbul remap-istanbul
```
