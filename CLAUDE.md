# CLAUDE.md – Projekt: Kurs AI 2026

## Opis projektu

Kurs **"Jak efektywnie używać AI w 2026r"** – kompleksowy kurs online w języku polskim, obejmujący trzy ścieżki nauki:

- **Ścieżka Wspólna** – fundamenty dla każdego
- **Ścieżka A – No-Code** – automatyzacja bez kodu
- **Ścieżka B – Kod (Inżynieria AI)** – dla deweloperów

Projekt składa się z dwóch równoległych celów:
1. **Treści kursu** – opracowanie wszystkich materiałów merytorycznych do lekcji
2. **Aplikacja webowa** – platforma do prezentacji kursu z dwoma trybami nauki

## Źródło prawdy

**Supabase jest jedynym źródłem prawdy (Source of Truth) projektu.**
Aplikacja odczytuje i zapisuje treści kursu bezpośrednio w bazie danych Supabase (tabele `paths`, `courses`, `lessons`, `slides`). 

## Struktura projektu


```
KursAI/
├── CLAUDE.md                    # Ten plik – instrukcje dla Claude
├── GEMINI.md                    # Instrukcje dla Gemini CLI
├── table_of_content.md          # Spis treści całego kursu
└── Docs/
    ├── sciezka_wspolna/         # Ścieżka Wspólna
    │   ├── 01_sztuka_i_inzynieria/
    │   └── 02_twoj_nowy_zespol/
    ├── sciezka_no_code/         # Ścieżka A – No-Code (do stworzenia)
    └── sciezka_kod/             # Ścieżka B – Kod (do stworzenia)
```

## Zasady organizacji treści

- **Język:** Cały kurs w języku **polskim**
- **1 lekcja = 1 plik `.md`**
- **Nazewnictwo plików i folderów:**
  - Małe litery, cyfry, podkreślniki `_`
  - Bez polskich znaków (np. `01_sztuka_i_inzynieria`)
  - Format: `NN_nazwa_tematu/NN_nazwa_lekcji.md`
- **Przykład:** `Docs/sciezka_wspolna/01_sztuka_i_inzynieria/01_wprowadzenie.md`

## Stan prac – Treści kursu

- [x] Lekcja 1 (Ścieżka Wspólna / Sztuka i inżynieria promptowania / Wprowadzenie) – gotowa
- [ ] Pozostałe lekcje Ścieżki Wspólnej
- [ ] Ścieżka A – No-Code (wszystkie lekcje)
- [ ] Ścieżka B – Kod (wszystkie lekcje)

## Aplikacja webowa – Wymagania

Platforma do prezentacji kursu z dwoma trybami dla każdego szkolenia:

### Tryb Techniczny
- Tekst, video, grafika, przykłady kodu
- Strukturyzowany materiał do nauki

### Tryb Praktyka
- Budowanie aplikacji step-by-step od zera
- Demonstracja procesu z wyjaśnieniami

### Funkcje platformy
- Wybór ścieżki nauki
- Nawigacja między lekcjami
- Zbieranie informacji / postęp użytkownika
- Tryb Techniczny vs Praktyka dla każdej lekcji

## Instrukcje dla Claude

### Tworzenie treści lekcji
- Każda lekcja powinna zawierać: cel, teorię, przykłady, ćwiczenia
- Zachowaj spójność tonu – profesjonalny, ale przystępny

### Praca z plikami
- Czytaj istniejące pliki przed modyfikacją
- Nie twórz plików poza strukturą `Docs/` bez wyraźnej prośby
- Nie twórz pliku dokumentacji (np. README) bez prośby użytkownika

### Aplikacja webowa
- Stack do ustalenia przy rozpoczęciu prac (prawdopodobnie React + backend)
- Priorytet: czytelność UX i jakość prezentacji treści
