import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {communityPins,communityMapHTML,venuePopupHTML,historyHTML,photoHTML} from '../js/v4-content.js';
import {eventHTML,communityHTML,homeHTML} from '../js/v3-views.js';
import {filterOpportunities,loadCollections,eventState} from '../js/v3-core.js';
const root=new URL('../',import.meta.url),read=n=>JSON.parse(readFileSync(new URL('data/'+n+'.json',root)));
const data=Object.fromEntries(['opportunities','venues','media','discovery','app_bundle'].map(n=>[n,read(n)]));
const now=new Date('2026-09-14T12:00:00-04:00');
test('event stamps use the Eastern record date, including UTC crossing midnight',()=>{
 const event={...data.opportunities[0],start:'2026-09-18T01:00:00Z',end:'2026-09-18T02:00:00Z'};
 const html=eventHTML(event,false,now);
 assert.match(html,/date-stamp" aria-hidden="true">17<small>Sep 2026/);
 assert.match(html,/Sep 17, 2026, 9:00 PM Eastern/);
 assert.doesNotMatch(eventHTML(data.opportunities.find(r=>r.id==='mansion-volunteer')),/BY|ARRANGEMENT|<small>/);
});
test('map uses exactly the filtered records; expired, canceled and stale listings do not leak into upcoming',()=>{
 const tour=data.opportunities.find(r=>r.id==='mansion-tunnels-20260917');
 const variants=[tour,{...tour,id:'canceled',status:'canceled'},{...tour,id:'stale',last_checked:'2025-01-01'},{...tour,id:'past',end:'2026-09-13T12:00:00-04:00'}];
 const filtered=filterOpportunities(variants,{},now);
 assert.deepEqual(communityPins(filtered,data.venues).flatMap(p=>p.events.map(r=>r.id)),[tour.id]);
 const notices=filterOpportunities(variants,{when:'notices'},now);
 assert.match(venuePopupHTML(communityPins(notices,data.venues)[0]),/canceled/);
 assert.equal(eventState(tour,new Date('2026-09-17T20:00:00-04:00')),'past');
});
test('volunteer filter shows the same museum venue and a real official application route',()=>{
 const rows=filterOpportunities(data.opportunities,{scope:'volunteer'},now),pins=communityPins(rows,data.venues);
 assert.equal(pins.length,1);assert.deepEqual(pins[0].events.map(x=>x.id),['mansion-volunteer']);
 assert.match(venuePopupHTML(pins[0]),/https:\/\/www.oneidacommunity.org\/volunteer-internships/);
 assert.ok(rows.some(r=>r.id==='mchs-volunteer'));
 assert.match(communityMapHTML(rows,data.venues),/without a verified location stay in the list/);
});
test('unverified, missing and invalid venue coordinates never become markers',()=>{
 const rows=data.opportunities,venue=data.venues[0];
 for(const invalid of [{...venue,verified:false},{...venue,latitude:NaN},{...venue,longitude:181},{...venue,coordinate_source:null}]){
  assert.equal(communityPins(rows,[invalid]).length,0);
 }
 assert.match(communityMapHTML(rows,[]),/No verified venue points/);
 assert.equal(communityPins([{...rows[0],organizer:venue.name}],data.venues).length,0);
});
test('map popup escapes untrusted titles and prevents script URLs',()=>{
 const pin={venue:data.venues[0],events:[{...data.opportunities[0],title:'<img onerror=boom>',signup_url:'javascript:boom()'}]};
 assert.doesNotMatch(venuePopupHTML(pin),/<img|href="javascript:/);
});
test('photo credits include licensed sources and responsive nonfabricated assets',()=>{
 for(const m of data.media){assert.ok(m.creator&&m.original_url&&m.license_url&&m.restrictions&&m.taken&&m.last_checked);const html=photoHTML(data.media,m.id);assert.match(html,/srcset=/);assert.match(html,/loading="lazy"/);assert.match(html,/CC BY-SA 4.0/);assert.match(html,/referrerpolicy="no-referrer"/);}
 assert.match(homeHTML(data,now),/fetchpriority="high"/);
 assert.equal(photoHTML([], 'mansion'),'');
});
test('history distinguishes living Nation, City, religious society and research-based controversy',()=>{
 const html=historyHTML(data);
 for(const term of ['living sovereign nation','1901','Perfectionism','complex marriage','stirpiculture','15468508','madisoncounty.ny.gov/328/Oneida','oneidaindiannation.com','mchs1900.org'])assert.ok(html.includes(term),term);
 assert.match(html,/permission has not been established/);
 assert.match(communityHTML(data,{type:'History'}),/<option value="History" selected>History<\/option>/);
});
test('discovery registry states coverage gaps and does not invent social accounts',()=>{
 assert.ok(data.discovery.some(r=>r.city_source&&r.name==='Pexton Memorials'));
 for(const r of data.discovery)assert.ok(r.gap&&r.last_checked&&r.website);
 assert.match(communityHTML(data),/not complete business or event coverage/);
});
test('optional V4 data failures preserve existing project and event views',async()=>{
 const result=await loadCollections(['opportunities','venues','media'],async url=>({ok:url.includes('opportunities'),json:async()=>data.opportunities}));
 assert.ok(result.opportunities.length);assert.deepEqual(result.venues,[]);
 assert.match(communityHTML({...data,...result}),/No verified venue points/);
 assert.match(homeHTML({...data,...result},now),/What changed/);
});
test('deployment continues to exclude dependencies, repository metadata and secrets',()=>{
 const ignore=readFileSync(new URL('.assetsignore',root),'utf8').split(/\r?\n/);
 for(const path of ['node_modules/','.git/','.github/','.wrangler/','.dev.vars*','.env*','tests/','scripts/','package.json','package-lock.json'])assert.ok(ignore.includes(path),path);
 const config=JSON.parse(readFileSync(new URL('wrangler.jsonc',root)));
 assert.equal(config.name,'oneida-civic-atlas');assert.equal(config.assets.directory,'.');
 assert.equal(config.routes,undefined);assert.equal(config.workers_dev,undefined);
});
