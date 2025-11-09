import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  challenge: string;
  impact: string;
  tech: string[];
  github?: string;
  live?: string;
  caseStudyRoute: string;
  gridClass: string;
}

@Component({
  selector: 'app-projects-grid',
  imports: [
    CommonModule,
    RouterLink,
  ],
  template: `
    <section class="projects-section" aria-labelledby="projects-heading">
      <div class="container">
        <h2 id="projects-heading" class="section-title">Featured Projects</h2>
        <p class="section-description">
          Production-grade applications demonstrating architectural mastery and scalable system design
        </p>

        <!-- Bento Grid Layout -->
        <div class="bento-grid">
          @for (project of projects(); track project.id) {
            <article class="project-card" 
                     [class]="project.gridClass"
                     [class.active]="hoveredProject() === project.id"
                     (mouseenter)="setHoveredProject(project.id)"
                     (mouseleave)="clearHoveredProject()">
              
              <div class="card-content">
                <!-- Header -->
                <div class="card-header">
                  <h3 class="project-title">{{ project.title }}</h3>
                  <p class="project-subtitle">{{ project.subtitle }}</p>
                </div>

                <!-- Technical Challenge Badge -->
                <div class="challenge-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                  <span>{{ project.challenge }}</span>
                </div>

                <!-- Impact Metric -->
                <div class="impact-metric">
                  <div class="metric-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                  </div>
                  <div class="metric-content">
                    <div class="metric-label">Measurable Impact</div>
                    <div class="metric-value">{{ project.impact }}</div>
                  </div>
                </div>

                <!-- Tech Stack -->
                <div class="tech-stack">
                  @for (tech of project.tech; track tech) {
                    <span class="tech-badge">{{ tech }}</span>
                  }
                </div>

                <!-- Action Links -->
                <div class="card-actions">
                  <a [routerLink]="project.caseStudyRoute" 
                     class="btn-primary"
                     [attr.aria-label]="'View ' + project.title + ' case study'">
                    <span>View Case Study</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                  
                  <div class="external-links">
                    @if (project.github) {
                      <a [href]="project.github" 
                         target="_blank"
                         rel="noopener noreferrer"
                         class="icon-link"
                         [attr.aria-label]="'View ' + project.title + ' on GitHub'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                      </a>
                    }
                    @if (project.live) {
                      <a [href]="project.live" 
                         target="_blank"
                         rel="noopener noreferrer"
                         class="icon-link"
                         [attr.aria-label]="'Visit live ' + project.title + ' website'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                    }
                  </div>
                </div>
              </div>

              <!-- Animated Background Gradient -->
              <div class="card-gradient" aria-hidden="true"></div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
  @property --gradient-angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }

    .projects-section {
      padding-block: 6rem;
      background: var(--color-background);
    }

    .container {
      inline-size: 100%;
      max-inline-size: 1280px;
      margin-inline: auto;
      padding-inline: 1.5rem;
    }

    .section-title {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 800;
      text-align: center;
      margin-block-end: 1rem;
      background: linear-gradient(135deg, var(--color-text), var(--color-primary));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .section-description {
      text-align: center;
      font-size: 1.125rem;
      color: var(--color-text-muted);
      max-inline-size: 700px;
      margin-inline: auto;
      margin-block-end: 4rem;
    }

    .bento-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(12, 1fr);
      grid-auto-rows: minmax(320px, auto);
    }

    .project-card {
      position: relative;
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: 1.25rem;
      padding: 2rem;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
    }

    /* Bento Grid Responsive Classes */
    .grid-large {
      grid-column: span 12;
    }

    @media (min-width: 768px) {
      .grid-large {
        grid-column: span 8;
        grid-row: span 2;
      }
    }

    .grid-medium {
      grid-column: span 12;
    }

    @media (min-width: 768px) {
      .grid-medium {
        grid-column: span 4;
      }
    }

    .grid-tall {
      grid-column: span 12;
    }

    @media (min-width: 768px) {
      .grid-tall {
        grid-column: span 6;
        grid-row: span 2;
      }
    }

    .grid-wide {
      grid-column: span 12;
    }

    @media (min-width: 768px) {
      .grid-wide {
        grid-column: span 6;
      }
    }

    .project-card::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: conic-gradient(
        from var(--gradient-angle),
        var(--color-primary),
        var(--color-accent),
        var(--color-primary)
      );
      border-radius: inherit;
      opacity: 0;
      transition: opacity 0.4s ease;
      z-index: -1;
      animation: rotate-gradient 4s linear infinite;
    }

    @keyframes rotate-gradient {
      to {
        --gradient-angle: 360deg;
      }
    }

    .project-card:hover::before,
    .project-card:focus-within::before,
    .project-card.active::before {
      opacity: 1;
    }

    .project-card:hover,
    .project-card:focus-within,
    .project-card.active {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px color-mix(in srgb, var(--color-primary) 20%, transparent);
    }

    .card-gradient {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top right, 
        color-mix(in srgb, var(--color-primary) 15%, transparent), 
        transparent 60%);
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
    }

    .project-card:hover .card-gradient,
    .project-card.active .card-gradient {
      opacity: 1;
    }

    .card-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      block-size: 100%;
    }

    .card-header {
      flex-shrink: 0;
    }

    .project-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin-block-end: 0.5rem;
      color: var(--color-text);
    }

    .project-subtitle {
      font-size: 1rem;
      color: var(--color-text-muted);
      margin: 0;
    }

    .challenge-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding-inline: 1rem;
      padding-block: 0.5rem;
      background: color-mix(in srgb, var(--color-accent) 15%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-accent);
    }

    .impact-metric {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.25rem;
      background: color-mix(in srgb, var(--color-primary) 8%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
      border-radius: 0.75rem;
    }

    .metric-icon {
      flex-shrink: 0;
      inline-size: 40px;
      block-size: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--color-primary) 20%, transparent);
      border-radius: 0.5rem;
      color: var(--color-primary);
    }

    .metric-content {
      flex: 1;
    }

    .metric-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted);
      margin-block-end: 0.25rem;
      font-weight: 600;
    }

    .metric-value {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-text);
    }

    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-block-start: auto;
    }

    .tech-badge {
      font-size: 0.75rem;
      padding-inline: 0.75rem;
      padding-block: 0.375rem;
      background: color-mix(in srgb, var(--color-border) 30%, transparent);
      border: 1px solid var(--color-border);
      border-radius: 0.375rem;
      color: var(--color-text-secondary);
      font-weight: 500;
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-block-start: 1rem;
      padding-block-start: 1.5rem;
      border-block-start: 1px solid var(--color-border);
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding-inline: 1.5rem;
      padding-block: 0.75rem;
      background: var(--color-primary);
      color: white;
      border-radius: 0.5rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      flex: 1;
      justify-content: center;
    }

    .btn-primary:hover,
    .btn-primary:focus-visible {
      background: color-mix(in srgb, var(--color-primary) 90%, black);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary) 40%, transparent);
    }

    .btn-primary:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .external-links {
      display: flex;
      gap: 0.5rem;
    }

    .icon-link {
      inline-size: 40px;
      block-size: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--color-border) 30%, transparent);
      border: 1px solid var(--color-border);
      border-radius: 0.5rem;
      color: var(--color-text-secondary);
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .icon-link:hover,
    .icon-link:focus-visible {
      background: color-mix(in srgb, var(--color-primary) 15%, transparent);
      border-color: var(--color-primary);
      color: var(--color-primary);
      transform: translateY(-2px);
    }

    .icon-link:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      .project-card,
      .btn-primary,
      .icon-link,
      .card-gradient {
        transition: none;
        animation: none;
      }
      
      .project-card::before {
        animation: none;
      }
    }
  `,
})
export class ProjectsGrid {
  projects = signal<Project[]>([
    {
      id: 'tagtics',
      title: 'Tagtics',
      subtitle: 'SaaS Feedback Platform',
      challenge: 'Multi-Tenant Data Isolation',
      impact: '99.99% Data Isolation via RLS',
      tech: ['React', 'Supabase', 'PostgreSQL', 'REST APIs'],
      github: 'https://github.com/tagtics/tagtics-frontend',
      live: 'https://www.tagtics.online',
      caseStudyRoute: '/case-study/tagtics',
      gridClass: 'grid-large'
    },
    {
      id: 'eezy-cabs',
      title: 'EEZY-CABS',
      subtitle: 'Taxi Booking Platform',
      challenge: 'gRPC Microservice Integration',
      impact: 'Sub-100ms Service Communication',
      tech: ['Angular', 'NestJS', 'Kafka', 'Kubernetes'],
      github: 'https://github.com/eezy-cabs-rrjs/EC-Backend-MR',
      caseStudyRoute: '/case-study/eezy-cabs',
      gridClass: 'grid-medium'
    },
    {
      id: 'apply-log',
      title: 'Apply Log',
      subtitle: 'Job Application Tracker',
      challenge: 'Real-Time State Management',
      impact: '100% Client-Side Privacy',
      tech: ['Vue', 'Supabase', 'PostgreSQL', 'RLS'],
      github: 'https://github.com/rishi-rj-s/job-tracker-frontend',
      live: 'https://apply-log-henna.vercel.app/',
      caseStudyRoute: '/case-study/apply-log',
      gridClass: 'grid-tall'
    },
    {
      id: 'fashion-studio',
      title: 'Fashion Studio',
      subtitle: 'E-Commerce Platform',
      challenge: 'Payment Gateway Integration',
      impact: 'Zero Transaction Failures',
      tech: ['Node.js', 'Express', 'MongoDB', 'AWS EC2'],
      github: 'https://github.com/rishi-rj-s/RSBackend',
      caseStudyRoute: '/case-study/fashion-studio',
      gridClass: 'grid-wide'
    }
  ]);

  hoveredProject = signal<string | null>(null);

  setHoveredProject(id: string) {
    this.hoveredProject.set(id);
  }

  clearHoveredProject() {
    this.hoveredProject.set(null);
  }
}