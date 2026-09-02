import test from 'node:test';
import assert from 'node:assert/strict';

import { GRADE_ORDER, inferAssessmentType, resolveModuleMeta } from './data.js';

test('assessment type is inferred from NCEA level or a school test', () => {
  assert.equal(inferAssessmentType({ zc_Module_Level_as_Words: 'Level One', zc_Module_Title: 'Biology 1.1' }), 'NCEA L1');
  assert.equal(inferAssessmentType({ zc_Module_Level_as_Words: 'Level Two', zc_Module_Title: 'Chemistry 2.7' }), 'NCEA L2');
  assert.equal(inferAssessmentType({ zc_Module_Level_as_Words: 'Level Three', zc_Module_Title: 'Physics 3.1' }), 'NCEA L3');
  assert.equal(inferAssessmentType({ zc_Module_Level_as_Words: '', zc_Module_Title: 'Written Test' }), 'Test');
  assert.equal(inferAssessmentType({ zc_Module_Level_as_Words: 'Level One', zc_Module_Title: 'Effort Grades' }), null);
  assert.deepEqual(GRADE_ORDER, ['Excellence', 'Merit', 'Achieved', 'Not Achieved']);
});

test('module metadata resolves the module number and short description', () => {
  const lookup = {
    91153: { shortDesc: 'Practical Investigation' },
    91393: { shortDesc: 'Oxidation Reduction' },
  };

  assert.deepEqual(resolveModuleMeta({ zc_Module_Number_AsText: '91153' }, lookup), {
    moduleNumber: '91153',
    shortDesc: 'Practical Investigation',
  });
  assert.deepEqual(resolveModuleMeta({ zc_Module_Number_AsText: '99999' }, lookup), {
    moduleNumber: '99999',
    shortDesc: '',
  });
});
