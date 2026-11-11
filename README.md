# Czas pracy

Aplikacja PWA do obliczania wynagrodzenia (w euro) na podstawie godzin wejścia i wyjścia.
Działa w przeglądarce (Android, Chrome), instaluje się na ekranie głównym, pracuje offline
i eksportuje raport do PDF po polsku lub niemiecku.

Wszystkie dane są zapisane wyłącznie w urządzeniu (`localStorage`, klucz `czas_pracy_v1`).
Aplikacja nie wysyła niczego do sieci i nie używa zewnętrznych skryptów.

## Pliki

| Plik | Opis |
| --- | --- |
| `index.html` | Cała aplikacja (HTML, CSS, JavaScript inline) |
| `manifest.json` | Manifest PWA |
| `icon-192.png`, `icon-512.png` | Ikony aplikacji |
| `sw.js` | Service worker (działanie offline) |
| `tests.html` | Testy obliczeń, danych i raportu |

## Wdrożenie na GitHub Pages

1. Utwórz **publiczne** repozytorium na GitHubie i wgraj wszystkie pliki z tego katalogu do gałęzi `main`
   (w katalogu głównym repozytorium).
2. W repozytorium otwórz **Settings → Pages**.
3. W sekcji **Build and deployment** wybierz **Source: Deploy from a branch**.
4. Wybierz gałąź **main** i folder **/ (root)**, kliknij **Save**.
5. Po około minucie aplikacja jest dostępna pod adresem `https://<login>.github.io/<repozytorium>/`.

Po wgraniu nowej wersji otwórz aplikację dwa razy: pierwsze otwarcie pobiera nową wersję w tle,
drugie ją pokazuje. Przy większych zmianach zwiększ numer w `CACHE` w pliku `sw.js`.

## Instalacja na Androidzie

1. Otwórz adres aplikacji w **Chrome**.
2. Menu (⋮) → **Dodaj do ekranu głównego** → **Zainstaluj**.
3. Aplikacja uruchamia się w trybie pełnoekranowym i działa bez internetu po pierwszym załadowaniu.

## Pierwsze kroki

1. **Ustawienia** → wpisz stawkę godzinową brutto w euro i datę, od której obowiązuje.
2. **Wpis** → podaj datę oraz godziny wejścia i wyjścia. Podgląd wyliczeń pojawia się od razu.
3. **Podsumowanie** → wybierz tydzień lub miesiąc i dowolny dzień z okresu.

Na jeden dzień przypada jeden wpis. Dla dni sprzed pierwszej ustawionej stawki przyjmowana jest
najwcześniejsza stawka. Nowa stawka przelicza wpisy od swojej daty obowiązywania
(aplikacja pyta o potwierdzenie), a wcześniejszych nie zmienia.

## Generowanie PDF

1. **Ustawienia** → wybierz język eksportu (polski / niemiecki) i opcjonalnie wpisz imię i nazwisko.
2. **Podsumowanie** → wybierz okres → **Eksportuj PDF**.
3. W oknie druku ustaw:
   - drukarka: **Zapisz jako PDF**,
   - rozmiar papieru: **A4**,
   - **wyłącz „Nagłówki i stopki”** przeglądarki (raport ma własne).
4. Zapisz plik.

Nagłówek, stopka i numeracja „Strona X z Y” wymagają Chrome 131 lub nowszego.

## Zasady obliczeń

- Czas na miejscu = wyjście − wejście, w minutach. Wyjście mniejsze niż wejście oznacza zmianę przez północ.
- Przerwa: poniżej 480 min – 0 min; dokładnie 480 min – 30 min; powyżej 480 min – 45 min.
  Przerwa jest odejmowana wyłącznie od godzin zwykłych.
- Zwykłe = min(na miejscu, 480) − przerwa.
- Nadgodziny = max(0, na miejscu − 480), w całości, płatne 125% stawki.
- Kwota dzienna = zwykłe × (stawka / 60) + nadgodziny × (stawka × 1,25 / 60).
- Kwoty liczone są na liczbach całkowitych (jednostka 1/240 centa). Zaokrąglenie do centa
  następuje raz, na końcu, metodą half-up. Sumy tygodnia i miesiąca powstają z sum dokładnych,
  a nie z zaokrąglonych kwot dziennych.

Przykład: 8:00–17:00 przy 30 €/h → zwykłe 435 min (217,50 €) + nadgodziny 60 min (37,50 €) = 255,00 €.

## Testy

Otwórz `tests.html` przez http(s), np. `https://<login>.github.io/<repozytorium>/tests.html`, albo lokalnie:

```sh
python3 -m http.server 8000
# potem otwórz http://localhost:8000/tests.html
```

Każdy test wypisuje wynik oczekiwany i uzyskany. Testy działają na danych w pamięci i nie zmieniają
wpisów zapisanych w aplikacji. Na dole strony są przyciski ręcznego testu podglądu druku (A4, PL i DE).

## Kopia zapasowa

**Ustawienia → Kopia zapasowa** zapisuje wszystkie dane do pliku JSON i wczytuje je z powrotem.
Przed nadpisaniem danych plik jest sprawdzany. Wyczyszczenie danych przeglądarki usuwa wpisy,
więc kopię warto robić regularnie.
