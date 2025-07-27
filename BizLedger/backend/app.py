import os
from uuid import uuid4
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import requests

from backend.utils.audio_utils import convert_to_wav
from backend.whisper_engine import transcribe_audio
from backend.nlp.parser import parse_transaction
from backend.mcp_agent.mcp_claude import generate_sql
from backend.mcp_agent.mcp_recieve import get_data_from_query
from backend.mcp_agent.mcp_answer import generate_answer

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}


# 🎤 TRANSCRIBE endpoint
@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    try:
        ext = file.filename.split('.')[-1]
        uid = uuid4().hex
        input_path = os.path.join(UPLOAD_DIR, f"{uid}.{ext}")
        output_path = os.path.join(UPLOAD_DIR, f"{uid}.wav")

        with open(input_path, "wb") as f:
            f.write(await file.read())
        print(f"✅ Received file: {input_path}")

        convert_to_wav(input_path, output_path)
        print(f"✅ Audio converted to WAV: {output_path}")

        whisper_result = transcribe_audio(output_path)
        transcription = whisper_result["transcription"]
        language = whisper_result["language_code"]
        print(f"🗣️ Transcribed:  {transcription} (lang: {language})")

        parsed_list = parse_transaction(transcription)
        statuses = []

        for txn in parsed_list:
            res = requests.post("http://localhost:3000/transactions", json=txn)
            statuses.append(res.json())

        return JSONResponse(content={
    "transcription": transcription,
    "language": language,
    "parsed": parsed_list,
    "db_statuses": statuses
})

        db_status = response.json()

        return JSONResponse(content={
            "transcription": transcription,
            "language": language,
            "parsed": parsed,
            "db_status": db_status
        })

    except Exception as e:
        print(f"❌ Error in /transcribe: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

# 🤖 MCP endpoint
@app.post("/mcp")
async def mcp_route(text: str = Form(...)):
    try:
        print(f"🧠 User asked: {text}")

        # Step 1: Claude generates SQL
        sql = generate_sql(text)
        print(f"🧾 SQL generated:\n{sql}")

        # Step 2: Send SQL to Node.js API
        raw_data = get_data_from_query(sql)
        print(f"📦 Data received:\n{raw_data}")

        # Step 3: Claude answers with final response
        answer = generate_answer(text, raw_data)
        return {"response": answer}

    except Exception as e:
        print(f"❌ MCP Error: {e}")
        return {"error": str(e)}

@app.post("/mcp/audio")
async def mcp_audio_route(file: UploadFile = File(...)):
    try:
        # Save & convert
        ext = file.filename.split('.')[-1]
        uid = uuid4().hex
        input_path = os.path.join(UPLOAD_DIR, f"{uid}.{ext}")
        output_path = os.path.join(UPLOAD_DIR, f"{uid}.wav")
        with open(input_path, "wb") as f:
            f.write(await file.read())
        convert_to_wav(input_path, output_path)

        # Transcribe
        whisper_result = transcribe_audio(output_path)
        transcription = whisper_result["transcription"]
        print(f"🧠 MCP Transcribed: {transcription}")

        # Ask Claude
        from backend.mcp_agent.mcp_claude import generate_sql
        from backend.mcp_agent.mcp_queries import send_sql_to_backend
        from backend.mcp_agent.mcp_recieve import get_data_from_query
        from backend.mcp_agent.mcp_answer import generate_answer

        sql = generate_sql(transcription)
        print(f"🧾 SQL generated:\n{sql}")
        raw_data = get_data_from_query(sql)
        print(f"📦 Data received:\n{raw_data}")
        answer = generate_answer(transcription, raw_data)

        return {"transcription": transcription, "answer": answer}

    except Exception as e:
        print(f"❌ MCP Audio Error: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)
