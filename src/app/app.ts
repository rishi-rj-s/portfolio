import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { printAsciiArt } from './utils/console-art';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar,
    Footer
  ],
  template: `
    <div class="noise-overlay"></div>
    
    <!-- Custom Cursor Element -->
    <div class="custom-cursor hidden md:block">
      <div class="cursor-dot"></div>
      <div class="cursor-reticle"></div>
    </div>
    
    <div class="relative min-h-screen z-10">
      <app-navbar />
      <div class="relative">
        <router-outlet />
      </div>
      <app-footer />
    </div>
  `
})
export class App implements AfterViewInit, OnDestroy {
  isBrowser: boolean;
  private mouseHandler: ((e: MouseEvent) => void) | null = null;
  private clickHandler: ((e: MouseEvent) => void) | null = null;
  
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      printAsciiArt();
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
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
    }
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