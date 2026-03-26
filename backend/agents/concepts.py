"""Concepts Agent — explains Python at learner's level"""
import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"


def explain(concept: str, level: str = "beginner", module: str = "") -> str:
    level_guides = {
        "beginner": "Use simple analogies, avoid jargon. Short sentences.",
        "intermediate": "Assume basic Python knowledge. Use examples.",
        "advanced": "Be technical. Mention edge cases and best practices.",
    }
    context = f"Module context: {module}" if module else ""
    system = f"""You are a friendly Python tutor for a {level} learner.
{level_guides.get(level, level_guides['beginner'])}
{context}
Keep responses concise (max 300 words). Always include a code example."""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": f"Explain: {concept}"}
        ],
        max_tokens=512,
    )
    return response.choices[0].message.content or ""
