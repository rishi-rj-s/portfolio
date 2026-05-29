import { Component } from '@angular/core';
import { Hero } from '../components/hero/hero';
import { Skills } from '../components/skills/skills';
import { ProjectsGrid } from '../components/projects-grid/projects-grid';
import { ContactForm } from '../components/contact-form/contact-form';
import { SocialIsland } from '../components/social-island/social-island';
import { Experience } from '../components/experience/experience';
import { Education } from '../components/education/education';

@Component({
  selector: 'app-home',
  imports: [
    Hero,
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

      <!-- Info Section (Experience & Education) -->
      @defer (on viewport) {
        <section id="info" class="min-h-screen py-20 px-6 md:px-20 max-w-7xl mx-auto flex flex-col justify-center">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <app-experience class="w-full" />
            <app-education class="w-full" />
          </div>
        </section>
      } @placeholder (minimum 500ms) {
        <div style="min-height: 100vh;"></div>
      }

      @defer (on viewport) {
        <app-skills />
      } @placeholder {
        <div style="min-height: 100vh;"></div>
      }

      @defer (on viewport) {
        <app-projects-grid />
      } @placeholder {
        <div style="min-height: 100vh;"></div>
      }

      @defer (on viewport) {
        <app-contact-form />
      } @placeholder {
        <div style="min-height: 100vh;"></div>
      }

      @defer {
        <app-social-island />
      }
    </main>
  `
})
export class Home {}