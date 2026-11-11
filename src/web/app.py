from __future__ import annotations

import os
from pathlib import Path
import tempfile

from fastapi import FastAPI, File, Form, Request, UploadFile
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from dotenv import load_dotenv

from src.config import APPLICATION_PACKS_DIR, OUTPUT_DIR
from src.application.career_translation import assess_profile_for_job, load_career_domains
from src.application import experience_memory
from src.web import client_imports, document_preview, experience_intake, prompt_overrides, reference_manager
from src.web.generation_service import GenerationBusyError, GenerationError, GenerationService


ROOT_DIR = Path(__file__).resolve().parents[2]
WEB_DIR = Path(__file__).resolve().parent
load_dotenv(ROOT_DIR / ".env")

HOST = os.environ.get("RESUMEFORGE_HOST", "127.0.0.1")
PORT = 8765
CURRENT_RESULT_DIR = OUTPUT_DIR / "web_current"
PREVIEW_DIR = OUTPUT_DIR / "web_previews"
FINAL_EXPORT_DIR = OUTPUT_DIR / "web_final_exports"
HOME_TABS = {"generate", "tracker", "skills", "setup"}

app = FastAPI(title="ResumeForge Local", docs_url=None, redoc_url=None)
app.mount("/static", StaticFiles(directory=WEB_DIR / "static"), name="static")
templates = Jinja2Templates(directory=WEB_DIR / "templates")
SERVICE = GenerationService(
    project_root=ROOT_DIR,
    packs_dir=APPLICATION_PACKS_DIR,
    current_result_dir=CURRENT_RESULT_DIR,
)


def _context(request: Request, **extra) -> dict:
    try:
        tracker = client_imports.tracker_dashboard()
        tracker_error = ""
    except (OSError, ValueError) as exc:
        tracker = {"rows": [], "total": 0, "raw_total": 0, "statuses": {}, "last_update": ""}
        tracker_error = str(exc)
    skills_status = client_imports.validated_skills_status()
    return {
        "request": request,
        "references": reference_manager.get_reference_statuses(),
        "cv_prompt": prompt_overrides.load_override("cv") or "",
        "lm_prompt": prompt_overrides.load_override("lm") or "",
        "career_domains": load_career_domains(),
        "experience_options": experience_memory.experience_options(),
        "active_tab": "generate",
        "tracker": tracker,
        "tracker_error": tracker_error,
        "skills_status": skills_status,
        **extra,
    }


@app.get("/", response_class=HTMLResponse)
def home(request: Request, tab: str = "generate"):
    active_tab = tab if tab in HOME_TABS else "generate"
    return templates.TemplateResponse(request, "index.html", _context(request, active_tab=active_tab))


async def _save_upload_temporarily(file: UploadFile) -> Path:
    data = await file.read(client_imports.MAX_UPLOAD_BYTES + 1)
    if len(data) > client_imports.MAX_UPLOAD_BYTES:
        raise ValueError("Le fichier dépasse la limite de 10 Mo.")
    suffix = Path(file.filename or "").suffix.casefold()
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temporary:
        temporary_path = Path(temporary.name)
        temporary.write(data)
    return temporary_path


@app.get("/tracker/template")
def download_tracker_template():
    path = client_imports.create_tracker_template()
    return FileResponse(
        path,
        filename=path.name,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


@app.get("/tracker/export")
def export_tracker():
    path = client_imports.export_tracker_xlsx()
    return FileResponse(
        path,
        filename=path.name,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


@app.post("/tracker/import/preview", response_class=HTMLResponse)
async def preview_tracker_import(request: Request, file: UploadFile = File(...)):
    temporary_path: Path | None = None
    try:
        temporary_path = await _save_upload_temporarily(file)
        preview = client_imports.prepare_tracker_import(
            temporary_path,
            source_filename=file.filename or "suivi.xlsx",
        )
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(request, active_tab="tracker", tracker_preview=preview),
            status_code=200 if preview["can_confirm"] else 400,
        )
    except (OSError, ValueError) as exc:
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(request, active_tab="tracker", error=str(exc)),
            status_code=400,
        )
    finally:
        if temporary_path is not None:
            temporary_path.unlink(missing_ok=True)


