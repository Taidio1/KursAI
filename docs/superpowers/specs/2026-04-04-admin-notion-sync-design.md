# Specyfikacja: Panel Administratora - Synchronizacja z Notion

Zaprojektowanie i wdrożenie funkcjonalności Panelu Administratora w aplikacji KursAI, umożliwiającej ręczne wyzwalanie synchronizacji treści kursu z bazy danych Notion do Supabase.

## 1. Cel i Zakres
- Stworzenie bezpiecznego interfejsu dla administratora do aktualizacji lekcji i slajdów.
- Implementacja warstwy serwisowej do komunikacji z backendem FastAPI.
- Zapewnienie spójności wizualnej z systemem "Dark Tech".

## 2. Architektura Systemu

### 2.1 Warstwa Serwisowa (Frontend)
- **Plik:** `frontend/src/services/adminService.js`
- **Funkcja:** `syncNotionContent(adminSecret)`
  - Metoda: `POST`
  - URL: `http://localhost:8000/sync/notion` (Domyślny adres backendu w dev)
  - Nagłówki: `x-admin-secret` (przekazywany z UI)
  - Obsługa błędów: Rzucanie wyjątków z czytelnymi komunikatami (np. 401 - "Błędny sekret").

### 2.2 Komponent UI (Frontend)
- **Plik:** `frontend/src/pages/AdminPage.jsx`
- **Stylistyka:**
  - Tło: `#0a0a1a` (zgodnie z `globals.css`).
  - Akcenty: `--cyan-light`, `--cyan-border`, `--cyan-dim`.
  - Animacje: Pulsowanie przycisku podczas ładowania.
- **Elementy interfejsu:**
  - `input[type="password"]`: Pole na sekret administracyjny.
  - `button`: Przycisk wyzwalający akcję.
  - `status-container`: Sekcja wyświetlająca wynik (liczba lekcji, liczba slajdów) lub błąd.

## 3. Przepływ Danych (Data Flow)
1. Administrator wpisuje `admin_secret` i klika "Synchronizuj".
2. Komponent ustawia stan `loading: true`.
3. Wywołanie `adminService.syncNotionContent`.
4. Backend pobiera dane z Notion, aktualizuje Supabase i zwraca statystyki.
5. Komponent odbiera odpowiedź i aktualizuje stan `success` lub `error`.
6. Dashboard i inne strony automatycznie wyświetlą nową treść przy następnym odświeżeniu/ładowaniu (dane z Supabase).

## 4. Bezpieczeństwo
- Sekret administracyjny nie jest przechowywany na stałe (wymagany przy każdej próbie synchronizacji).
- Endpoint backendowy chroniony przez `verify_admin` (nagłówek `x-admin-secret`).
- Frontend chroniony przez `ProtectedRoute` z `requiredRole="admin"`.

## 5. Kryteria Akceptacji
- Poprawne przesłanie sekretu skutkuje komunikatem o sukcesie i statystykami.
- Błędny sekret wyświetla błąd 401.
- Interfejs blokuje przycisk podczas trwania operacji (prevent double click).
- UI jest responsywne i zgodne z design systemem.
