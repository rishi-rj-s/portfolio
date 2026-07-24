import { Component } from '@angular/core';
import { profile } from '../../data/profile';

@Component({
  selector: 'app-why-me',
  template: `
    <section id="why-me" class="relative py-20 md:py-28 px-6 md:px-28">
      <div class="max-w-7xl mx-auto w-full">
        <div class="mb-12 md:mb-16 max-w-2xl">
          <h2 class="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-[var(--color-text)] mb-4 leading-[0.95]">
            {{ copy.headline }}
          </h2>
          <p class="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed">
            {{ copy.support }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          @for (point of copy.points; track point.title; let i = $index) {
            <article class="border-t border-[var(--color-border)] pt-6 group">
              <div class="flex items-baseline gap-4 mb-3">
                <span class="font-mono text-xs tracking-widest text-[var(--color-text-secondary)] opacity-50">
                  0{{ i + 1 }}
                </span>
                <h3 class="text-xl md:text-2xl font-bold text-[var(--color-text)] tracking-tight group-hover:text-[var(--color-primary)] transition-colors">
                  {{ point.title }}
                </h3>
              </div>
              <p class="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed pl-10">
                {{ point.body }}
              </p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class WhyMe {
  readonly copy = profile.whyMe;
}
