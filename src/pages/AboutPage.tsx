import {ArrowRight} from 'lucide-react';
import {Button} from '../components/Button';
import {PageHead} from '../components/PageHead';
import {RevealSection} from '../components/RevealSection';
import {SafeImage} from '../components/SafeImage';
import {SectionHeader} from '../components/SectionHeader';
import {useFirebase} from '../context/FirebaseContext';
import {useLanguage} from '../context/LanguageContext';

export function AboutPage() {
  const {t} = useLanguage();
  const {homeSettings} = useFirebase();

  return (
    <>
      <PageHead title={t.about.pageTitle} description={t.about.pageDescription} />

      {/* Page Banner */}
      <section className="dilux-glass-canvas-dark text-white py-14 sm:py-20">
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
      <section className="py-16 sm:py-20 dilux-glass-canvas-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <RevealSection delayIndex={0}>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
                {t.about.overviewTitle}
              </h2>
              <p className="mt-4 text-base text-[#0F172A] leading-relaxed">
                {t.about.overviewBody1}
              </p>
              <p className="mt-3 text-base text-[#64748B] leading-relaxed">
                {t.about.overviewBody2}
              </p>
            </RevealSection>

            <RevealSection delayIndex={1} className="pt-8 border-t border-slate-200/80">
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#0F172A]">
                {t.about.philosophyTitle}
              </h2>
              <p className="mt-3 text-base text-[#64748B] leading-relaxed">
                {t.about.philosophyBody}
              </p>
            </RevealSection>

            <RevealSection delayIndex={2} className="pt-8 border-t border-slate-200/80">
              <p className="text-xs font-semibold tracking-wider text-[#2563EB] mb-2">
                {t.about.founderKicker}
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#0F172A]">
                {t.about.founderTitle}
              </h2>
              <p className="mt-1 text-sm font-semibold text-[#142B4D]">
                {t.about.founderAffiliation}
              </p>
              <p className="mt-3 text-base text-[#64748B] leading-relaxed">
                {t.about.founderSummary}
              </p>
            </RevealSection>
          </div>

          <RevealSection delayIndex={1} variant="scale" className="lg:col-span-5 relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#2563EB]/25 via-[#60A5FA]/15 to-[#0B1428]/20 blur-xl pointer-events-none"
            />
            <div className="relative rounded-2xl bg-[#0B1428]/90 backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_22px_48px_-14px_rgba(11,20,40,0.45)] p-8 sm:p-10 text-white text-center flex flex-col items-center">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border border-white/20 shadow-lg mb-5">
                <SafeImage
                  src={homeSettings.brandLogoUrl}
                  alt="DILUX GROUP Official Brand Logo"
                  className="w-full h-full object-cover"
                  eager
                />
              </div>
              <p className="font-display text-xl font-bold">{t.brand.name}</p>
              <p className="text-sm text-[#60A5FA] mt-1">{t.brand.fullName}</p>
              <p className="text-sm text-slate-300 mt-4">{t.brand.tagline}</p>

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
      </section>

      {/* Vision & Mission */}
      <section className="py-16 sm:py-20 dilux-glass-canvas-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <RevealSection delayIndex={0} variant="scale" className="lg:col-span-5 flex">
            <div className="w-full dilux-glass-canvas-dark text-white rounded-2xl p-8 sm:p-10 flex flex-col justify-between border border-white/15 shadow-xl">
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
          </RevealSection>

          <RevealSection delayIndex={1} variant="scale" className="lg:col-span-7 flex">
            <div className="w-full liquid-glass-light rounded-2xl p-8 sm:p-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] mb-6">
              {t.about.missionTitle}
            </h2>
            <ol className="space-y-4">
              {t.about.missionItems.map((item, idx) => (
                <li
                  key={item}
                  className="flex items-start gap-4 pb-4 border-b border-slate-200/70 last:border-b-0 last:pb-0"
                >
                  <span className="font-mono-tabular text-sm font-semibold text-[#2563EB] shrink-0 pt-0.5">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span className="text-base text-[#0F172A] leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-20 dilux-glass-canvas-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <SectionHeader title={t.about.valuesTitle} />
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {t.about.values.map((val, idx) => (
              <RevealSection key={val.title} delayIndex={idx} variant="scale" className="flex">
                <div className="w-full liquid-glass-light liquid-glass-light-interactive rounded-2xl p-6 flex flex-col">
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
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 sm:py-20 dilux-glass-canvas-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <SectionHeader
              title={t.about.approachTitle}
              action={
                <Button to="/divisions" variant="primary">
                  <span>{t.nav.divisions}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              }
            />
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.about.approachSteps.map((step, idx) => (
              <RevealSection key={step.step} delayIndex={idx} variant="scale" className="flex">
                <div className="w-full liquid-glass-light liquid-glass-light-interactive rounded-2xl p-7">
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
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
