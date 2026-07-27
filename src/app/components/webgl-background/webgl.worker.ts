/// <reference lib="webworker" />

import { 
  Scene, 
  PerspectiveCamera, 
  WebGLRenderer, 
} from 'three';
import type { WebGLEffect } from './effects';

let renderer: WebGLRenderer;
let scene: Scene;
let camera: PerspectiveCamera;
let currentEffect: WebGLEffect | null = null;
let currentTheme: string = 'light';

let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

let width = 0;
let height = 0;

// Performance: Target 30 FPS on desktop, 24 FPS on mobile to save GPU resources
let targetFps = 30;
let frameInterval = 1000 / targetFps;
let lastFrameTime = 0;

addEventListener('message', async ({ data }) => {
  switch (data.type) {
    case 'init':
      await init(data.canvas, data.width, data.height, data.pixelRatio, data.theme, data.style);
      break;
    case 'resize':
      resize(data.width, data.height);
      break;
    case 'theme':
      updateTheme(data.theme);
      break;
    case 'style':
      await switchEffect(data.style);
      break;
    case 'mouse':
      targetMouseX = data.x;
      targetMouseY = data.y;
      break;
  }
});

async function init(
  canvas: OffscreenCanvas, 
  w: number, 
  h: number, 
  pixelRatio: number, 
  theme: string, 
  style: string
) {
  width = w;
  height = h;
  currentTheme = theme;

  // On mobile screens (<768px), cap at 24 FPS and 1.0 DPR for lightweight rendering
  const isMobile = width < 768;
  targetFps = isMobile ? 24 : 30;
  frameInterval = 1000 / targetFps;

  scene = new Scene();
  camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 50;

  // Performance: Cap pixel ratio strictly to 1.0 on mobile, 1.25 on desktop
  const effectivePixelRatio = isMobile ? Math.min(pixelRatio, 1.0) : Math.min(pixelRatio, 1.25);

  renderer = new WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: false, // Performance: Disable antialiasing — saves significant GPU fill-rate
    powerPreference: 'low-power', // Save GPU power on mobile/laptop
    context: canvas.getContext('webgl2') as WebGL2RenderingContext
  });
  
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(effectivePixelRatio);

  await loadEffect(style);
  animate();
  
  // Signal main thread that WebGL is ready
  self.postMessage({ type: 'ready' });
}

function resize(w: number, h: number) {
  width = w;
  height = h;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function updateTheme(theme: string) {
  currentTheme = theme;
  if (currentEffect) {
    currentEffect.updateColors(theme);
  }
}

async function switchEffect(style: string) {
  if (currentEffect) {
    currentEffect.dispose();
    scene.clear();
  }
  await loadEffect(style);
}

async function loadEffect(style: string) {
  if (style === 'none') {
    currentEffect = null;
    return;
  }

  // Dynamic import in worker
  const effects = await import('./effects');

  switch (style) {
    case 'aurora':
      currentEffect = new effects.AuroraEffect();
      break;
    case 'crystal':
      currentEffect = new effects.CrystalEffect();
      break;
    case 'waves':
      currentEffect = new effects.WavesEffect();
      break;
    case 'blobs':
      currentEffect = new effects.BlobsEffect();
      break;
    case 'terrain':
      currentEffect = new effects.TerrainEffect();
      break;
    case 'galaxy':
      currentEffect = new effects.GalaxyEffect();
      break;
    default:
      currentEffect = new effects.AuroraEffect();
  }

  if (currentEffect) {
    currentEffect.init(scene, camera, renderer);
    currentEffect.updateColors(currentTheme);
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Performance: Frame-rate limiter — skip frames to stay at targetFps
  const now = self.performance.now();
  const elapsed = now - lastFrameTime;
  if (elapsed < frameInterval) return;
  lastFrameTime = now - (elapsed % frameInterval);

  // Smooth interpolation
  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;

  const time = now * 0.001;

  if (currentEffect) {
    currentEffect.animate(time, mouseX, mouseY);
  }

  renderer.render(scene, camera);
}
