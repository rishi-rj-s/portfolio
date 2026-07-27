import { Component, PLATFORM_ID, inject, afterNextRender, signal, computed, viewChild, ElementRef, NgZone, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector';
import { Theme } from './services/theme';
import { Footer } from './components/footer/footer';
import { WebglBackgroundComponent } from './components/webgl-background/webgl-background';
import { LoaderService } from './services/loader';
import { ScrollService } from './services/scroll';
import { scheduleIdle } from './utils/connection';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    Navbar,
    Footer,
    WebglBackgroundComponent,
    ThemeSelectorComponent
  ],
  template: `
    @if (showScrollIndicator()) {
      <svg
        class="fixed inset-0 w-full h-full pointer-events-none z-[9999] overflow-visible"
        fill="none"
        [attr.viewBox]="'0 0 ' + windowSize().w + ' ' + windowSize().h"
      >
        <path
          #scrollPath
          [attr.d]="pathD()"
          stroke="var(--color-primary)"
          stroke-width="8"
          stroke-linecap="round"
          stroke-linejoin="round"
          [attr.stroke-dasharray]="dashArray()"
          stroke-dashoffset="0"
          class="opacity-90"
        />
      </svg>
    }

    <app-webgl-background />

    <div class="noise-overlay"></div>

    @if (theme.isSelectorOpen()) {
      @defer {
        <app-theme-selector (close)="theme.closeSelector()" />
      }
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
export class App implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private ngZone = inject(NgZone);

  public theme = inject(Theme);
  private loaderService = inject(LoaderService);
  private scrollService = inject(ScrollService);

  scrollPath = viewChild<ElementRef<SVGPathElement>>('scrollPath');

  showScrollIndicator = signal(false);
  windowSize = signal({ w: 0, h: 0 });

  private unsubScroll: (() => void) | null = null;
  private pathLen = 0;

  pathD = computed(() => {
    const { w, h } = this.windowSize();
    if (w === 0 || h === 0) return '';
    const p = 4;
    const iw = w - p;
    const ih = h - p;

    return `
      M ${w/2}, ${p}
      L ${iw}, ${p}
      L ${iw}, ${ih}
      L ${p}, ${ih}
      L ${p}, ${p}
      L ${w/2}, ${p}
    `;
  });

  dashArray = computed(() => {
    const { w, h } = this.windowSize();
    if (w === 0 || h === 0) return '0 0';
    const p = 4;
    this.pathLen = 2 * (w - 2 * p) + 2 * (h - 2 * p);
    const thumbLen = 240;
    return `${thumbLen} ${Math.max(0, this.pathLen - thumbLen)}`;
  });

  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser) return;

      this.updateDimensions();
      window.addEventListener('resize', () => this.updateDimensions(), { passive: true });

      scheduleIdle(() => {
        this.showScrollIndicator.set(true);
        this.updateDimensions();
        // Bind Lenis → DOM (no Angular CD per frame)
        this.ngZone.runOutsideAngular(() => {
          this.unsubScroll = this.scrollService.onScroll(({ progress }) => {
            const path = this.scrollPath()?.nativeElement;
            if (!path || !this.pathLen) return;
            path.style.strokeDashoffset = String(-progress * this.pathLen * 4);
          });
        });
      }, 2000);

      this.bootLoader();
    });
  }

  private bootLoader() {
    const loader = document.getElementById('app-loader');
    if (!loader) {
      document.documentElement.classList.add('app-loaded');
      return;
    }

    const dismissLoader = () => {
      document.documentElement.classList.add('app-loaded');
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 700);
    };

    this.loaderService.updateStatus('BOOTING');

    const fontsPromise = Promise.race([
      document.fonts.ready,
      new Promise<void>((resolve) => setTimeout(resolve, 800)),
    ]).then(() => this.loaderService.updateStatus('FONTS READY'));

    const domPromise = new Promise<void>((resolve) => {
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        resolve();
      } else {
        document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
        setTimeout(resolve, 600);
      }
    }).then(() => this.loaderService.updateStatus('DOM READY'));

    const webglPromise = new Promise<void>((resolve) => {
      const start = Date.now();
      const check = () => {
        if (this.loaderService.webglReady() || Date.now() - start > 1200) {
          resolve();
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    }).then(() => this.loaderService.updateStatus('GRAPHICS READY'));

    Promise.race([
      Promise.all([fontsPromise, domPromise, webglPromise]),
      new Promise<void>((resolve) => setTimeout(resolve, 1800)),
    ]).then(() => {
      this.loaderService.updateStatus('SYSTEM READY');
      setTimeout(dismissLoader, 200);
    }).catch(() => dismissLoader());
  }

  updateDimensions() {
    this.windowSize.set({ w: window.innerWidth, h: window.innerHeight });
  }

  ngOnDestroy() {
    this.unsubScroll?.();
  }
}
