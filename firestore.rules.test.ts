import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ID_PATTERN,
  sanitizeSlug,
  sanitizeStringList,
  serializeSiteHomePayload,
  serializeProjectPayload,
  serializeProductPayload,
  serializeArticlePayload,
  generateContactMessageId,
  serializeContactMessagePayload,
} from './src/utils/cmsPayloads';
import {
  DEFAULT_BRAND_LOGO_URL,
  DEFAULT_HERO_IMAGE_URL,
  isSafeImageRef,
  sanitizeImageRef,
} from './src/utils/imageMedia';
import {PROJECTS} from './src/data/projects';
import {PRODUCTS} from './src/data/products';
import {ARTICLES} from './src/data/articles';

const mockTimestamps = {createdAt: 'SERVER_TIME', updatedAt: 'SERVER_TIME'};

test('sanitizeSlug blocks path traversal and enforces valid ID pattern', () => {
  assert.equal(ID_PATTERN.test(sanitizeSlug('bad..id/../../hack')), true);
  assert.equal(sanitizeSlug('My New Project 2026!'), 'my-new-project-2026');
  assert.equal(sanitizeSlug('   ', 'fallback-id'), 'fallback-id');
});

test('isSafeImageRef accepts valid paths, https URLs, and raster base64 data URIs while blocking XSS payloads', () => {
  assert.equal(isSafeImageRef(DEFAULT_BRAND_LOGO_URL), true);
  assert.equal(isSafeImageRef('https://example.com/photo.webp'), true);
  assert.equal(isSafeImageRef('data:image/jpeg;base64,/9j/4AAQSkZJRg=='), true);
  assert.equal(isSafeImageRef('data:image/png;base64,iVBORw0KGgo='), true);

  assert.equal(isSafeImageRef(''), false);
  assert.equal(isSafeImageRef('//evil.com/x.png'), false);
  assert.equal(isSafeImageRef('javascript:alert(1)'), false);
  assert.equal(isSafeImageRef('data:text/html,<script>alert(1)</script>'), false);
  assert.equal(isSafeImageRef('data:image/svg+xml;base64,PHN2Zz4='), false);
  assert.equal(
    sanitizeImageRef('javascript:alert(1)', DEFAULT_HERO_IMAGE_URL),
    DEFAULT_HERO_IMAGE_URL
  );
});

test('serializeSiteHomePayload preserves valid custom brandLogoUrl and heroImageUrl and rejects unsafe ones', () => {
  const payload = serializeSiteHomePayload(
    {
      heroEyebrowId: 'Digital Luxury Group',
      heroEyebrowEn: 'Digital Luxury Group',
      heroHeadlineId: 'Judul',
      heroHeadlineEn: 'Headline',
      heroDescriptionId: 'Desc ID',
      heroDescriptionEn: 'Desc EN',
      introTitleId: 'Siapa Kami',
      introTitleEn: 'Who We Are',
      introParagraph1Id: 'P1',
      introParagraph1En: 'P1',
      introParagraph2Id: 'P2',
      introParagraph2En: 'P2',
      ctaHeadlineId: 'CTA',
      ctaHeadlineEn: 'CTA',
      ctaDescriptionId: 'CTA Desc',
      ctaDescriptionEn: 'CTA Desc',
      brandLogoUrl: 'https://cdn.example.com/logo.png',
      heroImageUrl: 'data:image/svg+xml;base64,PHN2Zz4=',
    },
    'admin-uid-1',
    mockTimestamps
  );

  assert.equal(payload.brandLogoUrl, 'https://cdn.example.com/logo.png');
  assert.equal(payload.heroImageUrl, DEFAULT_HERO_IMAGE_URL);
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

test('generateContactMessageId generates valid Firestore document IDs', () => {
  const id = generateContactMessageId();
  assert.equal(ID_PATTERN.test(id), true);
  assert.ok(id.startsWith('msg-'));
  assert.ok(id.length <= 128);
});

test('serializeContactMessagePayload enforces field lengths and schema keys', () => {
  const payload = serializeContactMessagePayload(
    {
      fullName: '  Rani Wijaya  '.repeat(20),
      email: 'rani@example.com',
      subject: 'Subjek Proyek '.repeat(30),
      message: 'Isi pesan panjang '.repeat(400),
    },
    'id',
    '/contact',
    'new',
    mockTimestamps
  );

  assert.ok(payload.fullName.length <= 120);
  assert.ok(payload.email.length <= 200);
  assert.ok(payload.subject.length <= 200);
  assert.ok(payload.message.length <= 4000);
  assert.equal(payload.language, 'id');
  assert.equal(payload.status, 'new');
  assert.deepEqual(Object.keys(payload).sort(), [
    'createdAt',
    'email',
    'fullName',
    'language',
    'message',
    'sourcePath',
    'status',
    'subject',
    'updatedAt',
  ]);
});
