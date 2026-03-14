import { Injectable, PLATFORM_ID, inject, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private lenis: any = null;

  constructor() {
    if (this.isBrowser) {
      // Use afterNextRender to ensure we're fully in the browser 
      // and initial rendering is complete
      afterNextRender(() => {
        this.init();
      });
    }
  }

  private async init() {
    try {
      // Dynamic import to keep the server from trying to load browser-only code
      const { default: Lenis } = await import('lenis');
      
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      const raf = (time: number) => {
        this.lenis?.raf(time);
        requestAnimationFrame(raf);
      };

      requestAnimationFrame(raf);
      console.log('Lenis initialized smoothly 🚀');
    } catch (error) {
      console.error('Failed to initialize Lenis:', error);
    }
  }

  public getLenis() {
    return this.lenis;
  }

  public scrollTo(target: string | HTMLElement | number, options?: any) {
    if (!this.isBrowser || !this.lenis) return;
    this.lenis.scrollTo(target, options);
  }

  public stop() {
    if (!this.isBrowser || !this.lenis) return;
    this.lenis.stop();
  }

  public start() {
    if (!this.isBrowser || !this.lenis) return;
    this.lenis.start();
  }

  public destroy() {
    if (!this.isBrowser || !this.lenis) return;
    this.lenis.destroy();
    this.lenis = null;
  }
}
