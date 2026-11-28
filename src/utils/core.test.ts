import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_LANGUAGE, resolveInitialLanguage, getLocalizedText} from './i18n';
import {
  filterProjectsByCategory,
  filterArticlesByCategory,
  getRelatedArticles,
  filterProductsByCategory,
  filterServicesByDivision,
} from './filters';
import {validateContactForm, buildWhatsAppInquiryUrl} from './validation';
import {
  DEFAULT_BRAND_LOGO_URL,
  DEFAULT_HERO_IMAGE_URL,
  isSafeImageRef,
  sanitizeImageRef,
} from './imageMedia';
import {serializeSiteHomePayload} from './cmsPayloads';
import {
  computeStaggerDelayMs,
  getEntranceTimings,
  isElementInRevealRange,
  shouldPlayInitialEntrance,
} from './entrance';
import type {ArticleItem, ProductItem, ProjectItem, ServiceItem} from '../types';

test('resolveInitialLanguage defaults to Indonesian and accepts valid codes', () => {
  assert.equal(DEFAULT_LANGUAGE, 'id');
  assert.equal(resolveInitialLanguage(null), 'id');
  assert.equal(resolveInitialLanguage(undefined), 'id');
  assert.equal(resolveInitialLanguage('fr'), 'id');
  assert.equal(resolveInitialLanguage('en'), 'en');
  assert.equal(resolveInitialLanguage('id'), 'id');
});

test('getLocalizedText returns matching language text', () => {
  const sample = {id: 'Teknologi', en: 'Technology'};
  assert.equal(getLocalizedText(sample, 'id'), 'Teknologi');
  assert.equal(getLocalizedText(sample, 'en'), 'Technology');
});

test('filterProjectsByCategory filters accurately', () => {
  const projects = [
    {id: '1', category: 'Website'},
    {id: '2', category: 'Networking'},
    {id: '3', category: 'Website'},
  ] as ProjectItem[];

  assert.equal(filterProjectsByCategory(projects, 'All').length, 3);
  assert.equal(filterProjectsByCategory(projects, 'Website').length, 2);
  assert.equal(filterProjectsByCategory(projects, 'Networking').length, 1);
  assert.equal(filterProjectsByCategory(projects, 'Software').length, 0);
});

test('filterArticlesByCategory and getRelatedArticles behave deterministically', () => {
  const articles = [
    {id: 'a1', slug: 'one', category: 'Software'},
    {id: 'a2', slug: 'two', category: 'Networking'},
    {id: 'a3', slug: 'three', category: 'Software'},
    {id: 'a4', slug: 'four', category: 'Hardware'},
  ] as ArticleItem[];

  assert.equal(filterArticlesByCategory(articles, 'Software').length, 2);
  const related = getRelatedArticles(articles, 'one', 2);
  assert.equal(related.length, 2);
  assert.equal(related[0].slug, 'three');
  assert.equal(related.some((item) => item.slug === 'one'), false);
});

test('filterProductsByCategory and filterServicesByDivision filter cleanly', () => {
  const products = [
    {id: 'p1', category: 'Software'},
    {id: 'p2', category: 'Digital Tools'},
  ] as ProductItem[];
  assert.equal(filterProductsByCategory(products, 'Digital Tools').length, 1);

  const services = [
    {id: 's1', divisionId: 'dilux-development'},
    {id: 's2', divisionId: 'dilux-creative'},
  ] as ServiceItem[];
  assert.equal(filterServicesByDivision(services, 'dilux-creative').length, 1);
});

test('validateContactForm catches invalid inputs and passes valid inputs', () => {
  const invalid = validateContactForm(
    {fullName: 'A', email: 'bad-email', subject: 'Hi', message: 'short'},
    'id'
  );
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.subject);
  assert.ok(invalid.errors.message);

  const valid = validateContactForm(
    {
      fullName: 'Budi Santoso',
      email: 'budi@example.com',
      subject: 'Kolaborasi Pengembangan Web',
      message: 'Kami ingin mendiskusikan pembuatan aplikasi web korporasi.',
    },
    'id'
  );
  assert.equal(valid.isValid, true);
  assert.deepEqual(valid.errors, {});
});

test('buildWhatsAppInquiryUrl encodes official number and message payload', () => {
  const url = buildWhatsAppInquiryUrl(
    {
      fullName: 'Rina',
      email: 'rina@example.com',
      subject: 'Infrastruktur Jaringan',
      message: 'Halo, kami butuh konsultasi jaringan kantor.',
    },
    'en'
  );
  assert.ok(url.startsWith('https://wa.me/6285900423380?text='));
  assert.ok(url.includes('Rina'));
  assert.ok(url.includes('Infrastruktur%20Jaringan'));
});

