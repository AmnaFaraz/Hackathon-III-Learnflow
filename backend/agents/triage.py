"""
Triage Agent — routes questions to specialist agents
"""
import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"

SYSTEM = """You are a triage agent for a Python learning platform.
Classify the user's message into exactly ONE category and respond with JSON:
{"route": "<category>", "reason": "<brief reason>"}

Categories:
- concept: explaining Python concepts, theory, how-things-work
- codereview: reviewing code, checking style, quality, PEP8
- debug: fixing errors, debugging, exception handling
- exercise: asking for practice problems, challenges, quizzes
- progress: asking about progress, scores, achievements
- general: anything else
"""


def triage(message: str) -> dict:
    import json
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": message}
        ],
        max_tokens=100,
        response_format={"type": "json_object"},
    )
    try:
        return json.loads(response.choices[0].message.content or "{}")
    except Exception:
        return {"route": "general", "reason": "parse error"}
