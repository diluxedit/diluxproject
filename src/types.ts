export type Language = 'id' | 'en';

export interface LocalizedText {
  id: string;
  en: string;
}

export interface LocalizedList {
  id: string[];
  en: string[];
}

export type DivisionId =
  | 'dilux-development'
  | 'dilux-technology'
  | 'dilux-creative'
  | 'dilux-innovation';

export type DivisionIconName = 'Code2' | 'Server' | 'Palette' | 'Compass';

export interface Division {
  id: DivisionId;
  slug: string;
  name: string;
  shortLabel: LocalizedText;
  icon: DivisionIconName;
  description: LocalizedText;
  extendedOverview: LocalizedText;
  focusAreas: LocalizedList;
  methodology: LocalizedText;
  sortOrder?: number;
}

export type ServiceIconName =
  | 'Globe'
  | 'AppWindow'
  | 'Terminal'
  | 'Network'
  | 'Router'
  | 'Headphones'
  | 'Cpu'
  | 'Layout'
  | 'PenTool'
  | 'Sparkles';

export interface ServiceItem {
  id: string;
  number: string;
  divisionId: DivisionId;
  icon: ServiceIconName;
  name: LocalizedText;
  shortDescription: LocalizedText;
  scopeDetails: LocalizedList;
  featured?: boolean;
  sortOrder?: number;
}

export type ProductCategory =
  | 'Software'
  | 'Web Applications'
  | 'Digital Tools'
  | 'Technology Products';

export interface ProductItem {
  id: string;
  slug: string;
  isDemo: boolean;
  featured?: boolean;
  sortOrder?: number;
  name: string;
  category: ProductCategory;
  categoryLabel: LocalizedText;
  status: LocalizedText;
  image: string;
  imageAlt: LocalizedText;
  shortDescription: LocalizedText;
  fullDescription: LocalizedText;
  capabilities: LocalizedList;
}

export type ProjectCategory =
  | 'Website'
  | 'Software'
  | 'Networking'
  | 'Creative Design'
  | 'Digital Innovation';

export interface ProjectItem {
  id: string;
  slug: string;
  isDemo: boolean;
  featured?: boolean;
  sortOrder?: number;
  title: LocalizedText;
  category: ProjectCategory;
  categoryLabel: LocalizedText;
  divisionId: DivisionId;
  year: string;
  status: LocalizedText;
  image: string;
  imageAlt: LocalizedText;
  shortDescription: LocalizedText;
  overview: LocalizedText;
  architectureNotes: LocalizedText;
  technologies: string[];
}

export type ArticleCategory =
  | 'Technology'
  | 'Networking'
  | 'Software'
  | 'Hardware'
  | 'Digital Innovation'
  | 'Tutorials';

export interface ArticleItem {
  id: string;
  slug: string;
  isDemo: boolean;
  featured?: boolean;
  sortOrder?: number;
  title: LocalizedText;
  excerpt: LocalizedText;
  category: ArticleCategory;
  categoryLabel: LocalizedText;
  publishedAt: string;
  publishedLabel: LocalizedText;
  readingMinutes: number;
  image: string;
  imageAlt: LocalizedText;
  author: string;
  sections: {
    heading: LocalizedText;
    body: LocalizedText;
  }[];
}

export interface ContactFormValues {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export type ContactMessageStatus = 'new' | 'read' | 'replied' | 'archived';

export interface ContactMessageItem {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  language: Language;
  sourcePath: string;
  status: ContactMessageStatus;
  createdAtMillis: number;
  updatedAtMillis: number;
}
