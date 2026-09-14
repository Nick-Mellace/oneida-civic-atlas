import {communityPins,venuePopupHTML} from './v4-content.js?v=4.1';
let pending;
export async function loadLeaflet(){
 if(window.L)return window.L;
 if(pending)return pending;
 pending=new Promise((resolve,reject)=>{
  if(!document.querySelector('[data-atlas-map-css]')){
   const css=document.createElement('link');css.dataset.atlasMapCss='';css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';css.integrity='sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';css.crossOrigin='';document.head.append(css);
  }
  const script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.integrity='sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';script.crossOrigin='';
  const timer=setTimeout(()=>{script.remove();reject(new Error('Map library timed out'));},15000);
  script.onload=()=>{clearTimeout(timer);window.L?resolve(window.L):reject(new Error('Map library unavailable'));};
  script.onerror=()=>{clearTimeout(timer);script.remove();reject(new Error('Map library unavailable'));};
  document.head.append(script);
 }).catch(error=>{pending=null;throw error;});
 return pending;
}
export function createCommunityMap(target,rows,venues){
 const L=window.L,pins=communityPins(rows,venues);
 const canvas=document.createElement('div');canvas.id='community-map';canvas.setAttribute('aria-label','Community venues');target.replaceChildren(canvas);
 const status=document.createElement('p');status.className='fine';status.setAttribute('role','status');status.textContent='Choose a numbered venue to see matching activities and organizer links.';target.append(status);
 const raw=L.map(canvas,{scrollWheelZoom:false}).setView([43.06034,-75.60462],14);
 const tile=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'}).addTo(raw);
 tile.on('tileerror',()=>{status.textContent='Some map tiles are unavailable. Venue buttons and the complete activity list still work.';});
 const group=L.featureGroup().addTo(raw),list=document.createElement('ol');list.className='venue-list';list.setAttribute('aria-label','Mapped venues');target.append(list);
 pins.forEach((pin,i)=>{
  const marker=L.marker([pin.venue.latitude,pin.venue.longitude],{title:pin.venue.name,alt:pin.venue.name,keyboard:true,icon:L.divIcon({className:'venue-marker',html:String(i+1),iconSize:[34,34]})}).addTo(group).bindPopup(venuePopupHTML(pin));
  const li=document.createElement('li'),button=document.createElement('button');button.className='subtle';button.textContent=pin.venue.name+' · '+pin.events.length+' listing'+(pin.events.length===1?'':'s');li.append(button);list.append(li);
  let returnTo=button;
  button.addEventListener('click',()=>{returnTo=button;raw.panTo(marker.getLatLng());marker.openPopup();});
  marker.on('click',()=>{returnTo=marker.getElement();});
  marker.on('popupopen',event=>{const popup=event.popup.getElement();if(popup){popup.onkeydown=key=>{if(key.key==='Escape'){key.preventDefault();key.stopPropagation();raw.closePopup();}};popup.querySelector('a')?.focus();}});
  marker.on('popupclose',()=>{returnTo?.focus({preventScroll:true});});
 });
 if(pins.length)raw.fitBounds(group.getBounds().pad(.2),{maxZoom:15});
 return {raw};
}
