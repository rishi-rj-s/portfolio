import { Component } from '@angular/core';

@Component({
  selector: 'app-education',
  standalone: true,
  template: `
    <div class="h-full flex flex-col justify-center">
      <h3 class="text-3xl font-bold text-[var(--color-text)] mb-8 flex items-center gap-3">
        <span class="text-5xl text-[var(--color-text)]">02</span> EDUCATION
      </h3>

      <div class="relative pl-8 border-l border-[var(--color-border)] space-y-12">
        <!-- Education Item 1 -->
        <div class="relative group">
          <div class="absolute -left-[37px] top-0 w-4 h-4 rounded-full bg-[var(--color-background)] border-2 border-[var(--color-text)] group-hover:scale-125 transition-transform duration-300"></div>
          
          <div class="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h4 class="text-xl font-bold text-[var(--color-text)]">Bachelor of Computer Science</h4>
            <div class="flex shrink-0 items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-card-hover)]/40 border border-[var(--color-border)] backdrop-blur-sm">
                <span class="h-1.5 w-1.5 rounded-full bg-[var(--color-text-muted)]"></span>
                <span class="text-xs font-bold tracking-wider text-[var(--color-text)] uppercase whitespace-nowrap">2020 – 2023</span>
            </div>
          </div>
          
          <h5 class="text-base text-[var(--color-text-secondary)] mb-4">University of Kerala, India</h5>
        </div>

        <!-- Certification Item -->
         <div class="relative group">
          <div class="absolute -left-[37px] top-0 w-4 h-4 rounded-full bg-[var(--color-background)] border-2 border-[var(--color-text)] group-hover:scale-125 transition-transform duration-300"></div>
          
          <div class="mb-2">
            <h4 class="text-xl font-bold text-[var(--color-text)]">Japanese Language Certificate</h4>
            <span class="text-sm text-[var(--color-text-secondary)] block mt-1">(Upper-Beginner Level)</span>
          </div>
          
          <a href="https://www.credly.com/badges/1dbf4ba3-e87b-48eb-8411-2d5a76b379be/linked_in_profile" 
             target="_blank" 
             rel="noopener noreferrer"
             class="inline-flex items-center gap-2 text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] hover:underline mt-2 group/link">
             View Credly Badge
             <span class="group-hover/link:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class Education {}
