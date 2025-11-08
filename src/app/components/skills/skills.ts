import { CommonModule } from '@angular/common';
import {  Component, signal } from '@angular/core';

interface Skill {
  category: string;
  description: string;
  items: { name: string; logo: string }[];
  color: string;
}

@Component({
  selector: 'app-skills',
  imports: [
    CommonModule,
  ],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})
export class Skills {
  skills = signal<Skill[]>([
    {
      category: 'Frontend',
      description: 'Modern UI frameworks with component-driven architecture',
      color: '#3b82f6',
      items: [
        { name: 'Vue 3', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
        { name: 'Angular', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
        { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
        { name: 'Tailwind CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
      ],
    },
    {
      category: 'Backend',
      description: 'Scalable APIs with microservices and event-driven architecture',
      color: '#10b981',
      items: [
        { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'NestJS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg' },
        { name: 'Express', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
        { name: 'GraphQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' },
        { name: 'gRPC', logo: 'https://grpc.io/img/logos/grpc-icon-color.png' },
      ],
    },
    {
      category: 'Database',
      description: 'Relational and NoSQL data management solutions',
      color: '#8b5cf6',
      items: [
        { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
        { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
        { name: 'Redis', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
        { name: 'Supabase', logo: 'https://supabase.com/dashboard/img/supabase-logo.svg' },
      ],
    },
    {
      category: 'DevOps',
      description: 'Container orchestration and deployment pipelines',
      color: '#f59e0b',
      items: [
        { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
        { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
        { name: 'GitHub Actions', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
        { name: 'AWS EC2', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/amazonwebservices/amazonwebservices-original.svg' },
      ],
    },
    {
      category: 'State & Messaging',
      description: 'State management and event-driven communication',
      color: '#ec4899',
      items: [
        { name: 'RxJS', logo: 'https://rxjs.dev/assets/images/logos/Rx_Logo_S.png' },
        { name: 'Pinia', logo: 'https://pinia.vuejs.org/logo.svg' },
        { name: 'NgRx', logo: 'https://ngrx.io/assets/images/badge.svg' },
        { name: 'Kafka', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg' },
      ],
    },
    {
      category: 'Tools & ORM',
      description: 'Development tools and database management',
      color: '#06b6d4',
      items: [
        { name: 'Prisma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg' },
        { name: 'TypeORM', logo: 'https://avatars.githubusercontent.com/u/20165699' },
        { name: 'Socket.io', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg' },
        { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
      ],
    },
  ]);
}
