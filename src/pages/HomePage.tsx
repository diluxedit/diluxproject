import {ArrowRight, Mail, MessageCircle, Share2} from 'lucide-react';
import type {CSSProperties} from 'react';
import {Link} from 'react-router-dom';
import {Button} from '../components/Button';
import {
  ArticleCard,
  DivisionCard,
  ProductCard,
  ProjectCard,
  ServiceCard,
} from '../components/Cards';
import {PageHead} from '../components/PageHead';
import {RevealSection} from '../components/RevealSection';
import {SafeImage} from '../components/SafeImage';
import {SectionHeader} from '../components/SectionHeader';
import {useFirebase} from '../context/FirebaseContext';
import {useLanguage} from '../context/LanguageContext';
import {OFFICIAL_CONTACT} from '../data/contact';

export function HomePage() {
  const {language, t} = useLanguage();
  const {homeSettings, divisions, services, products, projects, articles} = useFirebase();

  const flaggedServices = services.filter((s) => s.featured);
  const featuredServices = flaggedServices.length > 0 ? flaggedServices : services.slice(0, 4);

  const flaggedProjects = projects.filter((p) => p.featured);
  const featuredProjects = flaggedProjects.length > 0 ? flaggedProjects : projects.slice(0, 3);

  const flaggedProducts = products.filter((p) => p.featured);
  const featuredProducts = flaggedProducts.length > 0 ? flaggedProducts : products.slice(0, 2);

  const flaggedArticles = articles.filter((a) => a.featured);
  const latestArticles = flaggedArticles.length > 0 ? flaggedArticles : articles.slice(0, 3);

  const heroEyebrow =
    language === 'en' ? homeSettings.heroEyebrowEn : homeSettings.heroEyebrowId;
  const heroHeadline =
    language === 'en' ? homeSettings.heroHeadlineEn : homeSettings.heroHeadlineId;
  const heroDescription =
    language === 'en' ? homeSettings.heroDescriptionEn : homeSettings.heroDescriptionId;
  const introTitle =
    language === 'en' ? homeSettings.introTitleEn : homeSettings.introTitleId;
  const introParagraph1 =
    language === 'en' ? homeSettings.introParagraph1En : homeSettings.introParagraph1Id;
  const introParagraph2 =
    language === 'en' ? homeSettings.introParagraph2En : homeSettings.introParagraph2Id;
  const ctaHeadline =
    language === 'en' ? homeSettings.ctaHeadlineEn : homeSettings.ctaHeadlineId;
  const ctaDescription =
    language === 'en' ? homeSettings.ctaDescriptionEn : homeSettings.ctaDescriptionId;

  return (
    <>
      <PageHead
        title={`${t.brand.name} — ${t.brand.tagline}`}
        description={t.brand.shortDescription}
      />

      {/* SECTION A — HERO */}
      <section className="dilux-glass-canvas-dark text-white overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-25 pointer-events-none"
        >
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
          >
            <defs>
              <pattern
                id="dilux-grid"
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="0.6"
                  strokeOpacity="0.35"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dilux-grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p
                style={{'--dilux-hero-offset': '0ms'} as CSSProperties}
                className="text-xs font-semibold tracking-wider text-[#60A5FA] mb-4 dilux-hero-enter"
              >
                {heroEyebrow}
              </p>

              <h1
                style={{'--dilux-hero-offset': '70ms'} as CSSProperties}
                className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1] text-white dilux-hero-enter"
              >
                {heroHeadline}
              </h1>

              <p
                style={{'--dilux-hero-offset': '140ms'} as CSSProperties}
                className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl dilux-hero-enter"
              >
                {heroDescription}
              </p>

              <div
                style={{'--dilux-hero-offset': '210ms'} as CSSProperties}
                className="mt-8 flex flex-wrap items-center gap-3.5 dilux-hero-enter"
              >
                <Button to="/divisions" variant="primary" size="lg">
                  <span>{t.home.heroPrimaryCta}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
                <Button to="/contact" variant="outlineLight" size="lg">
                  <span>{t.home.heroSecondaryCta}</span>
                </Button>
              </div>
            </div>

            <div
              style={{'--dilux-hero-offset': '180ms'} as CSSProperties}
              className="lg:col-span-5 flex dilux-hero-enter"
            >
              <div className="relative w-full rounded-2xl overflow-hidden liquid-glass-dark liquid-glass-sheen min-h-[260px] lg:min-h-[380px]">
                <SafeImage
                  src={homeSettings.heroImageUrl}
                  alt="DILUX GROUP minimalist dark navy technology architecture"
                  className="w-full h-full object-cover"
                  eager
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0B1428]/85 via-[#0B1428]/20 to-transparent"
                />
                <div className="absolute bottom-4 left-4 right-4 z-10 rounded-xl bg-[#0B1428]/65 backdrop-blur-xl border border-white/20 px-4 py-3.5 flex items-center justify-between gap-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                  <div>
                    <p className="font-display text-sm font-bold text-white">
                      {t.brand.name}
                    </p>
                    <p className="text-xs text-slate-300">{t.brand.fullName}</p>
                  </div>
                  <span className="text-xs font-medium text-[#60A5FA]">
                    {t.home.divisionsCountLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B — INTRODUCTION */}
      <section className="py-16 sm:py-20 dilux-glass-canvas-soft border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <RevealSection className="lg:col-span-7" delayIndex={0}>
              <p className="text-xs font-semibold tracking-wider text-[#2563EB] mb-2">
                {t.home.introKicker}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A]">
                {introTitle}
              </h2>
              <p className="mt-4 text-base text-[#0F172A] leading-relaxed">
                {introParagraph1}
              </p>
              <p className="mt-3 text-base text-[#64748B] leading-relaxed">
                {introParagraph2}
              </p>
              <div className="mt-7">
                <Button to="/about" variant="secondary">
                  <span>{t.home.introCta}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>
            </RevealSection>

            <RevealSection className="lg:col-span-5 relative" delayIndex={1} variant="scale">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#2563EB]/25 via-[#60A5FA]/15 to-[#0B1428]/20 blur-xl pointer-events-none"
              />
              <div className="relative rounded-2xl bg-[#0B1428]/90 backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_22px_48px_-14px_rgba(11,20,40,0.45)] p-8 sm:p-10 text-white flex flex-col items-center text-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-white/20 shadow-lg mb-5">
                  <SafeImage
                    src={homeSettings.brandLogoUrl}
                    alt="DILUX GROUP Official Mark"
                    className="w-full h-full object-cover"
                    eager
                  />
                </div>
                <p className="font-display text-xl font-bold tracking-tight">
                  {t.brand.name}
                </p>
                <p className="mt-1 text-sm text-[#60A5FA]">{t.brand.fullName}</p>
                <p className="mt-3 text-sm text-slate-300 max-w-xs">
                  {t.brand.tagline}
                </p>
                <div className="mt-6 pt-5 border-t border-white/15 w-full">
                  <p className="text-[11px] font-semibold tracking-wider text-[#60A5FA] uppercase">
                    {t.brand.founderLabel}
                  </p>
                  <p className="mt-1 font-display text-base font-bold text-white">
                    {t.brand.founderName}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-300">{t.brand.founderRole}</p>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* SECTION C — OUR DIVISIONS */}
      <section className="py-16 sm:py-20 dilux-glass-canvas-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <SectionHeader
              kicker={t.home.divisionsKicker}
              title={t.home.divisionsTitle}
              subtitle={t.home.divisionsSubtitle}
              action={
                <Button to="/divisions" variant="outline">
                  <span>{t.common.viewAll}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              }
            />
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {divisions.map((division, idx) => (
              <RevealSection key={division.id} delayIndex={idx} variant="scale" className="flex">
                <DivisionCard division={division} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION D — OUR SERVICES */}
      <section className="py-16 sm:py-20 dilux-glass-canvas-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <SectionHeader
              kicker={t.home.servicesKicker}
              title={t.home.servicesTitle}
              subtitle={t.home.servicesSubtitle}
              action={
                <Button to="/services" variant="outline">
                  <span>{t.common.viewAll}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              }
            />
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service, idx) => (
              <RevealSection key={service.id} delayIndex={idx} variant="scale" className="flex">
                <ServiceCard service={service} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION E — FEATURED PROJECTS */}
      <section className="py-16 sm:py-20 dilux-glass-canvas-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <SectionHeader
              kicker={t.home.projectsKicker}
              title={t.home.projectsTitle}
              subtitle={t.home.projectsSubtitle}
              action={
                <Button to="/projects" variant="outline">
                  <span>{t.common.viewAll}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              }
            />
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, idx) => (
              <RevealSection key={project.id} delayIndex={idx} variant="scale" className="flex">
                <ProjectCard project={project} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F — DIGITAL PRODUCTS */}
      <section className="py-16 sm:py-20 dilux-glass-canvas-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <SectionHeader
              kicker={t.home.productsKicker}
              title={t.home.productsTitle}
              subtitle={t.home.productsSubtitle}
              action={
                <Button to="/products" variant="outline">
                  <span>{t.common.viewAll}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              }
            />
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProducts.map((product, idx) => (
              <RevealSection key={product.id} delayIndex={idx} variant="scale" className="flex">
                <ProductCard product={product} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION G — LATEST INSIGHTS */}
      <section className="py-16 sm:py-20 dilux-glass-canvas-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <SectionHeader
              kicker={t.home.insightsKicker}
              title={t.home.insightsTitle}
              subtitle={t.home.insightsSubtitle}
              action={
                <Button to="/insights" variant="outline">
                  <span>{t.common.viewAll}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              }
            />
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article, idx) => (
              <RevealSection key={article.id} delayIndex={idx} variant="scale" className="flex">
                <ArticleCard article={article} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION H — CALL TO ACTION */}
      <section className="py-16 sm:py-20 dilux-glass-canvas-dark text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <RevealSection className="lg:col-span-7" delayIndex={0}>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                {ctaHeadline}
              </h2>
              <p className="mt-3 text-base text-slate-300 leading-relaxed max-w-xl">
                {ctaDescription}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <Button to="/contact" variant="primary" size="lg">
                  <span>{t.home.ctaButton}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
                <Link
                  to="/services"
                  className="text-sm font-semibold text-slate-200 hover:text-white transition-colors px-2 py-2"
                >
                  {t.nav.services}
                </Link>
              </div>
            </RevealSection>

            <div className="lg:col-span-5 grid grid-cols-1 gap-3">
              <RevealSection delayIndex={0} variant="scale">
                <a
                  href={OFFICIAL_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl liquid-glass-dark liquid-glass-dark-interactive"
                >
                  <span className="inline-flex items-center gap-3 text-sm font-medium text-white">
                    <MessageCircle className="w-4 h-4 text-[#60A5FA]" aria-hidden="true" />
                    <span>WhatsApp</span>
                  </span>
                  <span className="font-mono-tabular text-sm text-slate-200">
                    {OFFICIAL_CONTACT.whatsappDisplay}
                  </span>
                </a>
              </RevealSection>
              <RevealSection delayIndex={1} variant="scale">
                <a
                  href={OFFICIAL_CONTACT.emailUrl}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl liquid-glass-dark liquid-glass-dark-interactive"
                >
                  <span className="inline-flex items-center gap-3 text-sm font-medium text-white">
                    <Mail className="w-4 h-4 text-[#60A5FA]" aria-hidden="true" />
                    <span>Email</span>
                  </span>
                  <span className="text-sm text-slate-200">{OFFICIAL_CONTACT.email}</span>
                </a>
              </RevealSection>
              <RevealSection delayIndex={2} variant="scale">
                <a
                  href={OFFICIAL_CONTACT.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl liquid-glass-dark liquid-glass-dark-interactive"
                >
                  <span className="inline-flex items-center gap-3 text-sm font-medium text-white">
                    <Share2 className="w-4 h-4 text-[#60A5FA]" aria-hidden="true" />
                    <span>TikTok</span>
                  </span>
                  <span className="text-sm text-slate-200">{OFFICIAL_CONTACT.tiktokHandle}</span>
                </a>
              </RevealSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
