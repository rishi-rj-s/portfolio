import { Component, signal, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SkillItem {
  name: string;
  logo: string;
  invertDark?: boolean;
}

interface SkillCategory {
  category: string;
  color: string;
  items: SkillItem[];
}

@Component({
  selector: 'app-skills',
  template: `
    <section id="skills" class="relative min-h-screen bg-[var(--color-background)] py-32 px-6 flex flex-col justify-center border-t border-[var(--color-border)]">
      
      <div class="max-w-7xl mx-auto w-full">
         <!-- Header -->
         <div class="mb-24" #header>
            <h2 class="text-6xl md:text-9xl font-black tracking-tighter text-[var(--color-text)] mb-6 leading-[0.8]">
              TECHNICAL<br>
              <span class="text-[var(--color-text-muted)] opacity-50">ARSENAL</span>
            </h2>
         </div>

         <!-- Skills List (Minimal) -->
         <div class="space-y-16" #grid>
            @for (category of skills(); track category.category) {
              <div class="border-t border-[var(--color-border)] pt-8 group cursor-default">
                 
                 <div class="flex flex-col md:flex-row md:items-baseline gap-8 md:gap-24">
                    <!-- Category Name -->
                    <h3 class="text-2xl md:text-3xl font-bold text-[var(--color-text)] tracking-tight w-full md:w-1/4 shrink-0 flex items-center gap-3">
                       <span class="w-2 h-2 rounded-full transition-transform duration-500 group-hover:scale-150" [style.backgroundColor]="category.color"></span>
                       {{category.category}}
                    </h3>

                    <!-- Skills Items -->
                    <div class="flex flex-wrap gap-x-6 gap-y-4">
                       @for (item of category.items; track item.name) {
                         <div class="flex items-center gap-3 group/item">
                            <div class="w-10 h-10 md:w-12 md:h-12 bg-[var(--color-card)] rounded-full flex items-center justify-center border border-[var(--color-border)] group-hover/item:border-[var(--color-primary)] transition-all duration-300 group-hover/item:scale-110">
                               <img [src]="item.logo" [alt]="item.name" [class.theme-inverse]="item.invertDark" class="w-5 h-5 md:w-6 md:h-6 object-contain opacity-70 group-hover/item:opacity-100 transition-opacity">
                            </div>
                            <span class="text-base md:text-lg font-medium text-[var(--color-text-secondary)] group-hover/item:text-[var(--color-text)] transition-colors">{{item.name}}</span>
                         </div>
                       }
                    </div>
                 </div>

              </div>
            }
         </div>

      </div>
    </section>
  `
})
export class Skills implements AfterViewInit {
  @ViewChild('header') header!: ElementRef;
  @ViewChild('grid') grid!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  skills = signal<SkillCategory[]>([
    {
      category: 'Frontend Engineering',
      color: '#3b82f6',
      items: [
        { name: 'Angular v20', logo: 'assets/icons/angular.svg' },
        { name: 'Vue 3', logo: 'assets/icons/vue-3.svg' },
        { name: 'React', logo: 'assets/icons/react.svg' },
        { name: 'Tailwind CSS', logo: 'assets/icons/tailwind-css.svg' },
        { name: 'Vite', logo: 'assets/icons/vite.svg' },
        { name: 'GSAP', logo: 'assets/icons/gsap.svg' }
      ],
    },
    {
      category: 'Backend & Architecture',
      color: '#10b981',
      items: [
        { name: 'Node.js', logo: 'assets/icons/node-js.svg' },
        { name: 'NestJS', logo: 'assets/icons/nestjs.svg' },
        { name: 'Microservices', logo: 'assets/icons/express.svg', invertDark: true },
        { name: 'GraphQL', logo: 'assets/icons/graphql.svg' },
      ],
    },
    {
      category: 'Realtime Systems',
      color: '#ef4444',
      items: [
        { name: 'Apache Kafka', logo: 'assets/icons/kafka.svg', invertDark: true },
        { name: 'Socket.io', logo: 'assets/icons/socket-io.svg', invertDark: true },
        { name: 'Redis Pub/Sub', logo: 'assets/icons/redis-pub-sub.svg' },
      ],
    },
    {
      category: 'Database Engine',
      color: '#8b5cf6',
      items: [
        { name: 'PostgreSQL', logo: 'assets/icons/postgresql.svg' },
        { name: 'MongoDB', logo: 'assets/icons/mongodb.svg' },
        { name: 'Redis', logo: 'assets/icons/redis.svg' },
        { name: 'Supabase', logo: 'assets/icons/supabase.svg' },
      ],
    },
    {
      category: 'DevOps & Cloud',
      color: '#f59e0b',
      items: [
        { name: 'Docker', logo: 'assets/icons/docker.svg' },
        { name: 'Kubernetes', logo: 'assets/icons/kubernetes.svg' },
        { name: 'AWS (EC2/S3)', logo: 'assets/icons/aws-ec2-s3.svg', invertDark: true },
        { name: 'CI/CD Pipelines', logo: 'assets/icons/github-actions.svg', invertDark: true },
      ],
    },
  ]);

  // Animations removed for instant rendering
  ngAfterViewInit() {}
}
