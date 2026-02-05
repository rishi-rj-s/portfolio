import { Component, ElementRef, OnDestroy, PLATFORM_ID, effect, afterNextRender, viewChild, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { Theme } from '../../services/theme';
import { Background, BackgroundStyle } from '../../services/background';
import { 
  WebGLEffect, 
  AuroraEffect, 
  CrystalEffect, 
  WavesEffect, 
  BlobsEffect, 
  TerrainEffect, 
  GalaxyEffect 
} from './effects';

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

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationFrameId: number | null = null;
  
  private currentEffect: WebGLEffect | null = null;
  private currentBackgroundStyle: BackgroundStyle = 'aurora';
  
  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;
  private scrollY = 0;
  private targetScrollY = 0;
  
  private platformId = inject(PLATFORM_ID);
  private theme = inject(Theme);
  private background = inject(Background);
  
  isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    // Theme reaction effect
    effect(() => {
      const currentTheme = this.theme.currentTheme();
      if (this.isBrowser && this.currentEffect) {
        this.currentEffect.updateColors(currentTheme);
      }
    });

    // Background style reaction effect
    effect(() => {
      const newStyle = this.background.currentBackground();
      if (this.isBrowser && this.renderer && newStyle !== this.currentBackgroundStyle) {
        this.switchEffect(newStyle);
      }
    });

    // Angular v20 / SSR Standard: Use afterNextRender for browser-only initialization
    afterNextRender(() => {
      this.initThree();
      
      const container = this.canvasContainer()?.nativeElement;
      if (container) {
          setTimeout(() => {
             container.classList.remove('opacity-0');
          }, 100);
      }
      
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('scroll', this.onScroll, { passive: true });
    });
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onWindowResize);
      
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
      }
      
      this.currentEffect?.dispose();
      this.renderer?.dispose();
    }
  }

  private initThree() {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // SCENE
    this.scene = new THREE.Scene();
    
    // CAMERA
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 50;

    // RENDERER - optimized settings
    const isMobile = window.innerWidth < 768;
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !isMobile, // Disable antialias on mobile for performance
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap at 1.5

    // Load initial effect
    this.currentBackgroundStyle = this.background.currentBackground();
    this.loadEffect(this.currentBackgroundStyle);

    // Listeners
    window.addEventListener('resize', this.onWindowResize);
    
    // Start loop
    this.animate();
  }

  private loadEffect(style: BackgroundStyle) {
    if (style === 'none') {
      this.currentEffect = null;
      return;
    }

    switch (style) {
      case 'aurora':
        this.currentEffect = new AuroraEffect();
        break;
      case 'crystal':
        this.currentEffect = new CrystalEffect();
        break;
      case 'waves':
        this.currentEffect = new WavesEffect();
        break;
      case 'blobs':
        this.currentEffect = new BlobsEffect();
        break;
      case 'terrain':
        this.currentEffect = new TerrainEffect();
        break;
      case 'galaxy':
        this.currentEffect = new GalaxyEffect();
        break;
      default:
        this.currentEffect = new AuroraEffect();
    }

    this.currentEffect.init(this.scene, this.camera, this.renderer);
    this.currentEffect.updateColors(this.theme.currentTheme());
  }

  private switchEffect(newStyle: BackgroundStyle) {
    // Dispose current effect
    if (this.currentEffect) {
      this.currentEffect.dispose();
      // Clear scene
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }
    }

    this.currentBackgroundStyle = newStyle;
    this.loadEffect(newStyle);
  }

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    // Smooth interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.05;
    
    const time = Date.now() * 0.001;
    
    if (this.currentEffect) {
      this.currentEffect.animate(time, this.mouseX, this.mouseY, this.scrollY);
    }

    this.renderer.render(this.scene, this.camera);
  };

  private onWindowResize = () => {
    if (!this.camera || !this.renderer) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private onMouseMove = (event: MouseEvent) => {
    this.targetMouseX = event.clientX - window.innerWidth / 2;
    this.targetMouseY = event.clientY - window.innerHeight / 2;
  };
  
  private onScroll = () => {
    this.targetScrollY = window.scrollY;
  };
}
