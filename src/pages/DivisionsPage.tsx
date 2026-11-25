import {ArrowLeft, ArrowRight, Check} from 'lucide-react';
import {Link, useParams} from 'react-router-dom';
import {Button} from '../components/Button';
import {DivisionCard, ServiceCard} from '../components/Cards';
import {DivisionIcon} from '../components/Icons';
import {PageHead} from '../components/PageHead';
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

        <section className="bg-[#0B1428] text-white py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/divisions"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#60A5FA] hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>{t.divisions.backToDivisions}</span>
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#142B4D] border border-white/15 text-[#60A5FA] flex items-center justify-center shrink-0">
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

        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <h2 className="font-display text-2xl font-bold text-[#0F172A] mb-6">
                {t.divisions.expertiseTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedDivision.focusAreas[language].map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#F1F5F9] border border-slate-200"
                  >
                    <Check className="w-4 h-4 text-[#2563EB] shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium text-[#0F172A]">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0B1428] text-white rounded-xl p-8 flex flex-col justify-between">
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
          </div>
        </section>

        {relatedServices.length > 0 && (
          <section className="py-16 sm:py-20 bg-[#F1F5F9]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] mb-8">
                {t.divisions.relatedServicesTitle}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
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

      <section className="bg-[#0B1428] text-white py-14 sm:py-20">
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

      <section className="py-16 sm:py-20 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {divisions.map((division) => (
            <DivisionCard key={division.id} division={division} />
          ))}
        </div>
      </section>
    </>
  );
}
