import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchFullStructure, createLesson, updateLesson, deleteLesson,
  createCourse, updateCourse, deleteCourse,
  createPath, updatePath, deletePath,
} from '../../services/adminService'
import { Plus, Edit3, Trash2, Eye, ChevronDown, ChevronRight, Layers, BookOpen } from 'lucide-react'

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="fixed bottom-4 right-4 z-[300] rounded-xl bg-card border border-border px-5 py-3 text-sm font-medium shadow-xl text-foreground">
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

function InputModal({ title, fields, initialValues, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues || {})
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(values) }
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-border bg-card p-8 space-y-5 shadow-2xl">
        <h2 className="text-xl font-bold tracking-tighter text-foreground">{title}</h2>
        {fields.map(({ name, label, type = 'text', placeholder }) => (
          <div key={name} className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
            {type === 'checkbox' ? (
              <div className="flex items-center gap-2">
                <input type="checkbox" id={name} checked={!!values[name]} onChange={e => setValues(v => ({ ...v, [name]: e.target.checked }))} className="w-4 h-4" />
                <label htmlFor={name} className="text-sm text-muted-foreground">{placeholder}</label>
              </div>
            ) : (
              <input
                type={type}
                required={type !== 'checkbox'}
                placeholder={placeholder}
                value={values[name] || ''}
                onChange={e => setValues(v => ({ ...v, [name]: e.target.value }))}
                className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
              />
            )}
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold hover:bg-secondary transition-colors">Anuluj</button>
          <button type="submit" className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">Zapisz</button>
        </div>
      </form>
    </div>
  )
}

export default function AdminContentTree() {
  const navigate = useNavigate()
  const [structure, setStructure] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => setToast(msg)
  const closeModal = () => setModal(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await fetchFullStructure()
      setStructure(data)
      if (data.length > 0) setExpanded({ [data[0].id]: true })
    } catch (err) {
      showToast('Błąd ładowania: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }))

  async function handleCreatePath(values) {
    try {
      await createPath(values.title, values.slug, !!values.has_dual_mode)
      await load(); closeModal(); showToast('Ścieżka dodana')
    } catch (err) { showToast('Błąd: ' + err.message) }
  }

  async function handleUpdatePath(id, values) {
    try {
      await updatePath(id, { title: values.title, slug: values.slug, has_dual_mode: !!values.has_dual_mode })
      await load(); closeModal(); showToast('Ścieżka zaktualizowana')
    } catch (err) { showToast('Błąd: ' + err.message) }
  }

  function confirmDeletePath(path) {
    setConfirm({
      message: `Usunąć ścieżkę "${path.title}"? Operacja jest nieodwracalna.`,
      onConfirm: async () => {
        setConfirm(null)
        try { await deletePath(path.id); await load(); showToast('Ścieżka usunięta') }
        catch (err) { showToast('Błąd: ' + err.message) }
      },
    })
  }

  async function handleCreateCourse(pathId, values) {
    try {
      await createCourse(values.title, pathId)
      await load(); closeModal(); showToast('Kurs dodany')
    } catch (err) { showToast('Błąd: ' + err.message) }
  }

  async function handleUpdateCourse(id, values) {
    try {
      await updateCourse(id, { title: values.title })
      await load(); closeModal(); showToast('Kurs zaktualizowany')
    } catch (err) { showToast('Błąd: ' + err.message) }
  }

  function confirmDeleteCourse(course) {
    setConfirm({
      message: `Usunąć kurs "${course.title}"? Operacja jest nieodwracalna.`,
      onConfirm: async () => {
        setConfirm(null)
        try { await deleteCourse(course.id); await load(); showToast('Kurs usunięty') }
        catch (err) { showToast('Błąd: ' + err.message) }
      },
    })
  }

  async function handleCreateLesson(courseId, values) {
    try {
      const lesson = await createLesson(values.title, courseId)
      navigate(`/admin/edit/${lesson.id}`)
    } catch (err) { showToast('Błąd: ' + err.message) }
  }

  async function handleUpdateLesson(id, values) {
    try {
      await updateLesson(id, { title: values.title, duration: values.duration })
      await load(); closeModal(); showToast('Lekcja zaktualizowana')
    } catch (err) { showToast('Błąd: ' + err.message) }
  }

  function confirmDeleteLesson(lesson) {
    setConfirm({
      message: `Usunąć lekcję "${lesson.title}"? Operacja jest nieodwracalna.`,
      onConfirm: async () => {
        setConfirm(null)
        try { await deleteLesson(lesson.id); await load(); showToast('Lekcja usunięta') }
        catch (err) { showToast('Błąd: ' + err.message) }
      },
    })
  }

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Ładowanie...</div>

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">Ścieżki & Kursy</h2>
          <p className="text-xs text-muted-foreground mt-1">Zarządzaj strukturą treści kursu</p>
        </div>
        <button
          onClick={() => setModal({ type: 'create-path' })}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all"
        >
          <Plus size={16} /> Dodaj ścieżkę
        </button>
      </div>

      <div className="space-y-4">
        {structure.map(path => (
          <div key={path.id} className="overflow-hidden rounded-2xl border border-border bg-card/30">
            <div className="flex items-center gap-3 border-b border-border bg-secondary/50 p-4">
              <button onClick={() => toggleExpand(path.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                {expanded[path.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              <Layers className="text-blue-400" size={16} />
              <span className="flex-1 font-bold text-foreground">{path.title}</span>
              <span className="rounded-full bg-blue-600/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-blue-400">{path.slug}</span>
              <button onClick={() => setModal({ type: 'edit-path', path })} className="ml-2 rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                <Edit3 size={14} />
              </button>
              <button onClick={() => confirmDeletePath(path)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>

            {expanded[path.id] && (
              <div className="p-4 space-y-4">
                {path.courses.map(course => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <BookOpen size={14} />
                      <span className="flex-1 text-sm font-bold uppercase tracking-widest">{course.title}</span>
                      <button onClick={() => setModal({ type: 'edit-course', course })} className="rounded-lg p-1 text-muted-foreground hover:text-primary transition-colors">
                        <Edit3 size={13} />
                      </button>
                      <button onClick={() => confirmDeleteCourse(course)} className="rounded-lg p-1 text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="ml-4 space-y-2">
                      {course.lessons
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map(lesson => (
                          <div key={lesson.id} className="group flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3 hover:border-primary/40 transition-all">
                            <span className="w-4 text-right text-xs font-mono text-muted-foreground">{lesson.order}</span>
                            <span className="flex-1 text-sm font-medium text-foreground">{lesson.title}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setModal({ type: 'edit-lesson', lesson })}
                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold uppercase text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                              >
                                <Edit3 size={12} /> Nazwa
                              </button>
                              <button
                                onClick={() => navigate(`/admin/edit/${lesson.id}`)}
                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold uppercase text-blue-400 hover:bg-blue-600/10 transition-colors"
                              >
                                <Eye size={12} /> Slajdy
                              </button>
                              <button
                                onClick={() => confirmDeleteLesson(lesson)}
                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold uppercase text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}

                      <button
                        onClick={() => setModal({ type: 'create-lesson', courseId: course.id })}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-primary transition-all"
                      >
                        <Plus size={13} /> Dodaj lekcję
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setModal({ type: 'create-course', pathId: path.id })}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-xs font-semibold text-muted-foreground hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
                >
                  <Plus size={13} /> Dodaj kurs
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {modal?.type === 'create-path' && (
        <InputModal
          title="Nowa ścieżka"
          fields={[
            { name: 'title', label: 'Tytuł', placeholder: 'np. Ścieżka No-Code' },
            { name: 'slug', label: 'Slug (URL)', placeholder: 'np. no-code' },
            { name: 'has_dual_mode', label: 'Tryb podwójny', type: 'checkbox', placeholder: 'Tryb Techniczny + Praktyka' },
          ]}
          onSubmit={(v) => handleCreatePath(v)}
          onCancel={closeModal}
        />
      )}
      {modal?.type === 'edit-path' && (
        <InputModal
          title="Edytuj ścieżkę"
          fields={[
            { name: 'title', label: 'Tytuł', placeholder: modal.path.title },
            { name: 'slug', label: 'Slug', placeholder: modal.path.slug },
            { name: 'has_dual_mode', label: 'Tryb podwójny', type: 'checkbox', placeholder: 'Tryb Techniczny + Praktyka' },
          ]}
          initialValues={{ title: modal.path.title, slug: modal.path.slug, has_dual_mode: modal.path.has_dual_mode }}
          onSubmit={(v) => handleUpdatePath(modal.path.id, v)}
          onCancel={closeModal}
        />
      )}
      {modal?.type === 'create-course' && (
        <InputModal
          title="Nowy kurs"
          fields={[{ name: 'title', label: 'Tytuł kursu', placeholder: 'np. Sztuka i inżynieria promptowania' }]}
          onSubmit={(v) => handleCreateCourse(modal.pathId, v)}
          onCancel={closeModal}
        />
      )}
      {modal?.type === 'edit-course' && (
        <InputModal
          title="Edytuj kurs"
          fields={[{ name: 'title', label: 'Tytuł kursu', placeholder: modal.course.title }]}
          initialValues={{ title: modal.course.title }}
          onSubmit={(v) => handleUpdateCourse(modal.course.id, v)}
          onCancel={closeModal}
        />
      )}
      {modal?.type === 'create-lesson' && (
        <InputModal
          title="Nowa lekcja"
          fields={[{ name: 'title', label: 'Tytuł lekcji', placeholder: 'np. Wstęp do Promptowania' }]}
          onSubmit={(v) => handleCreateLesson(modal.courseId, v)}
          onCancel={closeModal}
        />
      )}
      {modal?.type === 'edit-lesson' && (
        <InputModal
          title="Edytuj lekcję"
          fields={[
            { name: 'title', label: 'Tytuł lekcji', placeholder: modal.lesson.title },
            { name: 'duration', label: 'Czas trwania', placeholder: '10 min' },
          ]}
          initialValues={{ title: modal.lesson.title, duration: modal.lesson.duration }}
          onSubmit={(v) => handleUpdateLesson(modal.lesson.id, v)}
          onCancel={closeModal}
        />
      )}

      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
