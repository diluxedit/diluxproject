import {Mail, MessageCircle, Share2} from 'lucide-react';
import {Link} from 'react-router-dom';
import {useFirebase} from '../context/FirebaseContext';
import {useLanguage} from '../context/LanguageContext';
import {OFFICIAL_CONTACT} from '../data/contact';

export function Footer() {
  const {t} = useLanguage();
  const {divisions} = useFirebase();

  const navLinks = [
    {to: '/', label: t.nav.home},
    {to: '/about', label: t.nav.about},
    {to: '/divisions', label: t.nav.divisions},
    {to: '/services', label: t.nav.services},
    {to: '/products', label: t.nav.products},
    {to: '/projects', label: t.nav.projects},
    {to: '/insights', label: t.nav.insights},
    {to: '/contact', label: t.nav.contact},
  ];

  return (
    <footer className="bg-[#0B1428] text-slate-300 border-t border-[#142B4D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3.5 group">
              <span className="w-12 h-12 rounded-lg overflow-hidden bg-[#142B4D] shrink-0">
                <img
                  src={OFFICIAL_CONTACT.logoPath}
                  alt="DILUX GROUP Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-white tracking-tight">
                  {t.brand.name}
                </p>
                <p className="text-xs text-[#60A5FA]">{t.brand.fullName}</p>
              </div>
            </Link>
            <p className="text-sm font-medium text-white">{t.brand.tagline}</p>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t.footer.description}
            </p>
            <p className="text-xs text-slate-300 pt-1">
              <span className="text-[#60A5FA] font-medium">{t.brand.founderLabel}:</span>{' '}
              {t.brand.founderName} · {t.brand.founderRole}
            </p>
          </div>

          <div className="lg:col-span-3">
            <h2 className="font-display text-sm font-semibold text-white mb-4">
              {t.footer.navigationTitle}
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-display text-sm font-semibold text-white mb-4">
              {t.footer.divisionsTitle}
            </h2>
            <ul className="space-y-2.5 text-sm">
              {divisions.map((division) => (
                <li key={division.id}>
                  <Link
                    to={`/divisions/${division.slug}`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {division.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="font-display text-sm font-semibold text-white mb-4">
              {t.footer.contactTitle}
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={OFFICIAL_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-slate-300 hover:text-[#60A5FA] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#60A5FA] shrink-0" />
                  <span className="font-mono-tabular">{OFFICIAL_CONTACT.whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={OFFICIAL_CONTACT.emailUrl}
                  className="inline-flex items-center gap-2.5 text-slate-300 hover:text-[#60A5FA] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#60A5FA] shrink-0" />
                  <span>{OFFICIAL_CONTACT.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={OFFICIAL_CONTACT.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-slate-300 hover:text-[#60A5FA] transition-colors"
                >
                  <Share2 className="w-4 h-4 text-[#60A5FA] shrink-0" />
                  <span>{OFFICIAL_CONTACT.tiktokHandle}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>{t.brand.copyright}</p>
          <div className="flex items-center gap-5">
            <Link to="/admin" className="hover:text-[#60A5FA] transition-colors">
              {t.nav.admin}
            </Link>
            <span>{t.brand.fullName}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
