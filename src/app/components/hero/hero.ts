import {
  Component,
  ElementRef,
  afterNextRender,
  viewChild,
  OnDestroy,
  NgZone,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollService } from '../../services/scroll';

@Component({
  selector: 'app-hero',
  template: `
    <section
      id="hero"
      #heroSection
      class="relative min-h-[100dvh] flex flex-col pt-[var(--navbar-height)] overflow-hidden"
    >
      <div class="flex-1 page-gutter grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-end lg:items-center py-10 lg:py-16">
        <!-- Left: monumental name -->
        <div class="lg:col-span-7 relative" #heroContainer>
          <p class="section-label mb-6 hero-kicker">Full Stack Engineer</p>

          <h1
            class="hero-title font-black tracking-[-0.06em] leading-[0.82] text-[var(--color-text)] select-none"
            #heroTitle
          >
            <span class="block text-[clamp(3.5rem,14vw,9.5rem)]" #line1>Rishi</span>
            <span class="block text-[clamp(3.5rem,14vw,9.5rem)] text-[var(--color-primary)]" #line2>raj</span>
            <span class="block text-[clamp(3.5rem,14vw,9.5rem)]" #line3>Sajeev</span>
          </h1>

          <div
            class="absolute -z-10 top-1/2 right-0 -translate-y-1/2 font-black text-[clamp(8rem,28vw,22rem)] leading-none text-[var(--color-text)] opacity-[0.04] select-none pointer-events-none hidden md:block"
            aria-hidden="true"
          >
            RS
          </div>
        </div>

        <!-- Right: statement + CTAs -->
        <div class="lg:col-span-5 lg:pl-8 lg:border-l lg:border-[var(--color-border)] flex flex-col gap-8 hero-aside">
          <div class="inline-flex items-center gap-2 self-start px-3 py-1.5 border border-[var(--color-primary)] bg-[var(--color-primary)]/10">
            <span class="relative flex h-2 w-2" aria-hidden="true">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
            </span>
            <span class="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-text)] font-semibold">
              Building at Axolon
            </span>
          </div>

          <p class="text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed max-w-md">
            I design and ship production-grade
            <span class="text-[var(--color-text)] font-semibold">SaaS</span>
            and
            <span class="text-[var(--color-text)] font-semibold">microservices</span>
            — systems that stay fast, secure, and maintainable under real load.
          </p>

          <div class="flex flex-wrap gap-3">
            <a href="#projects" (click)="scrollTo($event, '#projects')" class="signal-btn">
              See selected work
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
            <a href="#contact" (click)="scrollTo($event, '#contact')" class="signal-btn signal-btn-ghost">
              Start a project
            </a>
          </div>

          <dl class="grid grid-cols-3 gap-4 pt-2 border-t border-[var(--color-border)]">
            <div>
              <dt class="font-mono text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-1">Focus</dt>
              <dd class="text-sm font-bold text-[var(--color-text)]">SaaS / APIs</dd>
            </div>
            <div>
              <dt class="font-mono text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-1">Stack</dt>
              <dd class="text-sm font-bold text-[var(--color-text)]">Angular · Nest</dd>
            </div>
            <div>
              <dt class="font-mono text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-1">Based</dt>
              <dd class="text-sm font-bold text-[var(--color-text)]">Remote</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Tech marquee -->
      <div class="marquee" aria-hidden="true">
        <div class="marquee-track">
          @for (pass of [0, 1]; track pass) {
            <span>Angular</span><span><em>/</em></span>
            <span>NestJS</span><span><em>/</em></span>
            <span>React</span><span><em>/</em></span>
            <span>Next.js</span><span><em>/</em></span>
            <span>PostgreSQL</span><span><em>/</em></span>
            <span>Redis</span><span><em>/</em></span>
            <span>AWS</span><span><em>/</em></span>
            <span>Docker</span><span><em>/</em></span>
            <span>TypeScript</span><span><em>/</em></span>
            <span>Supabase</span><span><em>/</em></span>
            <span>Microservices</span><span><em>/</em></span>
          }
        </div>
      </div>
    </section>
  `,
})
export class Hero implements OnDestroy {
  section = viewChild<ElementRef<HTMLElement>>('heroSection');
  title = viewChild<ElementRef<HTMLElement>>('heroTitle');
  line1 = viewChild<ElementRef<HTMLElement>>('line1');
  line2 = viewChild<ElementRef<HTMLElement>>('line2');
  line3 = viewChild<ElementRef<HTMLElement>>('line3');

  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  private scrollService = inject(ScrollService);
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  private observer: IntersectionObserver | null = null;
  private gsapModule: any = null;
  private inView = false;
  private reduced = false;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const sectionEl = this.section()?.nativeElement;
      const titleEl = this.title()?.nativeElement;
      if (!sectionEl || !titleEl) return;

      import('gsap').then(({ default: gsap }) => {
        this.gsapModule = gsap;
        if (this.reduced) return;

        this.ngZone.runOutsideAngular(() => {
          gsap.fromTo(
            titleEl.children,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.12 }
          );
          gsap.fromTo(
            sectionEl.querySelectorAll('.hero-kicker, .hero-aside > *'),
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power2.out', delay: 0.35 }
          );
        });
      });

      this.observer = new IntersectionObserver(
        (entries) => (this.inView = entries[0].isIntersecting),
        { threshold: 0.2 }
      );
      this.observer.observe(sectionEl);

      if (this.reduced) return;

      this.mouseMoveHandler = (e: MouseEvent) => {
        if (!this.inView || !this.gsapModule) return;
        const l1 = this.line1()?.nativeElement;
        const l2 = this.line2()?.nativeElement;
        const l3 = this.line3()?.nativeElement;
        if (!l1 || !l2 || !l3) return;

        requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 18;
          const y = (e.clientY / window.innerHeight - 0.5) * 10;
          const g = this.gsapModule;
          g.to(l1, { x: x * 0.6, y: y * 0.4, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
          g.to(l2, { x: -x * 0.4, y: y * 0.6, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
          g.to(l3, { x: x * 0.3, y: -y * 0.3, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
        });
      };

      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('mousemove', this.mouseMoveHandler!, { passive: true });
      });
    });
  }

  scrollTo(e: Event, id: string) {
    e.preventDefault();
    this.scrollService.scrollTo(id);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.mouseMoveHandler) window.removeEventListener('mousemove', this.mouseMoveHandler);
  }
}
