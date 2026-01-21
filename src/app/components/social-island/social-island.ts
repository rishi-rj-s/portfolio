import { Component, ElementRef, HostListener, AfterViewInit, Inject, PLATFORM_ID, OnDestroy, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-social-island',
  template: `
    <!-- Mobile: Static between contact & footer, Desktop: Fixed on left -->
    <aside 
      class="z-40 bg-[var(--color-card)]/90 backdrop-blur-md border border-[var(--color-border)] shadow-2xl flex w-fit items-center justify-center rounded-full transition-all duration-200 relative mx-auto mt-8 mb-12 flex-row p-2 gap-2 md:fixed md:flex-col md:pb-3 md:gap-3 md:left-6 md:top-1/2 md:-translate-y-1/2 md:mx-0 md:my-0 md:w-auto"
      #islandContainer>
      
      <!-- Resume Button -->
      <button (click)="toggleDropdown($event)" class="p-2 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group relative shrink-0" aria-label="Resume Options">
         <div class="absolute inset-0 bg-[var(--color-text)] opacity-0 group-hover:opacity-10 transition-opacity rounded-full"></div>
         <svg class="w-5 h-5 md:w-6 md:h-6 text-[var(--color-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
         </svg>
      </button>

      <!-- Divider -->
      <div class="bg-[var(--color-border)] shrink-0 w-px h-5 md:w-5 md:h-px"></div>

      <!-- GitHub -->
      <a href="https://github.com/rishi-rj-s" target="_blank" class="p-2 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group relative shrink-0" aria-label="GitHub">
         <div class="absolute inset-0 bg-[var(--color-text)] opacity-0 group-hover:opacity-10 transition-opacity rounded-full"></div>
         <svg class="w-5 h-5 md:w-6 md:h-6 text-[var(--color-text)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
         </svg>
      </a>

      <!-- LinkedIn -->
      <a href="https://linkedin.com/in/rishiraj-sajeev" target="_blank" class="p-2 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group relative shrink-0" aria-label="LinkedIn">
         <div class="absolute inset-0 bg-[#0077b5] opacity-0 group-hover:opacity-10 transition-opacity rounded-full"></div>
         <svg class="w-5 h-5 md:w-6 md:h-6 text-[var(--color-text)] group-hover:text-[#0077b5] transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
         </svg>
      </a>

      <!-- Gmail -->
      <a href="mailto:rishirajsajeev@gmail.com" class="p-2 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group relative shrink-0" aria-label="Email">
         <div class="absolute inset-0 bg-[var(--color-text)] opacity-0 group-hover:opacity-10 transition-opacity rounded-full"></div>
         <svg class="w-5 h-5 md:w-6 md:h-6 text-[var(--color-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
         </svg>
      </a>
    </aside>

    <!-- Resume Dropdown Panel -->
    @if (isOpen) {
      <div 
        class="fixed z-[60] flex flex-col gap-2 p-3 bg-[var(--color-card)] backdrop-blur-xl border border-[var(--color-border)] rounded-2xl shadow-2xl min-w-[240px]"
        [style.left.px]="dropdownPosition.x"
        [style.top.px]="dropdownPosition.y">
         
         <div class="flex items-center gap-2 pb-2 mb-2 border-b border-[var(--color-border)]">
            <svg class="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span class="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">Download Resume</span>
         </div>
         
         <a href="/assets/resumes/RISHIRAJ_SAJEEV_RESUME.pdf" download (click)="closeDropdown()" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-card-hover)] text-sm text-[var(--color-text)] transition-colors group/item">
            <span class="text-lg">📄</span> 
            <div class="flex flex-col leading-tight">
                <span class="font-medium">English (Global)</span>
                <span class="text-[10px] text-[var(--color-text-muted)]">PDF • 180KB</span>
            </div>
         </a>
         <a href="/assets/resumes/Rishiraj_Sajeev_Rirekisho.pdf" download (click)="closeDropdown()" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-card-hover)] text-sm text-[var(--color-text)] transition-colors group/item">
            <span class="text-lg">🇯🇵</span>
             <div class="flex flex-col leading-tight">
                <span class="font-medium">Rirekisho (履歴書)</span>
                <span class="text-[10px] text-[var(--color-text-muted)]">Standard Japanese Format</span>
            </div>
         </a>
         <a href="/assets/resumes/Rishiraj_Sajeev_Shokumu_Keirekisho.pdf" download (click)="closeDropdown()" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-card-hover)] text-sm text-[var(--color-text)] transition-colors group/item">
            <span class="text-lg">💼</span>
             <div class="flex flex-col leading-tight">
                <span class="font-medium">Shokumu Keirekisho</span>
                <span class="text-[10px] text-[var(--color-text-muted)]">Work History (Japanese)</span>
            </div>
         </a>
      </div>
    }
  `,
  styles: []
})
export class SocialIsland implements AfterViewInit, OnDestroy {
  @ViewChild('islandContainer') islandContainer!: ElementRef<HTMLElement>;
  
  isOpen = false;
  isDesktop = false;
  dropdownPosition = { x: 0, y: 0 };
  
  private isBrowser: boolean;
  private resizeHandler: (() => void) | null = null;

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.checkDesktop();
      this.resizeHandler = () => {
        this.checkDesktop();
        this.closeDropdown();
      };
      window.addEventListener('resize', this.resizeHandler);
    }
  }

  ngOnDestroy() {
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
  }

  private checkDesktop() {
    this.isDesktop = window.innerWidth >= 768;
  }

  toggleDropdown(event: MouseEvent) {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen && this.isBrowser && this.islandContainer) {
      const islandRect = this.islandContainer.nativeElement.getBoundingClientRect();
      
      if (this.isDesktop) {
        this.dropdownPosition = {
          x: islandRect.right + 16,
          y: Math.max(16, islandRect.top)
        };
      } else {
        this.dropdownPosition = {
          x: Math.max(16, (window.innerWidth - 240) / 2),
          y: Math.max(16, islandRect.top - 230)
        };
      }
    }
  }

  closeDropdown() {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target as HTMLElement)) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.closeDropdown();
  }
}
