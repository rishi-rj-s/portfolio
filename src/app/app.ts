import { Component, OnDestroy, PLATFORM_ID, inject, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector';
import { Theme } from './services/theme';

import { Footer } from './components/footer/footer';
import { WebglBackgroundComponent } from './components/webgl-background/webgl-background';

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
    @defer (on idle) {
      <app-webgl-background />
    } @placeholder {
      <div class="fixed inset-0 -z-10 bg-[var(--color-background)]"></div>
    }
    <div class="noise-overlay"></div>
    
    <!-- Custom Cursor Element -->
    <div class="custom-cursor hidden md:block">
      <div class="cursor-dot"></div>
      <div class="cursor-reticle"></div>
    </div>

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
export class App implements OnDestroy {
  // v20 inject() instead of constructor DI
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  public theme = inject(Theme);
  
  private mouseHandler: ((e: MouseEvent) => void) | null = null;
  private clickHandler: ((e: MouseEvent) => void) | null = null;
  
  constructor() {
    // Initialize all browser-only functionality after render
    afterNextRender(() => {
      if (!this.isBrowser) return;
      
      // TBT Fix: Use requestIdleCallback so Tagtics loads during genuine idle time,
      // not during the TBT measurement window. This avoids creating Long Tasks.
      const initTagtics = () => {
        import('tagtics-client').then(({ default: Tagtics }) => {
          Tagtics.init({
            apiKey: 'none',
            testingMode: true,
          });
        });
      };
      
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(initTagtics, { timeout: 10000 });
      } else {
        setTimeout(initTagtics, 5000);
      }
      
      // Throttled mouse tracking for CSS variables
      let mouseTicking = false;
      this.mouseHandler = (e: MouseEvent) => {
        if (mouseTicking) return;
        mouseTicking = true;
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
          document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
          
          // Check for interactive elements
          const target = e.target as HTMLElement;
          const isInteractive = target.closest('a, button, [role="button"], input, select, textarea');
          
          if (isInteractive) {
            document.documentElement.classList.add('cursor-hover');
          } else {
            document.documentElement.classList.remove('cursor-hover');
          }
          mouseTicking = false;
        });
      };
      
      this.clickHandler = (e: MouseEvent) => {
        if (e.type === 'mousedown') {
          document.documentElement.classList.add('cursor-active');
        } else {
          document.documentElement.classList.remove('cursor-active');
        }
      };
      
      window.addEventListener('mousemove', this.mouseHandler, { passive: true });
      window.addEventListener('mousedown', this.clickHandler);
      window.addEventListener('mouseup', this.clickHandler);
    });
  }

  ngOnDestroy() {
    if (this.mouseHandler) {
      window.removeEventListener('mousemove', this.mouseHandler);
    }
    if (this.clickHandler) {
      window.removeEventListener('mousedown', this.clickHandler);
      window.removeEventListener('mouseup', this.clickHandler);
    }
  }
}