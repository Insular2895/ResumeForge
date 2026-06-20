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
        web_app.document_preview,
        "create_preview_session",
        lambda pack_dir, session_root, **kwargs: {
            "preview_id": "preview-enrichment",
            "cv_generated": "<p>CV</p>",
            "cv_edited": "",
            "cv_is_dirty": False,
            "lm_generated": "<p>LM</p>",
            "lm_edited": "",
            "lm_is_dirty": False,
            "metadata": kwargs.get("metadata", {}),
        },
    )
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
    assert "preview-enrichment" in response.text
    assert "document-editor-root" in response.text
    assert "Prévisualisation" in response.text


def test_generate_route_opens_wordlike_tiptap_preview_after_success(tmp_path, monkeypatch):
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
        web_app.document_preview,
        "create_preview_session",
        lambda pack_dir, session_root, **kwargs: captured.setdefault(
            "session",
            {
                "preview_id": "preview123",
                "cv_generated": "<h1>Lucas Pertusa</h1><p>Acheteur</p>",
                "cv_edited": "",
                "cv_is_dirty": False,
                "lm_generated": "<p>Lettre générée</p>",
                "lm_edited": "",
                "lm_is_dirty": False,
                "metadata": kwargs.get("metadata", {}),
            },
        ),
    )

    response = client.post("/generate", data={"mode": "cv_lm", "job_text": "Offre"})

    assert response.status_code == 200
    assert "87%" in response.text
    assert "Ipsen · Gestionnaire ADV" in response.text
    assert "Prévisualisation" in response.text
    assert "document-editor-root" in response.text
    assert "document-editor-data" in response.text
    assert "document-editor.js" in response.text
    assert "preview123" in response.text
    assert "Télécharger ZIP" in response.text
    assert "Prévisualisation DOCX" not in response.text
    assert "Régénérer preview" not in response.text
    assert "OnlyOffice" not in response.text
    assert captured["session"]["preview_id"] == "preview123"
    assert web_app.SERVICE.kwargs["replace_existing"] is True


def test_direct_localhost_port_stays_on_app_with_unrelated_env(monkeypatch):
    monkeypatch.setenv("RESUMEFORGE_UNUSED_URL", "http://127.0.0.1:8766")
    client = TestClient(web_app.app, base_url="http://127.0.0.1:8765")

    response = client.get("/", follow_redirects=False)

    assert response.status_code == 200
    assert "ResumeForge" in response.text


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


def test_built_document_editor_bundle_is_browser_safe():
    bundle = web_app.WEB_DIR / "static" / "document-editor.js"

    assert bundle.exists()
    assert "process.env" not in bundle.read_text(encoding="utf-8")
    assert "document-workspace" in bundle.read_text(encoding="utf-8")
    assert "section-editor-panel" in bundle.read_text(encoding="utf-8")
    assert "LockedDocumentPreview" in (web_app.WEB_DIR / "frontend" / "main.tsx").read_text(encoding="utf-8")
    assert "SectionFieldsEditor" in (web_app.WEB_DIR / "frontend" / "main.tsx").read_text(encoding="utf-8")


def test_wordlike_editor_css_locks_a4_layout_and_print_export_styles():
    styles = (web_app.WEB_DIR / "static" / "styles.css").read_text(encoding="utf-8")

    assert ".word-like-editor" in styles
    assert ".locked-document-preview" in styles
    assert ".section-editor-panel" in styles
    assert "width: 210mm" in styles
    assert "min-height: 297mm" in styles
    assert "padding: 17mm 12.5mm 11mm" in styles
    assert "img:first-child" in styles
    assert "border-radius: 999px" in styles
    assert "padding-left: 34mm" in styles
    assert "text-align: center" in styles
    assert "border-bottom: 0" in styles
    assert "@media print" in styles
    assert ".document-workspace" in styles
    assert "background: #eef1f6" in styles


def test_preview_page_can_show_saved_result_metadata_without_fresh_generation(tmp_path, monkeypatch):
    monkeypatch.setattr(web_app, "PREVIEW_DIR", tmp_path / "previews")
    preview = {
        "preview_id": "preview123",
        "cv_generated": "<p>CV</p>",
        "cv_edited": "",
        "cv_is_dirty": False,
        "cv_document": {"image_html": "", "blocks": []},
        "lm_generated": "<p>LM</p>",
        "lm_edited": "",
        "lm_is_dirty": False,
        "lm_document": {"image_html": "", "blocks": []},
        "metadata": {"ats_score": 87, "company": "Ipsen", "job_title": "Gestionnaire ADV"},
    }
    monkeypatch.setattr(web_app.document_preview, "load_preview_session", lambda preview_id, preview_root: preview)
    client = TestClient(web_app.app)

    response = client.get("/preview/preview123")

    assert response.status_code == 200
    assert "87%" in response.text
    assert "Ipsen · Gestionnaire ADV" in response.text


def test_hidden_attribute_is_not_overridden_by_notice_styles():
    styles = (web_app.WEB_DIR / "static" / "styles.css").read_text(encoding="utf-8")

    assert "[hidden]" in styles
    assert "display: none !important" in styles


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
