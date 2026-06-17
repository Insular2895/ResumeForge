#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

RESET_ONLYOFFICE="${RESET_ONLYOFFICE:-0}"

if [[ "$RESET_ONLYOFFICE" == "1" ]]; then
  echo "Reset OnlyOffice Document Server..."
  docker rm -f onlyoffice-documentserver >/dev/null 2>&1 || true
  docker rm -f resumeforge-onlyoffice-proxy >/dev/null 2>&1 || true
fi

if docker ps --format '{{.Names}}' | grep -qx 'onlyoffice-documentserver'; then
  echo "OnlyOffice Document Server déjà lancé, réutilisation du conteneur chaud."
elif docker ps -a --format '{{.Names}}' | grep -qx 'onlyoffice-documentserver'; then
  echo "Redémarrage du conteneur OnlyOffice existant..."
  docker start onlyoffice-documentserver >/dev/null
else
  echo "Démarrage OnlyOffice Document Server..."
  docker run -d \
    --name onlyoffice-documentserver \
    -p 8080:80 \
    -e JWT_ENABLED=false \
    -e ALLOW_PRIVATE_IP_ADDRESS=true \
    -e ALLOW_META_IP_ADDRESS=true \
    onlyoffice/documentserver >/dev/null
fi

echo "Attente du healthcheck OnlyOffice..."
for _ in {1..90}; do
  if /usr/bin/curl -fsS "http://127.0.0.1:8080/healthcheck" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

if ! /usr/bin/curl -fsS "http://127.0.0.1:8080/healthcheck" >/dev/null 2>&1; then
  echo "OnlyOffice ne répond pas sur http://127.0.0.1:8080/healthcheck." >&2
  exit 1
fi

echo "Patch du timeout OnlyOffice local à 120 secondes..."
docker exec onlyoffice-documentserver sh -lc '
  for file in \
    /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/index.html \
    /var/www/onlyoffice/documentserver/web-apps/apps/spreadsheeteditor/main/index.html \
    /var/www/onlyoffice/documentserver/web-apps/apps/presentationeditor/main/index.html
  do
    [ -f "$file" ] || continue
    sed -i "s/}, 30000);/}, 120000);/g" "$file"
    sed -i "s/waitSeconds: 30/waitSeconds: 120/g" "$file"
  done
'

echo "Désactivation du service worker OnlyOffice local..."
docker exec onlyoffice-documentserver sh -lc '
  for file in \
    /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/index.html \
    /var/www/onlyoffice/documentserver/web-apps/apps/spreadsheeteditor/main/index.html \
    /var/www/onlyoffice/documentserver/web-apps/apps/presentationeditor/main/index.html
  do
    [ -f "$file" ] || continue
    before="$(grep -c "registerServiceWorker" "$file" || true)"
    perl -0pi -e "s|\\+function registerServiceWorker\\(\\)\\s*\\{.*?document_editor_service_worker\\.js.*?\\}\\(\\);|+function registerServiceWorker(){console.log(\"OnlyOffice service worker disabled by ResumeForge local launcher\");}();|s" "$file"
    after="$(grep -c "OnlyOffice service worker disabled by ResumeForge local launcher" "$file" || true)"
    echo "$file registerServiceWorker=$before disabled_marker=$after"
  done
'

echo "Installation de la page de nettoyage service worker OnlyOffice..."
cleanup_file="$(mktemp)"
cat > "$cleanup_file" <<'HTML'
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>ResumeForge OnlyOffice cleanup</title>
  </head>
  <body>
    <script>
      (async () => {
        const result = {
          type: "resumeforge-onlyoffice-cleanup",
          ok: true,
          registrations: 0,
          caches: 0,
          error: "",
        };
        try {
          if ("serviceWorker" in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            result.registrations = registrations.length;
            await Promise.all(registrations.map((registration) => registration.unregister()));
          }
          if ("caches" in window) {
            const cacheNames = await caches.keys();
            result.caches = cacheNames.length;
            await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
          }
        } catch (error) {
          result.ok = false;
          result.error = String(error && error.message ? error.message : error);
        }
        window.parent.postMessage(result, "*");
      })();
    </script>
  </body>
</html>
HTML
docker cp "$cleanup_file" onlyoffice-documentserver:/var/www/onlyoffice/documentserver/web-apps/apps/api/documents/resumeforge-sw-cleanup.html
docker exec onlyoffice-documentserver chmod 644 /var/www/onlyoffice/documentserver/web-apps/apps/api/documents/resumeforge-sw-cleanup.html
rm -f "$cleanup_file"

echo "Préchauffage de l'API OnlyOffice..."
/usr/bin/curl -fsS "http://127.0.0.1:8080/web-apps/apps/api/documents/api.js" >/dev/null || true
/usr/bin/curl -fsS "http://127.0.0.1:8080/web-apps/apps/api/documents/resumeforge-sw-cleanup.html" >/dev/null || true

echo "ResumeForge : http://127.0.0.1:8765"
(
  sleep 2
  open -a "Arc" "http://127.0.0.1:8765" >/dev/null 2>&1 || open "http://127.0.0.1:8765" >/dev/null 2>&1 || true
) &

RESUMEFORGE_HOST=127.0.0.1 \
ONLYOFFICE_DOCUMENT_SERVER_URL="http://127.0.0.1:8080" \
ONLYOFFICE_PUBLIC_APP_URL="http://host.docker.internal:8765" \
exec src/.venv/bin/python run_web.py
