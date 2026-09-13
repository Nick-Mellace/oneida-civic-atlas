import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const required = [
  'index.html','css/v3.css','js/v3-app.js','js/v3-core.js','js/v3-views.js','js/v3-money.js','js/v3-info.js','js/map.js',
  'data/app_bundle.json','data/map_features.geojson','data/money.json','data/opportunities.json','README.md'
];

test('required static assets exist and are nonempty', async () => {
  for (const rel of required) {
    const stat = await fs.stat(new URL(rel, root));
    assert.ok(stat.size > 0, `${rel} should be nonempty`);
  }
});

test('data payload counts match verified Step 4 inputs', async () => {
  const bundle = JSON.parse(await fs.readFile(new URL('data/app_bundle.json', root), 'utf8'));
  const geo = JSON.parse(await fs.readFile(new URL('data/map_features.geojson', root), 'utf8'));
  assert.equal(bundle.projects.length, 20);
  assert.equal(geo.features.length, 22);
  assert.equal(geo.features.filter(f => f.geometry !== null).length, 3);
});

test('HTML uses the V3 entry point and map dependency loads only on request', async () => {
  const html = await fs.readFile(new URL('index.html', root), 'utf8');
  assert.match(html, /\.\/css\/v3\.css/);
  assert.match(html, /\.\/js\/v3-app\.js/);
  assert.doesNotMatch(html, /<script[^>]+leaflet/);
  assert.match(html, /id="content"/);
  const app = await fs.readFile(new URL('../js/v3-app.js', import.meta.url), 'utf8');
  assert.match(app, /leaflet@1\.9\.4/);
  assert.match(app, /async function loadMap/);
});
