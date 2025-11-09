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
  caseStudyRoute: string;
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
      challenge: 'Multi-tenant Architecture',
      impact: 'Customer Satisfaction',
      tech: ['React', 'Supabase', 'PostgreSQL', 'REST APIs'],
      github: 'https://github.com/tagtics/tagtics-frontend',
      live: 'https://www.tagtics.online',
      caseStudyRoute: '/case-study/tagtics',
      featured: true,
      image: ''
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
      caseStudyRoute: '/case-study/apply-log',
      featured: true,
      image: ''
    },
    {
      id: 'eezy-cabs',
      title: 'EEZY-CABS',
      subtitle: 'Taxi Booking Prototype',
      description: 'Modular microservice system with Angular-NestJS integration via gRPC and Kafka. Features real-time driver tracking using WebSockets and Redis pub/sub with event-driven communication.',
      challenge: 'Microservice Architecture',
      impact: 'Inter-service comm.',
      tech: ['Angular', 'NestJS', 'gRPC', 'Kafka', 'Redis', 'WebSockets'],
      github: 'https://github.com/eezy-cabs-rrjs/EC-Backend-MR',
      caseStudyRoute: '/case-study/eezy-cabs',
      featured: false,
      image: ''
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
      caseStudyRoute: '/case-study/fashion-studio',
      featured: false,
      image: ''
    }
  ]);

  ngAfterViewInit() {
    // Only run in browser
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
      this.updateIndicators();
    }
  }

  ngOnDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private setupIntersectionObserver() {
    if (!isPlatformBrowser(this.platformId)) return;
    const options = {
      root: this.carouselRef?.nativeElement,
      threshold: 0.6,
      rootMargin: '0px'
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          this.currentIndex.set(index);
          this.updateIndicators();
        }
      });
    }, options);

    // Observe all carousel items
    const items = this.carouselRef?.nativeElement.querySelectorAll('.carousel-item');
    items?.forEach((item, index) => {
      item.setAttribute('data-index', index.toString());
      this.intersectionObserver?.observe(item);
    });
  }

  scrollToProject(index: number) {
    const carousel = this.carouselRef?.nativeElement;
    const items = carousel?.querySelectorAll('.carousel-item');

    if (items && items[index]) {
      items[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      this.currentIndex.set(index);
      this.updateIndicators();
    }
  }

  private updateIndicators() {
    if (!isPlatformBrowser(this.platformId)) return;
    const indicators = document.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
      if (index === this.currentIndex()) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

}