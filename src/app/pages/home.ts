import { Component } from '@angular/core';
import { Hero } from '../components/hero/hero';
import { Skills } from '../components/skills/skills';
import { ProjectsGrid } from '../components/projects-grid/projects-grid';
import { ContactForm } from '../components/contact-form/contact-form';
import { Footer } from '../components/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Hero,
    Skills,
    ProjectsGrid,
    ContactForm,
    Footer
  ],
  template: `
    <main class="min-h-screen">
      <app-hero />
      <app-skills />
      <app-projects-grid />
      <app-contact-form />
      <app-footer />
    </main>
  `
})
export class Home {}