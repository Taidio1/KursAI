import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import TagPill from './TagPill'
import PostMeta from './PostMeta'

export default function FeaturedPost({ post }) {
  const { id, slug, title, excerpt, lead, tags, date, readTime, coverImage, cover_image, published_at, reading_time } = post

  const displayDate = date || published_at
  const displayReadTime = readTime || reading_time
  const displayExcerpt = excerpt || lead
  const displayImage = cover_image || coverImage || `https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80`
  const linkTo = slug ? `/blog/${slug}` : `/blog/${id}`

  return (
    <Link to={linkTo} className="block group" aria-label={`Czytaj artykuł: ${title}`}>
      <article className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Image column */}
          <div className="relative overflow-hidden bg-muted aspect-[16/9] md:aspect-auto min-h-[200px] md:min-h-[320px]">
            <img
              src={displayImage}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Featured badge */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />
              Najnowszy wpis
            </div>
          </div>

          {/* Content column */}
          <div className="flex flex-col justify-center p-6 sm:p-8 gap-4">
            {/* Tags */}
            {tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => <TagPill key={tag} tag={tag} />)}
              </div>
            )}

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-3">
              {title}
            </h2>

            {/* Excerpt */}
            {displayExcerpt && (
              <p className="text-muted-foreground leading-relaxed line-clamp-3 text-sm sm:text-base">
                {displayExcerpt}
              </p>
            )}

            {/* Meta + CTA */}
            <div className="flex flex-col gap-4 mt-auto pt-2">
              <PostMeta date={displayDate} readTime={displayReadTime} />
              <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm group/btn">
                Czytaj artykuł
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover:translate-x-1"
                />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
