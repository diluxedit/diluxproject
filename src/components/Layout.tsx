import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {
  INTRO_SESSION_KEY,
  getEntranceTimings,
  shouldPlayInitialEntrance,
} from '../utils/entrance';
import {BackToTopButton} from './BackToTopButton';
import {EntranceCurtain} from './EntranceCurtain';
import {Footer} from './Footer';
import {Navbar} from './Navbar';

export function Layout({children}: {children: React.ReactNode}) {
  const {pathname, search} = useLocation();
  const initialPathnameRef = useRef(pathname);

  const [playInitialIntro] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const reducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(INTRO_SESSION_KEY) === '1';
    } catch {
      alreadySeen = false;
    }
    return shouldPlayInitialEntrance({
      reducedMotion,
      alreadySeen,
      search: window.location.search || search,
    });
  });

  const [introDone, setIntroDone] = useState(!playInitialIntro);

  const handleCurtainComplete = useCallback(() => {
    setIntroDone(true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isInitialRoute = pathname === initialPathnameRef.current && !introDone;
  const heroBaseDelayMs = getEntranceTimings(isInitialRoute && playInitialIntro).heroBaseDelayMs;

  return (
    <div
      className="min-h-screen flex flex-col bg-white text-[#0F172A]"
      style={{'--dilux-hero-base': `${heroBaseDelayMs}ms`} as React.CSSProperties}
    >
      <EntranceCurtain play={playInitialIntro} onComplete={handleCurtainComplete} />
      <Navbar />
      <main className="flex-1">
        <div key={pathname} className="dilux-route-enter">
          {children}
        </div>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
}
