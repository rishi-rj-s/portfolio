import {
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender,
  effect,
  inject,
  viewChild,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Theme } from '../../services/theme';

const FONT =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

interface GraphNode {
  id: string;
  label: string;
  /** Normalized 0–1 position within the canvas. */
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
}

/** Deliberate topology — not scattered particles. Center kept clear for the name. */
const DESKTOP_NODES: GraphNode[] = [
  { id: 'angular', label: 'Angular', x: 0.22, y: 0.18 },
  { id: 'nestjs', label: 'NestJS', x: 0.12, y: 0.42 },
  { id: 'postgres', label: 'Postgres', x: 0.18, y: 0.72 },
  { id: 'redis', label: 'Redis', x: 0.38, y: 0.82 },
  { id: 'ws', label: 'WebSocket', x: 0.78, y: 0.28 },
  { id: 'docker', label: 'Docker', x: 0.88, y: 0.48 },
  { id: 'aws', label: 'AWS', x: 0.82, y: 0.74 },
  { id: 'express', label: 'Express', x: 0.62, y: 0.16 },
];

const DESKTOP_EDGES: GraphEdge[] = [
  { from: 'angular', to: 'nestjs' },
  { from: 'nestjs', to: 'postgres' },
  { from: 'nestjs', to: 'redis' },
  { from: 'nestjs', to: 'ws' },
  { from: 'redis', to: 'ws' },
  { from: 'nestjs', to: 'docker' },
  { from: 'docker', to: 'aws' },
  { from: 'express', to: 'nestjs' },
  { from: 'express', to: 'ws' },
];

const MOBILE_NODES: GraphNode[] = [
  { id: 'angular', label: 'Angular', x: 0.18, y: 0.2 },
  { id: 'nestjs', label: 'NestJS', x: 0.14, y: 0.48 },
  { id: 'postgres', label: 'Postgres', x: 0.28, y: 0.78 },
  { id: 'redis', label: 'Redis', x: 0.72, y: 0.78 },
  { id: 'ws', label: 'WebSocket', x: 0.82, y: 0.42 },
  { id: 'docker', label: 'Docker', x: 0.78, y: 0.18 },
];

const MOBILE_EDGES: GraphEdge[] = [
  { from: 'angular', to: 'nestjs' },
  { from: 'nestjs', to: 'postgres' },
  { from: 'nestjs', to: 'redis' },
  { from: 'nestjs', to: 'ws' },
  { from: 'redis', to: 'ws' },
  { from: 'docker', to: 'nestjs' },
];

/** Cap redraws — ambient graph does not need 60fps. */
const FRAME_MS = 1000 / 24;
const PULSE_DURATION_MS = 1400;
const PULSE_GAP_MS = 900;

