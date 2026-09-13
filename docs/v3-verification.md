# Actual V3 verification

September 13, 2026. This document distinguishes automated verification from pending browser checks. V2's older verification report is historical and is not reused as evidence for V3.

## Results

Final command results are recorded below. The automated checks cover source preservation, rendered content, date/filter calculations and DOM navigation; they do not certify visual layout, full keyboard behavior in a browser or WCAG conformance.

- `npm test`: **44 passed, 0 failed** (unit, rendering and updated static smoke checks).
- `npm run test:dom`: **10 passed, 0 failed** (DOM integration; jsdom 26.1.0).
- `npm run validate`: **passed** — 20 projects, 22 features, 10 unique community/participation records, 3 reconciled budget years; required handoff files present.
- Legacy `scripts/validate-data.py`: **passed** — 17 directory records, 9 reviewed safety records, 27 source records, 9 channels, 2 original meeting records and 71 publication-index records. `jsonschema==4.26.0` was initially absent; installed into a separate test dependency directory, then the validator passed. No production dependency was added.
- Legacy Python ingestion unit tests: **2 passed**.
- `node --check` on all five new V3 JavaScript modules: **passed**.
- Final byte comparisons of the 20-project bundle and 22-feature geographic file against supplied V2: **passed**.
- Budget verification: 2023, 2024 and 2025 scanned official summaries visually read; all category sums match their printed totals. Annual CPI means for 2023 and 2024 independently recalculated from the monthly inputs documented in source notes.
- Calculated core text contrast: navy/paper **11.77:1**, rust/paper **6.00:1**, muted text/paper **5.78:1**, masthead light/navy **11.58:1**. These arithmetic checks cover the named color pairs, not every rendered control or map element.

Preserved source hashes (SHA-256):

```text
app_bundle.json      bd52be989664f67c94528d33ad2e56a7e67cd61094738e5737b7670944122712
map_features.geojson 91a2ca9812fdd381ea87f443daf1571feec8c763fa2f0c2590d9961c4c778b8e
```

One text-only assertion was corrected to match the actual no-submission policy wording. A new regression test caught the multi-day-event date-window issue before the filter was fixed; that regression now passes. The static smoke test was updated for V3's intentional entry-point and lazy-map architecture.

## Checks exercised

- Native project filter form, project deep links and Back restoration of list filters and focus, using jsdom.
- Shared community/participation routes, volunteer organizer link, date-derived Council time, canceled-meeting notices, and unknown-category empty state.
- Budget year/type/mode controls, accessible tables, gap-aware historical lines, absent actuals and CSV download generation.
- Question-based contact routing and official action availability outside disclosures.
- One failed optional collection and a failed map-data request while the project list remains available.
- Form labels, heading counts, focus targets and live-announcement elements; text escaping and disallowed URL schemes.
- Past/recurring/stale state, unknown price/commitment exclusion, Eastern time conversion, multi-day event overlap and local-first ordering.
- Correction-note generation confirms nothing is sent; no test form was submitted to a City office, venue, parish or volunteer organization.

## Browser and deployment limitations

The provided cloud browser could not access the local preview (`ERR_BLOCKED_BY_CLIENT`). An isolated local-document capability check was also explicitly rejected by browser URL policy. No workaround, public tunnel, alternative hosting or security change was attempted. Therefore desktop/mobile screenshots, real-browser keyboard traversal, visual reflow, screen-reader behavior, printed-page layout, map tile rendering, geolocation and actual browser clipboard/download behavior were **not verified** here. DOM tests do not replace those checks.

The source package contains no live repository checkout or existing Cloudflare deployment configuration. No remote push, deployment, Access login validation, allowlist change or public exposure occurred. Existing private-deployment security is untouched, but its live configuration is not certified by these tests.

Use the focused acceptance checklist in `v3-handoff.md` on the authorized existing preview before presenting the site as fully browser-verified.
