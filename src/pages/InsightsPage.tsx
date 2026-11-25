import {ArrowLeft, Info} from 'lucide-react';
import {useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Button} from '../components/Button';
import {ArticleCard} from '../components/Cards';
import {PageHead} from '../components/PageHead';
import {SafeImage} from '../components/SafeImage';
import {useFirebase} from '../context/FirebaseContext';
import {useLanguage} from '../context/LanguageContext';
import type {ArticleCategory} from '../types';
import {filterArticlesByCategory, getRelatedArticles} from '../utils/filters';

const ARTICLE_CATEGORIES: {value: ArticleCategory | 'All'; idLabel: string; enLabel: string}[] = [
  {value: 'All', idLabel: 'Semua', enLabel: 'All'},
  {value: 'Technology', idLabel: 'Teknologi', enLabel: 'Technology'},
  {value: 'Networking', idLabel: 'Jaringan', enLabel: 'Networking'},
  {value: 'Software', idLabel: 'Perangkat Lunak', enLabel: 'Software'},
  {value: 'Hardware', idLabel: 'Perangkat Keras', enLabel: 'Hardware'},
  {value: 'Digital Innovation', idLabel: 'Inovasi Digital', enLabel: 'Digital Innovation'},
  {value: 'Tutorials', idLabel: 'Tutorial', enLabel: 'Tutorials'},
];

export function InsightsPage() {
  const {slug} = useParams<{slug?: string}>();
  const {language, t, localize} = useLanguage();
  const {articles} = useFirebase();
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | 'All'>('All');

  const selectedArticle = slug ? articles.find((a) => a.slug === slug) : undefined;

  if (slug && !selectedArticle) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-display text-2xl font-bold text-[#0F172A]">
            {t.insights.headerTitle}
          </h1>
          <div className="mt-6">
            <Button to="/insights" variant="primary">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>{t.insights.backToInsights}</span>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (selectedArticle) {
    const articleTitle = localize(selectedArticle.title);
    const related = getRelatedArticles(articles, selectedArticle.slug, 2);

    return (
      <>
        <PageHead
          title={`${articleTitle} — ${t.brand.name}`}
          description={localize(selectedArticle.excerpt)}
        />

        <article className="bg-white">
          <header className="bg-[#0B1428] text-white py-12 sm:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link
                to="/insights"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#60A5FA] hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>{t.insights.backToInsights}</span>
              </Link>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mb-3">
                {selectedArticle.isDemo && (
                  <>
                    <span className="font-semibold text-[#60A5FA]">{t.common.demoLabel}</span>
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <span>{localize(selectedArticle.categoryLabel)}</span>
                <span aria-hidden="true">·</span>
                <span>{localize(selectedArticle.publishedLabel)}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">
                  {selectedArticle.readingMinutes} {t.common.readingTime}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                {articleTitle}
              </h1>

              <p className="mt-4 text-sm text-slate-300">
                {t.insights.writtenBy}: <span className="text-white font-medium">{selectedArticle.author}</span>
              </p>
            </div>
          </header>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200 bg-[#0B1428] mb-10">
              <SafeImage
                src={selectedArticle.image}
                alt={localize(selectedArticle.imageAlt)}
                className="w-full h-full object-cover"
                eager
              />
            </div>

            <p className="text-lg text-[#0F172A] font-medium leading-relaxed mb-8 pb-8 border-b border-slate-200">
              {localize(selectedArticle.excerpt)}
            </p>

            <div className="space-y-8 max-w-3xl">
              {selectedArticle.sections.map((section) => (
                <section key={localize(section.heading)}>
                  <h2 className="font-display text-2xl font-bold text-[#0F172A] mb-3">
                    {localize(section.heading)}
                  </h2>
                  <p className="text-base text-[#0F172A]/85 leading-[1.75]">
                    {localize(section.body)}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="py-14 sm:py-16 bg-[#F1F5F9] border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-2xl font-bold text-[#0F172A] mb-8">
                {t.insights.relatedArticles}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {related.map((item) => (
                  <ArticleCard key={item.id} article={item} />
                ))}
              </div>
            </div>
          </section>
        )}
      </>
    );
  }

  const filteredArticles = filterArticlesByCategory(articles, activeCategory);

  return (
    <>
      <PageHead title={t.insights.pageTitle} description={t.insights.pageDescription} />

      <section className="bg-[#0B1428] text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-wider text-[#60A5FA] mb-3">
            {t.insights.headerKicker}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl">
            {t.insights.headerTitle}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            {t.insights.headerSubtitle}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-xl bg-white border border-slate-200 p-4 sm:p-5 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-[#0F172A] leading-relaxed">{t.insights.demoBanner}</p>
          </div>

          <div
            role="group"
            aria-label="Article categories"
            className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl mb-8"
          >
            {ARTICLE_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.value
                    ? 'bg-[#0B1428] text-white'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {language === 'id' ? cat.idLabel : cat.enLabel}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
