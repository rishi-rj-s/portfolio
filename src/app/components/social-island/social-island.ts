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
  effect,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type WheelItem = {
  id: string;
  name: string;
  subtitle?: string;
  url: string;
  download?: boolean;
  iconClass: string;
  svgPath: string;
  isStroke: boolean;
  emoji?: string;
};

@Component({
  selector: 'app-social-island',
  template: `
    <div
      class="island-mask"
      [class.island-mask--visible]="isExpanded() && isDesktop()"
      aria-hidden="true"
    ></div>

    <aside
      class="social-island"
      [class.social-island--desktop]="isDesktop()"
      [class.social-island--expanded]="isExpanded() && isDesktop()"
      [style.--track-r.px]="trackRadius()"
      [style.--plate-r.px]="plateRadius()"
      (mouseenter)="onIslandEnter()"
      (mouseleave)="onIslandLeave()"
      (focusin)="onIslandEnter()"
      (focusout)="onIslandFocusOut($event)"
      style="bottom: 32px"
    >
      <div class="hover-bridge" aria-hidden="true"></div>

      <div class="wheel-plate" aria-hidden="true">
        <div class="wheel-plate__scaler">
          <div class="wheel-plate__disc"></div>
          <div class="wheel-plate__ring"></div>
          <div class="wheel-plate__glow"></div>
        </div>
      </div>

      <button
        type="button"
        class="island-hub"
        (click)="onHubClick($event)"
        [attr.aria-label]="isDesktop() ? 'Contact and resume options' : 'Resume Options'"
        [attr.aria-expanded]="isDesktop() ? isExpanded() : isMobileDropdownOpen()"
        aria-haspopup="true"
      >
        <span class="island-hub__pulse" aria-hidden="true"></span>
        <svg class="island-hub__icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="7.25" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.35" />
          <circle cx="12" cy="12" r="2.35" fill="currentColor" />
          <circle cx="12" cy="4.2" r="1.55" fill="currentColor" />
          <circle cx="18.7" cy="15.9" r="1.55" fill="currentColor" />
          <circle cx="5.3" cy="15.9" r="1.55" fill="currentColor" />
        </svg>
      </button>

      <div class="island-divider" aria-hidden="true"></div>

      <div class="island-collapsed-links">
        @for (link of socialLinks; track link.id) {
          <a
            [href]="link.url"
            [target]="link.url.startsWith('mailto') ? '_self' : '_blank'"
            class="island-node"
            [attr.aria-label]="link.name"
            rel="noopener noreferrer"
          >
            <span class="island-node__hit"></span>
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

      <div class="wheel-items" role="menu" aria-label="Contact and resume options">
        @for (item of wheelItems; track item.id; let i = $index) {
          <a
            class="wheel-item"
            role="menuitem"
            [href]="item.url"
            [attr.download]="item.download ? '' : null"
            [target]="item.url.startsWith('mailto') || item.download ? '_self' : '_blank'"
            [attr.aria-label]="item.name + (item.subtitle ? ', ' + item.subtitle : '')"
            [class.wheel-item--active]="activeItem()?.id === item.id"
            (mouseenter)="setActiveItem(item)"
            (focus)="setActiveItem(item)"
            (mouseleave)="clearActiveItem()"
            (blur)="clearActiveItem()"
            rel="noopener noreferrer"
          >
            <span class="wheel-item__orb">
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
            <span class="wheel-item__meta" aria-hidden="true">
              <span class="wheel-item__name">{{ item.name }}</span>
              @if (item.subtitle) {
                <span class="wheel-item__sub">{{ item.subtitle }}</span>
              }
            </span>
          </a>
        }
      </div>
    </aside>

    @if (isMobileDropdownOpen() && !isDesktop()) {
      <div
        class="mobile-resume-panel fixed z-[60] flex flex-col gap-2 p-3 bg-[var(--color-card)] backdrop-blur-xl border border-[var(--color-border)] rounded-2xl shadow-2xl min-w-[240px]"
        [style.left.px]="dropdownPosition.x"
        [style.top.px]="dropdownPosition.y"
        (click)="$event.stopPropagation()"
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
      display: block;
    }

    .island-mask {
      position: fixed;
      inset: 0;
      z-index: 45;
      pointer-events: none;
      opacity: 0;
      background:
        radial-gradient(ellipse 50% 65% at 0% 50%, color-mix(in oklab, var(--color-card) 48%, transparent), transparent 60%),
        color-mix(in oklab, #020617 36%, transparent);
      transition: opacity 0.35s ease;
    }

    .island-mask--visible {
      opacity: 1;
      backdrop-filter: blur(8px) saturate(1.08);
      -webkit-backdrop-filter: blur(8px) saturate(1.08);
    }

    .social-island {
      --track-r: 120px;
      --plate-r: 168px;
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
        padding 0.3s ease,
        border-radius 0.3s ease,
        background 0.3s ease,
        box-shadow 0.3s ease;
    }

    .hover-bridge,
    .wheel-plate,
    .wheel-items {
      display: none;
    }

    .island-hub {
      position: relative;
      z-index: 4;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border: 0;
      background: transparent;
      cursor: pointer;
      border-radius: 9999px;
      color: var(--color-text);
    }

    .island-hub__pulse {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: var(--color-text);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .island-hub:hover .island-hub__pulse {
      opacity: 0.1;
    }

    .island-hub__icon {
      position: relative;
      width: 1.35rem;
      height: 1.35rem;
    }

    .island-divider {
      width: 1px;
      height: 1.25rem;
      flex-shrink: 0;
      background: var(--color-border);
      transition: opacity 0.25s ease;
    }

    .island-collapsed-links {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      transition: opacity 0.25s ease;
    }

    .island-node {
      position: relative;
      z-index: 4;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 9999px;
      transition: transform 0.2s ease;
    }

    .island-node:hover {
      transform: scale(1.08);
    }

    .island-node__hit {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: var(--color-text);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .island-node:hover .island-node__hit {
      opacity: 0.1;
    }

    .island-node__icon {
      position: relative;
      width: 1.25rem;
      height: 1.25rem;
    }

    @media (min-width: 768px) {
      .social-island {
        left: 1.25rem;
        top: 50%;
        bottom: auto !important;
        translate: 0 -50%;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.75rem 0.65rem;
      }

      .hover-bridge {
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        /* Extra width on the right so labels stay inside the hover keep-alive zone */
        width: calc(var(--plate-r) * 2 + 10rem);
        height: calc(var(--plate-r) * 2 + 1rem);
        translate: -28% -50%;
        z-index: 1;
        pointer-events: none;
        border-radius: 50%;
      }

      .social-island--expanded .hover-bridge {
        pointer-events: auto;
      }

      .island-hub {
        width: 2.75rem;
        height: 2.75rem;
      }

      .island-hub__icon {
        width: 1.45rem;
        height: 1.45rem;
      }

      /* Desktop uses the hover semicircle for links — hub alone is enough at rest */
      .island-divider,
      .island-collapsed-links {
        display: none;
      }

      .wheel-plate {
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        width: calc(var(--plate-r) * 2);
        height: calc(var(--plate-r) * 2);
        translate: -50% -50%;
        pointer-events: none;
        z-index: 0;
      }

      .wheel-plate__scaler {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        opacity: 0;
        transform: scale(0.72);
        transform-origin: center;
        will-change: transform, opacity;
      }

      /* No filled disc — only a thin track ring around the hub */
      .wheel-plate__disc {
        display: none;
      }

      .wheel-plate__ring {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: conic-gradient(
          from 250deg at 50% 50%,
          color-mix(in oklab, var(--color-primary) 28%, transparent) 0deg,
          color-mix(in oklab, var(--color-border) 70%, transparent) 90deg,
          color-mix(in oklab, var(--color-primary) 16%, transparent) 160deg,
          transparent 180deg,
          transparent 360deg
        );
        mask-image: radial-gradient(
          circle at center,
          transparent calc(var(--track-r) - 1.5px),
          black calc(var(--track-r) - 0.5px),
          black calc(var(--track-r) + 0.5px),
          transparent calc(var(--track-r) + 1.5px)
        );
        -webkit-mask-image: radial-gradient(
          circle at center,
          transparent calc(var(--track-r) - 1.5px),
          black calc(var(--track-r) - 0.5px),
          black calc(var(--track-r) + 0.5px),
          transparent calc(var(--track-r) + 1.5px)
        );
      }

      .wheel-plate__glow {
        position: absolute;
        inset: 42%;
        border-radius: inherit;
        background: radial-gradient(
          circle at 50% 50%,
          color-mix(in oklab, var(--color-primary) 16%, transparent),
          transparent 72%
        );
        filter: blur(12px);
        opacity: 0.45;
      }

      .wheel-items {
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        width: 0;
        height: 0;
        z-index: 2;
        pointer-events: none;
      }

      .wheel-item {
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 0;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        text-decoration: none;
        color: var(--color-text);
        will-change: transform, opacity;
      }

      .social-island--expanded .wheel-item {
        visibility: visible;
        pointer-events: auto;
      }

      .wheel-item:hover,
      .wheel-item:focus-visible,
      .wheel-item--active {
        z-index: 5;
      }

      .wheel-item__orb {
        position: absolute;
        left: 0;
        top: 0;
        display: grid;
        place-items: center;
        width: 2.55rem;
        height: 2.55rem;
        translate: -50% -50%;
        border-radius: 9999px;
        border: 1px solid color-mix(in oklab, var(--color-border) 85%, transparent);
        background: color-mix(in oklab, var(--color-card) 94%, transparent);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 10px 24px color-mix(in oklab, #020617 26%, transparent);
        transition:
          transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
          border-color 0.22s ease,
          background 0.22s ease,
          box-shadow 0.22s ease,
          opacity 0.2s ease;
      }

      /* Bridge the few pixels between orb and label so hover doesn't drop */
      .wheel-item__orb::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 1.75rem;
        height: 2.75rem;
        translate: 0 -50%;
      }

      .wheel-item:hover .wheel-item__orb,
      .wheel-item:focus-visible .wheel-item__orb,
      .wheel-item--active .wheel-item__orb {
        transform: scale(1.12);
        border-color: color-mix(in oklab, var(--color-primary) 60%, var(--color-border));
        background: color-mix(in oklab, var(--color-card) 98%, var(--color-primary) 5%);
        box-shadow:
          0 12px 28px color-mix(in oklab, #020617 32%, transparent),
          0 0 0 3px color-mix(in oklab, var(--color-primary) 18%, transparent);
      }

      .wheel-item__icon {
        width: 1.15rem;
        height: 1.15rem;
      }

      .wheel-item__emoji {
        font-size: 1rem;
        line-height: 1;
      }

      /* Anchored to the orb point — never part of the transform box, so arcs stay clean */
      .wheel-item__meta {
        position: absolute;
        left: 1.3rem;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.1rem;
        min-width: 8.25rem;
        max-width: 11rem;
        padding: 0.4rem 0.75rem;
        border-radius: 0.85rem;
        border: 1px solid color-mix(in oklab, var(--color-border) 85%, transparent);
        background: color-mix(in oklab, var(--color-card) 94%, transparent);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 10px 24px color-mix(in oklab, #020617 24%, transparent);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        translate: 0 -50%;
        transform: translateX(-6px);
        transition:
          opacity 0.2s ease,
          transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
          visibility 0.2s ease,
          pointer-events 0.2s ease;
        white-space: nowrap;
      }

      .wheel-item:hover .wheel-item__meta,
      .wheel-item:focus-visible .wheel-item__meta,
      .wheel-item--active .wheel-item__meta {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translateX(0);
      }

      /* Soften neighbors while one option is focused */
      .social-island--expanded:has(.wheel-item--active) .wheel-item:not(.wheel-item--active) .wheel-item__orb {
        opacity: 0.72;
      }

      .wheel-item__name {
        font-size: 0.75rem;
        font-weight: 650;
        letter-spacing: 0.01em;
        line-height: 1.2;
        color: var(--color-text);
      }

      .wheel-item__sub {
        font-size: 0.625rem;
        line-height: 1.25;
        color: var(--color-text-muted);
      }

      /* Expanded = compact hub only; wheel orbits the center point */
      .social-island--expanded {
        gap: 0;
        padding: 0.45rem;
        border-radius: 9999px;
        background: color-mix(in oklab, var(--color-card) 90%, transparent);
        box-shadow:
          0 18px 40px color-mix(in oklab, #020617 36%, transparent),
          0 0 0 1px color-mix(in oklab, var(--color-primary) 16%, transparent);
      }
    }
  `,
})
export class SocialIsland implements OnDestroy {
  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private isBrowser = isPlatformBrowser(this.platformId);

