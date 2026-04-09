import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import { blogService } from '../services/blogService'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    blogService.getPost(slug)
      .then(data => { setPost(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [slug])

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Wróć do bloga
          </Link>

          {loading && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-400">
              {error === 'Failed to fetch blog post' ? 'Wpis nie istnieje lub nie jest opublikowany.' : error}
            </div>
          )}

          {!loading && !error && post && (
            <>
              {/* Tagi */}
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Nagłówek */}
              <h1 className="text-3xl font-black tracking-tight leading-tight mb-4">{post.title}</h1>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-8 pb-8 border-b border-border">
                <span>{post.author}</span>
                {post.published_at && (
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> {formatDate(post.published_at)}
                  </span>
                )}
                {post.reading_time && (
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {post.reading_time} min czytania
                  </span>
                )}
              </div>

              {/* Treść Markdown */}
              <div className="prose prose-invert prose-sm max-w-none
                prose-headings:font-black prose-headings:tracking-tight
                prose-a:text-primary prose-a:no-underline hover:prose-a:opacity-80
                prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-card prose-pre:border prose-pre:border-border
                prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground">
                <ReactMarkdown>{post.content_markdown}</ReactMarkdown>
              </div>

              {/* Powrót */}
              <div className="mt-12 pt-8 border-t border-border">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={14} /> Wróć do wszystkich wpisów
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  )
}