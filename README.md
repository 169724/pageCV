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
* 🔗 Linki do **[GitHub](https://github.com/169724)**, **LinkedIn** i **Imgur**
* 📄 Pobieranie CV w formacie PDF
* 📬 **Formularz kontaktowy przez [Web3Forms](https://web3forms.com/)** (zamiast `mailto:`)
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

**Założenia:** używamy Workera w trybie *modules* oraz przestrzeni **KV** do przechowywania stanu.

### 1) Utwórz KV Namespace

Cloudflare Dashboard → **Workers & Pages → KV** → *Create namespace* (np. `pagecv-views`).

### 2) Stwórz Workera i zbindowuj KV

Workers & Pages → **Create** → *Worker* → tryb *modules* → *Settings → Bindings → KV Namespace → Add binding*:

* *Variable name:* `VIEWS_KV`
* *Namespace:* `pagecv-views`

### 3) Kod Workera

Wklej i **Deploy**:

```js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const CORS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    const json = (obj, status=200) => new Response(JSON.stringify(obj), {
      status,
      headers: { 'content-type': 'application/json; charset=utf-8', ...CORS },
    });

    const read = async () => {
      const n = parseInt((await env.VIEWS_KV.get('count')) || '0', 10) || 0;
      return json({ count: n });
    };
    const bump = async () => {
      const n = parseInt((await env.VIEWS_KV.get('count')) || '0', 10) || 0;
      const next = n + 1;
      await env.VIEWS_KV.put('count', String(next), { metadata: { ts: Date.now() } });
      return json({ count: next });
    };

    if (url.pathname === '/favicon.ico') return new Response(null, { status: 204, headers: CORS });
    if (url.pathname === '/health') return json({ ok: true });

    if (request.method === 'GET' && url.pathname === '/hit') return bump();
    if (request.method === 'POST' && url.pathname === '/') return bump();
    if (request.method === 'GET') return read();

    return json({ error: 'Method Not Allowed' }, 405);
  }
};
```

### 4) Front‑end – integracja

* W `app.js` używany jest endpoint Workera, np.:

  ```js
  const CF_API = 'https://<twoj-worker>.workers.dev';
  ```
* Licznik podpinamy do elementu (np. w nawigacji):

  ```html
  <span id="views" class="pill">👁️ 0</span>
  ```
* Skrypt ładowany z cache‑bustingiem (szczególnie na GitHub Pages):

  ```html
  <script src="app.js?v=2024-08-18" defer></script>
  ```

### 5) Jak to działa

* Wejście na stronę → `GET /hit` (inkrementacja)
* Odświeżanie co 30 s → `GET /` (sam odczyt)
* CORS jest dozwolony (`Access-Control-Allow-Origin: *`), więc działa na GitHub Pages.

### 🩺 Troubleshooting

* **Widzę `POST` w konsoli** → przeglądarka używa starego `app.js`. Wymuś cache‑busting (`?v=...`) i *Disable cache* w DevTools.
* **`ERR_SSL_VERSION_OR_CIPHER_MISMATCH`** → często lokalny VPN/antywirus filtrujący HTTPS. Sprawdź bez VPN, w innej przeglądarce lub na telefonie (LTE). Sam endpoint Workera powinien odpowiadać `{"count": n}` pod `GET /`.
* **Brak licznika w DOM** → upewnij się, że istnieje `<span id="views">` zanim zainicjuje się skrypt.

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
* 🔗 Links to **[GitHub](https://github.com/169724)**, **LinkedIn**, **Imgur**
* 📄 Downloadable PDF CV
* 📬 **Contact form powered by [Web3Forms](https://web3forms.com/)**
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
3. Deploy the Worker (code above).
4. Set `CF_API` in `app.js` and add `<span id="views">` in the HTML.
5. Bust caches on GitHub Pages with `app.js?v=...`.

---

## Licencja

Projekt może korzystać z licencji **MIT** (dodaj plik `LICENSE` jeśli nie został dołączony).
