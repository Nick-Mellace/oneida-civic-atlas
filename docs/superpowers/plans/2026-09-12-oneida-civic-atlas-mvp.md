# Oneida Civic Atlas MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working static MVP of the Oneida Civic Atlas from the Step 4 app bundle and geographic layer.

**Architecture:** A dependency-light single-page web application loads the verified project bundle and GeoJSON from local JSON files. Leaflet renders only verified geometry, while all projects remain searchable in an accessible result rail and project detail drawer. State is client-side only.

**Tech Stack:** HTML5, CSS3, vanilla ES modules, Leaflet 1.9.x via CDN, Node.js built-in test runner.

**Spec:** `docs/superpowers/specs/2026-09-12-oneida-civic-atlas-mvp-design.md`

## Global Constraints
- Never invent map coordinates or ward assignments.
- Render `geometry: null` features as list metadata only, never as map markers.
- Keep research confidence and geographic confidence separate.
- Do not evaluate political actors, government performance, policies, or outcomes.
- Preserve source URLs from the verified dataset.
- MVP must work as static files served over HTTP.
- Mobile layout must remain usable at 390px viewport width.

---

### Task 1: Data module and integrity validation

**Files:**
- Create: `data/app_bundle.json`
- Create: `data/map_features.geojson`
- Create: `js/data.js`
- Create: `tests/data.test.mjs`

**Interfaces:**
- Produces: `loadAtlasData() -> Promise<{projects, mapFeatures, projectById, featuresByProject}>`
- Produces: `validateAtlasData(projects, mapFeatures) -> string[]`

- [ ] Copy Step 4 source files into `data/` without changing data.
- [ ] Write tests asserting 20 unique projects, 22 map features, and valid feature-to-project references.
- [ ] Run `node --test tests/data.test.mjs` and confirm failure before implementation.
- [ ] Implement `loadAtlasData` and `validateAtlasData`.
- [ ] Run tests and confirm pass.

### Task 2: Search and filter engine

**Files:**
- Create: `js/filters.js`
- Create: `tests/filters.test.mjs`

**Interfaces:**
- Consumes: Step 4 project objects and map-feature lookup.
- Produces: `filterProjects(projects, featuresByProject, state) -> Project[]`
- Produces: `getGeometryLabel(features) -> string`

- [ ] Write tests for text search, category, status, mapped-only, geometry-pending, and citywide/non-spatial labels.
- [ ] Run tests and confirm failure.
- [ ] Implement pure filter helpers.
- [ ] Run tests and confirm pass.

### Task 3: Application shell and visual system

**Files:**
- Create: `index.html`
- Create: `css/styles.css`

**Interfaces:**
- Produces DOM targets: `#map`, `#project-list`, `#detail-panel`, `#search-input`, `#category-filter`, `#status-filter`, `#geometry-filter`, `#result-count`, `#methodology-dialog`.

- [ ] Build semantic HTML shell with header, tabs, filters, map, result rail, detail panel, and methodology dialog.
- [ ] Add Leaflet CSS/JS CDN references.
- [ ] Implement responsive desktop/mobile CSS and keyboard focus states.
- [ ] Verify at 390px and desktop widths through static inspection/local server.

### Task 4: Project cards and detail rendering

**Files:**
- Create: `js/render.js`
- Create: `tests/render.test.mjs`

**Interfaces:**
- Produces: `projectCardHTML(project, features) -> string`
- Produces: `projectDetailHTML(project, features) -> string`
- Produces: `sourceLinks(sourceUrls) -> Array<{label,url}>`

- [ ] Write tests for status, geometry label, confidence, unknown values, source parsing, and escaping.
- [ ] Run tests and confirm failure.
- [ ] Implement rendering helpers with HTML escaping.
- [ ] Run tests and confirm pass.

### Task 5: Leaflet map controller

**Files:**
- Create: `js/map.js`

**Interfaces:**
- Produces: `createAtlasMap(elementId, onProjectSelect) -> {setFeatures(features), focusProject(projectId), fitVerified()}`

- [ ] Initialize Leaflet centered on Oneida with OpenStreetMap tiles and attribution.
- [ ] Render only features with non-null geometry.
- [ ] Associate markers with project IDs and selection callbacks.
- [ ] Add fit-to-verified-projects control behavior.
- [ ] Ensure no null-geometry record is converted to a marker.

### Task 6: Application state and interaction wiring

**Files:**
- Create: `js/app.js`

**Interfaces:**
- Consumes all prior modules.
- Maintains state: `{query, category, status, geometry, selectedProjectId, activeView}`.

- [ ] Load data and fail visibly if integrity errors are present.
- [ ] Populate category/status filters from live project data.
- [ ] Wire search and filters to project results and map visibility.
- [ ] Wire cards and map markers to detail panel.
- [ ] Add Explore/Projects tab behavior and methodology dialog.
- [ ] Preserve all projects in Projects view even when they have null geometry.

### Task 7: README, smoke tests, and packaging

**Files:**
- Create: `README.md`
- Create: `tests/smoke.mjs`

**Interfaces:**
- Smoke test validates required files, JSON parseability, static asset references, and project/feature counts.

- [ ] Document local run command: `python3 -m http.server 8000`.
- [ ] Add smoke test for required assets and data counts.
- [ ] Run `node --test tests/*.test.mjs tests/smoke.mjs`.
- [ ] Start local HTTP server and fetch `index.html`, bundle, and GeoJSON with curl, expecting HTTP 200.
- [ ] Package the folder as `oneida_civic_atlas_mvp.zip`.
