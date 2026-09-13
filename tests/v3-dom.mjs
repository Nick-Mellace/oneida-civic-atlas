// DOM integration checks; this is not a browser engine or a visual/accessibility certification.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const root=new URL('../',import.meta.url),html=readFileSync(new URL('index.html',root),'utf8');
const dom=new JSDOM(html,{url:'https://atlas.example.test/#home',pretendToBeVisual:true});
const {window}=dom;
for(const key of ['window','document','location','history','FormData','Blob'])globalThis[key]=key==='window'?window:window[key];
Object.defineProperty(globalThis,'navigator',{value:window.navigator,configurable:true});
let scrollY=0,downloadCount=0;
window.scrollTo=(_x,y)=>scrollY=y;
Object.defineProperty(window,'scrollY',{get:()=>scrollY});
const realSetInterval=globalThis.setInterval;
globalThis.setInterval=(fn,ms)=>{const t=realSetInterval(fn,ms);t.unref();return t;};
let failMoney=false,failMap=false;
globalThis.fetch=async url=>{
 if((failMoney&&url.includes('money.json'))||(failMap&&url.includes('geojson')))return {ok:false,status:503,json:async()=>{}};
 try{const body=JSON.parse(readFileSync(new URL(url,root),'utf8'));return {ok:true,status:200,json:async()=>body};}catch{return {ok:false,status:404};}
};
URL.createObjectURL=()=>{downloadCount++;return 'blob:https://atlas.example.test/test';};URL.revokeObjectURL=()=>{};
// Download clicks do not navigate in this non-browser test.
const nativeClick=window.HTMLAnchorElement.prototype.click;
window.HTMLAnchorElement.prototype.click=function(){if(!this.hasAttribute('download'))nativeClick.call(this);};
await import('../js/v3-app.js');
const main=()=>document.querySelector('main');
const tick=()=>new Promise(resolve=>setTimeout(resolve,30));
async function go(hash){location.hash=hash;await tick();}
const button=text=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===text);
async function submit(form){form.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));await tick();}
test('home renders all resident entry points with one heading and no arrest promotion',()=>{
 assert.equal(main().querySelectorAll('h1').length,1);assert.match(main().textContent,/What changed/);assert.match(main().textContent,/Around Oneida/);assert.doesNotMatch(main().textContent,/Arrest Blotter/);assert.equal(document.activeElement.tagName,'H1');
});
test('project filtering, deep link and Back restore list state and focus',async()=>{
 await go('#projects');const form=main().querySelector('form');form.elements.query.value='Hotel';await submit(form);
 assert.match(location.hash,/query=Hotel/);assert.equal(main().querySelectorAll('.project-row').length,1);
 const link=main().querySelector('.project-row h2 a');link.focus();link.click();await tick();assert.equal(location.hash,'#project/P003');assert.match(main().querySelector('h1').textContent,/Hotel Oneida/);
 history.back();await tick();assert.match(location.hash,/projects\?query=Hotel/);assert.equal(main().querySelectorAll('.project-row').length,1);assert.equal(document.activeElement.getAttribute('href'),'#project/P003');
 await go('#project/P020');assert.match(main().textContent,/Next official milestone not established/);
});
test('community filters, canceled notice and volunteer signup route are usable',async()=>{
 await go('#community?when=all');assert.ok(main().querySelectorAll('.event-row').length>0);
 await go('#community?type=Open+mic+%2F+karaoke');assert.match(main().textContent,/No verified matches/);
 await go('#opportunity/mchs-volunteer');const official=main().querySelector('a.button');assert.equal(official.href,'https://mchs1900.org/volunteer/');assert.match(main().textContent,/Time commitment/);
 await go('#participate?when=notices');assert.match(main().textContent,/August meeting canceled/);
 await go('#opportunity/council-20260915');assert.match(main().textContent,/Sep 15, 2026, 6:30 PM Eastern/);assert.match(main().textContent,/No specific open decision/);
});
test('money controls replace the chart honestly and CSV download creates a file',async()=>{
 await go('#money');assert.equal(main().querySelectorAll('.donut').length,1);assert.ok(main().querySelector('table caption'));
 const form=main().querySelector('form');form.elements.kind.value='actual';await submit(form);assert.match(main().textContent,/No chart is shown/);assert.equal(main().querySelectorAll('.donut,.trend').length,0);
 await go('#money?year=2024&mode=real');assert.ok(main().querySelector('.trend'));button('Download comparable data (CSV)').click();assert.equal(downloadCount,1);
});
test('contact search routes question to visible official office action',async()=>{
 await go('#contacts?query=water');assert.match(main().textContent,/Water Department/);assert.ok(main().querySelector('.official[href*="water"]'));
});
test('map data failure preserves project list and provides retry',async()=>{
 await go('#projects');failMap=true;document.querySelector('#map-details').open=true;button('Load map').click();await tick();assert.match(main().textContent,/map could not load/);assert.equal(main().querySelectorAll('.project-row').length,20);assert.ok(button('Try loading the map again'));failMap=false;
});
test('keyboard focus targets and form labels exist across primary destinations',async()=>{
 for(const route of ['home','projects','money','community','participate','contacts']){
  await go('#'+route);assert.equal(main().querySelectorAll('h1').length,1);
  for(const input of main().querySelectorAll('input:not([type=hidden]),select,textarea'))assert.ok(input.labels?.length,'Unlabeled '+input.outerHTML);
  assert.ok(document.querySelector('.skip'));assert.ok(document.querySelector('#announcer[aria-live="polite"]'));
 }
});
test('correction action downloads locally and explicitly reports nothing sent',async()=>{
 await go('#corrections');document.querySelector('textarea').value='Test note: organizer URL needs review.';await submit(document.querySelector('#correction-form'));assert.equal(downloadCount,2);assert.match(document.querySelector('#announcer').textContent,/Nothing was sent/);
});
test('unknown routes and broken project links have a recovery destination',async()=>{
 await go('#project/DOES-NOT-EXIST');assert.match(main().textContent,/not found/);assert.ok(main().querySelector('a[href="#projects"]'));
 await go('#unknown');assert.match(main().textContent,/Let’s get you back/);
});
test('one dataset failure leaves the rest of the app navigable',async()=>{
 failMoney=true;await go('#home');await import('../js/v3-app.js?failure-case');
 assert.match(main().textContent,/Budget records/);assert.match(main().textContent,/Around Oneida/);
 await go('#projects');assert.equal(main().querySelectorAll('.project-row').length,20);await go('#money');assert.match(main().textContent,/financial dataset could not be loaded/);
});
