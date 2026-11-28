import React, {useEffect, useRef, useState} from 'react';
import {computeStaggerDelayMs, isElementInRevealRange} from '../utils/entrance';

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delayIndex?: number;
  baseDelayMs?: number;
  immediate?: boolean;
  variant?: 'up' | 'scale';
}

export function RevealSection({
  children,
  className = '',
  delayIndex = 0,
  baseDelayMs = 0,
  immediate = false,
  variant = 'up',
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(() => {
    if (immediate || typeof window === 'undefined') {
      return true;
    }
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  });

  useEffect(() => {
    if (visible) {
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const checkInViewport = () => {
      const rect = node.getBoundingClientRect();
      if (isElementInRevealRange(rect.top, rect.bottom, window.innerHeight, 36)) {
        setVisible(true);
        return true;
      }
      return false;
    };

    if (checkInViewport()) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      {
        rootMargin: '0px 0px -36px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(node);

    const onScrollOrResize = () => {
      if (checkInViewport()) {
        observer.disconnect();
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
      }
    };
    window.addEventListener('scroll', onScrollOrResize, {passive: true});
    window.addEventListener('resize', onScrollOrResize, {passive: true});

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [visible]);

  const delayMs = computeStaggerDelayMs(delayIndex, baseDelayMs, 65, 260);
  const variantClass = variant === 'scale' ? 'dilux-reveal-scale' : '';

  return (
    <div
      ref={ref}
      style={delayMs > 0 ? {transitionDelay: `${delayMs}ms`} : undefined}
      className={`dilux-reveal ${variantClass} ${visible ? 'dilux-reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
