import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Theme } from '../../services/theme';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
  ],
  template: `
    <nav class="flex items-center justify-between px-6 py-4 bg-[var(--color-card)] border-b border-[var(--color-border)]">
      <h1 class="text-lg font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent animate-[gradientShift_8s_ease_infinite] [background-size:200%_200%]">Rishiraj Sajeev</h1>

      <button
        class="p-2 rounded-md border border-[var(--color-border)] hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] transition"
        (click)="theme.toggleTheme()"
        aria-label="Toggle theme"
      >
        <svg *ngIf="!theme.isDark()" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
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

        <svg *ngIf="theme.isDark()" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </nav>
  `,
  styles: [`
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  @keyframes fadeInLine {
    to { opacity: 1; }
  }
`]
})
export class Navbar {
  constructor(public theme: Theme) { }

}
