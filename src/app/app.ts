import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar
  ],
  template: `
  <div class="relative min-h-screen">
    <app-navbar />
    <div class="relative">
      <router-outlet />
    </div>
  </div>
      <!-- Structured Data for SEO -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Rishiraj Sajeev",
      "jobTitle": "Full-Stack Developer",
      "url": "https://rishiraj-sajeev.space",
      "sameAs": [
        "https://www.linkedin.com/in/rishiraj-sajeev",
        "https://github.com/rishi-rj-s"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Kerala",
        "addressCountry": "IN"
      },
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "University of Kerala"
      },
      "knowsAbout": [
        "Vue.js",
        "Angular",
        "React",
        "Node.js",
        "NestJS",
        "TypeScript",
        "PostgreSQL",
        "MongoDB",
        "Docker",
        "Kubernetes"
      ]
    }
    </script>
  `
})
export class App { }