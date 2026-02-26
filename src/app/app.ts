import { Component, PLATFORM_ID, inject, afterNextRender } from '@angular/core';
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
  
  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser) return;
      
      // Defer Tagtics to idle time so it doesn't block TBT
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
    });
  }
}