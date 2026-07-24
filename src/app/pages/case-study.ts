import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { getCaseStudy } from '../data/case-studies';
import { ArchitectureDiagram } from '../components/architecture-diagram/architecture-diagram';

@Component({
  selector: 'app-case-study',
  imports: [RouterLink, ArchitectureDiagram],
  template: `
    @if (study(); as s) {
      <main class="min-h-screen pt-28 md:pt-36 pb-20 px-6 md:px-28">
        <div class="max-w-3xl mx-auto">
          <a routerLink="/" fragment="projects"
             class="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-10">
            <span aria-hidden="true">←</span> Selected works
          </a>

          <header class="mb-14 md:mb-16">
            <div class="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-secondary)] opacity-60 mb-3">
              {{ s.year }} — {{ s.type }}
            </div>
            <h1 class="text-4xl md:text-6xl font-black tracking-tight text-[var(--color-text)] leading-[0.95] mb-4">
              {{ s.title }}
            </h1>
            <p class="text-lg md:text-xl text-[var(--color-text-muted)] leading-relaxed mb-8">
              {{ s.subtitle }}
            </p>
            <div class="flex flex-wrap gap-3 mb-6">
              @for (link of s.links; track link.href) {
                <a [href]="link.href" target="_blank" rel="noopener noreferrer"
                   class="text-[10px] font-bold tracking-widest uppercase text-[var(--color-primary)] hover:underline underline-offset-4">
                  {{ link.label }}
                </a>
              }
            </div>
            <div class="flex flex-wrap gap-1.5">
              @for (tech of s.stack; track tech) {
                <span class="text-[9px] md:text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  {{ tech }}
                </span>
              }
            </div>
          </header>

          <div class="space-y-14 md:space-y-16">
            <section>
              <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-4">{{ s.problem.title }}</h2>
              @for (p of s.problem.paragraphs; track p) {
                <p class="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed mb-3">{{ p }}</p>
              }
              @if (s.problem.bullets?.length) {
                <ol class="mt-4 space-y-2 list-decimal list-outside ml-5 text-sm md:text-base text-[var(--color-text-muted)]">
                  @for (b of s.problem.bullets; track b) {
                    <li>{{ b }}</li>
                  }
                </ol>
              }
            </section>

            <section>
              <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-4">{{ s.role.title }}</h2>
              @for (p of s.role.paragraphs; track p) {
                <p class="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed mb-3">{{ p }}</p>
              }
              @if (s.role.bullets?.length) {
                <ul class="mt-4 space-y-2 list-disc list-outside ml-5 text-sm md:text-base text-[var(--color-text-muted)]">
                  @for (b of s.role.bullets; track b) {
                    <li>{{ b }}</li>
                  }
                </ul>
              }
            </section>

            <section>
              <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-4">Architecture</h2>
              <app-architecture-diagram
                [summary]="s.architecture.summary"
                [nodes]="s.architecture.nodes"
                [edges]="s.architecture.edges" />
            </section>

            <section>
              <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-6">Engineering decisions</h2>
              <div class="space-y-6">
                @for (d of s.decisions; track d.question) {
                  <article class="border-t border-[var(--color-border)] pt-5">
                    <h3 class="text-base md:text-lg font-bold text-[var(--color-text)] mb-2">{{ d.question }}</h3>
                    <p class="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed">{{ d.answer }}</p>
                  </article>
                }
              </div>
            </section>

            <section>
              <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-4">{{ s.shipped.title }}</h2>
              @for (p of s.shipped.paragraphs; track p) {
                <p class="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed mb-3">{{ p }}</p>
              }
              @if (s.shipped.bullets?.length) {
                <ul class="mt-4 space-y-2 list-disc list-outside ml-5 text-sm md:text-base text-[var(--color-text-muted)]">
                  @for (b of s.shipped.bullets; track b) {
                    <li>{{ b }}</li>
                  }
                </ul>
              }
            </section>

            <section>
              <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-4">{{ s.challenges.title }}</h2>
              @for (p of s.challenges.paragraphs; track p) {
                <p class="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed mb-3">{{ p }}</p>
              }
              @if (s.challenges.bullets?.length) {
                <ul class="mt-4 space-y-2 list-disc list-outside ml-5 text-sm md:text-base text-[var(--color-text-muted)]">
                  @for (b of s.challenges.bullets; track b) {
                    <li>{{ b }}</li>
                  }
                </ul>
              }
            </section>

            <section>
              <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-4">{{ s.lessons.title }}</h2>
              @for (p of s.lessons.paragraphs; track p) {
                <p class="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed mb-3">{{ p }}</p>
              }
            </section>

            @if (s.roadmap; as roadmap) {
              <section>
                <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-4">{{ roadmap.title }}</h2>
                @for (p of roadmap.paragraphs; track p) {
                  <p class="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed mb-3">{{ p }}</p>
                }
                @if (roadmap.bullets?.length) {
                  <ul class="mt-4 space-y-2 list-disc list-outside ml-5 text-sm md:text-base text-[var(--color-text-muted)]">
                    @for (b of roadmap.bullets; track b) {
                      <li>{{ b }}</li>
                    }
                  </ul>
                }
              </section>
            }
          </div>

          <footer class="mt-20 pt-8 border-t border-[var(--color-border)] flex flex-wrap gap-4 justify-between items-center">
            <a routerLink="/" fragment="projects"
               class="text-xs font-bold tracking-widest uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
              ← Back to work
            </a>
            <a routerLink="/" fragment="contact"
               class="text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] hover:underline underline-offset-4">
              Get in touch
            </a>
          </footer>
        </div>
      </main>
    } @else {
      <main class="min-h-screen flex flex-col items-center justify-center px-6 pt-28">
        <h1 class="text-3xl font-black text-[var(--color-text)] mb-4">Case study not found</h1>
        <a routerLink="/" class="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)] hover:underline">
          Return home
        </a>
      </main>
    }
  `,
})
export class CaseStudyPage {
  private route = inject(ActivatedRoute);

  private slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')), {
    initialValue: '',
  });

  readonly study = computed(() => getCaseStudy(this.slug()));
}
