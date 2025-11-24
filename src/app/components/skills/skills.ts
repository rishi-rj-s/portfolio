import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

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
    // 1️⃣ Frontend
    {
      category: 'Frontend',
      description: 'Modern UI frameworks with component-driven architecture',
      color: '#3b82f6',
      items: [
        { name: 'Angular', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg?width=32' },
        { name: 'Vue 3', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg?width=32' },
        { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg?width=32' },
        { name: 'Tailwind CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg?width=32' },
        { name: 'Vite', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg?width=32' },
      ],
    },

    // 2️⃣ Backend Frameworks
    {
      category: 'Backend Frameworks',
      description: 'Building scalable REST and GraphQL APIs',
      color: '#10b981',
      items: [
        { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg?width=32' },
        { name: 'NestJS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg?width=32' },
        { name: 'Express', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg?width=32' },
        { name: 'GraphQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg?width=32' },
        { name: 'gRPC', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grpc/grpc-plain.svg?width=32' },
      ],
    },

    // 3️⃣ Messaging & Realtime
    {
      category: 'Messaging & Realtime',
      description: 'Event-driven and realtime communication systems',
      color: '#ef4444',
      items: [
        { name: 'Kafka', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg?width=32' },
        { name: 'Socket.io', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg?width=32' },
        { name: 'Redis Pub/Sub', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg?width=32' },
      ],
    },

    // 4️⃣ Databases
    {
      category: 'Databases',
      description: 'Relational and NoSQL data storage engines',
      color: '#8b5cf6',
      items: [
        { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg?width=32' },
        { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg?width=32' },
        { name: 'Redis', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg?width=32' },
        { name: 'Supabase', logo: 'https://supabase.com/dashboard/img/supabase-logo.svg?width=32' },
      ],
    },

    // 5️⃣ ORMs & Query Builders
    {
      category: "ORM's & Query Builders",
      description: 'Schema modeling and type-safe database access',
      color: '#a855f7',
      items: [
        { name: 'Prisma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg?width=32' },
        { name: 'TypeORM', logo: 'https://raw.githubusercontent.com/gilbarbara/logos/de2c1f96ff6e74ea7ea979b43202e8d4b863c655/logos/typeorm.svg?width=32' },
      ],
    },

    // 6️⃣ DevOps & Deployment
    {
      category: 'DevOps & Deployment',
      description: 'Container orchestration and CI/CD pipelines',
      color: '#f59e0b',
      items: [
        { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg?width=32' },
        { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg?width=32' },
        { name: 'GitHub Actions', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg?width=32' },
        { name: 'AWS (EC2, S3)', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg?width=32' },],
    },

    // 7️⃣ State Management
    {
      category: 'State Management',
      description: 'Frontend and backend state management patterns',
      color: '#ec4899',
      items: [
        { name: 'Pinia', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Pinialogo.svg?width=32' },
        { name: 'NgRx', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ngrx/ngrx-plain.svg?width=32' },
        { name: 'Redux', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg?width=32' },
        { name: 'RxJS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rxjs/rxjs-plain.svg?width=32' },
      ],
    },

    // 8️⃣ Languages
    {
      category: 'Languages',
      description: 'Programming languages and core development tools',
      color: '#06b6d4',
      items: [
        { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg?width=32' },
        { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg?width=32' },
        { name: 'SQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg?width=32' },
        { name: 'Java', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg?width=32' },
        { name: 'C', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg?width=32' },
      ],
    },

    // 9️⃣ Observability & Monitoring (NEW)
    {
      category: 'Observability & Monitoring',
      description: 'Logging, metrics and dashboards for microservices',
      color: '#22c55e',
      items: [
        { name: 'Prometheus', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg?width=32' },
        { name: 'Grafana', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg?width=32' },
        { name: 'Loki', logo: 'https://raw.githubusercontent.com/grafana/loki/master/docs/sources/logo.png' },
      ],
    },
  ]);
}
