const cache = {}

export const pathCache = {
  get: (slug) => cache[slug] ?? null,
  set: (slug, data) => { cache[slug] = data },
}
