from backend.mcp_agent.mcp_queries import send_sql_to_backend

def get_data_from_query(sql_query: str):
    response = send_sql_to_backend(sql_query)
    return response
