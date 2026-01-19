# AI Travel Itinerary Planner 🌍✈️

A budget-aware AI travel planner that generates personalized day-wise itineraries using **FastAPI**, **Pydantic AI**, and **React**.

## 🚀 Tech Stack
- **Backend:** FastAPI, Pydantic AI (Mistral 7B via OpenRouter), Python 3.10+
- **Frontend:** React (Vite), Tailwind CSS, Axios
- **AI Model:** `openrouter/mistralai/mistral-7b-instruct`

## 📂 Project Structure
```
ai-travel-planner/
├── backend/            # FastAPI Application
├── frontend/           # React Application
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
4. Configure Environment:
   - Create `.env` file in `backend/` and add your OpenRouter API Key:
     ```
     OPENROUTER_API_KEY=your_key_here
     ```
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
