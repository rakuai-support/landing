# OmotenashiQRMaker ランディングページ改修履歴と積み残し事項

## ⚠️ **SEO ドメイン分離戦略（2025年9月1日実装完了）**

### **重要：検索エンジン対策の完全実装**

#### **✅ 実装済み設定**
```
アプリドメイン（omotenashiqr.com）：検索除外完了
├── X-Robots-Tag: "noindex, nofollow, noarchive" (Nginx設定)
├── robots.txt: "Disallow: /" (Nginx設定で動的生成)
├── sitemap.xml: 404エラー（アクセス不可）
└── 効果: すべてのページ・API・ファイルが検索対象外

LPドメイン（lp.omotenashiqr.com）：SEO最適化継続
├── robots.txt: "Allow: /" + サイトマップ指定
├── sitemap.xml: 全ページ登録済み
├── 構造化データ: 動画・事例の完全対応
└── 効果: SEO価値の完全一本化
```

#### **🎯 Google Search Console 運用方針**
```
推奨設定:
✅ lp.omotenashiqr.com プロパティ: メインSEO運用
  - サイトマップ送信継続
  - インデックス状況監視
  - パフォーマンス分析

✅ omotenashiqr.com プロパティ: 監視専用として残す
  - サイトマップ送信停止
  - noindexが機能しているか監視
  - 意図しないインデックスの早期発見
  
❌ 削除非推奨: 問題発生時の早期発見ができなくなる
```

#### **📋 既存インデックス削除手順**
```
Search Console → 削除ツール → 一時的に削除

対象URL:
- https://omotenashiqr.com/ （メインページ）
- https://omotenashiqr.com/* （プレフィックス削除）

効果: 6ヶ月間検索結果から即座に除外
備考: X-Robots-Tag設定により、自然削除も1-4週間で完了
```

#### **⚠️ 技術的背景**
```
問題の発生原因:
- Bingでリッチリザルトに外部動画リンクが表示
- SEO価値がlp.omotenashiqr.com から omotenashiqr.com に分散
- Googleでの検索結果が出ない根本原因

解決アプローチ:
1. 動画の内部ホスティング化（24本ダウンロード完了）
2. 全URLをlp.omotenashiqr.com ドメインに統一
3. アプリドメインの完全検索除外設定
4. 構造化データの復活（SEO価値最大化）
```

---

## 1. JSONデータ外部化とパス問題の解決

### 経緯
当初、`index.html` および `examples.html` で使用される動画・事例データは、JavaScriptファイル (`js/main.js`) やHTMLファイル (`examples.html`) 内に直接ハードコードされていました。これを外部JSONファイルとして管理するよう改修を依頼。

### 実施内容
- `js/main.js` から動画データを抽出し、`landing/data/videos.json` として保存。
- `examples.html` から事例データを抽出し、`landing/data/examples.json` として保存。
- `js/main.js` および `examples.html` を修正し、`fetch()` API を使用して上記JSONファイルを非同期で読み込むように変更。

### 発生した問題と解決
1.  **`TypeError: Failed to fetch` エラー (ローカルファイル直接開き)**
    - **原因:** ブラウザのセキュリティ制限により、`file://` プロトコルで開いたHTMLから `fetch()` API を使ってローカルファイルにアクセスできないため。
    - **解決:** ローカルWebサーバー (`http://localhost:5000` など) を介してアクセスするようユーザーに指示。
2.  **`404 (NOT FOUND)` エラー (JSONファイルが見つからない)**
    - **原因:** `fetch('/data/videos.json')` のようにルート相対パスで指定していたため、ローカルサーバーのドキュメントルート設定によってはパスが正しく解決されない場合があった。
    - **解決:** `fetch('data/videos.json')` のように、HTMLファイルからの相対パスに変更。
3.  **HTMLページ自体が `404 (NOT FOUND)` エラー (ページが開かない)**
    - **原因:** ユーザーのローカル環境がPython Flaskアプリケーション (`web_app.py`) で動作しており、Flaskが `landing` ディレクトリ内の静的ファイル（HTML, JSONなど）を直接提供するルート定義を持っていなかったため。本番環境ではWebサーバー（Nginxなど）がこの役割を担っているが、ローカル開発サーバーではFlask自身が処理するため、定義が必要だった。
    - **解決:** `web_app.py` に `/landing/<path:filename>` ルートを追加し、`landing` ディレクトリからファイルを配信するように修正。
        ```python
        @app.route('/landing/<path:filename>')
        def serve_landing_files(filename):
            return send_from_directory('landing', filename)
        ```

## 2. 構造化データの動的生成 (積み残し事項)

### 経緯
`index.html` の `<script type="application/ld+json">` で定義されている構造化データが、`data/videos.json` の内容と連動しておらず、手動での更新が必要な状態。

### 課題
- `data/videos.json` に動画データが追加・変更された場合、`index.html` の構造化データも手動で更新する必要がある。
- `numberOfItems` なども固定値のため、動的に更新する必要がある。

### 解決策の方向性
- Flask (`web_app.py`) の `index()` ルートで `data/videos.json` を読み込み、そのデータを `render_template` に渡す。
- `index.html` をFlaskのテンプレートエンジン (Jinja2) を使用して、構造化データ部分を動的に生成するように改修する。

## 3. JSONファイル管理画面の作成 (積み残し事項)

### 経緯
`landing/data/videos.json` および `landing/data/examples.json` の内容をWebインターフェースから編集したいという要望。

### 課題
- Webブラウザからローカルファイルシステムへの直接書き込みはセキュリティ上不可能。
- Flaskアプリケーション (`web_app.py`) に、以下の機能を追加する必要がある。
    - 管理画面用のHTMLテンプレートとルート。
    - JSONデータを読み込むAPIエンドポイント。
    - ブラウザから受け取った編集済みデータをJSONファイルに書き込むAPIエンドポイント。
    - 入力値の検証、エラーハンドリング、認証などのロジック。

### 複雑性
- これまでの修正よりもはるかに大規模で複雑な作業となる。
- 新しいWebページ（管理画面）の設計・実装、FlaskのAPI開発、ファイルI/O処理、UI/UXの構築など、多岐にわたる。
- 認証機能の追加も必要となる可能性が高い。

---
