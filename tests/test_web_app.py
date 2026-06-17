from pathlib import Path

from fastapi.testclient import TestClient

from src.web import app as web_app
from src.web.generation_service import GenerationBusyError, GenerationError, GenerationResult


class FakeService:
    def __init__(self, result=None, error=None):
        self.result = result
        self.error = error

    def run(self, mode, job_text, target_domain="", **kwargs):
        self.target_domain = target_domain
        self.kwargs = kwargs
        if self.error:
            raise self.error
        return self.result


def test_server_is_configured_for_localhost_only():
    assert web_app.HOST == "127.0.0.1"


def test_home_page_contains_minimal_primary_flow(monkeypatch):
    monkeypatch.setattr(
        web_app.reference_manager,
        "get_reference_statuses",
        lambda: {
            "master_profile": {"label": "Profil Excel maître", "ready": True, "filename": "master.xlsx"},
        },
    )
    client = TestClient(web_app.app)

    response = client.get("/")

    assert response.status_code == 200
    assert "ResumeForge" in response.text
    assert "CV + LM" in response.text
    assert "Générer" in response.text
    assert "Références locales" in response.text
    assert "Paramètres avancés" in response.text
    assert 'href="/static/styles.css"' in response.text
    assert 'id="generation-progress"' in response.text
    assert 'id="generate-button"' in response.text
    assert "Génération en cours" in response.text
    assert "form.dataset.submitted" in response.text
    assert 'window.addEventListener("pageshow", resetGenerationForm)' in response.text
    assert "Métier cible" in response.text
    assert "Tout autre métier sera détecté depuis l’offre" in response.text
    assert "Décrivez concrètement ce que vous faisiez au quotidien" in response.text
    assert "documents/preload.html" not in response.text


def test_generate_route_opens_enrichment_popup_when_coverage_is_low(monkeypatch):
    monkeypatch.setattr(
        web_app,
        "assess_profile_for_job",
        lambda job_text, target_domain="": {
            "target_domain": "data_analytics",
            "target_label": "Data Analyst",
            "overall_score": 18,
            "threshold": 45,
            "status": "enrichment_required",
            "layers": {},
            "questions": ["Avez-vous utilisé Excel, SQL, Python ou des outils BI ?"],
        },
    )
    client = TestClient(web_app.app)

    response = client.post(
        "/generate",
        data={"mode": "cv", "job_text": "Data Analyst SQL", "target_domain": "data_analytics"},
    )

    assert response.status_code == 200
    assert 'id="enrichment-dialog"' in response.text
    assert "18%" in response.text
    assert "Avez-vous utilisé Excel" in response.text


def test_enrichment_confirmation_writes_memory_then_generates(tmp_path, monkeypatch):
    zip_path = tmp_path / "pack.zip"
    zip_path.write_bytes(b"zip")
    result = GenerationResult(
        mode="cv",
        company="Entreprise",
        job_title="Data Analyst",
        ats_score=80,
        pack_dir=tmp_path,
        zip_path=zip_path,
        files=("CV.docx",),
    )
    captured = {}
    monkeypatch.setattr(web_app, "SERVICE", FakeService(result=result))
    monkeypatch.setattr(
        web_app.experience_memory,
        "add_validated_memory",
        lambda payload: captured.update(payload),
    )
    monkeypatch.setattr(
        web_app,
        "assess_profile_for_job",
        lambda job_text, target_domain="": {
            "target_domain": target_domain,
            "target_label": "Data Analyst",
            "overall_score": 75,
            "threshold": 45,
            "status": "ready",
            "layers": {},
            "questions": [],
        },
    )
    monkeypatch.setattr(
        web_app.onlyoffice_integration,
        "create_onlyoffice_session",
        lambda pack_dir, session_root: {
            "session_id": "onlyoffice-enrichment",
            "documents": {"cv": {"label": "CV", "filename": "CV_Lucas_Pertusa.docx", "key": "key"}},
        },
    )
    monkeypatch.setattr(web_app.onlyoffice_integration, "build_editor_configs", lambda session, app_base_url: {"cv": {}})
    client = TestClient(web_app.app)

    response = client.post(
        "/enrichment/confirm",
        data={
            "mode": "cv",
            "job_text": "Data Analyst SQL",
            "target_domain": "data_analytics",
            "experience_id": "exp_1",
            "free_text": "Je construisais des tableaux Excel.",
            "question": ["Créiez-vous des reportings ?"],
            "answer": ["Je produisais des reportings."],
        },
    )

    assert response.status_code == 200
    assert captured["target_domain"] == "data_analytics"
    assert captured["free_text"] == "Je construisais des tableaux Excel."
    assert captured["qa_pairs"] == [{"question": "Créiez-vous des reportings ?", "answer": "Je produisais des reportings."}]
    assert web_app.SERVICE.target_domain == "data_analytics"
    assert "80%" in response.text
    assert "onlyoffice-enrichment" in response.text


