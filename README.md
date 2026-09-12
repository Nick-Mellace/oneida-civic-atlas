# Oneida Civic Atlas MVP

A static, source-transparent civic research prototype for Oneida, New York.

## Run locally

From this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

The map uses Leaflet and OpenStreetMap tiles from the public internet. The project data itself is bundled locally in `data/`.

## What is included

- 20 verified project records from the Step 4 app bundle.
- 22 geographic feature records.
- Search and filters for category, status, and map state.
- Leaflet map displaying only features with source-backed geometry.
- Project detail drawer with funding, jurisdiction, blockers, public concerns, government response, civic opportunities, open questions, confidence, last-verified date, and source links.
- Explicit handling of citywide and geometry-pending projects.
- Mobile-responsive layout and text/list alternative to map interactions.

## Important integrity rules

- Null GeoJSON geometry is intentional.
- Ward membership is not inferred.
- Estimated cost, committed funding, and actual spending are not interchangeable.
- Missing information stays visibly unresolved.
- This is a research prototype, not an official City of Oneida publication.

## Tests

```bash
node --test tests/*.test.mjs tests/smoke.mjs
```
