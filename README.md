# pageCV

Personal responsive portfolio website with PL/EN support, clock, **Cloudflare Worker‑based visit counter**, contact form via Web3Forms, and modern design.

---

## 🇵🇱 PL

# 🌐 Portfolio – Dawid Małek

Responsywna, nowoczesna i wielojęzyczna strona portfolio w HTML, CSS i JavaScript, przedstawiająca moje umiejętności, doświadczenie, edukację, projekty oraz dane kontaktowe. Projekt skupia się na estetyce, czytelności i wydajności na każdym urządzeniu.

### ✨ Funkcje

* 🌍 **PL/EN** – przełącznik języka z flagami (domyślnie polski, zapamiętywanie ustawień w `localStorage`)
* 📱 **Responsywny design** z hamburger menu na urządzeniach mobilnych
* ⏱ **Zegar cyfrowy** w prawym dolnym rogu
* 👁️ **Licznik wyświetleń (Cloudflare Workers + KV)** – inkrementacja żądaniem **GET `/hit`** i odczyt **GET `/`**
* 📂 Sekcje: *O mnie*, *Umiejętności*, *Doświadczenie*, *Edukacja*, *Certyfikaty*, *Projekty*, *Kontakt*
* 🔗 Linki do **GitHub**, **LinkedIn** i **Imgur**
* 📄 Pobieranie CV w formacie PDF
* 📬 **Formularz kontaktowy przez Web3Forms** (zamiast `mailto:`)
* 🌌 Dodatki wizualne: tło z gwiazdami, animacje scrollowania, efekt 3D przycisków, pasek postępu przewijania, efekt maszyny do pisania

### 🛠 Technologie

* **HTML5**, **CSS3** (Flexbox, Grid, Media Queries, animacje)
* **JavaScript (ES6+)** – Intersection Observer, `fetch`, i18n, efekty UI
* **Cloudflare Workers + KV** – trwały licznik odwiedzin

### 🚀 Uruchomienie lokalne

1. Sklonuj repozytorium:

   ```bash
   git clone https://github.com/169724/pageCV.git && cd pageCV
   ```
2. Otwórz `index.html` w przeglądarce.

---

## 🔧 Konfiguracja licznika wyświetleń (Cloudflare)

**Założenia:** Worker w trybie *modules* i przestrzeń **KV** do przechowywania stanu.

1. **Utwórz KV Namespace** – np. `pagecv-views`.

2. **Zbinduj KV w Workerze** – *Settings → Bindings → KV Namespace → Add binding*:

   * *Variable name:* `VIEWS_KV`
   * *Namespace:* `pagecv-views`

3. **Kod Workera** (skrót): implementuje `GET /hit` → inkrement, `GET /` → odczyt, `OPTIONS` → preflight, pełny CORS.

4. **Front‑end** – w `app.js` ustaw `CF_API` na adres Workera i dodaj w HTML element na licznik: `<span id="views">`.

5. **Cache‑busting** na GitHub Pages – ładuj `app.js` z parametrem wersji, np. `app.js?v=2024-08-18`.

### 🩺 Troubleshooting

* **Widzisz `POST` w Network** → przeglądarka używa starego `app.js`. Wymuś *Disable cache* i zwiększ `?v=`.
* **`ERR_SSL_VERSION_OR_CIPHER_MISMATCH`** → zwykle lokalny VPN/antywirus; sprawdź na LTE/innym urządzeniu.
* **Brak licznika w DOM** → upewnij się, że istnieje `<span id="views">` zanim zainicjuje się skrypt.

---

## 📬 Web3Forms — szczegóły implementacyjne

Formularz kontaktowy korzysta z **Web3Forms** poprzez REST API i jest zaimplementowany w czystym JS. Konfiguracja endpointu pozostaje w **HTML** (atrybut `action`), dzięki czemu klucze/URL nie są zakodowane w pliku JS.

**Elementy:**

* `#contactForm` — formularz z atrybutem `action` wskazującym na endpoint Web3Forms,
* `#formStatus` — element komunikatów (klasy `ok`/`err`).

**Logika (z `app.js`):**

* blokada domyślnego `submit` i komunikat „Wysyłanie…”,
* dynamiczny temat z pola `name`: `Wiadomość ze strony — ${name || 'Kontakt'}`,
* konwersja `FormData` → JSON: `Object.fromEntries(fd.entries())`,
* wysyłka `POST` na `form.action` z nagłówkami `Content-Type: application/json`, `Accept: application/json`,
* interpretacja odpowiedzi: `data.success === true` → reset + komunikat powodzenia, w przeciwnym razie komunikat błędu.

**Fragment kodu (bez danych wrażliwych):**

```js
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = 'Wysyłanie…';
  statusEl.classList.remove('ok', 'err');
  const fd = new FormData(form);
  const name = (form.elements['name']?.value || '').trim();
  fd.append('subject', `Wiadomość ze strony — ${name || 'Kontakt'}`);
  const json = Object.fromEntries(fd.entries());
  const res = await fetch(form.action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(json)
  });
  const data = await res.json();
  if (data.success) { statusEl.textContent = 'Dziękuję! Wiadomość została wysłana.'; statusEl.classList.add('ok'); form.reset(); }
  else { statusEl.textContent = 'Nie udało się wysłać. Spróbuj ponownie.'; statusEl.classList.add('err'); }
});
```

> Uwaga: w README celowo pomijamy szczegóły takie jak klucze/URL Web3Forms.

---

## 🇬🇧 ENG

# 🌐 Portfolio – Dawid Małek

Responsive, modern, multilingual portfolio in HTML, CSS and JavaScript showcasing skills, experience, education, projects and contact details.

### ✨ Features

* 🌍 **PL/EN** language switcher with flags (default: Polish; remembers selection)
* 📱 **Responsive design** with mobile hamburger menu
* ⏱ **Digital clock** (bottom‑right)
* 👁️ **Page view counter (Cloudflare Workers + KV)** — increment via **GET `/hit`**, read via **GET `/`**
* 📂 Sections: *About*, *Skills*, *Experience*, *Education*, *Certificates*, *Projects*, *Contact*
* 🔗 Links to GitHub, LinkedIn, Imgur
* 📄 Downloadable PDF CV
* 📬 **Contact form powered by Web3Forms**
* 🌌 Visual add‑ons: starry background, scroll animations, 3D tilt, scroll progress bar, typewriter effect

### 🛠 Tech stack

* **HTML5**, **CSS3**, **JavaScript (ES6+)**
* **Cloudflare Workers + KV** for persistent view counting

### 🚀 Run locally

```bash
git clone https://github.com/169724/pageCV.git
cd pageCV
open index.html  # or use a simple static server
```

### 🔧 View counter setup (Cloudflare)

1. Create a KV namespace (e.g., `pagecv-views`).
2. Bind it to the Worker as `VIEWS_KV`.
3. Deploy the Worker (code described above).
4. Set `CF_API` in `app.js` and add `<span id="views">` in HTML.
5. Bust caches on GitHub Pages with `app.js?v=...`.

### 📬 Web3Forms — implementation details

* The endpoint is configured in the form’s **`action`** attribute (keeps sensitive data out of JS),
* The script prevents default submission and shows a sending message,
* It builds a **dynamic subject** using the `name` field,
* Converts **FormData → JSON** with `Object.fromEntries`,
* Sends a **JSON POST** to `form.action` with `Content-Type` and `Accept` set to `application/json`,
* Reads `data.success` to update UI and reset the form on success (adds `ok`/`err` classes on the status element).

---

## Licencja

Projekt korzysta z licencji **MIT** 
