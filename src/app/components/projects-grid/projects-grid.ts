import { Component, ElementRef, OnDestroy, PLATFORM_ID, inject, viewChild, viewChildren, afterNextRender, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-projects-grid',
  imports: [],
  template: `
    <section id="projects" class="projects-wrapper relative h-screen overflow-hidden flex flex-col pt-24 md:pt-32 pb-12 bg-[var(--color-background)]">
      
      <!-- Section Header (Horizontal Layout to save space) -->
      <div class="w-full px-6 md:px-28 z-20 relative flex-shrink-0 mb-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
          
          <div class="space-y-1">
             <h2 class="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1] tracking-tight text-[var(--color-text)]">
                Selected <span class="italic opacity-80">Works</span>
             </h2>
             <div class="h-1 w-20 bg-[var(--color-primary)]"></div>
          </div>
          
          <div class="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 pb-1">
             <p class="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed max-w-xs opacity-70">
                A selection of digital products focusing on SaaS architecture and scalable systems.
             </p>
             
             <div class="flex items-center gap-4">
                <a href="#contact" class="group flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-text)] hover:text-[var(--color-background)] transition-all duration-500">
                   <span class="text-[10px] font-bold tracking-widest uppercase">Collaborate</span>
                </a>

                <!-- Navigation Buttons (Minimal) -->
                <div class="flex gap-2">
                   <button (click)="navScroll('prev')" class="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-text)] hover:text-[var(--color-background)] transition-all duration-500 group disabled:opacity-30" aria-label="Previous Project">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                   </button>
                   <button (click)="navScroll('next')" class="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-text)] hover:text-[var(--color-background)] transition-all duration-500 group disabled:opacity-30" aria-label="Next Project">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                   </button>
                </div>
             </div>
          </div>
          
        </div>
      </div>

      <!-- Horizontal Track Container -->
      <div class="relative flex-1 flex items-center min-h-0">
        
        <!-- Horizontal Track -->
        <div class="projects-track flex items-center pl-6 md:pl-28 pr-[80vw] gap-12 md:gap-20 will-change-transform z-10 relative" #track>
          
          <!-- Project Cards -->
          @for (project of projects; track project.title; let i = $index) {
            <article class="project-card group relative w-[80vw] md:w-[500px] lg:w-[600px] shrink-0 cursor-pointer">
               <a [href]="project.links.live || project.links.source" target="_blank" rel="noopener noreferrer" class="block">
                  <!-- Image Container -->
                  <div class="relative aspect-[16/10] overflow-hidden bg-[var(--color-card)] rounded-sm md:rounded-md mb-6 border border-[var(--color-border)] group-hover:border-[var(--color-primary)] transition-all duration-500 shadow-2xl">
                     @if (project.image) {
                        <img [src]="project.image" [alt]="project.title" 
                             class="w-full h-full object-cover transition-transform duration-1000 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110" 
                             loading="lazy" decoding="async" />
                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                     } @else {
                        <div class="absolute inset-0 bg-gradient-to-br from-[var(--color-card)] to-[var(--color-background)] flex items-center justify-center">
                           <span class="text-5xl font-black text-[var(--color-text)] opacity-10 select-none">{{project.year}}</span>
                        </div>
                     }
                     
                     <!-- Type Badge -->
                     <div class="absolute top-4 left-4 z-20">
                        <span class="text-[8px] px-2 py-0.5 bg-black/80 text-white backdrop-blur-md rounded-full uppercase tracking-widest font-bold border border-white/10">
                           {{project.type}}
                        </span>
                     </div>
                  </div>

                  <!-- Project Info -->
                  <div class="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 group-hover:border-[var(--color-text)] transition-colors duration-500">
                     <div class="flex-1">
                        <div class="text-[9px] font-mono text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1 opacity-60">
                           {{project.year}} &mdash; {{project.stack.slice(0, 3).join(' / ')}}
                        </div>
                        <h3 class="text-lg md:text-2xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none transition-transform duration-500 group-hover:translate-x-1">
                           {{project.title}}
                        </h3>
                     </div>
                     
                     <div class="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" 
                             class="transition-all duration-500 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--color-primary)]">
                           <path d="M7 7h10v10M7 17 17 7"/>
                        </svg>
                     </div>
                  </div>
               </a>
            </article>
          }
        </div>

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
      description: 'A multi-tenant UI feedback SaaS. Users click any element on any web app and submit contextual feedback — no changes needed to the target app\'s code. Designed with PostgreSQL Row-Level Security (RLS) enforcing strict data isolation at the database layer per tenant. Frontend is live; backend integration with Supabase Edge Functions is in active development.',
      stack: ['React', 'Supabase', 'PostgreSQL', 'RLS', 'TypeScript'],
      links: {
        source: 'https://github.com/tagtics/tagtics-frontend',
        live: 'https://www.tagtics.online'
      },
      demoLabel: 'LIVE'
    },
    {
      title: 'Green Power India',
      type: 'Client Contract',
      year: '2026',
      image: 'assets/projects/green-power-india.png',
      description: 'Delivered end-to-end for a sustainable energy company — full stack corporate platform built with Next.js 15 App Router, deployed on Vercel. Designed and implemented a Supabase and PostgreSQL backend with structured bucket storage for dynamic media assets. Owned both the frontend (bento-style UI with Tailwind CSS and Framer Motion) and the backend schema and API layer.',
      stack: ['Next.js 15', 'React 19', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion'],
      links: {
        live: 'https://greenpowerindia.com/'
      },
      demoLabel: 'LIVE'
    },
    {
      title: 'Ever-Gauzy',
      type: 'Open Source',
      year: '2025',
      image: 'assets/projects/ever-gauzy.png',
      description: 'Contributed to a 100,000+ line enterprise ERP built on NestJS and Angular. Navigated a large Nx monorepo to improve the authentication UI — gaining direct exposure to production-grade enterprise patterns including CQRS, Event Sourcing, and Hexagonal Architecture in a live system used by real organisations.',
      stack: ['NestJS', 'Angular', 'TypeScript', 'Nx', 'CQRS'],
      links: {
        source: 'https://github.com/ever-co/ever-gauzy',
        live: 'https://app.gauzy.co/#/auth/login'
      },
      demoLabel: 'LIVE'
    },
    {
      title: 'Fashion Studio',
      type: 'E-Commerce',
      year: '2024',
      image: 'assets/projects/fashion-studio.png',
      description: 'Production e-commerce backend deployed on a self-managed AWS EC2 instance with Nginx configured as a reverse proxy. Integrated Razorpay payment gateway with webhook signature verification for tamper-proof transaction handling. Covers product catalogue management, user auth, and order processing.',
      stack: ['Node.js', 'Express', 'MongoDB', 'AWS EC2', 'Nginx'],
      links: {
        source: 'https://github.com/rishi-rj-s/RSBackend'
      }
    }
  ];

  ctx: any;
  private resizeHandler: (() => void) | null = null;
  private ScrollTrigger: any;
  private st: any;

  private platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(() => {
      const trackEl = this.track()?.nativeElement;
      if (!trackEl) return;

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentBoxSize) {
            const trackWidth = trackEl.scrollWidth;
            const windowWidth = window.innerWidth;

            if (trackWidth > windowWidth) {
              this.initScroll();
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
    const scrollToModule = await import('gsap/ScrollToPlugin');
    const gsap = gsapModule.default;
    this.ScrollTrigger = scrollTriggerModule.ScrollTrigger;
    gsap.registerPlugin(this.ScrollTrigger, scrollToModule.ScrollToPlugin);

    const trackEl = this.track()?.nativeElement;
    if (!trackEl) return;

    this.ctx = gsap.context(() => {
      const cards = Array.from(trackEl.querySelectorAll('.project-card')) as HTMLElement[];
      const lastCard = cards[cards.length - 1];

      const lastCardCenter = lastCard.offsetLeft + lastCard.offsetWidth;
      const windowWidth = window.innerWidth;
      const targetX = -(lastCardCenter - windowWidth + (windowWidth * 0.1)); // Leave some margin at the end

      this.st = this.ScrollTrigger.create({
        trigger: '.projects-wrapper',
        pin: true,
        start: 'top top',
        scrub: 1,
        end: () => '+=' + Math.abs(targetX),
        invalidateOnRefresh: true,
        animation: gsap.to(trackEl, {
          x: targetX,
          ease: 'none'
        })
      });
    });

    this.resizeHandler = () => {
      this.ScrollTrigger.refresh();
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  async navScroll(direction: 'prev' | 'next') {
    if (!this.st) return;
    
    const gsapModule = await import('gsap');
    const gsap = gsapModule.default;
    
    const currentProgress = this.st.progress;
    const step = 1 / (this.projects.length - 1);
    
    let targetProgress = direction === 'next' 
      ? Math.min(1, currentProgress + step) 
      : Math.max(0, currentProgress - step);
      
    // Snap to nearest step
    targetProgress = Math.round(targetProgress / step) * step;

    const scrollRange = this.st.end - this.st.start;
    const targetScroll = this.st.start + (targetProgress * scrollRange);

    gsap.to(window, {
      scrollTo: targetScroll,
      duration: 0.8,
      ease: 'power3.inOut'
    });
  }

  ngOnDestroy() {
    this.ctx?.revert();
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }
}
