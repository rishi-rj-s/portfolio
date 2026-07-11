import { Injectable, PLATFORM_ID, signal, effect, computed, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { printAsciiArt } from '../utils/console-art';

export type ThemeOption = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class Theme {
  currentTheme = signal<ThemeOption>('light');
  isDark = computed(() => this.currentTheme() === 'dark');

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private readonly backgrounds: Record<ThemeOption, string> = {
    light: '#e9edf2',
    dark: '#07080a',
  };
  private readonly accents: Record<ThemeOption, string> = {
    light: '#8fde00',
    dark: '#b6ff2e',
  };

  constructor() {
    if (this.isBrowser) {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') {
        this.currentTheme.set(saved);
      } else if (['ocean', 'sunset', 'cyberpunk', 'forest'].includes(saved || '')) {
        this.currentTheme.set('dark');
      } else {
        this.currentTheme.set(
          window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        );
      }
      this.applyTheme();
    }

    effect(() => {
      const theme = this.currentTheme();
      if (this.isBrowser) {
        localStorage.setItem('theme', theme);
        this.applyTheme();
      }
    });
  }

  setTheme(theme: ThemeOption, event?: MouseEvent) {
    if (theme === this.currentTheme()) return;
    // @ts-ignore
    if (!this.isBrowser || !document.startViewTransition || !event) {
      this.currentTheme.set(theme);
      return;
    }
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    // @ts-ignore
    const transition = document.startViewTransition(() => {
      this.currentTheme.set(theme);
      this.applyTheme();
    });
    transition.ready.then(() => {
      document.documentElement.animate(
        [
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
        ],
        { duration: 480, easing: 'ease-in', pseudoElement: '::view-transition-new(root)' }
      );
    });
  }

  toggleTheme(event?: MouseEvent) {
    this.setTheme(this.isDark() ? 'light' : 'dark', event);
  }

  private applyTheme() {
    if (!this.isBrowser) return;
    const theme = this.currentTheme();
    document.documentElement.classList.remove(
      'dark', 'light', 'theme-ocean', 'theme-sunset', 'theme-cyberpunk', 'theme-forest'
    );
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.style.colorScheme = 'light';
    }
    document.documentElement.style.backgroundColor = this.backgrounds[theme];
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', this.backgrounds[theme]);
    console.clear();
    printAsciiArt(this.accents[theme]);
  }
}
