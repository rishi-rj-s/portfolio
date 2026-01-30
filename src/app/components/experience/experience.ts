import { Component } from '@angular/core';

@Component({
  selector: 'app-experience',
  standalone: true,
  template: `
    <div class="h-full flex flex-col justify-center">
      <h3 class="text-3xl font-bold text-[var(--color-text)] mb-8 flex items-center gap-3">
        <span class="text-5xl text-[var(--color-text)]">01</span> EXPERIENCE
      </h3>

      <div class="relative pl-8 border-l border-[var(--color-border)] space-y-12">
        <!-- Experience Item 1 -->
        <div class="relative group">
          <div class="absolute -left-[37px] top-0 w-4 h-4 rounded-full bg-[var(--color-background)] border-2 border-[var(--color-text)] group-hover:scale-125 transition-transform duration-300"></div>
          
          <div class="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h4 class="text-xl font-bold text-[var(--color-text)]">Full Stack Engineering (Independent)</h4>
            <div class="flex shrink-0 items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-card-hover)]/40 border border-[var(--color-border)] backdrop-blur-sm">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span class="text-xs font-bold tracking-wider text-[var(--color-text)] uppercase whitespace-nowrap">2023 – Present</span>
            </div>
          </div>
          
          <h5 class="text-base text-[var(--color-text-secondary)] mb-4 italic">Remote Engineering Sabbatical</h5>
          
          <ul class="text-[var(--color-text-muted)] space-y-2 list-disc list-outside ml-4">
            <li>Specialization: System Design, Microservices, and Cloud Deployment (AWS).</li>
            <li>Architecting scalable solutions using NestJS, Angular, and React ecosystems.</li>
          </ul>
        </div>

        <!-- Experience Item 2 (Open Source) -->
        <div class="relative group">
          <div class="absolute -left-[37px] top-0 w-4 h-4 rounded-full bg-[var(--color-background)] border-2 border-[var(--color-text)] group-hover:scale-125 transition-transform duration-300"></div>
          
          <div class="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h4 class="text-xl font-bold text-[var(--color-text)]">Open Source Contributor (Ever-Gauzy)</h4>
            <div class="flex shrink-0 items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-card-hover)]/40 border border-[var(--color-border)] backdrop-blur-sm">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span class="text-xs font-bold tracking-wider text-[var(--color-text)] uppercase whitespace-nowrap">Nov 2025 – Present</span>
            </div>
          </div>
          
          <h5 class="text-base text-[var(--color-text-secondary)] mb-4 italic">Enterprise ERP System</h5>
          
          <ul class="text-[var(--color-text-muted)] space-y-2 list-disc list-outside ml-4">
            <li>Contributed to a 100k+ LoC ERP, navigating a complex NestJS and Angular codebase to improve Auth UI.</li>
            <li>Gained practical exposure to enterprise patterns like CQRS, Event Sourcing, and Hexagonal Architecture.</li>
            <li>
                 <a href="https://github.com/ever-co/ever-gauzy" target="_blank" class="text-[var(--color-text)] hover:text-[var(--color-primary)] hover:underline inline-flex items-center gap-1">
                   View Upstream Repo <span>→</span>
                 </a>
            </li>
          </ul>
        </div>


      </div>
    </div>
  `,
  styles: []
})
export class Experience {}
