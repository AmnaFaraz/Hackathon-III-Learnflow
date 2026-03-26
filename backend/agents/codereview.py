"""Code Review Agent — PEP8 + correctness + efficiency"""
import os, json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"

SYSTEM = """You are a Python code reviewer. Review the code for:
1. PEP8 compliance
2. Correctness (logic errors, edge cases)
3. Efficiency (time/space complexity)
4. Python best practices (pythonic style)

Respond with JSON:
{
  "score": <0-100>,
  "grade": <"A"|"B"|"C"|"D"|"F">,
  "pep8_issues": [<list of strings>],
  "correctness_issues": [<list of strings>],
  "efficiency_notes": [<list of strings>],
  "strengths": [<list of strings>],
  "improved_code": "<improved version or null if no changes needed>"
}"""


def review(code: str) -> dict:
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": f"Review this Python code:\n\n```python\n{code}\n```"}
        ],
        max_tokens=800,
        response_format={"type": "json_object"},
    )
    try:
        return json.loads(response.choices[0].message.content or "{}")
    except Exception:
        return {"score": 0, "grade": "F", "error": "parse error"}
