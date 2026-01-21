import { Component, ElementRef, HostListener, ViewChildren, QueryList, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Theme } from '../../services/theme';
import { RouterLink, Router } from '@angular/router';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
  ],
  template: `
    <nav class="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300">
      <div 
        class="relative px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl border border-white/10 overflow-hidden"
        (mouseleave)="resetMagnets()"
        (mousemove)="handleMouseMove($event)"
      >
        <!-- Glass Background Layer (Absolute) -->
        <div class="absolute inset-0 glass-bg pointer-events-none"></div>

        <!-- Content Layer (Relative) -->
        <div class="relative z-10 flex items-center gap-6">
          <!-- Logo -->
          <a routerLink="/" (click)="handleLogoClick($event)" class="nav-item group relative font-bold text-xl tracking-tighter text-[var(--color-text)]" #navItem>
            RS
          </a>

          <!-- Desktop Links -->
          <div class="hidden md:flex items-center gap-1">
            <a href="#skills" (click)="handleNavClick($event, '#skills')" class="nav-item px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors rounded-full hover:bg-[var(--color-card-hover)]" #navItem>Skills</a>
            <a href="#projects" (click)="handleNavClick($event, '#projects')" class="nav-item px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors rounded-full hover:bg-[var(--color-card-hover)]" #navItem>Projects</a>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <!-- Theme Toggle -->
            <button
              #navItem
              class="nav-item p-2 rounded-full text-[var(--color-text)] hover:scale-110 transition-transform hover:bg-[var(--color-card-hover)]"
              (click)="theme.toggleTheme($event)"
              (pointerdown)="startDisco($event)"
              [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
            >
               <svg class="w-5 h-5 theme-icon-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
               <svg class="w-5 h-5 theme-icon-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>

            <!-- CTA / Mobile Menu Toggle -->
             <a href="#contact" (click)="handleNavClick($event, '#contact')" class="hidden md:block nav-item px-5 py-2 bg-[var(--color-text)] text-[var(--color-background)] rounded-full text-sm font-bold hover:scale-105 transition-transform" #navItem>
              Let's Talk
            </a>

            <button (click)="toggleMobileMenu()" class="md:hidden nav-item p-2 text-[var(--color-text)]" #navItem>
              @if (!mobileMenuOpen()) {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              }
              @if (mobileMenuOpen()) {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              }
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      @if (mobileMenuOpen()) {
        <div 
          class="absolute top-full left-0 right-0 mt-4 p-4 rounded-2xl flex flex-col gap-4 md:hidden animate-fade-in-up origin-top shadow-xl border border-white/10 glass-bg"
        >
          <a href="#skills" (click)="closeMobileMenu(); handleNavClick($event, '#skills')" class="p-3 text-[var(--color-text)] hover:bg-[var(--color-card-hover)] rounded-xl font-bold">Skills</a>
          <a href="#projects" (click)="closeMobileMenu(); handleNavClick($event, '#projects')" class="p-3 text-[var(--color-text)] hover:bg-[var(--color-card-hover)] rounded-xl font-bold">Projects</a>
          <a href="#contact" (click)="closeMobileMenu(); handleNavClick($event, '#contact')" class="p-3 bg-[var(--color-text)] text-[var(--color-background)] rounded-xl text-center font-bold">Let's Talk</a>
        </div>
      }
    </nav>
  `,
  styles: [`
    .glass-bg {
      background: rgba(125, 125, 125, 0.05);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
  `]
})
export class Navbar {
  @ViewChildren('navItem') navItems!: QueryList<ElementRef>;
  mobileMenuOpen = signal(false);

  constructor(
    public theme: Theme,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}



  handleMouseMove(e: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    
    requestAnimationFrame(() => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      this.navItems.forEach((item) => {
        const el = item.nativeElement;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from mouse to center of item
        const dist = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
        
        // Magnetic effect calculation
        // Only effect closer items
        if (dist < 100) {
          const pull = (100 - dist) * 0.15; // Strength
          const moveX = (mouseX - centerX) * 0.2;
          const moveY = (mouseY - centerY) * 0.2;
          
          gsap.to(el, {
            x: moveX,
            y: moveY,
            scale: 1 + (pull * 0.005), // Subtle scale up
            duration: 0.2,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        } else {
          gsap.to(el, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)',
            overwrite: 'auto'
          });
        }
      });
    });
  }

  resetMagnets() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.navItems.forEach((item) => {
      gsap.to(item.nativeElement, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  startDisco(event: PointerEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.theme.startDisco();
    window.addEventListener('pointerup', this.stopDiscoBound);
    window.addEventListener('pointercancel', this.stopDiscoBound);
  }

  private stopDiscoBound = () => {
    if (!isPlatformBrowser(this.platformId)) return;
    this.theme.stopDisco();
    window.removeEventListener('pointerup', this.stopDiscoBound);
    window.removeEventListener('pointercancel', this.stopDiscoBound);
  };

  handleNavClick(e: Event, id: string) {
    e.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: id, autoKill: false },
        ease: 'power3.inOut'
      });
    }
  }

  handleLogoClick(e: Event) {
    e.preventDefault();
    if (this.router.url === '/') {
      if (isPlatformBrowser(this.platformId)) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: 0, autoKill: false },
          ease: 'power3.inOut'
        });
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}