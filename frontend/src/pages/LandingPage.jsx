import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import { ArrowRight, BookOpen, Layers, Code2, Package } from 'lucide-react'
import { blogService } from '../services/blogService'

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
                Agentic Hub 2026
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
              © 2026 Agentic Hub — Jak efektywnie używać AI
            </footer>
          </main>
        </div>
      </div>
    </PageTransition>
  )
}

function BlogPreview() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    blogService.getPosts()
      .then(data => setPosts(data.slice(0, 3)))
      .catch(err => console.error('Error fetching posts:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 rounded-2xl bg-card/30 animate-pulse" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
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

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {posts.map((post, index) => (
        <LandingPostCard key={post.id || index} post={post} isLatest={index === 0} />
      ))}
    </div>
  )
}

function LandingPostCard({ post, isLatest }) {
  const publishedDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('pl-PL')
    : new Date().toLocaleDateString('pl-PL');

  return (
    <Link 
      to={`/blog/${post.slug}`} 
      className={`group block p-4 rounded-2xl border border-border transition-all hover:border-primary/50 ${
        isLatest ? 'bg-primary/5' : 'bg-card/30'
      }`}
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted mb-4">
        {post.cover_image ? (
          <img 
            src={post.cover_image} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/30">
            <BookOpen size={32} className="text-muted-foreground/50" />
          </div>
        )}
        
        {isLatest && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-primary text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Nowy wpis
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-black text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-muted-foreground text-[12px] line-clamp-2 leading-relaxed">
          {post.lead || 'Kliknij aby przeczytać więcej...'}
        </p>
        
        <div className="pt-2 flex items-center justify-between border-t border-border/50">
          <div className="text-primary text-[10px] font-bold">
            Czytaj więcej →
          </div>
          <div className="text-muted-foreground/60 text-[10px] font-medium">
            {publishedDate}
          </div>
        </div>
      </div>
    </Link>
  )
}
