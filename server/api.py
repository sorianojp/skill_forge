#!/usr/bin/env python3
"""
SkillForge lightweight API server (Python 3 stdlib + SQLite, ~15 MB RAM).
Provides:
  - GET  /api/health
  - POST /api/run                 (live compiler proxy for C, C++, Java 21, C# .NET 8, TS, Node, Bash)
  - POST /api/auth/register       (learner account creation with PBKDF2-HMAC-SHA256)
  - POST /api/auth/login          (learner login returning bearer token + synced progress)
  - GET  /api/progress            (fetch cloud-synced progress)
  - PUT  /api/progress            (save cloud-synced progress)
  - POST /api/certificates        (register a public verifiable certificate)
  - GET  /api/certificates/<id>   (verify a certificate by ID)
"""

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
import threading
import time
import urllib.error
import urllib.request

PORT = int(os.environ.get("SKILLFORGE_PORT", "8787"))
DB_PATH = os.environ.get("SKILLFORGE_DB", "/var/lib/skillforge/skillforge.db")
ADMIN_KEY = os.environ.get("DEVPATH_ADMIN_KEY", "")
WANDBOX_URL = "https://wandbox.org/api/compile.json"

COMPILERS = {
    "c": {"compiler": "gcc-13.2.0-c", "options": "warning,c11"},
    "cpp": {"compiler": "gcc-13.2.0", "options": "warning,c++20"},
    "java": {"compiler": "openjdk-jdk-21+35", "options": ""},
    "csharp": {"compiler": "dotnetcore-8.0.402", "options": ""},
    "ts": {"compiler": "typescript-5.6.2", "options": ""},
    "node": {"compiler": "nodejs-20.17.0", "options": ""},
    "bash": {"compiler": "bash", "options": ""},
}

RATE_LOCK = threading.Lock()
RATE_BUCKETS: dict[str, list[float]] = {}
DB_LOCK = threading.Lock()


