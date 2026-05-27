import { Component, PLATFORM_ID, inject, afterNextRender, Injector, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector';
import { Theme } from './services/theme';

import { Footer } from './components/footer/footer';
import { WebglBackgroundComponent } from './components/webgl-background/webgl-background';
import { LoaderService } from './services/loader';
import { printAsciiArt } from './utils/console-art';
import { ScrollService } from './services/scroll';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar,
    Footer,
    WebglBackgroundComponent,
    ThemeSelectorComponent
  ],
  template: `
    <!-- Wild Scroll Indicator (Perimeter) -->
    <svg 
      class="fixed inset-0 w-full h-full pointer-events-none z-[9999] overflow-visible" 
      fill="none"
      [attr.viewBox]="'0 0 ' + windowSize().w + ' ' + windowSize().h"
    >
      <path 
        [attr.d]="pathD()" 
        stroke="var(--color-primary)" 
        stroke-width="8" 
        stroke-linecap="round"
        stroke-linejoin="round"
        [style.stroke-dasharray]="dashArray()"
        [style.stroke-dashoffset]="dashOffset()"
        class="transition-[stroke-dashoffset] duration-100 ease-out opacity-90 filter drop-shadow-[0_0_8px_var(--color-primary)]"
      />
    </svg>

    <app-webgl-background />
    <div class="noise-overlay"></div>

    <!-- Global Theme Selector -->
    @if (theme.isSelectorOpen()) {
      <app-theme-selector (close)="theme.closeSelector()" />
    }
    
    <div class="relative min-h-screen z-10">
      <app-navbar />
      <div class="relative">
        <router-outlet />
      </div>
      <app-footer />
    </div>
  `
})
export class App {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  public theme = inject(Theme);
  private loaderService = inject(LoaderService);
  private scrollService = inject(ScrollService); // Injected to initialize Lenis smooth scroll
  
  // State for wild scrollbar
  windowSize = signal({ w: 0, h: 0 });
  scrollProgress = signal(0);
  
  // Computed path properties
  pathD = computed(() => {
    const { w, h } = this.windowSize();
    if (w === 0 || h === 0) return '';
    const p = 4; // Padding to ensure stroke stays inside viewport on all screens
    const iw = w - p;
    const ih = h - p;
    
    // Full Perimeter Path Clockwise: Top-Middle -> Top-Right -> Bottom-Right -> Bottom-Left -> Top-Left -> Top-Middle
    return `
      M ${w/2}, ${p}
      L ${iw}, ${p}
      L ${iw}, ${ih}
      L ${p}, ${ih}
      L ${p}, ${p}
      L ${w/2}, ${p}
    `;
  });

  pathLength = computed(() => {
    const { w, h } = this.windowSize();
    if (w === 0 || h === 0) return 0;
    const p = 4;
    // 2 * width + 2 * height - corners
    return 2 * (w - 2 * p) + 2 * (h - 2 * p);
  });

  dashArray = computed(() => {
    const total = this.pathLength();
    const thumbLen = 240; 
    // Dash and Gap must add exactly to total for seamless infinite loops
    return `${thumbLen} ${Math.max(0, total - thumbLen)}`;
  });

  dashOffset = computed(() => {
    const total = this.pathLength();
    // 4 full continuous loops around the screen
    return -this.scrollProgress() * total * 4;
  });

  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser) return;

      // Track window size and scroll for wild scrollbar
      this.updateDimensions();
      window.addEventListener('resize', () => this.updateDimensions());
      
      // Lenis fires smooth scroll, so we hook into it if we can, or just use window scroll
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      
      printAsciiArt();
      
      const loader = document.getElementById('app-loader');
      if (!loader) return;

      const dismissLoader = () => {
        console.log('Finalizing initialization...');
        document.documentElement.classList.add('app-loaded');
        loader.classList.add('fade-out');
        
        // Remove after transition
        setTimeout(() => {
          loader.remove();
          console.log('Loader removed from DOM.');
        }, 1200);
      };

      // 1. Fonts (Reduced timeout to 2s)
      const fontsPromise = Promise.race([
        document.fonts.ready,
        new Promise<void>(resolve => setTimeout(resolve, 2000))
      ]).then(() => this.loaderService.updateStatus('FONTS LOADED'));

      // 2. Resources (Reduced timeout to 2.5s)
      const resourcesPromise = new Promise<void>(resolve => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', () => resolve(), { once: true });
          setTimeout(resolve, 2500); 
        }
      }).then(() => this.loaderService.updateStatus('RESOURCES READY'));

      // 3. WebGL (Reduced timeout to 3s)
      const webglPromise = new Promise<void>(resolve => {
        const start = Date.now();
        const check = () => {
          if (this.loaderService.webglReady() || (Date.now() - start > 3000)) {
            resolve();
          } else {
            requestAnimationFrame(check); // Smoother polling
          }
        };
        check();
      }).then(() => this.loaderService.updateStatus('GRAPHICS READY'));

      // 4. Global Safety (Absolute limit 4s)
      const safetyTimeout = new Promise<void>(resolve => setTimeout(resolve, 4000));

      Promise.race([
        Promise.all([fontsPromise, resourcesPromise, webglPromise]),
        safetyTimeout
      ]).then(() => {
        this.loaderService.updateStatus('SYSTEM READY');
        // Small delay for the "SYSTEM READY" text to be seen
        setTimeout(dismissLoader, 400);
      }).catch(err => {
        console.error('Boot error:', err);
        dismissLoader();
      });
      
      // Secondary deferrals
      setTimeout(() => {
        import('tagtics-client').then(({ default: Tagtics }) => {
          Tagtics.init({ apiKey: 'none', testingMode: true });
        });
      }, 3000);
    });
  }

  updateDimensions() {
    this.windowSize.set({ w: window.innerWidth, h: window.innerHeight });
  }

  onScroll() {
    // Try to get Lenis progress first for the most accurate reading on mobile
    const lenis = this.scrollService.getLenis();
    if (lenis && typeof lenis.progress === 'number') {
      this.scrollProgress.set(Math.max(0, Math.min(1, lenis.progress)));
      return;
    }

    // Fallback manual calculation based on full document scroll
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = window.scrollY / scrollHeight;
    this.scrollProgress.set(isNaN(progress) ? 0 : Math.max(0, Math.min(1, progress)));
  }
}