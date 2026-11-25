import {ArrowRight, ExternalLink} from 'lucide-react';
import {Link} from 'react-router-dom';
import {useFirebase} from '../context/FirebaseContext';
import {useLanguage} from '../context/LanguageContext';
import type {ArticleItem, Division, ProductItem, ProjectItem, ServiceItem} from '../types';
import {DivisionIcon, ServiceIcon} from './Icons';
import {SafeImage} from './SafeImage';

export function DivisionCard({division}: {division: Division}) {
  const {language, t, localize} = useLanguage();
  const focusItems = division.focusAreas[language];

  return (
    <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-colors duration-150 hover:border-[#2563EB]/40">
      <div>
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="w-11 h-11 rounded-lg bg-[#0B1428] text-[#60A5FA] flex items-center justify-center shrink-0">
            <DivisionIcon name={division.icon} className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-[#64748B]">
            {localize(division.shortLabel)}
          </span>
        </div>
        <h3 className="font-display text-lg font-bold tracking-tight text-[#0F172A]">
          {division.name}
        </h3>
        <p className="mt-2.5 text-sm text-[#64748B] leading-relaxed">
          {localize(division.description)}
        </p>
        <ul className="mt-5 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-[#0F172A]">
          {focusItems.slice(0, 4).map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-[#2563EB] font-semibold" aria-hidden="true">
                —
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <Link
          to={`/divisions/${division.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
        >
          <span>{t.common.explore}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function ServiceCard({
  service,
  onLearnMore,
}: {
  service: ServiceItem;
  onLearnMore?: (service: ServiceItem) => void;
}) {
  const {t, localize} = useLanguage();
  const {divisions} = useFirebase();
  const division = divisions.find((d) => d.id === service.divisionId);
  const serviceName = localize(service.name);

  return (
    <article className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between transition-colors duration-150 hover:border-slate-300">
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] text-[#0B1428] flex items-center justify-center shrink-0">
            <ServiceIcon name={service.icon} className="w-5 h-5" />
          </div>
          <span className="font-mono-tabular text-xs font-medium text-[#64748B]">
            {service.number}
          </span>
        </div>

        <p className="text-xs font-medium text-[#2563EB] mb-1.5">
          {division ? division.name : ''}
        </p>
        <h3 className="font-display text-lg font-bold tracking-tight text-[#0F172A]">
          {serviceName}
        </h3>
        <p className="mt-2.5 text-sm text-[#64748B] leading-relaxed">
          {localize(service.shortDescription)}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        {onLearnMore ? (
          <button
            type="button"
            onClick={() => onLearnMore(service)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F172A] hover:text-[#2563EB] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{t.common.learnMore}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        ) : (
          <Link
            to={`/services?focus=${service.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F172A] hover:text-[#2563EB] transition-colors whitespace-nowrap"
          >
            <span>{t.common.learnMore}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        )}

        <Link
          to={`/contact?subject=${encodeURIComponent(serviceName)}`}
          className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors whitespace-nowrap"
        >
          {t.services.contactAction}
        </Link>
      </div>
    </article>
  );
}

export function ProductCard({
  product,
  onSelect,
}: {
  product: ProductItem;
  onSelect?: (product: ProductItem) => void;
}) {
  const {t, localize} = useLanguage();

  return (
    <article className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between transition-colors duration-150 hover:border-slate-300">
      <div>
        <div className="aspect-[4/3] w-full overflow-hidden bg-[#0B1428]">
          <SafeImage
            src={product.image}
            alt={localize(product.imageAlt)}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#64748B] mb-2">
            {product.isDemo && (
              <>
                <span className="font-semibold text-[#2563EB]">{t.common.demoLabel}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>{localize(product.categoryLabel)}</span>
            <span aria-hidden="true">·</span>
            <span>{localize(product.status)}</span>
          </div>
          <h3 className="font-display text-lg font-bold tracking-tight text-[#0F172A]">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
            {localize(product.shortDescription)}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        {onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{t.common.learnMore}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        ) : (
          <Link
            to={`/products?item=${product.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors whitespace-nowrap"
          >
            <span>{t.common.learnMore}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}

export function ProjectCard({project}: {project: ProjectItem}) {
  const {t, localize} = useLanguage();

  return (
    <article className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between transition-colors duration-150 hover:border-slate-300">
      <div>
        <Link to={`/projects/${project.slug}`} className="block aspect-[4/3] w-full overflow-hidden bg-[#0B1428]">
          <SafeImage
            src={project.image}
            alt={localize(project.imageAlt)}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </Link>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#64748B] mb-2">
            {project.isDemo && (
              <>
                <span className="font-semibold text-[#2563EB]">{t.common.demoLabel}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>{localize(project.categoryLabel)}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">{project.year}</span>
          </div>
          <h3 className="font-display text-lg font-bold tracking-tight text-[#0F172A]">
            <Link to={`/projects/${project.slug}`} className="hover:text-[#2563EB] transition-colors">
              {localize(project.title)}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
            {localize(project.shortDescription)}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
        <p className="text-xs text-[#64748B] truncate">
          {project.technologies.join(' · ')}
        </p>
        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors shrink-0 whitespace-nowrap"
        >
          <span>{t.common.learnMore}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function ArticleCard({article}: {article: ArticleItem}) {
  const {t, localize} = useLanguage();

  return (
    <article className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between transition-colors duration-150 hover:border-slate-300">
      <div>
        <Link to={`/insights/${article.slug}`} className="block aspect-[4/3] w-full overflow-hidden bg-[#0B1428]">
          <SafeImage
            src={article.image}
            alt={localize(article.imageAlt)}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </Link>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#64748B] mb-2">
            {article.isDemo && (
              <>
                <span className="font-semibold text-[#2563EB]">{t.common.demoLabel}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>{localize(article.categoryLabel)}</span>
            <span aria-hidden="true">·</span>
            <span>{localize(article.publishedLabel)}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">
              {article.readingMinutes} {t.common.readingTime}
            </span>
          </div>
          <h3 className="font-display text-lg font-bold tracking-tight text-[#0F172A]">
            <Link to={`/insights/${article.slug}`} className="hover:text-[#2563EB] transition-colors">
              {localize(article.title)}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
            {localize(article.excerpt)}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 border-t border-slate-100">
        <Link
          to={`/insights/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors whitespace-nowrap"
        >
          <span>{t.insights.readArticle}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function ExternalBadgeLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
    >
      <span>{label}</span>
      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
    </a>
  );
}
