import { Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HeroBootVisual } from '../hero-boot-visual/hero-boot-visual';
import { profile } from '../../data/profile';
import { ScrollService } from '../../services/scroll';

@Component({
  selector: 'app-hero',
  imports: [HeroBootVisual],
  template: `
    <section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
        <app-hero-boot-visual />
      </div>

      <div class="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col items-center justify-center">
        <div class="name-stage select-none">
          <!-- Full eyebrow: large screens only -->
          <h2 class="name-eyebrow hidden lg:block">
            {{ profile.eyebrow }}
          </h2>

          <h1 class="name-3d">
            <span class="word word-1">
              @for (layer of depthLayers; track layer) {
                <span class="extrude" [attr.data-z]="layer" aria-hidden="true">RISHIRAJ</span>
              }
              <span class="face">RISHIRAJ</span>
            </span>
            <span class="word word-2">
              @for (layer of depthLayers; track layer) {
                <span class="extrude" [attr.data-z]="layer" aria-hidden="true">SAJEEV</span>
              }
              <span class="face">SAJEEV</span>
            </span>
          </h1>
        </div>

        <div class="mt-8 md:mt-10 lg:mt-14 max-w-2xl mx-auto text-center px-2">
          <!-- Compact keywords: &lt; lg -->
          <p class="lg:hidden text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[var(--color-text-secondary)]">
            Angular · NestJS · SaaS
          </p>

          <!-- Full copy: lg+ only -->
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
      width: min(96vw, 920px);
      perspective: 900px;
      perspective-origin: 30% 50%;
    }

    .name-eyebrow {
      margin: 0 0 1rem;
      text-align: center;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
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
      transform: rotateY(-32deg) rotateX(14deg) rotateZ(-2deg) translate3d(-4%, 2%, 40px);
      transform-style: preserve-3d;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-weight: 900;
      /* Bigger on small/medium so the name owns the viewport */
      font-size: clamp(3.25rem, 16vw, 5.5rem);
      line-height: 0.88;
      letter-spacing: -0.06em;
      text-transform: uppercase;
    }

    @media (min-width: 1024px) {
      .name-3d {
        font-size: clamp(2.75rem, 11vw, 7rem);
      }
    }

    .word {
      position: relative;
      display: block;
      transform-style: preserve-3d;
    }

    .word-2 {
      transform: translate3d(8%, 0, 28px);
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
      -webkit-text-stroke: 4px var(--color-text);
      paint-order: stroke fill;
      filter: drop-shadow(5px 6px 0 var(--color-primary));
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
    .extrude[data-z='2']  { transform: translateZ(-4px);  opacity: 0.9; }
    .extrude[data-z='3']  { transform: translateZ(-6px);  opacity: 0.85; }
    .extrude[data-z='4']  { transform: translateZ(-8px);  opacity: 0.8; }
    .extrude[data-z='5']  { transform: translateZ(-10px); opacity: 0.75; }
    .extrude[data-z='6']  { transform: translateZ(-12px); opacity: 0.7; }
    .extrude[data-z='7']  { transform: translateZ(-14px); opacity: 0.65; }
    .extrude[data-z='8']  { transform: translateZ(-16px); opacity: 0.6; }
    .extrude[data-z='9']  { transform: translateZ(-18px); opacity: 0.55; }
    .extrude[data-z='10'] { transform: translateZ(-20px); opacity: 0.5; }
    .extrude[data-z='11'] { transform: translateZ(-22px); opacity: 0.45; }
    .extrude[data-z='12'] { transform: translateZ(-24px); opacity: 0.4; }
    .extrude[data-z='13'] { transform: translateZ(-26px); opacity: 0.35; }
    .extrude[data-z='14'] { transform: translateZ(-28px); opacity: 0.3; }
    .extrude[data-z='15'] { transform: translateZ(-30px); opacity: 0.28; }
    .extrude[data-z='16'] { transform: translateZ(-32px); opacity: 0.25; }
    .extrude[data-z='17'] { transform: translateZ(-34px); opacity: 0.22; }
    .extrude[data-z='18'] { transform: translateZ(-36px); opacity: 0.2; }
    .extrude[data-z='19'] { transform: translateZ(-38px); opacity: 0.18; }
    .extrude[data-z='20'] { transform: translateZ(-40px); opacity: 0.16; }

    @media (max-width: 640px) {
      .name-3d {
        font-size: clamp(3.1rem, 15.5vw, 4.25rem);
        transform: rotateY(-26deg) rotateX(12deg) rotateZ(-1deg) translate3d(-2%, 0, 24px);
      }

      .face {
        -webkit-text-stroke: 2.5px var(--color-text);
        filter: drop-shadow(4px 5px 0 var(--color-primary));
      }
    }
  `]
})
export class Hero {
  readonly profile = profile;
  private scrollService = inject(ScrollService);
  private platformId = inject(PLATFORM_ID);

  /** Stacked Z layers give the letters physical depth (length on the Z axis). */
  readonly depthLayers = Array.from({ length: 20 }, (_, i) => i + 1);

  scrollTo(e: Event, id: string) {
    e.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      this.scrollService.scrollTo(id);
    }
  }
}
