import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex flex-col justify-center page-gutter pt-[var(--navbar-height)] relative overflow-hidden">
      <p class="section-label mb-6">404</p>
      <h1 class="text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.05em] leading-[0.9] text-[var(--color-text)] mb-6 max-w-3xl">
        This route<br />
        <span class="text-[var(--color-primary)]">doesn't compile.</span>
      </h1>
      <p class="text-lg text-[var(--color-text-muted)] mb-10 max-w-md">
        The page you're looking for isn't part of this portfolio build.
      </p>
      <a routerLink="/" class="signal-btn self-start">Back to home</a>

      <div
        class="absolute bottom-0 right-0 font-black text-[clamp(8rem,30vw,22rem)] leading-none text-[var(--color-text)] opacity-[0.04] select-none pointer-events-none"
        aria-hidden="true"
      >
        404
      </div>
    </div>
  `,
})
export class NotFound {}
