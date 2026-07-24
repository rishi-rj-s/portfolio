import { Component, signal, viewChild, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { skillCategories, SkillCategory } from '../../data/skills';

@Component({
  selector: 'app-skills',
  template: `
    <section id="skills" class="relative min-h-screen py-20 px-6 md:px-28 flex flex-col justify-center">

      <div class="max-w-7xl mx-auto w-full">
         <div class="mb-12" #header>
            <h2 class="text-3xl md:text-6xl lg:text-8xl font-black tracking-tighter text-[var(--color-text)] mb-4 leading-[0.8]">
              SHIPPED<br>
              <span class="text-[var(--color-text-muted)] opacity-50">SKILLS</span>
            </h2>
            <p class="mt-4 max-w-xl text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed">
              Not a technology dump — each item is tied to something I have actually built or operated.
            </p>
         </div>

         <div class="space-y-10" #grid>
            @for (category of skills(); track category.category) {
              <div class="border-t border-[var(--color-border)] pt-6 group cursor-default">

                 <div class="flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
                    <h3 class="text-xl md:text-2xl font-bold text-[var(--color-text)] tracking-tight w-full md:w-1/4 shrink-0 flex items-center gap-3 pt-1">
                       <span class="w-2 h-2 rounded-full transition-transform duration-500 group-hover:scale-150" [style.backgroundColor]="category.color"></span>
                       {{category.category}}
                    </h3>

                    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                       @for (item of category.items; track item.name) {
                         <div class="flex items-start gap-3 group/item">
                            <div class="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-[var(--color-card)] rounded-full flex items-center justify-center border border-[var(--color-border)] group-hover/item:border-[var(--color-primary)] transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover/item:scale-110 group-hover/item:-translate-y-1 group-hover/item:shadow-[0_15px_30px_-10px_var(--color-primary)]">
                               <img [src]="item.logo" [alt]="item.name" [class.theme-inverse]="item.invertDark"
                                    class="w-5 h-5 md:w-6 md:h-6 object-contain transition-all duration-500"
                                    loading="lazy" decoding="async" width="24" height="24">
                            </div>
                            <div class="min-w-0 pt-0.5">
                               <span class="block text-base md:text-lg font-medium text-[var(--color-text)] group-hover/item:text-[var(--color-primary)] transition-colors">{{item.name}}</span>
                               <span class="block text-xs md:text-sm text-[var(--color-text-muted)] leading-snug mt-0.5">{{item.proof}}</span>
                            </div>
                         </div>
                       }
                    </div>
                 </div>

              </div>
            }
         </div>

      </div>
    </section>
  `
})
export class Skills {
  header = viewChild<ElementRef<HTMLElement>>('header');
  grid = viewChild<ElementRef<HTMLElement>>('grid');

  private platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  skills = signal<SkillCategory[]>(skillCategories);
}
