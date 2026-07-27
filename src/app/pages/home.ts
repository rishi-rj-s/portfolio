import { Component, PLATFORM_ID, afterNextRender, inject, ChangeDetectionStrategy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Hero } from '../components/hero/hero';
import { WhyMe } from '../components/why-me/why-me';
import { Skills } from '../components/skills/skills';
import { ProjectsGrid } from '../components/projects-grid/projects-grid';
import { ContactForm } from '../components/contact-form/contact-form';
import { SocialIsland } from '../components/social-island/social-island';
import { Experience } from '../components/experience/experience';
import { Education } from '../components/education/education';
import { ScrollService } from '../services/scroll';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Hero,
    WhyMe,
    Skills,
    ProjectsGrid,
    ContactForm,
    SocialIsland,
    Experience,
    Education,
  ],
  template: `
    <main class="min-h-screen">
      <!-- Hero is the only eager above-the-fold block (LCP) -->
      <app-hero />

      <!-- SSR HTML kept; JS hydration deferred off the critical path -->
      @defer (hydrate on idle) {
        <app-why-me />
      }

      @defer (hydrate on viewport) {
        <section id="info" class="min-h-screen py-20 px-6 md:px-20 max-w-7xl mx-auto flex flex-col justify-center">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <app-experience class="w-full" />
            <app-education class="w-full" />
          </div>
        </section>
      }

      @defer (hydrate on viewport) {
        <app-skills />
      }

      @defer (hydrate on viewport) {
        <app-projects-grid />
      }

      @defer (hydrate on viewport) {
        <app-contact-form />
      }

      @defer (on idle) {
        <app-social-island />
      }
    </main>
  `
})
export class Home {
  private route = inject(ActivatedRoute);
  private scrollService = inject(ScrollService);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const fragment = this.route.snapshot.fragment;
      if (fragment) {
        // Retry briefly — deferred sections may still be attaching
        const tryScroll = (attempt: number) => {
          const el = document.getElementById(fragment);
          if (el) {
            this.scrollService.scrollTo(`#${fragment}`);
            return;
          }
          if (attempt < 8) {
            setTimeout(() => tryScroll(attempt + 1), 200);
          }
        };
        setTimeout(() => tryScroll(0), 100);
      }
    });
  }
}
