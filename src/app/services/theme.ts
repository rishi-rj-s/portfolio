import { Injectable, PLATFORM_ID, signal, effect, computed, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { printAsciiArt } from '../utils/console-art';

export type ThemeOption = 'light' | 'dark' | 'ocean' | 'sunset' | 'cyberpunk' | 'forest';

export interface ThemeDef { 
  id: ThemeOption; 
  name: string; 
  background: string; 
  primary: string; 
}

@Injectable({
  providedIn: 'root',
})
export class Theme {
  readonly availableThemes: ThemeDef[] = [
    { id: 'light', name: 'Pure Light', background: '#ffffff', primary: '#ffffff' }, 
    { id: 'dark', name: 'Pure Void', background: '#000000', primary: '#000000' }, 
    { id: 'ocean', name: 'Ocean', background: '#0d1b32', primary: '#38bdf8' },
    { id: 'sunset', name: 'Sunset', background: '#2b0a0a', primary: '#fb7185' },
    { id: 'forest', name: 'Forest', background: '#052e16', primary: '#34d399' },
    { id: 'cyberpunk', name: 'Cyberpunk', background: '#09090b', primary: '#d946ef' },
  ];

  currentTheme = signal<ThemeOption>('light');
  
  isDark = computed(() => {
    const theme = this.currentTheme();
    return theme !== 'light';
  });
  public isSelectorOpen = signal(false);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    if (this.isBrowser) {
      const saved = localStorage.getItem('theme') as ThemeOption;

      if (saved && this.isValidTheme(saved)) {
        this.currentTheme.set(saved);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentTheme.set(prefersDark ? 'dark' : 'light');
      }

      this.applyTheme();
    }
    
    // Effect to persist theme changes
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
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

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
        {
          duration: 500,
          easing: 'ease-in',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }

  toggleTheme(event?: MouseEvent) {
    // Simple toggle between light and dark if using the main toggle button
    // Or we could make this cycle, but for now let's keep it simple (or just redirect to selector)
    const newTheme = this.isDark() ? 'light' : 'dark';
    this.setTheme(newTheme, event);
  }
  
  openSelector() {
    this.isSelectorOpen.set(true);
  }

  closeSelector() {
    this.isSelectorOpen.set(false);
  }

  toggleSelector() {
    this.isSelectorOpen.update(v => !v);
  }

  private applyTheme() {
    if (!this.isBrowser) return;
    const theme = this.currentTheme();
    
    // 1. Clean Slate: Remove ALL theme-related classes
    const allThemeClasses = this.availableThemes.map(t => `theme-${t.id}`);
    document.documentElement.classList.remove(...allThemeClasses, 'dark', 'light');
    
    // 2. Logic to apply specific classes
    if (theme === 'light') {
       // Force light mode
       document.documentElement.style.colorScheme = 'light';
       // No extra class needed for light mode as it's the default :root
    } else {
       // It's a dark or custom theme
       document.documentElement.style.colorScheme = 'dark';
       
       if (theme === 'dark') {
          // Pure Void
          document.documentElement.classList.add('dark');
       } else {
          // Custom Theme (Ocean, Sunset, etc)
          document.documentElement.classList.add(`theme-${theme}`);
          // Inherit dark base
          document.documentElement.classList.add('dark');
       }
    }

    // Update Console Art
    const currentThemeDef = this.availableThemes.find(t => t.id === theme);
    if (currentThemeDef) {
       console.clear();
       printAsciiArt(currentThemeDef.primary);
    }
  }

  private isValidTheme(theme: string): theme is ThemeOption {
    return ['light', 'dark', 'ocean', 'sunset', 'cyberpunk', 'forest'].includes(theme);
  }
}