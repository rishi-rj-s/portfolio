import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule,
  ],
  template: `
    <footer
      class="bg-[var(--color-background)] border-t border-[var(--color-border)] text-[var(--color-text)] pt-16 pb-8 mt-24 transition-colors duration-300"
      role="contentinfo"
    >
      <div class="max-w-screen-xl mx-auto px-6">
        <!-- About -->
        <div class="mb-12">
          <h3 class="text-2xl font-bold mb-4">About This Build</h3>
          <p class="text-lg leading-relaxed text-[var(--color-text-muted)] max-w-3xl mb-12">
            This portfolio is a production-grade demonstration of modern web
            architecture built with performance and scalability in mind.
          </p>

          <!-- Tech grid -->
<div
  class="grid gap-6 mb-12 justify-center [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] max-w-6xl mx-auto"
>
  <div class="p-6 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
    <h4 class="uppercase text-[var(--color-primary)] tracking-wider text-sm font-bold mb-4">
      Frontend
    </h4>
    <ul class="space-y-2 text-sm text-[var(--color-text-muted)]">
      <li>Angular v20 </li>
      <li>Tailwind CSS v4</li>
      <li>Signal Reactivity</li>
      <li>Zoneless Change Detection</li>
    </ul>
  </div>

  <div class="p-6 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
    <h4 class="uppercase text-[var(--color-primary)] tracking-wider text-sm font-bold mb-4">
      Optimization
    </h4>
    <ul class="space-y-2 text-sm text-[var(--color-text-muted)]">
      <li>SSR & Incremental Hydration</li>
      <li>Event Replay Strategy</li>
      <li>Lazy Loading Routes</li>
      <li>Optimized Bundle Splitting</li>
    </ul>
  </div>

  <div class="p-6 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
    <h4 class="uppercase text-[var(--color-primary)] tracking-wider text-sm font-bold mb-4">
      Best Practices
    </h4>
    <ul class="space-y-2 text-sm text-[var(--color-text-muted)]">
      <li>Semantic HTML5</li>
      <li>Accessibility (WCAG 2.1 AA)</li>
      <li>Custom Properties (RTL Ready)</li>
      <li>Lighthouse 95 +</li>
    </ul>
  </div>
</div>

          <!-- Highlights -->
          <div class="grid gap-6 md:grid-cols-3">
            <div
              class="flex items-center gap-4 p-4 rounded-lg border border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="text-[var(--color-primary)] w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <div>
                <div
                  class="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-semibold"
                >
                  Build System
                </div>
                <div class="text-sm font-semibold">Angular CLI + ESBuild</div>
              </div>
            </div>

            <div
              class="flex items-center gap-4 p-4 rounded-lg border border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="text-[var(--color-primary)] w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <div>
                <div
                  class="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-semibold"
                >
                  Rendering
                </div>
                <div class="text-sm font-semibold">SSR + Hydration</div>
              </div>
            </div>

            <div
              class="flex items-center gap-4 p-4 rounded-lg border border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="text-[var(--color-primary)] w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div>
                <div
                  class="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-semibold"
                >
                  Change Detection
                </div>
                <div class="text-sm font-semibold">Zoneless Signals</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom -->
        <div
          class="flex flex-col md:flex-row justify-between items-center border-t border-[var(--color-border)] mt-12 pt-6 gap-4"
        >
          <p
            class="text-sm text-[var(--color-text-muted)] text-center md:text-left"
          >
            &copy; {{ currentYear }} Rishiraj Sajeev • Built with Angular v20 •
            Deployed via Docker + Kubernetes
          </p>

          <div class="flex gap-3">
            <a
              href="https://github.com/rishi-rj-s"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition"
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="w-5 h-5"
              >
                <path
                  d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                />
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/in/rishiraj-sajeev"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="w-5 h-5"
              >
                <path
                  d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            <a
              href="mailto:rishirajsajeev@gmail.com"
              class="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition"
              aria-label="Email"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="w-5 h-5"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  currentYear = new Date().getFullYear();
}