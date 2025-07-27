import os
from backend.utils.claude_wrapper import query_claude

def generate_answer(user_query: str, raw_data: dict) -> str:
    try:
        # Construct context prompt
        context = """
You are BizLedger AI, a helpful voice-first financial assistant designed for shopkeepers in India.
Your job is to interpret SQL query results and explain what they mean in simple, clear language.

Here’s the user's question:
{}

Here’s the data returned from the database:
{}

Using this data, summarize the answer to the question in human terms, in 1-2 clear sentences.
        """.format(user_query, raw_data)

        # Ask Claude to summarize
        answer = query_claude(context)
        return answer.strip()

    except Exception as e:
        return f"❌ Claude summarization error: {str(e)}"
