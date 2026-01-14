import { Component, computed, ElementRef, inject, OnDestroy, PLATFORM_ID, signal, ViewChild } from '@angular/core';

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
  image: string;
}

@Component({
  selector: 'app-projects-grid',
  templateUrl: './projects-grid.html',
  styleUrl: './projects-grid.css'
})
export class ProjectsGrid {
  
  // Touch handling
  private touchStartX = 0;
  private touchEndX = 0;
  currentIndex = signal(0);

  // Computed transform for smooth sliding
  carouselTransform = computed(() => `translateX(-${this.currentIndex() * 100}%)`);

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
      image: 'tagtics.png' // Update with your actual filename
    },
    {
      id: 'career-comeback-coach',
      title: 'Career Comeback Coach',
      subtitle: 'AI-Powered Career Assistant',
      description: 'AI-driven coaching platform using Gemini AI to provide personalized career road maps. Integrated ElevenLabs conversational agents for real-time, voice-interactive mock interviews. Modular Angular interface for streaming AI responses.',
      challenge: 'Real-time Voice Interaction',
      impact: 'Personalized Coaching',
      tech: ['Angular', 'Gemini AI', 'ElevenLabs'],
      github: 'https://github.com/raseenaanwar/hackathon-accelerateInnovation-careerComebackCoach',
      live: 'https://career-comeback-coach.vercel.app/',
      image: 'career-comeback-coach.jpg'
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
      live: 'https://www.apply-log.site/',
      image: 'apply-log.png' 
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
      image: 'eezy-cabs.png' 
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
      image: 'fashion-studio.png' 
    }
  ]);

  // Swipe handlers
  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  onTouchEnd(e: TouchEvent) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextProject();
      } else {
        this.prevProject();
      }
    }
  }

  scrollToProject(index: number) {
    this.currentIndex.set(index);
  }

  nextProject() {
    if (this.currentIndex() < this.projects().length - 1) {
      this.currentIndex.update(i => i + 1);
    }
  }

  prevProject() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
    }
  }
}