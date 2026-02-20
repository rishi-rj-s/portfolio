import { Component, ElementRef, OnDestroy, PLATFORM_ID, effect, afterNextRender, viewChild, inject, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Theme } from '../../services/theme';
import { Background, BackgroundStyle } from '../../services/background';

@Component({
  selector: 'app-webgl-background',
  template: `
    <div #canvasContainer class="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000 opacity-0">
      <canvas #canvas></canvas>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      overflow: hidden;
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
        window.addEventListener('mousemove', this.onMouseMove);
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

  private onWindowResize = () => {
    if (!this.worker) return;
    this.worker.postMessage({
      type: 'resize',
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  private onMouseMove = (event: MouseEvent) => {
    if (!this.worker) return;
    this.worker.postMessage({
      type: 'mouse',
      x: event.clientX - window.innerWidth / 2,
      y: event.clientY - window.innerHeight / 2
    });
  };
  
  private onScroll = () => {
    if (!this.worker) return;
    this.worker.postMessage({
      type: 'scroll',
      y: window.scrollY
    });
  };
}
