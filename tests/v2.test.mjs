import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeometryLabel } from '../js/filters.js';
import { projectDetailHTML } from '../js/render.js';
import * as civic from '../js/civic.js';
test('missing geometry is never treated as verified',()=>assert.equal(getGeometryLabel([{properties:{}}]),'Map geometry pending'));
test('project details disclose evidence gaps and parcel qualifications',()=>{
 const html=projectDetailHTML({project_id:'P',project_name:'Example',source_gap:'Exact ledger missing',geography_detail:'Parcel verified; polygon pending'},[]);
 assert.ok(html.includes('Exact ledger missing'));assert.ok(html.includes('Parcel verified; polygon pending'));
});
test('safety search excludes unreviewed records and combines filters',()=>{
 assert.equal(typeof civic.filterSafety,'function');
 const base={review_status:'reviewed',event_date:'2026-08-26',publication_date:'2026-09-04',incident_type:'arrest',offense_category:'Traffic',location_text:null,neutral_summary:'Police reported a traffic arrest.',source_id:'opd-blotters'};
 const rows=[base,{...base,review_status:'pending'},{...base,event_date:null}];
 assert.equal(civic.filterSafety(rows,{from:'2026-08-01',to:'2026-08-31',type:'arrest',category:'Traffic',source:'opd-blotters'}).length,1);
 assert.equal(civic.filterSafety(rows,{location:'Oneida'}).length,0);
 assert.equal(civic.filterSafety(rows,{dateField:'publication_date',from:'2026-09-01'}).length,2);
});
test('directory search matches resident questions and jurisdiction',()=>{
 assert.equal(typeof civic.filterDirectory,'function');
 assert.equal(civic.filterDirectory([{organization:'Public Works',questions:['pothole'],jurisdiction:'City'}],{query:'pothole',jurisdiction:'City'}).length,1);
});
test('date-only display never shifts to the prior day',()=>{
 assert.equal(typeof civic.displayDate,'function');assert.match(civic.displayDate('2026-09-15'),/15/);
});
