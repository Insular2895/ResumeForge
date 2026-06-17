from __future__ import annotations

from datetime import datetime
import json
from pathlib import Path
import shutil
import urllib.request
import uuid
import zipfile


FINAL_NAMES = {
    "cv": "CV_Lucas_Pertusa.docx",
    "lm": "Lettre_Motivation_Lucas_Pertusa.docx",
}

DEFAULT_DISABLED_PLUGINS = [
    "asc.{9DC93CDB-B576-4F0C-B55E-FCC9C48DD007}",  # AI
    "asc.{AA2EA9B6-9EC2-415F-9762-634EE8D9A95E}",  # Plugin Manager
    "asc.{F30BDD79-23A0-4B05-8DE3-2AB77D03A1B4}",  # Speech input
    "asc.{D71C2EF0-F15B-47C7-80E9-86D671F9C595}",  # Speech
    "asc.{440EBF13-9B19-4BD8-8621-05200E58140B}",  # OCR
    "asc.{7327FC95-16DA-41D9-9AF2-0E7F449F6800}",  # Translator
    "asc.{BE5CBF95-C0AD-4842-B157-AC40FEDD9841}",  # Highlight code
    "asc.{BFC5D5C6-89DE-4168-9565-ABD8D1E48711}",  # Zotero
    "asc.{07FD8DFA-DFE0-4089-AL24-0730933CC80A}",  # Photo Editor
    "asc.{BE5CBF95-C0AD-4842-B157-AC40FEDD9441}",  # Mendeley
    "asc.{BE5CBF95-C0AD-4842-B157-AC40FEDD9840}",  # Thesaurus
    "asc.{38E022EA-AD92-45FC-B22B-49DF39746DB4}",  # YouTube
]


def _first_file(pack_dir: Path, pattern: str) -> Path | None:
    matches = sorted(path for path in pack_dir.glob(pattern) if path.is_file())
    return matches[0] if matches else None


def _session_path(session_root: str | Path, session_id: str) -> Path:
    return Path(session_root) / str(session_id)


def _metadata_path(session_root: str | Path, session_id: str) -> Path:
    return _session_path(session_root, session_id) / "session.json"


def _save_session(session: dict, session_root: str | Path) -> None:
    root = _session_path(session_root, session["session_id"])
    root.mkdir(parents=True, exist_ok=True)
    _metadata_path(session_root, session["session_id"]).write_text(
        json.dumps(session, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def load_onlyoffice_session(session_id: str, session_root: str | Path) -> dict:
    path = _metadata_path(session_root, session_id)
    if not path.exists():
        raise ValueError("Session OnlyOffice introuvable.")
    return json.loads(path.read_text(encoding="utf-8"))


def create_onlyoffice_session(pack_dir: str | Path, session_root: str | Path) -> dict:
    pack = Path(pack_dir)
    if not pack.is_dir():
        raise ValueError("Pack de candidature introuvable.")

    sources = {
        "cv": _first_file(pack, "CV*.docx"),
        "lm": _first_file(pack, "LM*.docx"),
    }
    if not any(sources.values()):
        raise ValueError("Aucun DOCX éditable trouvé dans le pack.")

    session_id = uuid.uuid4().hex
    root = _session_path(session_root, session_id)
    root.mkdir(parents=True, exist_ok=True)

    documents: dict[str, dict] = {}
    for kind, source in sources.items():
        if not source:
            continue
        filename = FINAL_NAMES[kind]
        destination = root / filename
        shutil.copy2(source, destination)
        documents[kind] = {
            "kind": kind,
            "label": "CV" if kind == "cv" else "Lettre de motivation",
            "filename": filename,
            "title": filename,
            "source_name": source.name,
            "key": f"{session_id}-{kind}-{uuid.uuid4().hex[:12]}",
            "saved_at": "",
        }

    session = {
        "session_id": session_id,
        "pack_dir": str(pack),
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "documents": documents,
    }
    _save_session(session, session_root)
    return session


def build_document_config(
    session: dict,
    kind: str,
    *,
    app_base_url: str,
) -> dict:
    document = session["documents"][kind]
    base = app_base_url.rstrip("/")
    file_url = f"{base}/onlyoffice/sessions/{session['session_id']}/files/{document['filename']}?v={document['key']}"
    callback_url = f"{base}/onlyoffice/sessions/{session['session_id']}/callback/{kind}"
    return {
        "type": "desktop",
        "documentType": "word",
        "height": "820px",
        "width": "100%",
        "document": {
            "fileType": "docx",
            "key": document["key"],
            "title": document["title"],
            "url": file_url,
            "permissions": {
                "edit": True,
                "download": True,
                "print": True,
                "review": True,
                "comment": False,
                "chat": False,
            },
        },
        "editorConfig": {
            "mode": "edit",
            "lang": "fr",
            "callbackUrl": callback_url,
            "coEditing": {"mode": "fast", "change": True},
            "plugins": {"disable": DEFAULT_DISABLED_PLUGINS},
            "user": {"id": "lucas-pertusa", "name": "Lucas Pertusa"},
            "customization": {
                "autosave": True,
                "comments": False,
                "features": {"spellcheck": False},
                "forcesave": True,
                "help": False,
                "hideRightMenu": True,
                "macros": False,
                "compactToolbar": False,
            },
        },
    }


def build_editor_configs(session: dict, *, app_base_url: str) -> dict:
    return {
        kind: build_document_config(session, kind, app_base_url=app_base_url)
        for kind in session["documents"]
    }


def handle_callback(
    session_id: str,
    kind: str,
    payload: dict,
    *,
    session_root: str | Path,
) -> dict:
    session = load_onlyoffice_session(session_id, session_root)
    if kind not in session["documents"]:
        raise ValueError("Document OnlyOffice introuvable.")

    status = int(payload.get("status", 0) or 0)
    if status not in {2, 6}:
        return {"error": 0}

    file_url = str(payload.get("url") or "").strip()
    if not file_url:
        return {"error": 1}

    target = _session_path(session_root, session_id) / session["documents"][kind]["filename"]
    with urllib.request.urlopen(file_url, timeout=60) as response:
        target.write_bytes(response.read())

    session["documents"][kind]["saved_at"] = datetime.now().isoformat(timespec="seconds")
    if status == 2:
        session["documents"][kind]["key"] = f"{session_id}-{kind}-{uuid.uuid4().hex[:12]}"
    _save_session(session, session_root)
    return {"error": 0}


def export_onlyoffice_zip(
    session_id: str,
    session_root: str | Path,
    output_root: str | Path,
) -> Path:
    session = load_onlyoffice_session(session_id, session_root)
    output = Path(output_root)
    output.mkdir(parents=True, exist_ok=True)
    zip_path = output / "ResumeForge_documents_finaux.zip"
    if zip_path.exists():
        zip_path.unlink()

    root = _session_path(session_root, session_id)
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for kind in ("cv", "lm"):
            document = session["documents"].get(kind)
            if not document:
                continue
            path = root / document["filename"]
            if path.exists():
                archive.write(path, arcname=document["filename"])
    return zip_path
