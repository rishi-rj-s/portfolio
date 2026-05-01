import { Component, ElementRef, OnDestroy, PLATFORM_ID, inject, viewChild, viewChildren, afterNextRender, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-projects-grid',
  imports: [],
  template: `
    <section id="projects" class="projects-wrapper relative h-[100dvh] overflow-hidden flex flex-col justify-start pt-24 md:pt-32 pb-4">
      
      <!-- Section Header (Static Layout) -->
      <div class="w-full px-6 py-2 md:px-28 md:py-4 flex-shrink-0 z-20 relative pointer-events-none select-none text-center md:text-left">
        <h2 class="text-3xl md:text-6xl lg:text-8xl font-black tracking-tighter text-[var(--color-text)] relative">SELECTED WORKS</h2>
        <p class="text-[var(--color-text-muted)] mt-1 md:mt-2 font-mono text-[10px] md:text-xs uppercase tracking-widest relative"> &lt; Horizontal Scroll /&gt;</p>
      </div>

      <!-- Horizontal Track -->
      <div class="projects-track flex flex-1 min-h-0 w-full items-center pl-6 md:pl-28 pr-[80vw] gap-6 md:gap-16 lg:gap-24 will-change-transform z-10 relative my-2 md:my-4" #track>
        
        <!-- Project Cards -->
        @for (project of projects; track project.title; let i = $index) {
          <article class="project-card relative w-[85vw] md:w-[700px] lg:w-[800px] h-full max-h-[500px] md:max-h-[700px] flex-shrink-0 bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl overflow-hidden group hover:border-[var(--color-primary)] transition-colors duration-500 flex flex-col md:flex-row shadow-2xl">
             
             <!-- Image / Visual Area (Left or Top) -->
             <div class="w-full h-36 md:h-auto md:w-1/2 bg-[var(--color-card)]/30 backdrop-blur-sm border-b md:border-b-0 md:border-r border-[var(--color-border)] relative overflow-hidden group flex-shrink-0">
                
                @if (project.image) {
                   <img [src]="project.image" [alt]="project.title" 
                        class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
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
             <div class="w-full md:w-1/2 p-4 md:p-8 flex flex-col h-full bg-[var(--color-card)] relative">
                
                <!-- Scroll Arrows -->
                @if (scrollStates()[i]?.showUp) {
                  <button (click)="scrollContent(i, 'up')" 
                    class="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce cursor-pointer p-1.5 bg-[var(--color-card)]/90 backdrop-blur rounded-full border border-[var(--color-border)] shadow-lg hover:text-[var(--color-primary)] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                  </button>
                }
                
                @if (scrollStates()[i]?.showDown) {
                  <button (click)="scrollContent(i, 'down')" 
                    class="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 animate-bounce cursor-pointer p-1.5 bg-[var(--color-card)]/90 backdrop-blur rounded-full border border-[var(--color-border)] shadow-lg hover:text-[var(--color-primary)] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                }

                <div class="flex-1 overflow-y-auto scrollbar-none content-body" #contentBody (scroll)="onContentScroll(i, $event)">
                  <div class="flex items-start justify-between mb-2 md:mb-4 gap-4">
                     <h3 class="text-xl md:text-3xl lg:text-4xl font-black tracking-tighter text-[var(--color-text)] mb-1">{{project.title}}</h3>
                     <span class="text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-full uppercase tracking-wider bg-[var(--color-card)] whitespace-nowrap shrink-0">{{project.type}}</span>
                  </div>
                  
                  <p class="text-[var(--color-text-secondary)] mb-3 md:mb-6 leading-relaxed text-xs md:text-sm lg:text-base line-clamp-3 md:line-clamp-none">{{project.description}}</p>
                  
                  <div class="mb-3 md:mb-6">
                     <h4 class="text-[10px] md:text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Tech Matrix</h4>
                     <div class="flex flex-wrap gap-2">
                        @for (stack of project.stack; track stack) {
                          <span class="text-[10px] md:text-xs font-mono text-[var(--color-text)] bg-[var(--color-card-hover)] px-2 py-1 rounded border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors cursor-default whitespace-nowrap">
                              {{stack}}
                          </span>
                        }
                     </div>
                  </div>
                </div>
   
                <div class="flex gap-4 md:gap-6 mt-2 pt-3 border-t border-[var(--color-border)] relative z-30 pointer-events-auto shrink-0">
                   @if (project.links.source) {
                     <a [href]="project.links.source" 
                        target="_blank" 
                        [attr.aria-label]="'View source code for ' + project.title"
                        class="text-xs md:text-sm font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] flex items-center gap-2 group/link cursor-pointer">
                        SOURCE CODE 
                        <span class="group-hover/link:translate-x-1 transition-transform" aria-hidden="true">&rarr;</span>
                     </a>
                   }
                   @if (project.links.live) {
                     <a [href]="project.links.live" 
                        target="_blank" 
                        [attr.aria-label]="(project.demoLabel || 'Live demo') + ' for ' + project.title"
                        class="text-xs md:text-sm font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] flex items-center gap-2 group/link cursor-pointer">
                        {{ project.demoLabel || 'LIVE DEMO' }}
                        <span class="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" aria-hidden="true">&#8599;</span>
                     </a>
                   }
                </div>
             </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .scrollbar-none {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-none::-webkit-scrollbar {
      display: none;
    }
  `]
})
export class ProjectsGrid implements OnDestroy {
  track = viewChild<ElementRef<HTMLElement>>('track');
  contentBodies = viewChildren<ElementRef<HTMLElement>>('contentBody');
  
