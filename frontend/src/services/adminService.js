import { supabase } from '../lib/supabase'

export async function fetchLessonData(lessonId) {
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*, courses(title)')
    .eq('id', lessonId)
    .single()
  
  if (lessonError) throw lessonError

  const { data: slides, error: slidesError } = await supabase
    .from('slides')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order', { ascending: true })

  if (slidesError) throw slidesError

  return { lesson, slides }
}

export async function saveLessonData(lessonId, lessonUpdates, slides) {
  // 1. Update lesson metadata
  const { error: lessonError } = await supabase
    .from('lessons')
    .update(lessonUpdates)
    .eq('id', lessonId)

  if (lessonError) throw lessonError

  // 2. Delete old slides
  const { error: deleteError } = await supabase
    .from('slides')
    .delete()
    .eq('lesson_id', lessonId)

  if (deleteError) throw deleteError

  // 3. Insert new slides
  const slidesToInsert = slides.map((s, index) => ({
    lesson_id: lessonId,
    mode: s.mode || 'technical',
    order: index,
    duration_seconds: s.duration_seconds || 180,
    content_json: s.content_json,
    bot_comment: s.bot_comment
  }))

  const { error: insertError } = await supabase
    .from('slides')
    .insert(slidesToInsert)

  if (insertError) throw insertError
  
  return { success: true }
}

export async function fetchFullStructure() {
  // Pobierz ścieżki z ich kursami i lekcjami
  const { data: paths, error } = await supabase
    .from('paths')
    .select(`
      *,
      courses (
        *,
        lessons (*)
      )
    `)
    .order('order', { foreignTable: 'courses', ascending: true })

  if (error) throw error
  return paths
}

export async function createLesson(title, courseId) {
  // Pobierz max order dla kursu
  const { data: lessons } = await supabase
    .from('lessons')
    .select('order')
    .eq('course_id', courseId)
    .order('order', { ascending: false })
    .limit(1)

  const lastLesson = lessons?.[0]
  const nextOrder = lastLesson ? lastLesson.order + 1 : 0

  const { data: newLesson, error } = await supabase
    .from('lessons')
    .insert({
      title,
      course_id: courseId,
      order: nextOrder
    })
    .select()
    .single()

  if (error) throw error
  return newLesson
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function fetchAdminStats() {
  const [
    { count: usersCount, error: e1 },
    { data: sessions, count: sessionsCount, error: e2 },
    { count: lessonsCount, error: e3 },
    { count: publishedMaterialsCount, error: e4 },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('active_sessions').select('*', { count: 'exact' }).order('updated_at', { ascending: false }),
    supabase.from('lessons').select('*', { count: 'exact', head: true }),
    supabase.from('materials').select('*', { count: 'exact', head: true }).eq('is_published', true),
  ])

  const firstError = e1 || e2 || e3 || e4
  if (firstError) throw firstError

  return {
    usersCount: usersCount ?? 0,
    sessionsCount: sessionsCount ?? 0,
    lessonsCount: lessonsCount ?? 0,
    publishedMaterialsCount: publishedMaterialsCount ?? 0,
    sessions: sessions ?? [],
  }
}

// ─── Materials ────────────────────────────────────────────────────────────────

export async function fetchMaterials() {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createMaterial(materialData) {
  const { data, error } = await supabase
    .from('materials')
    .insert(materialData)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateMaterial(id, updates) {
  const { error } = await supabase
    .from('materials')
    .update(updates)
    .eq('id', id)
  if (error) throw error
}

export async function deleteMaterial(id) {
  const { error } = await supabase
    .from('materials')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ─── Paths ────────────────────────────────────────────────────────────────────

export async function createPath(title, slug, hasDualMode) {
  const { data, error } = await supabase
    .from('paths')
    .insert({ title, slug, has_dual_mode: hasDualMode })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updatePath(id, updates) {
  const { error } = await supabase
    .from('paths')
    .update(updates)
    .eq('id', id)
  if (error) throw error
}

export async function deletePath(id) {
  const { error } = await supabase
    .from('paths')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export async function createCourse(title, pathId) {
  const { data: courses } = await supabase
    .from('courses')
    .select('order')
    .eq('path_id', pathId)
    .order('order', { ascending: false })
    .limit(1)

  const nextOrder = courses?.[0] ? courses[0].order + 1 : 0

  const { data, error } = await supabase
    .from('courses')
    .insert({ title, path_id: pathId, order: nextOrder })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCourse(id, updates) {
  const { error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', id)
  if (error) throw error
}

export async function deleteCourse(id) {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ─── Lessons ──────────────────────────────────────────────────────────────────

export async function updateLesson(id, updates) {
  const { error } = await supabase
    .from('lessons')
    .update(updates)
    .eq('id', id)
  if (error) throw error
}

export async function deleteLesson(id) {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id)
  if (error) throw error
}
