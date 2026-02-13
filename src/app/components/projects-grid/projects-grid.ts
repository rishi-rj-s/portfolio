import { Component, ElementRef, OnDestroy, PLATFORM_ID, inject, viewChild, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
// GSAP loaded dynamically for better TBT

@Component({
  selector: 'app-projects-grid',
  imports: [],
  template: `
    <section id="projects" class="projects-wrapper relative h-[100dvh] overflow-hidden flex flex-col justify-start pt-24 md:pt-32 pb-4 bg-[var(--color-background)]">
      
      <!-- Section Header (Static Layout) -->
      <div class="w-full px-6 py-2 md:px-16 md:py-4 flex-shrink-0 z-20 relative pointer-events-none select-none text-center md:text-left">
        <h2 class="text-3xl md:text-6xl lg:text-8xl font-black tracking-tighter text-[var(--color-text)] relative">SELECTED WORKS</h2>
        <p class="text-[var(--color-text-muted)] mt-1 md:mt-2 font-mono text-[10px] md:text-xs uppercase tracking-widest relative"> &lt; Horizontal Scroll /&gt;</p>
      </div>

      <!-- Horizontal Track -->
      <div class="projects-track flex flex-1 min-h-0 w-full items-center pl-6 md:pl-16 lg:pl-32 pr-[20vw] gap-6 md:gap-16 lg:gap-24 will-change-transform z-10 relative my-2 md:my-4" #track>
        
        <!-- Project Cards -->
        @for (project of projects; track project.title) {
          <article class="project-card relative w-[85vw] md:w-[700px] lg:w-[800px] h-full max-h-[500px] md:max-h-[700px] flex-shrink-0 bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl overflow-hidden group hover:border-[var(--color-primary)] transition-colors duration-500 flex flex-col md:flex-row shadow-2xl">
             
             <!-- Image / Visual Area (Left or Top) -->
             <div class="w-full h-36 md:h-auto md:w-1/2 bg-[var(--color-card)]/30 backdrop-blur-sm border-b md:border-b-0 md:border-r border-[var(--color-border)] relative overflow-hidden group flex-shrink-0">
                
                @if (project.image) {
                   <img [src]="project.image" [alt]="project.title" 
                        class="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105" 
                        loading="lazy" decoding="async" width="400" height="300" />
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
             <div class="w-full md:w-1/2 p-4 md:p-8 flex flex-col h-full bg-[var(--color-card)] overflow-hidden">
                <div class="flex-1 overflow-y-auto scrollbar-none">
                  <div class="flex items-start justify-between mb-2 md:mb-4 gap-4">
                     <h3 class="text-xl md:text-3xl lg:text-4xl font-black tracking-tighter text-[var(--color-text)] mb-1">{{project.title}}</h3>
                     <span class="text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-full uppercase tracking-wider bg-[var(--color-card)] whitespace-nowrap shrink-0">{{project.type}}</span>
                  </div>
                  
                  <p class="text-[var(--color-text-secondary)] mb-3 md:mb-6 leading-relaxed text-xs md:text-sm lg:text-base line-clamp-3 md:line-clamp-none">{{project.description}}</p>
                  
                  <div class="mb-3 md:mb-6">
                     <h4 class="text-[10px] md:text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Tech Matrix</h4>
                     <div class="flex flex-wrap gap-2">
                        @for (stack of project.stack; track stack) {
                          <span class="text-[10px] md:text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-card-hover)] px-2 py-1 rounded border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors cursor-default whitespace-nowrap">
                              {{stack}}
                          </span>
                        }
                     </div>
                  </div>
                </div>
  
                <div class="flex gap-4 md:gap-6 mt-2 pt-3 border-t border-[var(--color-border)] relative z-30 pointer-events-auto shrink-0">
                   @if (project.links.source) {
                     <a [href]="project.links.source" target="_blank" class="text-xs md:text-sm font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] flex items-center gap-2 group/link cursor-pointer">
                        SOURCE CODE 
                        <span class="group-hover/link:translate-x-1 transition-transform">&rarr;</span>
                     </a>
                   }
                   @if (project.links.live) {
                     <a [href]="project.links.live" target="_blank" class="text-xs md:text-sm font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] flex items-center gap-2 group/link cursor-pointer">
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

  ctx: any;
  
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

    private async initScroll(trackWidth: number, windowWidth: number) {
    // Dynamic import for better TBT
    const gsapModule = await import('gsap');
    const scrollTriggerModule = await import('gsap/ScrollTrigger');
    const gsap = gsapModule.default;
    gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);

    this.ctx = gsap.context(() => {
      const xMove = -(trackWidth - windowWidth);
      const trackEl = this.track()!.nativeElement;

      gsap.to(trackEl, {
        x: xMove,
        ease: 'none',
        scrollTrigger: {
          trigger: '.projects-wrapper',
          pin: true,
          start: 'center center', // Pin when the section is centered
          scrub: 1,
          end: () => "+=" + (trackWidth - windowWidth),
          invalidateOnRefresh: true,
          preventOverlaps: true
        }
      });
    });
    scrollTriggerModule.ScrollTrigger.refresh();
  }

  ngOnDestroy() {
    this.ctx?.revert();
  }
}