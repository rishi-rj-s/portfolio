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
      this.dark = saved === 'dark';
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
    const html = document.documentElement;
    html.classList.toggle('dark', this.dark);
  }
}