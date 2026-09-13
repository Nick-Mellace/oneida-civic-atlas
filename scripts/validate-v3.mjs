import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const read=n=>JSON.parse(readFileSync(new URL('../data/'+n,import.meta.url)));
const projects=read('app_bundle.json').projects,geo=read('map_features.geojson'),opportunities=read('opportunities.json'),money=read('money.json');
assert.equal(projects.length,20);assert.equal(new Set(projects.map(p=>p.project_id)).size,20);assert.equal(geo.features.length,22);
assert.equal(new Set(opportunities.map(x=>x.id)).size,opportunities.length);
const required=['id','title','description','type','tags','organizer','venue','address','geographic_scope','start','end','cadence','status','cost_kind','cost','registration','registration_deadline','age_restrictions','family_suitability','setting','accessibility','eligibility','commitment_minutes','faith_component','source_url','source_title','additional_sources','last_checked','related_projects'];
for(const r of opportunities){for(const k of required)assert.ok(k in r,r.id+' missing '+k);assert.match(r.source_url,/^https:\/\//);assert.match(r.last_checked,/^\d{4}-\d{2}-\d{2}$/);assert.ok(['culture','faith','volunteer','civic'].includes(r.type));if(r.cadence==='recurring'&&r.status!=='unconfirmed'){assert.ok(r.valid_through);assert.ok(r.schedule_note);}if(r.cost_kind==='free')assert.ok(r.cost);for(const id of r.related_projects)assert.ok(projects.some(p=>p.project_id===id));if(r.type==='volunteer')assert.ok(r.signup_url);}
for(const y of money.years){assert.equal(y.values.reduce((a,b)=>a+b,0),y.total);assert.equal(y.values.length,money.categories.length);assert.equal(y.kind,'adopted');assert.match(y.page,/PDF page 15/);}
for(const n of ['v3-source-notes.md','v3-handoff.md','v3-verification.md'])assert.ok(existsSync(new URL('../docs/'+n,import.meta.url)),'Missing handoff '+n);
for(const name of ['app_bundle.json','map_features.geojson']){const file=readFileSync(new URL('../data/'+name,import.meta.url));console.log(name+' SHA-256 '+createHash('sha256').update(file).digest('hex'));}
console.log(`Validated ${projects.length} projects, ${geo.features.length} map features, ${opportunities.length} unique opportunity records, and ${money.years.length} reconciled budget years.`);
