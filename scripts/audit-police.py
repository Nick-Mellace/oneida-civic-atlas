"""Offline audit of an official OCV feed. Produces index and review candidates, never publishes.
Usage: python3 scripts/audit-police.py input.json output-directory
Keep raw inputs and candidates outside the served project root.
"""
import argparse,datetime,hashlib,json,re
from pathlib import Path
from html.parser import HTMLParser
class Text(HTMLParser):
 def __init__(self): super().__init__();self.parts=[]
 def handle_data(self,data): self.parts.append(data)
 def handle_endtag(self,tag):
  if tag in ('p','div','li','br'):self.parts.append('\n')
def audit(payload):
 index=[];candidates=[];skipped=0
 for post in payload:
  if post.get('status')!=1:continue
  pid=post['_id']['$id'];published=datetime.datetime.fromtimestamp(post['date']['sec'],datetime.timezone.utc).isoformat()
  index.append(dict(id=pid,title=post['title'],publication_timestamp=published))
  parser=Text();parser.feed(post.get('content',''));event=None
  for line in ''.join(parser.parts).splitlines():
   line=line.strip().lstrip('•').strip()
   match=re.fullmatch(r'([A-Z][a-z]+ \d{1,2}, \d{4}):?',line)
   if match:
    try:event=datetime.datetime.strptime(match[1],'%B %d, %Y').date().isoformat()
    except ValueError:event=None
   if not line.startswith('- ') or not re.search(r'\bwas (arrested|issued)\b',line):continue
   if re.search(r'juvenile|minor|\b(?:[1-9]|1[0-7]), of\b',line,re.I):skipped+=1;continue
   # Strip subject and residence; preserve no identity in automated candidates.
   action=re.split(r'\bwas ',line,maxsplit=1)[-1]
   # Multi-sentence text can contain incidental identities; require review regardless.
   candidates.append(dict(id=hashlib.sha256((pid+line).encode()).hexdigest()[:20],source_entry_id=pid,event_date=event,publication_timestamp=published,neutral_summary='Police reported that a person was '+action,officially_named_arrestee=None,geometry=None,location_text=None,review_status='pending',review_notes='Candidate only: check date, alleged offenses, incidental identifiers and disposition against source before publication.'))
 return {'publications':index,'candidates':candidates,'excluded_juvenile_lines':skipped}
if __name__=='__main__':
 args=argparse.ArgumentParser();args.add_argument('input');args.add_argument('output');a=args.parse_args();out=Path(a.output).resolve();root=Path(__file__).resolve().parents[1]
 if out==root or root in out.parents:raise SystemExit('Output must be outside the served repository.')
 out.mkdir(parents=True,exist_ok=True);raw=Path(a.input).read_bytes();result=audit(json.loads(raw));result['input_sha256']=hashlib.sha256(raw).hexdigest()
 (out/'audit.json').write_text(json.dumps(result,indent=2));print(json.dumps({'publications':len(result['publications']),'pending_candidates':len(result['candidates']),'excluded_juvenile_lines':result['excluded_juvenile_lines'],'input_sha256':result['input_sha256']}))
