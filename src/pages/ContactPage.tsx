import {CheckCircle2, Loader2, Mail, MessageCircle, ShieldCheck} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Button} from '../components/Button';
import {ContactChannels} from '../components/ContactChannels';
import {PageHead} from '../components/PageHead';
import {RevealSection} from '../components/RevealSection';
import {useFirebase} from '../context/FirebaseContext';
import {useLanguage} from '../context/LanguageContext';
import {OFFICIAL_CONTACT} from '../data/contact';
import type {ContactFormErrors, ContactFormValues} from '../types';
import {buildWhatsAppInquiryUrl, validateContactForm} from '../utils/validation';

interface SubmittedMessageRecord {
  id: string;
  values: ContactFormValues;
}

export function ContactPage() {
  const {language, t} = useLanguage();
  const {submitContactMessage} = useFirebase();
  const [searchParams] = useSearchParams();

  const [values, setValues] = useState<ContactFormValues>({
    fullName: '',
    email: '',
    subject: searchParams.get('subject') || '',
    message: '',
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<SubmittedMessageRecord | null>(null);

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
      if (submitError) {
        setSubmitError('');
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateContactForm(values, language);
    if (!result.isValid) {
      setErrors(result.errors);
      setSubmittedRecord(null);
      return;
    }

    setErrors({});
    setSubmitError('');
    setSubmitting(true);
    try {
      const snapshotValues: ContactFormValues = {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      };
      const messageId = await submitContactMessage(snapshotValues, language, '/contact');
      setSubmittedRecord({id: messageId, values: snapshotValues});
      setValues({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch {
      setSubmitError(t.contact.submitError);
    } finally {
      setSubmitting(false);
    }
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

      <section className="dilux-glass-canvas-dark text-white py-14 sm:py-20">
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

      <section className="py-12 sm:py-16 dilux-glass-canvas-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <RevealSection delayIndex={0} className="lg:col-span-5 space-y-5">
            <h2 className="font-display text-xl font-bold text-[#0F172A]">
              {t.contact.channelsTitle}
            </h2>
            <ContactChannels />
          </RevealSection>

          <RevealSection delayIndex={1} variant="scale" className="lg:col-span-7">
            <div className="liquid-glass-light rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-[#0F172A]">
              {t.contact.formTitle}
            </h2>
            <p className="mt-1.5 text-sm text-[#64748B]">{t.contact.formSubtitle}</p>

            <div className="mt-5 rounded-xl bg-white/60 backdrop-blur-md border border-white/80 ring-1 ring-slate-900/5 p-4 flex items-start gap-3">
              <ShieldCheck
                className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-semibold text-[#0F172A]">
                  {t.contact.formNoticeTitle}
                </p>
                <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
                  {t.contact.formNoticeBody}
                </p>
              </div>
            </div>

            {submittedRecord ? (
              <div
                role="status"
                className="mt-6 rounded-xl bg-white/75 backdrop-blur-md border border-[#2563EB]/30 p-6 space-y-4 shadow-sm"
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

                <div className="rounded-xl bg-white/85 border border-slate-200/80 p-4 text-xs text-[#0F172A] space-y-1.5">
                  <p>
                    <span className="text-[#64748B]">{t.contact.referenceIdLabel}: </span>
                    <span className="font-mono-tabular font-semibold">{submittedRecord.id}</span>
                  </p>
                  <p>
                    <span className="text-[#64748B]">{t.contact.fullNameLabel}: </span>
                    <span className="font-medium">{submittedRecord.values.fullName}</span>
                  </p>
                  <p>
                    <span className="text-[#64748B]">{t.contact.emailLabel}: </span>
                    <span className="font-medium">{submittedRecord.values.email}</span>
                  </p>
                  <p>
                    <span className="text-[#64748B]">{t.contact.subjectLabel}: </span>
                    <span className="font-medium">{submittedRecord.values.subject}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    href={buildWhatsAppInquiryUrl(submittedRecord.values, language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>{t.contact.sendViaWhatsApp}</span>
                  </Button>
                  <Button href={buildMailtoHref(submittedRecord.values)} variant="outline">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    <span>{t.contact.sendViaEmail}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setSubmittedRecord(null)}
                  >
                    {t.contact.resetForm}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => void handleSubmit(e)} noValidate className="mt-6 space-y-5">
                {submitError && (
                  <div
                    role="alert"
                    className="rounded-lg bg-red-50/90 border border-red-200 p-3.5 text-xs text-red-700"
                  >
                    {submitError}
                  </div>
                )}

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
                      maxLength={120}
                      value={values.fullName}
                      onChange={handleChange('fullName')}
                      placeholder={t.contact.fullNamePlaceholder}
                      aria-invalid={Boolean(errors.fullName)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200/90 bg-white/80 backdrop-blur-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
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
                      maxLength={200}
                      value={values.email}
                      onChange={handleChange('email')}
                      placeholder={t.contact.emailPlaceholder}
                      aria-invalid={Boolean(errors.email)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200/90 bg-white/80 backdrop-blur-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
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
                    maxLength={200}
                    value={values.subject}
                    onChange={handleChange('subject')}
                    placeholder={t.contact.subjectPlaceholder}
                    aria-invalid={Boolean(errors.subject)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200/90 bg-white/80 backdrop-blur-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
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
                    maxLength={4000}
                    value={values.message}
                    onChange={handleChange('message')}
                    placeholder={t.contact.messagePlaceholder}
                    aria-invalid={Boolean(errors.message)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200/90 bg-white/80 backdrop-blur-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 resize-y"
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                    <span>
                      {submitting ? t.contact.submittingButton : t.contact.submitButton}
                    </span>
                  </Button>
                </div>
              </form>
            )}
            </div>
          </RevealSection>
        </div>
      </section>
    </>
  );
}
