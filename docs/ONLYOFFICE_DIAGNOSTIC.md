# OnlyOffice `onAppReady` diagnostic

## Symptom

In ResumeForge's local OnlyOffice DOCX editor, the UI can show:

```text
OnlyOffice indisponible
OnlyOffice a chargé son API mais l'éditeur ne renvoie pas onAppReady.
Le plus probable est un cache/service worker OnlyOffice bloqué dans ce profil navigateur.
```

This means the browser successfully loaded `api.js` and created the OnlyOffice
iframe, but the editor never called `onAppReady`.

## Local architecture

The local development flow runs:

```text
Browser
  -> http://127.0.0.1:8765
  -> ResumeForge FastAPI

OnlyOffice Document Server
  -> http://127.0.0.1:8080 for browser API assets
  -> http://host.docker.internal:8765 for document download and callbacks
```

The launcher is:

```bash
./scripts/run_onlyoffice_local.sh
```

It starts/reuses:

- `onlyoffice-documentserver` on `127.0.0.1:8080`
- ResumeForge on `127.0.0.1:8765`

The previous local proxy on `127.0.0.1:8766` is no longer used by the launcher.
Its nginx config remains in the repository only as a reference/fallback.

## Evidence gathered

The app records browser-side events through:

```text
POST /onlyoffice/client-events
GET  /onlyoffice/client-events
```

Observed failing sequence in Arc/Chrome:

```text
page-loaded
api-script-start
api-script-loaded
iframe-created
frame-timeout-retry
iframe-created
frame-timeout-final
```

Missing events:

```text
onAppReady
onDocumentReady
```

A clean Chromium/headless profile reached `onAppReady` and `onDocumentReady`.
The user's Arc/Chrome profile did not.

Nginx logs showed the failing profile repeatedly requesting:

```text
document_editor_service_worker.js
```

but never reaching the expected OnlyOffice document websocket/callback flow.

An additional review found a likely proxy configuration bug in the old nginx
setup:

```nginx
proxy_set_header X-Forwarded-Host $http_host/onlyoffice-ds;
```

`X-Forwarded-Host` must contain a host, not a host plus path. The fallback nginx
config now uses:

```nginx
proxy_set_header X-Forwarded-Host $http_host;
```

## Current hypothesis

The most likely cause is stale browser-profile state from the OnlyOffice
document editor service worker.

Earlier local builds used the official OnlyOffice `preload.html` flow. That
page registers `document_editor_service_worker.js`. In a persistent browser
profile, that stale service worker can keep intercepting the editor bootstrap
even after the application code has changed.

After the default launcher was simplified to load OnlyOffice directly from
`127.0.0.1:8080`, the parent page at `127.0.0.1:8765` could no longer unregister
service workers that belong to the `8080` origin. The fix is therefore to serve
a cleanup page from the OnlyOffice origin itself and let that page unregister
its own service workers before ResumeForge loads `api.js`.

## Changes applied in this branch

1. Removed the local nginx proxy from the default launcher.
2. Browser opens ResumeForge directly on `http://127.0.0.1:8765`.
3. Browser loads OnlyOffice API assets directly from `http://127.0.0.1:8080`.
4. OnlyOffice downloads DOCX files and calls back through
   `http://host.docker.internal:8765`.
5. Removed the ResumeForge hidden OnlyOffice preload iframe.
6. Stopped loading `api.js` with `preload=onlyoffice-preload`.
7. Added browser-side cleanup before opening the editor:
   - find service workers scoped to `/onlyoffice-ds/`;
   - unregister them;
   - then load OnlyOffice `api.js`.
8. Patched the local Docker launcher to disable OnlyOffice's document editor
   service-worker registration inside the container for local development.
9. Increased the client-side ready timeout to 60 seconds to reduce false
   timeout errors on cold local starts.
10. Added client event logging and `/onlyoffice/health` so the next failure can
   be diagnosed by event sequence and URLs rather than screenshots only.
11. Added an inline debug panel in the editor page with browser origin,
   `apiUrl`, `document.url`, `callbackUrl`, iframe source and environment URLs.
12. Added `/web-apps/apps/api/documents/resumeforge-sw-cleanup.html` inside the
    local OnlyOffice container. ResumeForge loads it in a hidden iframe before
    `api.js`; it unregisters service workers and clears caches from the
    `127.0.0.1:8080` origin.

## Files of interest

- `src/web/templates/onlyoffice.html`
  - browser event instrumentation;
  - service-worker cleanup;
  - OnlyOffice script loading;
  - `onAppReady` / `onDocumentReady` callbacks.
- `scripts/run_onlyoffice_local.sh`
  - starts Docker services;
  - patches OnlyOffice timeout;
  - disables local service-worker registration;
  - installs the `resumeforge-sw-cleanup.html` cleanup page;
  - starts ResumeForge directly on `127.0.0.1:8765`.
- `scripts/nginx-resumeforge-onlyoffice.conf`
  - fallback/reference proxy config only;
  - fixes `X-Forwarded-Host`;
  - blocks the proxied service worker path with `204`.
- `src/web/app.py`
  - `/onlyoffice/client-events`;
  - `/onlyoffice/health`;
  - OnlyOffice session routes.
- `src/web/onlyoffice_integration.py`
  - DOCX session creation;
  - OnlyOffice editor config;
  - callback/export handling.

## Reproduction command

```bash
cd "/Users/insular/Desktop/ResumeReforge"
./scripts/run_onlyoffice_local.sh
```

Open:

```text
http://127.0.0.1:8765
```

If the editor still hangs, inspect:

```bash
curl -fsS http://127.0.0.1:8765/onlyoffice/client-events
curl -fsS http://127.0.0.1:8765/onlyoffice/health
curl -fsS http://127.0.0.1:8080/web-apps/apps/api/documents/resumeforge-sw-cleanup.html
docker logs --tail 200 onlyoffice-documentserver
```

## Open questions for external diagnosis

- Is disabling OnlyOffice's document editor service worker acceptable for local
  development, or is there a cleaner documented flag?
- If the fallback proxy is re-enabled, does OnlyOffice Document Server require
  more proxy headers beyond corrected `X-Forwarded-Host` and
  `X-Forwarded-Proto`?
- Can an existing service worker registered under the proxied OnlyOffice path
  interfere with `onAppReady` even after `api.js` is freshly loaded?
- Is there a better way to force a clean OnlyOffice bootstrap without requiring
  users to manually clear browser site data?

## Validation

Current automated checks:

```text
168 passed, 1 warning
```
