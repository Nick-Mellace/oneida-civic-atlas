import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { validateAtlasData } from '../js/data.js';

const bundle = JSON.parse(await fs.readFile(new URL('../data/app_bundle.json', import.meta.url), 'utf8'));
const geo = JSON.parse(await fs.readFile(new URL('../data/map_features.geojson', import.meta.url), 'utf8'));

test('source dataset has 20 unique projects', () => {
  assert.equal(bundle.projects.length, 20);
  assert.equal(new Set(bundle.projects.map(p => p.project_id)).size, 20);
});

test('source geography has 22 features', () => {
  assert.equal(geo.features.length, 22);
});

test('every feature references an existing project', () => {
  const ids = new Set(bundle.projects.map(p => p.project_id));
  for (const feature of geo.features) assert.ok(ids.has(feature.properties.project_id));
});

test('validation reports no integrity errors', () => {
  assert.deepEqual(validateAtlasData(bundle.projects, geo.features), []);
});
