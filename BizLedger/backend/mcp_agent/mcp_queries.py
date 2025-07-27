import requests

def send_sql_to_backend(sql_query: str):
    try:
        res = requests.post("http://localhost:3000/mcp/query", json={"sql": sql_query})
        return res.json()
    except Exception as e:
        return {"error": str(e)}
