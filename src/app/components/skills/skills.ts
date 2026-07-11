import { Component, signal } from '@angular/core';

interface SkillItem {
  name: string;
  logo: string;
  invertDark?: boolean;
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
}

@Component({
  selector: 'app-skills',
  template: `
    <section id="skills" class="relative py-[var(--section-pad-y)] border-t border-[var(--color-border)]">
      <div class="page-gutter max-w-[1400px] mx-auto mb-12 md:mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div class="lg:col-span-7">
            <p class="section-label mb-4">03 — Stack</p>
            <h2 class="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[0.95] text-[var(--color-text)]">
              Tools I use<br />
              <span class="text-[var(--color-text-muted)]">to ship systems</span>
            </h2>
          </div>
          <p class="lg:col-span-5 text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed max-w-md lg:justify-self-end">
            From API design to cloud deploy — a focused stack for SaaS, realtime, and production reliability.
          </p>
        </div>
      </div>

      <div class="space-y-0">
        @for (category of skills(); track category.category; let i = $index) {
          <div
            class="border-t border-[var(--color-border)] group hover:bg-[var(--color-panel)] transition-colors duration-300"
          >
            <div class="page-gutter max-w-[1400px] mx-auto py-8 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
              <div class="md:col-span-4 flex items-baseline gap-4">
                <span
                  class="font-mono text-xs text-[var(--color-primary)] group-hover:text-[var(--color-panel-text)] transition-colors"
                  >0{{ i + 1 }}</span
                >
                <h3
                  class="text-xl md:text-2xl font-black tracking-tight text-[var(--color-text)] group-hover:text-[var(--color-panel-text)] transition-colors"
                >
                  {{ category.category }}
                </h3>
              </div>

              <ul class="md:col-span-8 flex flex-wrap gap-2.5 list-none p-0 m-0">
                @for (item of category.items; track item.name) {
                  <li
                    class="inline-flex items-center gap-2.5 pl-2 pr-3.5 py-2 border border-[var(--color-border)] bg-[var(--color-card)] group-hover:border-[var(--color-panel-text)]/30 group-hover:bg-[var(--color-panel-text)]/10 transition-colors"
                  >
                    <span class="w-8 h-8 flex items-center justify-center bg-[var(--color-surface)] group-hover:bg-[var(--color-panel-text)]/15">
                      <img
                        [src]="item.logo"
                        alt=""
                        [class.theme-inverse]="item.invertDark"
                        class="w-4 h-4 object-contain"
                        loading="lazy"
                        decoding="async"
                        width="16"
                        height="16"
                      />
                    </span>
                    <span
                      class="text-sm font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-panel-text)] transition-colors"
                      >{{ item.name }}</span
                    >
                  </li>
                }
              </ul>
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class Skills {
  skills = signal<SkillCategory[]>([
    {
      category: 'Backend & Architecture',
      items: [
        { name: 'NestJS', logo: 'assets/icons/nestjs.svg' },
        { name: 'Node.js', logo: 'assets/icons/node-js.svg' },
        { name: 'Express', logo: 'assets/icons/express.svg', invertDark: true },
        { name: 'REST APIs', logo: 'assets/icons/nestjs.svg' },
      ],
    },
    {
      category: 'Database & Security',
      items: [
        { name: 'PostgreSQL', logo: 'assets/icons/postgresql.svg' },
        { name: 'MongoDB', logo: 'assets/icons/mongodb.svg' },
        { name: 'Redis', logo: 'assets/icons/redis.svg' },
        { name: 'Supabase', logo: 'assets/icons/supabase.svg' },
      ],
    },
    {
      category: 'DevOps & Cloud',
      items: [
        { name: 'Docker', logo: 'assets/icons/docker.svg' },
        { name: 'AWS (EC2/S3)', logo: 'assets/icons/aws-ec2-s3.svg', invertDark: true },
        { name: 'CI/CD', logo: 'assets/icons/github-actions.svg', invertDark: true },
        { name: 'Vercel', logo: 'assets/icons/vercel.svg', invertDark: true },
      ],
    },
    {
      category: 'Realtime Systems',
      items: [
        { name: 'WebSockets', logo: 'assets/icons/socket-io.svg', invertDark: true },
        { name: 'Redis Pub/Sub', logo: 'assets/icons/redis-pub-sub.svg' },
      ],
    },
    {
      category: 'Frontend Engineering',
      items: [
        { name: 'Angular', logo: 'assets/icons/angular.svg' },
        { name: 'React', logo: 'assets/icons/react.svg' },
        { name: 'Next.js', logo: 'assets/icons/nextjs.svg', invertDark: true },
        { name: 'Tailwind', logo: 'assets/icons/tailwind-css.svg' },
        { name: 'TypeScript', logo: 'assets/icons/typescript.svg' },
      ],
    },
  ]);
}
