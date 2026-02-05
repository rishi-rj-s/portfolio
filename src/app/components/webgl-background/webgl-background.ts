import { Component, ElementRef, OnDestroy, PLATFORM_ID, effect, afterNextRender, viewChild, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { Theme } from '../../services/theme';

@Component({
  selector: 'app-webgl-background',
  template: `
    <div #canvasContainer class="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000 bg-[var(--color-background)] opacity-0">
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
  private particles!: THREE.InstancedMesh | THREE.Points;
  private material!: THREE.MeshBasicMaterial | THREE.PointsMaterial;
  private animationFrameId: number | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private scrollY = 0;
  private targetScrollY = 0;
  
  opacity = 0; // Fade in effect
  
  private platformId = inject(PLATFORM_ID);
  private theme = inject(Theme);
  
  isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    // Theme reaction effect
    effect(() => {
      const currentTheme = this.theme.currentTheme();
      if (this.isBrowser && this.material) {
        this.updateParticleColor(currentTheme);
      }
    });

    // Angular v20 / SSR Standard: Use afterNextRender for browser-only initialization
    afterNextRender(() => {
      this.initThree();
      
      // Manually set opacity to bypass Angular change detection (fixes NG0100)
      const container = this.canvasContainer()?.nativeElement;
      if (container) {
          // Small delay to ensure fade-in transition works
          setTimeout(() => {
             // Remove opacity-0 class to fade in using CSS transition
             container.classList.remove('opacity-0');
             console.log('WebGL Background Fade-in Triggered');
          }, 100);
      } else {
        console.error('WebGL Container not found for fade-in');
      }
      
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('scroll', this.onScroll, { passive: true });
    });
  }

  // Removed ngOnInit as initialization is handled in constructor via afterNextRender

  ngOnDestroy() {
    if (this.isBrowser) {
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onWindowResize);
      
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
      }
      
      // Dipose Three.js resources
      if (this.renderer) {
        this.renderer.dispose();
      }
      if (this.material) {
        this.material.dispose();
      }
      if (this.particles) {
        this.particles.geometry.dispose();
      }
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
    // Increase view distance for bigger depth feel
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.z = 40;

    // RENDERER
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false // optimization: disable AA for background items usually fine
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // GEOMETRY - Instanced Mesh (Optimized)
    // Use an Icosahedron for a "techy/3D" look
    const geometry = new THREE.IcosahedronGeometry(0.8, 0);
    
    // MATERIAL
    this.material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true, // Cool wireframe effect
      transparent: true,
      opacity: 0.1
    });

    // INSTANCED MESH
    // Scale count based on screen width approx
    const count = window.innerWidth < 768 ? 80 : 200; // More particles for density
    
    // @ts-ignore - Typescript might complain about InstancedMesh generics in some versions
    const mesh = new THREE.InstancedMesh(geometry, this.material, count);
    this.particles = mesh as any; // Store as 'particles' property relative to class for animation access

    // Initialize positions
    const dummy = new THREE.Object3D();
    
    // Store extra data like velocity/randomness
    const userData: any[] = [];

    // Grid-based distribution for even spacing
    // Calculate grid dimensions to spread particles evenly
    const cols = Math.ceil(Math.sqrt(count * 2)); // More columns than rows for wider screens
    const rows = Math.ceil(count / cols);
    
    // Spread dimensions - much wider and taller for full page coverage
    const spreadX = 200; // Full width coverage
    const spreadY = 400; // Very tall to cover scroll depth (multiple sections)
    const spreadZ = 100; // Good depth for 3D feel
    
    for (let i = 0; i < count; i++) {
        // Grid position with random offset for organic feel
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        // Base grid position (centered)
        const baseX = (col / (cols - 1) - 0.5) * spreadX;
        const baseY = (row / (rows - 1) - 0.5) * spreadY;
        
        // Add randomness to break up the grid pattern
        const randomOffsetX = (Math.random() - 0.5) * (spreadX / cols) * 1.5;
        const randomOffsetY = (Math.random() - 0.5) * (spreadY / rows) * 1.5;
        const randomZ = (Math.random() - 0.5) * spreadZ;
        
        dummy.position.set(
          baseX + randomOffsetX,
          baseY + randomOffsetY,
          randomZ
        );
        
        dummy.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        const scale = 0.8 + Math.random() * 2; // Slightly smaller base, more variation
        dummy.scale.set(scale, scale, scale);
        
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        
        userData.push({
            rotationSpeed: (Math.random() - 0.5) * 0.01, // Slower base rotation
            floatSpeed: (Math.random() - 0.5) * 0.01,
            pos: dummy.position.clone(),
            initialScale: scale,
            parallaxFactor: Math.random() * 0.5 + 0.5 // Varied scroll speed per particle
        });
    }
    
    mesh.userData = { items: userData };
    this.scene.add(mesh);

    // Initial color set
    console.log('[WebGL] Initializing with theme:', this.theme.currentTheme());
    this.updateParticleColor(this.theme.currentTheme());

    // Listeners
    window.addEventListener('resize', this.onWindowResize);
    
    // Start loop
    console.log('[WebGL] Starting animation loop');
    this.animate();
  }

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    // Smooth scroll interpolation
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.05;

    // Type casting for our InstancedMesh convenience
    const mesh = this.particles as unknown as THREE.InstancedMesh;
    
    if (mesh && mesh.userData['items']) {
        const time = Date.now() * 0.0005; // Slower time base
        const dummy = new THREE.Object3D();
        const items = mesh.userData['items'] as any[];

        // Interaction target
        const targetX = this.mouseX * 0.05;
        const targetY = this.mouseY * 0.05;

        // Global rotation based on scroll - twist the whole cloud
        mesh.rotation.y = this.scrollY * 0.0005 + time * 0.1;

        // Camera Parallax
        // Move camera down as we scroll, but slower than content (classic parallax)
        this.camera.position.y = -this.scrollY * 0.02;
        
        // Slight camera sway
        this.camera.position.x += (Math.sin(time) * 0.02 - this.camera.position.x) * 0.05;

        for (let i = 0; i < mesh.count; i++) {
            const data = items[i];
            
            dummy.position.copy(data.pos);
            
            // Individual float
            dummy.position.y += Math.sin(time + data.pos.x * 0.5) * 2; 

            // Mouse interaction
            dummy.position.x += (targetX - dummy.position.x) * 0.02 * data.initialScale;
            dummy.position.y += (-targetY - dummy.position.y) * 0.02 * data.initialScale;
            
            // Rotation
            dummy.rotation.x += data.rotationSpeed;
            dummy.rotation.y += data.rotationSpeed;
            
            dummy.scale.setScalar(data.initialScale);
            
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }
        
        mesh.instanceMatrix.needsUpdate = true;
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
    this.mouseX = event.clientX - window.innerWidth / 2;
    this.mouseY = event.clientY - window.innerHeight / 2;
  };
  
  private onScroll = () => {
    this.targetScrollY = window.scrollY;
  };

  private updateParticleColor(theme: string) {
    if (!this.material) return;

    let colorHex = 0x000000;

    // Define colors for each theme
    switch (theme) {
      case 'dark':
        colorHex = 0xffffff;
        break;
      case 'ocean':
        colorHex = 0x38bdf8; // Sky blue
        break;
      case 'sunset':
        colorHex = 0xfb7185; // Rose
        break;
      case 'cyberpunk':
        colorHex = 0xd946ef; // Fuchsia
        break;
      case 'forest':
        colorHex = 0x34d399; // Green
        break;
      case 'light':
      default:
        colorHex = 0x000000;
        break;
    }

    console.log(`[WebGL] Updating Color for theme '${theme}' -> Hex:`, colorHex.toString(16));

    // Smooth transition of color
    const color = new THREE.Color(colorHex);
    // Directly setting for now, could tween using GSAP if smoother transition needed
    this.material.color.set(color);
    
    // Adjust opacity based on theme for visibility
    if (this.material instanceof THREE.MeshBasicMaterial) {
        if (theme === 'light') {
           this.material.opacity = 0.4; // Stronger wireframe on white
           this.material.color.setHex(0x000000); // Ensure black
           // Standard blending for dark lines on white
           this.material.blending = THREE.NormalBlending; 
        } else {
           this.material.opacity = 0.3; // Visible wireframe on dark
           this.material.blending = THREE.AdditiveBlending;
        }
        console.log(`[WebGL] Material Opacity set to:`, this.material.opacity);
    }
  }
}
