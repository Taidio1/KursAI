import { Calendar, Clock } from 'lucide-react'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function PostMeta({ date, readTime }) {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      {date && (
        <span className="flex items-center gap-1.5">
          <Calendar size={13} className="shrink-0" />
          {formatDate(date)}
        </span>
      )}
      {readTime && (
        <span className="flex items-center gap-1.5">
          <Clock size={13} className="shrink-0" />
          {readTime} min czytania
        </span>
      )}
    </div>
  )
}
