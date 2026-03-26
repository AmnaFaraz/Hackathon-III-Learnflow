"""Progress Agent — mastery scores and recommendations"""
import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"

MASTERY_LEVELS = [
    (0, 40, "Beginner", "🔴"),
    (41, 70, "Learning", "🟡"),
    (71, 90, "Proficient", "🟢"),
    (91, 100, "Mastered", "🔵"),
]


def calculate_mastery(
    exercises_score: float,  # 0-100
    quiz_avg: float,          # 0-100
    code_quality: float,      # 0-100
    streak: int,              # days
) -> dict:
    streak_bonus = min(streak / 30, 1.0) * 100  # normalize streak to 0-100
    score = (
        0.4 * exercises_score
        + 0.3 * quiz_avg
        + 0.2 * code_quality
        + 0.1 * streak_bonus
    )
    score = round(min(max(score, 0), 100), 1)

    level = "Beginner"
    emoji = "🔴"
    for low, high, lv, em in MASTERY_LEVELS:
        if low <= score <= high:
            level = lv
            emoji = em
            break

    return {
        "score": score,
        "level": level,
        "emoji": emoji,
        "components": {
            "exercises": exercises_score,
            "quiz_avg": quiz_avg,
            "code_quality": code_quality,
            "streak": streak,
        }
    }


def get_recommendations(mastery: dict, weak_modules: list[str]) -> str:
    system = "You are a Python learning coach. Give personalized, encouraging recommendations. Max 150 words."
    prompt = f"""Student mastery: {mastery['score']}/100 ({mastery['level']})
Weak areas: {', '.join(weak_modules) if weak_modules else 'None identified'}
Give 3 specific recommendations to improve."""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ],
        max_tokens=250,
    )
    return response.choices[0].message.content or ""


def check_struggle(
    same_error_count: int,
    exercise_time_min: float,
    quiz_score: float,
    failed_runs: int,
) -> bool:
    """Detect if student is struggling — trigger teacher alert"""
    return (
        same_error_count >= 3
        or exercise_time_min > 10
        or quiz_score < 50
        or failed_runs >= 5
    )
