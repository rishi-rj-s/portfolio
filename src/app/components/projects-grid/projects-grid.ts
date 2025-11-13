import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, PLATFORM_ID, signal, ViewChild } from '@angular/core';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  challenge: string;
  impact: string;
  tech: string[];
  github?: string;
  live?: string;
  featured: boolean;
  image: string;
}

@Component({
  selector: 'app-projects-grid',
  imports: [
    CommonModule,
  ],
  templateUrl: './projects-grid.html',
  styleUrl: './projects-grid.css'
})
export class ProjectsGrid implements AfterViewInit, OnDestroy {
  @ViewChild('projectsCarousel') carouselRef?: ElementRef<HTMLDivElement>;

  private intersectionObserver?: IntersectionObserver;
  private platformId = inject(PLATFORM_ID);
  currentIndex = signal(0);

  projects = signal<Project[]>([
    {
      id: 'tagtics',
      title: 'Tagtics',
      subtitle: 'SaaS Feedback Platform',
      description: 'Early-access prototype for in-context user feedback with authentication and workspace setup. Implements throttled REST endpoints and analytics schema for multi-tenant environments.',
      challenge: 'Multitenancy',
      impact: 'Insights',
      tech: ['React', 'Supabase', 'PostgreSQL', 'REST APIs'],
      github: 'https://github.com/tagtics/tagtics-frontend',
      live: 'https://www.tagtics.online',
      featured: true,
      image: 'tagtics.png' // Update with your actual filename
    },
    {
      id: 'apply-log',
      title: 'Apply Log',
      subtitle: 'Job Application Tracker',
      description: 'Lightweight job-tracking app built with Vue 3 Composition API and Pinia state management. Features Supabase backend with Row-Level Security for secure data isolation and export options for PDF, CSV, and Excel.',
      challenge: 'State Management',
      impact: 'Data Security',
      tech: ['Vue 3', 'Pinia', 'Supabase', 'PostgreSQL', 'RLS'],
      github: 'https://github.com/rishi-rj-s/job-tracker-frontend',
      live: 'https://apply-log-henna.vercel.app/',
      featured: true,
      image: 'apply-log.png' // Update with your actual filename
    },
    {
      id: 'eezy-cabs',
      title: 'EEZY-CABS',
      subtitle: 'Taxi Booking Prototype',
      description: 'Modular microservice system with Angular-NestJS integration via gRPC and Kafka. Features real-time driver tracking using WebSockets and Redis pub/sub with event-driven communication.',
      challenge: 'Orchestration',
      impact: 'Latency',
      tech: ['Angular', 'NestJS', 'gRPC', 'Kafka', 'Redis', 'WebSockets'],
      github: 'https://github.com/eezy-cabs-rrjs/EC-Backend-MR',
      featured: false,
      image: 'eezy-cabs.png' // Update with your actual filename
    },
    {
      id: 'fashion-studio',
      title: 'Fashion Studio',
      subtitle: 'E-Commerce Platform',
      description: 'Full-stack e-commerce application with cart, checkout, and Razorpay payment integration. Deployed on AWS EC2 with Google OAuth authentication and role-based access control.',
      challenge: 'Payment Integration',
      impact: 'Role-Based Access',
      tech: ['Node.js', 'Express', 'MongoDB', 'AWS EC2', 'OAuth'],
      github: 'https://github.com/rishi-rj-s/RSBackend',
      featured: false,
      image: 'fashion-studio.png' // Update with your actual filename
    }
  ]);

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        this.setupIntersectionObserver();
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private setupIntersectionObserver() {
    if (!isPlatformBrowser(this.platformId) || !this.carouselRef) return;

    const carousel = this.carouselRef.nativeElement;
    const items = carousel.querySelectorAll('.carousel-item');

    if (!items || items.length === 0) {
      console.warn('No carousel items found');
      return;
    }

    // IntersectionObserver to track which item is in view
    const options: IntersectionObserverInit = {
      root: carousel,
      threshold: 0.15,
      rootMargin: '0px'
    };

    let ticking = false;

    this.intersectionObserver = new IntersectionObserver((entries) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const index = Array.from(items).indexOf(entry.target);
              this.currentIndex.set(index);
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, options);

    // Observe all items
    items.forEach(item => {
      this.intersectionObserver?.observe(item);
    });
  }

  scrollToProject(index: number) {
    if (!isPlatformBrowser(this.platformId) || !this.carouselRef) return;

    const carousel = this.carouselRef.nativeElement;
    const items = carousel.querySelectorAll('.carousel-item');

    if (items && items[index]) {
      items[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      this.currentIndex.set(index);
    }
  }
}