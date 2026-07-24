/**
 * Whether to load heavy decorative graphics (WebGL / ambient canvases).
 * Only skips on truly constrained conditions — not ordinary 3G/4G.
 */
export function shouldLoadHeavyGraphics(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return true;
  }

  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
  } catch {
    // ignore
  }

  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;

  if (conn?.saveData) {
    return false;
  }

  // Only extreme networks — DevTools "Slow 3G" often reports 3g and was hiding the whole visual system
  const type = conn?.effectiveType;
  if (type === 'slow-2g' || type === '2g') {
    return false;
  }

  return true;
}

export function scheduleIdle(task: () => void, timeoutMs = 2500): void {
  if (typeof window === 'undefined') return;

  const ric = (
    window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }
  ).requestIdleCallback;

  if (typeof ric === 'function') {
    ric(task, { timeout: timeoutMs });
  } else {
    setTimeout(task, Math.min(timeoutMs, 1200));
  }
}
