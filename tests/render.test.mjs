import test from 'node:test';
import assert from 'node:assert/strict';
import { projectCardHTML, projectDetailHTML, sourceLinks, escapeHTML } from '../js/render.js';

const project = {
  project_id:'P002', project_name:'Veterans <Memorial>', category:'Parks / Development', status:'DESIGN',
  status_reason:'30% design completed.', verified_location:'Veterans Memorial Field', verified_address:'360 North Main Street',
  jurisdiction:'City + State', lead_entity:'City', estimated_cost:1760000, committed_funding:1059000,
  funding_sources:'DRI award', next_milestone:'Final design/state review.', blockers:'Scope alignment', public_concerns:'Scale and cost',
  government_response:'Special DRI meeting', civic_opportunity:'Compare design and bids', confidence:'HIGH', geo_confidence:'HIGH',
  open_questions:'Obtain final design estimate.', last_verified_date:'2026-09-12',
  source_urls:'https://example.com/a | https://example.com/b'
};
const features = [{ geometry:{type:'Point'}, properties:{geometry_status:'mapped_point', address:'360 North Main Street'} }];

test('escapeHTML protects generated markup', () => {
  assert.equal(escapeHTML('<script>'), '&lt;script&gt;');
});

test('sourceLinks parses pipe-delimited sources', () => {
  assert.equal(sourceLinks(project.source_urls).length, 2);
});

test('project card shows status, geometry, and confidence', () => {
  const html = projectCardHTML(project, features);
  assert.match(html, /DESIGN/);
  assert.match(html, /Verified on map/);
  assert.match(html, /Research: HIGH/);
  assert.doesNotMatch(html, /<Memorial>/);
});

test('project detail distinguishes cost and committed funding', () => {
  const html = projectDetailHTML(project, features);
  assert.match(html, /Estimated cost/);
  assert.match(html, /Committed funding/);
  assert.match(html, /\$1,760,000/);
  assert.match(html, /\$1,059,000/);
  assert.match(html, /Open questions/);
});
