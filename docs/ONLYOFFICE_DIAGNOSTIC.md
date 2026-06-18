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

## Current status after latest fixes

As of the diagnostic branch, the bug is still reproduced in the user's
Arc/Chrome profile.

The UI still shows:

```text
OnlyOffice a chargé son API mais l'éditeur ne renvoie pas onAppReady.
Iframe de diagnostic :
```

Important: the service-worker cleanup hypothesis is now paused. The active
editor flow intentionally does not call browser cleanup, Document Server
cleanup, hidden cleanup iframes, proxy fallback, or automatic retries before
loading OnlyOffice. The goal is to isolate the failure with the smallest
possible integration.

The latest known failing iframe shape is:

```text
http://127.0.0.1:8080/9.4.0-c54f95469d83a5af565fa3d8f13a0813/web-apps/apps/documenteditor/main/index.html
  ?_dc=9.4.0-129
  &lang=fr
  &customer=ONLYOFFICE
  &type=desktop
  &frameEditorId=onlyoffice-editor
  &isForm=false
  &parentOrigin=http://127.0.0.1:8765
  &fileType=docx
```

Latest observed client event sequence before the minimal reset was:

```text
page-loaded
api-script-start
api-script-loaded
iframe-created
frame-timeout-final
```

Still missing:

```text
onAppReady
onDocumentReady
```

So the current diagnostic state is: `api.js` loads, `DocsAPI.DocEditor` creates
the iframe, but the OnlyOffice iframe does not complete its bootstrap /
postMessage handshake back to the parent page.

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

The active hypothesis is no longer "fix the service worker first". The next
step is to determine whether the failure comes from:

A. the OnlyOffice editor config itself;
B. the richer ResumeForge editor template;
C. local Docker networking / `host.docker.internal`;
D. browser-profile state outside the app's control.

External diagnosis should inspect:

- whether OnlyOffice supports being embedded cross-origin from
  `127.0.0.1:8765` while the editor iframe is served from `127.0.0.1:8080`;
- whether `parentOrigin=http://127.0.0.1:8765` is being accepted by the
  OnlyOffice editor page;
- whether browser console errors inside the iframe show blocked scripts,
  postMessage origin mismatch, CSP, mixed storage, or iframe permission issues;
- whether a direct same-origin proxy is required after all, but with corrected
  headers and without stale service workers;
- whether Arc/Chrome profile state outside service workers, such as storage,
  cache, extensions, third-party cookie/storage partitioning or site settings,
  is blocking the handshake.

## Changes applied in this branch

1. Removed the local nginx proxy from the default launcher.
2. Browser opens ResumeForge directly on `http://127.0.0.1:8765`.
3. Browser loads OnlyOffice API assets directly from `http://127.0.0.1:8080`.
4. OnlyOffice downloads DOCX files and calls back through
   `http://host.docker.internal:8765`.
5. Removed the ResumeForge hidden OnlyOffice preload iframe.
6. Stopped loading `api.js` with `preload=onlyoffice-preload`.
7. Temporarily removed browser-side and Document Server cleanup from the active
   editor page. The page now calls `loadOnlyOfficeApi()` directly.
8. Patched the local Docker launcher to disable OnlyOffice's document editor
   service-worker registration inside the container for local development.
9. Increased the client-side ready timeout to 60 seconds to reduce false
   timeout errors on cold local starts.
10. Added client event logging and `/onlyoffice/health` so the next failure can
   be diagnosed by event sequence and URLs rather than screenshots only.
11. Added an inline debug panel in the editor page with browser origin,
   `apiUrl`, `document.url`, `callbackUrl`, iframe source and environment URLs.
12. Removed the `resumeforge-sw-cleanup.html` installation and hidden cleanup
    iframe from the active local mode.
13. Added a minimal test page:
    `/onlyoffice/minimal-test/{session_id}/{kind}`.
    This page contains only `api.js`, one `editor` div,
    `new DocsAPI.DocEditor(...)`, and `onAppReady` / `onDocumentReady` /
    `onError` instrumentation.

## Files of interest

- `src/web/templates/onlyoffice.html`
  - browser event instrumentation;
  - OnlyOffice script loading;
  - `onAppReady` / `onDocumentReady` callbacks.
- `src/web/templates/onlyoffice_minimal.html`
  - pure OnlyOffice bootstrap page;
  - no cleanup;
  - no retry;
  - no proxy logic;
  - no service-worker diagnostic.
- `scripts/run_onlyoffice_local.sh`
  - starts Docker services;
  - patches OnlyOffice timeout;
  - disables local service-worker registration;
  - starts ResumeForge directly on `127.0.0.1:8765`.
- `scripts/nginx-resumeforge-onlyoffice.conf`
  - fallback/reference proxy config only;
  - fixes `X-Forwarded-Host`;
  - blocks the proxied service worker path with `204`.
- `src/web/app.py`
  - `/onlyoffice/client-events`;
  - `/onlyoffice/health`;
  - `/onlyoffice/minimal-test/{session_id}/{kind}`;
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
docker logs --tail 200 onlyoffice-documentserver
```

To bypass the ResumeForge editor template and test the smallest possible
OnlyOffice integration, open the generated session directly:

```text
http://127.0.0.1:8765/onlyoffice/minimal-test/{session_id}/cv
http://127.0.0.1:8765/onlyoffice/minimal-test/{session_id}/lm
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
