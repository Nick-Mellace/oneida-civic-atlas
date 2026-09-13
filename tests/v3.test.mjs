import test from 'node:test';
import assert from 'node:assert/strict';
const core = await import('../js/v3-core.js').catch(()=>({}));
const now = new Date('2026-09-13T16:00:00Z');
test('past dated events leave upcoming listings at Eastern end of day',()=>{
 assert.equal(core.eventState?.({start:'2026-09-12',end:'2026-09-12',status:'confirmed'},now),'past');
 assert.equal(core.eventState?.({start:'2026-09-13',end:'2026-09-13',status:'confirmed'},now),'upcoming');
});
test('canceled and postponed records never masquerade as upcoming',()=>{
 assert.equal(core.eventState?.({start:'2026-09-20',status:'canceled'},now),'canceled');
 assert.equal(core.eventState?.({start:'2026-09-20',status:'postponed'},now),'postponed');
});
test('recurring schedules expire without inventing a later occurrence',()=>{
 assert.equal(core.eventState?.({cadence:'recurring',valid_through:'2026-08-25',status:'confirmed'},now),'past');
 assert.equal(core.eventState?.({cadence:'recurring',status:'confirmed'},now),'unconfirmed');
});
test('unknown prices cannot match a free-event filter',()=>{
 assert.deepEqual(core.filterOpportunities?.([{id:'a',cost_kind:'unknown',status:'confirmed',cadence:'ongoing',last_checked:'2026-09-13'},{id:'b',cost_kind:'free',status:'confirmed',cadence:'ongoing',last_checked:'2026-09-13'}],{cost:'free'},now).map(x=>x.id),['b']);
});
test('volunteer commitment filter excludes unknown durations',()=>{
 assert.deepEqual(core.filterOpportunities?.([{id:'a',commitment_minutes:null,cadence:'ongoing',last_checked:'2026-09-13'},{id:'b',commitment_minutes:60,cadence:'ongoing',last_checked:'2026-09-13'}],{commitment:'60'},now).map(x=>x.id),['b']);
});
test('inflation, shares and missing values have distinct behavior',()=>{
 assert.equal(core.moneyValue?.(100,400,'real',100,125),125);
 assert.equal(core.moneyValue?.(100,400,'share'),25);
 assert.equal(core.moneyValue?.(null,400,'nominal'),null);
 assert.equal(core.moneyValue?.(100,400,'real',null,125),null);
});
test('historical line breaks across missing years',()=>{
 assert.deepEqual(core.lineSegments?.([{year:2020,value:1},{year:2021,value:2},{year:2023,value:3}]).map(s=>s.length),[2,1]);
});
test('optional collection failure preserves successful collections',async()=>{
 const result=await core.loadCollections?.(['good','bad'],async url=>({ok:!url.includes('bad'),json:async()=>[1]}));
 assert.deepEqual(result?.good,[1]); assert.deepEqual(result?.bad,[]); assert.deepEqual(result?.errors,['bad']);
});
test('a research instruction is not an official milestone',()=>{
 assert.equal(core.officialMilestone?.({next_milestone:'Verify current construction schedule.'}),null);
 assert.equal(core.officialMilestone?.({next_milestone:'Final design/state review and bid schedule.'}),'Final design/state review and bid schedule.');
});
test('timestamp publication dates display in Eastern time',()=>{
 assert.equal(core.localDay?.('2024-05-31T02:32:48Z'),'2024-05-30');
});
test('next-seven-days includes an event already underway and City records lead regional ones',()=>{
 const ongoing={id:'local',title:'Local festival',type:'culture',geographic_scope:'City of Oneida',start:'2026-09-12T10:00:00-04:00',end:'2026-09-13T16:00:00-04:00',last_checked:'2026-09-13'};
 assert.deepEqual(core.filterOpportunities([ongoing],{when:'week'},now).map(r=>r.id),['local']);
 const regional={...ongoing,id:'regional',title:'A regional festival',geographic_scope:'Regional'};
 assert.deepEqual(core.filterOpportunities([regional,ongoing],{},now).map(r=>r.id),['local','regional']);
});
