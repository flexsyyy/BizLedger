from faster_whisper import WhisperModel

# Load multilingual Whisper model
print("🔄 Loading Whisper model...")
model = WhisperModel(
    "medium",            # Use "medium" or "small" for local performance
    device="cpu",        # Change to "cuda" if you use a GPU
    compute_type="int8", # Use int8 for low memory
    download_root="./models"
)
print("✅ Whisper model loaded successfully.")

def transcribe_audio(wav_path: str) -> dict:
    """
    Transcribes the given WAV file using Whisper and returns the result.
    """
    segments, info = model.transcribe(
        wav_path,
        task="translate",
        language=None,                      # Auto-detect
        beam_size=5,                        # Improves quality
        vad_filter=False,                   # Disable Voice Activity Detection
        condition_on_previous_text=False    # Fresh results
    )

    transcription = " ".join([seg.text for seg in segments])
    return {
        "transcription": transcription,
        "language_code": info.language
    }
