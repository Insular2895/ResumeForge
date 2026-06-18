# ResumeForge OnlyOffice Integration

## Objective

ResumeForge now edits the real generated DOCX files instead of reconstructing
them as HTML. This preserves the base CV template, image/photo, Word styles,
tables, lists, headers and document-level formatting.

```text
Job offer
  -> IA generation
  -> DOCX pack
  -> OnlyOffice Docs Community editor
  -> callback save into ResumeForge
  -> final ZIP download
```

## Local Dependency

> Current diagnostic status: the local OnlyOffice editor can still fail before
> `onAppReady` in the affected Arc/Chrome profile, even after the proxy,
> service-worker and cleanup changes. See `docs/ONLYOFFICE_DIAGNOSTIC.md` for
> the latest failure sequence.

Run ONLYOFFICE Docs Community Edition as a separate Document Server:

```bash
docker run -d \
  --name onlyoffice-documentserver \
  -p 8080:80 \
  -e JWT_ENABLED=false \
  -e ALLOW_PRIVATE_IP_ADDRESS=true \
  -e ALLOW_META_IP_ADDRESS=true \
  onlyoffice/documentserver
```

Then run ResumeForge. On macOS with Docker Desktop, use the helper script. It
starts OnlyOffice, waits for the healthcheck, patches the local OnlyOffice
RequireJS timeout to 120 seconds, prewarms the API asset, binds ResumeForge to
localhost, and opens the app:

```bash
cd "/Users/insular/Desktop/ResumeReforge"
chmod +x scripts/run_onlyoffice_local.sh
./scripts/run_onlyoffice_local.sh
```

The script reuses an already running `onlyoffice-documentserver` container to
avoid cold-starting OnlyOffice on every run. The default local debugging setup
does not start the nginx proxy. The browser opens ResumeForge directly:

```text
http://127.0.0.1:8765/ -> ResumeForge
http://127.0.0.1:8080/ -> OnlyOffice Document Server API assets
```

OnlyOffice itself reaches ResumeForge through Docker Desktop's host alias:

```text
http://host.docker.internal:8765
```

The repository still includes `scripts/nginx-resumeforge-onlyoffice.conf` as a
fallback/reference proxy config. It must keep `X-Forwarded-Host` as a host only,
without `/onlyoffice-ds`.

If you need a clean Document Server:

```bash
RESET_ONLYOFFICE=1 ./scripts/run_onlyoffice_local.sh
```

Open:

```text
http://127.0.0.1:8765
```

## Environment Variables

Defaults are set for simple local usage:

```bash
ONLYOFFICE_DOCUMENT_SERVER_URL=http://127.0.0.1:8080
ONLYOFFICE_PUBLIC_APP_URL=http://host.docker.internal:8765
```

For the integrated editor, the more reliable macOS Docker setup is:

```bash
RESUMEFORGE_HOST=127.0.0.1
ONLYOFFICE_DOCUMENT_SERVER_URL=http://127.0.0.1:8080
ONLYOFFICE_PUBLIC_APP_URL=http://host.docker.internal:8765
```

`ONLYOFFICE_DOCUMENT_SERVER_URL` is used by the browser to load:

```text
/web-apps/apps/api/documents/api.js
```

`ONLYOFFICE_PUBLIC_APP_URL` is used inside the OnlyOffice editor config for:

- `document.url`: the DOCX file URL that Document Server downloads;
- `editorConfig.callbackUrl`: the URL Document Server calls back after save.

When the Document Server is not running in Docker, set
`ONLYOFFICE_PUBLIC_APP_URL` to an address that the Document Server can reach.

## Architecture

Main module:

```text
src/web/onlyoffice_integration.py
```

Routes:

```text
GET  /onlyoffice/{session_id}
GET  /onlyoffice/sessions/{session_id}/files/{filename}
POST /onlyoffice/sessions/{session_id}/callback/{kind}
GET  /onlyoffice/sessions/{session_id}/export
```

Template:

```text
src/web/templates/onlyoffice.html
```

