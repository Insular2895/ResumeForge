from pathlib import Path

from fastapi.testclient import TestClient

from src.web import app as web_app
from src.web.generation_service import GenerationBusyError, GenerationError, GenerationResult


class FakeService:
    def __init__(self, result=None, error=None):
        self.result = result
        self.error = error

    def run(self, mode, job_text):
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
    assert 'id="generation-progress"' in response.text
    assert 'id="generate-button"' in response.text
    assert "Génération en cours" in response.text
    assert "form.dataset.submitted" in response.text


def test_generate_route_shows_download_after_success(tmp_path, monkeypatch):
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
    client = TestClient(web_app.app)

    response = client.post("/generate", data={"mode": "cv_lm", "job_text": "Offre"})

    assert response.status_code == 200
    assert "87%" in response.text
    assert "Télécharger le pack" in response.text


def test_generate_route_shows_readable_error(monkeypatch):
    monkeypatch.setattr(web_app, "SERVICE", FakeService(error=GenerationError("Template LM manquant.")))
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
