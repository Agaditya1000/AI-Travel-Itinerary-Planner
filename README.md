# AI Travel Itinerary Planner 🌍✈️

A smart, budget-aware travel planner powered by **AI (Mistral 7B)** that generates personalized, day-wise itineraries with real cost estimates and PDF download capabilities.



## 🚀 Live Demo
- **Frontend (Netlify)**: [https://travelai1000.netlify.app/](https://travelai1000.netlify.app/)
- **Backend (Vercel)**: [https://ai-travel-itinerary-planner-tkx5.vercel.app/](https://ai-travel-itinerary-planner-tkx5.vercel.app/)

## ✨ Key Features
- **🤖 AI-Powered Planning**: Uses Mistral 7B via OpenRouter to create detailed, logic-checked itineraries.
- **💰 Smart Budgeting**: Automatically calculates and verifies that daily estimates sum up exactly to your total budget.
- **📥 PDF Export**: Download your complete itinerary as a beautifully formatted PDF.
- **🖼️ Real Imagery**: dynamically fetches destination images using the **Wikipedia API**.
- **🎨 Modern UI**: Built with React & Tailwind CSS, featuring glassmorphism design and responsive layouts.

## �️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, jsPDF
- **Backend**: FastAPI, Pydantic AI, Python 3.10+
- **Infrastructure**: Vercel (Backend), Netlify (Frontend)

## 📂 Project Structure
```
ai-travel-planner/
├── backend/            # FastAPI Application
│   ├── utils/          # Helper modules (images, retry logic)
│   ├── main.py         # API Entry Point & Logic
│   └── vercel.json     # Vercel Configuration
├── frontend/           # React Application
│   ├── src/            # Components & Logic
│   └── netlify.toml    # Netlify Configuration
└── README.md           # Documentation
```

## � How to Run Locally

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment:
   - Create a `.env` file in `backend/` and add your API Key:
     ```
     OPENROUTER_API_KEY=your_key_here
     ```
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   Server will start at `http://localhost:8000`.

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   App will run at `http://localhost:5173`.

## 🌍 Deployment Guide

### Backend (Vercel)
1. Push `backend` code to GitHub.
2. Create a new project in Vercel.
3. Set **Root Directory** to `backend`.
4. Add Environment Variable: `OPENROUTER_API_KEY`.
5. Deploy.

### Frontend (Netlify)
1. Push `frontend` code to GitHub.
2. Create a new project in Netlify.
3. Set **Base Directory** to `frontend`.
4. Set **Build Command** to `npm run build`.
5. Set **Publish Directory** to `dist`.
6. Add Environment Variable `VITE_API_URL` pointing to your Vercel backend URL (e.g., `https://ai-travel-itinerary-planner-tkx5.vercel.app/generate-trip`).
7. Deploy.
