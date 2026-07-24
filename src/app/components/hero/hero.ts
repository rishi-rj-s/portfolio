import { Component, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HeroBootVisual } from '../hero-boot-visual/hero-boot-visual';
import { profile } from '../../data/profile';
import { ScrollService } from '../../services/scroll';
import { shouldLoadHeavyGraphics } from '../../utils/connection';

@Component({
  selector: 'app-hero',
  imports: [HeroBootVisual],
  template: `
    <section id="hero" class="relative min-h-screen flex items-center justify-center overflow-x-clip overflow-y-hidden">
      <div class="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
        @if (enableBootVisual()) {
          @defer (on idle; on timer(400ms)) {
            <app-hero-boot-visual />
          }
        }
      </div>

      <div class="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 flex flex-col items-center justify-center">
        <div class="name-stage select-none">
          <h2 class="name-eyebrow hidden lg:block">
            {{ profile.eyebrow }}
          </h2>

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

        <div class="mt-8 md:mt-10 lg:mt-14 max-w-2xl mx-auto text-center px-2">
          <p class="lg:hidden text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[var(--color-text-secondary)]">
            Angular · NestJS · SaaS
          </p>

          <div class="hidden lg:block space-y-4">
            <p class="text-lg xl:text-xl text-[var(--color-text-muted)] leading-relaxed">
              {{ profile.subhead }}
            </p>
            <p class="text-sm md:text-base text-[var(--color-text-secondary)]">
              {{ profile.currentTitle }}. {{ profile.availability }}
            </p>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-3 pt-5 lg:pt-6">
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

      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-40 pointer-events-none">
        <svg class="w-6 h-6 text-[var(--color-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    .name-stage {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: min(100%, 920px);
      /* Room for stroke + drop-shadow so letters aren't clipped */
      padding: 0.75rem 0.5rem 1.25rem;
      perspective: 900px;
      perspective-origin: 30% 50%;
      box-sizing: border-box;
    }

    .name-eyebrow {
      margin: 0 0 1rem;
      padding-inline: 0.5rem;
      text-align: center;
      font-size: clamp(0.7rem, 1.4vw, 1rem);
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      max-width: 100%;
      white-space: normal;
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
      transform: none;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-weight: 900;
      /* ~8-letter word must fit viewport: keep vw modest */
      font-size: clamp(2.4rem, 11vw, 4.75rem);
      line-height: 0.9;
      letter-spacing: -0.05em;
      text-transform: uppercase;
    }

    @media (min-width: 768px) {
      .name-3d {
        font-size: clamp(3.25rem, 9vw, 5.75rem);
      }
    }

    @media (min-width: 1024px) {
      .name-stage {
        padding: 1.5rem 3rem 2rem;
      }

      .name-3d {
        font-size: clamp(3.5rem, 8.5vw, 6.75rem);
        transform: rotateY(-22deg) rotateX(10deg) rotateZ(-1.5deg) translate3d(-2%, 1%, 24px);
        transform-style: preserve-3d;
      }
    }

    .word {
      position: relative;
      display: block;
      transform-style: preserve-3d;
      max-width: 100%;
    }

    .word-2 {
      transform: none;
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
      transform: translateZ(0);
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

    @media (max-width: 640px) {
      .face {
        -webkit-text-stroke: 2.5px var(--color-text);
        filter: drop-shadow(3px 4px 0 var(--color-primary));
      }
    }
  `]
})
export class Hero {
  readonly profile = profile;
  private scrollService = inject(ScrollService);
  private platformId = inject(PLATFORM_ID);
  readonly enableBootVisual = signal(true);

  /** Depth layers — restored for desktop; lighter on small screens */
  readonly depthLayers = signal<number[]>([1, 2, 3, 4, 5, 6]);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.enableBootVisual.set(shouldLoadHeavyGraphics());

      const w = window.innerWidth;
      if (w >= 1024) {
        this.depthLayers.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      } else if (w >= 768) {
        this.depthLayers.set([1, 2, 3, 4, 5, 6, 7, 8]);
      } else {
        this.depthLayers.set([1, 2, 3, 4]);
      }
    });
  }

  scrollTo(e: Event, id: string) {
    e.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      this.scrollService.scrollTo(id);
    }
  }
}