  projects = [
    {
      title: 'Tagtics',
      type: 'SaaS',
      year: '2025',
      image: 'assets/projects/tagtics.png',
      description: 'A framework-agnostic UI tagging tool for real-time feedback. Features serverless architecture on Supabase Edge Functions (Deno) and strict RLS security. This tool allows developers to collect feedback directly on their components, making the iteration cycle faster and more transparent. It integrates with existing CI/CD pipelines and provides a central dashboard for project managers to track bug reports and feature requests. Built with high performance and security in mind, it utilizes the latest web standards and features.',
      stack: ['React', 'Supabase', 'PostgreSQL', 'RLS'],
      links: { source: 'https://github.com/tagtics/tagtics-frontend', live: 'https://www.tagtics.online' },
      demoLabel: 'LIVE'
    },
    {
      title: 'Ever-Gauzy',
      type: 'ERP',
      year: '2025',
      image: 'assets/projects/ever-gauzy.png',
      description: 'Contributed to a 100k+ LoC enterprise ERP. Improved Auth UI and navigated complex NestJS/Angular monorepo architecture. Work included refactoring the entire administrative dashboard for better accessibility and implementing a new real-time notification system using WebSockets. Also optimized database queries for critical reporting modules, reducing load times by over 40%. The project involved close collaboration with a global team of developers and stakeholders to ensure seamless integration of new features.',
      stack: ['NestJS', 'Angular', 'Nx', 'CQRS'],
      links: { source: 'https://github.com/ever-co/ever-gauzy', live: 'https://app.gauzy.co/#/auth/login' },
      demoLabel: 'LIVE'
    },
    {
      title: 'Eezy-Cabs',
      type: 'Microservices',
      year: '2024',
      image: 'assets/projects/eezy-cabs.png',
      description: 'Scalable ride-hailing platform with distributed systems architecture. Orchestrated via API Gateway with Redis/Kafka for real-time tracking. The system architecture was designed for high availability and low latency, handling thousands of concurrent requests during peak hours. Implemented complex routing algorithms and an automated billing system that supports multiple payment gateways. Utilized Docker and Kubernetes for container orchestration and automated scaling based on traffic patterns.',
      stack: ['NestJS', 'Kafka', 'Redis', 'MongoDB'],
      links: { source: 'https://github.com/eezy-cabs-rrjs/EC-Backend-MR', live: 'https://raw.githubusercontent.com/eezy-cabs-rrjs/EC-Backend-MR/refs/heads/main/Arch-Diagram.png' },
      demoLabel: 'ARCH. IMG'
    },
    {
      title: 'Green Power India',
      type: 'Corporate',
      year: '2026',
      image: 'assets/projects/green-power-india.png',
      description: 'A high-performance sustainable engineering corporate platform built with Next.js App Router and deployed on Vercel. Architected a Supabase and PostgreSQL backend with bucket storage for dynamic assets. Designed a fluid, bento-style UI gallery utilizing Tailwind CSS and Framer Motion for immersive visual storytelling. The platform showcases decentralized bio-waste processors and technical systems for a sustainable bio-energy legacy.',
      stack: ['Next.js 15', 'React 19', 'Supabase', 'Tailwind CSS', 'Framer Motion'],
      links: { live: 'https://greenpowerindia.com/' },
      demoLabel: 'LIVE'
    },
    {
      title: 'Fashion Studio',
      type: 'E-Commerce',
      year: '2024',
      image: 'assets/projects/fashion-studio.png',
      description: 'Production E-commerce backend deployed on AWS EC2 with Nginx. Secure payments integration via Razorpay. Features a robust product catalog management system, user authentication, and order processing workflows. The application was optimized for search engine visibility and mobile performance. Implemented advanced caching strategies to ensure fast content delivery and handled complex inventory management logic to prevent overselling of high-demand items.',
      stack: ['Node.js', 'MongoDB', 'AWS EC2', 'Nginx'],
      links: { source: 'https://github.com/rishi-rj-s/RSBackend' }
    }
  ];

