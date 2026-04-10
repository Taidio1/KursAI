import { Sparkles } from 'lucide-react'
import ThemeToggle from '../ThemeToggle'

export default function BlogHeader() {
  return (
    <header className="relative overflow-hidden">
      {/* Gradient background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-10 flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <Sparkles size={22} className="text-primary shrink-0" />
            <h1 className="text-3xl font-black tracking-tight">
              Blog{' '}
              <span className="text-primary">Agentic Hub</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
            Aktualności, tutoriale i przemyślenia o sztucznej inteligencji — dla każdego poziomu.
          </p>
        </div>

        <div className="shrink-0 mt-1">
          <ThemeToggle />
        </div>
      </div>

      {/* Gradient separator line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </header>
  )
}
