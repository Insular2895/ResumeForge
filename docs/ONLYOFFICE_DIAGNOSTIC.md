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
  -> http://127.0.0.1:8766
  -> nginx local proxy
      /              -> ResumeForge FastAPI on host.docker.internal:8765
      /onlyoffice-ds -> OnlyOffice Document Server on host.docker.internal:8080
```

The launcher is:

```bash
./scripts/run_onlyoffice_local.sh
```

It starts/reuses:

- `onlyoffice-documentserver` on `127.0.0.1:8080`
- `resumeforge-onlyoffice-proxy` on `127.0.0.1:8766`
- ResumeForge on `0.0.0.0:8765`

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

## Current hypothesis

The most likely cause is stale browser-profile state from the OnlyOffice
document editor service worker.

Earlier local builds used the official OnlyOffice `preload.html` flow. That
page registers `document_editor_service_worker.js`. In a persistent browser
profile, that stale service worker can keep intercepting the editor bootstrap
even after the application code has changed.

## Changes applied in this branch

1. Removed the ResumeForge hidden OnlyOffice preload iframe.
2. Stopped loading `api.js` with `preload=onlyoffice-preload`.
3. Added browser-side cleanup before opening the editor:
   - find service workers scoped to `/onlyoffice-ds/`;
   - unregister them;
   - then load OnlyOffice `api.js`.
4. Patched the local Docker launcher to disable OnlyOffice's document editor
   service-worker registration inside the container for local development.
5. Increased the client-side ready timeout to 60 seconds to reduce false
   timeout errors on cold local starts.
6. Added client event logging so the next failure can be diagnosed by event
   sequence rather than screenshots only.

## Files of interest

- `src/web/templates/onlyoffice.html`
  - browser event instrumentation;
  - service-worker cleanup;
  - OnlyOffice script loading;
  - `onAppReady` / `onDocumentReady` callbacks.
- `scripts/run_onlyoffice_local.sh`
  - starts Docker services;
  - patches OnlyOffice timeout;
  - disables local service-worker registration.
- `scripts/nginx-resumeforge-onlyoffice.conf`
  - same-origin local proxy for ResumeForge and OnlyOffice.
- `src/web/app.py`
  - `/onlyoffice/client-events`;
  - local proxy redirect;
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
http://127.0.0.1:8766
```

If the editor still hangs, inspect:

```bash
curl -fsS http://127.0.0.1:8766/onlyoffice/client-events
docker logs --tail 200 resumeforge-onlyoffice-proxy
docker logs --tail 200 onlyoffice-documentserver
```

## Open questions for external diagnosis

- Is disabling OnlyOffice's document editor service worker acceptable for local
  development, or is there a cleaner documented flag?
- Does OnlyOffice Document Server expect additional proxy headers for this
  embedded same-origin local setup?
- Can an existing service worker registered under the proxied OnlyOffice path
  interfere with `onAppReady` even after `api.js` is freshly loaded?
- Is there a better way to force a clean OnlyOffice bootstrap without requiring
  users to manually clear browser site data?

## Validation

Current automated checks:

```text
166 passed, 1 warning
```
