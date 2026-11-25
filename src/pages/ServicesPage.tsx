import {Check, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Button} from '../components/Button';
import {ServiceCard} from '../components/Cards';
import {ServiceIcon} from '../components/Icons';
import {PageHead} from '../components/PageHead';
import {useFirebase} from '../context/FirebaseContext';
import {useLanguage} from '../context/LanguageContext';
import type {DivisionId, ServiceItem} from '../types';
import {filterServicesByDivision} from '../utils/filters';

export function ServicesPage() {
  const {language, t, localize} = useLanguage();
  const {divisions, services} = useFirebase();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeDivision, setActiveDivision] = useState<DivisionId | 'All'>('All');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    const focusId = searchParams.get('focus');
    if (focusId) {
      const match = services.find((s) => s.id === focusId);
      if (match) {
        setSelectedService(match);
      }
    }
  }, [searchParams, services]);

  const filteredServices = filterServicesByDivision(services, activeDivision);

  const closeDetail = () => {
    setSelectedService(null);
    if (searchParams.has('focus')) {
      searchParams.delete('focus');
      setSearchParams(searchParams, {replace: true});
    }
  };

  return (
    <>
      <PageHead title={t.services.pageTitle} description={t.services.pageDescription} />

      <section className="bg-[#0B1428] text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-wider text-[#60A5FA] mb-3">
            {t.services.headerKicker}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl">
            {t.services.headerTitle}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            {t.services.headerSubtitle}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <p className="text-sm font-medium text-[#64748B]">
              {t.services.filterByDivision}
            </p>
            <div
              role="group"
              aria-label={t.services.filterByDivision}
              className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl"
            >
              <button
                type="button"
                onClick={() => setActiveDivision('All')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeDivision === 'All'
                    ? 'bg-[#0B1428] text-white'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {t.common.allCategories}
              </button>
              {divisions.map((div) => (
                <button
                  key={div.id}
                  type="button"
                  onClick={() => setActiveDivision(div.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeDivision === div.id
                      ? 'bg-[#0B1428] text-white'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {div.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onLearnMore={(item) => setSelectedService(item)}
              />
            ))}
          </div>

          <p className="mt-10 text-sm text-[#64748B] border-t border-slate-200 pt-6">
            {t.services.transparencyNote}
          </p>
        </div>
      </section>

      {selectedService && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-detail-title"
          className="fixed inset-0 z-50 bg-[#0B1428]/70 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0B1428] text-[#60A5FA] flex items-center justify-center shrink-0">
                  <ServiceIcon name={selectedService.icon} className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#2563EB]">
                    {divisions.find((d) => d.id === selectedService.divisionId)?.name}
                  </p>
                  <h2
                    id="service-detail-title"
                    className="font-display text-xl font-bold text-[#0F172A]"
                  >
                    {localize(selectedService.name)}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDetail}
                aria-label={t.products.closeDetail}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-4 text-sm text-[#64748B] leading-relaxed">
              {localize(selectedService.shortDescription)}
            </p>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <h3 className="text-xs font-semibold tracking-wider text-[#0F172A] mb-3">
                {t.services.scopeLabel}
              </h3>
              <ul className="space-y-2">
                {selectedService.scopeDetails[language].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-[#0F172A]">
                    <Check className="w-4 h-4 text-[#2563EB] shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 flex items-center justify-end gap-3">
              <Button variant="outline" onClick={closeDetail}>
                {t.products.closeDetail}
              </Button>
              <Button
                to={`/contact?subject=${encodeURIComponent(localize(selectedService.name))}`}
                variant="primary"
              >
                {t.common.contactUs}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
