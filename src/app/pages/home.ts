import { Component } from '@angular/core';
import { Hero } from '../components/hero/hero';
import { Experience } from '../components/experience/experience';
import { Education } from '../components/education/education';
import { Skills } from '../components/skills/skills';
import { ProjectsGrid } from '../components/projects-grid/projects-grid';
import { ContactForm } from '../components/contact-form/contact-form';

@Component({
  selector: 'app-home',
  imports: [Hero, Skills, ProjectsGrid, ContactForm, Experience, Education],
  template: `
    <main class="min-h-screen">
      <app-hero />

      @defer (on viewport) {
        <app-projects-grid />
      } @placeholder {
        <div style="min-height: 60vh;" aria-hidden="true"></div>
      }

      @defer (on viewport) {
        <section id="info" class="py-[var(--section-pad-y)] border-t border-[var(--color-border)]">
          <div class="page-gutter max-w-[1400px] mx-auto mb-10 md:mb-14">
            <p class="section-label mb-4">02 — Path</p>
            <h2 class="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[0.95] text-[var(--color-text)]">
              Experience &amp;<br />
              <span class="text-[var(--color-text-muted)]">education</span>
            </h2>
          </div>
          <div class="page-gutter max-w-[1400px] mx-auto">
            <app-experience />
            <div class="mt-4 md:mt-8">
              <app-education />
            </div>
          </div>
        </section>
      } @placeholder (minimum 300ms) {
        <div style="min-height: 80vh;" aria-hidden="true"></div>
      }

      @defer (on viewport) {
        <app-skills />
      } @placeholder {
        <div style="min-height: 60vh;" aria-hidden="true"></div>
      }

      @defer (on viewport) {
        <app-contact-form />
      } @placeholder {
        <div style="min-height: 80vh;" aria-hidden="true"></div>
      }
    </main>
  `,
})
export class Home {}
