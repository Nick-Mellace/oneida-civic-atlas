# Oneida Civic Atlas Version 2 — design and implementation plan

## Brief and baseline
Implement implementation-brief.txt. Base repository: Nick-Mellace/oneida-civic-atlas, private; commit ca74ced972d65329e59e57b9b8f0e63e5c303ba9. Work is isolated in a new clone on codex/atlas-v2. Baseline: all 16 existing tests pass. Static ES modules, Leaflet 1.9.4, local JSON, no compilation or backend.

## Audit
20 projects; 22 separate geographic features; only 3 Point geometries, 19 null geometries. No authoritative ward polygons. Preserve both source files byte for byte. The bundle retains source gaps and separate research/geographic confidence. Existing rendering omits detailed geographic qualifications and source-gap text: restore these in details. Map creation currently precedes list rendering, so CDN failure blocks all content. Details use an aside without modal focus containment or focus restoration. Desktop filter bars dominate mobile; default view begins with a database rather than a resident question. Existing tests cover data and string rendering but no real browser journeys.

## Architecture choice
Retain static ES modules and append independent civic JSON datasets. This preserves the existing private Worker workflow and avoids a framework migration. A full React rebuild would increase deployment complexity without helping this prototype; a cosmetic reskin would not address navigation or evidence disclosure.

## Information architecture
Home: resident questions, selected project research, upcoming meetings, dated civic record stream.
Explore: complete project list, search/category/status/map-state filters, map/list switch; all unmapped projects remain available. Near me requests location only on click, centers the map without persisting it, and explains incomplete coverage.
Directory: query by resident task or organization, jurisdiction filter, contact links and provenance.
Stay Informed: channels grouped by purpose, meetings and participation guidance with primary records.
Public Safety: reviewed incident sample, publication archive, filters for date/type/category/location/source, explicit coverage and presumption-of-innocence notices.
About/evidence: methodology, source confidence, audit limitations, downloadable schemas.

## Layout and identity
Local newspaper plus civic field guide. Broad navy masthead, warm paper ground, restrained rust rules, serif editorial headlines and system sans controls. Palette: navy #142f40, paper #f6f2e9, rust #a43e22, ink #20343c, muted green #355b50. Blue/orange are community-inspired, not official City colors. School branding source: https://oneidacsd.org/41829_3 . No City seal imitation, Oneida Nation motifs, mascot invention, or political color coding. Abstract typographic rules do not purport to be real geography.
Desktop: asymmetric headline and task index; open editorial rows, map beside results where room permits. Mobile: one-column question-first layout, five labeled bottom destinations, vertically stacked filters, map/list toggle, native modal details styled as bottom sheet. No gesture-only controls. At least 44px controls, visible focus, skip link, reduced motion, semantic headings, native dialog and restored focus. Test 320/390/768/1440px widths; automated checks do not certify all WCAG 2.2 AA criteria.

## Data contracts
Keep projects and map features independent. Civic source registry has ID, publisher, URL, source type, best-for explanation, retrieval/check date, coverage and integration mode. Directory has organization, resident questions, responsibility, jurisdiction, nullable address/phone/email/hours, source IDs, verification date. Safety records separate event date/time and publication date, alleged offenses, nullable location/geometry, source entry ID, disposition, review status and verification date. Names optional, never extracted into person profiles. Victims, witnesses, complainants, minors and incidental persons excluded from searchable fields. Candidate ingestion cannot publish automatically.

## Implementation sequence and verification
1. Preserve data hashes; retain baseline tests. Add failing tests for undefined geometry, source-gap disclosure, safety filters, review gating and date handling.
2. Research city, county and police sources. Audit full currently linked JSON indexes plus legacy discovery. Produce publication index and reviewed sample with honest gaps; never claim complete incident coverage.
3. Build schemas, source registry, directory, channels and meeting data. Add an offline ingestion/audit script producing candidate records for review; raw police files stay outside served assets.
4. Rebuild HTML/CSS shell and route controller. Keep project detail render and data loader, repair evidence disclosure and graceful map fallback. Add independent directory, safety and channel modules. Native dialog handles keyboard containment.
5. Run all unit/integrity tests, local HTTP checks, browser task flows and responsive visual checks. Validate all JSON contracts, unchanged source data, null geography and packaging.
6. Deliver ZIP, patch, documentation and screenshots. Do not push, deploy or change Access settings. Existing authenticated Cloudflare preview remains the deployment target; URL obscurity is not access control.
