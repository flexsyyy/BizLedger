import os
from dotenv import load_dotenv
load_dotenv()

import requests


API_KEY = os.getenv("CLAUDE_API_KEY")
HEADERS = {
    "x-api-key": API_KEY,
    "anthropic-version": "2023-06-01",
    "Content-Type": "application/json"
}

def query_claude(prompt: str) -> str:
    if not API_KEY:
        raise Exception("Claude API key not found in environment variables.")

    payload = {
        "model": "claude-3-opus-20240229"
,
        "max_tokens": 300,
        "temperature": 0.5,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    res = requests.post("https://api.anthropic.com/v1/messages", json=payload, headers=HEADERS)
    
    try:
        data = res.json()
        if "content" not in data or not data["content"]:
            raise Exception(f"Claude API returned unexpected format: {data}")
        return data["content"][0]["text"]
    except Exception as e:
        raise Exception(f"Claude API error: {str(e)}")