  isDesktop = signal(false);
  isExpanded = signal(false);
  isMobileDropdownOpen = signal(false);
  activeItem = signal<WheelItem | null>(null);
  trackRadius = signal(78);
  plateRadius = signal(108);
  dropdownPosition = { x: 0, y: 0 };

  private resizeHandler: (() => void) | null = null;
  private scrollHandler: (() => void) | null = null;
  private mediaQuery: MediaQueryList | null = null;
  private mediaHandler: (() => void) | null = null;
  private footerEl: HTMLElement | null = null;
  private ticking = false;
  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private gsap: typeof import('gsap').default | null = null;
  private wheelTl: any = null;
  private reducedMotion = false;
  /** Even 36° steps across a right-facing semicircle */
  private angles = [-90, -54, -18, 18, 54, 90];

  socialLinks: WheelItem[] = [
    {
      id: 'github',
      name: 'GitHub',
      subtitle: 'Code & experiments',
      url: 'https://github.com/rishi-rj-s',
      iconClass: 'text-[var(--color-text)]',
      svgPath:
        'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
      isStroke: false,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      subtitle: 'Professional profile',
      url: 'https://linkedin.com/in/rishiraj-sajeev',
      iconClass: 'text-[var(--color-text)]',
      svgPath:
        'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
      isStroke: false,
    },
    {
      id: 'email',
      name: 'Email',
      subtitle: 'Say hello',
      url: 'mailto:rishirajsajeev@gmail.com',
      iconClass: 'text-[var(--color-text)]',
      svgPath:
        'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      isStroke: true,
    },
  ];

