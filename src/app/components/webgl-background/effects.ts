import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Points,
  PointsMaterial,
  BufferGeometry,
  BufferAttribute,
  AdditiveBlending,
  Group,
  PointLight,
  AmbientLight,
  Light,
  OctahedronGeometry,
  TetrahedronGeometry,
  IcosahedronGeometry,
  MeshPhysicalMaterial,
  Mesh,
  Line,
  LineBasicMaterial,
  Vector3,
  ShaderMaterial,
  Color,
  PlaneGeometry,
  DoubleSide
} from 'three';

// Base interface for all effects
export interface WebGLEffect {
  init(scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer): void;
  animate(time: number, mouseX: number, mouseY: number, scrollY: number): void;
  updateColors(theme: string): void;
  dispose(): void;
}

// ============================================
// AURORA EFFECT - Shader-based light curtains
// ============================================
export class AuroraEffect implements WebGLEffect {
  private meshes: Mesh[] = [];
  private materials: ShaderMaterial[] = [];
  private geometry!: PlaneGeometry;

  init(scene: Scene, _camera: PerspectiveCamera, _renderer: WebGLRenderer) {
    // Wide, high-resolution planes for the curtain layers
    // Performance: Reduced from 64×32 → 32×16 segments (75% fewer vertices)
    this.geometry = new PlaneGeometry(300, 150, 32, 16);

    const layerCount = 3;

    for (let i = 0; i < layerCount; i++) {
      const material = new ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new Color(0x00ff88) },
          uColor2: { value: new Color(0x0088ff) },
          uIndex: { value: i },
          uAlpha: { value: 0.35 - i * 0.08 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float uTime;
          uniform float uIndex;

          void main() {
            vUv = uv;
            vec3 pos = position;

            // Slow, rolling wave motion
            float time = uTime * 0.15;

            // Layered sine waves for organic curtain undulation
            float wave = sin(pos.x * 0.02 + time + uIndex * 1.5) * 18.0;
            wave += sin(pos.x * 0.04 + time * 1.3 + uIndex * 2.5) * 7.0;
            wave += sin(pos.x * 0.07 + time * 0.8) * 3.0;

            // Z-depth undulation
            pos.z += wave;

            // Vertical ripple
            pos.y += sin(pos.x * 0.025 + time * 0.6) * 6.0;
            pos.y += cos(pos.x * 0.01 + time * 0.3 + uIndex) * 3.0;

            vElevation = wave;

            vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform vec3 uColor2;
          uniform float uAlpha;
          uniform float uTime;
          varying vec2 vUv;
          varying float vElevation;

          void main() {
            // Vertical fade — strong in the middle, fading at top and bottom
            float vertFade = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.55, vUv.y);

            // Horizontal fade at edges
            float horizFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);

            // Vertical streaks — characteristic of real auroras
            float streaks = sin(vUv.x * 90.0 + vElevation * 0.08) * 0.5 + 0.5;
            streaks = pow(streaks, 4.0);

            // Secondary finer streaks
            float fineStreaks = sin(vUv.x * 200.0 + vElevation * 0.15 + uTime * 0.3) * 0.5 + 0.5;
            fineStreaks = pow(fineStreaks, 6.0) * 0.3;

            // Combine streak layers
            float intensity = 0.5 + streaks * 0.35 + fineStreaks;

            // Color gradient — blend two colors based on vertical position
            float colorMix = smoothstep(0.2, 0.8, vUv.y) + sin(vUv.x * 5.0 + uTime * 0.2) * 0.15;
            vec3 color = mix(uColor, uColor2, clamp(colorMix, 0.0, 1.0));

            // Brightness boost near the center band
            float centerGlow = exp(-pow((vUv.y - 0.45) * 3.0, 2.0)) * 0.4;

            float finalAlpha = vertFade * horizFade * uAlpha * intensity + centerGlow * uAlpha * 0.5;

            gl_FragColor = vec4(color, finalAlpha);
          }
        `,
        transparent: true,
        blending: AdditiveBlending,
        side: DoubleSide,
        depthWrite: false
      });

      const mesh = new Mesh(this.geometry, material);

      // Position layers with depth and slight vertical offsets
      mesh.position.z = -50 - (i * 18);
      mesh.position.y = 8 - i * 3;
      // Tilt slightly towards camera for a more dramatic look
      mesh.rotation.x = -0.25;

      scene.add(mesh);
      this.meshes.push(mesh);
      this.materials.push(material);
    }
  }

  animate(time: number, mouseX: number, _mouseY: number, _scrollY: number) {
    this.materials.forEach((mat) => {
      mat.uniforms['uTime'].value = time;
    });

    this.meshes.forEach((mesh, i) => {
      // Gentle constant drift per layer
      mesh.position.x = Math.sin(time * 0.04 + i * 1.2) * 6;
    });
  }

  updateColors(theme: string) {
    const [primary, secondary] = this.getThemeColors(theme);
    const color1 = new Color(primary);
    const color2 = new Color(secondary);

    this.materials.forEach(mat => {
      mat.uniforms['uColor'].value.copy(color1);
      mat.uniforms['uColor2'].value.copy(color2);
    });
  }

  private getThemeColors(theme: string): [number, number] {
    switch (theme) {
      case 'light': return [0x818cf8, 0xc084fc]; // Indigo → Purple
      case 'dark': return [0x00ffaa, 0x0088ff]; // Green → Blue (classic aurora)
      case 'ocean': return [0x22d3ee, 0x3b82f6]; // Cyan → Blue
      case 'sunset': return [0xf472b6, 0xfb923c]; // Pink → Orange
      case 'cyberpunk': return [0xd946ef, 0x06b6d4]; // Magenta → Cyan
      case 'forest': return [0x34d399, 0xa3e635]; // Emerald → Lime
      default: return [0x00ffaa, 0x0088ff];
    }
  }

  dispose() {
    this.geometry?.dispose();
    this.materials.forEach(m => m.dispose());
    this.meshes = [];
    this.materials = [];
  }
}

// ============================================
// CRYSTAL EFFECT - Prismatic rotating structures
// ============================================
export class CrystalEffect implements WebGLEffect {
  private group!: Group;
  private crystals: Mesh[] = [];
  private materials: MeshPhysicalMaterial[] = [];
  private lights: Light[] = [];

  init(scene: Scene) {
    this.group = new Group();
    
    const light1 = new PointLight(0xffffff, 2, 200);
    light1.position.set(40, 40, 40);
    this.group.add(light1);
    this.lights.push(light1);
    
    const light2 = new PointLight(0x8888ff, 1, 200);
    light2.position.set(-40, -40, 20);
    this.group.add(light2);
    this.lights.push(light2);

    const ambientLight = new AmbientLight(0x404040, 1);
    this.group.add(ambientLight);
    this.lights.push(ambientLight);

    const crystalConfigs = [
      { geo: new OctahedronGeometry(10, 0), pos: { x: 0, y: 0, z: -10 } },
      { geo: new TetrahedronGeometry(8, 0), pos: { x: 30, y: 15, z: -20 } },
      { geo: new IcosahedronGeometry(7, 0), pos: { x: -35, y: -12, z: -15 } },
      { geo: new OctahedronGeometry(6, 0), pos: { x: 25, y: -20, z: -5 } },
      { geo: new TetrahedronGeometry(5, 0), pos: { x: -20, y: 22, z: -25 } },
      { geo: new IcosahedronGeometry(4, 0), pos: { x: -45, y: 5, z: -10 } },
      { geo: new OctahedronGeometry(5, 0), pos: { x: 45, y: -5, z: -18 } },
      { geo: new TetrahedronGeometry(7, 0), pos: { x: 10, y: -28, z: -22 } },
    ];

    crystalConfigs.forEach((config) => {
      const material = new MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.9,
        thickness: 2,
        transparent: true,
        opacity: 0.85
      });
      
      const mesh = new Mesh(config.geo, material);
      mesh.position.set(config.pos.x, config.pos.y, config.pos.z);
      mesh.userData['rotSpeed'] = {
        x: (Math.random() - 0.5) * 0.012,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.008
      };
      
      this.crystals.push(mesh);
      this.materials.push(material);
      this.group.add(mesh);
    });

    scene.add(this.group);
  }

  animate(time: number, mouseX: number, mouseY: number, _scrollY: number) {
    // Smooth constant rotation
    this.group.rotation.y = time * 0.03 + mouseX * 0.0001;
    this.group.rotation.x = Math.sin(time * 0.1) * 0.1 + mouseY * 0.00005;

    this.crystals.forEach((crystal) => {
      const speed = crystal.userData['rotSpeed'];
      crystal.rotation.x += speed.x;
      crystal.rotation.y += speed.y;
      crystal.rotation.z += speed.z;
    });
  }

  updateColors(theme: string) {
    const color = this.getThemeColor(theme);
    this.materials.forEach((mat, i) => {
      mat.color.setHex(color);
      mat.emissive.setHex(color);
      mat.emissiveIntensity = 0.1 + i * 0.02;
    });
  }

  private getThemeColor(theme: string): number {
    switch (theme) {
      case 'light': return 0x6366f1;
      case 'dark': return 0xffffff;
      case 'ocean': return 0x38bdf8;
      case 'sunset': return 0xfb7185;
      case 'cyberpunk': return 0xd946ef;
      case 'forest': return 0x34d399;
      default: return 0xffffff;
    }
  }

  dispose() {
    this.crystals.forEach(c => c.geometry.dispose());
    this.materials.forEach(m => m.dispose());
  }
}

// ============================================
// WAVES EFFECT - Flowing curved lines
// ============================================
export class WavesEffect implements WebGLEffect {
  private lines: Line[] = [];
  private materials: LineBasicMaterial[] = [];
  private group!: Group;
  // Performance: Reduced from 20 → 12 lines
  private lineCount = 12;

  init(scene: Scene) {
    this.group = new Group();
    
    for (let l = 0; l < this.lineCount; l++) {
      const points: Vector3[] = [];
      // Performance: Reduced from 50 → 30 segments per line
      const segments = 30;
      
      // Create flowing curve
      const startX = (Math.random() - 0.5) * 120;
      const startY = (Math.random() - 0.5) * 60;
      const startZ = -20 - Math.random() * 30;
      
      for (let s = 0; s < segments; s++) {
        const t = s / segments;
        const x = startX + t * 100 - 50;
        const y = startY + Math.sin(t * Math.PI * 2) * 15;
        const z = startZ + Math.cos(t * Math.PI) * 10;
        points.push(new Vector3(x, y, z));
      }
      
      const geometry = new BufferGeometry().setFromPoints(points);
      const material = new LineBasicMaterial({
        color: 0x4a00e0,
        transparent: true,
        opacity: 0.4,
        blending: AdditiveBlending
      });
      
      const line = new Line(geometry, material);
      line.userData['phase'] = l * 0.5;
      line.userData['speed'] = 0.3 + Math.random() * 0.3;
      line.userData['startY'] = startY;
      
      this.lines.push(line);
      this.materials.push(material);
      this.group.add(line);
    }

    scene.add(this.group);
  }

  animate(time: number, mouseX: number, _mouseY: number, _scrollY: number) {
    this.lines.forEach((line, idx) => {
      const phase = line.userData['phase'];
      const speed = line.userData['speed'];
      const startY = line.userData['startY'];
      
      const posAttr = line.geometry.attributes['position'] as BufferAttribute;
      const segments = posAttr.count;
      
      for (let s = 0; s < segments; s++) {
        const t = s / segments;
        
        // Wave animation
        const waveY = Math.sin(t * Math.PI * 2 + time * speed + phase) * 15;
        const waveZ = Math.cos(t * Math.PI + time * speed * 0.7 + phase) * 8;
        
        posAttr.array[s * 3 + 1] = startY + waveY;
        posAttr.array[s * 3 + 2] = -25 + waveZ;
      }
      posAttr.needsUpdate = true;
      
      // Slow horizontal drift
      line.position.x = Math.sin(time * 0.1 + idx) * 5;
    });
    
    // Subtle mouse influence
    this.group.rotation.y = mouseX * 0.00002;
  }

  updateColors(theme: string) {
    const color = this.getThemeColor(theme);
    this.materials.forEach(mat => mat.color.setHex(color));
  }

  private getThemeColor(theme: string): number {
    switch (theme) {
      case 'light': return 0x6366f1;
      case 'dark': return 0x8e2de2;
      case 'ocean': return 0x0ea5e9;
      case 'sunset': return 0xf43f5e;
      case 'cyberpunk': return 0xd946ef;
      case 'forest': return 0x10b981;
      default: return 0x8e2de2;
    }
  }

  dispose() {
    this.lines.forEach(l => l.geometry.dispose());
    this.materials.forEach(m => m.dispose());
  }
}

// ============================================
// BLOBS EFFECT - Morphing organic shapes
// ============================================
export class BlobsEffect implements WebGLEffect {
  private blobs: Mesh[] = [];
  private materials: ShaderMaterial[] = [];
  private group!: Group;

  init(scene: Scene) {
    this.group = new Group();
    
    // Performance: Reduced from 7 → 4 blobs
    const blobCount = 4;
    
    for (let i = 0; i < blobCount; i++) {
      const size = 5 + Math.random() * 6;
      // Performance: Reduced icosahedron detail from 4 → 3 (significantly fewer triangles)
      const geometry = new IcosahedronGeometry(size, 3);
      
      const material = new ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new Color(0xff0088) },
          uFrequency: { value: 0.4 + Math.random() * 0.3 },
          uAmplitude: { value: 0.3 + Math.random() * 0.3 }
        },
        vertexShader: `
          varying vec3 vNormal;
          uniform float uTime;
          uniform float uFrequency;
          uniform float uAmplitude;
          
          void main() {
            vNormal = normal;
            
            float displacement = sin(position.x * uFrequency + uTime) *
                                 sin(position.y * uFrequency + uTime * 0.8) *
                                 sin(position.z * uFrequency + uTime * 1.2) * uAmplitude;
            
            vec3 newPosition = position + normal * displacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform vec3 uColor;
          
          void main() {
            float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
            vec3 color = uColor * (0.6 + fresnel * 0.4);
            gl_FragColor = vec4(color, 0.5 + fresnel * 0.4);
          }
        `,
        transparent: true,
        blending: AdditiveBlending
      });

      const angle = (i / blobCount) * Math.PI * 2;
      const radius = 20 + Math.random() * 25;
      const mesh = new Mesh(geometry, material);
      mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 40,
        Math.sin(angle) * radius * 0.4 - 20
      );
      mesh.userData['basePos'] = mesh.position.clone();
      mesh.userData['floatSpeed'] = 0.3 + Math.random() * 0.3;
      mesh.userData['floatOffset'] = Math.random() * Math.PI * 2;
      
      this.blobs.push(mesh);
      this.materials.push(material);
      this.group.add(mesh);
    }

    scene.add(this.group);
  }

  animate(time: number, _mouseX: number, _mouseY: number, _scrollY: number) {
    // Simple time-based animation - no scroll effects
    this.materials.forEach(mat => {
      mat.uniforms['uTime'].value = time;
    });

    this.blobs.forEach((blob) => {
      const base = blob.userData['basePos'];
      const speed = blob.userData['floatSpeed'];
      const offset = blob.userData['floatOffset'];
      
      // Gentle floating motion
      blob.position.y = base.y + Math.sin(time * speed + offset) * 4;
      blob.position.x = base.x + Math.cos(time * speed * 0.7 + offset) * 2;
      
      blob.rotation.x += 0.003;
      blob.rotation.y += 0.004;
    });
  }

  updateColors(theme: string) {
    const colors = this.getThemeColors(theme);
    this.materials.forEach((mat, i) => {
      mat.uniforms['uColor'].value.setHex(colors[i % colors.length]);
    });
  }

  private getThemeColors(theme: string): number[] {
    switch (theme) {
      case 'light': return [0x6366f1, 0x8b5cf6, 0xa78bfa, 0xc4b5fd, 0x7c3aed, 0x4f46e5, 0x818cf8];
      case 'dark': return [0xff0088, 0x00ff88, 0x0088ff, 0xff8800, 0x8800ff, 0x00ffff, 0xff00ff];
      case 'ocean': return [0x0ea5e9, 0x06b6d4, 0x14b8a6, 0x0284c7, 0x22d3ee, 0x67e8f9, 0x0891b2];
      case 'sunset': return [0xf43f5e, 0xfb7185, 0xf97316, 0xfacc15, 0xef4444, 0xf87171, 0xfca5a5];
      case 'cyberpunk': return [0xd946ef, 0xa855f7, 0xe879f9, 0xf0abfc, 0xc026d3, 0x9333ea, 0x7c3aed];
      case 'forest': return [0x10b981, 0x34d399, 0x22c55e, 0x4ade80, 0x059669, 0x047857, 0x065f46];
      default: return [0xff0088, 0x00ff88, 0x0088ff, 0xff8800, 0x8800ff, 0x00ffff, 0xff00ff];
    }
  }

  dispose() {
    this.blobs.forEach(b => b.geometry.dispose());
    this.materials.forEach(m => m.dispose());
  }
}

// ============================================
// TERRAIN EFFECT - Wave grid
// ============================================
export class TerrainEffect implements WebGLEffect {
  private points!: Points;
  private material!: PointsMaterial;
  private geometry!: BufferGeometry;
  private basePositions!: Float32Array;
  private count = 0;

  init(scene: Scene) {
    // Performance: Reduced from 50×50 (2500) → 35×35 (1225) points
    const gridSize = 35;
    const spacing = 4.3; // Adjusted spacing to maintain similar visual spread
    this.count = gridSize * gridSize;
    const positions = new Float32Array(this.count * 3);
    this.basePositions = new Float32Array(this.count * 3);

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const idx = (i * gridSize + j) * 3;
        const x = (i - gridSize / 2) * spacing;
        const z = (j - gridSize / 2) * spacing - 30;
        
        positions[idx] = x;
        positions[idx + 1] = 0;
        positions[idx + 2] = z;
        
        this.basePositions[idx] = x;
        this.basePositions[idx + 1] = 0;
        this.basePositions[idx + 2] = z;
      }
    }

    this.geometry = new BufferGeometry();
    this.geometry.setAttribute('position', new BufferAttribute(positions, 3));

    this.material = new PointsMaterial({
      color: 0x4a00e0,
      size: 1.2,
      transparent: true,
      opacity: 0.5,
      blending: AdditiveBlending,
      sizeAttenuation: true
    });

    this.points = new Points(this.geometry, this.material);
    this.points.rotation.x = -0.5;
    this.points.position.y = 0;
    scene.add(this.points);
  }

  animate(time: number, _mouseX: number, _mouseY: number, _scrollY: number) {
    const posAttr = this.geometry.attributes['position'] as BufferAttribute;
    
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      const x = this.basePositions[i3];
      const z = this.basePositions[i3 + 2];
      
      // Smooth wave animation
      const y = Math.sin(x * 0.08 + time) * 5 + Math.cos(z * 0.06 + time * 0.7) * 4;
      posAttr.array[i3 + 1] = y;
    }
    posAttr.needsUpdate = true;
  }

  updateColors(theme: string) {
    this.material.color.setHex(this.getThemeColor(theme));
  }

  private getThemeColor(theme: string): number {
    switch (theme) {
      case 'light': return 0x6366f1;
      case 'dark': return 0x8e2de2;
      case 'ocean': return 0x0ea5e9;
      case 'sunset': return 0xf43f5e;
      case 'cyberpunk': return 0xd946ef;
      case 'forest': return 0x22c55e;
      default: return 0x8e2de2;
    }
  }

  dispose() {
    this.geometry?.dispose();
    this.material?.dispose();
  }
}

// ============================================
// GALAXY EFFECT - Spiraling particles
// ============================================
export class GalaxyEffect implements WebGLEffect {
  private points!: Points;
  private material!: PointsMaterial;
  private geometry!: BufferGeometry;
  private basePositions!: Float32Array;
  private count = 0;

  init(scene: Scene) {
    // Performance: Reduced from 5000 → 2000 particles
    this.count = 2000;
    const positions = new Float32Array(this.count * 3);
    this.basePositions = new Float32Array(this.count * 3);

    const branches = 5;
    const radius = 60;

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      
      const r = Math.pow(Math.random(), 0.5) * radius;
      const branchAngle = (i % branches) / branches * Math.PI * 2;
      const spinAngle = r * 0.15;
      
      const randomX = (Math.random() - 0.5) * r * 0.25;
      const randomY = (Math.random() - 0.5) * 4;
      const randomZ = (Math.random() - 0.5) * r * 0.25;

      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;
      
      this.basePositions[i3] = positions[i3];
      this.basePositions[i3 + 1] = positions[i3 + 1];
      this.basePositions[i3 + 2] = positions[i3 + 2];
    }

    this.geometry = new BufferGeometry();
    this.geometry.setAttribute('position', new BufferAttribute(positions, 3));

    this.material = new PointsMaterial({
      color: 0xff6030,
      size: 0.6,
      transparent: true,
      opacity: 0.5,
      blending: AdditiveBlending,
      sizeAttenuation: true
    });

    this.points = new Points(this.geometry, this.material);
    this.points.rotation.x = 0.8;
    scene.add(this.points);
  }

  animate(time: number, mouseX: number, mouseY: number, _scrollY: number) {
    // Smooth overall rotation
    this.points.rotation.y = time * 0.05;
    this.points.rotation.x = 0.8 + mouseY * 0.00003;
    this.points.rotation.z = mouseX * 0.00002;
    
    // Performance: Pre-compute a small set of sin/cos values instead of per-particle trig
    const positionAttr = this.geometry.attributes['position'] as BufferAttribute;
    
    // Batch particles into distance groups to share trig computation
    const ANGLE_CACHE_SIZE = 32;
    const angleCacheCos = new Float32Array(ANGLE_CACHE_SIZE);
    const angleCacheSin = new Float32Array(ANGLE_CACHE_SIZE);
    for (let g = 0; g < ANGLE_CACHE_SIZE; g++) {
      const dist = g * 2; // approximate distance bucket
      const rotSpeed = 0.08 + (1.0 / (dist * 0.05 + 1)) * 0.1;
      const angle = time * rotSpeed;
      angleCacheCos[g] = Math.cos(angle);
      angleCacheSin[g] = Math.sin(angle);
    }
    
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      const x = this.basePositions[i3];
      const z = this.basePositions[i3 + 2];
      
      // Map distance to a bucket index (avoid per-particle sqrt + trig)
      const distApprox = Math.abs(x) + Math.abs(z); // Manhattan distance is much cheaper
      const bucket = Math.min((distApprox * 0.5) | 0, ANGLE_CACHE_SIZE - 1);
      
      const cos = angleCacheCos[bucket];
      const sin = angleCacheSin[bucket];
      
      positionAttr.array[i3] = x * cos - z * sin;
      positionAttr.array[i3 + 2] = x * sin + z * cos;
    }
    positionAttr.needsUpdate = true;
  }

  updateColors(theme: string) {
    this.material.color.setHex(this.getThemeColor(theme));
  }

  private getThemeColor(theme: string): number {
    switch (theme) {
      case 'light': return 0x6366f1;
      case 'dark': return 0xff6030;
      case 'ocean': return 0x22d3ee;
      case 'sunset': return 0xfb7185;
      case 'cyberpunk': return 0xe879f9;
      case 'forest': return 0x4ade80;
      default: return 0xff6030;
    }
  }

  dispose() {
    this.geometry?.dispose();
    this.material?.dispose();
  }
}
