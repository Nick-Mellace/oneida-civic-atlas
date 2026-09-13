# Verification record

Snapshot: September 12, 2026. Original repository baseline: ca74ced972d65329e59e57b9b8f0e63e5c303ba9.

## Automated checks
- Original baseline: 16 tests passed before modification.
- Current Node suite: 21 tests covering project relationships/counts, filters, safe rendering, source links, money distinctions, undefined geometry, evidence-gap disclosure, date formatting and safety review gating. Five new behavior tests failed before implementation and passed afterward.
- Python ingestion tests: 2 tests covering quarantine, identity-prefix removal, juvenile exclusion and invalid dates.
- JSON Schema validation: all 17 directory, 27 source, 9 channel, 2 meeting, 9 safety and 71 archive records validate. Unique IDs checked in each collection.
- Original project bundle and geographic file verified byte-identical against the baseline Git commit; SHA-256 checks included for future validation.
- Packaging excludes .git, Python caches, raw police payloads, candidate records, temporary dependencies and local server files.

## Browser checks actually performed
Local HTTP server, Codex browser:
- Homepage, directory, explore, public safety, Stay Informed and methodology pages load.
- Mobile contact task “Pothole” returns Public Works with sourced office details.
- Project search “Hotel” returns exactly one of 20 projects.
- Hotel detail opens and exposes status, money, geographic qualification and evidence sections; Escape closes the native dialog.
- Public safety location filter “Vanderbilt” returns the historical road notice.
- Archive search “2024” returns 16 publication titles, distinct from incident search.
- Map + list loads Leaflet/OpenStreetMap without console errors in the checked session.
- Homepage measured without horizontal overflow at 320 and 768 CSS pixels; visually inspected at 390 and 1440 pixels.

## Limits of verification
This is not a WCAG certification. Screen-reader testing, physical-device Safari testing, comprehensive zoom/contrast automation and exhaustive keyboard testing remain release checks. Native HTML controls, dialog, focus styles, skip navigation, reduced-motion rules, large controls and list alternatives are implemented. Location permission is not requested during agent testing; permission denial/success branches require user-device verification. Map CDN failure fallback is implemented but not fault-injected in the browser session. No production/Cloudflare deployment or Access policy was modified or reverified. No claim of complete public-safety history, current warrant status or ongoing data refresh is made.
