export function displayDate(value) {
 if (!value) return 'Not published';
 const date=new Date(value.length===10 ? `${value}T12:00:00Z` : value);
 return Number.isNaN(date.valueOf()) ? 'Date unresolved' : new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'America/New_York'}).format(date);
}
export function filterDirectory(rows,state={}) {
 const q=(state.query||'').trim().toLowerCase();
 return rows.filter(r=>(!state.jurisdiction||r.jurisdiction===state.jurisdiction)&&(!q||[r.organization,r.responsibility,...(r.questions||[])].join(' ').toLowerCase().includes(q)));
}
export function filterSafety(rows,state={}) {
 const field=state.dateField==='publication_date'?'publication_date':'event_date';
 const q=(state.query||'').trim().toLowerCase(),location=(state.location||'').trim().toLowerCase();
 return rows.filter(r=>r.review_status==='reviewed'&&(!state.type||r.incident_type===state.type)&&(!state.category||r.offense_category===state.category)&&(!state.source||r.source_id===state.source)&&(!state.from||(r[field]&&r[field]>=state.from))&&(!state.to||(r[field]&&r[field].slice(0,10)<=state.to))&&(!location||(r.location_text||'').toLowerCase().includes(location))&&(!q||[r.neutral_summary,r.location_text,r.incident_type,...(r.alleged_offenses||[])].join(' ').toLowerCase().includes(q)));
}
export async function loadCivicData() {
 const files=['directory','sources','channels','meetings','safety','safety-archive'];
 const results=await Promise.all(files.map(async file=>{const response=await fetch(`./data/${file}.json`);if(!response.ok)throw new Error(`${file} unavailable (${response.status})`);return response.json();}));
 return Object.fromEntries(files.map((file,i)=>[file,results[i]]));
}
