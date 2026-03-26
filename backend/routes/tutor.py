"""
Tutor routes — triage + specialist agent dispatch
"""
from fastapi import APIRouter
from pydantic import BaseModel
from agents.triage import triage
from agents.concepts import explain
from agents.codereview import review
from agents.debug import debug_help
from agents.exercise import generate, grade
from agents.progress import calculate_mastery, get_recommendations, check_struggle

router = APIRouter()


class TutorRequest(BaseModel):
    user_id: str
    message: str
    code: str | None = None
    error: str | None = None
    module: str = "basics"
    level: str = "beginner"
    attempts: int = 0


class ProgressRequest(BaseModel):
    exercises_score: float = 0
    quiz_avg: float = 0
    code_quality: float = 0
    streak: int = 0
    weak_modules: list[str] = []


class ExerciseGradeRequest(BaseModel):
    code: str
    test_cases: list[dict]
    solution: str


class StruggleCheckRequest(BaseModel):
    user_id: str
    same_error_count: int = 0
    exercise_time_min: float = 0
    quiz_score: float = 100
    failed_runs: int = 0


@router.post("/tutor/ask")
def ask_tutor(req: TutorRequest):
    """Smart triage → dispatch to specialist agent"""
    route_result = triage(req.message)
    route = route_result.get("route", "general")

    if route == "concept":
        response = explain(req.message, req.level, req.module)
        return {"route": route, "response": response}

    elif route == "codereview" and req.code:
        result = review(req.code)
        return {"route": route, "response": result}

    elif route == "debug" and req.code and req.error:
        response = debug_help(req.code, req.error, req.attempts)
        return {"route": route, "response": response}

    elif route == "exercise":
        exercise = generate(req.module, level_to_difficulty(req.level), req.message)
        return {"route": route, "response": exercise}

    else:
        # fallback: explain as concept
        response = explain(req.message, req.level, req.module)
        return {"route": "concept", "response": response}


@router.post("/tutor/exercise/generate")
def get_exercise(module: str = "basics", difficulty: str = "medium", topic: str = ""):
    return generate(module, difficulty, topic)


@router.post("/tutor/exercise/grade")
def grade_exercise(req: ExerciseGradeRequest):
    return grade(req.code, req.test_cases, req.solution)


@router.post("/tutor/progress")
def get_progress(req: ProgressRequest):
    mastery = calculate_mastery(
        req.exercises_score, req.quiz_avg, req.code_quality, req.streak
    )
    recommendations = get_recommendations(mastery, req.weak_modules)
    return {**mastery, "recommendations": recommendations}


@router.post("/tutor/struggle-check")
def struggle_check(req: StruggleCheckRequest):
    is_struggling = check_struggle(
        req.same_error_count, req.exercise_time_min, req.quiz_score, req.failed_runs
    )
    return {
        "user_id": req.user_id,
        "is_struggling": is_struggling,
        "alert": "Teacher notified" if is_struggling else None,
    }


def level_to_difficulty(level: str) -> str:
    return {"beginner": "easy", "intermediate": "medium", "advanced": "hard"}.get(level, "medium")