  resumeItems: WheelItem[] = [
    {
      id: 'resume-en',
      name: 'English (Global)',
      subtitle: 'PDF • 180KB',
      url: '/assets/resumes/RISHIRAJ_SAJEEV_RESUME.pdf',
      download: true,
      emoji: '📄',
      iconClass: 'text-[var(--color-text)]',
      svgPath: '',
      isStroke: false,
    },
    {
      id: 'resume-rirekisho',
      name: 'Rirekisho (履歴書)',
      subtitle: 'Standard Japanese format',
      url: '/assets/resumes/Rishiraj_Sajeev_Rirekisho.pdf',
      download: true,
      emoji: '🇯🇵',
      iconClass: 'text-[var(--color-text)]',
      svgPath: '',
      isStroke: false,
    },
    {
      id: 'resume-shokumu',
      name: 'Shokumu Keirekisho',
      subtitle: 'Work history (Japanese)',
      url: '/assets/resumes/Rishiraj_Sajeev_Shokumu_Keirekisho.pdf',
      download: true,
      emoji: '💼',
      iconClass: 'text-[var(--color-text)]',
      svgPath: '',
      isStroke: false,
    },
  ];

  wheelItems: WheelItem[] = [...this.resumeItems, ...this.socialLinks];

  constructor() {
    effect(() => {
      const open = this.isExpanded() && this.isDesktop();
      // touch radius signals so effect re-runs when layout metrics change while open
      this.trackRadius();
      this.plateRadius();
      if (!this.isBrowser) return;
      void this.syncWheelMotion(open);
    });

    afterNextRender(() => {
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.mediaQuery = window.matchMedia('(min-width: 768px)');
      this.mediaHandler = () => {
        this.isDesktop.set(this.mediaQuery!.matches);
        if (!this.mediaQuery!.matches) {
          this.clearHoverTimers();
          this.isExpanded.set(false);
          this.activeItem.set(null);
          this.closeMobileDropdown();
        }
        this.updateMetrics();
        this.updateIslandBottom();
      };
      this.isDesktop.set(this.mediaQuery.matches);
      this.mediaQuery.addEventListener('change', this.mediaHandler);

      this.footerEl =
        (document.querySelector('app-footer footer') as HTMLElement) ||
        (document.querySelector('footer') as HTMLElement);

      this.resizeHandler = () => {
        this.closeMobileDropdown();
        this.updateMetrics();
        this.updateIslandBottom();
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

      this.updateMetrics();
      this.updateIslandBottom();
      void this.ensureGsap();
      this.resetWheelItems();
    });
  }

  ngOnDestroy() {
    this.clearHoverTimers();
    this.wheelTl?.kill();
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
    if (this.mediaQuery && this.mediaHandler) {
      this.mediaQuery.removeEventListener('change', this.mediaHandler);
    }
  }

  /** Tight orbit around the hub center — not a tall filled plate */
  private updateMetrics() {
    if (typeof window === 'undefined') return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Hub ~44px + pad; keep a small air gap then the orb
    const hubHalf = 28;
    const orbHalf = 20;
    const airGap = 8;
    // 36° steps → chord ≈ 0.618·r; need ~44px so orbs don't collide
    const minTrack = 72;
    const idealTrack = hubHalf + airGap + orbHalf; // ~56, bumped by minTrack
    const maxByHeight = Math.max(minTrack, vh / 2 - orbHalf - 24);
    const maxByWidth = Math.max(minTrack, vw - 220); // leave room for hover labels
    const trackR = Math.min(Math.max(minTrack, idealTrack, 78), maxByHeight, maxByWidth, 86);
    const plateR = trackR + orbHalf + 10;

    this.trackRadius.set(Math.round(trackR));
    this.plateRadius.set(Math.round(plateR));
  }

  private clearHoverTimers() {
    if (this.openTimer) {
      clearTimeout(this.openTimer);
      this.openTimer = null;
    }
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  private isDesktopNow() {
    return typeof window !== 'undefined' ? window.innerWidth >= 768 : this.isDesktop();
  }

  private arcPoint(index: number, radius: number) {
    const deg = this.angles[index] ?? 0;
    const rad = (deg * Math.PI) / 180;
    return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
  }

  setActiveItem(item: WheelItem) {
    this.activeItem.set(item);
  }

  clearActiveItem() {
    this.activeItem.set(null);
  }

  private async ensureGsap() {
    if (!this.isBrowser || this.gsap) return this.gsap;
    const mod = await import('gsap');
    this.gsap = mod.default;
    return this.gsap;
  }

  private wheelEls() {
    const root = this.elementRef.nativeElement as HTMLElement;
    return {
      items: Array.from(root.querySelectorAll('.wheel-item')) as HTMLElement[],
      plate: root.querySelector('.wheel-plate__scaler') as HTMLElement | null,
    };
  }

  private resetWheelItems() {
    const { items, plate } = this.wheelEls();
    items.forEach((el) => {
      el.style.opacity = '0';
      el.style.visibility = 'hidden';
      el.style.transform = 'translate(0px, 0px) scale(0.45)';
    });
    if (plate) {
      plate.style.opacity = '0';
      plate.style.transform = 'scale(0.72)';
    }
  }

  private async syncWheelMotion(open: boolean) {
    if (!this.isDesktopNow()) return;

    const gsap = await this.ensureGsap();
    const { items, plate } = this.wheelEls();
    if (!items.length) return;

    const radius = this.trackRadius();
    this.wheelTl?.kill();

    if (!gsap || this.reducedMotion) {
      items.forEach((el, i) => {
        const { x, y } = this.arcPoint(i, radius);
        if (open) {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.transform = `translate(${x}px, ${y}px) scale(1)`;
        } else {
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
          el.style.transform = 'translate(0px, 0px) scale(0.45)';
        }
      });
      if (plate) {
        plate.style.opacity = open ? '1' : '0';
        plate.style.transform = open ? 'scale(1)' : 'scale(0.72)';
      }
      return;
    }

    if (open) {
      // If already open (resize), snap to new radius smoothly
      const alreadyVisible = items.some((el) => el.style.visibility === 'visible' && el.style.opacity !== '0');
      if (alreadyVisible) {
        this.wheelTl = gsap.timeline();
        this.wheelTl.to(
          items,
          {
            duration: 0.28,
            ease: 'power2.out',
            x: (i: number) => this.arcPoint(i, radius).x,
            y: (i: number) => this.arcPoint(i, radius).y,
            opacity: 1,
            scale: 1,
          },
          0,
        );
        if (plate) this.wheelTl.to(plate, { opacity: 1, scale: 1, duration: 0.28 }, 0);
        return;
      }

      items.forEach((el) => {
        gsap.set(el, { x: 0, y: 0, scale: 0.5, opacity: 0, visibility: 'visible' });
      });
      if (plate) gsap.set(plate, { opacity: 0, scale: 0.75 });

      this.wheelTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (plate) this.wheelTl.to(plate, { opacity: 1, scale: 1, duration: 0.36 }, 0);
      this.wheelTl.to(
        items,
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.03,
          x: (i: number) => this.arcPoint(i, radius).x,
          y: (i: number) => this.arcPoint(i, radius).y,
          ease: 'power2.out',
        },
        0.03,
      );
    } else {
      this.activeItem.set(null);
      this.wheelTl = gsap.timeline({
        defaults: { ease: 'power2.in' },
        onComplete: () => items.forEach((el) => (el.style.visibility = 'hidden')),
      });
      this.wheelTl.to(
        items,
        {
          opacity: 0,
          scale: 0.5,
          x: 0,
          y: 0,
          duration: 0.24,
          stagger: { each: 0.016, from: 'end' },
        },
        0,
      );
      if (plate) this.wheelTl.to(plate, { opacity: 0, scale: 0.75, duration: 0.22 }, 0.02);
    }
  }

  onIslandEnter() {
    if (!this.isDesktopNow()) return;
    this.isDesktop.set(true);
    this.clearHoverTimers();
    this.updateMetrics();
    this.openTimer = setTimeout(() => {
      this.isExpanded.set(true);
      this.openTimer = null;
    }, 70);
  }

  onIslandLeave() {
    if (!this.isDesktopNow()) return;
    this.clearHoverTimers();
    this.closeTimer = setTimeout(() => {
      this.isExpanded.set(false);
      this.activeItem.set(null);
      this.closeTimer = null;
    }, 140);
  }

  onIslandFocusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null;
    const root = this.elementRef.nativeElement.querySelector('aside');
    if (root && next && root.contains(next)) return;
    this.onIslandLeave();
  }

  private updateIslandBottom() {
    const asideEl = this.elementRef.nativeElement.querySelector('aside') as HTMLElement;
    if (!asideEl) return;

    if (this.isDesktop() || (typeof window !== 'undefined' && window.innerWidth >= 768)) {
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

  onHubClick(event: MouseEvent) {
    event.stopPropagation();
    const desktop = typeof window !== 'undefined' ? window.innerWidth >= 768 : this.isDesktop();
    this.isDesktop.set(desktop);
    if (desktop) return;
    this.toggleMobileDropdown();
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
    const target = event.target as Element | null;
    if (target?.closest('.social-island, .mobile-resume-panel, app-social-island')) return;
    this.closeMobileDropdown();
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.clearHoverTimers();
    this.isExpanded.set(false);
    this.activeItem.set(null);
    this.closeMobileDropdown();
  }
}
