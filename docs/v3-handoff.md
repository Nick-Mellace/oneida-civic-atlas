# V3 handoff

## Delivered

The supplied static V2 has been evolved into a V3 field guide with five primary destinations, a compact editorial homepage, shared community/participation records, a limited but verified public-money explorer, more useful project briefings and visible official actions.

All 20 original project records and 22 geographic features are preserved. V2 source data and historic documentation remain available. The original private repository and Cloudflare service were not modified, pushed or deployed; this is a ready-to-deploy source package for the existing protected deployment.

## Design and implementation

- Paper, navy and rust; serif editorial headings, system sans-serif body text, restrained rules, minimal cards and no decorative animation or invented imagery.
- Home hierarchy leads with documented changes, then varied community discovery; public money, ways to help and civic participation have distinct roles.
- Hash routes such as `#project/P003`, `#opportunity/mchs-volunteer` and `#money?year=2024&mode=real` support sharing without server rewrites. In-session Back restores project filters, scroll and link focus.
- Project information is ordered around resident questions. Official steps differ from research tasks. Funding categories are separated and geography confidence remains independent of documentary confidence.
- Optional JSON collections fail independently; requests time out. The map loads only on request. A failed map does not remove the list.
- Native controls, labels, headings, skip link, focus styles, live status messages, accessible chart tables and print styles are present. CSS has desktop, tablet and mobile breakpoints. Real-browser visual/accessibility review is still required; see verification notes.
- No new production dependencies, build tool, data service, accounts, tracking, messaging or hosting configuration. `jsdom` is a development-only dependency.

## Integration with the existing private repository

The supplied V2 README identifies `Nick-Mellace/oneida-civic-atlas`, original V2 branch `codex/atlas-v2`, base `ca74ced972d65329e59e57b9b8f0e63e5c303ba9`. These are inherited references, not a claim that the remote still has that exact state. This working package is not a git checkout.

1. In your existing private checkout, commit or safely retain current work and create a review branch for V3. Compare the current V2 files with this package before copying; do not overwrite newer research or unrelated changes.
2. Preserve all existing deployment/authentication configuration, repository privacy and Cloudflare Access application/allowlist. Do not replace the repository's `.git` directory. This package intentionally does not include new Wrangler, Worker, Pages, Access or public-hosting configuration.
3. Review the changed `index.html`, new `css/v3.css`, `js/v3-*.js`, `data/money.json`, `data/opportunities.json`, `data/contact-checks.json`, tests, package manifest/lockfile and V3 docs. Original project and map data must still match unless you deliberately review a separate research update.
4. Run `npm ci --ignore-scripts`, `npm test`, `npm run test:dom`, and `npm run validate`. Preview locally with `python3 -m http.server 8000 --bind 127.0.0.1`.
5. Use only the existing private Cloudflare deployment pipeline. Static serving needs `index.html`, `css`, `js`, `data` and linked documentation. Do not upload `node_modules`, test fixtures, temporary budget PDFs or unrelated workspace files as website assets.
6. Check the protected existing hostname at desktop/mobile sizes and exercise the acceptance checklist below. Confirm the allowed identity can sign in and an unauthenticated identity cannot obtain HTML, JS, JSON or documents. Confirm that no alternate Worker/Pages preview hostname exposes the assets without Access. Do not broaden the allowlist to make testing easier.
7. Retain the previous deployment for rollback. No broad cache policy is prescribed because the existing pipeline was not available for inspection; ensure changed HTML/data/JS are served together and stale snapshots are not cached indefinitely.

`noindex` is included for the preview but is not access control. Hash links do not grant access: recipients still need their existing authorization.

## Remaining content limitations

The full product brief's honest-data fallback is used: three adopted-budget years are verified, not a complete decade. Audited actuals, all-funds comparison and detailed project disbursements remain gaps. Two civic meeting times are verified but their locations, agenda subject matter and comment rules are not. Several cultural categories are ready for records but currently have no confirmed listings. The public ownership/contact statement and an operational receiving inbox are not supplied; downloaded notes use the user's existing contact with the private-preview owner.

## Eight-perspective review

This is a design review from the requested roles, not interviews, endorsements or claims about real officials' views.

| Perspective | What V3 improves | What to resolve before relying on it |
|---|---|---|
| Council official | Visible independence, neutral explanations, direct official records and nonduplicative participation routing | Verify specific open decisions, agenda-item citations and meeting locations; identify the publisher clearly. |
| Police chief | Official reporting/support routes lead; sample arrest summaries move to a secondary archive with allegation and coverage qualifications | Confirm notification and reporting-service availability; archive maintenance must retain corrections and later dispositions. |
| Mayor | A welcoming civic and cultural guide that sends residents to City and organizer services and does not frame missing updates as failure | Establish a sustainable editorial owner and refresh schedule; do not imply City endorsement. |
| Codes head | Question-based routing separates Codes, Planning and other institutions; no unofficial application or complaint form | Add source-backed procedure detail only after checking current official instructions; avoid advice inferred from project summaries. |
| Long-established business owner | Practical community discovery, transparent selection, local-first listings and cautious business-impact context | Broaden verified host coverage to both established and newer businesses; acquire actual access/closure and assistance details. |
| New resident | Clear first-meeting guide, official ward directory, volunteer inquiry links, faith and secular routes, distinct attend/serve/influence paths | Realistic shift lengths, prerequisites, accessibility and open eligibility require organizer verification. |
| Fiscally responsible aspiring candidate | Reconciled source amounts, accessible tables, missing-year gaps, separate budgets/actuals and DRI double-counting protection | Do not use the three-year summary as a comprehensive decade or evidence of waste/fairness; complete the actuals crosswalk first. |
| City planner | All project provenance retained, list-first exploration, separate geographic confidence, research gaps distinct from official steps | Add authoritative milestone owners, dated schedules, boundary data and source-backed event/project links as they become available. |

## Real-browser acceptance checklist

These are pending checks, not reported passes:

- At 1440×900, 768×1024, 390×844 and 320×740: readable hierarchy, no page-level horizontal overflow, sensible navigation/touch targets, chart/table readability and useful content near the top.
- At 200% zoom and with a screen reader: reading order, heading structure, source labels, native disclosure controls, chart alternatives and status announcements.
- Using only Tab/Shift+Tab/Enter/Space: reach all actions, skip the masthead, retain visible focus, open a project and use browser Back. Check copy/share and print in the actual browser.
- Open `#project/P003` in a new tab after Access sign-in. Reload and Back must behave sensibly; filters should survive returning within the same page session.
- Discover a cultural activity; verify current details at the host. Open a volunteer signup route without submitting a test application. Read a civic meeting's unknowns; find the Clerk contact.
- Select adopted/actual, missing/verified years, inflation-adjusted values and category histories. Compare chart values to tables; download CSV.
- Block one optional JSON request, the map library and tiles separately. Other destinations must remain useful. Deny geolocation and verify the map/list explanation.
- Check expired, stale, canceled and postponed fixtures in a private local test environment. Do not publish invented test events in production data.
- Print a project with collapsed evidence and confirm sources/qualifications appear. Verify all official links needed for the presentation on the day of use.
