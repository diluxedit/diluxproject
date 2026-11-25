import {ArrowRight} from 'lucide-react';
import {Button} from '../components/Button';
import {PageHead} from '../components/PageHead';
import {SectionHeader} from '../components/SectionHeader';
import {useLanguage} from '../context/LanguageContext';
import {OFFICIAL_CONTACT} from '../data/contact';

export function AboutPage() {
  const {t} = useLanguage();

  return (
    <>
      <PageHead title={t.about.pageTitle} description={t.about.pageDescription} />

      {/* Page Banner */}
      <section className="bg-[#0B1428] text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-wider text-[#60A5FA] mb-3">
            {t.about.headerKicker}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl">
            {t.about.headerTitle}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            {t.about.headerSubtitle}
          </p>
        </div>
      </section>

      {/* Company Overview + Brand Philosophy */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
                {t.about.overviewTitle}
              </h2>
              <p className="mt-4 text-base text-[#0F172A] leading-relaxed">
                {t.about.overviewBody1}
              </p>
              <p className="mt-3 text-base text-[#64748B] leading-relaxed">
                {t.about.overviewBody2}
              </p>
            </div>

            <div className="pt-8 border-t border-slate-200">
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#0F172A]">
                {t.about.philosophyTitle}
              </h2>
              <p className="mt-3 text-base text-[#64748B] leading-relaxed">
                {t.about.philosophyBody}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl bg-[#0B1428] border border-[#142B4D] p-8 sm:p-10 text-white text-center flex flex-col items-center">
              <div className="w-32 h-32 rounded-xl overflow-hidden mb-5">
                <img
                  src={OFFICIAL_CONTACT.logoPath}
                  alt="DILUX GROUP Official Brand Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="font-display text-xl font-bold">{t.brand.name}</p>
              <p className="text-sm text-[#60A5FA] mt-1">{t.brand.fullName}</p>
              <p className="text-sm text-slate-300 mt-4">{t.brand.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 sm:py-20 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-[#0B1428] text-white rounded-xl p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#60A5FA] mb-3">
                {t.brand.name}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                {t.about.visionTitle}
              </h2>
              <p className="mt-4 text-lg text-slate-200 leading-relaxed">
                “{t.about.visionStatement}”
              </p>
            </div>
            <p className="mt-8 text-xs text-slate-400">{t.brand.tagline}</p>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-8 sm:p-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] mb-6">
              {t.about.missionTitle}
            </h2>
            <ol className="space-y-4">
              {t.about.missionItems.map((item, idx) => (
                <li
                  key={item}
                  className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0"
                >
                  <span className="font-mono-tabular text-sm font-semibold text-[#2563EB] shrink-0 pt-0.5">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span className="text-base text-[#0F172A] leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t.about.valuesTitle} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {t.about.values.map((val, idx) => (
              <div
                key={val.title}
                className="bg-[#F1F5F9] border border-slate-200 rounded-xl p-6 flex flex-col"
              >
                <span className="font-mono-tabular text-xs font-semibold text-[#2563EB] mb-3">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-lg font-bold text-[#0F172A]">
                  {val.title}
                </h3>
                <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 sm:py-20 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t.about.approachTitle}
            action={
              <Button to="/divisions" variant="primary">
                <span>{t.nav.divisions}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.about.approachSteps.map((step) => (
              <div
                key={step.step}
                className="bg-white border border-slate-200 rounded-xl p-7"
              >
                <span className="font-mono-tabular text-xs font-semibold text-[#2563EB]">
                  {step.step}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-[#0F172A]">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm text-[#64748B] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
