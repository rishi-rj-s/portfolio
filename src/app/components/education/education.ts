import { Component } from '@angular/core';

@Component({
  selector: 'app-education',
  template: `
    <div class="space-y-0">
      @for (item of items; track item.title; let i = $index) {
        <article
          class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10 md:py-14 border-t border-[var(--color-border)] px-0 md:px-4 -mx-0 md:-mx-4"
        >
          <div class="md:col-span-2">
            <span class="font-mono text-sm text-[var(--color-primary)] font-bold">E{{ i + 1 }}</span>
          </div>
          <div class="md:col-span-3">
            <p class="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--color-text-muted)]">
              {{ item.period }}
            </p>
          </div>
          <div class="md:col-span-7">
            <h3 class="text-2xl md:text-3xl font-black tracking-tight text-[var(--color-text)] mb-1">
              {{ item.title }}
            </h3>
            <p class="text-sm text-[var(--color-text-secondary)] mb-3">{{ item.subtitle }}</p>
            @if (item.link) {
              <a
                [href]="item.link"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                View Credly Badge →
              </a>
            }
          </div>
        </article>
      }
    </div>
  `,
})
export class Education {
  items = [
    {
      title: 'Bachelor of Computer Science',
      subtitle: 'University of Kerala, India',
      period: '2020 — 2023',
      link: null as string | null,
    },
    {
      title: 'Japanese Language Certificate',
      subtitle: 'Upper-Beginner Level',
      period: 'Credential',
      link: 'https://www.credly.com/badges/1dbf4ba3-e87b-48eb-8411-2d5a76b379be/linked_in_profile',
    },
  ];
}
