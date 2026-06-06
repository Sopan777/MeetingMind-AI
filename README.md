# MeetingMind AI

A real-time AI Meeting Intelligence Platform that captures screen/audio, generates live transcripts, and extracts action items, decisions, and risks.

## Features

- **Live Transcription**: High-accuracy real-time transcription of meeting audio.
- **Voice Activity Detection (VAD)**: Intelligent local speech detection to only transcribe when someone is speaking.
- **Live Analysis**: Ongoing extraction of action items, key decisions, and risks from the meeting conversation using LLMs.
- **Modern UI**: A beautiful, dynamic Next.js frontend with real-time WebSocket updates.
- **Flexible AI Providers**:
  - **Transcription**: Choose between local inference (faster-whisper) or cloud APIs (Groq, OpenAI).
  - **Analysis**: Powered by NVIDIA Build API (Nemotron) or Google Gemini.

## Tech Stack

**Frontend:**
- Next.js (React)
- Tailwind CSS
- `@ricky0123/vad-web` (Client-side Voice Activity Detection)

**Backend:**
- Python FastAPI
- WebSocket for real-time audio streaming
- `faster-whisper` (CTranslate2) for local transcription
- NVIDIA NIM API for LLM analysis

## Setup Instructions

### 1. Backend (Python)
1. Navigate to the `backend` directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `.\venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Configure your `.env` file (see the `.env.example` file).

### 2. Frontend (Node.js)
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`

## How to Run

1. **Start the backend server:**
   ```bash
   cd backend
   python main.py
   ```
   *(Runs on http://localhost:8000)*

2. **Start the frontend application:**
   ```bash
   cd frontend
   npm run dev
   ```
   *(Runs on http://localhost:3000)*

## Local Whisper Setup

If you want to run transcription 100% locally on your own GPU:
1. Download the `faster-distil-whisper-large-v3` model files manually from Hugging Face.
2. Place the 5 core files (`model.bin`, `config.json`, `tokenizer.json`, etc.) in `backend/local_whisper_model/`.
3. In your `backend/.env`, set:
   ```env
   TRANSCRIPTION_PROVIDER=local
   LOCAL_WHISPER_MODEL=C:/absolute/path/to/backend/local_whisper_model
   LOCAL_WHISPER_DEVICE=cuda
   LOCAL_WHISPER_COMPUTE_TYPE=float16
   ```
*(Note: You must have the CUDA toolkit installed and an NVIDIA GPU with at least 6GB VRAM for GPU acceleration).*
