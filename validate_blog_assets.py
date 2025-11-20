"""Utility to check blog assets consistency.

This script validates two things:
1. Related article links inside blog detail pages point to existing files.
2. Images used on the blog listing cards match the hero image inside each detail page.
"""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, List, Optional, Tuple

REPO_ROOT = Path(__file__).resolve().parent
BLOG_DIR = REPO_ROOT / "blog"
BLOG_LISTING = REPO_ROOT / "blog.html"


def _attrs_to_dict(attrs: List[Tuple[str, Optional[str]]]) -> Dict[str, str]:
    return {name: (value or "") for name, value in attrs}


def _split_classes(value: str) -> List[str]:
    return [cls for cls in value.split() if cls]


class BlogCardParser(HTMLParser):
    """Extracts href/image pairs from the blog listing cards."""

    def __init__(self) -> None:
        super().__init__()
        self.cards: List[Dict[str, str]] = []
        self._inside_card = False
        self._current: Dict[str, str] = {}

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]):
        attr_dict = _attrs_to_dict(attrs)
        classes = _split_classes(attr_dict.get("class", ""))

        if tag == "article" and "blog-card" in classes:
            self._inside_card = True
            self._current = {}
            return

        if not self._inside_card:
            return

        if tag == "img" and "image_src" not in self._current:
            src = attr_dict.get("src")
            if src:
                self._current["image_src"] = src
            return

        if tag == "a" and "read-more" in classes:
            href = attr_dict.get("href")
            if href:
                self._current["href"] = href

    def handle_endtag(self, tag: str):
        if tag == "article" and self._inside_card:
            if "href" in self._current and "image_src" in self._current:
                self.cards.append(self._current)
            self._inside_card = False
            self._current = {}


class ArticleParser(HTMLParser):
    """Extracts the hero image and related links from a blog article."""

    def __init__(self) -> None:
        super().__init__()
        self.article_image_src: Optional[str] = None
        self.related_links: List[str] = []
        self._article_image_depth = 0
        self._related_depth = 0

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]):
        attr_dict = _attrs_to_dict(attrs)
        classes = _split_classes(attr_dict.get("class", ""))

        if tag == "div":
            if "article-image" in classes:
                self._article_image_depth = 1
                return
            if self._article_image_depth:
                self._article_image_depth += 1

        if tag == "aside":
            if "related-articles" in classes:
                self._related_depth = 1
                return
            if self._related_depth:
                self._related_depth += 1

        if tag == "img" and self._article_image_depth and self.article_image_src is None:
            src = attr_dict.get("src")
            if src:
                self.article_image_src = src

        if tag == "a" and self._related_depth:
            href = attr_dict.get("href")
            if href:
                self.related_links.append(href)

    def handle_endtag(self, tag: str):
        if tag == "div" and self._article_image_depth:
            self._article_image_depth -= 1
        if tag == "aside" and self._related_depth:
            self._related_depth -= 1


def load_blog_cards() -> Dict[str, str]:
    parser = BlogCardParser()
    parser.feed(BLOG_LISTING.read_text(encoding="utf-8"))
    mapping: Dict[str, str] = {}
    for card in parser.cards:
        href = card["href"].lstrip("./")
        card_path = Path(href)
        if not card_path.is_absolute():
            if card_path.parts and card_path.parts[0] != "blog":
                card_path = Path("blog") / card_path
        mapping[str(card_path)] = card["image_src"]
    return mapping


def analyze_article(path: Path) -> ArticleParser:
    parser = ArticleParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def is_internal_link(href: str) -> bool:
    href = href.strip()
    if not href or href.startswith(("http://", "https://", "mailto:", "#")):
        return False
    return True


def main() -> None:
    cards = load_blog_cards()
    broken_links: List[Tuple[str, str]] = []
    image_mismatches: List[Tuple[str, str, str]] = []

    for article_path in sorted(BLOG_DIR.glob("*.html")):
        parser = analyze_article(article_path)

        rel_path = article_path.relative_to(REPO_ROOT)
        rel_str = str(rel_path)
        card_image = cards.get(rel_str)
        article_image = parser.article_image_src

        if card_image and article_image and card_image != article_image:
            image_mismatches.append((rel_str, card_image, article_image))

        for href in parser.related_links:
            if not is_internal_link(href):
                continue
            target = (article_path.parent / href).resolve()
            try:
                rel_target = target.relative_to(REPO_ROOT)
            except ValueError:
                # Link is pointing outside the repo. Treat as broken for now.
                rel_target = Path("(outside-repo)") / href
                target_exists = False
            else:
                target_exists = target.exists()
            if not target_exists:
                broken_links.append((rel_str, str(rel_target)))

    if not broken_links:
        print("✅ No broken related article links found.")
    else:
        print("❌ Broken related article links detected:")
        for source, target in broken_links:
            print(f"  - {source} -> {target}")

    if not image_mismatches:
        print("✅ All blog card images match the article hero images.")
    else:
        print("❌ Image mismatches between blog cards and article pages:")
        for rel_str, card_image, article_image in image_mismatches:
            print(f"  - {rel_str}\n    Card:    {card_image}\n    Article: {article_image}")


if __name__ == "__main__":
    main()
