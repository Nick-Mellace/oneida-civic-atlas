# Oneida Civic Atlas — Version 2 prototype

Independent resident-centered civic field guide for Oneida, New York. Static HTML/CSS/ES modules, Leaflet 1.9.4 and bundled JSON. No build step, accounts, analytics or live ingestion backend.

## Preview

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. JSON loading requires HTTP; opening index.html as a file is unsupported. Leaflet and OpenStreetMap tiles require internet access. The project list remains available if the map library fails.

## Included

- Resident-question homepage and five-destination mobile navigation.
- All 20 original projects and 22 independent geographic features preserved byte for byte. Only 3 source-backed points are mapped.
- Search, filters, map/list view, optional location centering, accessible native project detail dialog with evidence gaps and separate confidence dimensions.
- 17 civic-directory entries, 9 notification/participation channels, 2 verified upcoming-at-snapshot meeting entries.
- 71-publication police blotter index and 9 reviewed safety records. These are explicitly a sample, not full historical coverage or live alerts.
- Source registry, JSON Schemas, source audit, offline ingestion/audit prototype, integrity/unit tests and implementation plan.

## Verify

Requires Node 20+ and Python 3.10+ (schema verification also requires jsonschema 4.26.0).

```sh
node --test tests/*.test.mjs tests/smoke.mjs
python3 -m pip install jsonschema==4.26.0
python3 scripts/validate-data.py
python3 -m unittest discover -s tests -p '*_test.py'
```

See docs/v2/verification.md for actual checks and limitations. See docs/v2/design-and-plan.md and docs/v2/public-safety-audit.md for design, source history, data gaps and future integration work.

## Private repository / preview workflow

Base commit: ca74ced972d65329e59e57b9b8f0e63e5c303ba9 in Nick-Mellace/oneida-civic-atlas. Changes were prepared on codex/atlas-v2. Nothing has been pushed or deployed.

Review the supplied patch in a clean checkout on a new branch. Run `git apply --check /path/to/atlas-v2.patch` before `git apply /path/to/atlas-v2.patch`. If the existing repository has changed, resolve conflicts rather than overwrite it. Alternatively copy the ZIP’s project contents into a review branch while preserving the existing .git directory and deployment configuration.

Keep the repository private. Reuse the existing Cloudflare Access-protected preview after reviewing changes; preserve its allowlist. Verify unauthenticated access is denied on every serving hostname before sharing a preview. Do not enable public GitHub Pages. A noindex tag is crawler guidance, not access control. No new hosting configuration is included because the repository did not contain the existing deployment configuration.

## Data maintenance

Do not edit the original project/geographic files to make a layout appear complete. Keep research/geographic confidence distinct; no inferred ward membership, geocoded hometowns or invented polygons. All new safety geometry is null.

Run scripts/audit-police.py against a separately downloaded official JSON feed; outputs must be outside the served repository. Candidates remain pending until reviewed. Never copy raw police payloads or unreviewed candidates into served assets. Published safety rows require explicit reviewed status; preserve corrections and later official dispositions without implying guilt.

This snapshot is dated September 12, 2026. Contacts, meetings and notices need maintenance. Historical notices must not be presented as current emergencies.
