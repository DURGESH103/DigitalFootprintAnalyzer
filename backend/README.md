# Digital Footprint Analyzer — Backend

## Stack
- **Node.js** (Express) — Main API
- **Python** (FastAPI) — AI Analysis Microservice
- **MySQL** — Primary database
- **Redis** — Caching layer
- **Socket.io** — Real-time progress updates
- **JWT** — Authentication

---

## Quick Start

### 1. Clone & Install

```bash
cd backend/node-api
npm install
```

```bash
cd backend/python-ai
pip install -r requirements.txt
```

### 2. Configure Environment

Copy and fill in both `.env` files:
- `backend/node-api/.env`
- `backend/python-ai/.env`

### 3. Create Database Tables

```bash
cd backend/scripts
node seed.js
```

### 4. Run Services

```bash
# Node.js API
cd backend/node-api
npm run dev

# Python AI
cd backend/python-ai
uvicorn app.main:app --reload --port 8000
```

### 5. Docker (All-in-one)

```bash
cd backend
docker-compose -f docker/docker-compose.yml up --build
```

---

## API Reference

### POST /api/auth/signup
```json
// Request
{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }

// Response 201
{ "user": { "id": 1, "name": "John Doe", "email": "john@example.com" }, "token": "<jwt>" }
```

### POST /api/auth/login
```json
// Request
{ "email": "john@example.com", "password": "secret123" }

// Response 200
{ "user": { "id": 1, "name": "John Doe", "email": "john@example.com" }, "token": "<jwt>" }
```

### GET /api/github/:username
```
Authorization: Bearer <jwt>

// Response 200
{
  "profile": { "login": "torvalds", "public_repos": 8, "followers": 200000 },
  "repos": [...],
  "commits": [{ "sha": "abc", "message": "fix: kernel bug", "date": "2024-01-01T10:00:00Z" }]
}
```

### POST /api/report/analyze
```json
// Authorization: Bearer <jwt>
// Request
{ "githubUsername": "torvalds" }

// Response 201
{
  "reportId": 42,
  "scores": {
    "consistency": 78,
    "engagement": 100,
    "totalRepos": 8,
    "totalStars": 9500,
    "totalForks": 3200,
    "topLanguages": [{ "lang": "C", "count": 5 }],
    "activityPattern": { "day": 65, "night": 35 }
  },
  "aiInsights": {
    "personality_type": "The Architect",
    "strengths": ["Highly consistent contributor", "Strong community engagement"],
    "weaknesses": [],
    "suggestions": ["Explore new programming languages"],
    "summary": "torvalds is a The Architect with 8 public repos..."
  }
}
```

### GET /api/report/:userId
```
Authorization: Bearer <jwt>

// Response 200 — array of past reports
```

---

## Real-Time (Socket.io)

Connect with `userId` query param to receive live progress:

```js
const socket = io('http://localhost:3000', { query: { userId: '1' } });
socket.on('progress', ({ step, percent }) => console.log(step, percent));
```

Progress events: `20%` → `60%` → `90%` → `100%`

---

## AI Service (Python)

Set `USE_OPENAI=true` in `python-ai/.env` to use GPT-4o-mini.  
Default is rule-based NLP (no API key needed).

### POST /analyze (internal)
```json
// Request — sent by Node.js automatically
{
  "username": "torvalds",
  "bio": "Just a programmer",
  "public_repos": 8,
  "followers": 200000,
  "scores": { "consistency": 78, "engagement": 100, ... },
  "top_languages": ["C", "Shell"],
  "sample_commits": ["fix: memory leak", "feat: new syscall"]
}
```

---

## Database Schema

```sql
users               (id, name, email, password, created_at)
connected_accounts  (id, user_id, provider, username, updated_at)
reports             (id, user_id, github_username, scores JSON, ai_insights JSON, created_at)
```

---

## Tests

```bash
cd backend/node-api
npm test
```
