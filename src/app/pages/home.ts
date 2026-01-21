import { Component } from '@angular/core';
import { Hero } from '../components/hero/hero';
import { Skills } from '../components/skills/skills';
import { ProjectsGrid } from '../components/projects-grid/projects-grid';
import { ContactForm } from '../components/contact-form/contact-form';
import { SocialIsland } from '../components/social-island/social-island';

@Component({
  selector: 'app-home',
  imports: [
    Hero,
    Skills,
    ProjectsGrid,
    ContactForm,
    SocialIsland,
  ],
  template: `
    <main class="min-h-screen">
      <app-hero />
      <app-skills />
      <app-projects-grid />
      <app-contact-form />
      <app-social-island />
    </main>
  `
})
export class Home {}