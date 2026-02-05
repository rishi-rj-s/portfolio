import { Component, ElementRef, afterNextRender, viewChild, OnDestroy } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-hero',
  template: `
    <section id="hero" #heroSection class="relative min-h-screen flex items-center justify-center overflow-hidden perspective-1000">
      
      <!-- Background Elements -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse-slow"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse-slow" style="animation-delay: 2s"></div>
      </div>

      <!-- Kinetic Typography Container -->
      <div class="relative z-10 text-center select-none" #heroContainer>
        <h2 class="text-xl md:text-2xl font-bold tracking-[0.2em] text-[var(--color-text-secondary)] mb-4 animate-fade-in-up">
          DIGITAL CRAFTSMAN
        </h2>
        
        <h1 class="hero-title text-6xl md:text-9xl font-black leading-none tracking-tighter mix-blend-difference text-[var(--color-text)] perspective-text" #heroTitle>
          <div class="line" #line1>RISHIRAJ</div>
          <div class="line" #line2>SAJEEV</div>
        </h1>

        <div class="mt-8 max-w-lg mx-auto animate-fade-in-up" style="animation-delay: 0.3s">
          <p class="text-lg md:text-xl text-[var(--color-text-muted)]">
            Architecting production-grade <span class="text-[var(--color-text)] font-semibold">SaaS</span> & <span class="text-[var(--color-text)] font-semibold">Microservices</span>.
          </p>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <svg class="w-6 h-6 text-[var(--color-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    .perspective-1000 {
      perspective: 1000px;
    }
    
    .hero-title {
      transform-style: preserve-3d;
    }

    .line {
      display: block;
      transition: color 0.3s;
    }

    .animate-pulse-slow {
      animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.1; }
      50% { opacity: 0.3; }
    }
  `]
})
export class Hero implements OnDestroy {
  // v20 signal-based queries
  section = viewChild<ElementRef<HTMLElement>>('heroSection');
  container = viewChild<ElementRef<HTMLElement>>('heroContainer');
  title = viewChild<ElementRef<HTMLElement>>('heroTitle');
  line1 = viewChild<ElementRef<HTMLElement>>('line1');
  line2 = viewChild<ElementRef<HTMLElement>>('line2');
  
  private isInViewport = false;
  private observer: IntersectionObserver | null = null;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

  constructor() {
    // Use afterNextRender for browser-only initialization
    afterNextRender(() => {
      const titleEl = this.title()?.nativeElement;
      const sectionEl = this.section()?.nativeElement;
      
      if (!titleEl || !sectionEl) return;
      
      // Initial Text Reveal
      gsap.from(titleEl.children, {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.2
      });
      
      // Set up Intersection Observer - only track mouse when hero is visible
      this.observer = new IntersectionObserver(
        (entries) => {
          this.isInViewport = entries[0].isIntersecting;
        },
        { threshold: 0.1 }
      );
      this.observer.observe(sectionEl);
      
      // Mouse handler with viewport check
      this.mouseMoveHandler = (e: MouseEvent) => {
        if (!this.isInViewport) return;
        
        const containerEl = this.container()?.nativeElement;
        const titleEl = this.title()?.nativeElement;
        const line1El = this.line1()?.nativeElement;
        const line2El = this.line2()?.nativeElement;
        
        if (!containerEl || !titleEl || !line1El || !line2El) return;
        
        requestAnimationFrame(() => {
          const { innerWidth, innerHeight } = window;
          const x = e.clientX;
          const y = e.clientY;

          const rotateX = ((y / innerHeight) - 0.5) * -30;
          const rotateY = ((x / innerWidth) - 0.5) * 30;

          gsap.to(titleEl, {
            rotateX,
            rotateY,
            duration: 1,
            ease: 'power3.out',
            overwrite: 'auto'
          });

          gsap.to(line1El, {
            x: (x - innerWidth / 2) * 0.05,
            y: (y - innerHeight / 2) * 0.05,
            duration: 1,
            ease: 'power3.out',
            overwrite: 'auto'
          });

          gsap.to(line2El, {
            x: (x - innerWidth / 2) * -0.05,
            y: (y - innerHeight / 2) * -0.05,
            duration: 1,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        });
      };
      
      window.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
    }
  }
}