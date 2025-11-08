import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { Theme } from '../../services/theme';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterLink,
  ],
  template: `
    <nav 
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class.nav-scrolled]="isScrolled()"
    >
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo/Brand -->
          <a routerLink="/" class="group flex items-center space-x-3">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div class="relative bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] p-2 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>
              </div>
            </div>
            <span class="text-xl font-bold text-gradient">RS</span>
          </a>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <a href="#about" class="nav-link">About</a>
            <a href="#skills" class="nav-link">Skills</a>
            <a href="#projects" class="nav-link">Projects</a>
            <a href="#contact" class="nav-link">Contact</a>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
            <button
              (click)="theme.toggleTheme()"
              class="p-2.5 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-card-hover)] transition-all duration-300 group"
              [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              @if (!theme.isDark()) {
                <svg 
                  class="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              }
              @if (theme.isDark()) {
                <svg 
                  class="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              }
            </button>

            <!-- CTA Button -->
            <a 
              href="#contact" 
              class="hidden md:flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white rounded-lg font-medium hover:shadow-[var(--glow-primary)] transition-all duration-300 hover:scale-105"
            >
              <span>Let's Talk</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>

            <!-- Mobile Menu Button -->
            <button
              (click)="toggleMobileMenu()"
              class="md:hidden p-2.5 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all"
              aria-label="Toggle menu"
            >
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

        <!-- Mobile Menu -->
        @if (mobileMenuOpen()) {
          <div 
            class="md:hidden mt-4 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg animate-fade-in-up"
          >
            <div class="flex flex-col space-y-3">
              <a href="#about" (click)="closeMobileMenu()" class="nav-link-mobile">About</a>
              <a href="#skills" (click)="closeMobileMenu()" class="nav-link-mobile">Skills</a>
              <a href="#projects" (click)="closeMobileMenu()" class="nav-link-mobile">Projects</a>
              <a href="#contact" (click)="closeMobileMenu()" class="nav-link-mobile">Contact</a>
              <a 
                href="#contact" 
                (click)="closeMobileMenu()"
                class="flex items-center justify-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white rounded-lg font-medium mt-2"
              >
                <span>Let's Talk</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
            </div>
          </div>
        }
      </div>
    </nav>
  `,
  styles: [`
    nav {
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      background-color: color-mix(in srgb, var(--color-background) 80%, transparent);
      border-bottom: 1px solid transparent;
    }

    nav.nav-scrolled {
      background-color: color-mix(in srgb, var(--color-background) 95%, transparent);
      border-bottom-color: var(--color-border);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .nav-link {
      position: relative;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      transition: color 0.3s ease;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
      transition: width 0.3s ease;
    }

    .nav-link:hover {
      color: var(--color-primary);
    }

    .nav-link:hover::after {
      width: 100%;
    }

    .nav-link-mobile {
      display: block;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      border-radius: 0.5rem;
      transition: all 0.3s ease;
    }

    .nav-link-mobile:hover {
      color: var(--color-primary);
      background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
    }
  `]
})
export class Navbar {
  isScrolled = signal(false);
  mobileMenuOpen = signal(false);

  constructor(public theme: Theme) {}

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(value => !value);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}