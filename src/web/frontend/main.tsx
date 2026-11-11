import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

type EditableBlock = {
  id: string
  tag: 'h2' | 'p' | 'li'
  text: string
  strong?: boolean
}

type EditableDocument = {
  image_html: string
  blocks: EditableBlock[]
}

type PreviewSession = {
  preview_id: string
  cv_generated: string
  cv_edited: string
  cv_is_dirty: boolean
  cv_document: EditableDocument
  lm_generated: string
  lm_edited: string
  lm_is_dirty: boolean
  lm_document: EditableDocument
}

type DocumentEditorProps = {
  session: PreviewSession
}

type StructuredDocumentProps = {
  title: string
  generated: string
  initialDocument: EditableDocument
  onChange: (html: string, isDirty: boolean) => void
}

const prefixLabels = ['Compétences techniques :', 'Technical skills:', 'Langues :', 'Languages:']

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function renderParagraphContent(block: EditableBlock): string {
  const text = block.text || ''
  const label = prefixLabels.find((prefix) => text.startsWith(prefix))
  if (label) {
    const suffix = text.slice(label.length).trimStart()
    return `<strong>${escapeHtml(label)}</strong>${suffix ? ` ${escapeHtml(suffix)}` : ''}`
  }
  return block.strong ? `<strong>${escapeHtml(text)}</strong>` : escapeHtml(text)
}

function renderDocumentHtml(document: EditableDocument): string {
  const chunks = document.image_html ? [document.image_html] : []
  for (const block of document.blocks) {
    if (block.tag === 'h2') chunks.push(`<h2>${escapeHtml(block.text)}</h2>`)
    else if (block.tag === 'li') chunks.push(`<ul><li>${escapeHtml(block.text)}</li></ul>`)
    else chunks.push(`<p>${renderParagraphContent(block)}</p>`)
  }
  return chunks.join('\n') || '<p>Document vide.</p>'
}

function cloneDocument(document: EditableDocument): EditableDocument {
  return {
    image_html: document.image_html || '',
    blocks: document.blocks.map((block) => ({ ...block })),
  }
}

function readSession(): PreviewSession {
  const node = document.getElementById('document-editor-data')
  if (!node?.textContent) {
    throw new Error('Preview data missing')
  }
  return JSON.parse(node.textContent) as PreviewSession
}

function LockedDocumentPreview({ html }: { html: string }) {
  const pageRef = useRef<HTMLDivElement | null>(null)
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
    const updatePageCount = () => {
      const page = pageRef.current
      const body = bodyRef.current
      if (!page || !body) return
      const pageHeight = page.clientHeight || page.getBoundingClientRect().height
      const contentHeight = body.scrollHeight
      setPageCount(Math.max(1, Math.ceil(contentHeight / Math.max(pageHeight, 1))))
    }

    updatePageCount()
    const frame = window.requestAnimationFrame(updatePageCount)
    window.addEventListener('resize', updatePageCount)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', updatePageCount)
    }
  }, [html])

  return (
    <div className="document-workspace" aria-label="Prévisualisation verrouillée">
      <div className="document-page-count" aria-live="polite">
        {pageCount} {pageCount > 1 ? 'pages' : 'page'}
      </div>
      <div className="document-page locked-document-preview" ref={pageRef}>
        <div className="document-body" ref={bodyRef} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  )
}

function SectionFieldsEditor({
  title,
  document,
  onBlockChange,
}: {
  title: string
  document: EditableDocument
  onBlockChange: (blockId: string, value: string) => void
}) {
  return (
    <aside className="section-editor-panel" aria-label={`Édition structurée ${title}`}>
      <div>
        <h2>{title}</h2>
        <p>Modifie le texte uniquement. Le design, la photo, les marges et l’ordre du CV restent verrouillés.</p>
      </div>

      <div className="section-editor-fields">
        {document.blocks.map((block, index) => (
          <label key={block.id} className={block.tag === 'h2' ? 'section-editor-heading-field' : undefined}>
            <span>
              {block.tag === 'h2' ? 'Titre de section' : block.tag === 'li' ? 'Puces' : `Ligne ${index + 1}`}
            </span>
            <textarea value={block.text} rows={block.tag === 'li' ? 3 : 2} onChange={(event) => onBlockChange(block.id, event.target.value)} />
          </label>
        ))}
      </div>
    </aside>
  )
}

function StructuredDocumentEditor({ title, generated, initialDocument, onChange }: StructuredDocumentProps) {
  const [document, setDocument] = useState(() => cloneDocument(initialDocument))
  const html = useMemo(() => renderDocumentHtml(document), [document])

  const updateBlock = (blockId: string, value: string) => {
    setDocument((current) => {
      const next = {
        ...current,
        blocks: current.blocks.map((block) => (block.id === blockId ? { ...block, text: value } : block)),
      }
      const nextHtml = renderDocumentHtml(next)
      onChange(nextHtml, nextHtml !== generated)
      return next
    })
  }

  return (
    <div className="document-editor-panel structured-document-editor">
      <LockedDocumentPreview html={html} />
      <SectionFieldsEditor title={title} document={document} onBlockChange={updateBlock} />
    </div>
  )
}

function DocumentEditor({ session }: DocumentEditorProps) {
  const [activeTab, setActiveTab] = useState<'cv' | 'lm'>('cv')
  const [cvGenerated] = useState(session.cv_generated)
  const [cvEdited, setCvEdited] = useState(session.cv_edited || session.cv_generated)
  const [cvIsDirty, setCvIsDirty] = useState(session.cv_is_dirty)
  const [lmGenerated] = useState(session.lm_generated)
  const [lmEdited, setLmEdited] = useState(session.lm_edited || session.lm_generated)
  const [lmIsDirty, setLmIsDirty] = useState(session.lm_is_dirty)

  const updateCv = (html: string, isDirty: boolean) => {
    setCvEdited(html)
    setCvIsDirty(isDirty)
  }

  const updateLm = (html: string, isDirty: boolean) => {
    setLmEdited(html)
    setLmIsDirty(isDirty)
  }

  return (
    <form method="post" action={`/preview/${session.preview_id}/export`} className="document-editor-form">
      <input type="hidden" name="cv_edited" value={cvEdited} />
      <input type="hidden" name="cv_is_dirty" value={String(cvIsDirty)} />
      <input type="hidden" name="lm_edited" value={lmEdited} />
      <input type="hidden" name="lm_is_dirty" value={String(lmIsDirty)} />

      <div className="editor-tabs" role="tablist" aria-label="Documents">
        <button type="button" role="tab" aria-selected={activeTab === 'cv'} onClick={() => setActiveTab('cv')}>
          CV {cvIsDirty ? 'modifié' : 'généré'}
        </button>
        <button type="button" role="tab" aria-selected={activeTab === 'lm'} onClick={() => setActiveTab('lm')}>
          Lettre de motivation {lmIsDirty ? 'modifiée' : 'générée'}
        </button>
        <button className="button primary" type="submit">
          Télécharger ZIP
        </button>
      </div>

      <div hidden={activeTab !== 'cv'}>
        <StructuredDocumentEditor title="CV" generated={cvGenerated} initialDocument={session.cv_document} onChange={updateCv} />
      </div>
      <div hidden={activeTab !== 'lm'}>
        <StructuredDocumentEditor title="Lettre de motivation" generated={lmGenerated} initialDocument={session.lm_document} onChange={updateLm} />
      </div>
    </form>
  )
}

const rootElement = document.getElementById('document-editor-root')
if (rootElement) {
  createRoot(rootElement).render(<DocumentEditor session={readSession()} />)
}
