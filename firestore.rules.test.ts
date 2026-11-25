import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ID_PATTERN,
  sanitizeSlug,
  sanitizeStringList,
  serializeProjectPayload,
  serializeProductPayload,
  serializeArticlePayload,
} from './src/utils/cmsPayloads';
import {PROJECTS} from './src/data/projects';
import {PRODUCTS} from './src/data/products';
import {ARTICLES} from './src/data/articles';

const mockTimestamps = {createdAt: 'SERVER_TIME', updatedAt: 'SERVER_TIME'};

test('sanitizeSlug blocks path traversal and enforces valid ID pattern', () => {
  assert.equal(ID_PATTERN.test(sanitizeSlug('bad..id/../../hack')), true);
  assert.equal(sanitizeSlug('My New Project 2026!'), 'my-new-project-2026');
  assert.equal(sanitizeSlug('   ', 'fallback-id'), 'fallback-id');
});

test('serializeProjectPayload enforces max field lengths and bounded arrays', () => {
  const oversizedTechnologies = Array.from({length: 25}, (_, i) => `Tech-${i}`);
  const payload = serializeProjectPayload(
    {
      ...PROJECTS[0],
      technologies: oversizedTechnologies,
      featured: true,
      sortOrder: 9999,
    },
    'admin-uid-1',
    mockTimestamps
  );

  assert.equal(payload.technologies.length, 12);
  assert.equal(payload.sortOrder, 1000);
  assert.equal(payload.featured, true);
  assert.equal(payload.updatedBy, 'admin-uid-1');
});

test('serializeProductPayload enforces capabilities bounds and valid keys', () => {
  const payload = serializeProductPayload(
    {
      ...PRODUCTS[0],
      featured: true,
      capabilities: {
        id: Array.from({length: 20}, (_, i) => `Cap ID ${i}`),
        en: Array.from({length: 20}, (_, i) => `Cap EN ${i}`),
      },
    },
    'admin-uid-1',
    mockTimestamps
  );

  assert.equal(payload.capabilitiesId.length, 12);
  assert.equal(payload.capabilitiesEn.length, 12);
  assert.equal(payload.featured, true);
});

test('serializeArticlePayload clamps readingMinutes and body size', () => {
  const payload = serializeArticlePayload(
    {
      ...ARTICLES[0],
      readingMinutes: 500,
      featured: false,
    },
    'admin-uid-1',
    mockTimestamps
  );

  assert.equal(payload.readingMinutes, 120);
  assert.equal(payload.featured, false);
  assert.ok(payload.sectionBodyId.length <= 6000);
});

test('sanitizeStringList trims empty entries', () => {
  assert.deepEqual(sanitizeStringList([' React ', '', '   ', 'TypeScript'], 5, 50), [
    'React',
    'TypeScript',
  ]);
});
