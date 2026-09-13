# Oneida Civic Atlas V3 implementation plan

Goal: implement the approved resident field-guide brief in the supplied static V2 package, retaining original research and private-hosting boundaries.

Architecture: preserve vanilla ES modules and Leaflet. Add a separate V3 entry point, pure date/filter/finance helpers, community and financial JSON, and an editorial stylesheet. Keep original project datasets byte-identical. Use hash URLs for shareable project and opportunity pages. Optional collections load independently.

1. Establish baseline: run existing tests; inspect V2 source and official financial, community, volunteer and meeting sources. Save exact source titles, dates and qualifications with the data.
2. Write behavioral tests before helpers: event expiration in Eastern time, canceled/postponed exclusion, bounded recurrence without synthetic dates, unknown costs, inflation and percent calculations, missing-year line breaks, partial-load recovery, project research-task separation.
3. Implement `js/v3-core.js`, `js/v3-views.js`, `js/v3-app.js`, `css/v3.css`, and update `index.html`. Provide home, projects/details, money, community/details, participate, contacts, safety resources, archive and methodology.
4. Add `data/opportunities.json`, `data/money.json`, `data/contact-checks.json`; preserve all 20 projects and 22 geographic features. Research gaps remain null, not fabricated. Resident-facing interpretation lives in V3 views rather than changing the inherited project dataset.
5. Verify helpers and all original tests; inspect rendered desktop/mobile where the environment permits. Exercise routes, controls, dates and failure branches. Record actual checks without borrowing V2's browser claims.
6. Package source, public assets, data, tests, maintenance/source notes and deployment instructions. No deployment/access change without configured access. Save the deliverable ZIP.

Acceptance: resident tasks are actionable through authoritative links; municipal next milestones differ from research tasks; charts reconcile with tables; optional data failures do not disable other pages; no invented dates, geography, spending or contacts; all private deployment protections remain untouched.
