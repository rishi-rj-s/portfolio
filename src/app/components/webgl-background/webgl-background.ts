import { Component, ElementRef, OnDestroy, PLATFORM_ID, effect, afterNextRender, viewChild, inject, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Theme } from '../../services/theme';
import { Background, BackgroundStyle } from '../../services/background';

@Component({
  selector: 'app-webgl-background',
  template: `
    <div #canvasContainer class="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000 opacity-0">
      <canvas #canvas class="w-full h-full block"></canvas>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class WebglBackgroundComponent implements OnDestroy {
  canvasContainer = viewChild<ElementRef<HTMLDivElement>>('canvasContainer');
  canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  private worker: Worker | null = null;
  private platformId = inject(PLATFORM_ID);
  private theme = inject(Theme);
  private background = inject(Background);
  private ngZone = inject(NgZone);
  
  isBrowser = isPlatformBrowser(this.platformId);

  // Performance: Throttle mouse/scroll messages to worker
  private lastMouseMsgTime = 0;
  private lastScrollMsgTime = 0;
  private static readonly MSG_THROTTLE_MS = 50; // ~20 msgs/sec instead of 60+
  private resizeTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Theme reaction effect
    effect(() => {
      const currentTheme = this.theme.currentTheme();
      if (this.isBrowser && this.worker) {
        this.worker.postMessage({ type: 'theme', theme: currentTheme });
      }
    });

    // Background style reaction effect
    effect(() => {
      const newStyle = this.background.currentBackground();
      if (this.isBrowser && this.worker) {
        this.worker.postMessage({ type: 'style', style: newStyle });
      }
    });

    // Angular v20 / SSR Standard: Use afterNextRender for browser-only initialization
    afterNextRender(() => {
      this.initWorker();
      
      const container = this.canvasContainer()?.nativeElement;
      if (container) {
          setTimeout(() => {
             container.classList.remove('opacity-0');
          }, 100);
      }
      
      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('mousemove', this.onMouseMove, { passive: true });
        window.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('resize', this.onWindowResize);
      });
    });
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onWindowResize);
      
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.worker?.terminate();
    }
  }

  private initWorker() {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas || !window.Worker) return;

    // Feature detect OffscreenCanvas
    if (!canvas.transferControlToOffscreen) {
      console.warn('OffscreenCanvas not supported');
      return;
    }

    try {
      const offscreen = canvas.transferControlToOffscreen();
      
      this.worker = new Worker(new URL('./webgl.worker', import.meta.url));
      
      this.worker.postMessage({
        type: 'init',
        canvas: offscreen,
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio,
        theme: this.theme.currentTheme(),
        style: this.background.currentBackground()
      }, [offscreen]);

    } catch (err) {
      console.error('Failed to initialize WebGL worker:', err);
    }
  }

  // Performance: Debounce resize instead of firing immediately
  private onWindowResize = () => {
    if (!this.worker) return;
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.worker?.postMessage({
        type: 'resize',
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, 150);
  };

  // Performance: Throttle mouse messages to worker
  private onMouseMove = (event: MouseEvent) => {
    if (!this.worker) return;
    const now = performance.now();
    if (now - this.lastMouseMsgTime < WebglBackgroundComponent.MSG_THROTTLE_MS) return;
    this.lastMouseMsgTime = now;
    
    this.worker.postMessage({
      type: 'mouse',
      x: event.clientX - window.innerWidth / 2,
      y: event.clientY - window.innerHeight / 2
    });
  };
  
  // Performance: Throttle scroll messages to worker
  private onScroll = () => {
    if (!this.worker) return;
    const now = performance.now();
    if (now - this.lastScrollMsgTime < WebglBackgroundComponent.MSG_THROTTLE_MS) return;
    this.lastScrollMsgTime = now;
    
    this.worker.postMessage({
      type: 'scroll',
      y: window.scrollY
    });
  };
}
