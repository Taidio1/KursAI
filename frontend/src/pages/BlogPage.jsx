import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import BlogHeader from '../components/blog/BlogHeader'
import FeaturedPost from '../components/blog/FeaturedPost'
import PostGrid from '../components/blog/PostGrid'
import { blogService } from '../services/blogService'

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    blogService
      .getPosts()
      .then(data => {
        setPosts(data || [])
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  const [featured, ...rest] = posts

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />

        <BlogHeader />

        <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 space-y-12">

          {/* Loading spinner */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-400">
              Błąd ładowania wpisów: {error}
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {featured && (
                <section aria-label="Wyróżniony wpis">
                  <FeaturedPost post={featured} />
                </section>
              )}

              {rest.length > 0 && <PostGrid posts={rest} />}

              {posts.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  Brak wpisów. Wróć wkrótce!
                </div>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-primary" />
              <span>© {new Date().getFullYear()} Agentic Hub. Wszelkie prawa zastrzeżone.</span>
            </div>
            <nav className="flex items-center gap-6" aria-label="Linki stopki">
              <Link to="/about" className="hover:text-foreground transition-colors">O nas</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Kontakt</Link>
              <Link to="/newsletter" className="hover:text-foreground transition-colors">Newsletter</Link>
            </nav>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}