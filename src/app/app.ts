import { Component, ElementRef, HostListener, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { printAsciiArt } from './utils/console-art';
import gsap from 'gsap';
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
    <!-- Only show cursor on browser to avoid hydration mismatch/flicker -->
    @if (isBrowser) {
      <div #cursor class="custom-cursor hidden md:block"></div>
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
export class App implements AfterViewInit {
  @ViewChild('cursor') cursor!: ElementRef;
  isBrowser: boolean;
  
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      printAsciiArt();
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser && this.cursor) {
      // Initial cursor setup
      gsap.set(this.cursor.nativeElement, { xPercent: -50, yPercent: -50 });
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.isBrowser || !this.cursor) return;

    gsap.to(this.cursor.nativeElement, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.2,
      ease: 'power2.out'
    });

    const target = e.target as HTMLElement;
    const isInteractive = target.closest('a, button, [role="button"], input, select, textarea');

    if (isInteractive) {
      this.cursor.nativeElement.classList.add('hovered');
    } else {
      this.cursor.nativeElement.classList.remove('hovered');
    }
  }
}