import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);

test('Cloudflare deploys the static site from the repository root', async () => {
  const config = JSON.parse(await fs.readFile(new URL('wrangler.jsonc', root), 'utf8'));

  assert.equal(config.name, 'oneida-civic-atlas');
  assert.equal(config.assets?.directory, '.');
  assert.equal(config.assets?.not_found_handling, 'single-page-application');
});

test('Cloudflare uploads runtime assets but excludes repository-only files', async () => {
  const ignore = await fs.readFile(new URL('.assetsignore', root), 'utf8');

  for (const asset of ['index.html', 'css/', 'js/', 'data/']) {
    assert.match(ignore, new RegExp(`^!${asset.replace('/', '\\/')}`, 'm'));
  }
  for (const privatePath of ['docs/', 'schemas/', 'scripts/', 'tests/']) {
    assert.doesNotMatch(ignore, new RegExp(`^!${privatePath.replace('/', '\\/')}`, 'm'));
  }
});