The generated DOCX files are copied into:

```text
data/output/onlyoffice_sessions/{session_id}/
```

The final ZIP is written into:

```text
data/output/onlyoffice_final_exports/ResumeForge_documents_finaux.zip
```

## Save Flow

OnlyOffice does not directly write into the app filesystem. It calls
ResumeForge with a save callback.

Relevant callback statuses:

- `2`: editing is complete and the final file is available;
- `6`: force-save result is available.

For these statuses, ResumeForge downloads the DOCX from the callback `url` and
replaces the session copy.

## Export Format

The final ZIP contains edited DOCX files:

```text
CV_Lucas_Pertusa.docx
Lettre_Motivation_Lucas_Pertusa.docx
```

This is intentional: the point of the OnlyOffice flow is to preserve real Word
formatting. PDF export can be added later through OnlyOffice conversion or a
separate document conversion service.

## Limitations

- JWT is disabled in the local prototype with `JWT_ENABLED=false`. A production
  setup must sign OnlyOffice configs with the Document Server JWT secret.
- Saving is asynchronous. After editing, wait a few seconds or close the editor
  tab before downloading the ZIP.
- The Community Edition is suitable for local/prototype usage, but has edition
  limits compared with Enterprise/Developer editions.
- Docker networking matters: the Document Server must be able to reach
  ResumeForge through `ONLYOFFICE_PUBLIC_APP_URL`.
- In the browser, load the app from `127.0.0.1:8765`. OnlyOffice API assets are
  loaded from `127.0.0.1:8080`, while Document Server downloads files and sends
  callbacks to `host.docker.internal:8765`.
- For the local Docker prototype, Arc/Chrome or Firefox are more reliable than
  Safari. The generated DOCX, photo and Word layout are preserved; the browser
  choice only affects the embedded OnlyOffice web app bootstrap.
- The local launcher disables the OnlyOffice document editor service worker and
  ResumeForge does not call the OnlyOffice preload iframe. This avoids stale
  browser-profile state where `api.js` loads, the iframe is created, but the
  editor never emits `onAppReady`. The editor page also unregisters old
  OnlyOffice service workers for `/onlyoffice-ds/` or
  `document_editor_service_worker.js` before loading `api.js`, so a previously
  affected Arc/Chrome profile can recover without manual DevTools cleanup.
  Because the default local setup loads OnlyOffice from `127.0.0.1:8080`, the
  launcher also installs
  `/web-apps/apps/api/documents/resumeforge-sw-cleanup.html` inside the Document
  Server container. ResumeForge loads that page before `api.js`, allowing the
  `8080` origin to unregister its own service workers and clear caches.
- The editor config disables nonessential bundled plugins, comments, chat,
  macros and spellcheck for the ResumeForge editing flow. This keeps the
  editing surface focused on Word-like DOCX edits and avoids loading plugin
  iframes such as AI, OCR, Zotero or YouTube.
- Keep `ONLYOFFICE_PUBLIC_APP_URL` on `host.docker.internal:8765` for the local
  Docker setup, because the Document Server container must download
  `document.url` and call `callbackUrl` through an address it can reach.
- Because the local app uses a private Docker host address, the Document Server
  container must be started with `ALLOW_PRIVATE_IP_ADDRESS=true`; otherwise it
  can refuse to download `document.url` and the editor may stay stuck on
  loading.
- This prototype does not yet implement user accounts, document permissions per
  user, signed download URLs, or cleanup of old sessions.

## Official References

- ONLYOFFICE Docs Community Docker installation:
  https://helpcenter.onlyoffice.com/docs/installation/docs-community-install-docker.aspx
- ONLYOFFICE document config:
  https://api.onlyoffice.com/docs/docs-api/usage-api/config/document/
- ONLYOFFICE editor config and callback URL:
  https://api.onlyoffice.com/docs/docs-api/usage-api/config/editor/
- ONLYOFFICE save callback flow:
  https://api.onlyoffice.com/docs/docs-api/get-started/how-it-works/saving-file/
