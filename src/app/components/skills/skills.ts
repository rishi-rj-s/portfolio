import { CommonModule, NgStyle } from '@angular/common';
import { AfterViewInit, Component, computed, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';

interface Skill {
  category: string;
  items: { name: string; logo: string }[];
}

interface LogoPosition {
  x: number;
  y: number;
  z: number;
  size: number;
  category: string;
}

@Component({
  selector: 'app-skills',
  imports: [
    CommonModule,
    NgStyle
  ],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})
export class Skills implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cloudContainer') cloudContainer!: ElementRef<HTMLDivElement>;

  skills = signal<Skill[]>([
    {
      category: 'Frontend',
      items: [
        { name: 'Angular', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
        { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Vue', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
        { name: 'RxJS', logo: 'https://rxjs.dev/assets/images/logos/Rx_Logo_S.png' },
        { name: 'NgRx', logo: 'https://ngrx.io/assets/images/badge.svg' },
        { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
      ],
    },
    {
      category: 'Backend',
      items: [
        { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'NestJS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg' },
        { name: 'Express', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
        { name: 'GraphQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' },
        { name: 'gRPC', logo: 'https://grpc.io/img/logos/grpc-icon-color.png' },
        { name: 'Kafka', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg' },
      ],
    },
    {
      category: 'Databases',
      items: [
        { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
        { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
        { name: 'Redis', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
        { name: 'Supabase', logo: 'https://supabase.com/dashboard/img/supabase-logo.svg' },
        { name: 'Prisma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg' },
      ],
    },
    {
      category: 'DevOps',
      items: [
        { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
        { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
        { name: 'GitHub Actions', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
        { name: 'AWS EC2', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/amazonwebservices/amazonwebservices-original.svg' },
        { name: 'CI/CD', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg' },
      ],
    },
    {
      category: 'Programming',
      items: [
        { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
        { name: 'SQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'Java', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
        { name: 'C', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
      ],
    },
  ]);

  activeSkill = signal<string | null>(null);
  hoveredSkill = signal<string | null>(null);
  logoPositions: Map<string, LogoPosition> = new Map();

  // Rotation state
  rotX = signal(-15);  // Slight initial tilt for better view
  rotY = signal(0);
  velocityX = signal(0);
  velocityY = signal(0.3);  // Smooth auto-rotation
  isDragging = signal(false);

  // Drag tracking
  private lastMouseX = 0;
  private lastMouseY = 0;
  private lastTime = 0;
  private animationFrameId: any;
  private readonly FRICTION = 0.98;
  private readonly AUTO_SPIN_SPEED = 0.3;
  private readonly DRAG_SENSITIVITY = 0.5;

  ngOnInit() {
    this.calculateSpherePositions();
    this.startAnimationLoop();
  }

  ngAfterViewInit() {
    const container = this.cloudContainer.nativeElement;
    
    // Mouse events
    container.addEventListener('mousedown', this.onPointerDown);
    window.addEventListener('mousemove', this.onPointerMove);
    window.addEventListener('mouseup', this.onPointerUp);
    
    // Touch events
    container.addEventListener('touchstart', this.onPointerDown, { passive: false });
    window.addEventListener('touchmove', this.onPointerMove, { passive: false });
    window.addEventListener('touchend', this.onPointerUp);
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('mouseup', this.onPointerUp);
    window.removeEventListener('touchmove', this.onPointerMove);
    window.removeEventListener('touchend', this.onPointerUp);
    
    if (this.cloudContainer) {
      this.cloudContainer.nativeElement.removeEventListener('mousedown', this.onPointerDown);
      this.cloudContainer.nativeElement.removeEventListener('touchstart', this.onPointerDown);
    }
  }

  private calculateSpherePositions() {
    const allItems: Array<{name: string; logo: string; category: string}> = [];
    
    this.skills().forEach(skill => {
      skill.items.forEach(item => {
        allItems.push({ ...item, category: skill.category });
      });
    });

    const total = allItems.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees
    
    allItems.forEach((item, i) => {
      // Fibonacci sphere distribution for even spacing
      const y = 1 - (i / (total - 1)) * 2;  // y from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      
      const radius = 180;
      const x = Math.cos(theta) * radiusAtY * radius;
      const z = Math.sin(theta) * radiusAtY * radius;
      const yPos = y * radius;
      
      this.logoPositions.set(item.name, {
        x,
        y: yPos,
        z,
        size: 1,
        category: item.category
      });
    });
  }

  private startAnimationLoop = () => {
    // Apply friction to velocities
    if (!this.isDragging()) {
      this.velocityX.update(v => v * this.FRICTION);
      this.velocityY.update(v => {
        const vel = v * this.FRICTION;
        // Restore auto-spin when velocity gets low
        if (Math.abs(vel) < 0.1 && this.activeSkill() === null) {
          return this.AUTO_SPIN_SPEED;
        }
        return vel;
      });
    }

    // Update rotation
    this.rotX.update(x => x + this.velocityX());
    this.rotY.update(y => y + this.velocityY());

    this.animationFrameId = requestAnimationFrame(this.startAnimationLoop);
  }

  private onPointerDown = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    
    this.isDragging.set(true);
    this.velocityX.set(0);
    this.velocityY.set(0);

    const point = this.getPointerPosition(e);
    this.lastMouseX = point.x;
    this.lastMouseY = point.y;
    this.lastTime = performance.now();
  }

  private onPointerMove = (e: MouseEvent | TouchEvent) => {
    if (!this.isDragging()) return;
    
    e.preventDefault();
    
    const point = this.getPointerPosition(e);
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    if (deltaTime > 0) {
      const deltaX = point.x - this.lastMouseX;
      const deltaY = point.y - this.lastMouseY;
      
      // Calculate velocities
      const velY = (deltaX / deltaTime) * this.DRAG_SENSITIVITY;
      const velX = (-deltaY / deltaTime) * this.DRAG_SENSITIVITY;
      
      this.velocityY.set(velY);
      this.velocityX.set(velX);
      
      // Immediate rotation update for responsive feel
      this.rotY.update(y => y + deltaX * 0.3);
      this.rotX.update(x => x - deltaY * 0.3);
    }
    
    this.lastMouseX = point.x;
    this.lastMouseY = point.y;
    this.lastTime = currentTime;
  }

  private onPointerUp = () => {
    this.isDragging.set(false);
  }

  private getPointerPosition(e: MouseEvent | TouchEvent): { x: number; y: number } {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
  }

  filterByCategory(category: string) {
    if (this.activeSkill() === category) {
      this.clearActiveSkill();
      return;
    }
    
    this.activeSkill.set(category);
    
    // Slow down for focus mode, but keep it draggable
    if (Math.abs(this.velocityY()) > 1) {
      this.velocityY.update(v => v * 0.3);
    }
    if (Math.abs(this.velocityX()) > 1) {
      this.velocityX.update(v => v * 0.3);
    }
  }

  clearActiveSkill() {
    this.activeSkill.set(null);
    // Resume auto-spin
    if (Math.abs(this.velocityY()) < 0.5) {
      this.velocityY.set(this.AUTO_SPIN_SPEED);
    }
  }

  getLogoStyle(name: string) {
    const pos = this.logoPositions.get(name);
    if (!pos) return {};

    // Apply current rotation
    const rotXRad = (this.rotX() * Math.PI) / 180;
    const rotYRad = (this.rotY() * Math.PI) / 180;

    // Rotate the position
    let x = pos.x;
    let y = pos.y;
    let z = pos.z;

    // Rotate around Y axis
    const x1 = x * Math.cos(rotYRad) + z * Math.sin(rotYRad);
    const z1 = -x * Math.sin(rotYRad) + z * Math.cos(rotYRad);

    // Rotate around X axis
    const y2 = y * Math.cos(rotXRad) - z1 * Math.sin(rotXRad);
    const z2 = y * Math.sin(rotXRad) + z1 * Math.cos(rotXRad);

    // Perspective projection
    const perspective = 600;
    const scale = perspective / (perspective + z2);
    
    // Calculate opacity based on z-position (front vs back)
    let opacity = (z2 + 200) / 400;
    opacity = Math.max(0.2, Math.min(1, opacity));

    const isActive = this.activeSkill() === pos.category;
    const hasActiveFilter = this.activeSkill() !== null;

    let finalScale = scale * 0.8;
    let finalOpacity = opacity;
    let zIndex = Math.round(z2);

    if (hasActiveFilter) {
      if (isActive) {
        finalScale *= 2;
        finalOpacity = 1;
        zIndex += 1000;
      } else {
        finalScale *= 0.3;
        finalOpacity *= 0.15;
        zIndex -= 1000;
      }
    }

    return {
      transform: `translate(-50%, -50%) translate(${x1}px, ${y2}px) scale(${finalScale})`,
      opacity: finalOpacity,
      zIndex: zIndex,
      filter: isActive && hasActiveFilter 
        ? 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.9)) brightness(1.2)' 
        : z2 > 0 
          ? 'brightness(1.1)' 
          : 'brightness(0.7)',
      pointerEvents: finalOpacity > 0.3 ? 'auto' : 'none'
    };
  }
}
