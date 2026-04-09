import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import { blogService } from '../services/blogService'
import { Check, Clock, Trash2, Eye, X } from 'lucide-react'

const STATUS_LABELS = {
  draft: 'Draft',
  scheduled: 'Zaplanowany',
  published: 'Opublikowany',
}

const STATUS_COLORS = {
  draft: 'bg-yellow-500/10 text-yellow-400',
  scheduled: 'bg-blue-500/10 text-blue-400',
  published: 'bg-emerald-500/10 text-emerald-400',
}

const TABS = ['draft', 'scheduled', 'published']

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('draft')
  const [schedulePostId, setSchedulePostId] = useState(null)
  const [scheduleDate, setScheduleDate] = useState('')
  const [previewPost, setPreviewPost] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  const loadPosts = () => {
    setLoading(true)
    blogService.getAdminPosts()
      .then(data => { setPosts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { loadPosts() }, [])

  const filtered = posts.filter(p => p.status === activeTab)

  const handlePublish = async (id) => {
    setActionLoading(id)
    await blogService.updatePost(id, { status: 'published' })
    loadPosts()
    setActionLoading(null)
  }

  const handleSchedule = async (id) => {
    if (!scheduleDate) return
    setActionLoading(id)
    await blogService.updatePost(id, { status: 'scheduled', scheduled_at: new Date(scheduleDate).toISOString() })
    setSchedulePostId(null)
    setScheduleDate('')
    loadPosts()
    setActionLoading(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Usunąć wpis?')) return
    setActionLoading(id)
    await blogService.deletePost(id)
    loadPosts()
    setActionLoading(null)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-1">Blog — panel admina</h1>
            <p className="text-muted-foreground text-sm">Zarządzaj wpisami dostarczanymi przez n8n</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-border">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider transition-all border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {STATUS_LABELS[tab]} ({posts.filter(p => p.status === tab).length})
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              Brak wpisów w tej kategorii
            </div>
          )}

          {!loading && filtered.map(post => (
            <div key={post.id} className="border border-border rounded-xl p-5 mb-3 bg-card/30">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_COLORS[post.status]}`}>
                      {STATUS_LABELS[post.status]}
                    </span>
                    {post.tags?.map(tag => (
                      <span key={tag} className="text-[10px] text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                  <h3 className="font-black text-base mb-1 truncate">{post.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-3">{post.lead}</p>
                  <div className="text-[11px] text-muted-foreground">
                    Wpłynął: {formatDate(post.created_at)}
                    {post.scheduled_at && ` · Zaplanowany: ${formatDate(post.scheduled_at)}`}
                    {post.published_at && ` · Opublikowany: ${formatDate(post.published_at)}`}
                  </div>
                </div>

                {/* Akcje */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setPreviewPost(post)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                    title="Podgląd"
                  >
                    <Eye size={15} />
                  </button>
                  {post.status !== 'published' && (
                    <button
                      onClick={() => handlePublish(post.id)}
                      disabled={actionLoading === post.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-[11px] font-bold hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                      title="Publikuj teraz"
                    >
                      <Check size={13} /> Publikuj
                    </button>
                  )}
                  {post.status === 'draft' && (
                    <button
                      onClick={() => setSchedulePostId(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-[11px] font-bold hover:bg-blue-500/20 transition-all"
                      title="Zaplanuj"
                    >
                      <Clock size={13} /> Zaplanuj
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={actionLoading === post.id}
                    className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                    title="Usuń"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Schedule form */}
              {schedulePostId === post.id && (
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                  />
                  <button
                    onClick={() => handleSchedule(post.id)}
                    disabled={!scheduleDate || actionLoading === post.id}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    Ustaw
                  </button>
                  <button
                    onClick={() => setSchedulePostId(null)}
                    className="p-2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Preview modal */}
        {previewPost && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPreviewPost(null)}
          >
            <div
              className="bg-background border border-border rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-black text-lg">{previewPost.title}</h2>
                <button onClick={() => setPreviewPost(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>
              <p className="text-muted-foreground text-sm mb-6">{previewPost.lead}</p>
              <div className="text-sm text-foreground whitespace-pre-wrap font-mono bg-card/50 border border-border rounded-xl p-4 overflow-auto max-h-80">
                {previewPost.content_markdown}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}