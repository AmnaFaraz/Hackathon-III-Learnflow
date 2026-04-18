# LearnFlow — AI Python Learning Platform

**Student:** Amna Faraz | **GitHub:** AmnaFaraz
**Live Frontend:** [https://panaversity-learnflow.vercel.app](https://panaversity-learnflow.vercel.app)
**Live Backend:** [https://hackathon-iii-learnflow-backend.onrender.com](https://hackathon-iii-learnflow-backend.onrender.com)
**Hackathon III** | Points: 1000 pts + 400 bonus

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env   # add GROQ_API_KEY
pip install -r requirements.txt
uvicorn main:app --port 8001 --reload
```

### Frontend
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## 6 AI Agents
| Agent | Purpose |
|-------|---------|
| Triage | Routes questions to specialist |
| Concepts | Explains topics at learner level |
| Code Review | PEP8 + correctness + efficiency |
| Debug | Hints before solutions |
| Exercise | Generates + auto-grades challenges |
| Progress | Mastery scores + recommendations |

## Mastery Formula
```
score = (0.4 × exercises) + (0.3 × quiz_avg) + (0.2 × code_quality) + (0.1 × streak)
```
- 0–40: Beginner 🔴
- 41–70: Learning 🟡
- 71–90: Proficient 🟢
- 91–100: Mastered 🔵
