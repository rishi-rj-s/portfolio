import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollService } from '../../services/scroll';

@Component({
  selector: 'app-projects-grid',
  template: `
    <section id="projects" class="relative py-[var(--section-pad-y)] border-t border-[var(--color-border)]">
      <div class="page-gutter max-w-[1400px] mx-auto mb-12 md:mb-16">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p class="section-label mb-4">01 — Work</p>
            <h2 class="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[0.95] text-[var(--color-text)]">
              Selected<br />
              <span class="font-serif italic font-normal text-[var(--color-primary)]">systems</span>
            </h2>
          </div>
          <a href="#contact" (click)="toContact($event)" class="signal-btn signal-btn-ghost self-start md:self-auto">
            Collaborate
          </a>
        </div>
      </div>

      <div class="border-t border-[var(--color-border)]">
        @for (project of projects; track project.title; let i = $index) {
          <article
            class="group border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]/60 transition-colors"
          >
            <div class="page-gutter max-w-[1400px] mx-auto py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
              <div class="lg:col-span-1 flex lg:flex-col gap-2 lg:gap-1 items-baseline">
                <span class="font-mono text-3xl md:text-4xl font-black text-[var(--color-primary)] leading-none"
                  >0{{ i + 1 }}</span
                >
                <span class="font-mono text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">{{
                  project.year
                }}</span>
              </div>

              <div class="lg:col-span-5">
                <div class="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    class="font-mono text-[10px] tracking-[0.16em] uppercase px-2 py-1 bg-[var(--color-ink)] text-[var(--color-background)]"
                    >{{ project.type }}</span
                  >
                </div>
                <h3
                  class="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mb-4"
                >
                  {{ project.title }}
                </h3>
                <div class="flex flex-wrap gap-2 mb-6">
                  @for (tech of project.stack.slice(0, 4); track tech) {
                    <span
                      class="font-mono text-[10px] tracking-wider uppercase px-2 py-1 border border-[var(--color-border)] text-[var(--color-text-muted)]"
                      >{{ tech }}</span
                    >
                  }
                </div>
                <div class="flex flex-wrap gap-3">
                  @if (project.links.live) {
                    <a
                      [href]="project.links.live"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="signal-btn !py-2.5 !px-4 !text-[11px]"
                    >
                      Live site
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10v10M7 17 17 7"/>
                      </svg>
                    </a>
                  }
                  @if (project.links.source) {
                    <a
                      [href]="project.links.source"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="signal-btn signal-btn-ghost !py-2.5 !px-4 !text-[11px]"
                    >
                      Source
                    </a>
                  }
                </div>
              </div>

              <div class="lg:col-span-6 flex items-center">
                <p class="text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed border-l-2 border-[var(--color-primary)] pl-5 md:pl-6">
                  {{ project.description }}
                </p>
              </div>
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class ProjectsGrid {
  private scrollService = inject(ScrollService);
  private platformId = inject(PLATFORM_ID);

  projects = [
    {
      title: 'Tagtics',
      type: 'SaaS',
      year: '2025',
      description:
        'Multi-tenant UI feedback SaaS. Click any element on any web app and submit contextual feedback — no target-app code changes. PostgreSQL RLS enforces strict tenant isolation at the database layer.',
      stack: ['React', 'Supabase', 'PostgreSQL', 'RLS', 'TypeScript'],
      links: {
        source: 'https://github.com/tagtics/tagtics-frontend',
        live: 'https://www.tagtics.online',
      },
    },
    {
      title: 'Green Power India',
      type: 'Client Contract',
      year: '2026',
      description:
        'End-to-end corporate platform for a sustainable energy company — Next.js 15 App Router on Vercel, Supabase/PostgreSQL backend, and structured media storage. Owned frontend and backend schema.',
      stack: ['Next.js 15', 'React 19', 'Supabase', 'PostgreSQL', 'Tailwind'],
      links: {
        live: 'https://greenpowerindia.com/',
      },
    },
    {
      title: 'Ever-Gauzy',
      type: 'Open Source',
      year: '2025',
      description:
        'Contributed to a 100k+ line NestJS/Angular ERP. Improved authentication UI inside a large Nx monorepo — exposure to CQRS, Event Sourcing, and Hexagonal Architecture in production.',
      stack: ['NestJS', 'Angular', 'TypeScript', 'Nx', 'CQRS'],
      links: {
        source: 'https://github.com/ever-co/ever-gauzy',
        live: 'https://app.gauzy.co/#/auth/login',
      },
    },
    {
      title: 'Fashion Studio',
      type: 'E-Commerce',
      year: '2024',
      description:
        'Production e-commerce backend on self-managed AWS EC2 with Nginx reverse proxy. Razorpay webhooks with signature verification, catalogue, auth, and order processing.',
      stack: ['Node.js', 'Express', 'MongoDB', 'AWS EC2', 'Nginx'],
      links: {
        source: 'https://github.com/rishi-rj-s/RSBackend',
      },
    },
  ];

  toContact(e: Event) {
    e.preventDefault();
    if (isPlatformBrowser(this.platformId)) this.scrollService.scrollTo('#contact');
  }
}
