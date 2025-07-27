import json
import os

# Absolute path to the JSON file
ITEM_PRICE_PATH = os.path.join(os.path.dirname(__file__), "items_price.json")

# Load the prices
with open(ITEM_PRICE_PATH, "r", encoding="utf-8") as f:
    ITEM_PRICES = json.load(f)

def get_price_for_item(item: str) -> float:
    """
    Returns the price for the given item name (case insensitive).
    Returns 0.0 if item not found.
    """
    return ITEM_PRICES.get(item.lower(), 0.0)
