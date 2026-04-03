export async function syncNotionContent(adminSecret) {
  const response = await fetch('http://localhost:8000/sync/notion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-secret': adminSecret,
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
