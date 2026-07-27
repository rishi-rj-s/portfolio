import {
  Component,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { profile } from '../../data/profile';
import { ScrollService } from '../../services/scroll';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="hero" class="hero-section">
      <div class="hero-main">
        <div class="hero-identity select-none">
          <h2 class="name-eyebrow">
            <span class="lg:hidden">{{ profile.role }}</span>
            <span class="hidden lg:inline">{{ profile.eyebrow }}</span>
          </h2>

          <div class="name-stage">
            <h1 class="name-3d">
              <span class="word word-1">
                @for (layer of depthLayers(); track layer) {
                  <span class="extrude" [attr.data-z]="layer" aria-hidden="true">RISHIRAJ</span>
                }
                <span class="face">RISHIRAJ</span>
              </span>
              <span class="word word-2">
                @for (layer of depthLayers(); track layer) {
                  <span class="extrude" [attr.data-z]="layer" aria-hidden="true">SAJEEV</span>
                }
                <span class="face">SAJEEV</span>
              </span>
            </h1>
          </div>
        </div>

        <div class="hero-copy max-w-2xl mx-auto text-center px-2">
          <div class="lg:hidden space-y-2">
            <p class="text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[var(--color-text-secondary)]">
              Angular · NestJS · SaaS
            </p>
            <p class="hidden md:block text-sm text-[var(--color-text-secondary)] pt-1">
              {{ profile.currentTitle }}. {{ profile.availability }}
            </p>
          </div>

          <div class="hidden lg:block space-y-3 xl:space-y-4">
            <p class="text-base xl:text-xl text-[var(--color-text-muted)] leading-relaxed">
              {{ profile.subhead }}
            </p>
            <p class="text-sm md:text-base text-[var(--color-text-secondary)]">
              {{ profile.currentTitle }}. {{ profile.availability }}
            </p>
          </div>

          <div class="hero-ctas flex flex-wrap items-center justify-center gap-3">
            <a href="#projects" (click)="scrollTo($event, '#projects')"
               class="px-5 py-2.5 rounded-full bg-[var(--color-text)] text-[var(--color-background)] text-xs font-bold tracking-widest uppercase hover:bg-[var(--color-primary)] transition-colors">
              View work
            </a>
            <a href="#contact" (click)="scrollTo($event, '#contact')"
               class="px-5 py-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)]/40 backdrop-blur-md text-xs font-bold tracking-widest uppercase text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors">
              Get in touch
            </a>
          </div>
        </div>
      </div>

      <div class="hero-scroll-hint" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    /* Hard one-viewport lock — no page growth from this section */
    :host {
      display: block;
      box-sizing: border-box;
      height: 100svh;
      height: 100dvh;
      max-height: 100svh;
      max-height: 100dvh;
      overflow: hidden;
    }

    .hero-section {
      box-sizing: border-box;
      height: 100%;
      max-height: 100%;
      width: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding-top: clamp(5rem, 9vh, 7rem);
      padding-inline: 0.75rem;
      padding-bottom: 0.15rem;
    }

    @media (min-width: 640px) {
      .hero-section {
        padding-inline: 1.5rem;
      }
    }

    /* Fills space above the scroll hint; content stays large and centered */
    .hero-main {
      flex: 1 1 auto;
      min-height: 0;
      width: 100%;
      max-width: 80rem;
      margin-inline: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: clamp(1.25rem, 3.5vh, 2.75rem);
      overflow: hidden;
    }

    .hero-scroll-hint {
      flex: 0 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 2rem;
      color: var(--color-text);
      opacity: 0.4;
      pointer-events: none;
    }

    .hero-identity {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: min(100%, 1100px);
    }

    .hero-copy {
      margin-top: 0;
    }

    .hero-ctas {
      padding-top: clamp(0.75rem, 2vh, 1.35rem);
    }

    .name-stage {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding: 0;
      perspective: 520px;
      perspective-origin: 22% 45%;
      box-sizing: border-box;
    }

    @media (min-width: 768px) {
      .name-stage {
        perspective: 720px;
        perspective-origin: 26% 48%;
      }
    }

    @media (min-width: 1024px) {
      .name-stage {
        padding: 0 1rem;
        perspective: 900px;
        perspective-origin: 30% 50%;
      }
    }

    .name-eyebrow {
      position: relative;
      z-index: 3;
      margin: 0 0 clamp(1.75rem, 4.5vh, 2.75rem);
      padding: 0.35rem 0.85rem;
      text-align: center;
      font-size: clamp(0.8rem, 2.2vw, 1.05rem);
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--color-text);
      opacity: 0.78;
      max-width: 100%;
      white-space: normal;
    }

    @media (max-width: 767px) {
      .name-eyebrow {
        margin-bottom: 2.25rem;
      }
    }

    @media (min-width: 1024px) {
      .name-eyebrow {
        letter-spacing: 0.18em;
        color: var(--color-text-secondary);
        opacity: 1;
        padding-inline: 0.5rem;
        font-size: clamp(0.75rem, 1.35vw, 1rem);
      }
    }

    .name-3d {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.02em;
      margin: 0;
      width: 100%;
      transform: rotateY(-32deg) rotateX(16deg) rotateZ(-2deg) translate3d(-2%, 2%, 48px);
      transform-style: preserve-3d;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-weight: 900;
      /* Restored large type — width-driven, not over-capped by dvh */
      font-size: clamp(3.6rem, 15.5vw, 7.25rem);
      line-height: 0.88;
      letter-spacing: -0.06em;
      text-transform: uppercase;
    }

    @media (min-width: 768px) {
      .name-3d {
        font-size: clamp(5rem, 13.5vw, 9rem);
        transform: rotateY(-26deg) rotateX(12deg) rotateZ(-1.5deg) translate3d(-2%, 1.5%, 36px);
      }
    }

    @media (min-width: 1024px) {
      .name-3d {
        font-size: clamp(6.5rem, 12vw, 11.5rem);
        transform: rotateY(-22deg) rotateX(10deg) rotateZ(-1.5deg) translate3d(-2%, 1%, 24px);
      }
    }

    @media (min-width: 1400px) {
      .name-3d {
        font-size: clamp(8rem, 11vw, 13rem);
      }
    }

    /* Short viewports only — trim a little without nuking desktop scale */
    @media (max-height: 740px) {
      .name-3d {
        font-size: clamp(3rem, 12vw, 5.5rem);
      }

      .hero-main {
        gap: 1rem;
      }

      .name-eyebrow {
        margin-bottom: 1.75rem;
      }
    }

    @media (min-width: 768px) and (max-height: 740px) {
      .name-3d {
        font-size: clamp(3.75rem, 10vw, 6.5rem);
      }
    }

    @media (min-width: 1024px) and (max-height: 800px) {
      .name-3d {
        font-size: clamp(4.5rem, 9.5vw, 8rem);
      }
    }

    .word {
      position: relative;
      display: block;
      transform-style: preserve-3d;
      max-width: 100%;
    }

    .word-2 {
      transform: translate3d(5%, 2%, 18px);
    }

    @media (min-width: 768px) {
      .word-2 {
        transform: translate3d(5%, 1%, 16px);
      }
    }

    @media (min-width: 1024px) {
      .word-2 {
        transform: translate3d(6%, 0, 20px);
      }
    }

    .face,
    .extrude {
      display: block;
      white-space: nowrap;
    }

    .face {
      position: relative;
      z-index: 20;
      color: var(--color-background);
      -webkit-text-stroke: 3px var(--color-text);
      paint-order: stroke fill;
      filter: drop-shadow(4px 5px 0 var(--color-primary));
      transform: translateZ(8px);
    }

    .extrude {
      position: absolute;
      left: 0;
      top: 0;
      color: color-mix(in oklab, var(--color-text) 72%, var(--color-primary));
      user-select: none;
      pointer-events: none;
    }

    .extrude[data-z='1']  { transform: translateZ(-2px);  opacity: 0.95; }
    .extrude[data-z='2']  { transform: translateZ(-4px);  opacity: 0.88; }
    .extrude[data-z='3']  { transform: translateZ(-6px);  opacity: 0.8; }
    .extrude[data-z='4']  { transform: translateZ(-8px);  opacity: 0.72; }
    .extrude[data-z='5']  { transform: translateZ(-10px); opacity: 0.64; }
    .extrude[data-z='6']  { transform: translateZ(-12px); opacity: 0.56; }
    .extrude[data-z='7']  { transform: translateZ(-14px); opacity: 0.48; }
    .extrude[data-z='8']  { transform: translateZ(-16px); opacity: 0.4; }
    .extrude[data-z='9']  { transform: translateZ(-18px); opacity: 0.32; }
    .extrude[data-z='10'] { transform: translateZ(-20px); opacity: 0.24; }
    .extrude[data-z='11'] { transform: translateZ(-22px); opacity: 0.18; }
    .extrude[data-z='12'] { transform: translateZ(-24px); opacity: 0.12; }

    @media (max-width: 767px) {
      .face {
        -webkit-text-stroke: 2.5px var(--color-text);
        filter: drop-shadow(5px 7px 0 color-mix(in oklab, var(--color-primary) 70%, transparent));
        transform: translateZ(14px);
      }

      .extrude[data-z='1']  { transform: translateZ(-5px);  opacity: 0.98; }
      .extrude[data-z='2']  { transform: translateZ(-10px); opacity: 0.9; }
      .extrude[data-z='3']  { transform: translateZ(-15px); opacity: 0.78; }
      .extrude[data-z='4']  { transform: translateZ(-20px); opacity: 0.64; }
      .extrude[data-z='5']  { transform: translateZ(-26px); opacity: 0.48; }
      .extrude[data-z='6']  { transform: translateZ(-32px); opacity: 0.34; }
      .extrude[data-z='7']  { transform: translateZ(-38px); opacity: 0.22; }
      .extrude[data-z='8']  { transform: translateZ(-44px); opacity: 0.12; }
    }
  `]
})
export class Hero implements OnDestroy {
  readonly profile = profile;
  private scrollService = inject(ScrollService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  /** Depth layers — lightweight 3D extrusion to protect GPU fill-rate */
  readonly depthLayers = signal<number[]>([1, 2]);

  private readonly onWindowResize = () => this.updateDepthLayers();

  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser) return;
      this.updateDepthLayers();
      window.addEventListener('resize', this.onWindowResize, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener('resize', this.onWindowResize);
    }
  }

  private updateDepthLayers(): void {
    if (window.innerWidth >= 1024) {
      this.depthLayers.set([1, 2, 3, 4]);
    } else if (window.innerWidth >= 768) {
      this.depthLayers.set([1, 2, 3]);
    } else {
      this.depthLayers.set([1, 2]);
    }
  }

  scrollTo(e: Event, id: string) {
    e.preventDefault();
    if (this.isBrowser) {
      this.scrollService.scrollTo(id);
    }
  }
}
