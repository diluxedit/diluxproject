import {CheckCircle2, Info, Mail, MessageCircle} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Button} from '../components/Button';
import {ContactChannels} from '../components/ContactChannels';
import {PageHead} from '../components/PageHead';
import {useLanguage} from '../context/LanguageContext';
import {OFFICIAL_CONTACT} from '../data/contact';
import type {ContactFormErrors, ContactFormValues} from '../types';
import {buildWhatsAppInquiryUrl, validateContactForm} from '../utils/validation';

export function ContactPage() {
  const {language, t} = useLanguage();
  const [searchParams] = useSearchParams();

  const [values, setValues] = useState<ContactFormValues>({
    fullName: '',
    email: '',
    subject: searchParams.get('subject') || '',
    message: '',
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [validatedSubmission, setValidatedSubmission] = useState<ContactFormValues | null>(null);

  useEffect(() => {
    const subjectParam = searchParams.get('subject');
    if (subjectParam) {
      setValues((prev) => ({...prev, subject: subjectParam}));
    }
  }, [searchParams]);

  const handleChange =
    (field: keyof ContactFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue = e.target.value;
      setValues((prev) => ({...prev, [field]: nextValue}));
      if (errors[field]) {
        setErrors((prev) => ({...prev, [field]: undefined}));
      }
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateContactForm(values, language);
    if (!result.isValid) {
      setErrors(result.errors);
      setValidatedSubmission(null);
      return;
    }
    setErrors({});
    setValidatedSubmission({...values});
  };

  const buildMailtoHref = (payload: ContactFormValues) => {
    const body = `${payload.message.trim()}\n\n—\n${payload.fullName.trim()} (${payload.email.trim()})`;
    return `${OFFICIAL_CONTACT.emailUrl}?subject=${encodeURIComponent(
      payload.subject.trim()
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <PageHead title={t.contact.pageTitle} description={t.contact.pageDescription} />

      <section className="bg-[#0B1428] text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-wider text-[#60A5FA] mb-3">
            {t.contact.headerKicker}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl">
            {t.contact.headerTitle}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            {t.contact.headerSubtitle}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-5 space-y-5">
            <h2 className="font-display text-xl font-bold text-[#0F172A]">
              {t.contact.channelsTitle}
            </h2>
            <ContactChannels />
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-[#0F172A]">
              {t.contact.formTitle}
            </h2>
            <p className="mt-1.5 text-sm text-[#64748B]">{t.contact.formSubtitle}</p>

            <div className="mt-5 rounded-xl bg-[#F1F5F9] border border-slate-200 p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-[#0F172A]">
                  {t.contact.formNoticeTitle}
                </p>
                <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
                  {t.contact.formNoticeBody}
                </p>
              </div>
            </div>

            {validatedSubmission ? (
              <div
                role="status"
                className="mt-6 rounded-xl bg-[#F1F5F9] border border-[#2563EB]/30 p-6 space-y-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-base font-bold text-[#0F172A]">
                      {t.contact.demoConfirmedTitle}
                    </h3>
                    <p className="mt-1 text-sm text-[#64748B] leading-relaxed">
                      {t.contact.demoConfirmedBody}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-white border border-slate-200 p-4 text-xs text-[#0F172A] space-y-1">
                  <p>
                    <span className="text-[#64748B]">{t.contact.fullNameLabel}: </span>
                    <span className="font-medium">{validatedSubmission.fullName}</span>
                  </p>
                  <p>
                    <span className="text-[#64748B]">{t.contact.emailLabel}: </span>
                    <span className="font-medium">{validatedSubmission.email}</span>
                  </p>
                  <p>
                    <span className="text-[#64748B]">{t.contact.subjectLabel}: </span>
                    <span className="font-medium">{validatedSubmission.subject}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    href={buildWhatsAppInquiryUrl(validatedSubmission, language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>{t.contact.sendViaWhatsApp}</span>
                  </Button>
                  <Button href={buildMailtoHref(validatedSubmission)} variant="outline">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    <span>{t.contact.sendViaEmail}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setValidatedSubmission(null)}
                  >
                    {t.contact.resetForm}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-fullName"
                      className="block text-sm font-medium text-[#0F172A] mb-1.5"
                    >
                      {t.contact.fullNameLabel}
                    </label>
                    <input
                      id="contact-fullName"
                      name="fullName"
                      type="text"
                      value={values.fullName}
                      onChange={handleChange('fullName')}
                      placeholder={t.contact.fullNamePlaceholder}
                      aria-invalid={Boolean(errors.fullName)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-[#0F172A] mb-1.5"
                    >
                      {t.contact.emailLabel}
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange('email')}
                      placeholder={t.contact.emailPlaceholder}
                      aria-invalid={Boolean(errors.email)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-sm font-medium text-[#0F172A] mb-1.5"
                  >
                    {t.contact.subjectLabel}
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={values.subject}
                    onChange={handleChange('subject')}
                    placeholder={t.contact.subjectPlaceholder}
                    aria-invalid={Boolean(errors.subject)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                  {errors.subject && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-[#0F172A] mb-1.5"
                  >
                    {t.contact.messageLabel}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={values.message}
                    onChange={handleChange('message')}
                    placeholder={t.contact.messagePlaceholder}
                    aria-invalid={Boolean(errors.message)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 resize-y"
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" size="lg">
                    {t.contact.submitButton}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
