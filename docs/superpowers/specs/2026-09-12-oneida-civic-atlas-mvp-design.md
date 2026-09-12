# Oneida Civic Atlas MVP Design

## Purpose
Build a public-facing, nonpartisan civic information application for the City of Oneida, New York that helps residents answer: what is happening, where, who controls it, what it costs, what happens next, and how to follow it.

## MVP Scope
- Interactive map using Step 4 GeoJSON.
- Searchable/filterable directory containing all 20 projects.
- Project detail drawer with status, plain-language status reason, location, jurisdiction, lead entity, money, blockers, public concerns, government response, civic opportunity, next milestone, open questions, confidence, last verified date, and source links.
- Geometry-pending projects remain visible in lists and are never given invented pins.
- Separate research confidence and geographic confidence.
- Filters for category, status, and geometry state.
- Mobile-responsive layout.
- Source transparency and methodology copy.
- Accessible text alternative to map interactions.

## Architecture
Static HTML/CSS/JavaScript application. Data is loaded from the Step 4 app bundle and GeoJSON copied into `data/`. Leaflet renders verified point geometry over OpenStreetMap tiles. Application state (search and filters) is kept in browser memory only. No backend, accounts, analytics, or data mutation in MVP.

## Data Integrity Rules
- Project record is the source of truth; map features are geographic representations of projects.
- `geometry: null` is intentional and must not be replaced with guessed coordinates.
- Never infer ward membership.
- Never translate missing data into evaluative claims.
- Display unresolved questions and source gaps as first-class information.
- Money fields must retain their source semantics: estimated cost and committed funding are not the same as actual spending.

## Visual Direction
Contemporary civic observatory: navy/slate palette, warm off-white background, restrained teal accent, editorial typography, no campaign or partisan symbolism. Map is the primary desktop entry point; project directory remains fully usable without the map.

## Primary Screens
1. Explore: map + project result rail.
2. Projects: project cards in the same rail, filterable and searchable.
3. About/Methodology panel: explains evidence, confidence, geometry, and status handling.

For MVP, these are implemented as a single-page interface with tabs rather than separate routes.

## Map Behavior
- Render only GeoJSON features with non-null geometry.
- Point markers open corresponding project detail.
- Projects without geometry appear in result cards with a clear “Map geometry pending” or “Citywide / non-spatial” label.
- Map control can fit to all verified points.

## Accessibility
- Keyboard-operable buttons and filters.
- Visible focus styles.
- Semantic headings and labels.
- Status never communicated only by color.
- Project list is a complete alternative to the map.
- Respect `prefers-reduced-motion`.

## Validation
- Automated tests for search/filter utilities and project-feature joining.
- Static checks that all 20 project records load, project IDs are unique, every map feature points to a valid project ID, and no null-geometry feature is rendered as a marker.
- Manual smoke test through a local HTTP server.
