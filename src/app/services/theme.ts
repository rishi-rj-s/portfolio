import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  private dark = false;
  private isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const saved = sessionStorage.getItem('theme');

      if (saved) {
        this.dark = saved === 'dark';
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.dark = prefersDark;
        sessionStorage.setItem('theme', prefersDark ? 'dark' : 'light');
      }

      this.applyTheme();
    }
  }

  isDark() {
    return this.dark;
  }

  toggleTheme() {
    this.dark = !this.dark;
    if (this.isBrowser) {
      sessionStorage.setItem('theme', this.dark ? 'dark' : 'light');
      this.applyTheme();
    }
  }

  private applyTheme() {
    if (!this.isBrowser) return;
    document.documentElement.classList.toggle('dark', this.dark);
  }
}