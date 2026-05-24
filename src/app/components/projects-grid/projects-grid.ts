import { Component, ElementRef, OnDestroy, PLATFORM_ID, inject, viewChild, viewChildren, afterNextRender, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollService } from '../../services/scroll';

@Component({
  selector: 'app-projects-grid',
  imports: [],
  template: `
    <section id="projects" class="projects-wrapper relative h-[100dvh] overflow-hidden flex flex-col pt-28 md:pt-36 pb-28 md:pb-12 bg-transparent">
      
      <!-- Content Wrapper -->
      <div class="w-full flex-1 flex flex-col justify-between min-h-0">
        
        <!-- Section Header -->
        <div class="w-full px-6 md:px-28 z-20 relative flex-shrink-0 mb-4">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-8">
            
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
                  <a href="#contact" (click)="handleCollaborateClick($event)" class="group flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-text)] hover:text-[var(--color-background)] transition-all duration-500">
                     <span class="text-[10px] font-bold tracking-widest uppercase">Collaborate</span>
                  </a>

                  <!-- Navigation Buttons -->
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
        <div class="relative flex-1 flex items-end min-h-0">
          <!-- Horizontal Track -->
          <div class="projects-track flex items-center pl-6 md:pl-28 pr-[80vw] gap-12 md:gap-20 will-change-transform z-10 relative" #track>
            <!-- Project Cards -->
            @for (project of projects; track project.title; let i = $index) {
              <article class="project-card group relative w-[80vw] md:w-[500px] lg:w-[600px] shrink-0 flex flex-col max-h-full">
                 <!-- 3D Initials Flip Card -->
                 <div (click)="onCardClick($event)"
                      (mousemove)="onCardMouseMove($event)" 
                      (mouseleave)="onCardMouseLeave($event)"
                      (touchstart)="onCardTouchStart($event)"
                      (touchmove)="onCardTouchMove($event)"
                      (touchend)="onCardTouchEnd($event)"
                      class="relative aspect-[16/9] md:aspect-[2/1] max-h-[25dvh] md:max-h-[35dvh] rounded-sm md:rounded-md mb-4 md:mb-6 border border-[var(--color-border)] group-hover:border-[var(--color-primary)] group-active:border-[var(--color-primary)] shadow-2xl flex-shrink-1 cursor-pointer"
                      style="transform: perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)); transition: transform 0.25s cubic-bezier(0.1, 1, 0.1, 1), border-color 0.5s; transform-style: preserve-3d; will-change: transform;">
                    
                    <!-- Card Inner (handles the 180deg flip) -->
                    <div class="card-inner w-full h-full relative"
                         style="transform-style: preserve-3d; transform: var(--flip-rotation, rotateY(0deg)); transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); will-change: transform;">
                       
                       <!-- Front Side: Initials & Visual Accents -->
                       <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-[var(--color-card)] to-[var(--color-background)] rounded-sm md:rounded-md flex items-center justify-center"
                            style="backface-visibility: hidden; transform-style: preserve-3d;">
                            
                            <!-- Dot pattern background -->
                            <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] bg-[radial-gradient(var(--color-text)_1px,transparent_1px)] [background-size:16px_16px]"></div>
                            
                            <!-- Mouse/Touch Spotlight Glow -->
                            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 pointer-events-none"
                                 [style.background]="'radial-gradient(220px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--color-primary) 0%, transparent 100%)'"
                                 style="mix-blend-mode: plus-lighter; opacity: var(--spotlight-opacity, 0); will-change: background, opacity;"></div>

                            <!-- Initials (3D Floating Parallax Text) -->
                            <span class="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter bg-gradient-to-br from-[var(--color-text)] to-[var(--color-primary)] bg-clip-text text-transparent opacity-25 group-hover:opacity-100 group-active:opacity-100 group-hover:drop-shadow-[0_0_20px_var(--glow-primary)] select-none font-sans relative z-10"
                                 style="transform: translate3d(var(--text-tx, 0px), var(--text-ty, 0px), 30px); transition: transform 0.25s cubic-bezier(0.1, 1, 0.1, 1), opacity 0.5s; will-change: transform;">
                              {{ getInitials(project.title) }}
                            </span>

                            <!-- Tech corner accents -->
                            <div class="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-[var(--color-border)] group-hover:border-[var(--color-primary)] group-active:border-[var(--color-primary)] transition-colors duration-500 opacity-60"></div>
                            <div class="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-[var(--color-border)] group-hover:border-[var(--color-primary)] group-active:border-[var(--color-primary)] transition-colors duration-500 opacity-60"></div>
                            <div class="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-[var(--color-border)] group-hover:border-[var(--color-primary)] group-active:border-[var(--color-primary)] transition-colors duration-500 opacity-60"></div>
                            <div class="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-[var(--color-border)] group-hover:border-[var(--color-primary)] group-active:border-[var(--color-primary)] transition-colors duration-500 opacity-60"></div>

                            <!-- Index / Numbering Badge -->
                            <div class="absolute top-4 right-4 z-20 font-mono text-[10px] tracking-widest text-[var(--color-text)] opacity-40 select-none">
                               /0{{ i + 1 }}
                            </div>

                            <!-- Type Badge -->
                            <div class="absolute top-4 left-4 z-20">
                               <span class="text-[8px] px-2 py-0.5 bg-black/80 text-white backdrop-blur-md rounded-full uppercase tracking-widest font-bold border border-white/10">
                                  {{project.type}}
                               </span>
                            </div>

                            <!-- Details Toggle Badge -->
                            <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-60 transition-all duration-500 text-[8px] tracking-widest uppercase font-mono flex items-center gap-1 text-[var(--color-text)] select-none">
                               <span>Details</span>
                               <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9-9a9 9 0 0 0-9 9"/>
                               </svg>
                            </div>
                       </div>

                       <!-- Back Side: Description & Details -->
                       <div class="absolute inset-0 w-full h-full bg-[var(--color-card)] rounded-sm md:rounded-md p-4 md:p-6 flex flex-col justify-between"
                            style="backface-visibility: hidden; transform: rotateY(180deg); transform-style: preserve-3d;">
                            
                            <div class="flex-1 flex flex-col justify-center gap-2">
                               <p class="text-xs md:text-sm text-[var(--color-text)] opacity-90 leading-relaxed max-h-[14dvh] overflow-y-auto pr-1 scrollbar-none font-sans">
                                  {{project.description}}
                               </p>
                            </div>

                            <!-- Click to return instruction -->
                            <div class="flex items-center justify-between text-[8px] font-mono tracking-widest uppercase text-[var(--color-text-secondary)] opacity-60 border-t border-[var(--color-border)] pt-2 mt-2 select-none">
                               <span>Back to initials</span>
                               <span>Close &times;</span>
                            </div>
                       </div>
                       
                    </div>
                 </div>

                 <!-- Project Info Footer with Action Buttons -->
                 <div class="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 group-hover:border-[var(--color-primary)] transition-colors duration-500">
                    <div class="flex-1">
                       <div class="text-[9px] font-mono text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1 opacity-60">
                          {{project.year}} &mdash; {{project.stack.slice(0, 3).join(' / ')}}
                       </div>
                       <h3 class="text-lg md:text-2xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none transition-transform duration-500 group-hover:translate-x-1">
                          {{project.title}}
                       </h3>
                    </div>
                    
                    <div class="flex items-center gap-2 shrink-0 z-20">
                       @if (project.links.source) {
                          <a [href]="project.links.source" target="_blank" rel="noopener noreferrer" 
                             (click)="$event.stopPropagation()"
                             class="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-text)] hover:text-[var(--color-background)] hover:border-[var(--color-text)] transition-all duration-500 group/btn" 
                             aria-label="View Source Code">
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover/btn:scale-110 transition-transform">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                                <path d="M9 18c-4.51 2-5-2-7-2"/>
                             </svg>
                          </a>
                       }
                       @if (project.links.live) {
                          <a [href]="project.links.live" target="_blank" rel="noopener noreferrer" 
                             (click)="$event.stopPropagation()"
                             class="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-background)] flex items-center justify-center hover:bg-transparent hover:text-[var(--color-text)] hover:border-[var(--color-primary)] transition-all duration-500 group/btn" 
                             aria-label="View Live Project">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                  class="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform">
                                <path d="M7 7h10v10M7 17 17 7"/>
                             </svg>
                          </a>
                       }
                    </div>
                 </div>
              </article>
            }
          </div>
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
  private scrollService = inject(ScrollService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  projects = [
    {
      title: 'Tagtics',
      type: 'SaaS',
      year: '2025',
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
      description: 'Production e-commerce backend deployed on a self-managed AWS EC2 instance with Nginx configured as a reverse proxy. Integrated Razorpay payment gateway with webhook signature verification for tamper-proof transaction handling. Covers product catalogue management, user auth, and order processing.',
      stack: ['Node.js', 'Express', 'MongoDB', 'AWS EC2', 'Nginx'],
      links: {
        source: 'https://github.com/rishi-rj-s/RSBackend'
      }
    }
  ];

  getInitials(title: string): string {
    if (!title) return '';
    return title
      .split(/[\s-]+/)
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);
  }

  onCardMouseMove(e: MouseEvent) {
    const card = e.currentTarget as HTMLElement;
    const inner = card.querySelector('.card-inner') as HTMLElement;
    const isFlipped = inner && inner.style.getPropertyValue('--flip-rotation') === 'rotateY(180deg)';

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Directly set mouse coordinates for spotlight
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    if (isFlipped) {
      card.style.setProperty('--rotate-x', '0deg');
      card.style.setProperty('--rotate-y', '0deg');
      card.style.setProperty('--text-tx', '0px');
      card.style.setProperty('--text-ty', '0px');
      return;
    }

    // Normalize coordinates to [-1, 1] relative to center
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (x - xc) / xc; // range: [-1, 1]
    const dy = (y - yc) / yc; // range: [-1, 1]

    // Calculate rotation angles (max 10 degrees)
    const rotateX = -dy * 10;
    const rotateY = dx * 10;

    // Calculate parallax offsets (max 15px)
    const textTx = dx * 15;
    const textTy = dy * 15;

    // Directly set custom properties for peak performance
    card.style.setProperty('--rotate-x', `${rotateX}deg`);
    card.style.setProperty('--rotate-y', `${rotateY}deg`);
    card.style.setProperty('--text-tx', `${textTx}px`);
    card.style.setProperty('--text-ty', `${textTy}px`);
  }

  onCardMouseLeave(e: MouseEvent) {
    const card = e.currentTarget as HTMLElement;
    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
    card.style.setProperty('--text-tx', '0px');
    card.style.setProperty('--text-ty', '0px');
    card.style.setProperty('--spotlight-opacity', '0');

    // Automatically flip back to front when mouse leaves
    const inner = card.querySelector('.card-inner') as HTMLElement;
    if (inner) {
      inner.style.setProperty('--flip-rotation', 'rotateY(0deg)');
    }
  }

  onCardTouchStart(e: TouchEvent) {
    const card = e.currentTarget as HTMLElement;
    const inner = card.querySelector('.card-inner') as HTMLElement;
    const isFlipped = inner && inner.style.getPropertyValue('--flip-rotation') === 'rotateY(180deg)';
    if (isFlipped) return;

    const touch = e.touches[0];
    const rect = card.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (x - xc) / xc;
    const dy = (y - yc) / yc;

    const rotateX = -dy * 10;
    const rotateY = dx * 10;
    const textTx = dx * 15;
    const textTy = dy * 15;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    card.style.setProperty('--spotlight-opacity', '0.15');
    card.style.setProperty('--rotate-x', `${rotateX}deg`);
    card.style.setProperty('--rotate-y', `${rotateY}deg`);
    card.style.setProperty('--text-tx', `${textTx}px`);
    card.style.setProperty('--text-ty', `${textTy}px`);
  }

  onCardTouchMove(e: TouchEvent) {
    const card = e.currentTarget as HTMLElement;
    const inner = card.querySelector('.card-inner') as HTMLElement;
    const isFlipped = inner && inner.style.getPropertyValue('--flip-rotation') === 'rotateY(180deg)';
    if (isFlipped) return;

    const touch = e.touches[0];
    const rect = card.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Check if touch moved outside card bounds
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      this.resetCardProperties(card);
      return;
    }

    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (x - xc) / xc;
    const dy = (y - yc) / yc;

    const rotateX = -dy * 10;
    const rotateY = dx * 10;
    const textTx = dx * 15;
    const textTy = dy * 15;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    card.style.setProperty('--spotlight-opacity', '0.15');
    card.style.setProperty('--rotate-x', `${rotateX}deg`);
    card.style.setProperty('--rotate-y', `${rotateY}deg`);
    card.style.setProperty('--text-tx', `${textTx}px`);
    card.style.setProperty('--text-ty', `${textTy}px`);
  }

  onCardTouchEnd(e: TouchEvent) {
    const card = e.currentTarget as HTMLElement;
    this.resetCardProperties(card);
  }

  private resetCardProperties(card: HTMLElement) {
    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
    card.style.setProperty('--text-tx', '0px');
    card.style.setProperty('--text-ty', '0px');
    card.style.setProperty('--spotlight-opacity', '0');
  }

  onCardClick(e: MouseEvent) {
    const card = e.currentTarget as HTMLElement;
    const inner = card.querySelector('.card-inner') as HTMLElement;
    if (!inner) return;

    const isFlipped = inner.style.getPropertyValue('--flip-rotation') === 'rotateY(180deg)';
    if (isFlipped) {
      inner.style.setProperty('--flip-rotation', 'rotateY(0deg)');
    } else {
      inner.style.setProperty('--flip-rotation', 'rotateY(180deg)');
      this.resetCardProperties(card);
    }
  }

  ctx: any;
  private resizeHandler: (() => void) | null = null;
  private ScrollTrigger: any;
  private st: any;

  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser) return;
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

    // If we are at the end and click next, scroll down to the next section (contact)
    if (direction === 'next' && currentProgress >= 0.98) {
      this.scrollService.scrollTo('#contact');
      return;
    }

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

  handleCollaborateClick(e: Event) {
    e.preventDefault();
    this.scrollService.scrollTo('#contact');
  }

  ngOnDestroy() {
    this.ctx?.revert();
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }
}