def test_generate_route_opens_onlyoffice_after_success(tmp_path, monkeypatch):
    zip_path = tmp_path / "87% Ipsen - Gestionnaire ADV.zip"
    zip_path.write_bytes(b"zip")
    result = GenerationResult(
        mode="cv_lm",
        company="Ipsen",
        job_title="Gestionnaire ADV",
        ats_score=87,
        pack_dir=tmp_path,
        zip_path=zip_path,
        files=("CV.docx", "LM.docx"),
    )
    monkeypatch.setattr(web_app, "SERVICE", FakeService(result=result))
    monkeypatch.setattr(web_app, "assess_profile_for_job", lambda *args: {"status": "ready", "target_domain": "dynamic_test"})
    client = TestClient(web_app.app)

    captured = {}
    monkeypatch.setattr(
        web_app.onlyoffice_integration,
        "create_onlyoffice_session",
        lambda pack_dir, session_root: captured.setdefault(
            "session",
            {
                "session_id": "office123",
                "documents": {
                    "cv": {"label": "CV", "filename": "CV_Lucas_Pertusa.docx", "key": "cv-key"},
                    "lm": {"label": "Lettre de motivation", "filename": "Lettre_Motivation_Lucas_Pertusa.docx", "key": "lm-key"},
                },
            },
        ),
    )
    monkeypatch.setattr(web_app.onlyoffice_integration, "build_editor_configs", lambda session, app_base_url: {"cv": {}, "lm": {}})

    response = client.post("/generate", data={"mode": "cv_lm", "job_text": "Offre"})

    assert response.status_code == 200
    assert "87%" in response.text
    assert "Éditeur DOCX" in response.text
    assert 'id="onlyoffice-editor"' in response.text
    assert 'id="onlyoffice-api-url"' in response.text
    assert "loadOnlyOfficeApi" in response.text
    assert "showFrameTimeoutError" in response.text
    assert "preload=onlyoffice-preload" not in response.text
    assert "readyTimeoutMs = 60000" in response.text
    assert "cache/service worker OnlyOffice bloqué" in response.text
    assert "maxAutoRetries = 1" in response.text
    assert "Réessayer l'ouverture" in response.text
    assert "Copier commande Arc" in response.text
    assert "/onlyoffice/client-events" in response.text
    assert "sendClientEvent" in response.text
    assert "clearOnlyOfficeBrowserState" in response.text
    assert "service-worker-unregistered" in response.text
    assert "onlyoffice-browser-warning" in response.text
    assert "office123" in response.text
    assert captured["session"]["session_id"] == "office123"
    assert web_app.SERVICE.kwargs["replace_existing"] is True


def test_direct_localhost_port_redirects_to_proxy_when_proxy_enabled(monkeypatch):
    monkeypatch.setenv("ONLYOFFICE_DOCUMENT_SERVER_URL", "http://127.0.0.1:8766/onlyoffice-ds")
    client = TestClient(web_app.app, base_url="http://127.0.0.1:8765")

    response = client.get("/", follow_redirects=False)

    assert response.status_code == 307
    assert response.headers["location"].startswith("http://127.0.0.1:8766/")


def test_onlyoffice_client_event_route_records_browser_diagnostics():
    web_app.ONLYOFFICE_CLIENT_EVENTS.clear()
    client = TestClient(web_app.app)

    response = client.post(
        "/onlyoffice/client-events",
        json={
            "event": "onAppReady",
            "session_id": "session",
            "kind": "cv",
            "url": "http://127.0.0.1:8766/onlyoffice/session",
            "api_url": "http://127.0.0.1:8766/onlyoffice-ds/api.js",
            "frame_url": "http://127.0.0.1:8766/onlyoffice-ds/frame",
            "user_agent": "test-browser",
        },
    )
    events = client.get("/onlyoffice/client-events")

    assert response.status_code == 200
    assert events.json()["events"][-1]["event"] == "onAppReady"
    assert events.json()["events"][-1]["user_agent"] == "test-browser"


