import type {
  ArticleCategory,
  ArticleItem,
  ContactFormValues,
  ContactMessageStatus,
  Division,
  DivisionIconName,
  Language,
  ProductCategory,
  ProductItem,
  ProjectCategory,
  ProjectItem,
  ServiceIconName,
  ServiceItem,
} from '../types';

export interface SiteHomeSettings {
  heroEyebrowId: string;
  heroEyebrowEn: string;
  heroHeadlineId: string;
  heroHeadlineEn: string;
  heroDescriptionId: string;
  heroDescriptionEn: string;
  introTitleId: string;
  introTitleEn: string;
  introParagraph1Id: string;
  introParagraph1En: string;
  introParagraph2Id: string;
  introParagraph2En: string;
  ctaHeadlineId: string;
  ctaHeadlineEn: string;
  ctaDescriptionId: string;
  ctaDescriptionEn: string;
}

export const ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export function sanitizeSlug(input: string, fallback = 'item'): string {
  const normalized = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
  return normalized.length > 0 && ID_PATTERN.test(normalized) ? normalized : fallback;
}

export function clampStr(val: string, maxLen: number, fallback = '-'): string {
  const trimmed = val.trim();
  if (!trimmed) {
    return fallback;
  }
  return trimmed.slice(0, maxLen);
}

export function sanitizeStringList(items: string[], maxItems: number, maxItemLen: number): string[] {
  return items
    .map((item) => item.trim().slice(0, maxItemLen))
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
}

export function serializeSiteHomePayload(
  input: SiteHomeSettings,
  uid: string,
  timestamps: {createdAt: unknown; updatedAt: unknown}
) {
  return {
    heroEyebrowId: clampStr(input.heroEyebrowId, 120, 'Digital Luxury Group'),
    heroEyebrowEn: clampStr(input.heroEyebrowEn, 120, 'Digital Luxury Group'),
    heroHeadlineId: clampStr(input.heroHeadlineId, 200, 'Teknologi Melampaui Batas Biasa.'),
    heroHeadlineEn: clampStr(input.heroHeadlineEn, 200, 'Technology Beyond Ordinary.'),
    heroDescriptionId: clampStr(input.heroDescriptionId, 500),
    heroDescriptionEn: clampStr(input.heroDescriptionEn, 500),
    introTitleId: clampStr(input.introTitleId, 150, 'Siapa Kami'),
    introTitleEn: clampStr(input.introTitleEn, 150, 'Who We Are'),
    introParagraph1Id: clampStr(input.introParagraph1Id, 1000),
    introParagraph1En: clampStr(input.introParagraph1En, 1000),
    introParagraph2Id: clampStr(input.introParagraph2Id, 1000),
    introParagraph2En: clampStr(input.introParagraph2En, 1000),
    ctaHeadlineId: clampStr(input.ctaHeadlineId, 200),
    ctaHeadlineEn: clampStr(input.ctaHeadlineEn, 200),
    ctaDescriptionId: clampStr(input.ctaDescriptionId, 500),
    ctaDescriptionEn: clampStr(input.ctaDescriptionEn, 500),
    updatedBy: uid,
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
  };
}

