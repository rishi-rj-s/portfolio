import { Component } from '@angular/core';

@Component({
  selector: 'app-experience',
  template: `
    <div class="space-y-0">
      @for (job of jobs; track job.title; let i = $index) {
        <article
          class="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10 md:py-14 border-t border-[var(--color-border)] hover:bg-[var(--color-surface)]/50 transition-colors px-0 md:px-4 -mx-0 md:-mx-4"
        >
          <div class="md:col-span-2">
            <span class="font-mono text-sm text-[var(--color-primary)] font-bold">0{{ i + 1 }}</span>
          </div>
          <div class="md:col-span-3">
            <p class="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--color-text-muted)] mb-2">
              {{ job.period }}
            </p>
            @if (job.live) {
              <span class="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--color-primary)]">
                <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" aria-hidden="true"></span>
                Current
              </span>
            }
          </div>
          <div class="md:col-span-7">
            <h3 class="text-2xl md:text-3xl font-black tracking-tight text-[var(--color-text)] mb-1">
              {{ job.title }}
            </h3>
            @if (job.companyUrl) {
              <a
                [href]="job.companyUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline mb-4"
              >
                {{ job.company }} →
              </a>
            } @else {
              <p class="text-sm text-[var(--color-text-secondary)] italic mb-4">{{ job.company }}</p>
            }
            <ul class="space-y-2 text-[var(--color-text-muted)] text-sm md:text-base leading-relaxed">
              @for (point of job.points; track point) {
                <li class="flex gap-3">
                  <span class="text-[var(--color-primary)] mt-1.5 shrink-0" aria-hidden="true">▸</span>
                  <span>{{ point }}</span>
                </li>
              }
            </ul>
          </div>
        </article>
      }
    </div>
  `,
})
export class Experience {
  jobs = [
    {
      title: 'Angular Developer',
      company: 'Axolon',
      companyUrl: 'https://www.linkedin.com/company/axolonerp/posts',
      period: 'Apr 2026 — Present',
      live: true,
      points: [
        'Leading enterprise Angular applications with a focus on scalability and performance.',
        'Optimizing frontend architecture and UI patterns for complex business logic.',
      ],
    },
    {
      title: 'Full Stack Engineering',
      company: 'Freelance · Remote Engineering Sabbatical',
      companyUrl: null as string | null,
      period: '2023 — Mar 2026',
      live: false,
      points: [
        'System design, microservices, and cloud deployment on AWS.',
        'Scalable solutions with NestJS, Angular, Next.js, and React.',
      ],
    },
  ];
}
