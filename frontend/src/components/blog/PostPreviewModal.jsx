import { X, Clock, Tag } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/**
 * PostPreviewModal
 * Renderuje pełen podgląd wpisu bloga z sformatowanym markdown.
 * Props:
 *   post   – obiekt wpisu (wszystkie pola BlogPostAdmin)
 *   onClose – callback zamknięcia
 */
export default function PostPreviewModal({ post, onClose }) {
  if (!post) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Podgląd wpisu</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-8 py-6">
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                >
                  <Tag size={8} /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl font-black tracking-tight mb-3 leading-tight">{post.title}</h1>

          {/* Lead */}
          {post.lead && (
            <p className="text-muted-foreground text-sm leading-relaxed mb-5 border-l-2 border-primary/40 pl-4 italic">
              {post.lead}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-6">
            {post.author && <span className="font-medium">{post.author}</span>}
            {post.author && <span>·</span>}
            {post.reading_time && (
              <span className="flex items-center gap-1">
                <Clock size={10} /> {post.reading_time} min czytania
              </span>
            )}
            {post.reading_time && <span>·</span>}
            <span>{formatDate(post.published_at || post.created_at)}</span>
          </div>

          {/* Cover image */}
          {post.cover_image && (
            <figure className="mb-6 rounded-2xl overflow-hidden border border-border bg-muted">
              <img src={post.cover_image} alt={`Okładka wpisu: ${post.title}`} className="w-full max-h-[400px] object-cover" />
            </figure>
          )}

          {/* Divider */}
          <div className="border-t border-border mb-6" />

          {/* Markdown content */}
          {post.content_markdown ? (
            <div className="prose-blog">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-xl font-black mb-3 mt-6">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-5">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-4">{children}</h3>,
                  p: ({ children }) => <p className="text-sm leading-relaxed mb-4 text-foreground">{children}</p>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
                    >
                      {children}
                    </a>
                  ),
                  img: ({ src, alt }) => (
                    <figure className="my-5">
                      <img
                        src={src}
                        alt={alt}
                        className="rounded-xl w-full max-h-80 object-cover border border-border"
                        loading="lazy"
                      />
                      {alt && <figcaption className="text-center text-xs text-muted-foreground mt-2">{alt}</figcaption>}
                    </figure>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 text-muted-foreground italic text-sm">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-card/80 border border-border rounded px-1.5 py-0.5 text-xs font-mono text-foreground">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-card/80 border border-border rounded-xl p-4 overflow-x-auto text-xs font-mono my-4">
                      {children}
                    </pre>
                  ),
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 text-sm">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 text-sm">{children}</ol>,
                  li: ({ children }) => <li className="text-foreground leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  hr: () => <hr className="border-border my-6" />,
                }}
              >
                {post.content_markdown}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">Wpis nie ma jeszcze treści.</p>
          )}
        </div>
      </div>
    </div>
  )
}