export function serializeProjectPayload(
  project: ProjectItem & {featured?: boolean; sortOrder?: number},
  uid: string,
  timestamps: {createdAt: unknown; updatedAt: unknown}
) {
  return {
    slug: sanitizeSlug(project.slug, 'project-item'),
    isDemo: Boolean(project.isDemo),
    featured: Boolean(project.featured),
    titleId: clampStr(project.title.id, 200),
    titleEn: clampStr(project.title.en, 200),
    category: project.category as ProjectCategory,
    categoryLabelId: clampStr(project.categoryLabel.id, 80),
    categoryLabelEn: clampStr(project.categoryLabel.en, 80),
    divisionId: sanitizeSlug(project.divisionId, 'dilux-development'),
    year: clampStr(project.year, 16, '2026').padStart(4, '2'),
    statusId: clampStr(project.status.id, 80),
    statusEn: clampStr(project.status.en, 80),
    image: clampStr(project.image, 500, '/src/assets/images/project_web_platform_1795578912321.jpg'),
    imageAltId: clampStr(project.imageAlt.id, 240),
    imageAltEn: clampStr(project.imageAlt.en, 240),
    shortDescriptionId: clampStr(project.shortDescription.id, 600),
    shortDescriptionEn: clampStr(project.shortDescription.en, 600),
    overviewId: clampStr(project.overview.id, 3000),
    overviewEn: clampStr(project.overview.en, 3000),
    architectureNotesId: clampStr(project.architectureNotes.id, 3000),
    architectureNotesEn: clampStr(project.architectureNotes.en, 3000),
    technologies: sanitizeStringList(project.technologies, 12, 80),
    sortOrder: Math.max(0, Math.min(1000, Number(project.sortOrder ?? 0))),
    updatedBy: uid,
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
  };
}

export function serializeProductPayload(
  product: ProductItem & {featured?: boolean; sortOrder?: number},
  uid: string,
  timestamps: {createdAt: unknown; updatedAt: unknown}
) {
  return {
    slug: sanitizeSlug(product.slug, 'product-item'),
    isDemo: Boolean(product.isDemo),
    featured: Boolean(product.featured),
    name: clampStr(product.name, 160),
    category: product.category as ProductCategory,
    categoryLabelId: clampStr(product.categoryLabel.id, 80),
    categoryLabelEn: clampStr(product.categoryLabel.en, 80),
    statusId: clampStr(product.status.id, 80),
    statusEn: clampStr(product.status.en, 80),
    image: clampStr(product.image, 500, '/src/assets/images/project_web_platform_1795578912321.jpg'),
    imageAltId: clampStr(product.imageAlt.id, 240),
    imageAltEn: clampStr(product.imageAlt.en, 240),
    shortDescriptionId: clampStr(product.shortDescription.id, 600),
    shortDescriptionEn: clampStr(product.shortDescription.en, 600),
    fullDescriptionId: clampStr(product.fullDescription.id, 3000),
    fullDescriptionEn: clampStr(product.fullDescription.en, 3000),
    capabilitiesId: sanitizeStringList(product.capabilities.id, 12, 240),
    capabilitiesEn: sanitizeStringList(product.capabilities.en, 12, 240),
    sortOrder: Math.max(0, Math.min(1000, Number(product.sortOrder ?? 0))),
    updatedBy: uid,
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
  };
}

export function serializeArticlePayload(
  article: ArticleItem & {featured?: boolean; sortOrder?: number},
  uid: string,
  timestamps: {createdAt: unknown; updatedAt: unknown}
) {
  const firstSection = article.sections[0] || {
    heading: {id: 'Ringkasan', en: 'Overview'},
    body: {id: article.excerpt.id, en: article.excerpt.en},
  };
  const combinedHeadingId = article.sections.map((s) => s.heading.id).join(' | ');
  const combinedHeadingEn = article.sections.map((s) => s.heading.en).join(' | ');
  const combinedBodyId = article.sections
    .map((s) => `${s.heading.id}\n${s.body.id}`)
    .join('\n\n');
  const combinedBodyEn = article.sections
    .map((s) => `${s.heading.en}\n${s.body.en}`)
    .join('\n\n');

  return {
    slug: sanitizeSlug(article.slug, 'article-item'),
    isDemo: Boolean(article.isDemo),
    featured: Boolean(article.featured),
    titleId: clampStr(article.title.id, 240),
    titleEn: clampStr(article.title.en, 240),
    excerptId: clampStr(article.excerpt.id, 600),
    excerptEn: clampStr(article.excerpt.en, 600),
    category: article.category as ArticleCategory,
    categoryLabelId: clampStr(article.categoryLabel.id, 80),
    categoryLabelEn: clampStr(article.categoryLabel.en, 80),
    publishedAt: clampStr(article.publishedAt, 32, '2026-11-01'),
    publishedLabelId: clampStr(article.publishedLabel.id, 64),
    publishedLabelEn: clampStr(article.publishedLabel.en, 64),
    readingMinutes: Math.max(1, Math.min(120, Number(article.readingMinutes || 3))),
    image: clampStr(article.image, 500, '/src/assets/images/insight_engineering_arch_1795578912165.jpg'),
    imageAltId: clampStr(article.imageAlt.id, 240),
    imageAltEn: clampStr(article.imageAlt.en, 240),
    author: clampStr(article.author, 120, 'DILUX EDITORIAL'),
    sectionHeadingId: clampStr(combinedHeadingId || firstSection.heading.id, 200),
    sectionHeadingEn: clampStr(combinedHeadingEn || firstSection.heading.en, 200),
    sectionBodyId: clampStr(combinedBodyId || firstSection.body.id, 6000),
    sectionBodyEn: clampStr(combinedBodyEn || firstSection.body.en, 6000),
    sortOrder: Math.max(0, Math.min(1000, Number(article.sortOrder ?? 0))),
    updatedBy: uid,
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
  };
}

