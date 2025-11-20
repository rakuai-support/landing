# ブログ検証レポート（関連記事リンク・画像整合性）

最終更新: 2025-11-18 02:58:04 UTC

## 概要
`validate_blog_assets.py` を実行し、以下 2 点を機械的に確認しました。

1. 各記事の「関連記事」セクションのリンク先 HTML がリポジトリ内に存在するか。
2. `blog.html` のカードに設定されているサムネイル URL が、対応する記事ページ内のヒーロー画像 URL と一致しているか。

結果として、関連記事リンクのリンク切れは **0 件**、カード画像と記事画像の不一致が **14 件** でした。詳細は以下の一覧を参照してください。

## リンク切れの関連記事一覧
現時点でリンク切れは検出されませんでした。

## 画像の不一致一覧
| No. | 記事ファイル | blog.html カード画像 | 記事ページ画像 |
| --- | --- | --- | --- |
| 1 | blog/ecotourism-sustainable-travel-nature-experience-qr.html | https://assets.st-note.com/production/uploads/images/212271105/rectangle_large_type_2_006991b644c250906860b759a2b07c05.png?width=2000&height=2000&fit=bounds&quality=85 | https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&h=670&fit=crop&q=85 |
| 2 | blog/grandparents-day-qr-voice-message-gift.html | https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&h=500&fit=crop&q=85 | https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1280&h=670&fit=crop&q=85 |
| 3 | blog/guesthouse-minpaku-multilingual-qr-inbound.html | https://assets.st-note.com/production/uploads/images/210813252/d2034092ecb884c3288c059d04c088fa.png?width=800&height=500&fit=bounds&quality=85 | https://assets.st-note.com/production/uploads/images/210813252/d2034092ecb884c3288c059d04c088fa.png?width=1280&height=670&fit=bounds&quality=85 |
| 4 | blog/hotel-foreign-guest-checkin-multilingual-qr.html | https://assets.st-note.com/production/uploads/images/215227196/rectangle_large_type_2_1e919f3d14bbb1e80d55c05873cbfcc3.png?width=800&height=500&fit=bounds&quality=85 | https://assets.st-note.com/production/uploads/images/215227196/rectangle_large_type_2_1e919f3d14bbb1e80d55c05873cbfcc3.png?width=1280&height=670&fit=bounds&quality=85 |
| 5 | blog/medical-tourism-beauty-clinic-multilingual-counseling.html | https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=500&fit=crop&q=85 | https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1280&h=670&fit=crop&q=85 |
| 6 | blog/multigenerational-travel-family-inbound-qr.html | https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=500&fit=crop&q=85 | https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1280&h=670&fit=crop&q=85 |
| 7 | blog/muslim-friendly-tourism-halal-multilingual-qr.html | https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=500&fit=crop&q=85 | https://images.unsplash.com/photo-1544025162-d76694265947?w=1280&h=670&fit=crop&q=85 |
| 8 | blog/onsen-ryokan-bathing-manner-multilingual-qr.html | https://assets.st-note.com/production/uploads/images/210811127/rectangle_large_type_2_b85f6bb938a8c3c49b6dea24a450d9ee.png?width=800&height=500&fit=bounds&quality=85 | https://assets.st-note.com/production/uploads/images/210811127/rectangle_large_type_2_b85f6bb938a8c3c49b6dea24a450d9ee.png?width=1280&height=670&fit=bounds&quality=85 |
| 9 | blog/ramen-shop-multilingual-ticket-machine-inbound.html | https://assets.st-note.com/production/uploads/images/215228619/rectangle_large_type_2_87e13efaa6d94d69defb096889fdf3fe.png?width=800&height=500&fit=bounds&quality=85 | https://assets.st-note.com/production/uploads/images/215228619/rectangle_large_type_2_87e13efaa6d94d69defb096889fdf3fe.png?width=1280&height=670&fit=bounds&quality=85 |
| 10 | blog/restaurant-deaf-accessibility-deaflympics2025-qr.html | https://assets.st-note.com/production/uploads/images/213845723/rectangle_large_type_2_5874b295cc2b4fdf6cde2ebf3fc74581.png?width=800&height=500&fit=bounds&quality=85 | https://assets.st-note.com/production/uploads/images/213845723/rectangle_large_type_2_5874b295cc2b4fdf6cde2ebf3fc74581.png?width=1280&height=670&fit=bounds&quality=85 |
| 11 | blog/retail-restaurant-repeat-customer-qr-coupon.html | https://assets.st-note.com/production/uploads/images/211338698/rectangle_large_type_2_47a48e207582ca9d3afb1ff4e98a3d6a.png?width=800&height=500&fit=bounds&quality=85 | https://assets.st-note.com/production/uploads/images/211338698/rectangle_large_type_2_47a48e207582ca9d3afb1ff4e98a3d6a.png?width=1200&height=630&fit=bounds&quality=85 |
| 12 | blog/ryokan-hotel-ugc-guest-video-contest.html | https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop&q=85 | https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1280&h=670&fit=crop&q=85 |
| 13 | blog/sports-tourism-stadium-multilingual-qr-guide.html | https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=500&fit=crop&q=85 | https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1280&h=670&fit=crop&q=85 |
| 14 | blog/traditional-festival-matsuri-inbound-multilingual-qr.html | https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=500&fit=crop&q=85 | https://images.unsplash.com/photo-1528164344705-47542687000d?w=1280&h=670&fit=crop&q=85 |
