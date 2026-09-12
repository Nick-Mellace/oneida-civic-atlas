import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProjects, getGeometryLabel } from '../js/filters.js';

const projects = [
  { project_id:'P1', project_name:'Veterans Memorial', category:'Parks', status:'DESIGN', jurisdiction:'City', lead_entity:'City', verified_location:'North Main', open_questions:'Bid date?' },
  { project_id:'P2', project_name:'Citywide finance', category:'Finance', status:'IMPLEMENTATION', jurisdiction:'City', lead_entity:'Comptroller', verified_location:'Citywide', open_questions:'Audit?' },
];
const features = new Map([
  ['P1', [{ geometry:{type:'Point'}, properties:{geometry_status:'mapped_point', feature_kind:'project_site'} }]],
  ['P2', [{ geometry:null, properties:{geometry_status:'nonspatial_citywide', feature_kind:'nonspatial_or_citywide'} }]],
]);

test('text search spans project fields', () => {
  assert.deepEqual(filterProjects(projects, features, {query:'north'}).map(p=>p.project_id), ['P1']);
});

test('category and status filters combine', () => {
  assert.deepEqual(filterProjects(projects, features, {category:'Finance', status:'IMPLEMENTATION'}).map(p=>p.project_id), ['P2']);
});

test('mapped geometry filter only returns plotted projects', () => {
  assert.deepEqual(filterProjects(projects, features, {geometry:'mapped'}).map(p=>p.project_id), ['P1']);
});

test('pending geometry filter includes citywide/nonspatial records', () => {
  assert.deepEqual(filterProjects(projects, features, {geometry:'pending'}).map(p=>p.project_id), ['P2']);
});

test('geometry labels distinguish map states', () => {
  assert.equal(getGeometryLabel(features.get('P1')), 'Verified on map');
  assert.equal(getGeometryLabel(features.get('P2')), 'Citywide / non-spatial');
  assert.equal(getGeometryLabel([]), 'Map geometry pending');
});
