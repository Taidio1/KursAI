# CLAUDE.md – Projekt: Agentic Hub 2026

## Opis projektu

Kurs **"Jak efektywnie używać AI w 2026r"** – kompleksowy kurs online w języku polskim, obejmujący trzy ścieżki nauki:

- **Ścieżka Wspólna** – fundamenty dla każdego
- **Ścieżka A – No-Code** – automatyzacja bez kodu
- **Ścieżka B – Kod (Inżynieria AI)** – dla deweloperów

Projekt składa się z dwóch równoległych celów:
1. **Treści kursu** – opracowanie materiałów merytorycznych do lekcji
2. **Aplikacja webowa** – platforma do prezentacji kursu z dwoma trybami nauki

---

## Źródło prawdy

**Supabase jest jedynym źródłem prawdy (Source of Truth) projektu.**

Aplikacja odczytuje i zapisuje treści kursu bezpośrednio w bazie danych Supabase (tabele `paths`, `courses`, `lessons`, `slides`, `materials`, `user_progress`).

> ⚠️ Notion był wcześniej używany jako SoT – endpoint `/sync/notion` istnieje jako LEGACY. Jest oznaczony jako niebezpieczny (nadpisuje dane w Supabase). **Nie używać**, jeśli lekcje były edytowane przez Live Builder.

---

## Tech Stack

### Frontend
- **React** (Vite) – kod w `frontend/src/`
- **Supabase JS Client** (`@supabase/supabase-js`) – auth + bezpośrednie zapytania do danych
- **React Router** – routing
- Zmienne środowiskowe: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`, `VITE_ADMIN_SECRET`
- Auth przez Supabase Auth (sesja w `agentic-hub-auth-token`)

### Backend
- **Python FastAPI** – kod w `backend/`
- **supabase-py** – klient Supabase po stronie backendu
- Zmienne środowiskowe: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_ANON_KEY`, `ADMIN_SECRET`
- Routery: `/slides`, `/sync`, `/materials`, `/dashboard`, `/courses`
- Backend używa `SUPABASE_SERVICE_KEY` (admin) z wyjątkiem `/dashboard/user-stats` (anon key)

---

## Struktura tabel Supabase

### Hierarchia danych
`paths` → `courses` (path_id) → `lessons` (course_id) → `slides` (lesson_id)

### `paths`
| Kolumna | Typ  | Opis                          |
|---------|------|-------------------------------|
| id      | uuid | PK                            |
| slug    | text | np. `wspolna`, `no_code`, `kod` |
| title   | text | Nazwa ścieżki                 |
| order   | int  | Kolejność wyświetlania        |

### `courses`
| Kolumna | Typ  | Opis                    |
|---------|------|-------------------------|
| id      | uuid | PK                      |
| path_id | uuid | FK → paths.id           |
| title   | text | Nazwa kursu/modułu      |
| order   | int  | Kolejność w ścieżce     |

### `lessons`
| Kolumna   | Typ  | Opis                        |
|-----------|------|-----------------------------|
| id        | uuid | PK                          |
| course_id | uuid | FK → courses.id             |
| title     | text | Tytuł lekcji                |
| order     | int  | Kolejność w kursie          |
| duration  | text | np. "10 min"                |
| notion_id | text | ID Notion (legacy, nieużywane) |

### `slides`
| Kolumna      | Typ   | Opis                            |
|--------------|-------|---------------------------------|
| id           | uuid  | PK                              |
| lesson_id    | uuid  | FK → lessons.id                 |
| mode         | text  | `technical` lub `practice`      |
| order        | int   | Kolejność slajdu w lekcji       |
| content_json | jsonb | Treść slajdu (bloki)            |
| bot_comment  | text  | Komentarz dla AI/bota           |

### `materials`
| Kolumna      | Typ        | Opis                      |
|--------------|------------|---------------------------|
| id           | uuid/text  | PK                        |
| title        | text       | Nazwa materiału           |
| description  | text       | Opis                      |
| url          | text       | Link do zasobu            |
| category     | text       | Kategoria                 |
| price        | text       | Cena (opcjonalne)         |
| icon_url     | text       | URL ikony                 |
| tags         | array      | Tagi                      |
| is_published | bool       | Czy widoczny publicznie   |

### `user_progress`
| Kolumna      | Typ         | Opis                   |
|--------------|-------------|------------------------|
| user_id      | uuid        | FK → auth.users        |
| lesson_id    | uuid        | FK → lessons.id        |
| completed_at | timestamptz | Kiedy ukończono lekcję |

---

## Struktura projektu

```
AgenticHub/
├── CLAUDE.md                    # Ten plik – instrukcje dla Claude
├── GEMINI.md                    # Instrukcje dla Gemini CLI
├── table_of_content.md          # Spis treści całego kursu
├── frontend/                    # React (Vite)
│   └── src/
├── backend/                     # Python FastAPI
│   └── routers/                 # /slides, /sync, /materials, /dashboard, /courses
└── Docs/
    ├── sciezka_wspolna/         # Ścieżka Wspólna
    ├── sciezka_no_code/         # Ścieżka A – No-Code
    └── sciezka_kod/             # Ścieżka B – Kod
```

---

## Stan prac – Treści kursu

- [x] Lekcja 1 (Ścieżka Wspólna / Sztuka i inżynieria promptowania / Wprowadzenie) – gotowa
- [x] Pozostałe lekcje Ścieżki Wspólnej
- [x] Ścieżka A – No-Code (wszystkie lekcje)
- [x] Ścieżka B – Kod (wszystkie lekcje)

---

## Aplikacja webowa – Wymagania

Każda lekcja ma dwa tryby prezentacji:

### Tryb Techniczny
- Tekst, video, grafika, przykłady kodu
- Strukturyzowany materiał do nauki

### Tryb Praktyka
- Budowanie aplikacji step-by-step od zera
- Demonstracja procesu z wyjaśnieniami

### Funkcje platformy
- Wybór ścieżki nauki
- Nawigacja między lekcjami
- Śledzenie postępu użytkownika (`user_progress`)
- Przełączanie trybów: Techniczny / Praktyka

---

## Instrukcje dla Claude

### Zasady ogólne
- **Nie twórz git commitów** – skupiaj się wyłącznie na kodzie
- **Nie pisz testów** – skupiaj się wyłącznie na kodzie produkcyjnym
- **Nie twórz plików dokumentacji** (np. README) bez wyraźnej prośby
- **Nie twórz plików poza strukturą projektu** bez wyraźnej prośby
- **W bash nie łącz komend przez `&&`** – uruchamiaj je osobno

### Praca z danymi
- Zawsze czytaj/zapisuj bezpośrednio do Supabase
- Nie synchronizuj automatycznie z Notion
- Przy nowych endpointach – wzoruj się na istniejących routerach w `backend/routers/`

### Tworzenie treści lekcji
- Każda lekcja powinna zawierać: cel, teorię, przykłady, ćwiczenia
- Zachowaj spójność tonu – profesjonalny, ale przystępny
- Nazewnictwo plików: małe litery, cyfry, podkreślniki, bez polskich znaków
- Format: `Docs/NN_sciezka/NN_modul/NN_nazwa_lekcji.md`
