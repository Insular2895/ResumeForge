from __future__ import annotations

import os
from pathlib import Path
import tempfile

from fastapi import FastAPI, File, Form, Request, UploadFile
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from dotenv import load_dotenv

from src.config import APPLICATION_PACKS_DIR, OUTPUT_DIR
from src.application.career_translation import assess_profile_for_job, load_career_domains
from src.application import experience_memory
from src.web import document_preview, experience_intake, prompt_overrides, reference_manager, template_sessions
from src.web.generation_service import GenerationBusyError, GenerationError, GenerationService


ROOT_DIR = Path(__file__).resolve().parents[2]
WEB_DIR = Path(__file__).resolve().parent
load_dotenv(ROOT_DIR / ".env")

HOST = os.environ.get("RESUMEFORGE_HOST", "127.0.0.1")
PORT = 8765
CURRENT_RESULT_DIR = OUTPUT_DIR / "web_current"
PREVIEW_DIR = OUTPUT_DIR / "web_previews"
FINAL_EXPORT_DIR = OUTPUT_DIR / "web_final_exports"
TEMPLATE_SESSION_DIR = OUTPUT_DIR / "template_sessions"
TEMPLATE_EXPORT_DIR = OUTPUT_DIR / "template_final_exports"

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
        "career_domains": load_career_domains(),
        "experience_options": experience_memory.experience_options(),
        **extra,
    }


def _template_context(request: Request, session: dict, **extra) -> dict:
    session = dict(session)
    session.setdefault("warnings", [])
    session.setdefault("cv_data", {})
    session.setdefault("lm_data", {})
    documents = dict(session.get("documents") or {})
    documents.setdefault("cv", {"label": "CV", "docx_filename": "CV_Lucas_Pertusa.docx", "pdf_filename": ""})
    documents.setdefault(
        "lm",
        {
            "label": "Lettre de motivation",
            "docx_filename": "Lettre_Motivation_Lucas_Pertusa.docx",
            "pdf_filename": "",
        },
    )
    session["documents"] = documents
    return _context(request, template_session=session, **extra)


def _template_updates_from_form(form: dict) -> dict:
    cv_updates: dict[str, str] = {}
    lm_updates: dict[str, str] = {}
    for key, value in form.items():
        if key.startswith("cv_"):
            cv_updates[key.removeprefix("cv_")] = str(value)
        elif key.startswith("lm_"):
            lm_updates[key.removeprefix("lm_")] = str(value)
    return {"cv": cv_updates, "lm": lm_updates}


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(request, "index.html", _context(request))


@app.post("/generate", response_class=HTMLResponse)
def generate(
    request: Request,
    mode: str = Form(...),
    job_text: str = Form(...),
    target_domain: str = Form(""),
):
    coverage = assess_profile_for_job(job_text, target_domain)
    if coverage["status"] == "enrichment_required":
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(
                request,
                coverage=coverage,
                selected_mode=mode,
                selected_target_domain=coverage["target_domain"],
                job_text=job_text,
            ),
        )
    try:
        result = SERVICE.run(mode, job_text, coverage["target_domain"], replace_existing=True)
        template_session = template_sessions.create_template_session(result.pack_dir, TEMPLATE_SESSION_DIR)
        return templates.TemplateResponse(
            request,
            "template_preview.html",
            _template_context(
                request,
                template_session,
                result=result,
                selected_target_domain=coverage["target_domain"],
            ),
        )
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


@app.post("/enrichment/confirm", response_class=HTMLResponse)
def confirm_enrichment(
    request: Request,
    mode: str = Form(...),
    job_text: str = Form(...),
    target_domain: str = Form(...),
    experience_id: str = Form(""),
    free_text: str = Form(""),
    question: list[str] = Form(default=[]),
    answer: list[str] = Form(default=[]),
):
    try:
        experience_memory.add_validated_memory(
            {
                "experience_id": experience_id,
                "target_domain": target_domain,
                "free_text": free_text,
                "qa_pairs": [
                    {"question": item_question, "answer": item_answer}
                    for item_question, item_answer in zip(question, answer)
                    if item_answer.strip()
                ],
            }
        )
        coverage = assess_profile_for_job(job_text, target_domain)
        if coverage["status"] == "enrichment_required":
            return templates.TemplateResponse(
                request,
                "index.html",
                _context(
                    request,
                    coverage=coverage,
                    selected_mode=mode,
                    selected_target_domain=target_domain,
                    job_text=job_text,
                ),
            )
        result = SERVICE.run(mode, job_text, target_domain, replace_existing=True)
        template_session = template_sessions.create_template_session(result.pack_dir, TEMPLATE_SESSION_DIR)
        return templates.TemplateResponse(
            request,
            "template_preview.html",
            _template_context(
                request,
                template_session,
                result=result,
                selected_mode=mode,
                selected_target_domain=target_domain,
                job_text=job_text,
            ),
        )
    except (ValueError, GenerationError) as exc:
        coverage = assess_profile_for_job(job_text, target_domain)
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(
                request,
                error=str(exc),
                coverage=coverage,
                selected_mode=mode,
                selected_target_domain=target_domain,
                job_text=job_text,
                enrichment_free_text=free_text,
            ),
            status_code=400,
        )


