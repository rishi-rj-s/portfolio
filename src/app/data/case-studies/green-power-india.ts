import { CaseStudy } from './types';

export const greenPowerIndiaCaseStudy: CaseStudy = {
  slug: 'green-power-india',
  title: 'Green Power India',
  subtitle:
    'End-to-end corporate platform for a waste-to-energy brand — owned frontend, schema, API, and handoff.',
  year: '2026',
  type: 'Client Contract',
  stack: [
    'Next.js 15',
    'React 19',
    'Supabase',
    'PostgreSQL',
    'Tailwind CSS',
    'Framer Motion',
    'Vercel',
  ],
  links: [{ label: 'Live site', href: 'https://greenpowerindia.com/' }],
  problem: {
    title: 'Why it exists',
    paragraphs: [
      'Green Power India needed a production marketing and content presence that matched a technical sustainability brand — not a template brochure site with broken media handling.',
      'The brief: ship a credible corporate platform (story, capabilities, contact/partner flows) with a reliable content and media backbone the client could operate after handoff.',
    ],
  },
  role: {
    title: 'What I engineered',
    paragraphs: [
      'Solo ownership from UI through data layer to deployment and client handoff.',
    ],
    bullets: [
      'Next.js 15 App Router frontend with bento-style marketing UI (Tailwind CSS, Framer Motion)',
      'Supabase / PostgreSQL schema and API surface for content and media',
      'Structured object storage for reliable media handling',
      'Vercel production deployment',
      'Handoff of a live site the client can operate — not a prototype left unfinished',
    ],
  },
  architecture: {
    summary:
      'Marketing frontend on Vercel talking to Supabase for auth-adjacent content APIs, Postgres, and media buckets.',
    nodes: [
      { id: 'visitor', label: 'Site visitor' },
      { id: 'next', label: 'Next.js 15 App Router', group: 'Frontend · Vercel' },
      { id: 'api', label: 'Supabase API / schema', group: 'Backend · Supabase' },
      { id: 'db', label: 'PostgreSQL', group: 'Backend · Supabase' },
      { id: 'storage', label: 'Media buckets', group: 'Backend · Supabase' },
      { id: 'client', label: 'Client ops after handoff', group: 'Ops' },
    ],
    edges: [
      { from: 'visitor', to: 'next', label: 'Browses site' },
      { from: 'next', to: 'api', label: 'Content / forms' },
      { from: 'api', to: 'db', label: 'Reads / writes' },
      { from: 'api', to: 'storage', label: 'Media assets' },
      { from: 'client', to: 'api', label: 'Content updates' },
      { from: 'next', to: 'visitor', label: 'SSR / static UI' },
    ],
  },
  decisions: [
    {
      question: 'Why Next.js App Router on Vercel?',
      answer:
        'Corporate marketing needs fast first paint, SEO-friendly HTML, and simple deploys. App Router + Vercel gave prerendered routes and zero-ops hosting so delivery focused on product, not servers.',
    },
    {
      question: 'Why Supabase instead of a custom Nest API?',
      answer:
        'The client needed a content and media backend they could keep running after handoff. Supabase Postgres + storage covered schema, API access, and buckets without standing up EC2 for a brochure-scale platform.',
    },
    {
      question: 'Why structured media buckets early?',
      answer:
        'Broken or ad-hoc image hosting is what makes marketing sites feel unfinished. Defining storage paths and schema up front kept the bento UI reliable under real assets.',
    },
    {
      question: 'Why own UI and backend together?',
      answer:
        'On a fixed client contract, split ownership slows handoff. One engineer owning schema ↔ UI meant the live site shipped as a coherent system, not a frontend waiting on an unfinished API.',
    },
  ],
  shipped: {
    title: 'What shipped',
    paragraphs: [
      'A live corporate site at greenpowerindia.com — brand story, capabilities narrative, partner/contact paths, and a media-backed content model ready for client operation.',
    ],
    bullets: [
      'Production Next.js 15 frontend',
      'Supabase/PostgreSQL-backed content layer',
      'Structured media storage',
      'Client handoff of a running platform',
    ],
  },
  challenges: {
    title: 'Hardest problems',
    paragraphs: [
      'Matching a strong visual brand while keeping content and media operable for a non-engineering client after delivery.',
    ],
    bullets: [
      'Balancing expressive motion UI with stable content structure',
      'Media reliability without overbuilding a full CMS',
      'Handing off something the client can update without a second build cycle',
    ],
  },
  lessons: {
    title: 'Lessons learned',
    paragraphs: [
      'Client work succeeds when ownership includes handoff — schema, deploy, and a UI the brand can live in. Choosing managed backend pieces was the right trade for a marketing platform that needed to ship and stay up.',
    ],
  },
};
