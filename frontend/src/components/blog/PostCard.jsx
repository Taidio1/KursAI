import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import TagPill from './TagPill'
import PostMeta from './PostMeta'

export default function PostCard({ post, index = 0 }) {
  const { id, slug, title, excerpt, lead, tags, date, readTime, thumbnail, coverImage, cover_image, published_at, reading_time } = post

  const displayDate = date || published_at
  const displayReadTime = readTime || reading_time
  const displayExcerpt = excerpt || lead
  const displayImage = cover_image || thumbnail || coverImage || `https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=75`
  const linkTo = slug ? `/blog/${slug}` : `/blog/${id}`

  return (
    <Link
      to={linkTo}
      className="block group"
      aria-label={`Czytaj artykuł: ${title}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <article className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:border-primary/20 animate-fade-up h-full">
        {/* Thumbnail */}
        <div className="relative overflow-hidden aspect-[3/2] bg-muted">
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <ArrowUpRight size={18} className="text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Tags */}
          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => <TagPill key={tag} tag={tag} />)}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>

          {/* Excerpt */}
          {displayExcerpt && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1">
              {displayExcerpt}
            </p>
          )}

          {/* Meta */}
          <div className="mt-auto pt-2 border-t border-border/60">
            <PostMeta date={displayDate} readTime={displayReadTime} />
          </div>
        </div>
      </article>
    </Link>
  )
}
