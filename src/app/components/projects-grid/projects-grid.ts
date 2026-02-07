import { Component, ElementRef, OnDestroy, PLATFORM_ID, inject, viewChild, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-projects-grid',
  imports: [],
  template: `
    <section id="projects" class="projects-wrapper relative h-screen overflow-hidden flex flex-col justify-center">
      
      <!-- Section Header (Fixed Top Left) -->
      <div class="absolute top-32 left-6 md:top-20 md:left-16 z-0 pointer-events-none select-none">
        <h2 class="text-4xl md:text-8xl font-black tracking-tighter text-[var(--color-text)] relative">SELECTED WORKS</h2>
        <p class="text-[var(--color-text-muted)] mt-2 font-mono text-xs uppercase tracking-widest relative"> &lt; Horizontal Scroll /&gt;</p>
      </div>

      <!-- Horizontal Track -->
      <div class="projects-track flex h-auto items-stretch pl-8 md:pl-32 pr-[20vw] gap-8 md:gap-24 will-change-transform z-10 relative mt-8 md:mt-56" #track>
        
        <!-- Project Cards -->
        @for (project of projects; track project.title) {
          <article class="project-card relative w-[90vw] md:w-[800px] h-full flex-shrink-0 bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl overflow-hidden group hover:border-[var(--color-primary)] transition-colors duration-500 flex flex-col md:flex-row shadow-2xl">
             
             <!-- Image / Visual Area (Left or Top) -->
             <div class="w-full h-44 md:h-auto md:w-1/2 bg-[var(--color-card)]/30 backdrop-blur-sm border-b md:border-b-0 md:border-r border-[var(--color-border)] relative overflow-hidden group flex-shrink-0">
                
                @if (project.image) {
                   <img [src]="project.image" [alt]="project.title" class="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                   <div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
                } @else {
                  <!-- Fallback/Placeholder -->
                  <div class="absolute inset-0 bg-gradient-to-br from-[var(--color-card)] to-[var(--color-background)] flex items-center justify-center">
                      <div class="absolute inset-0 opacity-20" style="background-image: url('assets/noise.svg')"></div>
                      <span class="text-[8rem] md:text-[12rem] font-black text-[var(--color-text)] opacity-5 absolute -bottom-10 -left-10 leading-none select-none">{{project.year}}</span>
                  </div>
                }
                
             </div>
             
             <!-- Content Area (Right or Bottom) -->
             <div class="w-full md:w-1/2 p-5 md:p-10 flex flex-col justify-between flex-1 bg-[var(--color-card)]">
                <div>
                  <div class="flex items-start justify-between mb-4 gap-4">
                     <h3 class="text-2xl md:text-5xl font-black tracking-tighter text-[var(--color-text)] mb-2">{{project.title}}</h3>
                     <span class="text-xs px-3 py-1 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-full uppercase tracking-wider bg-[var(--color-card)] whitespace-nowrap shrink-0">{{project.type}}</span>
                  </div>
                  
                  <p class="text-[var(--color-text-secondary)] mb-4 md:mb-8 leading-relaxed text-sm md:text-base">{{project.description}}</p>
                  
                  <div class="mb-4 md:mb-8">
                     <h4 class="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 md:mb-3">Tech Matrix</h4>
                     <div class="flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-none">
                        @for (stack of project.stack; track stack) {
                          <span class="text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-card-hover)] px-2 py-1 rounded border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors cursor-default whitespace-nowrap">
                              {{stack}}
                          </span>
                        }
                     </div>
                  </div>
                </div>
  
                <div class="flex gap-6 mt-4 pt-4 border-t border-[var(--color-border)]">
                   @if (project.links.source) {
                     <a [href]="project.links.source" target="_blank" class="text-sm font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] flex items-center gap-2 group/link">
                        SOURCE CODE 
                        <span class="group-hover/link:translate-x-1 transition-transform">&rarr;</span>
                     </a>
                   }
                   @if (project.links.live) {
                     <a [href]="project.links.live" target="_blank" class="text-sm font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] flex items-center gap-2 group/link">
                        {{ project.demoLabel || 'LIVE DEMO' }}
                        <span class="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform">&#8599;</span>
                     </a>
                   }
                </div>
             </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: []
})
export class ProjectsGrid implements OnDestroy {
  track = viewChild<ElementRef<HTMLElement>>('track');
  
  projects = [
    {
      title: 'Tagtics',
      type: 'SaaS',
      year: '2025',
      image: 'assets/projects/tagtics.png',
      description: 'A framework-agnostic UI tagging tool for real-time feedback. Features serverless architecture on Supabase Edge Functions (Deno) and strict RLS security.',
      stack: ['React', 'Supabase', 'PostgreSQL', 'RLS'],
      links: { source: 'https://github.com/tagtics/tagtics-frontend', live: 'https://www.tagtics.online' },
      demoLabel: 'LIVE'
    },
    {
      title: 'Ever-Gauzy',
      type: 'ERP',
      year: '2025',
      image: 'assets/projects/ever-gauzy.png',
      description: 'Contributed to a 100k+ LoC enterprise ERP. Improved Auth UI and navigated complex NestJS/Angular monorepo architecture.',
      stack: ['NestJS', 'Angular', 'Nx', 'CQRS'],
      links: { source: 'https://github.com/ever-co/ever-gauzy', live: 'https://app.gauzy.co/#/auth/login' },
      demoLabel: 'LIVE'
    },
    {
      title: 'Eezy-Cabs',
      type: 'Microservices',
      year: '2024',
      image: 'assets/projects/eezy-cabs.png',
      description: 'Scalable ride-hailing platform with distributed systems architecture. Orchestrated via API Gateway with Redis/Kafka for real-time tracking.',
      stack: ['NestJS', 'Kafka', 'Redis', 'MongoDB'],
      links: { source: 'https://github.com/eezy-cabs-rrjs/EC-Backend-MR', live: 'https://raw.githubusercontent.com/eezy-cabs-rrjs/EC-Backend-MR/refs/heads/main/Arch-Diagram.png' },
      demoLabel: 'ARCH. IMG'
    },
    {
      title: 'Career Coach',
      type: 'AI Agent',
      year: '2025',
      image: 'assets/projects/career-comeback-coach.jpg',
      description: 'Voice-interactive AI agent using Gemini LLM and ElevenLabs. Achieved sub-500ms latency via WebSockets and sliding-window context.',
      stack: ['Angular', 'Gemini', 'ElevenLabs', 'WebSockets'],
      links: { source: 'https://github.com/raseenaanwar/hackathon-accelerateInnovation-careerComebackCoach', live: 'https://career-comeback-coach.vercel.app/' },
      demoLabel: 'LIVE'
    },
    {
      title: 'Fashion Studio',
      type: 'E-Commerce',
      year: '2024',
      image: 'assets/projects/fashion-studio.png',
      description: 'Production E-commerce backend deployed on AWS EC2 with Nginx. Secure payments integration via Razorpay.',
      stack: ['Node.js', 'MongoDB', 'AWS EC2', 'Nginx'],
      links: { source: 'https://github.com/rishi-rj-s/RSBackend' }
    }
  ];

  ctx: gsap.Context | undefined;
  
  private platformId = inject(PLATFORM_ID);
  
  constructor() {
    afterNextRender(() => {
        // Use ResizeObserver to detect when the track actually has dimensions
        const trackEl = this.track()?.nativeElement;
        if (!trackEl) return;

        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.contentBoxSize) {
              const trackWidth = trackEl.scrollWidth;
              const windowWidth = window.innerWidth;
              
              if (trackWidth > windowWidth) {
                this.initScroll(trackWidth, windowWidth);
                resizeObserver.disconnect(); // Initialize once
              }
            }
          }
        });
        
        resizeObserver.observe(trackEl);
    });
  }

  private initScroll(trackWidth: number, windowWidth: number) {
     this.ctx = gsap.context(() => {
        const xMove = -(trackWidth - windowWidth);
        const trackEl = this.track()!.nativeElement;

        gsap.to(trackEl, {
           x: xMove,
           ease: 'none',
           scrollTrigger: {
              trigger: '.projects-wrapper',
              pin: true,
              start: 'top top',
              scrub: 1,
              end: () => "+=" + (trackWidth - windowWidth),
              invalidateOnRefresh: true,
              preventOverlaps: true
           }
        });
     });
     ScrollTrigger.refresh();
  }

  ngOnDestroy() {
    this.ctx?.revert();
  }
}