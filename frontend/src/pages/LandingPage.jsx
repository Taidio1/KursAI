import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import { ArrowRight, BookOpen, Layers, Code2, Package } from 'lucide-react'

const PATHS = [
  {
    icon: Layers,
    title: 'Ścieżka Wspólna',
    desc: 'Fundamenty dla każdego — niezależnie od poziomu technicznego.',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
  },
  {
    icon: Package,
    title: 'Ścieżka No-Code',
    desc: 'Automatyzacja i AI bez pisania kodu. Dla każdego kto chce zacząć.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Code2,
    title: 'Ścieżka Kod',
    desc: 'Inżynieria AI dla deweloperów. Buduj własne modele i narzędzia.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
]

export default function LandingPage() {
  const { user, loading } = useAuth()

  if (loading) return null

  return (
    <PageTransition>
      <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden font-sans antialiased">
        <Navbar />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <main>
            {/* Hero */}
            <section className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-8">
                Kurs AI 2026
              </div>
              <h1 className="text-5xl font-black tracking-tight leading-tight mb-6 lg:text-6xl">
                Jak efektywnie<br />
                <span className="text-primary">używać AI</span> w 2026
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                Kompleksowy kurs w języku polskim — od fundamentów promptowania po budowanie własnych narzędzi AI.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all"
                >
                  Rozpocznij kurs <ArrowRight size={16} />
                </Link>
                <Link
                  to="/blog"
                  className="flex items-center gap-2 border border-border text-foreground font-bold px-6 py-3 rounded-xl hover:bg-secondary/50 transition-all"
                >
                  <BookOpen size={16} /> Czytaj blog
                </Link>
              </div>
            </section>

            {/* Ścieżki */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-black tracking-tight text-center mb-2">Trzy ścieżki nauki</h2>
              <p className="text-muted-foreground text-center mb-10">Wybierz poziom dopasowany do siebie</p>
              <div className="grid gap-6 md:grid-cols-3">
                {PATHS.map(({ icon: Icon, title, desc, color, bg }) => (
                  <div key={title} className="rounded-2xl border border-border bg-card/50 p-6">
                    <div className={`inline-flex p-3 rounded-xl mb-4 ${bg}`}>
                      <Icon size={20} className={color} />
                    </div>
                    <h3 className="font-black text-lg mb-2">{title}</h3>
                    <p className="text-muted-foreground text-sm">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Materiały */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black tracking-tight mb-1">Biblioteka materiałów</h2>
                  <p className="text-muted-foreground text-sm">Narzędzia, zasoby i linki zebrane w jednym miejscu</p>
                </div>
                <Link
                  to="/login"
                  className="text-[12px] font-bold uppercase tracking-wider text-primary hover:opacity-80 transition-all flex items-center gap-1"
                >
                  Przeglądaj <ArrowRight size={13} />
                </Link>
              </div>
              <div className="rounded-2xl border border-border bg-card/30 p-8 text-center">
                <p className="text-muted-foreground text-sm">Zaloguj się aby uzyskać dostęp do pełnej biblioteki materiałów</p>
                <Link to="/register" className="inline-block mt-4 bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all">
                  Utwórz konto — to darmowe
                </Link>
              </div>
            </section>

            {/* Blog preview */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black tracking-tight mb-1">Blog</h2>
                  <p className="text-muted-foreground text-sm">Aktualności, tutoriale i przemyślenia o AI</p>
                </div>
                <Link
                  to="/blog"
                  className="text-[12px] font-bold uppercase tracking-wider text-primary hover:opacity-80 transition-all flex items-center gap-1"
                >
                  Wszystkie wpisy <ArrowRight size={13} />
                </Link>
              </div>
              <BlogPreview />
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
              © 2026 KursAI — Jak efektywnie używać AI
            </footer>
          </main>
        </div>
      </div>
    </PageTransition>

  )
}

function BlogPreview() {
  // Statyczny placeholder — widoczny bez ładowania danych
  return (
    <div className="rounded-2xl border border-border bg-card/30 p-8 text-center">
      <BookOpen size={24} className="mx-auto mb-3 text-muted-foreground" />
      <p className="text-muted-foreground text-sm">Wpisy pojawią się tutaj wkrótce.</p>
      <Link to="/blog" className="inline-block mt-4 text-primary text-sm font-bold hover:opacity-80">
        Przejdź do bloga →
      </Link>
    </div>
  )
}
