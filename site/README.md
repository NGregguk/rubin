# Rubin Discoveries (Unofficial) Static Scaffold

This is a multi-page static website scaffold for sample Rubin Observatory discovery storytelling.

Important: catalogue and detail content is placeholder material and does not represent official discovery claims.

## Project layout

```
site/
  index.html
  sitemap.xml
  robots.txt
  README.md
  package.json
  dev-server.js
  assets/
    css/
      base.css
      layout.css
      components.css
      theme.css
    js/
      enhance-nav.js
      enhance-filters.js
      search.js
      motion-gate.js
      theme-toggle.js
    data/
      discoveries.json
    img/
      placeholder-hero.svg
      placeholder-supernova.svg
      placeholder-neo.svg
      placeholder-variable.svg
      placeholder-darkmatter.svg
    fonts/
  discoveries/
    index.html
    first-light-supernova-2026/
      index.html
    near-earth-object-2026-02-21/
      index.html
  learn/
    index.html
    what-is-a-light-curve/
      index.html
  about/
    index.html
  search/
    index.html
```

## How to run locally

1. No tooling required: open `site/index.html` directly in a browser.
2. Optional local server (recommended for best parity):
   1. In `site/`, run `npm run serve`.
   2. Open `http://localhost:8080`.

## How to deploy to IIS

1. Copy the contents of `site/` into your IIS site root directory.
2. Ensure static MIME types are enabled for:
   1. `.html`
   2. `.css`
   3. `.js`
   4. `.json`
   5. `.svg`
   6. `.xml`
   7. `.txt`
3. No SPA rewrite rules are required because folder URLs use explicit `index.html`.

## Baseline and enhancement model

1. Navigation is standard links and remains fully usable without JavaScript.
2. Discoveries page baseline is category browsing with real sections and cards.
3. Discoveries filtering and sorting are progressive enhancement via `assets/js/enhance-filters.js`.
4. Search page baseline is useful category browsing plus discovery index links.
5. Search enhancement uses `assets/js/search.js` and `assets/data/discoveries.json`.
6. Theme defaults to system preference; toggle adds user override in `localStorage`.
7. Motion is reduced when `prefers-reduced-motion` or low-bandwidth heuristics are detected.

## Where to add real data later

1. Replace sample entries in `assets/data/discoveries.json` with reviewed data.
2. Add new detail pages under `discoveries/<slug>/index.html`.
3. Update internal links on `discoveries/index.html`, `search/index.html`, and `sitemap.xml`.
4. Replace placeholder media in `assets/img/` with licensed imagery and proper credits.

## DONE checklist

- [x] All pages render with JS disabled
- [x] Discoveries browse works without JS
- [x] Search page is still useful without JS
- [x] Accessibility basics present (skip link, focus, keyboard nav)
- [x] No layout shift from media elements
- [x] Dark mode via system preference + optional toggle
- [x] All links are real pages (no hash routing)
