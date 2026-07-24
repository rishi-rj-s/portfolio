import { Injectable, PLATFORM_ID, inject, afterNextRender, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type ScrollListener = (payload: { progress: number; scroll: number }) => void;

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private ngZone = inject(NgZone);
  private lenis: any = null;
  private initStarted = false;
  private readyPromise: Promise<void> | null = null;
  private resolveReady: (() => void) | null = null;
  private listeners = new Set<ScrollListener>();
  private scrollTriggerUpdate: (() => void) | null = null;
  private rafId = 0;

  constructor() {
    if (this.isBrowser) {
      this.readyPromise = new Promise<void>((resolve) => {
        this.resolveReady = resolve;
      });

      // Start Lenis immediately — delayed boot felt like native jank then a sudden takeover
      afterNextRender(() => {
        void this.init();
      });
    }
  }

  /** Resolves once Lenis is running (or failed). */
  whenReady(): Promise<void> {
    return this.readyPromise ?? Promise.resolve();
  }

  private async init() {
    if (!this.isBrowser || this.initStarted) return;
    this.initStarted = true;

    try {
      const { default: Lenis } = await import('lenis');

      this.ngZone.runOutsideAngular(() => {
        this.lenis = new Lenis({
          duration: 1.15,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.4,
          infinite: false,
          autoRaf: false,
        });

        document.documentElement.classList.add('lenis');

        this.lenis.on('scroll', (instance: { progress: number; scroll: number }) => {
          // Keep GSAP pin/scrub in lockstep with Lenis
          this.scrollTriggerUpdate?.();
          for (const listener of this.listeners) {
            listener({ progress: instance.progress, scroll: instance.scroll });
          }
        });

        const raf = (time: number) => {
          this.lenis?.raf(time);
          this.rafId = requestAnimationFrame(raf);
        };
        this.rafId = requestAnimationFrame(raf);
      });
    } catch (error) {
      console.error('Failed to initialize Lenis:', error);
    } finally {
      this.resolveReady?.();
      this.resolveReady = null;
    }
  }

  /**
   * Projects / GSAP should register ScrollTrigger.update here so pin scrub
   * stays synced with the smooth scroller.
   */
  setScrollTriggerUpdate(fn: (() => void) | null) {
    this.scrollTriggerUpdate = fn;
  }

  /** Subscribe outside Angular zone for rAF-friendly UI (no signal CD). */
  onScroll(listener: ScrollListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getLenis() {
    return this.lenis;
  }

  public scrollTo(target: string | HTMLElement | number, options?: any) {
    if (!this.isBrowser) return;

    if (this.lenis) {
      this.lenis.scrollTo(target, { offset: 0, ...options });
      return;
    }

    // Lenis still booting — queue once ready
    void this.whenReady().then(() => {
      if (this.lenis) {
        this.lenis.scrollTo(target, { offset: 0, ...options });
        return;
      }
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
        return;
      }
      const el =
        typeof target === 'string' ? document.querySelector(target) : target;
      if (el instanceof HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  public stop() {
    this.lenis?.stop();
  }

  public start() {
    this.lenis?.start();
  }

  public destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.lenis?.destroy();
    this.lenis = null;
    this.scrollTriggerUpdate = null;
    this.listeners.clear();
    if (this.isBrowser) {
      document.documentElement.classList.remove('lenis');
    }
  }
}
