# Specyfikacja Projektu: Strona Profilu Użytkownika (/profile)

## 1. Cel i Zakres
Stworzenie dedykowanej strony profilowej dla użytkownika, która umożliwi mu bezpieczną zmianę hasła oraz podgląd podstawowych danych konta. Strona ma być w pełni spójna z obecnym interfejsem aplikacji KursAI (stylistyka Dashboardu).

## 2. Architektura i UI
- **Ścieżka:** `/profile` (zabezpieczona przez `ProtectedRoute`).
- **Układ (Layout):**
    - Wykorzystanie komponentu `Navbar` na górze strony.
    - Główna sekcja owinięta w `PageTransition` (Framer Motion).
    - Centralnie umieszczona karta (`max-w-2xl`) z efektem szklanego tła (`glass`).
- **Stylistyka:** 
    - Zgodność z Tailwind CSS i zmiennymi HSL z `globals.css`.
    - Wykorzystanie ikon z biblioteki `lucide-react`.
    - Responsywność (paddingi dopasowane do urządzeń mobilnych).

## 3. Funkcjonalności
- **Podgląd profilu:** Wyświetlenie nazwy użytkownika (z `user_metadata`) oraz adresu email.
- **Zmiana hasła:** 
    - Formularz z polami: `Nowe hasło` i `Powtórz nowe hasło`.
    - Przycisk akcji z gradientem `primary` i stanem ładowania.
    - Walidacja po stronie klienta (zgodność haseł, długość min. 6 znaków).
    - Integracja z Supabase Auth (`supabase.auth.updateUser`).

## 4. Obsługa Błędów i Informacje Zwrotne
- **Sukces:** Wyświetlenie zielonego powiadomienia o pomyślnej zmianie i wyczyszczenie formularza.
- **Błąd:** Wyświetlenie czytelnego komunikatu błędu zwróconego przez Supabase (np. "Hasło musi mieć co najmniej 6 znaków").
- **Bezpieczeństwo:** Pola typu `password` z możliwością (opcjonalnie) przełączania widoczności.

## 5. Integracja Systemowa
- Aktualizacja `UserDropdown.jsx`: podpięcie linku "Profil" do nowej ścieżki.
- Aktualizacja `App.jsx`: rejestracja nowej trasy.

## 6. Testy i Walidacja
- Weryfikacja działania `ProtectedRoute` dla nowej strony.
- Test poprawnej zmiany hasła w Supabase.
- Sprawdzenie responsywności UI.
