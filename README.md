# 🔍 Digital Footprint Analyzer

An AI-powered developer profile analyzer that generates personality insights, hireability scores, and coding pattern analysis from any GitHub profile.

## ✨ Features

- **AI Insights** — Personality type, strengths, weaknesses & suggestions powered by OpenAI
- **Real-time Progress** — Socket.io with Redis pub/sub for live analysis updates
- **Hireability Score** — Composite score from consistency, engagement & activity
- **Charts** — Language distribution & activity pattern visualizations
- **JWT Auth** — Access + refresh token rotation with secure cookies
- **Premium UI** — Dark theme, Framer Motion animations, responsive design

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, Socket.io, BullMQ → SimpleQueue |
| AI Service | Python, FastAPI, OpenAI / rule-based fallback |
| Database | MySQL 8+ with connection pooling |
| Cache/Queue | Redis 5+ (Redis 3+ compatible in dev) |
| Auth | JWT (access 15m + refresh 7d), bcryptjs |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+
- Redis (or Memurai on Windows)
- Python 3.10+

### 1. Clone the repo
```bash
git clone https://github.com/DURGESH103/DigitalFootprintAnalyzer.git
cd DigitalFootprintAnalyzer
```

### 2. Backend setup
```bash
cd backend/node-api
cp .env.example .env        # fill in your values
npm install
npm run seed                # creates DB + tables
npm run dev                 # starts on :3000
```

### 3. Python AI service
```bash
cd backend/python-ai
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend setup
```bash
cd frontend
cp .env.example .env.local  # fill in values
npm install
npm run dev                 # starts on :5173
```

## 📁 Project Structure

```
DigitalFootprintAnalyzer/
├── backend/
│   ├── node-api/          # Express API + Socket.io
│   ├── python-ai/         # FastAPI AI microservice
│   ├── scripts/           # DB seed (legacy)
│   └── docker/            # Docker Compose
└── frontend/              # Next.js 14 app
```

## 🔑 Environment Variables

Copy `.env.example` to `.env` in each service directory and fill in:
- `DB_PASSWORD` — your MySQL password
- `JWT_SECRET` / `JWT_REFRESH_SECRET` — random 32+ char strings
- `GITHUB_TOKEN` — GitHub personal access token (for higher rate limits)
- `OPENAI_API_KEY` — optional, falls back to rule-based analysis

## 📜 License

MIT
