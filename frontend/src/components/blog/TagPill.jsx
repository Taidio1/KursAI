export default function TagPill({ tag }) {
  return (
    <span className="inline-flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold hover:bg-primary/20 transition-colors duration-200 cursor-default select-none">
      {tag}
    </span>
  )
}
