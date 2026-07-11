import { Component, PLATFORM_ID, inject, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { LoaderService } from './services/loader';
import { printAsciiArt } from './utils/console-art';
import { ScrollService } from './services/scroll';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <a href="#hero" class="skip-link">Skip to content</a>

    <div class="atmosphere" aria-hidden="true">
      <div class="atmosphere-lines"></div>
    </div>
    <div class="noise-overlay" aria-hidden="true"></div>

    <div class="relative min-h-screen z-10">
      <app-navbar />
      <router-outlet />
      <app-footer />
    </div>
  `,
})
export class App {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private loaderService = inject(LoaderService);
  private scrollService = inject(ScrollService);

  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser) return;
      printAsciiArt();

      const loader = document.getElementById('app-loader');
      if (!loader) return;

      const dismissLoader = () => {
        document.documentElement.classList.add('app-loaded');
        loader.classList.add('fade-out');
        setTimeout(() => loader.remove(), 1000);
      };

      const fontsPromise = Promise.race([
        document.fonts.ready,
        new Promise<void>((r) => setTimeout(r, 2000)),
      ]).then(() => this.loaderService.updateStatus('FONTS LOADED'));

      const resourcesPromise = new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve();
        else {
          window.addEventListener('load', () => resolve(), { once: true });
          setTimeout(resolve, 2500);
        }
      }).then(() => this.loaderService.updateStatus('RESOURCES READY'));

      Promise.race([
        Promise.all([fontsPromise, resourcesPromise]),
        new Promise<void>((r) => setTimeout(r, 3200)),
      ])
        .then(() => {
          this.loaderService.updateStatus('READY');
          setTimeout(dismissLoader, 280);
        })
        .catch(() => dismissLoader());

      setTimeout(() => {
        import('tagtics-client').then(({ default: Tagtics }) => {
          Tagtics.init({ apiKey: 'none', testingMode: true });
        });
      }, 3000);
    });
  }
}
