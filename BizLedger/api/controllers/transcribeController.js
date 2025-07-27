const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

exports.handleTranscription = async (req, res) => {
  try {
    const audioFile = req.file;
    if (!audioFile) {
      return res.status(400).json({ error: "No audio file uploaded." });
    }

    // 🔹 Send audio to Python backend for transcription
    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioFile.path), {
      filename: audioFile.originalname,
    });

    const whisperRes = await axios.post('http://127.0.0.1:8000/transcribe', formData, {
      headers: formData.getHeaders(),
    });

    const parsed = whisperRes.data?.parsed;
    if (!parsed) {
      return res.status(400).json({ error: "Failed to parse transaction." });
    }

    // 🔹 Forward parsed transaction to /transactions
    const txnRes = await axios.post('http://localhost:3000/transactions', parsed);

    return res.json({
      status: 'success',
      transcription: whisperRes.data.transcription,
      language: whisperRes.data.language,
      parsed,
      db_response: txnRes.data,
    });
  } catch (err) {
    console.error("❌ Error in /transcribe:", err.message);
    res.status(500).json({ error: err.message });
  }
};
