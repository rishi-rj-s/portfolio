import { Injectable, PLATFORM_ID, inject, afterNextRender, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type ScrollListener = (payload: { progress: number }) => void;

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
      const isTouchOrMobile = window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024);

      // On mobile / touch devices, disable Lenis touch interception to rely on native hardware scroller
      if (isTouchOrMobile) {
        this.ngZone.runOutsideAngular(() => {
          window.addEventListener('scroll', () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = totalScroll > 0 ? window.scrollY / totalScroll : 0;
            this.scrollTriggerUpdate?.();
            for (const listener of this.listeners) {
              listener({ progress });
            }
          }, { passive: true });
        });
        return;
      }

      const { default: Lenis } = await import('lenis');

      this.ngZone.runOutsideAngular(() => {
        this.lenis = new Lenis({
          duration: 1.15,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 0.9,
          touchMultiplier: 0,
          infinite: false,
          autoRaf: false,
        });

        this.lenis.on('scroll', (instance: { progress: number }) => {
          // Keep GSAP pin/scrub in lockstep with Lenis
          this.scrollTriggerUpdate?.();
          for (const listener of this.listeners) {
            listener({ progress: instance.progress });
          }
        });

        const raf = (time: number) => {
          this.lenis?.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
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
}
