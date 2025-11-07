import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface CodeLine {
  id: number;
  number: number;
  content: SafeHtml;
  delay: string;
}

@Component({
  selector: 'app-hero',
  imports: [
    CommonModule,
  ],
  template: `
    <section
      class="relative flex items-center justify-center min-h-screen overflow-hidden bg-[var(--color-background)] transition-colors duration-500 dark:bg-[var(--color-background)]"
      aria-labelledby="hero-heading"
    >
      <!-- Background glow -->
      <div
        class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--color-primary)_15%,transparent)_0%,transparent_70%)]"
      ></div>

      <div
        class="relative z-10 max-w-screen-xl mx-auto px-6 grid gap-12 lg:grid-cols-2 items-center"
      >
        <!-- Profile image placeholder -->
        <div class="flex justify-center">
          <div
            class="w-64 h-64 md:w-72 md:h-72 rounded-2xl border-2 border-[color-mix(in_srgb,var(--color-primary)_40%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_25%,transparent),color-mix(in_srgb,var(--color-accent)_25%,transparent))] flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300"
            role="img"
            aria-label="Rishiraj Sajeev's professional photo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="w-24 h-24 text-[var(--color-primary)] opacity-70"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>

        <!-- Text -->
        <div class="flex flex-col gap-6 text-center lg:text-left">
          <h1
            id="hero-heading"
            class="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
          >
            <span
              class="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent animate-[gradientShift_8s_ease_infinite] [background-size:200%_200%]"
            >
              RISHIRAJ SAJEEV
            </span>
          </h1>

          <p class="text-xl font-semibold text-[var(--color-text-secondary)]">
            Self-taught Full-Stack Developer
          </p>

          <p
            class="max-w-lg mx-auto lg:mx-0 text-[var(--color-text-muted)] text-lg leading-relaxed"
          >
            Building scalable, secure web applications with modern frameworks.
            Experienced in microservices, real-time communication, payment
            integrations, and cloud deployment workflows.
          </p>

          <!-- Social Links -->
          <div
            class="flex flex-wrap justify-center lg:justify-start gap-4 pt-4"
          >
            <a
              href="mailto:rishirajsajeev@gmail.com"
              class="flex items-center gap-2 px-5 py-2 rounded-md border border-[color-mix(in_srgb,var(--color-primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] text-[var(--color-text)] font-medium hover:bg-[color-mix(in_srgb,var(--color-primary)_25%,transparent)] hover:border-[var(--color-primary)] hover:-translate-y-0.5 transition-all"
              aria-label="Email Rishiraj Sajeev"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                ></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>Email</span>
            </a>

            <a
              href="https://www.linkedin.com/in/rishiraj-sajeev"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-5 py-2 rounded-md border border-[color-mix(in_srgb,var(--color-primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] text-[var(--color-text)] font-medium hover:bg-[color-mix(in_srgb,var(--color-primary)_25%,transparent)] hover:border-[var(--color-primary)] hover:-translate-y-0.5 transition-all"
              aria-label="LinkedIn profile of Rishiraj Sajeev"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                ></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              <span>LinkedIn</span>
            </a>

            <a
              href="https://github.com/rishi-rj-s"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-5 py-2 rounded-md border border-[color-mix(in_srgb,var(--color-primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] text-[var(--color-text)] font-medium hover:bg-[color-mix(in_srgb,var(--color-primary)_25%,transparent)] hover:border-[var(--color-primary)] hover:-translate-y-0.5 transition-all"
              aria-label="GitHub profile of Rishiraj Sajeev"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                ></path>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
      @keyframes gradientShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      @keyframes fadeInLine {
        to { opacity: 1; }
      }
  `,
})
export class Hero {}