@app.post("/tracker/import/confirm", response_class=HTMLResponse)
def confirm_tracker_import(
    request: Request,
    import_token: str = Form(...),
    import_mode: str = Form("merge"),
):
    try:
        result = client_imports.confirm_tracker_import(import_token, mode=import_mode)
        message = (
            f"Suivi importé : {result['inserted']} ajout(s), "
            f"{result['updated']} mise(s) à jour."
        )
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(request, active_tab="tracker", success_message=message),
        )
    except (OSError, ValueError) as exc:
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(request, active_tab="tracker", error=str(exc)),
            status_code=400,
        )


@app.get("/skills/template")
def download_skills_template():
    path = client_imports.create_skills_template()
    return FileResponse(
        path,
        filename=path.name,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


@app.post("/skills/import/preview", response_class=HTMLResponse)
async def preview_skills_import(request: Request, file: UploadFile = File(...)):
    temporary_path: Path | None = None
    try:
        temporary_path = await _save_upload_temporarily(file)
        preview = client_imports.prepare_skills_import(
            temporary_path,
            source_filename=file.filename or "competences.xlsx",
        )
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(request, active_tab="skills", skills_preview=preview),
            status_code=200 if preview["can_confirm"] else 400,
        )
    except (OSError, ValueError) as exc:
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(request, active_tab="skills", error=str(exc)),
            status_code=400,
        )
    finally:
        if temporary_path is not None:
            temporary_path.unlink(missing_ok=True)


@app.post("/skills/import/confirm", response_class=HTMLResponse)
def confirm_skills_import(request: Request, import_token: str = Form(...)):
    try:
        result = client_imports.confirm_skills_import(import_token)
        message = (
            f"Compétences importées : {result['inserted']} ajout(s), "
            f"{result['skipped']} doublon(s) ignoré(s)."
        )
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(request, active_tab="skills", success_message=message),
        )
    except (OSError, ValueError) as exc:
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(request, active_tab="skills", error=str(exc)),
            status_code=400,
        )


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
        preview = document_preview.create_preview_session(
            result.pack_dir,
            PREVIEW_DIR,
            metadata={
                "ats_score": result.ats_score,
                "company": result.company,
                "job_title": result.job_title,
            },
        )
        return templates.TemplateResponse(
            request,
            "preview.html",
            _context(
                request,
                preview=preview,
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
        preview = document_preview.create_preview_session(
            result.pack_dir,
            PREVIEW_DIR,
            metadata={
                "ats_score": result.ats_score,
                "company": result.company,
                "job_title": result.job_title,
            },
        )
        return templates.TemplateResponse(
            request,
            "preview.html",
            _context(
                request,
                preview=preview,
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
    try:
        temporary_path = await _save_upload_temporarily(file)
    except ValueError as exc:
        return templates.TemplateResponse(
            request,
            "index.html",
            _context(request, active_tab="setup", error=str(exc)),
            status_code=400,
        )
    try:
        try:
            reference_manager.replace_reference(key, temporary_path)
        except ValueError as exc:
            return templates.TemplateResponse(
                request,
                "index.html",
                _context(request, active_tab="setup", error=str(exc)),
                status_code=400,
            )
    finally:
        temporary_path.unlink(missing_ok=True)
    return RedirectResponse(url="/?tab=setup", status_code=303)


@app.post("/prompts/{kind}")
def save_prompt(kind: str, value: str = Form(...)):
    prompt_overrides.save_override(kind, value)
    return RedirectResponse(url="/?tab=setup", status_code=303)


@app.post("/prompts/{kind}/reset")
def reset_prompt(kind: str):
    prompt_overrides.reset_override(kind)
    return RedirectResponse(url="/?tab=setup", status_code=303)


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
