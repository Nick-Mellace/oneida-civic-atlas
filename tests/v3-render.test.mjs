import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {homeHTML,projectsHTML,projectHTML,communityHTML,opportunityHTML} from '../js/v3-views.js';
import {moneyHTML,methodologyHTML} from '../js/v3-money.js';
import {contactsHTML,archiveHTML,correctionsHTML,aboutHTML} from '../js/v3-info.js';
import {filterOpportunities} from '../js/v3-core.js';
const read=n=>JSON.parse(readFileSync(new URL('../data/'+n+'.json',import.meta.url)));
const data=Object.fromEntries(['app_bundle','opportunities','money','directory','sources','channels','safety','safety-archive'].map(n=>[n,read(n)]));
const now=new Date('2026-09-13T12:00:00-04:00');
test('all 20 project briefings expose sources, separate funding and uncertainty',()=>{
 assert.equal(data.app_bundle.projects.length,20);
 for(const p of data.app_bundle.projects){const html=projectHTML(p);assert.match(html,/Copy shareable link/);assert.match(html,/Actual spending/);assert.match(html,/Location confidence/);assert.match(html,/Documentary support/);assert.match(html,/What remains unverified/);assert.doesNotMatch(html,/>Source \d+ /);}
});
test('homepage does not promote arrests and expires old project features',()=>{
 const html=homeHTML(data,now);assert.match(html,/What changed/);assert.match(html,/Around Oneida/);assert.match(html,/Ways to help/);assert.doesNotMatch(html,/blotter|arrestee|Police reported/i);
 assert.match(homeHTML(data,new Date('2030-01-01T12:00Z')),/No dated project actions/);
});
test('single opportunity data supports civic, culture and volunteer views without duplicate ids',()=>{
 const ids=data.opportunities.map(x=>x.id);assert.equal(new Set(ids).size,ids.length);
 const v=data.opportunities.find(r=>r.id==='mchs-volunteer');assert.match(opportunityHTML(v,data),/https:\/\/mchs1900.org\/volunteer\//);assert.match(opportunityHTML(v,data),/Time commitment/);
 assert.equal(filterOpportunities(data.opportunities,{when:'week'},now).some(r=>r.id==='cottage-market-2026'),false);
 assert.equal(filterOpportunities(data.opportunities,{scope:'civic'},now).some(r=>r.status==='canceled'),false);
});
test('event detail preserves unknown accessibility, cost, eligibility and faith context',()=>{
 const r=data.opportunities.find(r=>r.id==='spirit-parish-involvement'),html=opportunityHTML(r,data);
 assert.match(html,/Cost not confirmed/);assert.match(html,/Not confirmed by the organizer/);assert.match(html,/Catholic parish/);assert.match(html,/not a booked shift|membership requirements/);
});
test('all official financial totals reconcile exactly; no actual records fabricated',()=>{
 for(const y of data.money.years){assert.equal(y.values.reduce((a,b)=>a+b,0),y.total);assert.equal(y.kind,'adopted');assert.equal(y.values.length,data.money.categories.length);}
 assert.equal(data.money.years.length,3);
 const actual=moneyHTML(data.money,{kind:'actual'});assert.match(actual,/No chart is shown/);assert.doesNotMatch(actual,/class="donut"|class="trend"/);
});
test('money chart has an accessible table, source page and visible decade gap',()=>{
 const html=moneyHTML(data.money,{});assert.match(html,/<caption>/);assert.match(html,/aria-labelledby="trend-title trend-desc"/);assert.match(html,/2017–2026/);assert.match(html,/PDF page 15/);
 assert.match(moneyHTML(data.money,{year:'2018'}),/No chart is shown/);
 assert.match(moneyHTML(data.money,{year:'2025',mode:'real'}),/annual inflation index for this year is not verified/);
});
test('question routing exposes the official action without needing to open details',()=>{
 const html=contactsHTML(data,{query:'water'});assert.match(html,/Open official office page/);assert.match(html,/Water Department/);assert.doesNotMatch(html,/<details/);
 assert.match(contactsHTML(data,{query:'police'}),/Administrative-office hours are separate/);
});
test('empty states and unsupported source gaps do not pretend to have data',()=>{
 assert.match(projectsHTML(data,{query:'no-such-project-xyz'}),/No projects match/);
 assert.match(communityHTML(data,{type:'Open mic \/ karaoke'}),/No verified matches/);
 assert.match(moneyHTML([],{}),/could not be loaded/);
 assert.match(projectHTML(null),/not found/);
});
test('police archive qualifies allegations and uses Eastern publication timestamps',()=>{
 const html=archiveHTML(data);assert.match(html,/not a complete incident dataset/);assert.match(html,/presumed innocent/);assert.match(html,/nine-entry/);
});
test('correction path explicitly does not send and policy states editorial review',()=>{
 assert.match(correctionsHTML(),/does not send anything/);assert.match(correctionsHTML(),/Download my note/);assert.match(aboutHTML(),/no connected submission inbox, promised response time or automatic publication/);
});
test('generated project text and filters escape HTML and unsafe source URLs',()=>{
 const p={...data.app_bundle.projects[0],project_name:'<img src=x onerror=alert(1)>',source_urls:'javascript:alert(1)',verified_sources:[]};const html=projectHTML(p);
 assert.doesNotMatch(html,/<img|href="javascript:/);assert.match(html,/&lt;img/);
 assert.doesNotMatch(projectsHTML(data,{query:'"><script>alert(1)</script>'}),/<script>/);
});
test('methodology documents accounting basis, double counting and missing crosswalk',()=>{
 const html=methodologyHTML(data.money);assert.match(html,/Budget basis only/);assert.match(html,/crosswalk/);assert.match(html,/overlaps its components/);
});
