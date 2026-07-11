import { Component, signal, HostListener, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="relative z-10 border-t border-[var(--color-border)] bg-[var(--color-background)] overflow-hidden">
      <div class="page-gutter max-w-[1400px] mx-auto py-16 md:py-24">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16">
          <div>
            <p class="section-label mb-4">Rishiraj Sajeev</p>
            <p class="text-2xl md:text-3xl font-black tracking-tight text-[var(--color-text)] max-w-md leading-tight">
              Full Stack Engineer building SaaS that holds up in production.
            </p>
          </div>

          <div class="flex flex-wrap gap-3 relative">
            <a
              href="https://github.com/rishi-rj-s"
              target="_blank"
              rel="noopener noreferrer"
              class="signal-btn signal-btn-ghost !py-2.5 !px-4 !text-[11px]"
              >GitHub</a
            >
            <a
              href="https://linkedin.com/in/rishiraj-sajeev"
              target="_blank"
              rel="noopener noreferrer"
              class="signal-btn signal-btn-ghost !py-2.5 !px-4 !text-[11px]"
              >LinkedIn</a
            >
            <a href="mailto:rishirajsajeev@gmail.com" class="signal-btn signal-btn-ghost !py-2.5 !px-4 !text-[11px]"
              >Email</a
            >

            <div class="relative">
              <button
                type="button"
                (click)="resumeOpen.update((v) => !v)"
                class="signal-btn !py-2.5 !px-4 !text-[11px]"
                [attr.aria-expanded]="resumeOpen()"
              >
                Resume
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              @if (resumeOpen()) {
                <div
                  class="absolute bottom-full mb-2 right-0 min-w-[220px] border border-[var(--color-border)] bg-[var(--color-card)] shadow-xl p-2 z-20"
                  role="menu"
                >
                  <a
                    href="/assets/resumes/RISHIRAJ_SAJEEV_RESUME.pdf"
                    download
                    (click)="resumeOpen.set(false)"
                    role="menuitem"
                    class="block px-3 py-2.5 text-sm hover:bg-[var(--color-surface)] text-[var(--color-text)]"
                    >English (Global)</a
                  >
                  <a
                    href="/assets/resumes/Rishiraj_Sajeev_Rirekisho.pdf"
                    download
                    (click)="resumeOpen.set(false)"
                    role="menuitem"
                    class="block px-3 py-2.5 text-sm hover:bg-[var(--color-surface)] text-[var(--color-text)]"
                    >Rirekisho (履歴書)</a
                  >
                  <a
                    href="/assets/resumes/Rishiraj_Sajeev_Shokumu_Keirekisho.pdf"
                    download
                    (click)="resumeOpen.set(false)"
                    role="menuitem"
                    class="block px-3 py-2.5 text-sm hover:bg-[var(--color-surface)] text-[var(--color-text)]"
                    >Shokumu Keirekisho</a
                  >
                </div>
              }
            </div>
          </div>
        </div>

        <div
          class="font-black tracking-[-0.07em] leading-none text-[clamp(3rem,12vw,9rem)] text-[var(--color-text)] opacity-[0.08] select-none pointer-events-none"
          aria-hidden="true"
        >
          RISHIRAJ
        </div>

        <div
          class="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-mono text-[11px] tracking-wider uppercase text-[var(--color-text-muted)]"
        >
          <p>© {{ currentYear }} Rishiraj Sajeev</p>
          <p>Built with Angular · Designed to ship</p>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  currentYear = new Date().getFullYear();
  resumeOpen = signal(false);
  private el = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    if (!this.el.nativeElement.contains(e.target)) this.resumeOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.resumeOpen.set(false);
  }
}
