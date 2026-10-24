import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProject } from '../src/validateProject.js';

const valid = { name: 'Максим', email: 'max+build@example.com', motorcycle: '', projectType: 'Custom Build', message: 'A purposeful cafe racer.' };

test('accepts complete details with Unicode name, plus email and optional model', () => {
  assert.deepEqual(validateProject(valid), {});
});

test('rejects blank required fields and invalid email', () => {
  const errors = validateProject({ name: '  ', email: 'bad@', motorcycle: '', projectType: '', message: '  ' });
  assert.deepEqual(Object.keys(errors), ['name', 'email', 'projectType', 'message']);
});

test('enforces limits and validates project type', () => {
  const errors = validateProject({ ...valid, name: 'A'.repeat(101), motorcycle: 'B'.repeat(121), message: 'C'.repeat(3001), projectType: 'Fake' });
  assert.deepEqual(Object.keys(errors), ['name', 'motorcycle', 'projectType', 'message']);
});
