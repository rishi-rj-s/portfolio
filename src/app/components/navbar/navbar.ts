import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Theme } from '../../services/theme';
import { Router } from '@angular/router';
import { ScrollService } from '../../services/scroll';

@Component({
  selector: 'app-navbar',
  template: `
    <header class="fixed top-0 inset-x-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/85 backdrop-blur-md">
      <nav
        class="page-gutter h-[var(--navbar-height)] flex items-center justify-between gap-4"
        aria-label="Primary"
      >
        <a
          href="/"
          (click)="handleLogoClick($event)"
          class="group flex items-baseline gap-2 min-w-0"
          aria-label="Rishiraj Sajeev — Home"
        >
          <span class="font-black text-lg md:text-xl tracking-tight text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
            RISHIRAJ
          </span>
          <span class="hidden sm:inline font-mono text-[10px] tracking-[0.2em] text-[var(--color-text-muted)] uppercase">
            Sajeev
          </span>
        </a>

        <div class="hidden lg:flex items-center gap-1">
          @for (link of links; track link.id) {
            <a
              [href]="link.id"
              (click)="handleNavClick($event, link.id)"
              class="px-3 py-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              <span class="text-[var(--color-primary)] mr-1.5">{{ link.num }}</span>{{ link.label }}
            </a>
          }
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="p-2.5 border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
            (click)="theme.toggleTheme($event)"
            [attr.aria-label]="theme.isDark() ? 'Switch to light theme' : 'Switch to dark theme'"
          >
            <svg class="theme-icon-light w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg class="theme-icon-dark w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>

          <a
            href="#contact"
            (click)="handleNavClick($event, '#contact')"
            class="hidden md:inline-flex signal-btn !py-2.5 !px-4 !text-[11px]"
          >
            Hire me
          </a>

          <button
            type="button"
            class="lg:hidden p-2.5 border border-[var(--color-border)] text-[var(--color-text)]"
            (click)="mobileOpen.update(v => !v)"
            [attr.aria-expanded]="mobileOpen()"
            aria-label="Toggle menu"
          >
            @if (!mobileOpen()) {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 12h16M4 17h10"/>
              </svg>
            } @else {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            }
          </button>
        </div>
      </nav>

      @if (mobileOpen()) {
        <div class="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-background)] page-gutter py-4 flex flex-col gap-1">
          @for (link of links; track link.id) {
            <a
              [href]="link.id"
              (click)="mobileOpen.set(false); handleNavClick($event, link.id)"
              class="py-3 font-mono text-xs tracking-[0.16em] uppercase text-[var(--color-text)] border-b border-[var(--color-border)]"
            >
              <span class="text-[var(--color-primary)] mr-2">{{ link.num }}</span>{{ link.label }}
            </a>
          }
          <a
            href="#contact"
            (click)="mobileOpen.set(false); handleNavClick($event, '#contact')"
            class="signal-btn mt-3 w-full"
          >
            Hire me
          </a>
        </div>
      }
    </header>
  `,
})
export class Navbar {
  mobileOpen = signal(false);
  public theme = inject(Theme);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private scrollService = inject(ScrollService);

  links = [
    { num: '01', label: 'Work', id: '#projects' },
    { num: '02', label: 'Path', id: '#info' },
    { num: '03', label: 'Stack', id: '#skills' },
    { num: '04', label: 'Contact', id: '#contact' },
  ];

  handleNavClick(e: Event, id: string) {
    e.preventDefault();
    if (isPlatformBrowser(this.platformId)) this.scrollService.scrollTo(id);
  }

  handleLogoClick(e: Event) {
    e.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.router.url === '/') this.scrollService.scrollTo(0);
    else this.router.navigateByUrl('/');
  }
}
