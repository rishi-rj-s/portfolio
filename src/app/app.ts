import { Component, OnDestroy, PLATFORM_ID, inject, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import Tagtics from 'tagtics-client';
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
    <app-webgl-background />
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
      
      // Initialize Tagtics
      Tagtics.init({
        apiKey: 'none',
        testingMode: true,
      });
      
      // Throttled mouse tracking for CSS variables
      this.mouseHandler = (e: MouseEvent) => {
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