@app.post("/experiences/propose", response_class=HTMLResponse)
def propose_experience(
    request: Request,
    experience_text: str = Form(...),
    mode: str = Form(...),
    job_text: str = Form(...),
):
    try:
        proposal = experience_intake.propose_experience(experience_text, job_text)
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(
                request,
                experience_proposal=proposal,
                experience_text=experience_text,
                selected_mode=mode,
                job_text=job_text,
            ),
        )
    except (ValueError, RuntimeError) as exc:
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(
                request,
                error=str(exc),
                experience_text=experience_text,
                selected_mode=mode,
                job_text=job_text,
            ),
            status_code=400,
        )


@app.post("/experiences/confirm", response_class=HTMLResponse)
def confirm_experience(
    request: Request,
    mode: str = Form(...),
    job_text: str = Form(...),
    company: str = Form(...),
    job_title: str = Form(...),
    location: str = Form(""),
    date_start: str = Form(""),
    date_end: str = Form(""),
    context: str = Form(""),
    bullet_1: str = Form(...),
    bullet_2: str = Form(...),
    bullet_3: str = Form(...),
    bullet_4: str = Form(...),
    bullet_5: str = Form(""),
    tools_verified: str = Form(""),
    skills_verified: str = Form(""),
    skills_transferable: str = Form(""),
    industry_tags: str = Form(""),
    job_family_tags: str = Form(""),
):
    proposal = {
        "company": company,
        "job_title": job_title,
        "location": location,
        "date_start": date_start,
        "date_end": date_end,
        "context": context,
        "bullets": [bullet_1, bullet_2, bullet_3, bullet_4, bullet_5],
        "tools_verified": tools_verified,
        "skills_verified": skills_verified,
        "skills_transferable": skills_transferable,
        "industry_tags": industry_tags,
        "job_family_tags": job_family_tags,
    }
    try:
        experience_intake.add_validated_experience(proposal)
    except ValueError as exc:
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(
                request,
                error=str(exc),
                experience_proposal=experience_intake.normalize_proposal(proposal),
                selected_mode=mode,
                job_text=job_text,
            ),
            status_code=400,
        )

    try:
        result = SERVICE.run(mode, job_text, replace_existing=True)
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(request, result=result, selected_mode=mode, job_text=job_text),
        )
    except GenerationError as exc:
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(
                request,
                error=f"Expérience ajoutée au master, mais régénération impossible : {exc}",
                selected_mode=mode,
                job_text=job_text,
            ),
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


@app.get("/preview/{preview_id}", response_class=HTMLResponse)
def preview_documents(request: Request, preview_id: str):
    try:
        preview = document_preview.load_preview_session(preview_id, PREVIEW_DIR)
    except ValueError as exc:
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(request, error=str(exc)),
            status_code=404,
        )
    return templates.TemplateResponse(request, "preview.html", _context(request, preview=preview))


@app.post("/preview/{preview_id}/export")
def export_preview_documents(
    preview_id: str,
    cv_edited: str = Form(""),
    cv_is_dirty: bool = Form(False),
    lm_edited: str = Form(""),
    lm_is_dirty: bool = Form(False),
):
    zip_path = document_preview.export_final_zip(
        preview_id,
        PREVIEW_DIR,
        FINAL_EXPORT_DIR,
        cv_edited=cv_edited,
        cv_is_dirty=cv_is_dirty,
        lm_edited=lm_edited,
        lm_is_dirty=lm_is_dirty,
    )
    return FileResponse(
        zip_path,
        filename="ResumeForge_documents_finaux.zip",
        media_type="application/zip",
    )

@app.get("/template-preview/{session_id}", response_class=HTMLResponse)
def template_preview(request: Request, session_id: str):
    try:
        session = template_sessions.load_template_session(session_id, TEMPLATE_SESSION_DIR)
    except ValueError as exc:
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(request, error=str(exc)),
            status_code=404,
        )
    return templates.TemplateResponse(request, "template_preview.html", _template_context(request, session))


@app.post("/template-preview/{session_id}/regenerate", response_class=HTMLResponse)
async def regenerate_template_preview(request: Request, session_id: str):
    form = await request.form()
    try:
        session = template_sessions.update_template_session(
            session_id,
            TEMPLATE_SESSION_DIR,
            _template_updates_from_form(dict(form)),
        )
    except ValueError as exc:
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(request, error=str(exc)),
            status_code=404,
        )
    return templates.TemplateResponse(request, "template_preview.html", _template_context(request, session))


@app.get("/template-preview/{session_id}/files/{filename}")
def template_preview_file(session_id: str, filename: str):
    session = template_sessions.load_template_session(session_id, TEMPLATE_SESSION_DIR)
    allowed = {
        document.get("pdf_filename")
        for document in session.get("documents", {}).values()
        if document.get("pdf_filename")
    } | {
        document.get("docx_filename")
        for document in session.get("documents", {}).values()
        if document.get("docx_filename")
    }
    if filename not in allowed:
        return JSONResponse({"error": "Document introuvable."}, status_code=404)
    path = TEMPLATE_SESSION_DIR / session_id / filename
    media_type = "application/pdf" if filename.lower().endswith(".pdf") else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    return FileResponse(path, filename=filename, media_type=media_type)


@app.get("/template-preview/{session_id}/export")
def export_template_preview(session_id: str):
    zip_path = template_sessions.export_template_session_zip(
        session_id,
        TEMPLATE_SESSION_DIR,
        TEMPLATE_EXPORT_DIR,
    )
    return FileResponse(
        zip_path,
        filename="ResumeForge_documents_finaux.zip",
        media_type="application/zip",
    )