@Component({
  selector: 'app-hero-boot-visual',
  template: `
    <canvas #canvas class="graph-canvas" aria-hidden="true"></canvas>
  `,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        z-index: 0;
      }

      .graph-canvas {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class HeroBootVisual implements OnDestroy {
  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly theme = inject(Theme);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private ctx: CanvasRenderingContext2D | null = null;
  private rafId = 0;
  private resizeObserver: ResizeObserver | null = null;
  private reducedMotion = false;
  private isMobile = false;

  private nodes: GraphNode[] = DESKTOP_NODES;
  private edges: GraphEdge[] = DESKTOP_EDGES;
  private nodeMap = new Map<string, GraphNode>();

  private width = 0;
  private height = 0;
  private dpr = 1;

  private colorPrimary = '#ffffff';
  private colorText = '#a3a3a3';

  private running = false;
  private lastTs = 0;
  private accum = 0;
  private time = 0;

  /** Active pub/sub pulse along an edge (null when idle / reduced motion). */
  private pulse: { edgeIndex: number; t0: number } | null = null;
  private nextPulseAt = 0;

  private readonly onVisibility = () => {
    if (document.hidden) {
      this.pause();
    } else if (!this.reducedMotion) {
      this.resume();
    } else {
      this.paint(0);
    }
  };

  constructor() {
    effect(() => {
      this.theme.currentTheme();
      if (!this.isBrowser || !this.ctx) return;
      this.resolveThemeColors();
      this.paint(0);
    });

    afterNextRender(() => {
      if (!this.isBrowser) return;

      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.updateGraph();

      const canvas = this.canvasRef()?.nativeElement;
      if (!canvas) return;

      this.ctx = canvas.getContext('2d');
      if (!this.ctx) return;

      this.ngZone.runOutsideAngular(() => {
        this.resolveThemeColors();
        this.resize();
        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(canvas.parentElement ?? canvas);
        document.addEventListener('visibilitychange', this.onVisibility);

        if (this.reducedMotion) {
          this.paint(0);
          return;
        }

        this.nextPulseAt = PULSE_GAP_MS;
        this.start();
      });
    });
  }

  ngOnDestroy(): void {
    this.pause();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (this.isBrowser) {
      document.removeEventListener('visibilitychange', this.onVisibility);
    }
  }

  private resolveThemeColors(): void {
    const styles = getComputedStyle(document.documentElement);
    this.colorPrimary = styles.getPropertyValue('--color-primary').trim() || '#ffffff';
    this.colorText = styles.getPropertyValue('--color-text').trim() || '#ffffff';
  }

  private updateGraph(): void {
    this.isMobile = window.matchMedia('(max-width: 640px)').matches;
    this.nodes = this.isMobile ? MOBILE_NODES : DESKTOP_NODES;
    this.edges = this.isMobile ? MOBILE_EDGES : DESKTOP_EDGES;
    this.nodeMap = new Map(this.nodes.map((n) => [n.id, n]));
  }

  private resize(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas || !this.ctx) return;

    const host = canvas.parentElement ?? canvas;
    const w = host.clientWidth || window.innerWidth;
    const h = host.clientHeight || window.innerHeight;
    if (w === 0 || h === 0) return;

    this.updateGraph();
    this.resolveThemeColors();

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = w;
    this.height = h;

    canvas.width = Math.floor(w * this.dpr);
    canvas.height = Math.floor(h * this.dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.paint(0);
  }

  private start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTs = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  private pause(): void {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  private resume(): void {
    if (this.running || this.reducedMotion) return;
    this.start();
  }

  private readonly tick = (ts: number): void => {
    if (!this.running) return;

    const dt = Math.min(ts - this.lastTs, 64);
    this.lastTs = ts;
    this.accum += dt;
    this.time += dt;

    if (this.accum >= FRAME_MS) {
      this.accum %= FRAME_MS;
      this.updatePulses();
      this.paint(this.time);
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  private updatePulses(): void {
    if (this.pulse) {
      if (this.time - this.pulse.t0 >= PULSE_DURATION_MS) {
        this.pulse = null;
        this.nextPulseAt = this.time + PULSE_GAP_MS;
      }
      return;
    }

    if (this.time >= this.nextPulseAt && this.edges.length > 0) {
      this.pulse = {
        edgeIndex: Math.floor(Math.random() * this.edges.length),
        t0: this.time,
      };
    }
  }

  private paint(_t: number): void {
    const ctx = this.ctx;
    if (!ctx || this.width === 0) return;

    ctx.clearRect(0, 0, this.width, this.height);

    const fontSize = this.isMobile ? 11 : 13;
    const nodeR = this.isMobile ? 4.5 : 5.5;
    // Readable over WebGL — still atmosphere, not competing with the name
    const edgeAlpha = this.isMobile ? 0.55 : 0.65;
    const nodeAlpha = this.isMobile ? 0.75 : 0.85;
    const labelAlpha = this.isMobile ? 0.7 : 0.8;

    ctx.save();
    ctx.font = `500 ${fontSize}px ${FONT}`;
    ctx.textBaseline = 'middle';
    ctx.lineCap = 'round';

    // Soft center clear-out (skip drawing through the name band) — no destination-in wipe
    const clearCx = this.width * 0.5;
    const clearCy = this.height * 0.48;
    const clearRx = this.width * (this.isMobile ? 0.28 : 0.22);
    const clearRy = this.height * (this.isMobile ? 0.16 : 0.18);

    const inNameBand = (x: number, y: number) => {
      const dx = (x - clearCx) / clearRx;
      const dy = (y - clearCy) / clearRy;
      return dx * dx + dy * dy < 1;
    };

    // Edges
    for (let i = 0; i < this.edges.length; i++) {
      const edge = this.edges[i];
      const a = this.nodeMap.get(edge.from);
      const b = this.nodeMap.get(edge.to);
      if (!a || !b) continue;

      const x1 = a.x * this.width;
      const y1 = a.y * this.height;
      const x2 = b.x * this.width;
      const y2 = b.y * this.height;

      // Clip edge through name: draw in two segments if it crosses the clear band
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = this.colorPrimary;
      ctx.lineWidth = this.isMobile ? 1.25 : 1.5;
      ctx.globalAlpha = edgeAlpha * 0.45;
      ctx.stroke();

      // Traveling pub/sub pulse
      if (this.pulse && this.pulse.edgeIndex === i && !this.reducedMotion) {
        const p = Math.min((this.time - this.pulse.t0) / PULSE_DURATION_MS, 1);
        const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        const px = x1 + (x2 - x1) * ease;
        const py = y1 + (y2 - y1) * ease;
        if (!inNameBand(px, py)) {
          const glow = 1 - Math.abs(p - 0.5) * 2;
          ctx.beginPath();
          ctx.arc(px, py, 4 + glow * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = this.colorPrimary;
          ctx.globalAlpha = 0.55 + glow * 0.45;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, 8 + glow * 4, 0, Math.PI * 2);
          ctx.fillStyle = this.colorPrimary;
          ctx.globalAlpha = 0.12 + glow * 0.12;
          ctx.fill();
        }
      }
    }

    // Nodes + labels
    for (const node of this.nodes) {
      const x = node.x * this.width;
      const y = node.y * this.height;
      if (inNameBand(x, y)) continue;

      // Halo so nodes pop over busy WebGL
      ctx.beginPath();
      ctx.arc(x, y, nodeR + 5, 0, Math.PI * 2);
      ctx.fillStyle = this.colorPrimary;
      ctx.globalAlpha = 0.12;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, nodeR, 0, Math.PI * 2);
      ctx.fillStyle = this.colorPrimary;
      ctx.globalAlpha = nodeAlpha;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, nodeR, 0, Math.PI * 2);
      ctx.strokeStyle = this.colorText;
      ctx.lineWidth = 1;
      ctx.globalAlpha = nodeAlpha * 0.5;
      ctx.stroke();

      ctx.globalAlpha = labelAlpha;
      ctx.fillStyle = this.colorText;
      ctx.textAlign = node.x > 0.55 ? 'right' : 'left';
      const labelX = node.x > 0.55 ? x - 12 : x + 12;
      ctx.fillText(node.label, labelX, y);
    }

    ctx.restore();
  }
}
