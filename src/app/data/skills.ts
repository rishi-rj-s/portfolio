export interface SkillItem {
  name: string;
  logo: string;
  invertDark?: boolean;
  /** One-line shipped proof — depth over a tech dump */
  proof: string;
}

export interface SkillCategory {
  category: string;
  color: string;
  items: SkillItem[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: 'Backend & Architecture',
    color: '#10b981',
    items: [
      {
        name: 'NestJS',
        logo: 'assets/icons/nestjs.svg',
        proof: 'Enterprise patterns via Ever-Gauzy; Nest-shaped API design for SaaS backends.',
      },
      {
        name: 'Node.js',
        logo: 'assets/icons/node-js.svg',
        proof: 'Production Express services for Fashion Studio on AWS.',
      },
      {
        name: 'Express',
        logo: 'assets/icons/express.svg',
        invertDark: true,
        proof: 'Auth, catalogue, orders, and payment webhooks in production.',
      },
      {
        name: 'REST APIs',
        logo: 'assets/icons/nestjs.svg',
        proof: 'Schema + API layer owned through client delivery on Green Power India.',
      },
    ],
  },
  {
    category: 'Database & Security',
    color: '#8b5cf6',
    items: [
      {
        name: 'PostgreSQL',
        logo: 'assets/icons/postgresql.svg',
        proof: 'RLS multi-tenant isolation designed for Tagtics.',
      },
      {
        name: 'MongoDB',
        logo: 'assets/icons/mongodb.svg',
        proof: 'Product catalogue and order data for Fashion Studio.',
      },
      {
        name: 'Redis',
        logo: 'assets/icons/redis.svg',
        proof: 'Realtime coordination patterns with Pub/Sub where shipped.',
      },
      {
        name: 'Supabase',
        logo: 'assets/icons/supabase.svg',
        proof: 'Auth, Postgres, and storage for Tagtics and Green Power India.',
      },
    ],
  },
  {
    category: 'DevOps & Cloud',
    color: '#f59e0b',
    items: [
      {
        name: 'Docker',
        logo: 'assets/icons/docker.svg',
        proof: 'Containerized services for repeatable local and deploy workflows.',
      },
      {
        name: 'AWS (EC2/S3)',
        logo: 'assets/icons/aws-ec2-s3.svg',
        invertDark: true,
        proof: 'Self-managed EC2 + Nginx for Fashion Studio production traffic.',
      },
      {
        name: 'CI/CD Pipelines',
        logo: 'assets/icons/github-actions.svg',
        invertDark: true,
        proof: 'Ship via GitHub-linked deploys (Vercel / cloud) with guarded releases.',
      },
      {
        name: 'Vercel',
        logo: 'assets/icons/vercel.svg',
        invertDark: true,
        proof: 'Zero-config Next.js and React frontends for client and SaaS apps.',
      },
    ],
  },
  {
    category: 'Realtime (shipped)',
    color: '#ef4444',
    items: [
      {
        name: 'WebSockets',
        logo: 'assets/icons/socket-io.svg',
        invertDark: true,
        proof: 'Shipped realtime channels where product UX required live updates.',
      },
      {
        name: 'Redis Pub/Sub',
        logo: 'assets/icons/redis-pub-sub.svg',
        proof: 'Event fan-out between services without tight coupling.',
      },
    ],
  },
  {
    category: 'Frontend Engineering',
    color: '#3b82f6',
    items: [
      {
        name: 'Angular v20',
        logo: 'assets/icons/angular.svg',
        proof: 'Day job at Axolon; auth UI work in Ever-Gauzy’s Angular ERP.',
      },
      {
        name: 'React',
        logo: 'assets/icons/react.svg',
        proof: 'Tagtics admin dashboard and embeddable feedback UX.',
      },
      {
        name: 'Next.js',
        logo: 'assets/icons/nextjs.svg',
        invertDark: true,
        proof: 'Green Power India App Router site shipped to production.',
      },
      {
        name: 'Tailwind CSS',
        logo: 'assets/icons/tailwind-css.svg',
        proof: 'Production UI systems across client and SaaS frontends.',
      },
      {
        name: 'TypeScript',
        logo: 'assets/icons/typescript.svg',
        proof: 'Typed end-to-end across Angular, React, and Node codebases.',
      },
    ],
  },
];
