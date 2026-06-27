import logging
import time
import requests
import asyncio
from app.core import config

logger = logging.getLogger("website_scraper")

def _download_html_sync(url: str, timeout: int, max_retries: int, user_agent: str) -> str:
    headers = {"User-Agent": user_agent}
    session = requests.Session()
    
    last_err = None
    for attempt in range(max_retries + 1):
        try:
            logger.info(f"Downloading HTML from {url} (Attempt {attempt + 1}/{max_retries + 1})")
            response = session.get(url, headers=headers, timeout=timeout, allow_redirects=True)
            response.raise_for_status()
            
            # Prevent downloading excessively large files
            content_length = response.headers.get("Content-Length")
            if content_length and int(content_length) > config.MAX_PAGE_SIZE:
                raise ValueError(f"Content length exceeds limit of {config.MAX_PAGE_SIZE} bytes")
                
            if len(response.content) > config.MAX_PAGE_SIZE:
                raise ValueError(f"Downloaded content exceeds limit of {config.MAX_PAGE_SIZE} bytes")
                
            return response.text
        except requests.RequestException as e:
            last_err = e
            logger.warning(f"Attempt {attempt + 1} failed for {url}: {str(e)}")
            if attempt < max_retries:
                # Exponential backoff: 2s, 4s, 8s...
                time.sleep(2 ** attempt)
                
    raise last_err or requests.RequestException("Scraping failed after retries")

async def download_html(url: str) -> str:
    """
    Asynchronously downloads HTML content from a URL.
    Delegates block-based HTTP operations to a background worker thread.
    """
    timeout = getattr(config, "REQUEST_TIMEOUT", 10)
    max_retries = getattr(config, "MAX_RETRIES", 3)
    user_agent = getattr(config, "USER_AGENT", "Mozilla/5.0")
    
    return await asyncio.to_thread(
        _download_html_sync,
        url,
        timeout,
        max_retries,
        user_agent
    )
