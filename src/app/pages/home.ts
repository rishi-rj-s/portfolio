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
      <section id="info" class="min-h-screen py-20 px-6 md:px-20 max-w-7xl mx-auto flex flex-col justify-center">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <app-experience class="w-full" />
          <app-education class="w-full" />
        </div>
      </section>

      <app-skills />

      <!-- Defer heavy GSAP-dependent section until user scrolls near it -->
      @defer (on viewport) {
        <app-projects-grid />
      } @placeholder {
        <section id="projects" class="relative h-[100dvh] flex items-center justify-center">
          <h2 class="text-3xl md:text-6xl lg:text-8xl font-black tracking-tighter text-[var(--color-text)]">SELECTED WORKS</h2>
        </section>
      }

      <!-- Defer contact form until visible -->
      @defer (on viewport) {
        <app-contact-form />
      } @placeholder {
        <section id="contact" class="min-h-screen flex items-center justify-center">
          <h2 class="text-4xl md:text-6xl font-black text-[var(--color-text)]">LET'S TALK</h2>
        </section>
      }

      <app-social-island />
    </main>
  `
})
export class Home {}