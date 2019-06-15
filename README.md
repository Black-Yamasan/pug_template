# ejs-template
テンプレートエンジン「pug」を使用したテンプレート


## バージョン

### ver. 1.0.0
基本的なテンプレートセット

#### ローカル開発用ソースのビルド

```
npm run dev
```

or 

```
yarn run dev
```

#### scssのlintチェック

```
npm run lint:style
```
  
or
  
```
yarn run lint:style
```

#### jsのtest

```
npm run test
```
  
or
  
```
yarn run test
```
  
#### 本番環境(サーバーアップ用)ソースのビルド

```
npm run prod
```

or 

```
yarn run prod
```

#### ローカル開発用のビルドと監視
##### PCディレクトリ

```
npm run start
```

or 

```
yarn run start
```

### 使い方と仕様


#### ＜使い方＞
  1. nodeとwebpackをグローバルにインストール
  2. 作業ディレクトリに移動し、コマンド「 `npm install` 」で必要なパッケージをインストール
  3. 開発用ソースのビルド「 `npx gulp build --env dev` 」
  4. コマンド「 `npx gulp` 」でローカルサーバー起動
  5. 開発が終わったら本番環境用にソースをビルド
  - htdocs/を一旦空にする「 `npx gulp clean` 」
  - 本番環境用のソースをビルド「 `npx gulp build --env prod` 」  
  ＊ htdocs/以下にminifyしたcssやjsが入ります。

#### ＜仕様＞
  * /src/site/template/pages/以下の.pugファイル、/src/styles/以下の.scssファイル、/src/scripts/以下のjsファイルを上書き保存すると、自動ビルドとブラウザリロードが始まります。  
  * /src/以下のファイルを編集すると、/src/と同じ階層に「/dist/」フォルダが自動的に生成されます。  
  * 画像ファイルは/src/site/images/内で管理。  
  ＊ サーバーにアップロードするのは/htdocs/内のファイルのみ。
