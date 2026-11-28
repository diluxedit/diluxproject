import {Menu, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {Link, NavLink, useLocation} from 'react-router-dom';
import {useFirebase} from '../context/FirebaseContext';
import {useLanguage} from '../context/LanguageContext';
import {LanguageSwitcher} from './LanguageSwitcher';
import {SafeImage} from './SafeImage';

export function Navbar() {
  const {t} = useLanguage();
  const {homeSettings} = useFirebase();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    {to: '/', label: t.nav.home, end: true},
    {to: '/about', label: t.nav.about},
    {to: '/divisions', label: t.nav.divisions},
    {to: '/services', label: t.nav.services},
    {to: '/products', label: t.nav.products},
    {to: '/projects', label: t.nav.projects},
    {to: '/insights', label: t.nav.insights},
    {to: '/contact', label: t.nav.contact},
  ];

  return (
    <header className="sticky top-0 z-40 w-full liquid-glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        <Link
          to="/"
          className="inline-flex items-center gap-3 whitespace-nowrap shrink-0 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60A5FA] rounded-md"
        >
          <span className="w-9 h-9 rounded-lg overflow-hidden bg-[#0B1428] shrink-0 flex items-center justify-center">
            <SafeImage
              src={homeSettings.brandLogoUrl}
              alt="DILUX GROUP Logo"
              className="w-full h-full object-cover"
              eager
            />
          </span>
          <span className="font-display text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
            {t.brand.name}
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-5 xl:gap-6"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({isActive}) =>
                `relative py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#60A5FA] ${
                  isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              {({isActive}) => (
                <>
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 right-0 -bottom-[18px] h-0.5 bg-gradient-to-r from-[#60A5FA] via-[#2563EB] to-[#60A5FA]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <LanguageSwitcher dark />
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t.nav.menuClose : t.nav.menuOpen}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl liquid-glass-control-dark text-white hover:bg-white/15 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60A5FA]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0B1428]/90 backdrop-blur-xl">
          <nav
            aria-label="Mobile navigation"
            className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({isActive}) =>
                  `px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#2563EB]/25 text-[#60A5FA] border border-white/15'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
