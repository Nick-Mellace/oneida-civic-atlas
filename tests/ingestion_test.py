import importlib.util,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('audit',Path(__file__).resolve().parents[1]/'scripts/audit-police.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
class IngestionTests(unittest.TestCase):
 def test_candidates_are_quarantined_and_identity_prefix_removed(self):
  p={'_id':{'$id':'test'},'date':{'sec':1717122768},'title':'Test fixture','status':1,'content':'<p>May 1, 2024:</p><p>- Example Person, 40, of Exampleville, was issued an appearance ticket for littering.</p><p>- A juvenile male, 16, was arrested for trespass.</p>'}
  result=module.audit([p]);self.assertEqual(len(result['candidates']),1);row=result['candidates'][0];self.assertEqual(row['review_status'],'pending');self.assertEqual(row['event_date'],'2024-05-01');self.assertIsNone(row['geometry']);self.assertNotIn('Example',row['neutral_summary']);self.assertEqual(result['excluded_juvenile_lines'],1)
 def test_invalid_date_is_not_guessed(self):
  p={'_id':{'$id':'test'},'date':{'sec':1717122768},'title':'Test fixture','status':1,'content':'<div>February 31, 2024:</div><div>- Example Person was arrested for trespass.</div>'}
  self.assertIsNone(module.audit([p])['candidates'][0]['event_date'])
if __name__=='__main__':unittest.main()
