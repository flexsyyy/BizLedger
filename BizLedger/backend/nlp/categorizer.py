import os
import json

# Load category → keywords mapping from JSON
MAPPING_PATH = os.path.join(os.path.dirname(__file__), '..', 'mappings', 'category_keywords.json')

with open(MAPPING_PATH, 'r', encoding='utf-8') as f:
    CATEGORY_KEYWORDS = json.load(f)

def normalize_category(text: str) -> str:
    """
    Matches a category by checking if any of its associated keywords are present in the input text.
    Returns the matching category name or 'general' if no match.
    """
    text = text.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text:
                return category
    return "general"
