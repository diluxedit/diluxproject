export const INTRO_SESSION_KEY = 'dilux_intro_seen_v1';

export interface EntranceEvaluationInput {
  reducedMotion: boolean;
  alreadySeen: boolean;
  search?: string;
}

export interface EntranceTimings {
  curtainHoldMs: number;
  curtainFadeMs: number;
  curtainTotalMs: number;
  heroBaseDelayMs: number;
}

export function shouldPlayInitialEntrance({
  reducedMotion,
  alreadySeen,
  search = '',
}: EntranceEvaluationInput): boolean {
  if (reducedMotion || alreadySeen) {
    return false;
  }
  if (search) {
    const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
    if (params.get('skipIntro') === '1' || params.get('autostart') === '1') {
      return false;
    }
  }
  return true;
}

export function getEntranceTimings(playCurtain: boolean): EntranceTimings {
  if (!playCurtain) {
    return {
      curtainHoldMs: 0,
      curtainFadeMs: 0,
      curtainTotalMs: 0,
      heroBaseDelayMs: 40,
    };
  }
  return {
    curtainHoldMs: 700,
    curtainFadeMs: 480,
    curtainTotalMs: 1180,
    heroBaseDelayMs: 680,
  };
}

export function computeStaggerDelayMs(
  index: number,
  baseMs = 0,
  stepMs = 65,
  maxMs = 260
): number {
  const safeIndex = Number.isFinite(index) ? Math.max(0, Math.floor(index)) : 0;
  return Math.min(baseMs + safeIndex * stepMs, maxMs);
}

/**
 * Returns true once an element enters the active viewport reveal zone (at least
 * `offsetPx` inside the bottom edge) or has already been scrolled past above.
 * Elements still below the viewport return false so they wait until scrolled to.
 */
export function isElementInRevealRange(
  top: number,
  bottom: number,
  viewportHeight: number,
  offsetPx = 36
): boolean {
  if (!Number.isFinite(top) || !Number.isFinite(bottom) || !Number.isFinite(viewportHeight)) {
    return true;
  }
  if (viewportHeight <= 0) {
    return true;
  }
  // Element already above viewport -> never trap hidden
  if (bottom < 0) {
    return true;
  }
  return top <= viewportHeight - offsetPx;
}
