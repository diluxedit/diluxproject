import {ArrowUp} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useLanguage} from '../context/LanguageContext';

export function BackToTopButton() {
  const {t} = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 360);
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) {
    return null;
  }

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={t.nav.backToTop}
      className="fixed bottom-6 right-6 z-30 w-11 h-11 rounded-xl liquid-glass-dark liquid-glass-dark-interactive text-white flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
    >
      <ArrowUp className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}
