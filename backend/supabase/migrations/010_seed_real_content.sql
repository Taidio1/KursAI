-- Seed real lessons data from CoursePage.jsx
DO $$
DECLARE
  v_path_id uuid;
  v_course_id uuid;
  v_lesson_id_1 uuid := '11111111-0000-0000-0000-000000000001';
  v_lesson_id_2 uuid := '11111111-0000-0000-0000-000000000002';
  v_lesson_id_3 uuid := '11111111-0000-0000-0000-000000000003';
BEGIN
  -- Get path id for 'wspolna'
  SELECT id INTO v_path_id FROM public.paths WHERE slug = 'wspolna' LIMIT 1;

  -- Create or get 'Wprowadzenie do AI' course
  INSERT INTO public.courses (path_id, title, "order")
  VALUES (v_path_id, 'Wprowadzenie do AI', 1)
  RETURNING id INTO v_course_id;

  -- Update mock lessons if they exist, or insert new ones
  -- Lesson 1
  INSERT INTO public.lessons (id, course_id, title, "order", duration)
  VALUES (v_lesson_id_1, v_course_id, 'Wstęp – Gdzie jesteśmy z AI?', 1, '5 min')
  ON CONFLICT (id) DO UPDATE SET course_id = v_course_id, title = EXCLUDED.title, duration = EXCLUDED.duration;

  -- Lesson 2
  INSERT INTO public.lessons (id, course_id, title, "order", duration)
  VALUES (v_lesson_id_2, v_course_id, 'Sztuka i inżynieria Promptowania', 2, '15 min')
  ON CONFLICT (id) DO UPDATE SET course_id = v_course_id, title = EXCLUDED.title, duration = EXCLUDED.duration;

  -- Lesson 3
  INSERT INTO public.lessons (id, course_id, title, "order", duration)
  VALUES (v_lesson_id_3, v_course_id, 'Twój nowy zespół – modele webowe', 3, '12 min')
  ON CONFLICT (id) DO UPDATE SET course_id = v_course_id, title = EXCLUDED.title, duration = EXCLUDED.duration;

  -- Clear existing slides for these lessons to avoid duplicates during seed
  DELETE FROM public.slides WHERE lesson_id IN (v_lesson_id_1, v_lesson_id_2, v_lesson_id_3);

  -- SLIDES FOR LESSON 1
  INSERT INTO public.slides (lesson_id, mode, "order", content_json)
  VALUES 
    (v_lesson_id_1, 'single', 0, '[{"kind": "hero", "text": "Pewnie zastanawiasz się, w jakiej erze Sztucznej Inteligencji obecnie jesteśmy?"}]'),
    (v_lesson_id_1, 'single', 1, '[{"kind": "timeline", "items": [{"era": "2022", "label": "Fiat 126p", "desc": "Pierwsze ChatGPT i OpenAI – skromny początek, rewolucyjna iskra.", "color": "var(--text-muted)"}, {"era": "2024", "label": "BMW E60", "desc": "AI przeszło kilka ewolucji, poszerzyła się konkurencja. Modele stały się potężne i dostępne.", "color": "var(--cyan)"}, {"era": "2026", "label": "Bugatti 400 km/h", "desc": "Samo Anthropic wydało ponad 60 nowych aktualizacji w ciągu 3 miesięcy. Roboty, asystenci offline, analiza wideo, deepfake – AI jest wszędzie.", "color": "var(--amber)"}]}]');

  -- SLIDES FOR LESSON 2
  INSERT INTO public.slides (lesson_id, mode, "order", content_json)
  VALUES 
    (v_lesson_id_2, 'technical', 0, '[{"kind": "text_block", "text": "W 2026 roku promptowanie to inżynieria kontekstu, a nie \"zaklinanie AI\". Modele klasy Frontier (Claude 3.5+, Gemini 2.0+) wymagają precyzyjnej struktury, aby dostarczać przewidywalne wyniki."}]'),
    (v_lesson_id_2, 'technical', 1, '[{"kind": "framework", "title": "Framework C-O-R-E", "subtitle": "Każdy profesjonalny prompt powinien przejść przez tę walidację:", "items": [{"letter": "C", "name": "Context", "desc": "Co model musi wiedzieć o otoczeniu zadania?", "bad": "Napisz post na LinkedIn o AI.", "good": "Jesteś ekspertem od automatyzacji. Piszesz do właścicieli małych firm (SMB), którzy boją się technologii. Celem jest pokazanie, że AI oszczędza 2h dziennie.", "color": "var(--cyan)"}, {"letter": "O", "name": "Objective", "desc": "Jasny, mierzalny wynik. Definiuj czasownikami operacyjnymi.", "good": "Wygeneruj listę 5 konkretnych narzędzi no-code z linkami.", "color": "#a78bfa"}, {"letter": "R", "name": "Rules", "desc": "\"Guardrails\" – czego modelowi nie wolno robić.", "good": "Nie używaj przymiotników \"rewolucyjny\", \"niesamowity\". Odpowiedź musi mieścić się w 150 słowach.", "color": "var(--amber)"}, {"letter": "E", "name": "Examples", "desc": "Pokaż, nie tylko opisuj. 2-3 przykłady Input/Output drastycznie zmniejszają ryzyko halucynacji.", "color": "#34d399"}]}]'),
    (v_lesson_id_2, 'technical', 2, '[{"kind": "tip", "title": "Chain-of-Thought (CoT)", "desc": "Zmuszanie modelu do \"myślenia na głos\" przed podaniem wyniku. To bezpiecznik logiczny.", "code": "Przeanalizuj krok po kroku proces logiczny wewnątrz tagów <thinking> przed wygenerowaniem finalnej odpowiedzi."}]'),
    (v_lesson_id_2, 'technical', 3, '[{"kind": "paths", "title": "Zastosowanie według ścieżki", "noCode": {"title": "No-Code: Agenci Autonomiczni", "items": ["Przenieś C-O-R-E do System Instructions GPTs lub Claude Projects", "Używaj zmiennych {{dane}} dla automatyzacji w n8n/Make"]}, "code": {"title": "Kod: LLM jako Silnik Aplikacji", "items": ["JSON Schema Enforcement – używaj response_format w API", "XML Tagging – tagi <context>, <instruction>, <data_to_process>", "Delimiter Engineering – separatory ### lub --- przeciw Prompt Injection"]}}]');

  -- SLIDES FOR LESSON 3
  INSERT INTO public.slides (lesson_id, mode, "order", content_json)
  VALUES 
    (v_lesson_id_3, 'technical', 0, '[{"kind": "text_block", "text": "W 2026 roku nie szukasz \"jednego modelu do wszystkiego\". Budujesz zespół specjalistów, w którym każdy ma unikalne supermoce."}]'),
    (v_lesson_id_3, 'technical', 1, '[{"kind": "team", "title": "Matrix Wyboru – Kto jest kim?", "members": [{"name": "Claude 3.5/4", "role": "Architekt & Logik", "power": "Najlepsza logika, brak lania wody, precyzyjne struktury. Coworking przez Artifacts.", "useCases": ["Strategia i planowanie", "Refaktoryzacja kodu", "Precyzyjne analizy"], "color": "#f97316", "icon": "C"}, {"name": "Gemini 2.0 Pro", "role": "Multimodalny Gigant", "power": "Gigantyczne okno kontekstowe. Natywna analiza wideo (Veo) i muzyki (Lyria 3).", "useCases": ["Analiza 2h wideo jednym promptem", "Debugging w chmurze", "Google Workspace"], "color": "#4285f4", "icon": "G"}, {"name": "NotebookLM", "role": "Twoja Cyfrowa Biblioteka", "power": "Brak halucynacji dzięki Source Grounding. Tworzy podcasty z Twoich notatek.", "useCases": ["Praca na własnej wiedzy", "Generowanie podcastów", "Infografiki z .md"], "color": "#0f9d58", "icon": "N"}, {"name": "Grok", "role": "Scout & Copywriter", "power": "Dostęp do danych Real-time z X (Twitter). Najbardziej humanizowany język.", "useCases": ["Trendy w czasie rzeczywistym", "Copywriting", "Social media"], "color": "#1d9bf0", "icon": "X"}]}]'),
    (v_lesson_id_3, 'technical', 2, '[{"kind": "workflow", "title": "Workflow Synergii (No-Code)", "flows": [{"title": "Analiza i Strategia", "steps": ["10 PDFów → NotebookLM", "Stwórz podsumowanie", "Wklej do Claude", "Finalna strategia"]}, {"title": "Social Media Pipeline", "steps": ["Sprawdź trendy na Grok", "Analiza wizualna w Gemini", "Generuj grafiki w Canva AI"]}]}]');
END $$;
