import re
import logging
from app.core import config

logger = logging.getLogger("content_normalizer")

# Compile regular expression patterns once and reuse
DATE_PATTERNS = [
    re.compile(r'\b\d{1,2}\s+(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}\b', re.IGNORECASE),
    re.compile(r'\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}\b', re.IGNORECASE),
    re.compile(r'\b\d{4}-\d{2}-\d{2}\b'),
    re.compile(r'\b\d{2}/\d{2}/\d{4}\b'),
    re.compile(r'\blast\s+updated:\s*.*?\d{4}\b', re.IGNORECASE)
]

TIME_PATTERNS = [
    re.compile(r'\b\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?\b', re.IGNORECASE)
]

COUNTER_PATTERNS = [
    re.compile(r'\b(?:visitors|total\s+views|hits):\s*\d+\b', re.IGNORECASE)
]

COPYRIGHT_PATTERNS = [
    re.compile(r'©\s*\d{4}'),
    re.compile(r'\bcopyright\s+\d{4}\b', re.IGNORECASE),
    re.compile(r'\ball\s+rights\s+reserved\s+\d{4}\b', re.IGNORECASE)
]

SESSION_PATTERNS = [
    re.compile(r'\b(?:session|phpsessid|jsessionid|token)=\w+\b', re.IGNORECASE),
    re.compile(r'\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b', re.IGNORECASE),  # UUID
    re.compile(r'\b[0-9a-f]{32,}\b', re.IGNORECASE)  # Long hexadecimal IDs (MD5/SHA-1/etc)
]

WHITESPACE_PATTERN = re.compile(r'\s+')

def normalize_content(text: str) -> tuple[str, dict]:
    """
    Cleans webpage text before hashing to ignore volatile/dynamic sections.
    Returns:
        (normalized lowercase text, dictionary of removal statistics)
    """
    stats = {
        "original_len": 0,
        "normalized_len": 0,
        "chars_removed": 0,
        "dates_removed": 0,
        "times_removed": 0,
        "counters_removed": 0,
        "copyrights_removed": 0,
        "sessions_removed": 0
    }

    if not text:
        return "", stats

    original_len = len(text)
    stats["original_len"] = original_len
    
    # 1. Convert text to lowercase
    normalized = text.lower()
    
    dates_removed = 0
    times_removed = 0
    counters_removed = 0
    copyrights_removed = 0
    sessions_removed = 0

    # 2. Apply normalization steps if enabled
    if config.ENABLE_NORMALIZED_HASH:
        # Ignore Dates & Copyrights
        if config.IGNORE_DATES:
            for pattern in DATE_PATTERNS:
                matches = pattern.findall(normalized)
                dates_removed += len(matches)
                normalized = pattern.sub("", normalized)
                
            for pattern in COPYRIGHT_PATTERNS:
                matches = pattern.findall(normalized)
                copyrights_removed += len(matches)
                normalized = pattern.sub("", normalized)

        # Ignore Timestamps
        if config.IGNORE_TIMESTAMPS:
            for pattern in TIME_PATTERNS:
                matches = pattern.findall(normalized)
                times_removed += len(matches)
                normalized = pattern.sub("", normalized)

        # Ignore Counters
        if config.IGNORE_COUNTERS:
            for pattern in COUNTER_PATTERNS:
                matches = pattern.findall(normalized)
                counters_removed += len(matches)
                normalized = pattern.sub("", normalized)

        # Ignore Sessions & UUIDs & Hex strings
        if config.IGNORE_SESSION_IDS:
            for pattern in SESSION_PATTERNS:
                matches = pattern.findall(normalized)
                sessions_removed += len(matches)
                normalized = pattern.sub("", normalized)

        # Normalize extra whitespaces
        if config.IGNORE_EXTRA_WHITESPACE:
            normalized = WHITESPACE_PATTERN.sub(" ", normalized)

    # 3. Trim leading and trailing whitespace
    normalized = normalized.strip()
    normalized_len = len(normalized)
    
    stats["normalized_len"] = normalized_len
    stats["chars_removed"] = original_len - normalized_len
    stats["dates_removed"] = dates_removed
    stats["times_removed"] = times_removed
    stats["counters_removed"] = counters_removed
    stats["copyrights_removed"] = copyrights_removed
    stats["sessions_removed"] = sessions_removed

    return normalized, stats
