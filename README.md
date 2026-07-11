# Portfolio - Rishiraj Sajeev

A creative engineer portfolio built with **Angular 21** and **Tailwind CSS v4**, focused on production-grade SaaS and microservices work.

## Tech Stack

- **Framework**: Angular 21 (standalone, zoneless, SSR/prerender)
- **Styling**: Tailwind CSS v4 + CSS design tokens
- **Motion**: GSAP + Lenis (dynamic imports)
- **Contact**: Web3Forms + hCaptcha (`ng-hcaptcha`)
- **Deploy**: Vercel

## Features

- Light / dark theme with View Transition toggle
- Brand-first hero, timeline experience/education, skills, horizontal projects, contact
- Performance-minded: `@defer`, lazy routes, no WebGL/Three.js
- Accessibility: skip link, labeled controls, `prefers-reduced-motion`
- SEO: prerender, meta tags, JSON-LD, sitemap, `llms.txt`

## Sections

- **Hero** — Name, role, supporting line, CTAs
- **Experience & Education** — Timeline under `#info`
- **Skills** — Categorized technical arsenal
- **Projects** — Tagtics, Green Power India, Ever-Gauzy, Fashion Studio
- **Contact** — Form with hCaptcha (skipped on localhost)

## Development

```bash
pnpm install
pnpm start
```

Production build (injects env vars, then builds):

```bash
pnpm run build
```

Required env vars for production contact form:

- `WEB3FORMS_URL`
- `WEB3FORMS_KEY`
- `HCAPTCHA_SITE_KEY`

## Links

- Site: https://www.rishiraj-sajeev.space/
- GitHub: https://github.com/rishi-rj-s
- LinkedIn: https://www.linkedin.com/in/rishiraj-sajeev
- Email: rishirajsajeev@gmail.com
