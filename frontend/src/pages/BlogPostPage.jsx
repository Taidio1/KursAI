import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import { blogService } from '../services/blogService'
import { ArrowLeft, Calendar, Clock, ChevronRight } from 'lucide-react'
import { motion, useScroll, useSpring } from 'framer-motion'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })
}

const animProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    blogService.getPost(slug)
      .then(data => { setPost(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [slug])

  return (
    <PageTransition>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-primary z-[100] origin-left" 
        style={{ scaleX }} 
      />
      <div className="min-h-screen bg-background text-foreground pb-24">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-1.5 rounded-full transition-all"
            >
              <ArrowLeft size={16} /> Wróć do bloga
            </Link>
          </motion.div>

          {loading && (
            <div className="flex justify-center py-24">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center text-red-500">
              {error === 'Failed to fetch blog post' ? 'Wpis nie istnieje lub nie jest opublikowany.' : error}
            </div>
          )}

          {!loading && !error && post && (
            <motion.article 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-card/50 dark:bg-card/30 backdrop-blur-xl border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] rounded-[2rem] p-6 sm:p-10 md:p-16 overflow-hidden relative"
            >
              <div className="mx-auto max-w-[680px]">
                {/* Tagi */}
                {post.tags?.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="flex flex-wrap gap-2.5 mb-8"
                  >
                    {post.tags.map(tag => (
                      <span key={tag} className="bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ring-1 ring-primary/20">
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                )}

                {/* Nagłówek */}
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.2] mb-8 text-balance"
                >
                  {post.title}
                </motion.h1>

                {/* Meta */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap items-center gap-y-3 gap-x-5 text-[13px] text-muted-foreground mb-12 pb-12 border-b border-border/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] ring-1 ring-primary/20">
                      {post.author.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-foreground/80">{post.author}</span>
                  </div>
                  {post.published_at && (
                    <span className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-md ring-1 ring-border/50">
                      <Calendar size={13} className="text-primary/70" /> {formatDate(post.published_at)}
                    </span>
                  )}
                  {post.reading_time && (
                    <span className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-md ring-1 ring-border/50">
                      <Clock size={13} className="text-primary/70" /> {post.reading_time} min
                    </span>
                  )}
                </motion.div>

                {/* Okladka */}
                {post.cover_image && (
                  <motion.figure 
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
                    className="mb-14 rounded-2xl overflow-hidden border border-border/50 bg-muted shadow-lg group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    <img src={post.cover_image} alt={`Okładka wpisu: ${post.title}`} className="w-full h-auto max-h-[450px] object-cover transition-transform duration-1000 group-hover:scale-[1.03]" />
                  </motion.figure>
                )}

                {/* Treść Markdown */}
                <div className="prose-blog">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <motion.h1 {...animProps} className="text-3xl font-black mb-6 mt-12 tracking-tight text-foreground">{children}</motion.h1>,
                      h2: ({ children }) => <motion.h2 {...animProps} className="text-2xl font-bold mb-4 mt-10 tracking-tight text-foreground">{children}</motion.h2>,
                      h3: ({ children }) => <motion.h3 {...animProps} className="text-xl font-bold mb-3 mt-8 text-foreground">{children}</motion.h3>,
                      p: ({ children }) => <motion.p {...animProps} className="text-[15px] sm:text-[16px] leading-[1.8] mb-6 text-muted-foreground">{children}</motion.p>,
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all"
                        >
                          {children}
                        </a>
                      ),
                      img: ({ src, alt }) => (
                        <motion.figure {...animProps} className="my-10">
                          <img
                            src={src}
                            alt={alt}
                            className="rounded-2xl w-full max-h-[400px] object-cover border border-border shadow-sm transition-transform hover:scale-[1.02] duration-500"
                            loading="lazy"
                          />
                          {alt && <figcaption className="text-center text-[13px] text-muted-foreground mt-3 italic">{alt}</figcaption>}
                        </motion.figure>
                      ),
                      blockquote: ({ children }) => (
                        <motion.blockquote {...animProps} className="relative border-l-[3px] border-primary pl-6 py-1 my-10 text-foreground/80 italic text-lg sm:text-xl font-medium">
                          {children}
                        </motion.blockquote>
                      ),
                      code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '')
                        return match ? (
                          <code className={`text-zinc-200 font-mono text-[13px] ${className}`} {...props}>
                            {children}
                          </code>
                        ) : (
                          <code className="bg-muted px-1.5 py-0.5 rounded-md text-primary font-mono text-[0.85em] mx-0.5" {...props}>
                            {children}
                          </code>
                        )
                      },
                      pre: ({ children }) => (
                        <motion.pre {...animProps} className="bg-[#0f1115] border border-border/20 rounded-2xl p-5 overflow-x-auto text-[13px] font-mono my-8 shadow-inner">
                          {children}
                        </motion.pre>
                      ),
                      ul: ({ children }) => <motion.ul {...animProps} className="list-disc list-outside space-y-2.5 mb-8 ml-5 text-[15px] sm:text-[16px] text-muted-foreground">{children}</motion.ul>,
                      ol: ({ children }) => <motion.ol {...animProps} className="list-decimal list-outside space-y-2.5 mb-8 ml-5 text-[15px] sm:text-[16px] text-muted-foreground">{children}</motion.ol>,
                      li: ({ children }) => <li className="pl-1 leading-[1.8] marker:text-primary/60">{children}</li>,
                      strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                      em: ({ children }) => <em className="italic text-foreground/90">{children}</em>,
                      hr: () => <motion.hr {...animProps} className="border-border/40 my-14" />,
                    }}
                  >
                    {post.content_markdown}
                  </ReactMarkdown>
                </div>

                {/* Powrót */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mt-20 pt-10 border-t border-border/50 flex flex-col sm:flex-row shadow-[0_2px_20px_rgb(0,0,0,0.02)] border border-border/30 bg-card p-6 sm:p-8 rounded-[2rem] items-center justify-between gap-6"
                >
                  <p className="text-foreground font-semibold text-lg">Chcesz czytać dalej?</p>
                  <Link
                    to="/blog"
                    className="group inline-flex items-center justify-center gap-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all px-6 py-3.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Odkryj pozostałe wpisy <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </motion.article>
          )}
        </div>
      </div>
    </PageTransition>
  )
}