# BizLedger - AI-Powered Voice Transaction Recording

BizLedger is an intelligent business transaction recording application that uses voice recognition and AI to automatically parse and categorize financial transactions. The app leverages OpenAI's Whisper for speech-to-text conversion and Claude AI for intelligent transaction parsing and SQL query generation.

## 🚀 Features

- **Voice Recording**: Record transactions using voice commands
- **AI Transcription**: Convert speech to text using OpenAI Whisper
- **Smart Parsing**: Automatically extract transaction details (amount, type, description)
- **SQL Generation**: Generate database queries using Claude AI
- **Cross-Platform**: React Native frontend with FastAPI backend
- **Real-time Processing**: Instant transaction processing and storage

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   FastAPI       │    │   Database      │
│   Frontend      │◄──►│   Backend       │◄──►│   (SQLite/SQL)  │
│   (Expo)        │    │   (Python)      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │
        │                       ▼
        │              ┌─────────────────┐
        │              │   AI Services   │
        │              │   - Whisper     │
        │              │   - Claude API  │
        └──────────────┤   - MCP Agent   │
                       └─────────────────┘
```

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Expo CLI** (`npm install -g @expo/cli`)
- **Claude API Key** (from Anthropic)
- **Android Studio** (for Android development) or **Xcode** (for iOS)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bizledger.git
cd bizledger
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
cd backend
python -m venv env
# On Windows
env\Scripts\activate
# On macOS/Linux
source env/bin/activate

pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env
```

Add your Claude API key to the `.env` file:

```env
CLAUDE_API_KEY=your_claude_api_key_here
```

**🔑 Getting Claude API Key:**
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up/Login to your account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy and paste it in your `.env` file

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Configure API Endpoints

**⚠️ IMPORTANT:** Before running the app, you must update the IP addresses in the API configuration.

1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   # macOS/Linux
   ifconfig
   ```

2. Update the IP addresses in `frontend/services/api.js`:

```javascript
// Replace with your actual IP address
const BIZLEDGER_BACKEND_URL = "http://YOUR_IP_ADDRESS:8000"; // FastAPI backend
const DATABASE_API_URL = "http://YOUR_IP_ADDRESS:3000"; // Express backend
```

Example:
```javascript
const BIZLEDGER_BACKEND_URL = "http://192.168.1.100:8000";
const DATABASE_API_URL = "http://192.168.1.100:3000";
```

### 4. API Server Setup (Optional)

If you're using the Express.js API server:

```bash
cd api
npm install
```

## 🚀 Running the Application

### 1. Start the Backend Server

```bash
cd backend
# Activate virtual environment
env\Scripts\activate  # Windows
source env/bin/activate  # macOS/Linux

# Start FastAPI server
python -m uvicorn app:app --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### 2. Start the API Server (Optional)

```bash
cd api
npm start
```

### 3. Start the Frontend

```bash
cd frontend
npm start
```

This will start the Expo development server. You can then:

- **Scan QR code** with Expo Go app (Android/iOS)
- **Press 'a'** to open Android emulator
- **Press 'w'** to open in web browser
- **Press 'i'** to open iOS simulator

## 📱 Usage

1. **Launch the app** on your device/emulator
2. **Grant microphone permissions** when prompted
3. **Press and hold** the record button to start recording
4. **Speak your transaction** (e.g., "I spent 50 dollars on groceries")
5. **Release the button** to stop recording
6. **View the processed transaction** in the app

### Example Voice Commands

- "I received 1000 dollars from client payment"
- "Spent 25 dollars on office supplies"
- "Got 500 dollars cash from sale"
- "Paid 200 dollars for electricity bill"

## 🧪 Testing

### Test Backend Health

```bash
curl http://YOUR_IP:8000/health
```

Expected response:
```json
{"status": "ok"}
```

### Test Frontend Connection

The app will show connection status on the main screen. Look for:
- ✅ Health check passed
- ✅ Backend connection successful

## 📁 Project Structure

```
bizledger/
├── backend/                 # FastAPI Python backend
│   ├── app.py              # Main FastAPI application
│   ├── whisper_engine.py   # Whisper transcription
│   ├── nlp/                # NLP processing modules
│   ├── mcp_agent/          # Claude AI integration
│   ├── utils/              # Utility functions
│   └── requirements.txt    # Python dependencies
├── frontend/               # React Native Expo app
│   ├── app/                # App screens and navigation
│   ├── components/         # Reusable UI components
│   ├── services/           # API services
│   └── package.json        # Node.js dependencies
├── api/                    # Express.js API server (optional)
│   ├── server.js           # Express server
│   └── package.json        # Node.js dependencies
└── README.md              # This file
```

## 🔧 Configuration

### Backend Configuration

- **Port**: 8000 (FastAPI)
- **Host**: 0.0.0.0 (accessible from network)
- **Upload Directory**: `uploads/` (for audio files)

### Frontend Configuration

- **Expo SDK**: 53.x
- **React Native**: 0.79.x
- **Audio Recording**: Expo AV (deprecated, migrating to expo-audio)

## 🐛 Troubleshooting

### Common Issues

1. **Network Error / Connection Failed**
   - Ensure backend server is running
   - Check IP addresses in `api.js` are correct
   - Verify firewall allows connections on port 8000

2. **Audio Recording Issues**
   - Grant microphone permissions
   - Test on physical device (emulator audio may not work)

3. **Transcription Errors**
   - Check Claude API key is valid
   - Ensure internet connection is stable
   - Verify audio file is being uploaded correctly

4. **Module Not Found Errors**
   - Run `npm install` in respective directories
   - Check Node.js and Python versions

### Debug Mode

Enable debug logging by setting environment variable:

```bash
export DEBUG=1  # macOS/Linux
set DEBUG=1     # Windows
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI Whisper](https://github.com/openai/whisper) for speech recognition
- [Anthropic Claude](https://www.anthropic.com/) for AI-powered text processing
- [Expo](https://expo.dev/) for React Native development platform
- [FastAPI](https://fastapi.tiangolo.com/) for the Python web framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/bizledger/issues) page
2. Create a new issue with detailed description
3. Include logs and error messages

---

**Happy Recording! 🎤💰**


