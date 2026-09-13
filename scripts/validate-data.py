import json,hashlib
from pathlib import Path
from jsonschema import Draft202012Validator,FormatChecker
root=Path(__file__).resolve().parents[1]
schema=json.loads((root/'schemas/civic.schema.json').read_text())
for key in schema['$defs']:
 rows=json.loads((root/f'data/{key}.json').read_text())
 validator=Draft202012Validator({'$schema':schema['$schema'],**schema['$defs'][key]},format_checker=FormatChecker())
 for row in rows:validator.validate(row)
 assert len({r['id'] for r in rows})==len(rows),key
 print(f'{key}: {len(rows)} records valid')
for file,digest in json.loads((root/'docs/v2/baseline-hashes.json').read_text()).items():
 assert hashlib.sha256((root/file).read_bytes()).hexdigest()==digest,file
print('Original project and geographic data unchanged.')