test('validateContactForm rejects oversized fields beyond database limits', () => {
  const oversized = validateContactForm(
    {
      fullName: 'A'.repeat(125),
      email: `${'a'.repeat(195)}@example.com`,
      subject: 'S'.repeat(205),
      message: 'M'.repeat(4010),
    },
    'en'
  );
  assert.equal(oversized.isValid, false);
  assert.ok(oversized.errors.fullName);
  assert.ok(oversized.errors.email);
  assert.ok(oversized.errors.subject);
  assert.ok(oversized.errors.message);
});

test('isSafeImageRef and sanitizeImageRef allow raster/URLs and reject dangerous URIs', () => {
  assert.equal(isSafeImageRef(DEFAULT_BRAND_LOGO_URL), true);
  assert.equal(isSafeImageRef('https://cdn.diluxgroup.my.id/logo.webp'), true);
  assert.equal(isSafeImageRef('data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='), true);

  assert.equal(isSafeImageRef('data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='), false);
  assert.equal(isSafeImageRef('javascript:alert(1)'), false);
  assert.equal(isSafeImageRef('//evil.example/img.png'), false);
  assert.equal(isSafeImageRef(''), false);

  assert.equal(
    sanitizeImageRef('data:image/svg+xml;base64,PHN2Zz4=', DEFAULT_HERO_IMAGE_URL),
    DEFAULT_HERO_IMAGE_URL
  );
});

test('serializeSiteHomePayload preserves valid brandLogoUrl/heroImageUrl and falls back on unsafe URLs', () => {
  const safePayload = serializeSiteHomePayload(
    {
      heroEyebrowId: 'E',
      heroEyebrowEn: 'E',
      heroHeadlineId: 'H',
      heroHeadlineEn: 'H',
      heroDescriptionId: 'D',
      heroDescriptionEn: 'D',
      introTitleId: 'T',
      introTitleEn: 'T',
      introParagraph1Id: 'P1',
      introParagraph1En: 'P1',
      introParagraph2Id: 'P2',
      introParagraph2En: 'P2',
      ctaHeadlineId: 'CH',
      ctaHeadlineEn: 'CH',
      ctaDescriptionId: 'CD',
      ctaDescriptionEn: 'CD',
      brandLogoUrl: 'javascript:alert(1)',
      heroImageUrl: 'https://diluxgroup.my.id/hero.jpg',
    },
    'admin-uid-1',
    {createdAt: 'CREATED', updatedAt: 'UPDATED'}
  );
  assert.equal(safePayload.brandLogoUrl, DEFAULT_BRAND_LOGO_URL);
  assert.equal(safePayload.heroImageUrl, 'https://diluxgroup.my.id/hero.jpg');
});

test('shouldPlayInitialEntrance, getEntranceTimings, and computeStaggerDelayMs enforce restraint and accessibility', () => {
  assert.equal(
    shouldPlayInitialEntrance({reducedMotion: false, alreadySeen: false, search: ''}),
    true
  );
  assert.equal(
    shouldPlayInitialEntrance({reducedMotion: true, alreadySeen: false, search: ''}),
    false
  );
  assert.equal(
    shouldPlayInitialEntrance({reducedMotion: false, alreadySeen: true, search: ''}),
    false
  );
  assert.equal(
    shouldPlayInitialEntrance({reducedMotion: false, alreadySeen: false, search: '?skipIntro=1'}),
    false
  );

  const activeTimings = getEntranceTimings(true);
  assert.ok(activeTimings.curtainTotalMs <= 1200);
  assert.equal(getEntranceTimings(false).curtainTotalMs, 0);

  assert.equal(computeStaggerDelayMs(0, 100, 75, 420), 100);
  assert.equal(computeStaggerDelayMs(3, 100, 75, 420), 325);
  assert.equal(computeStaggerDelayMs(99, 100, 75, 420), 420);
});

test('isElementInRevealRange defers below-viewport elements and reveals visible or scrolled-past elements', () => {
  assert.equal(isElementInRevealRange(1200, 1500, 900, 36), false);
  assert.equal(isElementInRevealRange(890, 1100, 900, 36), false);
  assert.equal(isElementInRevealRange(864, 1100, 900, 36), true);
  assert.equal(isElementInRevealRange(200, 500, 900, 36), true);
  assert.equal(isElementInRevealRange(-400, -100, 900, 36), true);
});
