import {useEffect, useState} from 'react';
import {useFirebase} from '../context/FirebaseContext';
import {useLanguage} from '../context/LanguageContext';
import {INTRO_SESSION_KEY, getEntranceTimings} from '../utils/entrance';
import {SafeImage} from './SafeImage';

interface EntranceCurtainProps {
  play: boolean;
  onComplete: () => void;
}

export function EntranceCurtain({play, onComplete}: EntranceCurtainProps) {
  const {homeSettings} = useFirebase();
  const {t} = useLanguage();
  const [phase, setPhase] = useState<'enter' | 'exit' | 'done'>(play ? 'enter' : 'done');

  useEffect(() => {
    if (!play) {
      setPhase('done');
      onComplete();
      return;
    }

    const timings = getEntranceTimings(true);
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      // Ignore storage access errors in restricted frames
    }

    const exitTimer = window.setTimeout(() => {
      setPhase('exit');
    }, timings.curtainHoldMs);

    const doneTimer = window.setTimeout(() => {
      setPhase('done');
      onComplete();
    }, timings.curtainTotalMs);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [play, onComplete]);

  if (phase === 'done') {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      data-testid="entrance-curtain"
      data-phase={phase}
      className={`fixed inset-0 z-[70] pointer-events-none flex items-center justify-center dilux-curtain-surface transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        phase === 'exit'
          ? 'opacity-0 -translate-y-4 scale-[1.015]'
          : 'opacity-100 translate-y-0 scale-100'
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(96, 165, 250, 0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(96, 165, 250, 0.14) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative flex flex-col items-center text-center px-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden liquid-glass-dark p-1.5 shadow-2xl dilux-curtain-logo">
          <SafeImage
            src={homeSettings.brandLogoUrl}
            alt={t.brand.name}
            className="w-full h-full object-cover rounded-xl"
            eager
          />
        </div>

        <p className="mt-5 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white dilux-curtain-text">
          {t.brand.name}
        </p>
        <p className="mt-1.5 text-xs sm:text-sm font-medium tracking-wider text-[#93C5FD] dilux-curtain-sub">
          {t.brand.tagline}
        </p>

        <div className="mt-6 w-40 h-0.5 rounded-full bg-white/15 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-white dilux-curtain-bar origin-left" />
        </div>
      </div>
    </div>
  );
}
