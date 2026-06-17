import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { EditorContent, useEditor } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type PreviewSession = {
  preview_id: string
  cv_generated: string
  cv_edited: string
  cv_is_dirty: boolean
  lm_generated: string
  lm_edited: string
  lm_is_dirty: boolean
}

type DocumentEditorProps = {
  session: PreviewSession
}

type EditableDocumentProps = {
  label: string
  generated: string
  edited: string
  onChange: (html: string, isDirty: boolean) => void
}

function readSession(): PreviewSession {
  const node = document.getElementById('document-editor-data')
  if (!node?.textContent) {
    throw new Error('Preview data missing')
  }
  return JSON.parse(node.textContent) as PreviewSession
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null
  return (
    <div className="editor-toolbar" aria-label="Outils de mise en forme">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}>
        Gras
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}>
        Italique
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''}>
        Liste
      </button>
      <button type="button" onClick={() => editor.chain().focus().undo().run()}>
        Annuler
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()}>
        Rétablir
      </button>
    </div>
  )
}

function EditableDocument({ label, generated, edited, onChange }: EditableDocumentProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: edited || generated,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getHTML() !== generated)
    },
  })

  return (
    <div className="document-editor-panel" aria-label={label}>
      <Toolbar editor={editor} />
      <div className="document-workspace" aria-label={`Zone de travail ${label}`}>
        <EditorContent editor={editor} className="document-editor document-page" />
      </div>
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
      </div>

      <div hidden={activeTab !== 'cv'}>
        <EditableDocument label="CV" generated={cvGenerated} edited={cvEdited} onChange={updateCv} />
      </div>
      <div hidden={activeTab !== 'lm'}>
        <EditableDocument label="Lettre de motivation" generated={lmGenerated} edited={lmEdited} onChange={updateLm} />
      </div>

      <button className="button primary" type="submit">
        Télécharger ZIP
      </button>
    </form>
  )
}

const rootElement = document.getElementById('document-editor-root')
if (rootElement) {
  createRoot(rootElement).render(<DocumentEditor session={readSession()} />)
}
