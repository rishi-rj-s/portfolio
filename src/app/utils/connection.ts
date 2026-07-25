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
