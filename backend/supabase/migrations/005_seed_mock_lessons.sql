-- backend/supabase/migrations/005_seed_mock_lessons.sql
DO $$
DECLARE
  v_path_id uuid;
  v_course_id uuid := 'c0000000-0000-0000-0000-000000000000';
BEGIN
  -- Znajdź path 'wspolna'
  SELECT id INTO v_path_id FROM public.paths WHERE slug = 'wspolna' LIMIT 1;

  -- Dodaj kurs mock
  INSERT INTO public.courses (id, path_id, title, "order")
  VALUES (v_course_id, v_path_id, 'Wprowadzenie do AI', 1)
  ON CONFLICT (id) DO NOTHING;

  -- Dodaj lekcje mock ze sztywnymi UUID (żeby zgrać z frontendem)
  INSERT INTO public.lessons (id, course_id, title, "order")
  VALUES
    ('11111111-0000-0000-0000-000000000001', v_course_id, 'Wstęp – Gdzie jesteśmy z AI?', 1),
    ('11111111-0000-0000-0000-000000000002', v_course_id, 'Sztuka i inżynieria Promptowania', 2),
    ('11111111-0000-0000-0000-000000000003', v_course_id, 'Twój nowy zespół – modele webowe', 3)
  ON CONFLICT (id) DO NOTHING;
END
$$;