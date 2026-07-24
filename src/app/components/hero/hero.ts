import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  template: `
    <section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-[80px] opacity-[0.03]"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[80px] opacity-[0.03]"></div>
      </div>

      <div class="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col items-center">
        <h2 class="text-sm md:text-base font-bold tracking-[0.2em] text-[var(--color-text-secondary)] mb-8 md:mb-10 text-center">
          FULL-STACK SOFTWARE ENGINEER
        </h2>

        <!-- Frozen 3D comic breakout — no motion -->
        <div class="name-stage select-none">
          <div class="shatter-pane" aria-hidden="true">
            <svg class="shatter-svg" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid meet">
              <defs>
                <!-- Clear pane glass -->
                <linearGradient id="glassA" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
                  <stop offset="35%" stop-color="#a5b4fc" stop-opacity="0.18"/>
                  <stop offset="70%" stop-color="#ffffff" stop-opacity="0.08"/>
                  <stop offset="100%" stop-color="#6366f1" stop-opacity="0.14"/>
                </linearGradient>
                <linearGradient id="glassB" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#e0e7ff" stop-opacity="0.4"/>
                  <stop offset="50%" stop-color="#ffffff" stop-opacity="0.1"/>
                  <stop offset="100%" stop-color="#818cf8" stop-opacity="0.2"/>
                </linearGradient>
                <linearGradient id="glassC" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
                  <stop offset="60%" stop-color="#c7d2fe" stop-opacity="0.12"/>
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05"/>
                </linearGradient>
                <!-- Bright specular edge on leading face -->
                <linearGradient id="rimLight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="0.15"/>
                </linearGradient>
              </defs>

              <!--
                Real glass break: thin elongated splinters + sharp triangular plates,
                rotated mid-flight, denser on the breakout (right) side.
                No crack spokes / impact lines.
              -->

              <!-- LARGE PLATE — upper right, flying out -->
              <g transform="translate(670,95) rotate(18)">
                <polygon fill="url(#glassA)" stroke="#ffffff" stroke-opacity="0.55" stroke-width="1.1"
                  points="0,-8 78,-28 118,-6 102,42 48,58 -6,36 -18,8"/>
                <polyline fill="none" stroke="url(#rimLight)" stroke-width="1.6" points="-6,36 48,58 102,42"/>
                <line x1="12" y1="0" x2="88" y2="18" stroke="#ffffff" stroke-opacity="0.25" stroke-width="0.8"/>
              </g>

              <!-- LONG SPLINTER — needle glass -->
              <g transform="translate(760,175) rotate(-12)">
                <polygon fill="url(#glassB)" stroke="#ffffff" stroke-opacity="0.5" stroke-width="0.9"
                  points="0,0 140,-14 148,4 12,18"/>
                <line x1="8" y1="2" x2="130" y2="-6" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1"/>
              </g>

              <!-- DAGGER TRIANGLE — mid right -->
              <g transform="translate(720,250) rotate(28)">
                <polygon fill="url(#glassA)" stroke="#c7d2fe" stroke-opacity="0.7" stroke-width="1"
                  points="0,10 96,-22 108,18 18,32"/>
                <polyline fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="1.3" points="0,10 96,-22 108,18"/>
              </g>

              <!-- WIDE JAGGED PANE — lower right -->
              <g transform="translate(640,320) rotate(-8)">
                <polygon fill="url(#glassC)" stroke="#ffffff" stroke-opacity="0.45" stroke-width="1"
                  points="-10,0 55,-35 110,-18 128,30 72,58 20,48 -18,22"/>
                <polyline fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="1.2" points="55,-35 110,-18 128,30"/>
                <line x1="5" y1="8" x2="90" y2="12" stroke="#a5b4fc" stroke-opacity="0.3" stroke-width="0.7"/>
              </g>

              <!-- SPIKE SPLINTER — far right -->
              <g transform="translate(820,300) rotate(42)">
                <polygon fill="url(#glassB)" stroke="#ffffff" stroke-opacity="0.55" stroke-width="0.8"
                  points="0,4 88,-10 94,6 6,16"/>
              </g>

              <!-- TINY NEEDLE -->
              <g transform="translate(850,140) rotate(-35)">
                <polygon fill="url(#glassA)" stroke="#ffffff" stroke-opacity="0.6" stroke-width="0.7"
                  points="0,2 52,-6 56,3 3,9"/>
              </g>

              <!-- CHIP — acute triangle -->
              <g transform="translate(790,90) rotate(55)">
                <polygon fill="url(#glassC)" stroke="#ffffff" stroke-opacity="0.65" stroke-width="0.8"
                  points="0,0 38,-18 42,12"/>
              </g>

              <!-- TOP splinter above name -->
              <g transform="translate(520,70) rotate(-22)">
                <polygon fill="url(#glassA)" stroke="#ffffff" stroke-opacity="0.5" stroke-width="0.9"
                  points="0,6 72,-16 80,8 8,22"/>
                <line x1="6" y1="8" x2="68" y2="-4" stroke="#ffffff" stroke-opacity="0.3" stroke-width="0.8"/>
              </g>

              <!-- TOP-LEFT plate remnant -->
              <g transform="translate(250,95) rotate(-28)">
                <polygon fill="url(#glassB)" stroke="#ffffff" stroke-opacity="0.45" stroke-width="1"
                  points="0,0 62,-20 95,8 70,48 18,52 -12,24"/>
                <polyline fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="1.2" points="0,0 62,-20 95,8"/>
              </g>

              <!-- LEFT thin shard -->
              <g transform="translate(180,210) rotate(15)">
                <polygon fill="url(#glassC)" stroke="#c7d2fe" stroke-opacity="0.55" stroke-width="0.8"
                  points="0,0 70,-8 76,10 5,16"/>
              </g>

              <!-- LOWER-LEFT jagged -->
              <g transform="translate(220,340) rotate(-40)">
                <polygon fill="url(#glassA)" stroke="#ffffff" stroke-opacity="0.45" stroke-width="0.9"
                  points="0,8 48,-18 85,2 70,40 22,48 -8,28"/>
              </g>

              <!-- BOTTOM center chip -->
              <g transform="translate(480,400) rotate(12)">
                <polygon fill="url(#glassB)" stroke="#ffffff" stroke-opacity="0.5" stroke-width="0.8"
                  points="0,0 45,-14 58,16 12,24"/>
              </g>

              <!-- MICRO debris near breakout (right of letters) -->
              <g transform="translate(610,200) rotate(70)">
                <polygon fill="url(#glassA)" stroke="#ffffff" stroke-opacity="0.7" stroke-width="0.6"
                  points="0,0 28,-8 32,6"/>
              </g>
              <g transform="translate(630,240) rotate(-50)">
                <polygon fill="url(#glassC)" stroke="#ffffff" stroke-opacity="0.65" stroke-width="0.6"
                  points="0,1 34,-5 36,7"/>
              </g>
              <g transform="translate(590,160) rotate(25)">
                <polygon fill="url(#glassB)" stroke="#ffffff" stroke-opacity="0.6" stroke-width="0.6"
                  points="0,0 22,-10 40,2 8,12"/>
              </g>
              <g transform="translate(700,380) rotate(8)">
                <polygon fill="url(#glassA)" stroke="#ffffff" stroke-opacity="0.55" stroke-width="0.7"
                  points="0,0 40,-12 48,8 4,14"/>
              </g>
              <g transform="translate(880,220) rotate(-18)">
                <polygon fill="url(#glassB)" stroke="#ffffff" stroke-opacity="0.6" stroke-width="0.6"
                  points="0,2 36,-4 38,6"/>
              </g>
              <g transform="translate(340,50) rotate(33)">
                <polygon fill="url(#glassC)" stroke="#ffffff" stroke-opacity="0.5" stroke-width="0.7"
                  points="0,0 30,-12 46,4 10,14"/>
              </g>
            </svg>
          </div>

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
      width: min(96vw, 920px);
      aspect-ratio: 900 / 500;
      perspective: 900px;
      perspective-origin: 30% 50%;
    }

    .shatter-pane {
      position: absolute;
      inset: -4% -6%;
      z-index: 1;
      pointer-events: none;
    }

    .shatter-svg {
      width: 100%;
      height: 100%;
      display: block;
      overflow: visible;
    }

    .name-3d {
      position: absolute;
      inset: 0;
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
