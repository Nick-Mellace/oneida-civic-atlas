export const TZ = 'America/New_York';
export function localDay(value=new Date()) {
 if(typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
 const d=new Date(value); if(Number.isNaN(+d)) return '';
 return new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
}
export function dateLabel(value,withTime=false){
 if(!value)return 'Date not confirmed';
 const d=new Date(value.length===10?value+'T12:00:00Z':value);
 if(Number.isNaN(+d))return 'Date not confirmed';
 return new Intl.DateTimeFormat('en-US',{timeZone:TZ,month:'short',day:'numeric',year:'numeric',...(withTime&&value.length>10?{hour:'numeric',minute:'2-digit'}:{})}).format(d)+(withTime&&value.length>10?' Eastern':'');
}
export function eventState(r,now=new Date()){
 if(['canceled','postponed','unconfirmed'].includes(r.status))return r.status;
 const today=localDay(now),last=r.end||r.valid_through||r.start;
 if(last && (last.length===10?last<today:new Date(last)<now))return 'past';
 if(r.cadence==='recurring')return r.valid_through?'ongoing':'unconfirmed';
 if(r.cadence==='ongoing')return 'ongoing';
 return r.start?'upcoming':'unconfirmed';
}
export function stale(r,now=new Date(),days=30){return !r.last_checked || (+now-new Date(r.last_checked+'T12:00:00Z'))>days*86400000;}
export function filterOpportunities(rows,s={},now=new Date()){
 return rows.filter(r=>{
  const state=eventState(r,now),text=[r.title,r.description,r.organizer,...(r.tags||[])].join(' ').toLowerCase();
  if(s.query&&!text.includes(s.query.toLowerCase().trim()))return false;
  if(s.type&&!(r.tags||[]).includes(s.type)&&r.type!==s.type)return false;
  if(s.cost&&r.cost_kind!==s.cost)return false;
  if(s.commitment&&(!Number.isFinite(r.commitment_minutes)||r.commitment_minutes>Number(s.commitment)))return false;
  if(s.scope==='volunteer'&&r.type!=='volunteer')return false;
  if(s.scope==='civic'&&r.type!=='civic')return false;
  if(s.when==='archive')return state==='past';
  if(s.when==='all')return true;
  if(s.when==='notices')return ['canceled','postponed','unconfirmed'].includes(state);
  if(!['upcoming','ongoing'].includes(state))return false;
  if(stale(r,now,r.type==='civic'?7:30)&&s.when!=='all')return false;
  if(s.when==='week'){
   if(!r.start)return false;
   const day=localDay(r.start),last=localDay(r.end||r.valid_through||r.start),end=localDay(new Date(+now+7*86400000));
   return last>=localDay(now)&&day<=end;
  }
  return true;
 }).sort((a,b)=>Number(b.geographic_scope==='City of Oneida')-Number(a.geographic_scope==='City of Oneida')||(a.start||'9999').localeCompare(b.start||'9999')||(a.title||'').localeCompare(b.title||''));
}
export async function loadCollections(names,fetcher=fetch){
 const results=await Promise.allSettled(names.map(async name=>{
  const r=await fetcher('./data/'+name+'.json',{signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error(name);return r.json();
 }));
 const data={errors:[]};results.forEach((r,i)=>{data[names[i]]=r.status==='fulfilled'?r.value:[];if(r.status==='rejected')data.errors.push(names[i]);});return data;
}
export function moneyValue(value,total,mode='nominal',cpi,baseCpi){
 if(!Number.isFinite(value))return null;
 if(mode==='real')return cpi>0&&baseCpi>0?value*baseCpi/cpi:null;
 if(mode==='share')return total>0?100*value/total:null;
 return value;
}
export function lineSegments(points){const out=[];for(const p of points){if(!Number.isFinite(p.value))continue;const last=out.at(-1);if(!last||p.year!==last.at(-1).year+1)out.push([p]);else last.push(p);}return out;}
export function officialMilestone(p){const t=p.next_milestone||'';return /^(verify|track|monitor|determine|acquire|build a verified|publish project-by-project)/i.test(t)?null:t||null;}
export const dollars=value=>Number.isFinite(value)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value):'Not established';
export function sourceTitle(url){
 try{const u=new URL(url);const path=decodeURIComponent(u.pathname);if(path.toLowerCase().endsWith('.pdf'))return path.split('/').at(-1).replace(/\.pdf$/i,'');
 const names={'agendas_meetings.php':'City meeting agendas, packets and minutes','dri.php':'City Downtown Revitalization Initiative','bids_rfps.php':'City bids and requests for proposals','audited_financial_reports.php':'City audited financial reports','legal_notices.php':'City legal notices'};
 const parts=path.split('/').filter(Boolean),file=parts.at(-1),fallback=(file==='index.php'?parts.at(-2):file)?.replaceAll('_',' ').replace(/\.php$/,'');
 return names[file]||fallback?.replace(/^./,c=>c.toUpperCase())||u.hostname;
 }catch{return 'Official record';}
}
export function safeUrl(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:'#about';}catch{return '#about';}}
