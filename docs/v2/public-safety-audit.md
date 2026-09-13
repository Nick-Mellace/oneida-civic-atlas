# Public safety source audit — September 12, 2026

## What was retrieved
The [official Police Blotters page](https://www.oneidacityny.gov/departments/police/police_blotters.php) embeds an OCV feed widget. Its configured [JSON endpoint](https://cdn.myocv.com/ocvapps/a110713421/public/blog_policeBlotter.json) returned 71 publication objects. The 10-item pagination is a client-side presentation of that response, not an additional server archive. The returned list was audited in full at the publication level. This does not prove the City has retained every historical release.

Earliest current-feed publication: 2024-05-31 02:32:48 UTC (May 30 Eastern), titled “Arrest Blotter (May 1 - 23, 2024)”. Latest: 2026-09-04 17:55:55 UTC, covering August 25–September 3, 2026. Event coverage starts May 1, 2024 in the earliest retrieved item. The timestamp represents feed publication, not an arrest time. Preserve UTC and render local dates deliberately.

[Police news](https://www.oneidacityny.gov/departments/police/news_and_events.php) embeds [blog_localNews.json](https://cdn.myocv.com/ocvapps/a110713421/public/blog_localNews.json): 15 objects, publication timestamps May 30, 2024–August 7, 2026. These mix hiring, events, investigations, weather and road notices. Classification cannot assume every item is an incident.

[Police warrants](https://www.oneidacityny.gov/departments/police/warrants.php) embeds [blog_warrantsList.json](https://cdn.myocv.com/ocvapps/a110713421/public/blog_warrantsList.json): 92 objects, timestamps May 15, 2024–September 2, 2026. This is a current published list, not a verified historical warrant ledger. Do not republish people as currently wanted from a frozen snapshot. No warrant identity index is shipped.

[City alerts and notices](https://www.oneidacityny.gov/government/city_manager/city_alerts-notices.php) and the police alerts page provide additional notices. The City page is mutable, and indexed versions differ. No complete historical alert archive or reliable publication timestamp for every notice was established. Accident-report access is a separate official service; it is not treated as an unrestricted bulk incident feed.

## Legacy history and limits
Search indexing exposes an older [December 30, 2022–January 9, 2023 blotter](https://www.oneidacityny.gov/sites/default/files/fileattachments/police/page/2468/police_blotter_dec_30_-_jan_09_city_of_oneida_pd.pdf). That is evidence of earlier reporting, not proof of the earliest publication date. Legacy routes may now return homepage HTML instead of a PDF. The old oneidacity.com archive could not be retrieved by the web reader. Targeted 2020 and 2021 searches returned no results; absence from search is not evidence of no records. Earlier files need recovery/verification before ingestion. Earliest reliably retrieved publication in the current blotter feed is the May 2024 timestamp above; a complete pre-2024 history remains unresolved.

## Formats and normalization
Each current-feed object has `_id.$id`, `date.sec`, title, HTML content, blogID, images and status. Older content uses nested divs; newer releases use paragraphs. Dates occur as headings; a release contains many arrests/tickets. Names and ages are inconsistent across periods. Event time and incident location are frequently absent. “Of Oneida” is residence, not an incident location. Header address 108 Main Street is police headquarters, never an event pin.

The offline parser walks HTML text, recognizes date headings, strips subject/residence prefixes and emits only pending review candidates. On this snapshot it identified 1,678 candidate lines and excluded 87 juvenile/minor-pattern lines. These are parser counts, not crime statistics or a complete event count. Candidate text may still need redaction and date reconciliation, so it is never served or automatically promoted. Input hashes and date ranges are in source-audit-manifest.json. Raw snapshots and unreviewed candidates remain outside the downloadable/served app.

## Reviewed prototype dataset
Nine entries were checked against the retrieved source text: six blotter entries plus road closure, vehicle-theft investigation and weather-update notices. Two names are retained only where the source explicitly identifies an adult arrestee/recipient and age. Other records omit names. No victim, witness, minor, complainant or incidental person is a searchable identity. No person profiles are created.

The vehicle-theft notice pairs June 29/30 with weekdays that disagree with the 2024 calendar; its event date remains null. The road notice supplies Vanderbilt Avenue and a debris-removal address, but no verified coordinates or street limits; geometry remains null. The weather update is historical and is not represented as a current evacuation or emergency. All nine records have null geometry. Disposition is a procedural report, not guilt or a verified final court outcome.

## Publication workflow
1. Retrieve official feed and record hash/retrieval time outside the served root.
2. Run `python3 scripts/audit-police.py input.json ../review-output`.
3. Review candidate against source: date headings, alleged offenses, role/age, incidental names, location precision, disposition and corrections.
4. Resolve collisions by source-entry ID plus event identity; do not merge people by name. Preserve correction provenance rather than overwrite history silently.
5. Promote only reviewed records to data/safety.json, validate schemas and run tests. The UI excludes pending/withdrawn records.
6. Verify source-backed geometry separately. Require geometry source URL and geographic confidence; never geocode residence or headquarters.
7. Review removals, corrections, sealed/expunged information and later official dispositions before public launch. Source disappearance is a review trigger, not proof of disposition.

The prototype has no live ingestion scheduler, full historical backfill, court-disposition feed or automated publication. Those are explicit remaining integration work, not hidden live capabilities.
