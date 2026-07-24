export const profile = {
  name: 'Rishiraj Sajeev',
  eyebrow: 'Full-Stack Engineer · Angular & NestJS',
  role: 'Full Stack Engineer',
  currentTitle: 'Angular Developer at Axolon',
  subhead:
    'I build enterprise-style Angular frontends and production SaaS backends with NestJS, React, Next.js, and PostgreSQL.',
  availability: 'Always open to interesting offers and news.',
  suitedFor: ['Angular', 'NestJS', 'Full-stack SaaS', 'API / backend'],
  replySla: 'I typically reply within 48 hours.',
  email: 'rishirajsajeev@gmail.com',
  whyMe: {
    headline: 'Why companies hire me',
    support:
      'I ship production systems end-to-end — frontend, data model, APIs, and deployment — not just feature tickets.',
    points: [
      {
        title: 'Client delivery ownership',
        body: 'Delivered Green Power India’s live corporate platform — owned UI, schema, API, and handoff.',
      },
      {
        title: 'Multi-tenant SaaS architecture',
        body: 'Designed Tagtics tenant isolation with PostgreSQL Row-Level Security so each client only sees its own data.',
      },
      {
        title: 'Production payments & cloud ops',
        body: 'Ran Fashion Studio’s e-commerce backend on AWS EC2 with verified Razorpay webhooks.',
      },
      {
        title: 'Enterprise Angular depth',
        body: 'Building Angular apps at Axolon; contributed auth UI inside Ever-Gauzy’s large NestJS/Angular ERP.',
      },
    ],
  },
} as const;