  scrollStates = signal<{ showUp: boolean, showDown: boolean }[]>([]);
  ctx: any;
  private resizeHandler: (() => void) | null = null;
  private ScrollTrigger: any;
  
  private platformId = inject(PLATFORM_ID);
  
  constructor() {
    this.scrollStates.set(this.projects.map(() => ({ showUp: false, showDown: false })));

    afterNextRender(() => {
      const trackEl = this.track()?.nativeElement;
      if (!trackEl) return;

      // Wait for images/fonts to settle, then init
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentBoxSize) {
            const trackWidth = trackEl.scrollWidth;
            const windowWidth = window.innerWidth;
            
            if (trackWidth > windowWidth) {
              this.initScroll();
              this.checkAllScrolls();
              resizeObserver.disconnect();
            }
          }
        }
      });
      
      resizeObserver.observe(trackEl);
    });
  }

  private async initScroll() {
    const gsapModule = await import('gsap');
    const scrollTriggerModule = await import('gsap/ScrollTrigger');
    const gsap = gsapModule.default;
    this.ScrollTrigger = scrollTriggerModule.ScrollTrigger;
    gsap.registerPlugin(this.ScrollTrigger);

    const trackEl = this.track()?.nativeElement;
    if (!trackEl) return;

    this.ctx = gsap.context(() => {
      // Precise calculation to center the last card
      const cards = Array.from(trackEl.querySelectorAll('.project-card')) as HTMLElement[];
      const lastCard = cards[cards.length - 1];
      
      const lastCardCenter = lastCard.offsetLeft + lastCard.offsetWidth / 2;
      const windowCenter = window.innerWidth / 2;
      const targetX = -(lastCardCenter - windowCenter);

      gsap.to(trackEl, {
        x: targetX,
        ease: 'none',
        scrollTrigger: {
          trigger: '.projects-wrapper',
          pin: true,
          anticipatePin: 1,
          start: 'top top',
          scrub: 0.5,
          end: () => '+=' + Math.abs(targetX),
          invalidateOnRefresh: true,
        }
      });
    });

    this.resizeHandler = () => {
      this.ScrollTrigger.refresh();
      this.checkAllScrolls();
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  onContentScroll(index: number, event: Event) {
    const el = event.target as HTMLElement;
    this.updateScrollState(index, el);
  }

  async scrollContent(index: number, direction: 'up' | 'down') {
    const el = this.contentBodies()[index]?.nativeElement;
    if (!el) return;

    const scrollAmount = el.clientHeight * 0.8;
    const targetScroll = el.scrollTop + (direction === 'up' ? -scrollAmount : scrollAmount);

    // Import GSAP dynamically for better TBT
    const gsapModule = await import('gsap');
    const gsap = gsapModule.default;

    gsap.to(el, {
      scrollTop: targetScroll,
      duration: 0.6,
      ease: 'power3.inOut',
      overwrite: 'auto'
    });
  }

  private checkAllScrolls() {
    this.contentBodies().forEach((ref, i) => {
      this.updateScrollState(i, ref.nativeElement);
    });
  }

  private updateScrollState(index: number, el: HTMLElement) {
    const states = [...this.scrollStates()];
    states[index] = {
      showUp: el.scrollTop > 10,
      showDown: el.scrollHeight > el.clientHeight + el.scrollTop + 10
    };
    this.scrollStates.set(states);
  }

  ngOnDestroy() {
    this.ctx?.revert();
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }
}
