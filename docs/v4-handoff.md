# Oneida Civic Atlas V4 — targeted update

Prepared September 14, 2026 against the existing private repository's main branch.

## Changes

- Unified branding/navigation header; compact wrapping mobile navigation, readable system sans-serif/Georgia pairing, more space and larger project phase.
- Photo-led homepage, shorter event previews, calendar stamps for dated events, quiet undated opportunity treatment.
- History navigation with City origins, living Oneida Indian Nation, religious Oneida Community, complex marriage, selective breeding controversy and industry. Sources are beside the text.
- Optional Community/Participate map uses the same filtered records as the list. One verified museum venue currently supports two records. Unmapped records remain visible. Numbered markers, venue buttons, popups and official signup links are implemented.
- Twelve opportunity records: ten inherited records unchanged plus a September 17, 2026 Mansion House tour and museum volunteer inquiry. No future recurrence invented.
- Downloadable media, venue and organizer-discovery registries. No new runtime package dependencies.

## Research and rights

Photo credits, original URLs, dates, licenses and restrictions: data/media.json. Two Wikimedia Commons photographs, CC BY-SA 4.0, credited to Oneidacommunitymansionhouse and Cathbart1948. They are served as responsive Wikimedia thumbnails, resized without cropping. These older photographs are not evidence of current conditions. No remote photographs were copied into the repository.

The [Mansion House tour](https://www.oneidacommunity.org/event-details/tunnels-towers-tour-8) establishes September 17, 6–7:30pm Eastern, ticket prices, reservation deadline and address. [Museum volunteering](https://www.oneidacommunity.org/volunteer-internships) supplies roles and the application route. Unknown eligibility and accessibility remain unknown.

History sources include the [County Historian](https://www.madisoncounty.ny.gov/328/Oneida), [Oneida Indian Nation](https://www.oneidaindiannation.com/milestone/origins), [Mansion House](https://www.oneidacommunity.org/our-history), [National Park Service](https://www.nps.gov/articles/utopias-in-america.htm), and [Martin Richards's 2004 scholarship](https://pubmed.ncbi.nlm.nih.gov/15468508/). The [Historical Society's Edmonia Lewis feature](https://mchs1900.org/edmonia-lewis-exhibit/) is linked without reproducing its artwork.

## Remaining gaps

- Map coverage is intentionally limited to the Mansion House, using a sourced approximate OpenStreetMap museum point via Mapcarta. It is not a surveyed entrance, parcel or parking location. Cottage Lawn, other volunteers and uncertain placements remain unmapped pending verified coordinates.
- Seven organizer/business discovery entries are a starting sample, not a complete City business directory. City-linked websites were prioritized. The Chamber is a discovery lead awaiting member-by-member review. Blind Squirrel's reviewed events page supplied no upcoming events; older karaoke/open-mic schedules were not rolled forward.
- The City confirms the Library's official Facebook account, but posts could not be retrieved. Additional official social accounts and current listings remain to be checked; no authenticated pages were bypassed.
- Contemporary artist websites and permissions remain an editorial follow-up. No contemporary artwork is reproduced. City/library/museum online imagery is not treated as automatically licensed.
- Wikimedia thumbnails and Leaflet/OpenStreetMap require external connectivity. Image and map failure messages preserve navigation and listings. The exterior and interior photographs and OpenStreetMap tiles rendered in the local browser checks. A failed thumbnail retries the original licensed image once; this fallback can transfer a larger file.
- Review time-sensitive records before release if deployment occurs after the recorded check dates. Existing 30-day community/7-day civic freshness rules still apply; old events expire automatically.

## Actual verification

Passed: 41 focused Node checks (V3 core/render, filters, static smoke and V4 tests); V3 data validator; syntax checks for changed application/map modules. Tests cover Eastern dates, expiration, cancellations, stale records, map/filter alignment, unmapped opportunities, volunteer routes, source escaping, photo metadata, optional-data failures, project rendering and budget regression.

Preservation checked byte-for-byte against fetched main: wrangler.jsonc, .assetsignore, data/app_bundle.json, data/map_features.geojson and data/money.json. The ten original opportunity objects are unchanged. Project validator: 20 records, 22 geographic features (3 mapped geometries), 12 opportunities, 3 reconciled budget years.

Browser checks completed against the user-started loopback preview: desktop layouts at observed 1440/1280px and mobile at 390px; no horizontal overflow on inspected Home, Community, History and Money pages; aligned desktop navigation; balanced mobile navigation; both historical photos rendered; project filtering and Back restored the Hotel search, one result and project-link focus; direct #project/P003 opened correctly; calendar dates and past/unresolved filters worked; map tiles, venue popups, official signup URLs and volunteer/list alignment worked; skip link focused main; History topic links focused headings; Enter opened a native disclosure; venue buttons opened popups; Escape closed the popup and returned focus to the venue button; water contact search exposed official office links; adopted-budget table and missing-actuals state rendered correctly. No forms were submitted to outside organizations.

Browser findings fixed and rechecked: uneven mobile menu wrapping; hidden failed-image elements retaining layout space; missing original-image retry; stale local asset caching; Escape dismissal while focus was inside popup links. Versioned changed assets ensure the revised browser code loads. The map close animation completes before popup removal.

Remaining verification limits: this was a representative browser review, not a full accessibility certification or cross-browser audit. 320px resizing did not take effect in the browser tool, so 390px is the verified narrow viewport. Optional-data, stale/canceled-event and map-selection failures passed automated tests; a browser venue-file failure experiment was inconclusive because cached data remained available, and the file was restored. The separate jsdom suite could not run because its dependency was unavailable; real-browser journeys covered the principal integration paths. No Wrangler dry run/upload or live Cloudflare Access/deployment verification was performed.

## Apply and preview

Use the existing private repository and its protected Cloudflare deployment. No hosting, routes, workers.dev setting, Access policy or allowlist changes are included.

1. Start from the current main checkout with a clean working tree; create an atlas-v4 branch.
2. Run git apply --check on the supplied atlas-v4.patch, then git apply. If the check fails, reconcile the affected files against newer repository edits; do not force an overwrite.
3. With Node available, run:

       node --test tests/v4.test.mjs tests/v3.test.mjs tests/v3-render.test.mjs tests/filters.test.mjs tests/smoke.mjs
       node scripts/validate-v3.mjs
       npm ci
       npm run test:dom
       python3 -m http.server 8000 --bind 127.0.0.1

4. Open http://127.0.0.1:8000. Check 1440px desktop and 390px/320px mobile: header alignment, no horizontal overflow, photo credits, readable event stamps, keyboard focus/skip link. In Community, load the map, open the museum venue, follow an activity, then use Back. Filter to volunteering and confirm only the museum inquiry is mapped while other opportunities remain in the list. Test #project/P003 and #history/community directly. Test canceled/stale views, offline map/photo behavior, contacts and the money table.
5. Commit the patch on atlas-v4 and open a PR into main. After preview checks and merge, monitor the existing Cloudflare project. Keep deploy command npx wrangler deploy and preserve the existing config/exclusions. Dependencies must stay excluded by .assetsignore.

## Deployment status

GitHub repository read access was confirmed through the connector. Repository write access was previously rejected with HTTP 403 (integration permissions); no V4 commit, PR, merge or deployment was performed here. The patch is the authorized handoff fallback. Current Cloudflare build and Access status were not independently inspected.
