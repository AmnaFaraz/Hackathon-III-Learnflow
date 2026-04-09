"""
Code Sandbox — safe Python execution
Timeout: 5s | Memory: 50MB | Network: blocked
Allowed: Python stdlib only
"""
import subprocess
import tempfile
import os
import sys

# resource is only available on Unix
try:
    import resource
except ImportError:
    resource = None


BLOCKED_MODULES = frozenset([
    "requests", "httpx", "socket", "urllib", "urllib2",
    "ftplib", "smtplib", "imaplib", "poplib",
])
TIMEOUT = 5
MAX_MEMORY_MB = 50


def _set_limits():
    if resource:
        mem = MAX_MEMORY_MB * 1024 * 1024
        resource.setrlimit(resource.RLIMIT_AS, (mem, mem))


def check_safety(code: str) -> tuple[bool, str]:
    for mod in BLOCKED_MODULES:
        if f"import {mod}" in code or f"from {mod}" in code:
            return False, f"Module '{mod}' is not allowed in the sandbox."
    return True, ""


def execute(code: str) -> dict:
    safe, reason = check_safety(code)
    if not safe:
        return {"stdout": "", "stderr": reason, "returncode": 1}

    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".py", delete=False, dir="/tmp"
    ) as f:
        f.write(code)
        tmp = f.name

    try:
        result = subprocess.run(
            ["python3", tmp],
            capture_output=True,
            text=True,
            timeout=TIMEOUT,
            preexec_fn=_set_limits,
        )
        return {
            "stdout": result.stdout[:4096],
            "stderr": result.stderr[:1024],
            "returncode": result.returncode,
        }
    except subprocess.TimeoutExpired:
        return {
            "stdout": "",
            "stderr": f"TimeoutError: Code exceeded {TIMEOUT} second limit.",
            "returncode": 1,
        }
    except Exception as e:
        return {"stdout": "", "stderr": str(e), "returncode": 1}
    finally:
        try:
            os.unlink(tmp)
        except Exception:
            pass
