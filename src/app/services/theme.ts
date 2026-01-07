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

  toggleTheme(event?: MouseEvent) {
    const newThemeDark = !this.dark;

    // @ts-ignore
    if (!this.isBrowser || !document.startViewTransition || !event) {
      this.dark = newThemeDark;
      if (this.isBrowser) {
        sessionStorage.setItem('theme', this.dark ? 'dark' : 'light');
        this.applyTheme();
      }
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      this.dark = newThemeDark;
      sessionStorage.setItem('theme', this.dark ? 'dark' : 'light');
      this.applyTheme();
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: 'ease-in',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }

  private applyTheme() {
    if (!this.isBrowser) return;
    document.documentElement.classList.toggle('dark', this.dark);
  }
}