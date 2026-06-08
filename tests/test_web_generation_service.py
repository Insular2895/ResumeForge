import json
import subprocess
import sys
import threading
from pathlib import Path

import pytest

from src.web.generation_service import (
    GenerationBusyError,
    GenerationError,
    GenerationService,
    build_menu_input,
    validate_mode_request,
    verify_application_pack,
)


def _statuses(*ready_keys):
    keys = {"master_profile", "cv_template", "lm_template", "reference_cv"}
    return {key: {"ready": key in ready_keys} for key in keys}


def _pack(tmp_path: Path, *, cv=True, lm=False, validation_status=None) -> Path:
    pack = tmp_path / "87% Ipsen - Gestionnaire ADV - 20260608"
    pack.mkdir(parents=True)
    if cv:
        (pack / "CV - Ipsen - Gestionnaire ADV.docx").write_bytes(b"cv")
    if lm:
        (pack / "LM - Ipsen - Gestionnaire ADV.docx").write_bytes(b"lm")
    if validation_status:
        (pack / "validation.json").write_text(
            json.dumps(
                {
                    "validation_status": validation_status,
                    "company": "Ipsen",
                    "job_title": "Gestionnaire ADV",
                    "ats_score": 87,
                }
            ),
            encoding="utf-8",
        )
    return pack


def test_build_menu_input_maps_each_mode():
    assert build_menu_input("cv", "Offre") == "1\nOffre\nFIN\n"
    assert build_menu_input("cv_lm", "Offre") == "2\nOffre\nFIN\n"
    assert build_menu_input("lm_only", "Offre") == "3\n\nOffre\nFIN\n"


def test_validate_mode_request_checks_mode_specific_references():
    validate_mode_request("cv", "Offre", _statuses("master_profile", "cv_template"), {})
    validate_mode_request(
        "lm_only",
        "Offre",
        _statuses("reference_cv", "lm_template"),
        {"GEMINI_LETTER_API_KEY": "secret"},
    )

    with pytest.raises(GenerationError, match="Template LM"):
        validate_mode_request(
            "cv_lm",
            "Offre",
            _statuses("master_profile", "cv_template"),
            {"GEMINI_LETTER_API_KEY": "secret"},
        )


def test_verify_application_pack_enforces_each_mode_contract(tmp_path):
    cv_pack = _pack(tmp_path / "cv")
    assert verify_application_pack("cv", cv_pack)["cv_files"]

    full_pack = _pack(tmp_path / "full", lm=True, validation_status="success")
    assert verify_application_pack("cv_lm", full_pack)["lm_files"]
    assert verify_application_pack("lm_only", full_pack)["lm_files"]


def test_verify_application_pack_rejects_partial_cv_lm_success(tmp_path):
    pack = _pack(tmp_path, lm=False, validation_status="skipped")

    with pytest.raises(GenerationError, match="LM"):
        verify_application_pack("cv_lm", pack)


def test_generation_service_rejects_concurrent_web_run(tmp_path):
    entered = threading.Event()
    release = threading.Event()

    def blocking_runner(**kwargs):
        entered.set()
        release.wait(timeout=3)
        return subprocess.CompletedProcess(args=[], returncode=1, stdout="", stderr="stopped")

    service = GenerationService(
        project_root=tmp_path,
        packs_dir=tmp_path / "packs",
        current_result_dir=tmp_path / "current",
        runner=blocking_runner,
    )
    service.reference_status_provider = lambda: _statuses("master_profile", "cv_template")

    thread = threading.Thread(target=lambda: pytest.raises(GenerationError, service.run, "cv", "Offre"))
    thread.start()
    assert entered.wait(timeout=2)

    with pytest.raises(GenerationBusyError, match="déjà"):
        service.run("cv", "Offre")

    release.set()
    thread.join(timeout=3)


def test_generation_service_uses_current_python_interpreter(tmp_path):
    captured = {}
    pack = _pack(tmp_path / "packs")

    def successful_runner(**kwargs):
        captured.update(kwargs)
        return subprocess.CompletedProcess(args=kwargs["args"], returncode=0, stdout="", stderr="")

    service = GenerationService(
        project_root=tmp_path,
        packs_dir=tmp_path / "packs",
        current_result_dir=tmp_path / "current",
        runner=successful_runner,
    )
    service.reference_status_provider = lambda: _statuses("master_profile", "cv_template")
    service._latest_pack_after = lambda started_at: pack

    service.run("cv", "Offre")

    assert captured["args"][0] == sys.executable
