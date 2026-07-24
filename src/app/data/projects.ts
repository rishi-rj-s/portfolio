export interface ProjectLinks {
  live?: string;
  source?: string;
  docs?: string;
}

export interface Project {
  title: string;
  type: string;
  year: string;
  outcome: string;
  description: string;
  stack: string[];
  links: ProjectLinks;
  /** When set, project card links to `/work/{slug}` */
  caseStudySlug?: string;
}

export const projects: Project[] = [
  {
    title: 'Green Power India',
    type: 'Client Contract',
    year: '2026',
    outcome:
      'Owned end-to-end delivery of a live corporate platform — frontend, schema, API, and client handoff.',
    description:
      'Client needed a production marketing and content platform with reliable media handling. Built and shipped a Next.js 15 App Router site on Vercel with a Supabase/PostgreSQL backend and structured bucket storage. Owned both the bento-style UI (Tailwind CSS, Framer Motion) and the backend schema/API layer through delivery.',
    stack: ['Next.js 15', 'React 19', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion'],
    links: {
      live: 'https://greenpowerindia.com/',
    },
    caseStudySlug: 'green-power-india',
  },
  {
    title: 'Tagtics',
    type: 'SaaS',
    year: '2025',
    outcome:
      'Designed multi-tenant UI feedback SaaS with PostgreSQL RLS — frontend live; feedback pinned to exact DOM elements.',
    description:
      'Users click any element on a target web app and submit contextual feedback without changing that app’s code. Designed tenant isolation with PostgreSQL Row-Level Security (RLS) at the database layer. React frontend is live; Supabase-backed API work continues alongside the shipped UI.',
    stack: ['React', 'Supabase', 'PostgreSQL', 'RLS', 'TypeScript'],
    links: {
      source: 'https://github.com/tagtics/tagtics-frontend',
      live: 'https://www.tagtics.online',
      docs: 'https://tagtics.online/docs',
    },
    caseStudySlug: 'tagtics',
  },
  {
    title: 'Fashion Studio',
    type: 'E-Commerce',
    year: '2024',
    outcome:
      'Built and operated a production e-commerce backend on AWS — catalogue, auth, orders, verified Razorpay payments.',
    description:
      'Ran payments and order processing in production on AWS EC2 with Nginx as a reverse proxy. Integrated Razorpay with webhook signature verification for tamper-proof transactions, plus product catalogue management and user auth on Node.js, Express, and MongoDB.',
    stack: ['Node.js', 'Express', 'MongoDB', 'AWS EC2', 'Nginx'],
    links: {
      source: 'https://github.com/rishi-rj-s/RSBackend',
    },
  },
  {
    title: 'Ever-Gauzy',
    type: 'Open Source',
    year: '2025',
    outcome:
      'Improved authentication UI in a 100k+ line NestJS/Angular ERP used by real organisations.',
    description:
      'Contributed auth UI work inside a large Nx monorepo (NestJS + Angular). Worked in a live enterprise codebase that uses CQRS, Event Sourcing, and Hexagonal Architecture patterns — exposure to those patterns, with the concrete deliverable being authentication UI improvements.',
    stack: ['NestJS', 'Angular', 'TypeScript', 'Nx', 'CQRS'],
    links: {
      source: 'https://github.com/ever-co/ever-gauzy',
      live: 'https://app.gauzy.co/#/auth/login',
    },
  },
];
