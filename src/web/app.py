from __future__ import annotations

from pathlib import Path
import tempfile

from fastapi import FastAPI, File, Form, Request, UploadFile
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from src.config import APPLICATION_PACKS_DIR, OUTPUT_DIR
from src.web import prompt_overrides, reference_manager
from src.web.generation_service import GenerationBusyError, GenerationError, GenerationService


ROOT_DIR = Path(__file__).resolve().parents[2]
WEB_DIR = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = 8765
CURRENT_RESULT_DIR = OUTPUT_DIR / "web_current"

app = FastAPI(title="ResumeForge Local", docs_url=None, redoc_url=None)
app.mount("/static", StaticFiles(directory=WEB_DIR / "static"), name="static")
templates = Jinja2Templates(directory=WEB_DIR / "templates")
SERVICE = GenerationService(
    project_root=ROOT_DIR,
    packs_dir=APPLICATION_PACKS_DIR,
    current_result_dir=CURRENT_RESULT_DIR,
)


def _context(request: Request, **extra) -> dict:
    return {
        "request": request,
        "references": reference_manager.get_reference_statuses(),
        "cv_prompt": prompt_overrides.load_override("cv") or "",
        "lm_prompt": prompt_overrides.load_override("lm") or "",
        **extra,
    }


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(request, "index.html", _context(request))


@app.post("/generate", response_class=HTMLResponse)
def generate(request: Request, mode: str = Form(...), job_text: str = Form(...)):
    try:
        result = SERVICE.run(mode, job_text)
        return templates.TemplateResponse(request, "index.html", _context(request, result=result))
    except GenerationBusyError as exc:
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(request, error=str(exc), selected_mode=mode, job_text=job_text),
            status_code=409,
        )
    except GenerationError as exc:
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(request, error=str(exc), selected_mode=mode, job_text=job_text),
            status_code=400,
        )


@app.post("/references/{key}")
async def replace_reference(request: Request, key: str, file: UploadFile = File(...)):
    suffix = Path(file.filename or "").suffix
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temporary:
        temporary_path = Path(temporary.name)
        temporary.write(await file.read())
    try:
        try:
            reference_manager.replace_reference(key, temporary_path)
        except ValueError as exc:
            return templates.TemplateResponse(
                request,
                "index.html",
                _context(request, error=str(exc)),
                status_code=400,
            )
    finally:
        temporary_path.unlink(missing_ok=True)
    return RedirectResponse(url="/", status_code=303)


@app.post("/prompts/{kind}")
def save_prompt(kind: str, value: str = Form(...)):
    prompt_overrides.save_override(kind, value)
    return RedirectResponse(url="/", status_code=303)


@app.post("/prompts/{kind}/reset")
def reset_prompt(kind: str):
    prompt_overrides.reset_override(kind)
    return RedirectResponse(url="/", status_code=303)


@app.get("/download/current")
def download_current():
    archives = sorted(CURRENT_RESULT_DIR.glob("*.zip"), key=lambda path: path.stat().st_mtime, reverse=True)
    if not archives:
        raise GenerationError("Aucun pack courant à télécharger.")
    return FileResponse(archives[0], filename=archives[0].name, media_type="application/zip")
