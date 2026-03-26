"""Debug Agent — parses errors, gives hints before solutions"""
import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"

SYSTEM = """You are a Python debugging tutor.
RULE: Give hints first, not direct answers. Guide the learner to discover the fix themselves.
1. Explain what the error means in plain English
2. Give ONE hint about where to look
3. Ask a guiding question
4. Only show the fix if learner asks explicitly or has tried 3+ times

Format: Use clear sections: **Error Explanation** | **Hint** | **Question**"""


def debug_help(code: str, error: str, attempts: int = 0) -> str:
    give_solution = attempts >= 3
    user_msg = f"Code:\n```python\n{code}\n```\n\nError:\n```\n{error}\n```"
    if give_solution:
        user_msg += "\n\nI've tried multiple times. Please show me the fix."

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": user_msg}
        ],
        max_tokens=512,
    )
    return response.choices[0].message.content or ""
