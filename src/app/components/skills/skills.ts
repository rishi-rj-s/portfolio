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
        { name: 'Angular', logo: 'assets/icons/angular.svg' },
        { name: 'Vue 3', logo: 'assets/icons/vue-3.svg' },
        { name: 'React', logo: 'assets/icons/react.svg' },
        { name: 'Tailwind CSS', logo: 'assets/icons/tailwind-css.svg' },
        { name: 'Vite', logo: 'assets/icons/vite.svg' },
      ],
    },

    // 2️⃣ Backend Frameworks
    {
      category: 'Backend Frameworks',
      description: 'Building scalable REST and GraphQL APIs',
      color: '#10b981',
      items: [
        { name: 'Node.js', logo: 'assets/icons/node-js.svg' },
        { name: 'NestJS', logo: 'assets/icons/nestjs.svg' },
        { name: 'Express', logo: 'assets/icons/express.svg' },
        { name: 'GraphQL', logo: 'assets/icons/graphql.svg' },
        { name: 'gRPC', logo: 'assets/icons/grpc.svg' },
      ],
    },

    // 3️⃣ Messaging & Realtime
    {
      category: 'Messaging & Realtime',
      description: 'Event-driven and realtime communication systems',
      color: '#ef4444',
      items: [
        { name: 'Kafka', logo: 'assets/icons/kafka.svg' },
        { name: 'Socket.io', logo: 'assets/icons/socket-io.svg' },
        { name: 'Redis Pub/Sub', logo: 'assets/icons/redis-pub-sub.svg' },
      ],
    },

    // 4️⃣ Databases
    {
      category: 'Databases',
      description: 'Relational and NoSQL data storage engines',
      color: '#8b5cf6',
      items: [
        { name: 'PostgreSQL', logo: 'assets/icons/postgresql.svg' },
        { name: 'MongoDB', logo: 'assets/icons/mongodb.svg' },
        { name: 'Redis', logo: 'assets/icons/redis.svg' },
        { name: 'Supabase', logo: 'assets/icons/supabase.svg' },
      ],
    },

    // 5️⃣ ORMs & Query Builders
    {
      category: "ORM's & Query Builders",
      description: 'Schema modeling and type-safe database access',
      color: '#a855f7',
      items: [
        { name: 'Prisma', logo: 'assets/icons/prisma.svg' },
        { name: 'TypeORM', logo: 'assets/icons/typeorm.svg' },
      ],
    },

    // 6️⃣ DevOps & Deployment
    {
      category: 'DevOps & Deployment',
      description: 'Container orchestration and CI/CD pipelines',
      color: '#f59e0b',
      items: [
        { name: 'Docker', logo: 'assets/icons/docker.svg' },
        { name: 'Kubernetes', logo: 'assets/icons/kubernetes.svg' },
        { name: 'GitHub Actions', logo: 'assets/icons/github-actions.svg' },
        { name: 'AWS (EC2, S3)', logo: 'assets/icons/aws-ec2-s3.svg' },
      ],
    },

    // 7️⃣ State Management
    {
      category: 'State Management',
      description: 'Frontend and backend state management patterns',
      color: '#ec4899',
      items: [
        { name: 'Pinia', logo: 'assets/icons/pinia.svg' },
        { name: 'NgRx', logo: 'assets/icons/ngrx.svg' },
        { name: 'Redux', logo: 'assets/icons/redux.svg' },
        { name: 'RxJS', logo: 'assets/icons/rxjs.svg' },
      ],
    },

    // 8️⃣ Languages
    {
      category: 'Languages',
      description: 'Programming languages and core development tools',
      color: '#06b6d4',
      items: [
        { name: 'JavaScript', logo: 'assets/icons/javascript.svg' },
        { name: 'TypeScript', logo: 'assets/icons/typescript.svg' },
        { name: 'SQL', logo: 'assets/icons/sql.svg' },
        { name: 'Java', logo: 'assets/icons/java.svg' },
        { name: 'C', logo: 'assets/icons/c.svg' },
      ],
    },

    // 9️⃣ Observability & Monitoring (NEW)
    {
      category: 'Observability & Monitoring',
      description: 'Logging, metrics and dashboards for microservices',
      color: '#22c55e',
      items: [
        { name: 'Prometheus', logo: 'assets/icons/prometheus.svg' },
        { name: 'Grafana', logo: 'assets/icons/grafana.svg' },
        { name: 'Loki', logo: 'assets/icons/loki.png' },
      ],
    },
  ]);
}
