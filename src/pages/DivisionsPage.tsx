import {ArrowLeft, ArrowRight, Check} from 'lucide-react';
import {Link, useParams} from 'react-router-dom';
import {Button} from '../components/Button';
import {DivisionCard, ServiceCard} from '../components/Cards';
import {DivisionIcon} from '../components/Icons';
import {PageHead} from '../components/PageHead';
import {RevealSection} from '../components/RevealSection';
import {useFirebase} from '../context/FirebaseContext';
import {useLanguage} from '../context/LanguageContext';
import {filterServicesByDivision} from '../utils/filters';

export function DivisionsPage() {
  const {slug} = useParams<{slug?: string}>();
  const {language, t, localize} = useLanguage();
  const {divisions, services} = useFirebase();

  const selectedDivision = slug ? divisions.find((d) => d.slug === slug) : undefined;

  if (slug && !selectedDivision) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-display text-2xl font-bold text-[#0F172A]">
            {t.divisions.headerTitle}
          </h1>
          <div className="mt-6">
            <Button to="/divisions" variant="primary">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>{t.divisions.backToDivisions}</span>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (selectedDivision) {
    const relatedServices = filterServicesByDivision(services, selectedDivision.id);

    return (
      <>
        <PageHead
          title={`${selectedDivision.name} — ${t.brand.name}`}
          description={localize(selectedDivision.description)}
        />

        <section className="dilux-glass-canvas-dark text-white py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/divisions"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#60A5FA] hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>{t.divisions.backToDivisions}</span>
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl liquid-glass-dark text-[#60A5FA] flex items-center justify-center shrink-0">
                <DivisionIcon name={selectedDivision.icon} className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-slate-300">
                {localize(selectedDivision.shortLabel)}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {selectedDivision.name}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {localize(selectedDivision.extendedOverview)}
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 dilux-glass-canvas-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <RevealSection>
                <h2 className="font-display text-2xl font-bold text-[#0F172A] mb-6">
                  {t.divisions.expertiseTitle}
                </h2>
              </RevealSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedDivision.focusAreas[language].map((area, idx) => (
                  <RevealSection key={area} delayIndex={idx} variant="scale">
                    <div className="flex items-center gap-3 p-4 rounded-2xl liquid-glass-light">
                      <Check className="w-4 h-4 text-[#2563EB] shrink-0" aria-hidden="true" />
                      <span className="text-sm font-medium text-[#0F172A]">{area}</span>
                    </div>
                  </RevealSection>
                ))}
              </div>
            </div>

            <RevealSection delayIndex={1} variant="scale" className="lg:col-span-5 flex">
              <div className="w-full dilux-glass-canvas-dark border border-white/15 shadow-xl text-white rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    {t.divisions.methodologyTitle}
                  </h2>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    {localize(selectedDivision.methodology)}
                  </p>
                </div>
                <div className="mt-8">
                  <Button
                    to={`/contact?subject=${encodeURIComponent(selectedDivision.name)}`}
                    variant="primary"
                    className="w-full"
                  >
                    <span>{t.divisions.discussDivision}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </RevealSection>
          </div>
        </section>

        {relatedServices.length > 0 && (
          <section className="py-16 sm:py-20 dilux-glass-canvas-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <RevealSection>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] mb-8">
                  {t.divisions.relatedServicesTitle}
                </h2>
              </RevealSection>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedServices.map((service, idx) => (
                  <RevealSection key={service.id} delayIndex={idx} variant="scale" className="flex">
                    <ServiceCard service={service} />
                  </RevealSection>
                ))}
              </div>
            </div>
          </section>
        )}
      </>
    );
  }

  return (
    <>
      <PageHead title={t.divisions.pageTitle} description={t.divisions.pageDescription} />

      <section className="dilux-glass-canvas-dark text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-wider text-[#60A5FA] mb-3">
            {t.divisions.headerKicker}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl">
            {t.divisions.headerTitle}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            {t.divisions.headerSubtitle}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 dilux-glass-canvas-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {divisions.map((division, idx) => (
            <RevealSection key={division.id} delayIndex={idx} variant="scale" className="flex">
              <DivisionCard division={division} />
            </RevealSection>
          ))}
        </div>
      </section>
    </>
  );
}
