from pathlib import Path


def test_onlyoffice_local_script_patches_document_server_timeout():
    script = Path("scripts/run_onlyoffice_local.sh").read_text(encoding="utf-8")
    nginx_config = Path("scripts/nginx-resumeforge-onlyoffice.conf").read_text(encoding="utf-8")

    assert "ALLOW_PRIVATE_IP_ADDRESS=true" in script
    assert "RESET_ONLYOFFICE" in script
    assert "RESUMEFORGE_PROXY_PORT" not in script
    assert "docker run" not in script.split("Préchauffage de l'API OnlyOffice...")[-1]
    assert "ONLYOFFICE_DOCUMENT_SERVER_URL=\"http://127.0.0.1:8080\"" in script
    assert "ONLYOFFICE_PUBLIC_APP_URL=\"http://host.docker.internal:8765\"" in script
    assert "RESUMEFORGE_HOST=127.0.0.1" in script
    assert "réutilisation du conteneur chaud" in script
    assert "document_editor_service_worker" in script
    assert "service worker disabled by ResumeForge local launcher" in script
    assert "perl -0pi" in script
    assert "resumeforge-sw-cleanup.html" in script
    assert "serviceWorker" in script
    assert "navigator.serviceWorker.getRegistrations" in script
    assert "caches.delete" in script
    assert "waitSeconds: 120" in script
    assert "120000" in script
    assert "return 204" in nginx_config
    assert "X-Forwarded-Host $http_host/onlyoffice-ds" not in nginx_config
    assert "X-Forwarded-Host $http_host" in nginx_config
    assert "proxy_set_header Upgrade $http_upgrade" in nginx_config
