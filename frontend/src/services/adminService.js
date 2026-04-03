export async function syncNotionContent() {
  const secret = import.meta.env.VITE_ADMIN_SECRET || 'dev_secret'
  
  const response = await fetch('http://localhost:8000/sync/notion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-secret': secret,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Błąd synchronizacji')
  }

  return {
    lessons_synced: data.lessons_synced,
    slides_created: data.slides_created,
  }
}