def init_db() -> None:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                token TEXT UNIQUE NOT NULL,
                progress_json TEXT NOT NULL DEFAULT '{}',
                updated_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS certificates (
                cert_id TEXT PRIMARY KEY,
                learner_name TEXT NOT NULL,
                course_slug TEXT NOT NULL,
                course_title TEXT NOT NULL,
                score INTEGER NOT NULL,
                total INTEGER NOT NULL,
                issued_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS page_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_type TEXT NOT NULL,
                path TEXT NOT NULL,
                course_slug TEXT NOT NULL DEFAULT '',
                meta TEXT NOT NULL DEFAULT '',
                day TEXT NOT NULL,
                created_at INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_events_type_day ON page_events(event_type, day);
            CREATE INDEX IF NOT EXISTS idx_events_course ON page_events(course_slug);
            """
        )
        conn.commit()


def log_event(event_type: str, path: str, course_slug: str = "", meta: str = "") -> None:
    day = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    try:
        with DB_LOCK, sqlite3.connect(DB_PATH) as conn:
            conn.execute(
                "INSERT INTO page_events (event_type, path, course_slug, meta, day, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                (event_type[:24], path[:200], course_slug[:80], meta[:80], day, int(time.time())),
            )
            conn.commit()
    except Exception:
        pass


def get_admin_stats() -> dict:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    days = [
        (datetime.now(timezone.utc) - timedelta(days=i)).strftime("%Y-%m-%d")
        for i in range(13, -1, -1)
    ]
    with DB_LOCK, sqlite3.connect(DB_PATH) as conn:
        total_views = conn.execute(
            "SELECT COUNT(*) FROM page_events WHERE event_type = 'view'"
        ).fetchone()[0]
        today_views = conn.execute(
            "SELECT COUNT(*) FROM page_events WHERE event_type = 'view' AND day = ?",
            (today,),
        ).fetchone()[0]
        total_runs = conn.execute(
            "SELECT COUNT(*) FROM page_events WHERE event_type = 'run'"
        ).fetchone()[0]
        total_users = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
        total_certs = conn.execute("SELECT COUNT(*) FROM certificates").fetchone()[0]
        avg_score_row = conn.execute("SELECT ROUND(AVG(score), 1) FROM certificates").fetchone()
        avg_exam_score = float(avg_score_row[0]) if avg_score_row and avg_score_row[0] is not None else 0.0

        day_rows = dict(
            conn.execute(
                "SELECT day, COUNT(*) FROM page_events WHERE event_type = 'view' AND day >= ? GROUP BY day",
                (days[0],),
            ).fetchall()
        )
        views_by_day = [{"day": d, "views": int(day_rows.get(d, 0))} for d in days]

        top_courses = [
            {"courseSlug": r[0], "views": int(r[1])}
            for r in conn.execute(
                "SELECT course_slug, COUNT(*) AS c FROM page_events WHERE event_type = 'view' AND course_slug != '' GROUP BY course_slug ORDER BY c DESC LIMIT 10"
            ).fetchall()
        ]
        top_pages = [
            {"path": r[0], "views": int(r[1])}
            for r in conn.execute(
                "SELECT path, COUNT(*) AS c FROM page_events WHERE event_type = 'view' GROUP BY path ORDER BY c DESC LIMIT 10"
            ).fetchall()
        ]
        runner_breakdown = [
            {"language": r[0], "runs": int(r[1])}
            for r in conn.execute(
                "SELECT meta, COUNT(*) AS c FROM page_events WHERE event_type = 'run' AND meta != '' GROUP BY meta ORDER BY c DESC LIMIT 10"
            ).fetchall()
        ]
        recent_certs = [
            {
                "certId": r[0],
                "learnerName": r[1],
                "courseSlug": r[2],
                "courseTitle": r[3],
                "score": r[4],
                "issuedAt": r[5],
            }
            for r in conn.execute(
                "SELECT cert_id, learner_name, course_slug, course_title, score, issued_at FROM certificates ORDER BY rowid DESC LIMIT 12"
            ).fetchall()
        ]

    return {
        "totals": {
            "totalViews": int(total_views),
            "todayViews": int(today_views),
            "totalUsers": int(total_users),
            "totalCertificates": int(total_certs),
            "totalRuns": int(total_runs),
            "avgExamScore": avg_exam_score,
        },
        "viewsByDay": views_by_day,
        "topCourses": top_courses,
        "topPages": top_pages,
        "runnerBreakdown": runner_breakdown,
        "recentCertificates": recent_certs,
    }


def hash_password(password: str, salt: str) -> str:
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120_000)
    return dk.hex()


def check_rate_limit(ip: str, limit: int = 25, window: float = 60.0) -> bool:
    now = time.time()
    with RATE_LOCK:
        stamps = [t for t in RATE_BUCKETS.get(ip, []) if now - t < window]
        if len(stamps) >= limit:
            RATE_BUCKETS[ip] = stamps
            return False
        stamps.append(now)
        RATE_BUCKETS[ip] = stamps
        return True


def run_wandbox(language: str, code: str) -> dict:
    spec = COMPILERS.get(language)
    if not spec:
        return {"error": f"Unsupported language: {language}"}

    source = code
    if language == "java":
        # Wandbox compiles prog.java, so remove `public` before top-level class declarations.
        source = re.sub(r"\bpublic\s+class\b", "class", source)

    payload = {
        "code": source,
        "compiler": spec["compiler"],
    }
    if spec["options"]:
        payload["options"] = spec["options"]

    started = time.time()
    req = urllib.request.Request(
        WANDBOX_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "User-Agent": "SkillForge-Runner/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            data = json.loads(raw)
    except urllib.error.HTTPError as exc:
        return {"error": f"Compiler service returned HTTP {exc.code}"}
    except Exception as exc:
        return {"error": f"Compiler service unavailable: {exc}"}

    elapsed_ms = int((time.time() - started) * 1000)
    stdout = data.get("program_output", "") or ""
    stderr_parts = [
        data.get("compiler_error", "") or "",
        data.get("program_error", "") or "",
    ]
    stderr = "\n".join([p.strip() for p in stderr_parts if p.strip()])
    return {
        "status": str(data.get("status", "0")),
        "stdout": stdout,
        "stderr": stderr,
        "compiler": spec["compiler"],
        "durationMs": elapsed_ms,
    }


class SkillForgeHandler(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:
        return

    def _send_json(self, code: int, body: dict) -> None:
        raw = json.dumps(body).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Key")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
        self.end_headers()
        self.wfile.write(raw)

    def _read_json(self, max_bytes: int = 128_000) -> dict | None:
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 0 or length > max_bytes:
            return None
        try:
            raw = self.rfile.read(length).decode("utf-8")
            return json.loads(raw)
        except Exception:
            return None

    def _bearer_token(self) -> str:
        auth = self.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            return auth[7:].strip()
        return ""

    def do_OPTIONS(self) -> None:
        self._send_json(200, {"ok": True})

    def do_GET(self) -> None:
        path = self.path.split("?")[0]
        if path == "/api/health":
            self._send_json(200, {"ok": True, "service": "devpath-api"})
            return

        if path == "/api/admin/stats":
            provided = self.headers.get("X-Admin-Key", "").strip()
            if not ADMIN_KEY or not provided or not hmac.compare_digest(provided, ADMIN_KEY):
                self._send_json(401, {"error": "Invalid admin key"})
                return
            self._send_json(200, get_admin_stats())
            return

        if path.startswith("/api/certificates/"):
            cert_id = path[len("/api/certificates/"):].strip()
            if not cert_id:
                self._send_json(400, {"error": "Missing certificate ID"})
                return
            with DB_LOCK, sqlite3.connect(DB_PATH) as conn:
                row = conn.execute(
                    "SELECT cert_id, learner_name, course_slug, course_title, score, total, issued_at FROM certificates WHERE cert_id = ?",
                    (cert_id,),
                ).fetchone()
            if not row:
                self._send_json(404, {"error": "Certificate not found"})
                return
            self._send_json(
                200,
                {
                    "certId": row[0],
                    "learnerName": row[1],
                    "courseSlug": row[2],
                    "courseTitle": row[3],
                    "score": row[4],
                    "total": row[5],
                    "issuedAt": row[6],
                },
            )
            return

        if path == "/api/progress":
            token = self._bearer_token()
            if not token:
                self._send_json(401, {"error": "Unauthorized"})
                return
            with DB_LOCK, sqlite3.connect(DB_PATH) as conn:
                row = conn.execute(
                    "SELECT email, name, progress_json FROM users WHERE token = ?",
                    (token,),
                ).fetchone()
            if not row:
                self._send_json(401, {"error": "Invalid session token"})
                return
            self._send_json(
                200,
                {
                    "user": {"email": row[0], "name": row[1]},
                    "progress": json.loads(row[2] or "{}"),
                },
            )
            return

        self._send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:
        path = self.path.split("?")[0]
        ip = self.headers.get("X-Forwarded-For", self.client_address[0]).split(",")[0].strip()

        if path == "/api/analytics/event":
            if not check_rate_limit(f"evt:{ip}", limit=120, window=60.0):
                self._send_json(204, {"ok": True})
                return
            body = self._read_json(4_000)
            if not body:
                self._send_json(400, {"error": "Invalid JSON"})
                return
            ev_path = str(body.get("path", "/")).strip() or "/"
            ev_type = str(body.get("eventType", "view")).strip().lower()
            if ev_type not in {"view", "run", "exam"}:
                ev_type = "view"
            course_slug = str(body.get("courseSlug", "")).strip()
            if not course_slug and ev_path.startswith("/courses/"):
                parts = [p for p in ev_path.split("/") if p]
                if len(parts) >= 2:
                    course_slug = parts[1]
            log_event(ev_type, ev_path, course_slug, str(body.get("meta", "")))
            self._send_json(200, {"ok": True})
            return

        if path == "/api/run":
            if not check_rate_limit(ip):
                self._send_json(429, {"error": "Rate limit exceeded. Please wait a moment and try again."})
                return
            body = self._read_json(64_000)
            if not body:
                self._send_json(400, {"error": "Invalid JSON payload"})
                return
            lang = str(body.get("language", "")).strip().lower()
            code = str(body.get("code", ""))
            if not code.strip():
                self._send_json(400, {"error": "Code cannot be empty"})
                return
            log_event("run", "/api/run", "", lang)
            result = run_wandbox(lang, code)
            if "error" in result:
                self._send_json(502, result)
            else:
                self._send_json(200, result)
            return

        if path == "/api/auth/register":
            body = self._read_json(16_000)
            if not body:
                self._send_json(400, {"error": "Invalid JSON payload"})
                return
            email = str(body.get("email", "")).strip().lower()
            password = str(body.get("password", ""))
            name = str(body.get("name", "")).strip() or email.split("@")[0]
            if "@" not in email or len(password) < 6:
                self._send_json(400, {"error": "Enter a valid email and a password of at least 6 characters."})
                return
            salt = secrets.token_hex(16)
            pw_hash = hash_password(password, salt)
            token = secrets.token_urlsafe(32)
            progress = json.dumps(body.get("progress") or {})
            try:
                with DB_LOCK, sqlite3.connect(DB_PATH) as conn:
                    conn.execute(
                        "INSERT INTO users (email, name, password_hash, salt, token, progress_json, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        (email, name, pw_hash, salt, token, progress, int(time.time())),
                    )
                    conn.commit()
            except sqlite3.IntegrityError:
                self._send_json(409, {"error": "An account with this email already exists. Try signing in."})
                return
            self._send_json(201, {"token": token, "user": {"email": email, "name": name}})
            return

        if path == "/api/auth/login":
            body = self._read_json(16_000)
            if not body:
                self._send_json(400, {"error": "Invalid JSON payload"})
                return
            email = str(body.get("email", "")).strip().lower()
            password = str(body.get("password", ""))
            with DB_LOCK, sqlite3.connect(DB_PATH) as conn:
                row = conn.execute(
                    "SELECT id, email, name, password_hash, salt, token, progress_json FROM users WHERE email = ?",
                    (email,),
                ).fetchone()
            if not row or hash_password(password, row[4]) != row[3]:
                self._send_json(401, {"error": "Invalid email or password."})
                return
            self._send_json(
                200,
                {
                    "token": row[5],
                    "user": {"email": row[1], "name": row[2]},
                    "progress": json.loads(row[6] or "{}"),
                },
            )
            return

        if path == "/api/certificates":
            body = self._read_json(16_000)
            if not body:
                self._send_json(400, {"error": "Invalid JSON payload"})
                return
            cert_id = str(body.get("certId", "")).strip()
            learner_name = str(body.get("learnerName", "")).strip()
            course_slug = str(body.get("courseSlug", "")).strip()
            course_title = str(body.get("courseTitle", "")).strip()
            score = int(body.get("score", 0))
            total = int(body.get("total", 10))
            issued_at = str(body.get("issuedAt", "")).strip() or time.strftime("%Y-%m-%d")
            if not cert_id or not learner_name or not course_slug or not course_title:
                self._send_json(400, {"error": "Missing required certificate fields"})
                return
            with DB_LOCK, sqlite3.connect(DB_PATH) as conn:
                conn.execute(
                    """
                    INSERT INTO certificates (cert_id, learner_name, course_slug, course_title, score, total, issued_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(cert_id) DO UPDATE SET
                        learner_name=excluded.learner_name,
                        score=excluded.score,
                        total=excluded.total,
                        issued_at=excluded.issued_at
                    """,
                    (cert_id, learner_name, course_slug, course_title, score, total, issued_at),
                )
                conn.commit()
            self._send_json(201, {"certId": cert_id, "verifyUrl": f"/verify?id={cert_id}"})
            return

        self._send_json(404, {"error": "Not found"})

    def do_PUT(self) -> None:
        path = self.path.split("?")[0]
        if path == "/api/progress":
            token = self._bearer_token()
            if not token:
                self._send_json(401, {"error": "Unauthorized"})
                return
            body = self._read_json(64_000)
            if not body:
                self._send_json(400, {"error": "Invalid JSON payload"})
                return
            progress_json = json.dumps(body.get("progress") or {})
            with DB_LOCK, sqlite3.connect(DB_PATH) as conn:
                cur = conn.execute(
                    "UPDATE users SET progress_json = ?, updated_at = ? WHERE token = ?",
                    (progress_json, int(time.time()), token),
                )
                conn.commit()
                if cur.rowcount == 0:
                    self._send_json(401, {"error": "Invalid session token"})
                    return
            self._send_json(200, {"ok": True})
            return

        self._send_json(404, {"error": "Not found"})


if __name__ == "__main__":
    init_db()
    server = ThreadingHTTPServer(("127.0.0.1", PORT), SkillForgeHandler)
    print(f"SkillForge API listening on 127.0.0.1:{PORT}")
    server.serve_forever()
