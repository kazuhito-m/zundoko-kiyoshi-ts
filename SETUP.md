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
```

## 必要ライブラリインストール＆型ファイルダウンロード

```bash
npm install 
```

## テスト＆カバレッジ実行

上記の準備ができたら、まずビルド。

```bash
tsc
```

次に、テスト実行。

```bash
mocha src/test/*.test.js
```

これでOKのようなら、カバレッジを取ることも可能。

```bash
istanbul cover _mocha -- src/test/*.test.js
cd coverage && remap-istanbul -i coverage.json -o html-report -t html
```

終わると、converage ディレクトリができていて、そこに結果がHTMLで貯まる。

## …を、便利にやってくれるタスクを定義

上記の一連の`tsd`,`mocha`,`istanbul` を一撃でやってくれるタスクを用意しています。

```bash
npm test
```

これで、テストがコケないソースであれば、カバレッジまで持ってってくれます。s

---

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

## 作業中にお世話になったサイト一覧

+ http://qiita.com/wadahiro/items/5d8a81252f2105112339
+ http://qiita.com/phi/items/9fcca3e7af5d25ff2653
+ https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import
+ http://qiita.com/gitseitanaka/items/ea47d261284879a1d774
+ http://hblog.glamenv-septzen.info/entry/2015/03/22/233241

### gulp周り

+ http://qiita.com/Jxck_/items/efaff21b977ddc782971
+ http://qiita.com/morou/items/d54000396a2a7d0714de
+ http://creator.aainc.co.jp/archives/6649
+ http://qiita.com/yuichiroharai/items/42e559e2c15e1e5ffa39
+ http://qiita.com/nogson/items/fbcd0602871aeddabe33
+ http://qiita.com/iguchi1124/items/3830877d190ab72e3a1b
+ http://qiita.com/iwata-n@github/items/1e8f629eb5b429a49e6d
+ http://hideack.hatenablog.com/entry/2014/10/04/195322
+ https://github.com/SitePen/remap-istanbul/wiki/Using-Gulp
+ https://www.npmjs.com/package/remap-istanbul
+ http://qiita.com/progre/items/37e632123d74145bf0c2
+ http://blog.anatoo.jp/entry/20140420/1397995711
+ http://qiita.com/shinnn/items/bd7ad79526eff37cebd0
+ http://akabeko.me/blog/2015/01/gulp-copy-keep-dir-structure/
+ http://yaakaito.org/blog/2013/03/24/test-driven-typescript/
+ https://www.npmjs.com/package/gulp-sourcemaps
+ https://github.com/SBoudrias/gulp-istanbul
+ https://www.npmjs.com/package/gulp-git
+ http://horicdesign.com/js/entry-146.html
+ http://dackdive.hateblo.jp/entry/2014/09/15/155641

### WerckerCIまわり

+ http://rcmdnk.github.io/blog/2015/02/25/blog-octopress/
