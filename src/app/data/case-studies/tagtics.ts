import { CaseStudy } from './types';

export const tagticsCaseStudy: CaseStudy = {
  slug: 'tagtics',
  title: 'Tagtics',
  subtitle: 'Client feedback pinned to the exact UI element — built for agencies and freelancers.',
  year: '2025',
  type: 'SaaS',
  stack: [
    'React 19',
    'TypeScript',
    'Zustand',
    'Tailwind CSS',
    'Supabase',
    'PostgreSQL',
    'RLS',
    'Vercel',
  ],
  links: [
    { label: 'Live demo', href: 'https://www.tagtics.online' },
    { label: 'Documentation', href: 'https://tagtics.online/docs' },
    { label: 'GitHub', href: 'https://github.com/tagtics/tagtics-frontend' },
  ],
  problem: {
    title: 'Why it exists',
    paragraphs: [
      'Agencies and freelancers collect client feedback in screenshots, Slack threads, and vague “the button on the left” comments. Context gets lost; bugs get mis-triaged.',
      'Tagtics pins feedback to the DOM element the client clicked — with browser context — so the ticket points at a real UI target, not a description of one.',
    ],
    bullets: [
      'Click the widget',
      'Select the element',
      'Submit the note — DOM target + browser context in one ticket',
    ],
  },
  role: {
    title: 'What I engineered',
    paragraphs: [
      'I designed and built the product surface and the multi-tenant data model that makes agency workflows safe.',
    ],
    bullets: [
      'Interactive element-selection feedback flow on the client review site',
      'Admin dashboard for centralized feedback per project',
      'PostgreSQL Row-Level Security so each tenant only sees its own data',
      'Supabase Auth for secure access',
      'Lightweight, non-blocking embeddable widget for client review builds',
      'React frontend shipped to production on Vercel; Supabase-backed API work continues alongside the live UI',
    ],
  },
  architecture: {
    summary:
      'Decoupled serverless shape: embed widget + admin dashboard on Vercel; auth, Postgres, storage, and edge functions on Supabase.',
    nodes: [
      { id: 'client', label: 'Client review browser' },
      { id: 'widget', label: 'Embed widget', group: 'Frontend · Vercel' },
      { id: 'dashboard', label: 'Admin dashboard', group: 'Frontend · Vercel' },
      { id: 'auth', label: 'Supabase Auth', group: 'Backend · Supabase' },
      { id: 'db', label: 'PostgreSQL + RLS', group: 'Backend · Supabase' },
      { id: 'storage', label: 'Object storage', group: 'Backend · Supabase' },
      { id: 'edge', label: 'Edge functions', group: 'Backend · Supabase' },
    ],
    edges: [
      { from: 'client', to: 'widget', label: 'Loads widget' },
      { from: 'client', to: 'dashboard', label: 'Manages feedback' },
      { from: 'widget', to: 'db', label: 'Submits feedback' },
      { from: 'widget', to: 'storage', label: 'Uploads screenshots' },
      { from: 'dashboard', to: 'auth', label: 'Authenticates' },
      { from: 'dashboard', to: 'db', label: 'Reads data' },
      { from: 'db', to: 'edge', label: 'DB webhooks' },
      { from: 'edge', to: 'db', label: 'AI / integrations (roadmap)' },
    ],
  },
  decisions: [
    {
      question: 'Why pin feedback to the DOM instead of freeform comments?',
      answer:
        'Agencies lose hours translating vague notes into tickets. Element selection plus browser context turns feedback into a fixable target without changing the client’s app code.',
    },
    {
      question: 'Why PostgreSQL Row-Level Security for multi-tenancy?',
      answer:
        'Tenant isolation belongs in the database, not only in application filters. RLS enforces “each tenant only sees its own rows” even if a query path is wrong — critical for agency multi-client data.',
    },
    {
      question: 'Why Supabase instead of a custom Nest API first?',
      answer:
        'Auth, Postgres, storage, and RLS ship as one platform so the MVP could prove the feedback loop fast. Edge functions and webhooks leave room for AI summarization and integrations without rewriting the core.',
    },
    {
      question: 'Why a lightweight embed script?',
      answer:
        'Review builds must stay non-blocking. A small widget loads on the client site, captures selection, and posts feedback without owning the host app’s stack.',
    },
  ],
  shipped: {
    title: 'What shipped',
    paragraphs: [
      'The React frontend is live in production. Agencies can run the click → select → submit loop and manage feedback from the admin dashboard.',
    ],
    bullets: [
      'Interactive element selection',
      'Admin dashboard per project',
      'Supabase authentication',
      'Embeddable review widget',
      'Tenant-aware data model with RLS',
    ],
  },
  challenges: {
    title: 'Hardest problems',
    paragraphs: [
      'Trustworthy multi-tenancy and a feedback UX that works on arbitrary client sites — without requiring those sites to adopt a heavy SDK.',
    ],
    bullets: [
      'Designing RLS policies that match agency project boundaries',
      'Keeping the embed small and non-blocking on third-party pages',
      'Capturing enough DOM/browser context to make tickets actionable',
    ],
  },
  lessons: {
    title: 'Lessons learned',
    paragraphs: [
      'For SaaS that holds client data, isolation strategy is a product feature — not an afterthought. Shipping the feedback loop early validated demand; hardening RLS and API surfaces is the next engineering chapter.',
    ],
  },
  roadmap: {
    title: 'Roadmap (not shipped)',
    paragraphs: [
      'Clearly separated from production scope so recruiters see honesty about maturity.',
    ],
    bullets: [
      'AI summarization to group similar feedback',
      'Webhooks for Slack, Discord, Jira, and Linear',
      'Deeper agency workflows for multi-client organization',
    ],
  },
};
