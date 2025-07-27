def map_to_category(text):
    text = text.lower()
    mapping = {
        "bills": ["bill", "electricity", "water", "phone", "internet"],
        "groceries": ["rice", "flour", "dal", "atta", "vegetables", "bhendi", "grocery"],
        "family": ["daughter", "son", "wife", "home", "family", "parents"],
        "credit_sales": ["on credit", "udhaar", "loaned", "sold to"],
        "rent": ["rent", "lease"],
        "personal": ["my", "personal", "self"]
    }

    for category, keywords in mapping.items():
        if any(word in text for word in keywords):
            return category
    return "general"