def test_preview_export_route_returns_final_zip(tmp_path, monkeypatch):
    zip_path = tmp_path / "final.zip"
    zip_path.write_bytes(b"zip")
    captured = {}
    monkeypatch.setattr(web_app, "PREVIEW_DIR", tmp_path / "previews")
    monkeypatch.setattr(web_app, "FINAL_EXPORT_DIR", tmp_path / "exports")
    def fake_export(preview_id, preview_root, output_root, **kwargs):
        captured["args"] = {
            "preview_id": preview_id,
            "preview_root": preview_root,
            "output_root": output_root,
            **kwargs,
        }
        return zip_path

    monkeypatch.setattr(web_app.document_preview, "export_final_zip", fake_export)
    client = TestClient(web_app.app)

    response = client.post(
        "/preview/abc/export",
        data={
            "cv_edited": "<p>CV édité</p>",
            "cv_is_dirty": "true",
            "lm_edited": "<p>LM éditée</p>",
            "lm_is_dirty": "false",
        },
    )

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/zip"
    assert captured["args"]["preview_id"] == "abc"
    assert captured["args"]["cv_is_dirty"] is True
    assert captured["args"]["lm_is_dirty"] is False


def test_onlyoffice_export_route_returns_final_zip(tmp_path, monkeypatch):
    zip_path = tmp_path / "office.zip"
    zip_path.write_bytes(b"zip")
    captured = {}
    monkeypatch.setattr(web_app, "ONLYOFFICE_SESSION_DIR", tmp_path / "sessions")
    monkeypatch.setattr(web_app, "ONLYOFFICE_EXPORT_DIR", tmp_path / "exports")
    monkeypatch.setattr(
        web_app.onlyoffice_integration,
        "export_onlyoffice_zip",
        lambda session_id, session_root, output_root: captured.setdefault(
            "args",
            {
                "session_id": session_id,
                "session_root": session_root,
                "output_root": output_root,
            },
        )
        and zip_path,
    )
    client = TestClient(web_app.app)

    response = client.get("/onlyoffice/sessions/office123/export")

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/zip"
    assert captured["args"]["session_id"] == "office123"


def test_onlyoffice_callback_route_saves_status(tmp_path, monkeypatch):
    captured = {}
    monkeypatch.setattr(web_app, "ONLYOFFICE_SESSION_DIR", tmp_path / "sessions")
    def fake_callback(session_id, kind, payload, session_root):
        captured["args"] = {
            "session_id": session_id,
            "kind": kind,
            "payload": payload,
            "session_root": session_root,
        }
        return {"error": 0}

    monkeypatch.setattr(
        web_app.onlyoffice_integration,
        "handle_callback",
        fake_callback,
    )
    client = TestClient(web_app.app)

    response = client.post("/onlyoffice/sessions/office123/callback/cv", json={"status": 2, "url": "http://doc"})

    assert response.status_code == 200
    assert response.json() == {"error": 0}
    assert captured["args"]["kind"] == "cv"
    assert captured["args"]["payload"]["status"] == 2


def test_built_document_editor_bundle_is_browser_safe():
    bundle = web_app.WEB_DIR / "static" / "document-editor.js"

    assert bundle.exists()
    assert "process.env" not in bundle.read_text(encoding="utf-8")
    assert "document-workspace" in bundle.read_text(encoding="utf-8")


def test_hidden_attribute_is_not_overridden_by_notice_styles():
    styles = (web_app.WEB_DIR / "static" / "styles.css").read_text(encoding="utf-8")

    assert "[hidden]" in styles
    assert "display: none !important" in styles


def test_onlyoffice_toolbar_primary_button_stays_compact():
    styles = (web_app.WEB_DIR / "static" / "styles.css").read_text(encoding="utf-8")

    assert ".onlyoffice-toolbar .button.primary" in styles
    assert "width: auto" in styles


def test_generate_route_shows_readable_error(monkeypatch):
    monkeypatch.setattr(web_app, "SERVICE", FakeService(error=GenerationError("Template LM manquant.")))
    monkeypatch.setattr(web_app, "assess_profile_for_job", lambda *args: {"status": "ready", "target_domain": "dynamic_test"})
    client = TestClient(web_app.app)

    response = client.post("/generate", data={"mode": "cv_lm", "job_text": "Offre"})

    assert response.status_code == 400
    assert "Template LM manquant." in response.text


def test_generate_route_returns_conflict_when_generation_is_already_running(monkeypatch):
    monkeypatch.setattr(
        web_app,
        "SERVICE",
        FakeService(error=GenerationBusyError("Une génération web est déjà en cours.")),
    )
    monkeypatch.setattr(web_app, "assess_profile_for_job", lambda *args: {"status": "ready", "target_domain": "dynamic_test"})
    client = TestClient(web_app.app)

    response = client.post("/generate", data={"mode": "cv_lm", "job_text": "Offre"})

    assert response.status_code == 409
    assert "déjà en cours" in response.text


