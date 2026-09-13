# V3 sources, gaps and maintenance

Review date: September 13, 2026. Dates in the datasets distinguish an event, an official action and an Atlas source review. This is a manually maintained snapshot, not a live feed.

## Preserved research

`data/app_bundle.json` and `data/map_features.geojson` are unchanged from the supplied V2: 20 projects, 22 features, only three mapped points. All original source URLs, confidence fields, qualifications and unresolved questions remain. V3 changes the reading order and source labels, not the underlying evidence.

Project evidence has not been comprehensively re-researched for V3. Original September 12 review dates remain. Missing page-level references, exact milestone owners, business access/disruption details, detailed project spending, boundaries and ward assignments remain gaps. Filename-based source labels are better than “Source 1,” but are not a substitute for a document-and-page evidence ledger.

Research instructions beginning Verify, Track, Monitor, Determine, Acquire, Build a verified inventory or Publish project-by-project are moved out of the official-next-step position. Remaining descriptions are inherited anticipated steps, not promises of a date. Each briefing makes that limitation visible. The complete original text remains downloadable.

## Money

The following official scanned summaries were visually read at printed page 12 / PDF page 15. Each category sum matches its printed total exactly.

| Year | Summary total | Source |
|---|---:|---|
| 2023 | $15,783,298 | [2023 adopted budget](https://www.oneidacityny.gov/Documents/Departments/Finance/City%20Budget/2023%20Adopted%20Budget.pdf?t=202512101240530) |
| 2024 | $16,110,749 | [2024 adopted budget](https://www.oneidacityny.gov/Documents/Departments/Finance/City%20Budget/2024%20Adopted%20Budget.pdf?t=202512101240530) |
| 2025 | $17,144,013 | [2025 adopted budget](https://www.oneidacityny.gov/Documents/Departments/Finance/City%20Budget/2025%20Adopted%20Budget.pdf?t=202512101240530) |

Entity: City of Oneida, Madison County, New York—not Oneida County or another municipality with a similar name. Scope: the General Fund expenditure summary headed “Net Service Cost Financed by.” Basis: the City's adopted-budget presentation; no claim that these are audited GAAP actuals or an all-funds measure. Year labels refer to the respective adopted budget documents. They are not combined with actual-expenditure fiscal years.

The same eight summary categories are displayed in all three sources. Benefits are not apportioned to service departments. There is no proof here of unchanged underlying classifications, service levels, transfers or accounting treatment; use these as limited summary comparisons, not a complete policy-effect series.

[City budget archive](https://www.oneidacityny.gov/departments/comptroller/city_budget.php) and [New York State Comptroller local-government data](https://www.osc.ny.gov/local-government/data) were researched as the official expansion routes. A harmonized State Comptroller extract was not completed. The public decade view explicitly marks 2017–2022 and 2026 missing. Audited actuals, earlier budgets, a 2026 summary, all-funds reconciliation, entity/fiscal-year/basis checks for actuals and a detailed category crosswalk remain required before extending the series. Some archive links resolved to HTML instead of their intended documents; the verified direct PDF URLs are retained above.

Inflation source: [BLS historical U.S. city average CPI table](https://www.bls.gov/regions/mid-atlantic/data/consumerpriceindexhistorical_us_table.htm), all-items CPI-U, not seasonally adjusted, 1982–84=100. Arithmetic means of all 12 monthly values: 2023 = 304.7015833333333; 2024 = 313.6888333333333. Base year is 2024. The 2025 annual value was not established for this release and stays missing. No estimate is substituted.

For reproducibility, the monthly inputs used were:

```text
2023: 299.170,300.840,301.836,303.363,304.127,305.109,305.691,307.026,307.789,307.671,307.051,306.746
2024: 308.417,310.326,312.332,313.548,314.069,314.175,314.540,314.796,315.301,315.664,315.493,315.605
```

Real amount = nominal × base CPI / year CPI. Share = category / summary total × 100. Table dollars round to whole dollars, export real dollars to cents, shares in the CSV to six decimal places. Lines break across missing years. No explanation for a large change is invented.

Project estimates and commitments are separate from local contributions, grant reimbursements and actual spending. The DRI (Downtown Revitalization Initiative) umbrella is never added to its components. No personal tax-bill allocator or taxpayer-specific estimate is provided. County, school and other property-tax components remain official-referral explanations, not unverified rate calculations.

## Community and participation

All ten records live in `data/opportunities.json`; Community and Participate filter that same collection. Record IDs are stable. Multiple source URLs can attach to one event; new entries require a duplicate check by organizer, venue and date/schedule. No event-submission backend or automatic publishing exists.

| Source | What was used | Qualification |
|---|---|---|
| [Historical Society craft festival](https://mchs1900.org/madison-county-craft-festival-2/) | September 12–13, 2026 festival; times, location, admission and music / food / craft context | One two-day record; not separate duplicate listings for each tag. Daily opening hours shown explicitly. |
| [Historical Society volunteer page](https://mchs1900.org/volunteer/) | Tasks and organizer application route | Ongoing inquiry, not an assigned shift; duration and eligibility remain unconfirmed. |
| [Historical Society homepage](https://mchs1900.org/) | Appointment-based local-history visits and regular admission | Current exhibit availability and special-exhibit prices must be checked with the host. |
| [Cottage Lawn market](https://mchs1900.org/cottage-lawn-farmers-market/) | Documented June 9–August 25, 2026 Tuesday season | Ended season, never extended into September. |
| [Spirit of Hope](https://spiritofhopecatholic.org/) | Parish involvement and registration route, including Oneida parishes | Catholic affiliation explicit; exact activity, membership, access and placement conditions are not assumed. |
| [Oneida Baptist Church](https://oneidabaptistchurch.com/) | Community dinner invitation and host location | Next date / cost unresolved; not advertised as a scheduled upcoming dinner. |
| [Catholic Charities volunteer inquiry](https://www.catholiccharitiesom.org/volunteer) | Regional volunteer application route | Not a confirmed City of Oneida placement. Religious participation is not inferred as a condition. |
| [City meeting index](https://www.oneidacityny.gov/departments/city_clerk/agendas_meetings.php) | September 15 Council and September 16 Recreation meetings, and explicit August 11 Water Board cancellation | Location, specific decisions, open comment windows and delivery methods remain unverified. Council agenda/packet availability is recorded, but document contents were not successfully established. |

Supplemental discovery destinations: [City community/library listing](https://www.oneidacityny.gov/our_community/oneida_public_library.php), [City recreation programs](https://cityofoneida.recdesk.com/) and the [City homepage](https://www.oneidacityny.gov/). These are organizer discovery routes, not fictitious event entries.

Specific current local-artist exhibitions, open mic, karaoke, library/community-center sessions and neighborhood gatherings are not all verified. The filters and honest empty states support them now; editors should expand the mix with primary organizer sources. No “an hour to give” spotlight is populated because no one-hour commitment was established. The Edmonia Lewis item encountered during research was not treated as a local exhibit while its artifact was documented on loan elsewhere. The small starting selection is not representative or comprehensive.

## Contact checks and safety

All 17 original directory records remain unchanged. `data/contact-checks.json` supplements 13 with scoped September 13 checks, rather than silently restamping all fields.

- [Official staff directory](https://www.oneidacityny.gov/staff_directory/index.php): City Manager, Mayor, Clerk, Codes, Planning, Fire administration and Parks telephone/email fields checked.
- [Water](https://www.oneidacityny.gov/departments/water/index.php) and [Public Works](https://www.oneidacityny.gov/departments/public_works/index.php): contact fields, addresses and office hours checked.
- [Police](https://www.oneidacityny.gov/departments/police/index.php): non-emergency number and address checked. Office numbers/hours are not dispatch availability. [Mental-health crisis worker information](https://www.oneidacityny.gov/departments/police/mental_health_crisis_worker.php) remains a direct official referral.
- [Library City listing](https://www.oneidacityny.gov/our_community/oneida_public_library.php): telephone, email and address checked; ambiguous Saturday-hours text is not normalized.
- [Chamberlain](https://www.oneidacityny.gov/departments/comptroller/accounting_and_treasury.php): email/address confirmed, but contact block and staff table disagree on the telephone number; the Atlas leaves the number unselected and explains the discrepancy. Lunch closure is noted.
- City Hall details were checked on the City site. Ward-directory navigation was inspected. Remaining county, utility and school records retain their V2 review dates; a full repeat verification is outstanding.

The police-publication index and nine reviewed records remain historical. No crime rate, trend, guilt inference, person profile or safety score is created. The original retained dataset still includes its existing qualifications and any originally documented names; the V3 summary view does not promote names. UTC publication timestamps display in Eastern time; date-only event dates are preserved.

## Editorial operating rules

1. Confirm a primary organizer / government source. Record fields separately; silence means unknown, not free, accessible or open to everyone.
2. Check duplicates and retain all useful source attribution in one record. Relationship links require evidence; no inferred partnerships or project-caused events.
3. For recurrence, require both a schedule and a validity end. Do not generate dates from an undated “weekly” claim.
4. Recheck civic entries at least weekly and other activities at least monthly; recheck featured dated activities close to their start. After 7 / 30 days, upcoming views exclude stale records. All-record views retain them with a warning.
5. Date-only events expire after the Eastern local day. Timestamped events expire at their documented end; a start-only meeting leaves upcoming views once its listed start passes because an end time is unknown. The page reevaluates date state once a minute while open.
6. Preserve cancellations and postponements. Historical past events remain accessible through filters and deep links.
7. Review projects and contacts monthly. “Needs a fresh check” describes evidence, not inactivity or closure.
8. Verify corrections before editing; record review scope and original evidence. Downloaded feedback notes are not sent automatically. The owner must provide a public ownership/contact statement before a wider presentation; no delivery SLA is invented.

No licensed local photography was supplied or verified for reuse. V3 uses typography and source-grounded charts, with no fabricated documentary imagery.
