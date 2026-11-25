import {useLanguage} from '../context/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
  dark?: boolean;
}

export function LanguageSwitcher({className = '', dark = false}: LanguageSwitcherProps) {
  const {language, setLanguage} = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className={`inline-flex items-center p-0.5 rounded-lg border shrink-0 ${
        dark
          ? 'bg-[#142B4D] border-[#1E3A5F]'
          : 'bg-[#F1F5F9] border-slate-200'
      } ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage('id')}
        aria-pressed={language === 'id'}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2563EB] ${
          language === 'id'
            ? dark
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-[#0B1428] text-white shadow-xs'
            : dark
              ? 'text-slate-300 hover:text-white'
              : 'text-[#64748B] hover:text-[#0F172A]'
        }`}
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2563EB] ${
          language === 'en'
            ? dark
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-[#0B1428] text-white shadow-xs'
            : dark
              ? 'text-slate-300 hover:text-white'
              : 'text-[#64748B] hover:text-[#0F172A]'
        }`}
      >
        EN
      </button>
    </div>
  );
}