def test_prompt_save_and_reset_routes(tmp_path, monkeypatch):
    monkeypatch.setattr(web_app.prompt_overrides, "LOCAL_CONFIG_DIR", tmp_path)
    client = TestClient(web_app.app)

    saved = client.post("/prompts/cv", data={"value": "Reste factuel."}, follow_redirects=False)
    assert saved.status_code == 303
    assert (tmp_path / "cv_prompt.txt").exists()

    reset = client.post("/prompts/cv/reset", follow_redirects=False)
    assert reset.status_code == 303
    assert not (tmp_path / "cv_prompt.txt").exists()


def test_reference_upload_validation_error_is_readable(tmp_path, monkeypatch):
    monkeypatch.setattr(
        web_app.reference_manager,
        "replace_reference",
        lambda key, path: (_ for _ in ()).throw(ValueError("Template invalide.")),
    )
    client = TestClient(web_app.app)

    response = client.post(
        "/references/cv_template",
        files={"file": ("template.docx", b"bad", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
    )

    assert response.status_code == 400
    assert "Template invalide." in response.text


def test_experience_proposal_is_shown_before_master_update(monkeypatch):
    proposal = {
        "company": "Passy Primeur",
        "job_title": "Primeur sur les marchés",
        "location": "",
        "date_start": "",
        "date_end": "",
        "context": "Expérience terrain",
        "bullets": ["Achat", "Négociation", "Transport", "Veille", "Pricing"],
        "tools_verified": ["Bloomberg"],
        "skills_verified": ["supplier_negotiation"],
        "skills_transferable": ["pricing_analysis"],
        "industry_tags": ["fruits_legumes"],
        "job_family_tags": ["achats"],
    }
    monkeypatch.setattr(web_app.experience_intake, "propose_experience", lambda *args: proposal)
    client = TestClient(web_app.app)

    response = client.post(
        "/experiences/propose",
        data={"experience_text": "Ancienne expérience", "mode": "cv_lm", "job_text": "Offre"},
    )

    assert response.status_code == 200
    assert "Valider et régénérer" in response.text
    assert "Passy Primeur" in response.text
    assert "Achat" in response.text


def test_experience_proposal_runtime_error_is_readable(monkeypatch):
    monkeypatch.setattr(
        web_app.experience_intake,
        "propose_experience",
        lambda *args: (_ for _ in ()).throw(RuntimeError("Gemini indisponible.")),
    )
    client = TestClient(web_app.app)

    response = client.post(
        "/experiences/propose",
        data={"experience_text": "Ancienne expérience suffisamment détaillée.", "mode": "cv", "job_text": "Offre"},
    )

    assert response.status_code == 400
    assert "Gemini indisponible." in response.text


def test_experience_confirmation_updates_master_then_regenerates(tmp_path, monkeypatch):
    zip_path = tmp_path / "pack.zip"
    zip_path.write_bytes(b"zip")
    result = GenerationResult(
        mode="cv",
        company="FERRO",
        job_title="Acheteur",
        ats_score=91,
        pack_dir=tmp_path,
        zip_path=zip_path,
        files=("CV.docx",),
    )
    captured = {}
    monkeypatch.setattr(web_app, "SERVICE", FakeService(result=result))
    monkeypatch.setattr(
        web_app.experience_intake,
        "add_validated_experience",
        lambda proposal: captured.update(proposal),
    )
    client = TestClient(web_app.app)

    response = client.post(
        "/experiences/confirm",
        data={
            "mode": "cv",
            "job_text": "Offre FERRO",
            "company": "Passy Primeur",
            "job_title": "Primeur",
            "location": "",
            "date_start": "",
            "date_end": "",
            "context": "",
            "bullet_1": "A",
            "bullet_2": "B",
            "bullet_3": "C",
            "bullet_4": "D",
            "bullet_5": "E",
            "tools_verified": "Bloomberg | World Monitor",
            "skills_verified": "supplier_negotiation",
            "skills_transferable": "pricing_analysis",
            "industry_tags": "fruits_legumes",
            "job_family_tags": "achats",
        },
    )

    assert response.status_code == 200
    assert captured["company"] == "Passy Primeur"
    assert captured["bullets"] == ["A", "B", "C", "D", "E"]
    assert "91%" in response.text
