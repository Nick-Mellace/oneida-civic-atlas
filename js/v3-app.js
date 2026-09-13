import {loadCollections,eventState,stale,localDay} from './v3-core.js';
import {homeHTML,projectsHTML,projectHTML,communityHTML,opportunityHTML,intro,e} from './v3-views.js';
import {moneyHTML,methodologyHTML} from './v3-money.js';
import {contactsHTML,safetyHTML,archiveHTML,aboutHTML,downloadsHTML,correctionsHTML} from './v3-info.js';
import {createAtlasMap} from './map.js';
const main=document.querySelector('main'),announce=document.querySelector('#announcer');
const names=['app_bundle','opportunities','money','directory','contact-checks','channels','sources','safety','safety-archive'];
const data=await loadCollections(names);
// Shape failures are isolated just like network failures.
for(const name of names){const valid=name==='app_bundle'?Array.isArray(data[name]?.projects):name==='money'?Array.isArray(data[name]?.years)&&Array.isArray(data[name]?.categories):Array.isArray(data[name]);if(!valid){data[name]=[];if(!data.errors.includes(name))data.errors.push(name);}}
let map=null,mapGeneration=0,currentRoute='',printingDetails=[],lastSignature='';
const saved=new Map();
export function routeFrom(hash){const [path,query='']=(hash.replace(/^#/,'')||'home').split('?');const [view,id]=path.split('/');return {view,id,params:Object.fromEntries(new URLSearchParams(query))};}
function snapshot(){const active=document.activeElement;saved.set(location.hash||'#home',{scroll:window.scrollY,href:active?.getAttribute('href'),id:active?.id});}
function render(restore=true){
 if(location.hash==='#content'){main.focus();return;}
 mapGeneration++;if(map){map.raw.remove();map=null;}
 const {view,id,params}=routeFrom(location.hash),projects=data.app_bundle?.projects||[];
 const aliases={explore:'projects',directory:'contacts',informed:'safety',meetings:'participate'};
 if(aliases[view]){location.replace('#'+aliases[view]);return;}
 const screens={home:()=>homeHTML(data),projects:()=>projectsHTML(data,params),project:()=>projectHTML(projects.find(p=>p.project_id===id)),money:()=>moneyHTML(data.money,params),community:()=>communityHTML(data,params),participate:()=>communityHTML(data,params,true),opportunity:()=>opportunityHTML(data.opportunities.find(r=>r.id===id),data),contacts:()=>contactsHTML(data,params),safety:()=>safetyHTML(data),archive:()=>archiveHTML(data),about:aboutHTML,methodology:()=>methodologyHTML(data.money),downloads:downloadsHTML,corrections:correctionsHTML};
 const labels={app_bundle:'Project records',opportunities:'Community and participation records',money:'Budget records',directory:'Contact guide','contact-checks':'Recent contact checks',channels:'Notification links',sources:'Source registry',safety:'Reviewed police records','safety-archive':'Police-publication index'};
 const errors=data.errors.length?`<p class="error-note" role="status">Some information could not be loaded: ${data.errors.map(n=>labels[n]).join(', ')}. Other sections remain available. <button class="subtle" data-retry>Try loading again</button></p>`:'';
 try{main.innerHTML=errors+(screens[view]?screens[view]():intro('Page not found','Let’s get you back to Oneida.','That address does not match a page in this guide.')+'<a href="#home">Open the homepage →</a>');}catch(err){console.error('View unavailable',view,err);main.innerHTML=errors+intro('Page unavailable','This section could not be displayed.','Other sections remain available. Try another page or reload.')+'<button data-retry>Try again</button>';}
 const primary=view==='project'?'projects':view==='opportunity'?(data.opportunities.find(r=>r.id===id)?.type==='civic'?'participate':'community'):view;
 document.querySelectorAll('.primary a').forEach(a=>{if(a.hash==='#'+primary)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 const heading=main.querySelector('h1');document.title=(heading?.textContent||'Oneida')+' · Oneida Civic Atlas';
 const prior=restore?saved.get(location.hash||'#home'):null;
 if(prior){const candidates=[...main.querySelectorAll('a[href],button,input,select')];const el=candidates.find(x=>prior.id&&x.id===prior.id)||candidates.find(x=>prior.href&&x.getAttribute('href')===prior.href);(el||heading||main).focus({preventScroll:true});window.scrollTo(0,prior.scroll);}else{(heading||main).focus({preventScroll:true});window.scrollTo(0,0);}
 announce.textContent=heading?.textContent||'Page loaded';currentRoute=location.hash;
}
document.addEventListener('click',event=>{
 const a=event.target.closest('a');if(a?.getAttribute('href')==='#content'){event.preventDefault();main.focus();return;}if(a?.getAttribute('href')?.startsWith('#'))snapshot();
 const b=event.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-print'))window.print();
 if(b.hasAttribute('data-retry'))location.reload();
 if(b.hasAttribute('data-copy')){navigator.clipboard?.writeText(location.href).then(()=>{announce.textContent='Shareable link copied.';b.textContent='Link copied';}).catch(()=>{announce.textContent='Copy is unavailable; copy the address from your browser.';b.textContent='Copy the browser address';});if(!navigator.clipboard){b.textContent='Copy the browser address';announce.textContent='Copy the current address from your browser.';}}
 if(b.hasAttribute('data-download-money'))downloadMoney();
 if(b.id==='load-map')loadMap(b);
 if(b.id==='center-map'){if(!navigator.geolocation){announce.textContent='Location is unavailable in this browser.';return;}navigator.geolocation.getCurrentPosition(p=>{map?.raw.setView([p.coords.latitude,p.coords.longitude],15);announce.textContent='Map centered on your location. This does not filter nearby projects.';},()=>{document.querySelector('#map-status').textContent='Location is unavailable or permission was declined. You can still browse the map and the complete project list.';},{timeout:10000,maximumAge:60000});}
});
document.addEventListener('submit',event=>{
 const form=event.target;
 if(form.dataset.filter){event.preventDefault();const params=new URLSearchParams();for(const [k,v] of new FormData(form)){if(v)params.set(k,v);}const hash='#'+form.dataset.filter+(params.size?'?'+params:'');snapshot();if(hash===location.hash)render(false);else location.hash=hash;}
 if(form.id==='correction-form'){event.preventDefault();const note=new FormData(form).get('note');download('oneida-atlas-feedback.txt','text/plain','Oneida Civic Atlas — draft feedback\nPrepared '+localDay()+'\nNot sent automatically.\n\n'+note);announce.textContent='Feedback note downloaded. Nothing was sent.';}
});
function download(name,type,text){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function downloadMoney(){const m=data.money;if(!m?.years){announce.textContent='Budget data is unavailable; no file was generated.';return;}const rows=[['entity','fund','basis','record_type','year','category','nominal_usd','real_2024_usd','share_percent','annual_cpi','base_cpi','source_url','source_page','last_checked']];for(const y of m.years){y.values.forEach((v,i)=>rows.push([m.entity,m.scope,m.basis,y.kind,y.year,m.categories[i],v,m.cpi[y.year]?(v*m.cpi[2024]/m.cpi[y.year]).toFixed(2):'',(100*v/y.total).toFixed(6),m.cpi[y.year]||'',m.cpi[2024],y.source_url,y.page,m.last_checked]));}download('oneida-general-fund-2023-2025.csv','text/csv',rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n'));announce.textContent='Budget data downloaded.';}
async function loadMap(button){
 const generation=mapGeneration;button.disabled=true;button.textContent='Loading map…';const target=document.querySelector('#map-content');
 try{
  const response=await fetch('./data/map_features.geojson',{signal:AbortSignal.timeout(10000)});if(!response.ok)throw new Error('Map data unavailable');const geo=await response.json();if(!Array.isArray(geo.features))throw new Error('Map features unavailable');
  if(!window.L){await new Promise((resolve,reject)=>{const css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';css.integrity='sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';css.crossOrigin='';document.head.append(css);const script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.integrity='sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';script.crossOrigin='';script.onload=resolve;script.onerror=reject;document.head.append(script);});}
  if(generation!==mapGeneration)return;
  target.innerHTML='<div id="atlas-map" aria-label="Limited project map"></div><p id="map-status" class="fine" role="status">Mapped points do not show a complete inventory or ward boundaries.</p><button id="center-map" class="subtle">Center map on my location</button>';
  map=createAtlasMap('atlas-map',id=>{snapshot();location.hash='#project/'+id;});map.setFeatures(geo.features);map.fitVerified();map.raw.eachLayer(layer=>layer.on?.('tileerror',()=>{const status=document.querySelector('#map-status');if(status)status.textContent='Some map tiles are unavailable. The complete project list remains usable.';}));button.hidden=true;
 }catch{if(generation!==mapGeneration)return;target.innerHTML='<p class="empty" role="status">The map could not load. All project records remain available in the list below.</p>';button.disabled=false;button.textContent='Try loading the map again';}
}
window.addEventListener('hashchange',()=>render());
window.addEventListener('beforeprint',()=>{printingDetails=[...document.querySelectorAll('details')].map(d=>[d,d.open]);printingDetails.forEach(([d])=>d.open=true);});
window.addEventListener('afterprint',()=>printingDetails.forEach(([d,open])=>d.open=open));
function timeSignature(){return (data.opportunities||[]).map(r=>r.id+eventState(r)+stale(r,new Date(),r.type==='civic'?7:30)).join('|');}
lastSignature=timeSignature();setInterval(()=>{const next=timeSignature();if(next!==lastSignature){snapshot();render();lastSignature=next;}},60000);
render(false);
