# Oneida Civic Atlas — V3

An independent resident's field guide to the City of Oneida, New York. This package evolves the supplied V2; it does not alter the existing private repository, Cloudflare deployment or Access allowlist.

## Run locally

From this directory:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [the local preview](http://127.0.0.1:8000). Opening `index.html` directly as a file does not support the JSON requests. No build step or production npm dependencies are required. Modern browsers with ES modules, top-level await, Intl time zones and AbortSignal.timeout are required. Leaflet 1.9.4 and OpenStreetMap tiles load only after requesting the map.

## What changed

- Five primary destinations: Home, Projects, Public Money, Community and Participate. Contacts stay in the header; evidence, methodology, downloads and the police archive are secondary.
- Compact editorial homepage, restrained paper/navy/rust styling, responsive layout rules, visible focus, practical source links, hash navigation, Back restoration and printable briefings.
- All 20 original projects and 22 geographic records remain byte-identical. Missing project milestones, spending and location information stay explicit.
- One shared dataset for ten cultural, volunteer, faith and civic records. Past seasons, unresolved details and cancellations are labeled; stale records leave upcoming views automatically.
- Three reconciled General Fund adopted-budget summaries (2023–2025), a donut/table, historical line chart, nominal/real/share controls, CSV export and methodology. **A comparable decade and audited actuals are not yet verified.**
- Thirteen scoped V3 contact checks supplement the preserved directory. Police administrative hours are distinguished from reporting availability.
- Correction notes download locally; no inbox or automatic submission is implied.

## Verify

Node 20+ is recommended for tests; Python 3 is used for local serving and the optional legacy data checks.

```sh
npm ci --ignore-scripts
npm test
npm run test:dom
npm run validate
```

`jsdom` is test-only. DOM checks are not a substitute for an actual browser, screen reader or visual layout review. See [actual verification results](docs/v3-verification.md), including the browser-preview restriction encountered in this environment.

## Deploy to the existing private site

See [the handoff](docs/v3-handoff.md). The ZIP contains source, tests and deployment-ready static files. It intentionally supplies no new hosting or authentication configuration. Merge changes into a review branch of the existing private repository, preserving its deployment files and Access rules. Do not enable a public preview or alternative public hostname.

## Maintain

See [source and data-gap notes](docs/v3-source-notes.md), [the implementation plan](docs/v3-plan.md), and the on-site About / methodology pages. V2's original documentation and source history remain under `docs/v2/`; their old implementation and verification claims describe V2, not this release. Old JS/CSS files remain for provenance but `index.html` loads only V3.
