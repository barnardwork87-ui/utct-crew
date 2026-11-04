# Barney's UTCT 100 · Crew HQ

Static site (no build step). Five pages: `index.html`, `crew.html`, `schedule.html`, `aid-stations.html`, `fuel.html`.

## Run locally
    python3 -m http.server 4317
then open http://localhost:4317 (add `?loader` to replay the intro).

## Crew illustrations
Drop PNGs (transparent background, portrait ~4:5) into `assets/crew/` named:
`josh.png  davey.png  mikey-l.png  mikey-p.png  mikey-h.png  cass.png  matty.png  saxon.png`
They replace the initials placeholders automatically.

## Data
- `assets/terrain.js` – contour lines (20 m) from AWS Terrain Tiles + official UT100 2026 GPX (V6, 24 Aug) + aid-station positions from the official UTCT aid-station map.
- `assets/stats.js` – Strava runs since 2 June 2026 (snapshot 4 Nov).
- `assets/js/model.js` – station meta, map blurbs, pacing model (19 h / 24 h), fuel model.

## Deploy to GitHub Pages
    git init && git add . && git commit -m "Crew HQ"
    gh repo create utct-crew --public --source=. --push
    gh api repos/{owner}/utct-crew/pages -X POST -f source[branch]=main -f source[path]=/

Race photos © Ultra-Trail Cape Town and photographers – keep the repo private-ish / the site unlisted.
