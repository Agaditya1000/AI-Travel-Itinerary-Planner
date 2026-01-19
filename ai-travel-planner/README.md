# AI Travel Itinerary Planner 🌍✈️

A budget-aware AI travel planner that generates personalized day-wise itineraries using **FastAPI**, **Pydantic AI**, and **React**.

<<<<<<< HEAD
## ✨ Key Features
- **AI Itinerary Generation**: Uses Mistral 7B (via OpenRouter) to create detailed daily plans.
- **Real Images**: Fetches authentic destination photos using the **Wikipedia API**.
- **Interactive UI**: Features a dynamic **10-image background slideshow** with auto-play.
- **Smart Budgeting**: Automatically calculates cost breakdowns for accommodation, food, and activities.
- **Mock Mode**: Built-in fallback system that works even without an API key (returns data for "Paris").

## 🚀 Tech Stack
- **Backend**: FastAPI, Pydantic AI, Python 3.10+, Wikipedia API
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons
- **Deployment**: Vercel (Backend), Netlify (Frontend)
=======
## 🚀 Tech Stack
- **Backend:** FastAPI, Pydantic AI (Mistral 7B via OpenRouter), Python 3.10+
- **Frontend:** React (Vite), Tailwind CSS, Axios
- **AI Model:** `openrouter/mistralai/mistral-7b-instruct`
>>>>>>> 2e8bcea1761a07e90cb34af10392f97bd45da645

## 📂 Project Structure
```
ai-travel-planner/
├── backend/            # FastAPI Application
<<<<<<< HEAD
│   ├── utils/images.py # Wikipedia Image Fetcher
│   ├── vercel.json     # Vercel Config
│   └── main.py         # App Entry Point
├── frontend/           # React Application
│   ├── src/App.tsx     # Main UI & Slideshow Logic
│   └── netlify.toml    # Netlify Config
=======
├── frontend/           # React Application
>>>>>>> 2e8bcea1761a07e90cb34af10392f97bd45da645
└── README.md           # This file
```

## 🛠️ How to Run Locally

### 1. Backend Setup
1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create virtual environment & activate:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
<<<<<<< HEAD
4. **(Optional)** Configure Environment:
=======
4. Configure Environment:
>>>>>>> 2e8bcea1761a07e90cb34af10392f97bd45da645
   - Create `.env` file in `backend/` and add your OpenRouter API Key:
     ```
     OPENROUTER_API_KEY=your_key_here
     ```
<<<<<<< HEAD
   - *Note: If skipped, the app will run in Mock Mode.*

=======
>>>>>>> 2e8bcea1761a07e90cb34af10392f97bd45da645
5. Run Server:
   ```bash
   uvicorn main:app --reload
   ```
   Server runs at `http://localhost:8000`.

### 2. Frontend Setup
1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Development Server:
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`.

<<<<<<< HEAD
---

## 🌍 Deployment Guide

### Backend (Vercel)
1. Push code to GitHub.
2. Import project in Vercel.
3. **Crucial Settings**:
   - **Root Directory**: `backend`
   - **Environment Variables**: Add `OPENROUTER_API_KEY`.
4. Deploy!

### Frontend (Netlify)
1. Push code to GitHub.
2. Import project in Netlify.
3. **Settings**:
   - **Base Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: Add `VITE_API_URL` pointing to your Vercel backend (e.g., `https://your-app.vercel.app/generate-trip`).
4. Deploy!

## 🛡️ Security Note
The project includes a `.gitignore` that excludes `.env` files to prevent API key leaks. If you previously committed keys, they have been scrubbed from history using `git-filter-repo`. Always keep your keys secret!
=======
## 🤖 How the Agent Works
The core logic resides in `backend/agent.py`. It uses **Pydantic AI** to structure the interaction with the LLM. 
- **System Prompt:** Instructs the AI to act as a travel planner, ensuring the total cost stays within budget.
- **Retry Mechanism:** `utils/retry.py` ensures robustness by retrying failed API calls.
- **Structured Output:** The agent returns a strictly typed `TripResponse` object (Pydantic model), ensuring the frontend always receives valid JSON data with `itinerary`, `cost_breakdown`, etc.

## 🌍 Deployment

### Backend (Render/Railway)
1. Push code to GitHub.
2. Link repo to Render.
3. Set Build Command: `pip install -r requirements.txt`
4. Set Start Command: `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Add `OPENROUTER_API_KEY` in environment variables.

### Frontend (Vercel)
1. Push code to GitHub.
2. Import project in Vercel.
3. Set Root Directory to `frontend`.
4. Deploy!

## 📸 Screenshots
*(Add screenshots of your running app here)*

## 🎥 Demo Video
[Link to Loom Video]
>>>>>>> 2e8bcea1761a07e90cb34af10392f97bd45da645
