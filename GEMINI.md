# GEMINI.md - Project Context: Spis Treści Kursu (AI Course Table of Contents)

## Directory Overview
Ten folder służy jako lokalna baza wiedzy kursu. 

### Structure
- **`Docs/`**: Zawiera lokalne pliki `.md` lekcji, zorganizowane według nowych zasad (foldery tematyczne, numeracja, brak polskich znaków).

The content is organized around Frontier models (Gemini, Claude), agentic workflows (n8n, Multi-Agent Networks), and engineering practices (Prompt Engineering, DevOps, System Architecture).
## Key Files & Structure

### Docs/ (Baza wiedzy)
- Struktura folderów i plików opisana w sekcji "Zasady organizacji treści". Lokalne pliki służą do edycji i pracy z AI.

## Usage
- **Dla Agentów AI:** Wykorzystuj pliki Markdown w `Docs/` jako kontekst do generowania promptów, workflow czy diagramów.

## Zasady organizacji treści
- **Język Kursu:** Cały kurs musi być przygotowany w języku polskim.
- **Struktura lekcji:** 1 lekcja = 1 plik `.md`.
- **Grupowanie:** Każdy temat musi znajdować się w osobnym folderze (np. wewnątrz folderów ścieżek: `sciezka_wspolna`, `sciezka_no_code`, `sciezka_kod`).
- **Nazewnictwo plików i folderów:**
    - Nazwy muszą zawierać numer oraz tytuł/nazwę (np. `01_wprowadzenie`).
    - **Brak polskich znaków:** W nazwach plików i folderów nie używamy polskich znaków (np. `01_sztuka_i_inzynieria` zamiast `01_sztuka_i_inżynieria`).
    - Należy używać małych liter, cyfr oraz podkreślników `_`.
- **Przykład struktury:**
  ```text
  docs/sciezka_wspolna/01_sztuka_i_inzynieria/01_wprowadzenie.md
  docs/sciezka_wspolna/02_twoj_nowy_zespol/01_powitanie.md
  ```

## Development & Contribution
- **Naming Convention:** Nazwy plików i folderów muszą być zgodne z zasadami opisanymi w sekcji "Zasady organizacji treści". Stary format "Name [ID].md" został wycofany.
- **Formatting:** Treść jest pisana w języku polskim, z wykorzystaniem Markdown dla przejrzystości struktury.
- **Tooling:** Główne interfejsy to `Gemini CLI` oraz `Claude CLI`.
