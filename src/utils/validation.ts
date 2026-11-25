import type {ContactFormErrors, ContactFormValues, Language} from '../types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(
  values: ContactFormValues,
  lang: Language
): {isValid: boolean; errors: ContactFormErrors} {
  const errors: ContactFormErrors = {};
  const trimmedName = values.fullName.trim();
  const trimmedEmail = values.email.trim();
  const trimmedSubject = values.subject.trim();
  const trimmedMessage = values.message.trim();

  if (trimmedName.length < 2) {
    errors.fullName =
      lang === 'id'
        ? 'Nama lengkap minimal 2 karakter.'
        : 'Full name must be at least 2 characters.';
  } else if (trimmedName.length > 120) {
    errors.fullName =
      lang === 'id'
        ? 'Nama lengkap maksimal 120 karakter.'
        : 'Full name must be at most 120 characters.';
  }

  if (!EMAIL_REGEX.test(trimmedEmail) || trimmedEmail.length < 5 || trimmedEmail.length > 200) {
    errors.email =
      lang === 'id'
        ? 'Masukkan alamat email yang valid (maksimal 200 karakter).'
        : 'Please enter a valid email address (max 200 characters).';
  }

  if (trimmedSubject.length < 3) {
    errors.subject =
      lang === 'id'
        ? 'Subjek pesan minimal 3 karakter.'
        : 'Subject must be at least 3 characters.';
  } else if (trimmedSubject.length > 200) {
    errors.subject =
      lang === 'id'
        ? 'Subjek pesan maksimal 200 karakter.'
        : 'Subject must be at most 200 characters.';
  }

  if (trimmedMessage.length < 10) {
    errors.message =
      lang === 'id'
        ? 'Pesan minimal 10 karakter agar konteksnya jelas.'
        : 'Message must be at least 10 characters for clear context.';
  } else if (trimmedMessage.length > 4000) {
    errors.message =
      lang === 'id'
        ? 'Pesan maksimal 4000 karakter.'
        : 'Message must be at most 4000 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildWhatsAppInquiryUrl(
  values: ContactFormValues,
  lang: Language,
  whatsappNumberInternational = '6285900423380'
): string {
  const greeting =
    lang === 'id'
      ? 'Halo DILUX GROUP, saya ingin berdiskusi mengenai:'
      : 'Hello DILUX GROUP, I would like to discuss:';

  const lines = [
    greeting,
    '',
    `${lang === 'id' ? 'Nama' : 'Name'}: ${values.fullName.trim()}`,
    `Email: ${values.email.trim()}`,
    `${lang === 'id' ? 'Subjek' : 'Subject'}: ${values.subject.trim()}`,
    `${lang === 'id' ? 'Pesan' : 'Message'}: ${values.message.trim()}`,
  ];

  const encoded = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${whatsappNumberInternational}?text=${encoded}`;
}
