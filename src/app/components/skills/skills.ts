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
        { name: 'Vue 3', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg?width=32' },
        { name: 'Angular', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg?width=32' },
        { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg?width=32' },
        { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg?width=32' },
        { name: 'Tailwind CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg?width=32' },
      ],
    },
    {
      category: 'Backend',
      description: 'Scalable APIs with microservices and event-driven architecture',
      color: '#10b981',
      items: [
        { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg?width=32' },
        { name: 'NestJS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg?width=32' },
        { name: 'Express', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg?width=32' },
        { name: 'GraphQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg?width=32' },
        { name: 'gRPC', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grpc/grpc-plain.svg?width=32' },
      ],
    },
    {
      category: 'Database',
      description: 'Relational and NoSQL data management solutions',
      color: '#8b5cf6',
      items: [
        { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg?width=32' },
        { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg?width=32' },
        { name: 'Redis', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg?width=32' },
        { name: 'Supabase', logo: 'https://supabase.com/dashboard/img/supabase-logo.svg?width=32' },
      ],
    },
    {
      category: 'DevOps',
      description: 'Container orchestration and deployment pipelines',
      color: '#f59e0b',
      items: [
        { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg?width=32' },
        { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg?width=32' },
        { name: 'GitHub Actions', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg?width=32' },
        { name: 'AWS EC2', logo: 'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/amazonwebservices/amazonwebservices-original.svg?width=32' },
      ],
    },
    {
      category: 'State & Messaging',
      description: 'State management and event-driven communication',
      color: '#ec4899',
      items: [
        { name: 'RxJS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rxjs/rxjs-plain.svg?width=32' },
        { name: 'Pinia', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Pinialogo.svg?width=32' },
        { name: 'NgRx', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ngrx/ngrx-plain.svg?width=32' },
        { name: 'Kafka', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg?width=32' },
      ],
    },
    {
      category: 'Tools & ORM',
      description: 'Development tools and database management',
      color: '#06b6d4',
      items: [
        { name: 'Prisma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg?width=32' },
        { name: 'TypeORM', logo: 'https://raw.githubusercontent.com/gilbarbara/logos/de2c1f96ff6e74ea7ea979b43202e8d4b863c655/logos/typeorm.svg?width=32' },
        { name: 'Socket.io', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg?width=32' },
        { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg?width=32' },
      ],
    },
  ]);
}
