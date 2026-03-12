import { Component, PLATFORM_ID, inject, afterNextRender, Injector } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector';
import { Theme } from './services/theme';

import { Footer } from './components/footer/footer';
import { WebglBackgroundComponent } from './components/webgl-background/webgl-background';
import { LoaderService } from './services/loader';
import { printAsciiArt } from './utils/console-art';

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
  
  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser) return;
      
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
}