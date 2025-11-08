#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ブログ記事の関連記事セクションに画像を追加するスクリプト
"""

import re
import os
from pathlib import Path

# 各HTMLファイルから画像情報を抽出
def extract_article_images_from_files():
    """blog/フォルダ内の各HTMLファイルからアイキャッチ画像を抽出"""
    blog_dir = Path("blog")
    article_map = {}

    for html_file in blog_dir.glob("*.html"):
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # アイキャッチ画像を探す（<div class="article-image">内のimg src）
        image_pattern = r'<div class="article-image">.*?<img src="(.*?)"'
        match = re.search(image_pattern, content, re.DOTALL)

        if match:
            image_url = match.group(1)
            # 画像URLのサイズを400x250に変更
            image_url = re.sub(r'w=\d+&h=\d+', 'w=400&h=250', image_url)
            article_map[html_file.name] = image_url
        else:
            # アイキャッチ画像が見つからない場合は、og:imageから取得
            og_pattern = r'<meta property="og:image" content="(.*?)"'
            og_match = re.search(og_pattern, content)
            if og_match:
                image_url = og_match.group(1)
                # Unsplash URLならサイズを変更
                if 'unsplash.com' in image_url:
                    image_url = re.sub(r'w=\d+&h=\d+', 'w=400&h=250', image_url)
                    if 'w=' not in image_url:
                        image_url += '?w=400&h=250&fit=crop'
                article_map[html_file.name] = image_url

    return article_map

# 関連記事のHTMLを画像付きに変換
def update_related_article_link(link_html, article_map):
    """関連記事リンクを画像付きに変換（既存の画像も正しいものに置き換え）"""
    # ファイル名を抽出
    href_match = re.search(r'href="(.*?\.html)"', link_html)
    if not href_match:
        return link_html

    filename = href_match.group(1)

    # h3タグの内容を抽出（画像より前にある場合と後にある場合の両方に対応）
    h3_match = re.search(r'<h3>(.*?)</h3>', link_html, re.DOTALL)
    if not h3_match:
        # pタグがある場合も考慮（古い形式）
        p_match = re.search(r'<p>(.*?)</p>', link_html, re.DOTALL)
        if p_match:
            title = p_match.group(1).strip()
        else:
            return link_html
    else:
        title = h3_match.group(1).strip()

    # 画像URLを取得
    image_url = article_map.get(filename)

    if not image_url:
        print(f"      [WARN] No image found for: {filename}")
        image_url = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop'

    # 新しいHTMLを生成（常に同じフォーマット）
    new_html = f'''<a href="{filename}" class="related-card">
                    <img src="{image_url}" alt="{title}" loading="lazy">
                    <h3>{title}</h3>
                </a>'''

    return new_html

# 個別記事ファイルの関連記事セクションを更新
def update_article_file(filepath, article_map):
    """個別記事ファイルの関連記事セクションを画像付きに更新"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 関連記事セクションを探す
    related_section_pattern = r'<!-- 関連記事 -->(.*?)</aside>'
    related_match = re.search(related_section_pattern, content, re.DOTALL)

    if not related_match:
        print(f"  [WARN] No related section found: {filepath.name}")
        return False

    old_section = related_match.group(1)

    # 各関連記事リンクを抽出して更新（画像あり/なし両方対応）
    link_pattern = r'<a href="(.*?\.html)" class="related-card">(.*?)</a>'

    def replace_link(match):
        full_link = match.group(0)
        return update_related_article_link(full_link, article_map)

    new_section = re.sub(link_pattern, replace_link, old_section, flags=re.DOTALL)

    # 元のファイルの関連記事セクション全体を置換
    new_content = content.replace(old_section, new_section)

    # ファイルに書き込み
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"  [OK] Updated: {filepath.name}")
    return True

def main():
    """メイン処理"""
    print("=" * 60)
    print("Blog article related section image update script")
    print("=" * 60)

    # 記事情報を抽出
    print("\n[1/3] Extracting article images from HTML files...")
    article_map = extract_article_images_from_files()
    print(f"      Found {len(article_map)} articles with images\n")

    # blogフォルダ内の全HTMLファイルを処理
    blog_dir = Path("blog")
    html_files = list(blog_dir.glob("*.html"))

    print(f"[2/3] Processing {len(html_files)} files...\n")

    updated_count = 0
    skipped_count = 0

    for filepath in sorted(html_files):
        if update_article_file(filepath, article_map):
            updated_count += 1
        else:
            skipped_count += 1

    print("\n" + "=" * 60)
    print(f"[3/3] Complete: {updated_count} updated, {skipped_count} skipped")
    print("=" * 60)

if __name__ == "__main__":
    main()
