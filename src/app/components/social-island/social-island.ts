import {
  Component,
  ElementRef,
  HostListener,
  inject,
  PLATFORM_ID,
  OnDestroy,
  afterNextRender,
  NgZone,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type WheelItem = {
  id: string;
  kind: 'resume' | 'social';
  name: string;
  subtitle?: string;
  url: string;
  download?: boolean;
  bgClass: string;
  iconClass: string;
  svgPath: string;
  isStroke: boolean;
  emoji?: string;
};

@Component({
  selector: 'app-social-island',
  template: `
    <!-- Viewport mask: fixed, scroll-independent dim/blur -->
    <div
      class="island-mask"
      [class.island-mask--visible]="isExpanded() && isDesktop()"
      (click)="closeExpanded()"
      aria-hidden="true"
    ></div>

    <aside
      class="social-island"
      [class.social-island--desktop]="isDesktop()"
      [class.social-island--expanded]="isExpanded() && isDesktop()"
      [attr.aria-expanded]="isDesktop() ? isExpanded() : null"
      style="bottom: 32px"
      #islandContainer
    >
      <!-- Semi-wheel plate (md+) -->
      <div class="wheel-plate" aria-hidden="true">
        <div class="wheel-plate__scaler">
          <div class="wheel-plate__ring"></div>
          <div class="wheel-plate__glow"></div>
        </div>
      </div>

      <!-- Hub: resume / expand -->
      <button
        type="button"
        class="island-hub"
        (click)="onHubClick($event)"
        [attr.aria-label]="isDesktop() ? (isExpanded() ? 'Close contact menu' : 'Open contact menu') : 'Resume Options'"
        [attr.aria-expanded]="isDesktop() ? isExpanded() : isMobileDropdownOpen()"
        aria-haspopup="true"
      >
        <span class="island-hub__pulse" aria-hidden="true"></span>
        <svg class="island-hub__icon island-hub__icon--resume" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <svg class="island-hub__icon island-hub__icon--close" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Mobile-only divider -->
      <div class="island-divider" aria-hidden="true"></div>

      <!-- Collapsed social row (always in DOM for mobile; desktop hides when expanded) -->
      <div class="island-collapsed-links">
        @for (link of socialLinks; track link.id) {
          <a
            [href]="link.url"
            [target]="link.url.startsWith('mailto') ? '_self' : '_blank'"
            class="island-node island-node--collapsed"
            [attr.aria-label]="link.name"
            rel="noopener noreferrer"
          >
            <span class="island-node__hit {{ link.bgClass }}"></span>
            <svg
              class="island-node__icon {{ link.iconClass }}"
              [attr.fill]="link.isStroke ? 'none' : 'currentColor'"
              [attr.stroke]="link.isStroke ? 'currentColor' : 'none'"
              viewBox="0 0 24 24"
            >
              <path
                [attr.stroke-linecap]="link.isStroke ? 'round' : null"
                [attr.stroke-linejoin]="link.isStroke ? 'round' : null"
                [attr.stroke-width]="link.isStroke ? '2' : null"
                [attr.d]="link.svgPath"
              />
            </svg>
          </a>
        }
      </div>

      <!-- Desktop wheel options -->
      <div class="wheel-items" role="menu" aria-label="Contact and resume options">
        @for (item of wheelItems; track item.id; let i = $index) {
          <a
            class="wheel-item"
            role="menuitem"
            [href]="item.url"
            [attr.download]="item.download ? true : null"
            [target]="item.url.startsWith('mailto') || item.download ? '_self' : '_blank'"
            [attr.aria-label]="item.name"
            [style.--i]="i"
            (click)="onWheelItemClick()"
            rel="noopener noreferrer"
          >
            <span class="wheel-item__orb {{ item.bgClass }}">
              @if (item.emoji) {
                <span class="wheel-item__emoji" aria-hidden="true">{{ item.emoji }}</span>
              } @else {
                <svg
                  class="wheel-item__icon {{ item.iconClass }}"
                  [attr.fill]="item.isStroke ? 'none' : 'currentColor'"
                  [attr.stroke]="item.isStroke ? 'currentColor' : 'none'"
                  viewBox="0 0 24 24"
                >
                  <path
                    [attr.stroke-linecap]="item.isStroke ? 'round' : null"
                    [attr.stroke-linejoin]="item.isStroke ? 'round' : null"
                    [attr.stroke-width]="item.isStroke ? '2' : null"
                    [attr.d]="item.svgPath"
                  />
                </svg>
              }
            </span>
            <span class="wheel-item__meta">
              <span class="wheel-item__name">{{ item.name }}</span>
              @if (item.subtitle) {
                <span class="wheel-item__sub">{{ item.subtitle }}</span>
              }
            </span>
          </a>
        }
      </div>
    </aside>

    <!-- Mobile resume dropdown -->
    @if (isMobileDropdownOpen() && !isDesktop()) {
      <div
        class="fixed z-[60] flex flex-col gap-2 p-3 bg-[var(--color-card)] backdrop-blur-xl border border-[var(--color-border)] rounded-2xl shadow-2xl min-w-[240px]"
        [style.left.px]="dropdownPosition.x"
        [style.top.px]="dropdownPosition.y"
      >
        <div class="flex items-center gap-2 pb-2 mb-2 border-b border-[var(--color-border)]">
          <svg class="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span class="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold"
            >Download Resume</span
          >
        </div>

        @for (item of resumeItems; track item.id) {
          <a
            [href]="item.url"
            download
            (click)="closeMobileDropdown()"
            class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-card-hover)] text-sm text-[var(--color-text)] transition-colors"
          >
            <span class="text-lg">{{ item.emoji }}</span>
            <div class="flex flex-col leading-tight">
              <span class="font-medium">{{ item.name }}</span>
              <span class="text-[10px] text-[var(--color-text-muted)]">{{ item.subtitle }}</span>
            </div>
          </a>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: contents;
    }

    .island-mask {
      position: fixed;
      inset: 0;
      z-index: 45;
      pointer-events: none;
      opacity: 0;
      background:
        radial-gradient(ellipse 70% 80% at 0% 50%, color-mix(in oklab, var(--color-card) 55%, transparent), transparent 55%),
        color-mix(in oklab, #020617 48%, transparent);
      backdrop-filter: blur(0px);
      -webkit-backdrop-filter: blur(0px);
      transition:
        opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        backdrop-filter 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        -webkit-backdrop-filter 0.45s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .island-mask--visible {
      pointer-events: auto;
      opacity: 1;
      backdrop-filter: blur(10px) saturate(1.15);
      -webkit-backdrop-filter: blur(10px) saturate(1.15);
    }

    .social-island {
      position: fixed;
      z-index: 50;
      left: 50%;
      translate: -50% 0;
      display: flex;
      width: fit-content;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem;
      border-radius: 9999px;
      border: 1px solid var(--color-border);
      background: color-mix(in oklab, var(--color-card) 90%, transparent);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 25px 50px -12px color-mix(in oklab, #020617 35%, transparent);
      overflow: visible;
      transition:
        bottom 0.2s ease-out,
        padding 0.4s cubic-bezier(0.22, 1, 0.36, 1),
        border-radius 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        background 0.35s ease,
        box-shadow 0.45s ease;
    }

    .wheel-plate,
    .wheel-items {
      display: none;
    }

    .island-hub {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 9999px;
      color: var(--color-text);
      transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .island-hub:hover {
      transform: scale(1.08);
    }

    .island-hub:active {
      transform: scale(0.95);
    }

    .island-hub__pulse {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: var(--color-text);
      opacity: 0;
      transition: opacity 0.25s ease;
    }

    .island-hub:hover .island-hub__pulse {
      opacity: 0.1;
    }

    .island-hub__icon {
      position: relative;
      width: 1.25rem;
      height: 1.25rem;
      transition:
        opacity 0.3s ease,
        transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .island-hub__icon--close {
      position: absolute;
      opacity: 0;
      transform: rotate(-90deg) scale(0.6);
    }

    .island-divider {
      width: 1px;
      height: 1.25rem;
      flex-shrink: 0;
      background: var(--color-border);
    }

    .island-collapsed-links {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
    }

    .island-node {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 9999px;
      transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .island-node:hover {
      transform: scale(1.1);
    }

    .island-node:active {
      transform: scale(0.95);
    }

    .island-node__hit {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      opacity: 0;
      transition: opacity 0.25s ease;
    }

    .island-node:hover .island-node__hit {
      opacity: 0.1;
    }

    .island-node__icon {
      position: relative;
      width: 1.25rem;
      height: 1.25rem;
    }

    /* —— Desktop dock —— */
    @media (min-width: 768px) {
      .social-island {
        left: 1.5rem;
        top: 50%;
        bottom: auto !important;
        translate: 0 -50%;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.75rem 0.65rem;
      }

      .island-hub {
        width: 2.75rem;
        height: 2.75rem;
      }

      .island-hub__icon {
        width: 1.5rem;
        height: 1.5rem;
      }

      .island-divider {
        width: 1.25rem;
        height: 1px;
      }

      .island-collapsed-links {
        flex-direction: column;
        gap: 0.75rem;
      }

      .island-node {
        width: 2.75rem;
        height: 2.75rem;
      }

      .island-node__icon {
        width: 1.5rem;
        height: 1.5rem;
      }

      .wheel-plate {
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        width: 22rem;
        height: 22rem;
        translate: -10% -50%;
        pointer-events: none;
        z-index: 0;
      }

      .wheel-plate__scaler {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        opacity: 0;
        transform: scale(0.35);
        transform-origin: 18% 50%;
        will-change: transform, opacity;
      }

      .wheel-plate__ring {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background:
          conic-gradient(
            from 270deg at 50% 50%,
            color-mix(in oklab, var(--color-primary) 22%, transparent) 0deg,
            color-mix(in oklab, var(--color-card) 70%, transparent) 90deg,
            color-mix(in oklab, var(--color-primary) 18%, transparent) 180deg,
            transparent 180deg,
            transparent 360deg
          );
        mask-image: radial-gradient(circle at center, transparent 28%, black 29%, black 62%, transparent 63%);
        -webkit-mask-image: radial-gradient(circle at center, transparent 28%, black 29%, black 62%, transparent 63%);
        border: 1px solid color-mix(in oklab, var(--color-border) 80%, transparent);
        box-shadow:
          inset 0 0 40px color-mix(in oklab, var(--color-primary) 12%, transparent),
          0 30px 80px color-mix(in oklab, #020617 40%, transparent);
      }

      .wheel-plate__glow {
        position: absolute;
        inset: 18%;
        border-radius: inherit;
        background: radial-gradient(
          circle at 30% 50%,
          color-mix(in oklab, var(--color-primary) 28%, transparent),
          transparent 65%
        );
        filter: blur(18px);
        opacity: 0.7;
      }

      .wheel-items {
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        width: 0;
        height: 0;
        z-index: 1;
        pointer-events: none;
      }

      .wheel-item {
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        gap: 0.65rem;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        text-decoration: none;
        color: var(--color-text);
        will-change: transform, opacity;
      }

      .wheel-item__orb {
        position: relative;
        display: grid;
        place-items: center;
        width: 3rem;
        height: 3rem;
        flex-shrink: 0;
        border-radius: 9999px;
        border: 1px solid var(--color-border);
        background: color-mix(in oklab, var(--color-card) 92%, transparent);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 12px 30px color-mix(in oklab, #020617 28%, transparent);
        transition:
          transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
          border-color 0.25s ease,
          box-shadow 0.25s ease;
      }

      .wheel-item:hover .wheel-item__orb {
        transform: scale(1.08);
        border-color: color-mix(in oklab, var(--color-primary) 55%, var(--color-border));
        box-shadow:
          0 14px 34px color-mix(in oklab, #020617 32%, transparent),
          0 0 0 4px color-mix(in oklab, var(--color-primary) 14%, transparent);
      }

      .wheel-item__icon {
        width: 1.25rem;
        height: 1.25rem;
      }

      .wheel-item__emoji {
        font-size: 1.1rem;
        line-height: 1;
      }

      .wheel-item__meta {
        display: flex;
        flex-direction: column;
        gap: 0.05rem;
        min-width: 7.5rem;
        padding: 0.35rem 0.7rem;
        border-radius: 0.85rem;
        border: 1px solid color-mix(in oklab, var(--color-border) 85%, transparent);
        background: color-mix(in oklab, var(--color-card) 88%, transparent);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 10px 24px color-mix(in oklab, #020617 22%, transparent);
        opacity: 0;
        transform: translateX(-6px);
      }

      .wheel-item__name {
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.01em;
        line-height: 1.2;
      }

      .wheel-item__sub {
        font-size: 0.625rem;
        color: var(--color-text-muted);
        line-height: 1.2;
      }

      /* Expanded dock */
      .social-island--expanded {
        padding: 0.85rem;
        border-radius: 1.75rem;
        background: color-mix(in oklab, var(--color-card) 82%, transparent);
        box-shadow:
          0 25px 60px color-mix(in oklab, #020617 40%, transparent),
          0 0 0 1px color-mix(in oklab, var(--color-primary) 18%, transparent);
      }

      .social-island--expanded .island-hub__icon--resume {
        opacity: 0;
        transform: rotate(90deg) scale(0.6);
      }

      .social-island--expanded .island-hub__icon--close {
        opacity: 1;
        transform: rotate(0deg) scale(1);
      }

      .social-island--expanded .island-divider,
      .social-island--expanded .island-collapsed-links {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        height: 0;
        width: 0;
        overflow: hidden;
        margin: 0;
        gap: 0;
      }

      .social-island--expanded .wheel-items {
        pointer-events: none;
      }

      .social-island--expanded .wheel-item {
        visibility: visible;
        pointer-events: auto;
      }
    }

    @media (min-width: 1024px) {
      .wheel-plate {
        width: 26rem;
        height: 26rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .island-mask,
      .island-hub,
      .island-hub__icon,
      .wheel-item__orb,
      .wheel-item__meta {
        transition-duration: 0.01ms !important;
      }
    }
  `,
})
export class SocialIsland implements OnDestroy {
  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private isBrowser = isPlatformBrowser(this.platformId);

  isExpanded = signal(false);
  isDesktop = signal(false);
  isMobileDropdownOpen = signal(false);
  dropdownPosition = { x: 0, y: 0 };

  private resizeHandler: (() => void) | null = null;
  private scrollHandler: (() => void) | null = null;
  private footerEl: HTMLElement | null = null;
  private ticking = false;
  private gsap: typeof import('gsap').default | null = null;
  // GSAP timeline handle (typed loosely to avoid pulling gsap types into the template graph)
  private openTl: any = null;
  private reducedMotion = false;

  socialLinks: WheelItem[] = [
    {
      id: 'github',
      kind: 'social',
      name: 'GitHub',
      subtitle: 'Code & experiments',
      url: 'https://github.com/rishi-rj-s',
      bgClass: 'bg-[var(--color-text)]',
      iconClass: 'text-[var(--color-text)]',
      svgPath:
        'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
      isStroke: false,
    },
    {
      id: 'linkedin',
      kind: 'social',
      name: 'LinkedIn',
      subtitle: 'Professional profile',
      url: 'https://linkedin.com/in/rishiraj-sajeev',
      bgClass: 'bg-[#0077b5]',
      iconClass: 'text-[var(--color-text)] group-hover:text-[#0077b5] transition-colors',
      svgPath:
        'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
      isStroke: false,
    },
    {
      id: 'email',
      kind: 'social',
      name: 'Email',
      subtitle: 'Say hello',
      url: 'mailto:rishirajsajeev@gmail.com',
      bgClass: 'bg-[var(--color-text)]',
      iconClass: 'text-[var(--color-text)]',
      svgPath:
        'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      isStroke: true,
    },
  ];

  resumeItems: WheelItem[] = [
    {
      id: 'resume-en',
      kind: 'resume',
      name: 'English (Global)',
      subtitle: 'PDF • 180KB',
      url: '/assets/resumes/RISHIRAJ_SAJEEV_RESUME.pdf',
      download: true,
      emoji: '📄',
      bgClass: 'bg-[var(--color-primary)]',
      iconClass: 'text-[var(--color-text)]',
      svgPath: '',
      isStroke: false,
    },
    {
      id: 'resume-rirekisho',
      kind: 'resume',
      name: 'Rirekisho (履歴書)',
      subtitle: 'Standard Japanese format',
      url: '/assets/resumes/Rishiraj_Sajeev_Rirekisho.pdf',
      download: true,
      emoji: '🇯🇵',
      bgClass: 'bg-[var(--color-primary)]',
      iconClass: 'text-[var(--color-text)]',
      svgPath: '',
      isStroke: false,
    },
    {
      id: 'resume-shokumu',
      kind: 'resume',
      name: 'Shokumu Keirekisho',
      subtitle: 'Work history (Japanese)',
      url: '/assets/resumes/Rishiraj_Sajeev_Shokumu_Keirekisho.pdf',
      download: true,
      emoji: '💼',
      bgClass: 'bg-[var(--color-primary)]',
      iconClass: 'text-[var(--color-text)]',
      svgPath: '',
      isStroke: false,
    },
  ];

  wheelItems: WheelItem[] = [...this.resumeItems, ...this.socialLinks];

  constructor() {
    afterNextRender(() => {
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.checkDesktop();

      this.footerEl =
        (document.querySelector('app-footer footer') as HTMLElement) ||
        (document.querySelector('footer') as HTMLElement);

      this.resizeHandler = () => {
        const wasDesktop = this.isDesktop();
        this.checkDesktop();
        if (wasDesktop !== this.isDesktop() || !this.isDesktop()) {
          this.killOpenTimeline();
          this.isExpanded.set(false);
          this.unlockScroll();
        }
        this.closeMobileDropdown();
        this.updateIslandBottom();
        if (this.isExpanded() && this.isDesktop()) {
          this.placeWheelItems(true);
        }
      };

      this.scrollHandler = () => {
        if (!this.ticking) {
          this.ticking = true;
          this.ngZone.runOutsideAngular(() => {
            requestAnimationFrame(() => {
              this.updateIslandBottom();
              this.ticking = false;
            });
          });
        }
      };

      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('resize', this.resizeHandler!);
        window.addEventListener('scroll', this.scrollHandler!, { passive: true });
      });

      this.updateIslandBottom();
      void this.ensureGsap();
    });
  }

  ngOnDestroy() {
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
    this.killOpenTimeline();
    this.unlockScroll();
  }

  private checkDesktop() {
    this.isDesktop.set(window.innerWidth >= 768);
  }

  private updateIslandBottom() {
    const asideEl = this.elementRef.nativeElement.querySelector('aside') as HTMLElement;
    if (!asideEl) return;

    if (this.isDesktop()) {
      asideEl.style.removeProperty('bottom');
      return;
    }

    if (!this.footerEl) {
      this.footerEl =
        (document.querySelector('app-footer footer') as HTMLElement) ||
        (document.querySelector('footer') as HTMLElement);
    }
    if (!this.footerEl) {
      asideEl.style.bottom = '32px';
      return;
    }

    const defaultBottom = 32;
    const gap = 16;
    const viewportHeight = window.innerHeight;
    const footerRect = this.footerEl.getBoundingClientRect();

    if (footerRect.top < viewportHeight) {
      const footerVisibleHeight = viewportHeight - footerRect.top;
      asideEl.style.bottom = `${defaultBottom + footerVisibleHeight + gap}px`;
    } else {
      asideEl.style.bottom = '32px';
    }
  }

  private async ensureGsap() {
    if (!this.isBrowser || this.gsap) return this.gsap;
    const mod = await import('gsap');
    this.gsap = mod.default;
    return this.gsap;
  }

  private killOpenTimeline() {
    this.openTl?.kill();
    this.openTl = null;
  }

  private lockScroll() {
    if (!this.isBrowser) return;
    document.documentElement.style.overflow = 'hidden';
  }

  private unlockScroll() {
    if (!this.isBrowser) return;
    document.documentElement.style.overflow = '';
  }

  private getRadius() {
    return window.innerWidth >= 1024 ? 168 : 138;
  }

  /** Rightward semicircle: -90° (up) → +90° (down) */
  private getArcPosition(index: number, total: number, radius: number) {
    const start = -Math.PI / 2;
    const end = Math.PI / 2;
    const t = total === 1 ? 0.5 : index / (total - 1);
    const angle = start + (end - start) * t;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  }

  private placeWheelItems(immediate = false) {
    const root = this.elementRef.nativeElement as HTMLElement;
    const items = Array.from(root.querySelectorAll('.wheel-item')) as HTMLElement[];
    const plate = root.querySelector('.wheel-plate__scaler') as HTMLElement | null;
    const radius = this.getRadius();
    const total = items.length;

    items.forEach((el, i) => {
      const { x, y } = this.getArcPosition(i, total, radius);
      if (immediate && this.gsap) {
        this.gsap.set(el, { xPercent: -50, yPercent: -50, x, y, opacity: 1, scale: 1, rotate: 0 });
        const meta = el.querySelector('.wheel-item__meta');
        if (meta) this.gsap.set(meta, { opacity: 1, x: 0 });
      } else if (this.gsap) {
        this.gsap.set(el, { xPercent: -50, yPercent: -50, x, y });
      }
    });

    if (immediate && plate && this.gsap) {
      this.gsap.set(plate, { opacity: 1, scale: 1 });
    }
  }

  async onHubClick(event: MouseEvent) {
    event.stopPropagation();

    if (this.isDesktop()) {
      if (this.isExpanded()) {
        await this.closeExpanded();
      } else {
        await this.openExpanded();
      }
      return;
    }

    this.toggleMobileDropdown();
  }

  private async openExpanded() {
    if (!this.isBrowser || this.isExpanded()) return;

    this.isExpanded.set(true);
    this.lockScroll();

    const gsap = await this.ensureGsap();
    const root = this.elementRef.nativeElement as HTMLElement;
    const plate = root.querySelector('.wheel-plate__scaler') as HTMLElement | null;
    const items = Array.from(root.querySelectorAll('.wheel-item')) as HTMLElement[];
    const metas = Array.from(root.querySelectorAll('.wheel-item__meta')) as HTMLElement[];
    const radius = this.getRadius();

    this.killOpenTimeline();

    if (!gsap || this.reducedMotion) {
      this.placeWheelItems(true);
      items.forEach((el) => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
      });
      metas.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const arcTargets = items.map((el, i) => {
      const { x, y } = this.getArcPosition(i, items.length, radius);
      return { el, x, y };
    });

    arcTargets.forEach(({ el }) => {
      gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        opacity: 0,
        scale: 0.35,
        rotate: -28,
        transformOrigin: '50% 50%',
      });
    });
    gsap.set(metas, { opacity: 0, x: -10 });
    if (plate) gsap.set(plate, { opacity: 0, scale: 0.35 });

    this.openTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (plate) {
      this.openTl.to(
        plate,
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          ease: 'back.out(1.4)',
        },
        0,
      );
    }

    this.openTl.to(
      items,
      {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 0.55,
        stagger: {
          each: 0.055,
          from: 'start',
        },
        x: (i: number) => arcTargets[i]?.x ?? 0,
        y: (i: number) => arcTargets[i]?.y ?? 0,
        ease: 'back.out(1.6)',
      },
      0.08,
    );

    this.openTl.to(
      metas,
      {
        opacity: 1,
        x: 0,
        duration: 0.35,
        stagger: 0.05,
        ease: 'power2.out',
      },
      0.28,
    );
  }

  async closeExpanded() {
    if (!this.isBrowser || !this.isExpanded()) return;

    const gsap = await this.ensureGsap();
    const root = this.elementRef.nativeElement as HTMLElement;
    const plate = root.querySelector('.wheel-plate__scaler') as HTMLElement | null;
    const items = Array.from(root.querySelectorAll('.wheel-item')) as HTMLElement[];
    const metas = Array.from(root.querySelectorAll('.wheel-item__meta')) as HTMLElement[];

    this.killOpenTimeline();

    const finish = () => {
      this.ngZone.run(() => {
        this.isExpanded.set(false);
        this.unlockScroll();
      });
    };

    if (!gsap || this.reducedMotion) {
      finish();
      return;
    }

    this.openTl = gsap.timeline({
      defaults: { ease: 'power2.in' },
      onComplete: finish,
    });

    this.openTl.to(metas, { opacity: 0, x: -8, duration: 0.18, stagger: 0.02 }, 0);
    this.openTl.to(
      items,
      {
        opacity: 0,
        scale: 0.4,
        rotate: -18,
        x: 0,
        y: 0,
        duration: 0.32,
        stagger: { each: 0.03, from: 'end' },
      },
      0.04,
    );
    if (plate) {
      this.openTl.to(plate, { opacity: 0, scale: 0.4, duration: 0.3 }, 0.06);
    }
  }

  onWheelItemClick() {
    // Keep wheel open for socials; close after resume download intent
    // Soft close shortly after navigation/download starts
    window.setTimeout(() => void this.closeExpanded(), 180);
  }

  toggleMobileDropdown() {
    const next = !this.isMobileDropdownOpen();
    this.isMobileDropdownOpen.set(next);
    if (!next || typeof window === 'undefined') return;

    const container = this.elementRef.nativeElement.querySelector('aside') as HTMLElement;
    if (!container) return;

    const islandRect = container.getBoundingClientRect();
    this.dropdownPosition = {
      x: Math.max(16, (window.innerWidth - 240) / 2),
      y: Math.max(16, islandRect.top - 230),
    };
  }

  closeMobileDropdown() {
    this.isMobileDropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      if (this.isDesktop() && this.isExpanded()) {
        void this.closeExpanded();
      }
      this.closeMobileDropdown();
    }
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    if (this.isDesktop() && this.isExpanded()) {
      void this.closeExpanded();
    }
    this.closeMobileDropdown();
  }
}
