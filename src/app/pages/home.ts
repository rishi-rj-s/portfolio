import { Component, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
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
      <app-hero />

      <app-why-me />

      <!-- Info Section (Experience & Education) — eager for prerender/SEO -->
      <section id="info" class="min-h-screen py-20 px-6 md:px-20 max-w-7xl mx-auto flex flex-col justify-center">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <app-experience class="w-full" />
          <app-education class="w-full" />
        </div>
      </section>

      <app-skills />

      <app-projects-grid />

      <app-contact-form />

      @defer {
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
        setTimeout(() => this.scrollService.scrollTo(`#${fragment}`), 150);
      }
    });
  }
}
