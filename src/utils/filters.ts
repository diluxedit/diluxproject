import type {
  ArticleCategory,
  ArticleItem,
  DivisionId,
  ProductCategory,
  ProductItem,
  ProjectCategory,
  ProjectItem,
  ServiceItem,
} from '../types';

export function filterProjectsByCategory(
  projects: ProjectItem[],
  category: ProjectCategory | 'All'
): ProjectItem[] {
  if (category === 'All') {
    return projects;
  }
  return projects.filter((project) => project.category === category);
}

export function filterArticlesByCategory(
  articles: ArticleItem[],
  category: ArticleCategory | 'All'
): ArticleItem[] {
  if (category === 'All') {
    return articles;
  }
  return articles.filter((article) => article.category === category);
}

export function getRelatedArticles(
  articles: ArticleItem[],
  currentSlug: string,
  limit = 2
): ArticleItem[] {
  const current = articles.find((item) => item.slug === currentSlug);
  const others = articles.filter((item) => item.slug !== currentSlug);
  if (!current) {
    return others.slice(0, limit);
  }
  const sameCategory = others.filter((item) => item.category === current.category);
  const differentCategory = others.filter((item) => item.category !== current.category);
  return [...sameCategory, ...differentCategory].slice(0, limit);
}

export function filterProductsByCategory(
  products: ProductItem[],
  category: ProductCategory | 'All'
): ProductItem[] {
  if (category === 'All') {
    return products;
  }
  return products.filter((product) => product.category === category);
}

export function filterServicesByDivision(
  services: ServiceItem[],
  divisionId: DivisionId | 'All'
): ServiceItem[] {
  if (divisionId === 'All') {
    return services;
  }
  return services.filter((service) => service.divisionId === divisionId);
}
