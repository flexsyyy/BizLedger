import re
from datetime import datetime
from backend.data.items_price import get_price_for_item
from backend.data.category_mapper import map_to_category

def extract_customer(text):
    names = re.findall(r'\bto (\w+)\b|\bfrom (\w+)\b|\bby (\w+)\b', text.lower())
    for tup in names:
        for name in tup:
            if name:
                return name.capitalize()
    return "general"

def extract_transaction_type(text):
    text = text.lower()

    # 💡 Prioritize repayment cases
    repayment_patterns = [
        r'paid back', r'cleared (his|her|my)? credit', r'returned.*credit',
        r'repayment', r'payment.*of credit'
    ]
    for pattern in repayment_patterns:
        if re.search(pattern, text):
            return 'debit'

    # Generic debit keywords
    debit_keywords = ['paid', 'expense', 'spent', 'bought', 'buy', 'purchase', 'given', 'send']
    for word in debit_keywords:
        if word in text:
            return 'debit'

    # Generic credit keywords
    credit_keywords = ['received', 'income', 'sold', 'sale', 'got', 'earned', 'credited']
    for word in credit_keywords:
        if word in text:
            return 'credit'

    return 'debit'  # default fallback

def extract_amount(text):
    match = re.search(r'rs\.?\s?(\d+(?:\.\d+)?)', text.lower())
    return float(match.group(1)) if match else 0.0

def detect_credit_flag(text):
    credit_phrases = ["on credit", "udhaar", "loaned", "not paid", "to be paid", "pending payment", "credit sale"]
    return any(phrase in text.lower() for phrase in credit_phrases)

def extract_item_quantity(text):
    known_items = ["milk", "rice", "sugar", "flour", "daal", "apple", "nuts", "bhendi"]
    text = text.lower()

    for item in known_items:
        if item in text:
            # Try extracting quantity before or after item
            qty_match = re.search(rf"(\d+(?:\.\d+)?)(kg|g|litre|l|units|pieces)?\s*(of\s)?{item}", text)
            if not qty_match:
                qty_match = re.search(rf"{item}\s*(\d+(?:\.\d+)?)(kg|g|litre|l|units|pieces)?", text)
            if qty_match:
                qty = float(qty_match.group(1))
                unit = qty_match.group(2) or "unit"
                if unit == "g":
                    qty /= 1000
                return item, qty
            return item, 1.0  # default quantity
    return None, None

def parse_transaction(text: str):
    text = text.strip().lower()

    # Decide transaction type
    txn_type = "credit" if any(word in text for word in ["sell", "sold", "gave", "provided"]) else "debit"

    # Match all item-amount pairs e.g. "apple for 100"
    items = re.findall(r'(\w+)\s+(?:for|at|worth)?\s*₹?\s*(\d+)', text)

    results = []
    for item, amount in items:
        parsed = {
            "transaction_type": txn_type,
            "amount": float(amount),
            "customer_name": "general",  # or smarter extraction
            "category_name": "general",
            "item_name": item,
            "quantity": 1.0,
            "unit_price": float(amount),  # assuming quantity is always 1
            "on_credit": False,
            "description": text,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "time": datetime.now().strftime("%H:%M:%S"),
        }
        results.append(parsed)

    return results

