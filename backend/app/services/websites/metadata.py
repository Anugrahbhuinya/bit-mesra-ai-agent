import re
from datetime import datetime, timezone
from bs4 import BeautifulSoup

def extract_metadata(html_content: str, fallback_url: str = "") -> dict:
    """
    Parses and extracts webpage metadata attributes from HTML source.
    """
    meta = {
        "title": "",
        "description": "",
        "canonical_url": "",
        "language": "en",
        "last_modified": None,
        "crawl_timestamp": datetime.now(timezone.utc)
    }

    if not html_content:
        return meta

    soup = BeautifulSoup(html_content, "html.parser")

    # 1. Page Title
    title_tag = soup.find("title")
    if title_tag and title_tag.string:
        meta["title"] = title_tag.string.strip()

    if not meta["title"]:
        og_title = soup.find("meta", property="og:title")
        if og_title and og_title.get("content"):
            meta["title"] = og_title.get("content").strip()

    # 2. Page Description
    desc_tag = soup.find("meta", attrs={"name": "description"})
    if desc_tag and desc_tag.get("content"):
        meta["description"] = desc_tag.get("content").strip()
    else:
        og_desc = soup.find("meta", property="og:description")
        if og_desc and og_desc.get("content"):
            meta["description"] = og_desc.get("content").strip()

    # 3. Canonical URL
    canonical_tag = soup.find("link", rel="canonical")
    if canonical_tag and canonical_tag.get("href"):
        meta["canonical_url"] = canonical_tag.get("href").strip()
    else:
        meta["canonical_url"] = fallback_url

    # 4. Language
    html_tag = soup.find("html")
    if html_tag and html_tag.get("lang"):
        meta["language"] = html_tag.get("lang").strip().lower().split('-')[0]

    # 5. Last Modified
    last_mod_tag = (
        soup.find("meta", attrs={"name": "last-modified"}) or
        soup.find("meta", property="article:modified_time") or
        soup.find("meta", property="og:updated_time")
    )
    if last_mod_tag and last_mod_tag.get("content"):
        meta["last_modified"] = last_mod_tag.get("content").strip()

    return meta

def get_word_count(text: str) -> int:
    """
    Computes total word count of cleaned text string.
    """
    if not text:
        return 0
    words = re.findall(r'\b\w+\b', text)
    return len(words)
