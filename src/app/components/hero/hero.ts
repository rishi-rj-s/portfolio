import { Component } from '@angular/core';
import { HeroBootVisual } from '../hero-boot-visual/hero-boot-visual';

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
          <h2 class="name-eyebrow">
            FULL-STACK SOFTWARE ENGINEER
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

        <div class="mt-10 md:mt-14 max-w-2xl mx-auto space-y-3 text-center px-2">
          <p class="text-lg md:text-xl text-[var(--color-text-muted)]">
            Angular, NestJS, React &amp; Next.js — production SaaS and cloud systems.
          </p>
          <p class="text-sm md:text-base text-[var(--color-text-secondary)]">
            Angular Developer at Axolon. Always open to interesting offers and news.
          </p>
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
      margin: 0 0 0.75rem;
      text-align: center;
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    @media (min-width: 768px) {
      .name-eyebrow {
        margin-bottom: 1rem;
        font-size: 1rem;
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
      transform: rotateY(-32deg) rotateX(14deg) rotateZ(-2deg) translate3d(-4%, 2%, 40px);
      transform-style: preserve-3d;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-weight: 900;
      font-size: clamp(2.75rem, 11vw, 7rem);
      line-height: 0.88;
      letter-spacing: -0.06em;
      text-transform: uppercase;
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
        font-size: clamp(2.1rem, 12vw, 3.2rem);
        transform: rotateY(-26deg) rotateX(12deg) rotateZ(-1deg) translate3d(-2%, 0, 24px);
      }

      .face {
        -webkit-text-stroke: 2.5px var(--color-text);
      }
    }
  `]
})
export class Hero {
  /** Stacked Z layers give the letters physical depth (length on the Z axis). */
  readonly depthLayers = Array.from({ length: 20 }, (_, i) => i + 1);
}
