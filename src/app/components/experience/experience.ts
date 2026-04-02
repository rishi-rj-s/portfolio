import { Component } from '@angular/core';

@Component({
  selector: 'app-experience',
  template: `
    <div class="h-full flex flex-col justify-center">
      <h2 class="text-3xl font-bold text-[var(--color-text)] mb-8 flex items-center gap-3">
        <span class="text-5xl text-[var(--color-text)]">01</span> EXPERIENCE
      </h2>

      <div class="relative pl-8 border-l border-[var(--color-border)] space-y-12">
        <!-- Axolon Experience -->
        <div class="relative group">
          <div class="absolute -left-[37px] top-0 w-4 h-4 rounded-full bg-[var(--color-background)] border-2 border-[var(--color-text)] group-hover:scale-125 transition-transform duration-300"></div>
          
          <div class="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h3 class="text-xl font-bold text-[var(--color-text)]">Angular Developer</h3>
            <div class="w-fit flex shrink-0 items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-card-hover)]/40 border border-[var(--color-border)] backdrop-blur-sm">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span class="text-xs font-bold tracking-wider text-[var(--color-text)] uppercase whitespace-nowrap">April 2026 – Present</span>
            </div>
          </div>
          
          <h4 class="mb-4">
            <a href="https://www.linkedin.com/company/axolonerp/posts" target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center gap-2 text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] hover:underline group/company transition-all font-medium">
               Axolon 
               <span class="group-hover/company:translate-x-1 transition-transform">→</span>
            </a>
          </h4>
          
          <ul class="text-[var(--color-text-muted)] space-y-2 list-disc list-outside ml-4">
            <li>Leading the development of enterprise-grade Angular applications with a focus on scalability and performance.</li>
            <li>Optimizing frontend architecture and implementing robust UI patterns for complex business logic.</li>
          </ul>
        </div>

        <!-- Freelance Experience -->
        <div class="relative group">
          <div class="absolute -left-[37px] top-0 w-4 h-4 rounded-full bg-[var(--color-background)] border-2 border-[var(--color-text)] group-hover:scale-125 transition-transform duration-300"></div>
          
          <div class="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h3 class="text-xl font-bold text-[var(--color-text)]">Full Stack Engineering (Freelance)</h3>
            <div class="w-fit flex shrink-0 items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-card-hover)]/40 border border-[var(--color-border)] backdrop-blur-sm">
                <span class="h-1.5 w-1.5 rounded-full bg-[var(--color-text-muted)]"></span>
                <span class="text-xs font-bold tracking-wider text-[var(--color-text)] uppercase whitespace-nowrap">2023 – March 2026</span>
            </div>
          </div>
          
          <h4 class="text-base text-[var(--color-text-secondary)] mb-4 italic">Remote Engineering Sabbatical</h4>
          
          <ul class="text-[var(--color-text-muted)] space-y-2 list-disc list-outside ml-4">
            <li>Specialization: System Design, Microservices, and Cloud Deployment (AWS).</li>
            <li>Architecting scalable solutions using NestJS, Angular, Next.js and React ecosystems.</li>
          </ul>
        </div>


      </div>
    </div>
  `,
  styles: []
})
export class Experience {}