export function serializeDivisionPayload(
  division: Division & {sortOrder?: number},
  uid: string,
  timestamps: {createdAt: unknown; updatedAt: unknown}
) {
  return {
    slug: sanitizeSlug(division.slug, 'division-item'),
    name: clampStr(division.name, 120),
    shortLabelId: clampStr(division.shortLabel.id, 160),
    shortLabelEn: clampStr(division.shortLabel.en, 160),
    icon: division.icon as DivisionIconName,
    descriptionId: clampStr(division.description.id, 600),
    descriptionEn: clampStr(division.description.en, 600),
    extendedOverviewId: clampStr(division.extendedOverview.id, 2000),
    extendedOverviewEn: clampStr(division.extendedOverview.en, 2000),
    methodologyId: clampStr(division.methodology.id, 1000),
    methodologyEn: clampStr(division.methodology.en, 1000),
    focusAreasId: sanitizeStringList(division.focusAreas.id, 12, 120),
    focusAreasEn: sanitizeStringList(division.focusAreas.en, 12, 120),
    sortOrder: Math.max(0, Math.min(1000, Number(division.sortOrder ?? 0))),
    updatedBy: uid,
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
  };
}

export function serializeServicePayload(
  service: ServiceItem & {featured?: boolean; sortOrder?: number},
  uid: string,
  timestamps: {createdAt: unknown; updatedAt: unknown}
) {
  return {
    number: clampStr(service.number, 10, '01'),
    divisionId: sanitizeSlug(service.divisionId, 'dilux-development'),
    icon: service.icon as ServiceIconName,
    nameId: clampStr(service.name.id, 160),
    nameEn: clampStr(service.name.en, 160),
    shortDescriptionId: clampStr(service.shortDescription.id, 600),
    shortDescriptionEn: clampStr(service.shortDescription.en, 600),
    scopeDetailsId: sanitizeStringList(service.scopeDetails.id, 10, 160),
    scopeDetailsEn: sanitizeStringList(service.scopeDetails.en, 10, 160),
    featured: Boolean(service.featured),
    sortOrder: Math.max(0, Math.min(1000, Number(service.sortOrder ?? 0))),
    updatedBy: uid,
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
  };
}

export function generateContactMessageId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `msg-${ts}-${rand}`;
}

export function serializeContactMessagePayload(
  input: ContactFormValues,
  language: Language,
  sourcePath: string,
  status: ContactMessageStatus,
  timestamps: {createdAt: unknown; updatedAt: unknown}
) {
  return {
    fullName: clampStr(input.fullName, 120),
    email: clampStr(input.email, 200),
    subject: clampStr(input.subject, 200),
    message: clampStr(input.message, 4000),
    language: language === 'en' ? 'en' : 'id',
    sourcePath: clampStr(sourcePath, 120, '/contact'),
    status,
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
  };
}
