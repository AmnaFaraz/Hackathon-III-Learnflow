"""Exercise Agent — generates challenges + auto-grades"""
import os, json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"


def generate(module: str, difficulty: str = "medium", topic: str = "") -> dict:
    system = """You are a Python exercise generator. Create a coding challenge.
Respond with JSON:
{
  "title": "<exercise title>",
  "description": "<clear problem statement>",
  "starter_code": "<Python starter code with TODO comments>",
  "test_cases": [{"input": "<value>", "expected": "<value>"}],
  "hints": ["<hint 1>", "<hint 2>"],
  "solution": "<complete solution code>",
  "difficulty": "<easy|medium|hard>"
}"""

    prompt = f"Module: {module}\nDifficulty: {difficulty}\nTopic: {topic or module}"
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1024,
        response_format={"type": "json_object"},
    )
    try:
        return json.loads(response.choices[0].message.content or "{}")
    except Exception:
        return {"error": "Failed to generate exercise"}


def grade(code: str, test_cases: list[dict], solution: str) -> dict:
    system = """Grade this Python submission against test cases.
Respond with JSON:
{
  "score": <0-100>,
  "passed": <number of passed test cases>,
  "total": <total test cases>,
  "feedback": "<specific feedback>",
  "passed_cases": [<indices of passed cases>]
}"""

    prompt = f"""Student code:
```python
{code}
```

Test cases: {json.dumps(test_cases)}
Reference solution:
```python
{solution}
```"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ],
        max_tokens=400,
        response_format={"type": "json_object"},
    )
    try:
        return json.loads(response.choices[0].message.content or "{}")
    except Exception:
        return {"score": 0, "passed": 0, "total": len(test_cases), "feedback": "Grading error"}
