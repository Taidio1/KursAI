import { useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import {
  X, Eye, Save, Tag,
  Bold, Italic, Strikethrough, Code, Link2, Image as ImageIcon,
  List, ListOrdered, Quote, Minus, Undo, Redo,
  Heading1, Heading2, Heading3,
} from 'lucide-react'
import PostPreviewModal from './PostPreviewModal'

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolBtn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-md text-[11px] transition-all disabled:opacity-30 ${
        active
          ? 'bg-primary/20 text-primary'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
      }`}
    >
      {children}
    </button>
  )
}

// ─── Floating link input ──────────────────────────────────────────────────────

function LinkDialog({ onConfirm, onCancel }) {
  const [url, setUrl] = useState('')
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl shadow-lg">
      <input
        autoFocus
        type="url"
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); onConfirm(url) }
          if (e.key === 'Escape') onCancel()
        }}
        placeholder="https://..."
        className="bg-transparent text-sm text-foreground outline-none w-56 placeholder:text-muted-foreground/50"
      />
      <button
        type="button"
        onClick={() => onConfirm(url)}
        className="text-[11px] font-bold text-primary hover:opacity-80 transition-opacity"
      >
        OK
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={12} />
      </button>
    </div>
  )
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

function Toolbar({ editor, onAddImage }) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)

  if (!editor) return null

  const setLink = useCallback((url) => {
    setLinkDialogOpen(false)
    if (!url) return
    if (editor.state.selection.empty) {
      editor.chain().focus().insertContent(`[${url}](${url})`).run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run()
    }
  }, [editor])

  const groups = [
    [
      { icon: <Undo size={13} />, action: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo(), title: 'Cofnij' },
      { icon: <Redo size={13} />, action: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo(), title: 'Ponów' },
    ],
    [
      { icon: <Heading1 size={13} />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }), title: 'Nagłówek 1' },
      { icon: <Heading2 size={13} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), title: 'Nagłówek 2' },
      { icon: <Heading3 size={13} />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }), title: 'Nagłówek 3' },
    ],
    [
      { icon: <Bold size={13} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), title: 'Pogrubienie (Ctrl+B)' },
      { icon: <Italic size={13} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), title: 'Kursywa (Ctrl+I)' },
      { icon: <Strikethrough size={13} />, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike'), title: 'Przekreślenie' },
      { icon: <Code size={13} />, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code'), title: 'Kod inline' },
    ],
    [
      { icon: <List size={13} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), title: 'Lista punktowana' },
      { icon: <ListOrdered size={13} />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), title: 'Lista numerowana' },
      { icon: <Quote size={13} />, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), title: 'Cytat' },
      { icon: <Minus size={13} />, action: () => editor.chain().focus().setHorizontalRule().run(), title: 'Linia pozioma' },
    ],
    [
      {
        icon: <Link2 size={13} />,
        action: () => setLinkDialogOpen(v => !v),
        active: editor.isActive('link'),
        title: 'Wstaw link',
      },
      {
        icon: <ImageIcon size={13} />,
        action: onAddImage,
        title: 'Wstaw obraz',
      },
    ],
  ]

  return (
    <div className="sticky top-0 z-10 flex flex-col gap-0.5">
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-background/95 backdrop-blur border-b border-border/60">
        {groups.map((group, gi) => (
          <span key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <span className="w-px h-4 bg-border/60 mx-1" />}
            {group.map((btn, bi) => (
              <ToolBtn
                key={bi}
                onClick={btn.action}
                active={btn.active}
                disabled={btn.disabled}
                title={btn.title}
              >
                {btn.icon}
              </ToolBtn>
            ))}
          </span>
        ))}
      </div>

      {linkDialogOpen && (
        <div className="absolute top-full left-0 mt-1 z-20">
          <LinkDialog onConfirm={setLink} onCancel={() => setLinkDialogOpen(false)} />
        </div>
      )}
    </div>
  )
}

// ─── Image URL dialog ─────────────────────────────────────────────────────────

function ImageDialog({ onConfirm, onCancel }) {
  const [tab, setTab] = useState('upload') // 'upload' | 'url'

  // — Upload tab state —
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [altUpload, setAltUpload] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [dragging, setDragging] = useState(false)

  // — URL tab state —
  const [url, setUrl] = useState('')
  const [altUrl, setAltUrl] = useState('')

  const ALLOWED_TYPES = ['image/png', 'image/gif', 'image/jpeg', 'image/webp']
  const MAX_MB = 5

  const handleFile = (f) => {
    setUploadError(null)
    if (!f) return
    if (!ALLOWED_TYPES.includes(f.type)) {
      setUploadError(`Niedozwolony format. Obsługiwane: PNG, GIF, JPEG, WebP.`)
      return
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setUploadError(`Plik za duży (maks. ${MAX_MB} MB).`)
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  const handleUploadConfirm = async () => {
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const { blogService } = await import('../../services/blogService')
      const { url: uploadedUrl } = await blogService.uploadImage(file)
      onConfirm(uploadedUrl, altUpload)
    } catch (err) {
      setUploadError(err.message || 'Nieznany błąd wgrywania.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-background border border-border rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-3"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-sm font-bold">Wstaw obraz</h3>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border pb-1">
          {[
            { id: 'upload', label: '📁 Wgraj plik' },
            { id: 'url',    label: '🔗 Wklej URL' },
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3 py-1 text-xs font-bold rounded-t-lg transition-all ${
                tab === t.id
                  ? 'bg-primary/15 text-primary border-b-2 border-primary -mb-px'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Upload tab ── */}
        {tab === 'upload' && (
          <div className="space-y-2.5">
            {/* Drop zone */}
            <label
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-6 cursor-pointer transition-all ${
                dragging
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-secondary/30'
              }`}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/png,image/gif,image/jpeg,image/webp"
                className="sr-only"
                onChange={e => handleFile(e.target.files?.[0])}
              />
              {preview ? (
                <img
                  src={preview}
                  alt="podgląd"
                  className="max-h-28 rounded-lg object-contain"
                />
              ) : (
                <>
                  <span className="text-2xl">🖼️</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Kliknij lub przeciągnij plik<br/>
                    <span className="text-[10px]">PNG, GIF, JPEG, WebP · maks. 5 MB</span>
                  </span>
                </>
              )}
            </label>

            {file && (
              <p className="text-[10px] text-muted-foreground truncate">
                📄 {file.name} ({(file.size / 1024).toFixed(0)} KB)
              </p>
            )}

            <input
              type="text"
              value={altUpload}
              onChange={e => setAltUpload(e.target.value)}
              placeholder="Tekst alternatywny (opcjonalnie)"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/50"
            />

            {uploadError && (
              <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                ⚠️ {uploadError}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 text-xs rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={handleUploadConfirm}
                disabled={!file || uploading}
                className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                {uploading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Wgrywam…
                  </>
                ) : '⬆️ Wgraj i wstaw'}
              </button>
            </div>
          </div>
        )}

        {/* ── URL tab ── */}
        {tab === 'url' && (
          <div className="space-y-2.5">
            <input
              autoFocus
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://… URL obrazu (JPG, PNG, GIF)"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/50"
            />
            <input
              type="text"
              value={altUrl}
              onChange={e => setAltUrl(e.target.value)}
              placeholder="Tekst alternatywny (opcjonalnie)"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/50"
            />
            {url && (
              <img src={url} alt={altUrl} className="w-full max-h-32 object-cover rounded-lg border border-border" />
            )}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 text-xs rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={() => onConfirm(url, altUrl)}
                disabled={!url}
                className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
              >
                Wstaw
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


// ─── Main component ───────────────────────────────────────────────────────────

/**
 * PostEditorModal — WYSIWYG edytor wpisu bloga (TipTap)
 * Props:
 *   post     – obiekt wpisu (pełny, z content_markdown)
 *   onClose  – callback zamknięcia bez zapisu
 *   onSave   – callback(patchPayload) po zapisie
 *   saving   – bool czy trwa zapis
 */
export default function PostEditorModal({ post, onClose, onSave, saving, isNew = false }) {
  const [title, setTitle] = useState(post?.title || '')
  const [lead, setLead] = useState(post?.lead || '')
  const [author, setAuthor] = useState(post?.author || '')
  const [tags, setTags] = useState(post?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: false,
      }),
      Link.configure({
        openOnClick: false,
        defaultProtocol: 'https',
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder: 'Zacznij pisać treść wpisu... Obsługiwane skróty: Ctrl+B (bold), Ctrl+I (italic). Możesz też wkleić Markdown.',
      }),
    ],
    content: post?.content_markdown || '',
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[280px] px-5 py-4 text-sm text-foreground leading-relaxed prose-blog-editor',
      },
    },
  })

  // ---- tag handling ----
  const addTag = () => {
    const v = tagInput.trim().toLowerCase()
    if (v && !tags.includes(v)) setTags(prev => [...prev, v])
    setTagInput('')
  }
  const removeTag = t => setTags(prev => prev.filter(tag => tag !== t))
  const handleTagKey = e => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
  }

  // ---- insert image ----
  const handleImageConfirm = (url, alt) => {
    setImageDialogOpen(false)
    if (!url) return
    editor.chain().focus().setImage({ src: url, alt: alt || '' }).run()
  }

  // ---- save ----
  const handleSave = () => {
    const content_markdown = editor?.storage?.markdown?.getMarkdown?.() ?? ''
    onSave({
      title: title.trim(),
      lead: lead.trim(),
      author: author.trim(),
      tags,
      content_markdown,
    })
  }

  // ---- preview synthetic object ----
  const previewPost = {
    ...post,
    title,
    lead,
    author,
    tags,
    content_markdown: editor?.storage?.markdown?.getMarkdown?.() ?? '',
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto px-4 pt-20 pb-6"
      >
        <div
          className="bg-background border border-border rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl"
          onClick={e => e.stopPropagation()}
        >

          {/* ── Modal header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur rounded-t-2xl z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{isNew ? 'Nowy wpis' : 'Edytor wpisu'}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              >
                <Eye size={13} /> Podgląd
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-[11px] font-bold hover:opacity-90 disabled:opacity-50 transition-all"
              >
                <Save size={13} /> {saving ? 'Zapisuję…' : 'Zapisz'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* ── Form body ── */}
          <div className="px-6 py-6 space-y-5">

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tytuł</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Tytuł wpisu…"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-base font-bold text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Lead */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span>Lead / zajawka</span>
                <span className={lead.length > 200 ? 'text-red-400' : ''}>{lead.length}/200</span>
              </label>
              <textarea
                rows={3}
                value={lead}
                onChange={e => setLead(e.target.value)}
                placeholder="Krótki opis 1-2 zdania…"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-1 focus:ring-primary/50 resize-none leading-relaxed transition-all"
              />
            </div>

            {/* Author */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Autor</label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Imię i nazwisko autora"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tagi</label>
              <div
                className="flex flex-wrap gap-1.5 border border-border rounded-xl px-3 py-2 bg-background min-h-[42px] cursor-text"
                onClick={() => document.getElementById('tag-input-editor')?.focus()}
              >
                {tags.map(t => (
                  <span key={t} className="inline-flex items-center gap-1 text-[10px] font-bold bg-primary/10 text-primary rounded-full px-2.5 py-0.5">
                    <Tag size={8} /> {t}
                    <button type="button" onClick={() => removeTag(t)} className="ml-0.5 hover:opacity-70 transition-opacity">
                      <X size={9} />
                    </button>
                  </span>
                ))}
                <input
                  id="tag-input-editor"
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKey}
                  onBlur={addTag}
                  placeholder={tags.length === 0 ? 'Dodaj tag (Enter)…' : ''}
                  className="flex-1 min-w-[120px] bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 outline-none"
                />
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Rich text editor */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Treść wpisu</label>
              <div className="border border-border rounded-xl overflow-hidden bg-background/40 relative">
                <Toolbar editor={editor} onAddImage={() => setImageDialogOpen(true)} />
                <EditorContent editor={editor} />
              </div>
              <p className="text-[10px] text-muted-foreground/60">
                Skróty: Ctrl+B pogrubienie · Ctrl+I kursywa · Ctrl+Z cofnij · Wklejony Markdown jest automatycznie formatowany
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <PostPreviewModal post={previewPost} onClose={() => setShowPreview(false)} />
      )}

      {/* Image insertion dialog */}
      {imageDialogOpen && (
        <ImageDialog
          onConfirm={handleImageConfirm}
          onCancel={() => setImageDialogOpen(false)}
        />
      )}
    </>
  )
}
