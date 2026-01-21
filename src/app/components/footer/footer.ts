import { Component } from '@angular/core';


@Component({
  selector: 'app-footer',
  template: `
    <footer class="py-6 bg-[var(--color-background)] border-t border-[var(--color-border)] text-center relative z-10">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <p class="text-[var(--color-text-muted)] text-sm font-mono">
          © {{ currentYear }} Rishiraj Sajeev. All Rights Reserved.
        </p>

        <div class="flex items-center gap-6">
           <a href="https://github.com/rishi-rj-s" target="_blank" class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
              GitHub
           </a>
           <a href="https://linkedin.com/in/rishiraj-sajeev" target="_blank" class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
              LinkedIn
           </a>
           <a href="mailto:rishirajsajeev@gmail.com" class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
              Email
           </a>
           <a href="/assets/resumes/RISHIRAJ_SAJEEV_RESUME.pdf" download="Rishiraj_Resume.pdf" class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors font-bold">
              Resume
           </a>
        </div>

      </div>
    </footer>
  `
})
export class Footer {
  currentYear = new Date().getFullYear();
}