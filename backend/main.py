"""
Panaversity LearnFlow — Backend (FastAPI)
6 Groq agents: triage, concepts, codereview, debug, exercise, progress
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.tutor import router as tutor_router
from routes.execute import router as execute_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("LearnFlow backend starting...")
    yield


app = FastAPI(
    title="Panaversity LearnFlow API",
    description="Hackathon III — AI Python Learning Platform",
    version="3.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tutor_router, prefix="/api", tags=["tutor"])
app.include_router(execute_router, prefix="/api", tags=["sandbox"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "learnflow-api", "version": "3.0.0"}
