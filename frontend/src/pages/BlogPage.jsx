import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import { blogService } from '../services/blogService'
import { Calendar, Clock, Tag } from 'lucide-react'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })
}

function TagList({ tags }) {
  if (!tags?.length) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map(tag => (
        <span key={tag} className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          {tag}
        </span>
      ))}
    </div>
  )
}

function PostMeta({ post }) {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
  )
}

function FeaturedPost({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="block group">
      <div className="rounded-2xl border border-border bg-card/50 hover:border-primary/30 transition-all p-8 mb-3">
        <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-5">
          Najnowszy wpis
        </div>
        <h2 className="text-2xl font-black tracking-tight leading-tight mb-3 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-5">{post.lead}</p>
        <div className="flex items-center justify-between">
          <TagList tags={post.tags} />
          <PostMeta post={post} />
        </div>
      </div>
    </Link>
  )
}

function PostRow({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="block group border-b border-border py-6 last:border-0">
      <TagList tags={post.tags} />
      <h3 className="text-lg font-black tracking-tight mt-2 mb-2 group-hover:text-primary transition-colors">
        {post.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-3">{post.lead}</p>
      <PostMeta post={post} />
    </Link>
  )
}

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    blogService.getPosts()
      .then(data => { setPosts(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const [featured, ...rest] = posts

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="mb-10">
            <h1 className="text-4xl font-black tracking-tight mb-2">Blog KursAI</h1>
            <p className="text-muted-foreground">Aktualności, tutoriale i przemyślenia o AI</p>
          </div>

          {loading && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-400">
              Błąd ładowania: {error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              Brak wpisów. Wróć wkrótce!
            </div>
          )}

          {!loading && !error && featured && (
            <>
              <FeaturedPost post={featured} />
              {rest.length > 0 && (
                <div className="mt-2">
                  {rest.map(post => <PostRow key={post.id} post={post} />)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  )
}