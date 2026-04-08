import { useEffect, useState } from 'react'
import { fetchMaterials, createMaterial, updateMaterial, deleteMaterial } from '../../services/adminService'
import { Plus, Edit3, Trash2, ExternalLink } from 'lucide-react'

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="fixed bottom-4 right-4 z-[300] rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium shadow-xl text-foreground">
      {message}
    </div>
  )
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 space-y-4 shadow-2xl">
        <p className="text-sm text-foreground">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-2 text-sm font-bold hover:bg-secondary transition-colors">Anuluj</button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-600 py-2 text-sm font-bold text-white hover:bg-red-500 transition-colors">Usuń</button>
        </div>
      </div>
    </div>
  )
}

const EMPTY_FORM = { title: '', url: '', description: '', category: '', price: '', tags: '', icon_url: '', is_published: false }

function MaterialModal({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] })
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        <h2 className="text-xl font-bold tracking-tighter text-foreground">{initial?.id ? 'Edytuj materiał' : 'Nowy materiał'}</h2>

        {[
          { key: 'title', label: 'Tytuł', required: true },
          { key: 'url', label: 'URL', type: 'url', required: true },
          { key: 'description', label: 'Opis' },
          { key: 'category', label: 'Kategoria' },
          { key: 'price', label: 'Cena (np. Darmowy, 49 PLN)' },
          { key: 'tags', label: 'Tagi (przecinek)' },
          { key: 'icon_url', label: 'Ikona URL lub emoji' },
        ].map(({ key, label, type = 'text', required }) => (
          <div key={key} className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
            <input
              type={type}
              required={required}
              value={form[key]}
              onChange={e => set(key, e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        ))}

        <div className="flex items-center gap-3">
          <input type="checkbox" id="is_published" checked={form.is_published} onChange={e => set('is_published', e.target.checked)} className="w-4 h-4" />
          <label htmlFor="is_published" className="text-sm text-muted-foreground">Opublikuj od razu</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold hover:bg-secondary transition-colors">Anuluj</button>
          <button type="submit" className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">Zapisz</button>
        </div>
      </form>
    </div>
  )
}

export default function AdminMaterials() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try { setMaterials(await fetchMaterials()) }
    catch (err) { setToast('Błąd: ' + err.message) }
    finally { setLoading(false) }
  }

  async function handleTogglePublish(mat) {
    try {
      await updateMaterial(mat.id, { is_published: !mat.is_published })
      setMaterials(ms => ms.map(m => m.id === mat.id ? { ...m, is_published: !m.is_published } : m))
    } catch (err) { setToast('Błąd: ' + err.message) }
  }

  async function handleSave(form) {
    try {
      if (modal?.mat?.id) {
        await updateMaterial(modal.mat.id, form)
        setToast('Materiał zaktualizowany')
      } else {
        await createMaterial(form)
        setToast('Materiał dodany')
      }
      setModal(null)
      await load()
    } catch (err) { setToast('Błąd: ' + err.message) }
  }

  function confirmDelete(mat) {
    setConfirm({
      message: `Usunąć "${mat.title}"? Operacja jest nieodwracalna.`,
      onConfirm: async () => {
        setConfirm(null)
        try { await deleteMaterial(mat.id); await load(); setToast('Materiał usunięty') }
        catch (err) { setToast('Błąd: ' + err.message) }
      },
    })
  }

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Ładowanie...</div>

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">Materiały</h2>
          <p className="text-xs text-muted-foreground mt-1">{materials.length} materiałów</p>
        </div>
        <button
          onClick={() => setModal({ mat: null })}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all"
        >
          <Plus size={16} /> Dodaj materiał
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/50">
            <tr>
              {['Tytuł', 'Kategoria', 'Cena', 'Tagi', 'Status', ''].map(h => (
                <th key={h} className="p-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {materials.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-sm text-muted-foreground">Brak materiałów</td></tr>
            )}
            {materials.map(mat => (
              <tr key={mat.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {mat.icon_url && <span className="text-base">{mat.icon_url}</span>}
                    <div>
                      <div className="font-semibold text-foreground">{mat.title}</div>
                      {mat.description && <div className="text-xs text-muted-foreground truncate max-w-[200px]">{mat.description}</div>}
                    </div>
                  </div>
                </td>
                <td className="p-3 text-xs text-muted-foreground">{mat.category || '–'}</td>
                <td className="p-3 text-xs text-muted-foreground">{mat.price || '–'}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {mat.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleTogglePublish(mat)}
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide transition-all ${
                      mat.is_published
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {mat.is_published ? 'Opublikowany' : 'Szkic'}
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <a href={mat.url} target="_blank" rel="noopener noreferrer" className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                      <ExternalLink size={13} />
                    </a>
                    <button onClick={() => setModal({ mat: { ...mat, tags: mat.tags?.join(', ') || '' } })} className="rounded-lg p-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => confirmDelete(mat)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <MaterialModal
          initial={modal.mat}
          onSubmit={handleSave}
          onCancel={() => setModal(null)}
        />
      )}
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
