import os
from backend.mcp_agent.schema_context import TABLE_SCHEMA
from backend.utils.claude_wrapper import query_claude

def generate_sql(user_question: str) -> str:
    prompt = f"""
You are an expert assistant. Given a user question, generate a SQLite query based on this schema:

{TABLE_SCHEMA}

Only return the SQL query needed to answer:
"{user_question}"

Do not include explanations. Only return the SQL.
"""
    raw_response = query_claude(prompt)

    if "SELECT" in raw_response:
        sql = raw_response[raw_response.find("SELECT"):]
    else:
        sql = raw_response.strip()

    return sql

