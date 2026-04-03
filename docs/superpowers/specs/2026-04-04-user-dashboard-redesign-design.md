# Specyfikacja Projektowa: Redesign Dashboardu Użytkownika (KursAI)

**Data:** 2026-04-04
**Status:** Do recenzji
**Zadanie:** Przeprojektowanie `DashboardPage.jsx` dla użytkowników o roli `user`.

## 1. Cel i Zakres
Celem jest poprawa estetyki (UI) oraz funkcjonalności (UX) głównego panelu użytkownika, kładąc nacisk na szybki powrót do nauki ("Action Hero") oraz grywalizację poprzez system streaków.

## 2. Architektura Wizualna (Theme)
- **Styl:** Modern Dark, Glassmorphism.
- **Kolory:** Wykorzystanie istniejących zmiennych CSS (`--bg-primary`, `--cyan-gradient`, `--amber-border`, etc.).
- **Komponenty:** Blur (backdrop-filter), zaokrąglone rogi (`var(--radius-lg)`), subtelne cienie i border-glow.

## 3. Komponenty UI

### 3.1. Nowy Navbar
- **Położenie:** Stałe na górze strony (sticky/fixed) lub jako element layoutu.
- **Elementy:**
    - **Logo:** KURSAI 2026 (stylizowane).
    - **Nawigacja środkowa:** Linki "Kurs" oraz "Materiały".
    - **Profil (Dropdown):** 
        - Brak tekstu "Materiały Kacper".
        - Awatar z inicjałem użytkownika + strzałka w dół.
        - Menu otwierane w dół z opcjami: `Profil`, `Ustawienia`, `Wyloguj` (integracja z Supabase `signOut`).

### 3.2. Sekcja "Action Hero" (Wznów Naukę)
- **Cel:** Szybki powrót do ostatniej lekcji.
- **Elementy:**
    - Badge "WZNÓW NAUKĘ".
    - Tytuł ostatniej lekcji (np. "04. Architektura Multi-Agent").
    - Informacja o ścieżce i postępie (np. "Ścieżka B: Kod • Zostało 12 lekcji").
    - Pasek postępu z efektem glow.
    - Przycisk akcji: "Kontynuuj naukę →".
    - **Grywalizacja:** Licznik "Daily Streak" (🔥) wyświetlany po prawej stronie modułu.

### 3.3. Sekcja "Twoje postępy" (Karty Ścieżek)
- **Layout:** Grid (3 kolumny).
- **Typy kart:**
    1. **Ukończona:** Status "UKOŃCZONO", pełny pasek postępu, statystyki lekcji (np. 20/20).
    2. **W toku (Aktywna):** Status "W TOKU", pasek postępu, licznik streaku, numer modułu.
    3. **Nie rozpoczęta:** Krótki opis zachęcający, przycisk "Zacznij przygodę".
- **Szczegóły:** Brak wzmianek o certyfikatach.

## 4. Logika Biznesowa
- Dashboard dostępny tylko dla roli `user` (obsłużone przez `ProtectedRoute`).
- Pobieranie danych o postępie i ostatniej lekcji z bazy Supabase (do zaimplementowania/zaktualizowania w serwisach).
- Obsługa nawigacji do konkretnych ścieżek kursu.

## 5. Wykluczenia
- Brak wzmianek o certyfikatach w całym UI dashboardu.
- Brak nazwiska użytkownika ("Kacper") bezpośrednio w navbarze obok przycisków menu.
