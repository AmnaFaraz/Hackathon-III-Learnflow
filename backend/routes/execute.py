from fastapi import APIRouter
from pydantic import BaseModel
from sandbox import execute

router = APIRouter()


class ExecuteRequest(BaseModel):
    code: str


@router.post("/execute")
def run_code(req: ExecuteRequest):
    """Run Python code in sandboxed environment"""
    return execute(req.code)
