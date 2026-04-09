import { Link } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Package, ArrowLeft, Rss } from 'lucide-react'

const SECTIONS = [
  { id: 'overview', label: 'Przegląd', icon: LayoutDashboard },
  { id: 'content', label: 'Ścieżki & Kursy', icon: BookOpen },
  { id: 'materials', label: 'Materiały', icon: Package },
]

export default function AdminSidebar({ activeSection, onSectionChange }) {
  return (
    <aside className="w-60 flex-shrink-0 flex flex-col border-r border-border bg-card/50">
      <div className="p-5 border-b border-border">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Panel Admina</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
              activeSection === id
                ? 'bg-primary/10 text-primary border-l-2 border-primary pl-[10px]'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}

        {/* Blog — osobna strona */}
        <Link
          to="/admin/blog"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        >
          <Rss size={16} />
          Blog
        </Link>
      </nav>

      <div className="p-3 border-t border-border">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
        >
          <ArrowLeft size={15} />
          Wróć do Dashboard
        </Link>
      </div>
    </aside>
  )
}