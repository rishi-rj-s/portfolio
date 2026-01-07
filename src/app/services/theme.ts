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
        [
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
        ],
        {
          duration: 500,
          easing: 'ease-in',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }


  private discoTimer: any;
  private discoInterval: any;
  private currentDiscoClass: string | null = null;
  private readonly discoClasses = [
    'theme-disco-1',
    'theme-disco-2',
    'theme-disco-3',
    'theme-disco-4',
    'theme-disco-5'
  ];

  startDisco() {
    if (!this.isBrowser) return;
    this.discoTimer = setTimeout(() => {
      this.startDiscoCycle();
    }, 2000);
  }

  private startDiscoCycle() {
    let index = 0;

    const cycle = () => {
      if (this.currentDiscoClass) {
        document.documentElement.classList.remove(this.currentDiscoClass);
      }
      this.currentDiscoClass = this.discoClasses[index];
      document.documentElement.classList.add(this.currentDiscoClass);
      index = (index + 1) % this.discoClasses.length;
    };

    cycle();
    this.discoInterval = setInterval(cycle, 250);
  }

  stopDisco() {
    if (!this.isBrowser) return;
    if (this.discoTimer) clearTimeout(this.discoTimer);
    if (this.discoInterval) clearInterval(this.discoInterval);

    if (this.currentDiscoClass) {
      document.documentElement.classList.remove(this.currentDiscoClass);
      this.currentDiscoClass = null;
    }
    document.documentElement.classList.remove('disco');
  }

  private applyTheme() {
    if (!this.isBrowser) return;
    document.documentElement.classList.toggle('dark', this.dark);
  }
}