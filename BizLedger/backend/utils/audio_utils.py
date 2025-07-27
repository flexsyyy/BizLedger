import os
import subprocess

def convert_to_wav(input_path: str, output_path: str):
    """
    Converts an audio file (e.g., .m4a) to .wav format with mono channel and 16kHz sample rate.
    """
    command = [
        "ffmpeg",
        "-y",                  # Overwrite output
        "-i", input_path,      # Input file
        "-ar", "16000",        # Set sample rate to 16kHz
        "-ac", "1",            # Mono channel
        output_path
    ]
    try:
        subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"✅ Audio converted to WAV: {output_path}")
    except subprocess.CalledProcessError as e:
        print(f"❌ ffmpeg conversion failed: {e.stderr.decode()}")
        raise
