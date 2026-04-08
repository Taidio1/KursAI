import { useEffect, useState } from 'react'
import { fetchAdminStats, fetchFullStructure } from '../../services/adminService'
import { Users, Wifi, BookOpen, Package } from 'lucide-react'

export default function AdminOverview() {
  const [stats, setStats] = useState(null)
  const [structure, setStructure] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [s, struct] = await Promise.all([fetchAdminStats(), fetchFullStructure()])
        setStats(s)
        setStructure(struct)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Ładowanie...</div>
  if (error) return <div className="p-8 text-sm text-red-400">{error}</div>

  const STAT_CARDS = [
    { label: 'Użytkownicy', value: stats.usersCount, icon: Users, color: 'text-blue-400' },
    { label: 'Aktywne sesje', value: stats.sessionsCount, icon: Wifi, color: 'text-green-400' },
    { label: 'Lekcje', value: stats.lessonsCount, icon: BookOpen, color: 'text-cyan-400' },
    { label: 'Opublikowane materiały', value: stats.publishedMaterialsCount, icon: Package, color: 'text-amber-400' },
  ]

  return (
    <div className="p-8 space-y-10">
      <div>
        <h2 className="mb-6 text-2xl font-black uppercase tracking-tighter text-foreground">Przegląd</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-4 rounded-2xl border border-border bg-card/50 p-5">
              <Icon className={color} size={22} />
              <div>
                <div className="text-2xl font-black text-foreground">{value}</div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">Aktywne sesje</h3>
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                {['User ID', 'Session Key', 'Ostatnia aktywność'].map(h => (
                  <th key={h} className="p-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.sessions.length === 0 ? (
                <tr><td colSpan={3} className="p-4 text-center text-sm text-muted-foreground">Brak aktywnych sesji</td></tr>
              ) : stats.sessions.map(s => (
                <tr key={s.user_id} className="border-t border-border transition-colors hover:bg-secondary/20">
                  <td className="p-3 font-mono text-xs text-muted-foreground">{s.user_id.slice(0, 8)}…</td>
                  <td className="p-3 font-mono text-xs">{s.session_key.slice(0, 12)}…</td>
                  <td className="p-3 text-xs text-muted-foreground">{new Date(s.updated_at).toLocaleString('pl-PL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">Struktura treści</h3>
        <div className="space-y-3">
          {structure.map(path => {
            const lessonCount = path.courses.reduce((a, c) => a + c.lessons.length, 0)
            return (
              <div key={path.id} className="flex items-center justify-between rounded-xl border border-border bg-card/30 p-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{path.title}</span>
                  <span className="rounded-full bg-blue-600/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-blue-400">{path.slug}</span>
                </div>
                <div className="text-xs text-muted-foreground">{path.courses.length} kursów · {lessonCount} lekcji</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
