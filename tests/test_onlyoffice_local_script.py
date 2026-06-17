from pathlib import Path


def test_onlyoffice_local_script_patches_document_server_timeout():
    script = Path("scripts/run_onlyoffice_local.sh").read_text(encoding="utf-8")
    nginx_config = Path("scripts/nginx-resumeforge-onlyoffice.conf").read_text(encoding="utf-8")

    assert "ALLOW_PRIVATE_IP_ADDRESS=true" in script
    assert "RESET_ONLYOFFICE" in script
    assert "RESUMEFORGE_PROXY_PORT" in script
    assert "resumeforge-onlyoffice-proxy" in script
    assert "ONLYOFFICE_DOCUMENT_SERVER_URL=\"http://127.0.0.1:$PROXY_PORT/onlyoffice-ds\"" in script
    assert "ONLYOFFICE_PUBLIC_APP_URL=\"http://$RF_IP:$PROXY_PORT\"" in script
    assert "réutilisation du conteneur chaud" in script
    assert "document_editor_service_worker.js" in script
    assert "service worker disabled by ResumeForge local launcher" in script
    assert "waitSeconds: 120" in script
    assert "120000" in script
    assert "X-Forwarded-Host $http_host/onlyoffice-ds" in nginx_config
    assert "proxy_set_header Upgrade $http_upgrade" in nginx_config
