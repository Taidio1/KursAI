import PostCard from './PostCard'

export default function PostGrid({ posts }) {
  if (!posts?.length) return null

  return (
    <section aria-label="Starsze wpisy">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold tracking-tight shrink-0 whitespace-nowrap">
          Starsze wpisy
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
        <span className="shrink-0 text-xs text-muted-foreground font-medium bg-secondary px-2.5 py-1 rounded-full">
          {posts.length} {posts.length === 1 ? 'artykuł' : posts.length < 5 ? 'artykuły' : 'artykułów'}
        </span>
      </div>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </section>
  )
}
