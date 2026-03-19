import { Component, output, inject, signal, viewChild, ElementRef, afterNextRender, computed } from "@angular/core";
import { ThemeOption, Theme } from "../../services/theme";
import { Background, BackgroundStyle } from "../../services/background";

@Component({
  selector: 'app-theme-selector',
  imports: [],
  template: `
    <div 
      class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" 
      (click)="close.emit()"
      tabindex="-1"
    >
      <!-- Modal Box -->
      <div 
        #modalBox
        class="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl shadow-2xl max-w-2xl w-full animate-scale-in relative overflow-hidden flex flex-col max-h-[90vh]"
        (click)="$event.stopPropagation()"
        data-lenis-prevent
      >
        <!-- Wild Scroll Indicator (Perimeter) -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible" fill="none">
          <path 
            [attr.d]="pathD()" 
            stroke="var(--color-primary)" 
            stroke-width="8" 
            stroke-linecap="round"
            [style.stroke-dasharray]="dashArray()"
            [style.stroke-dashoffset]="dashOffset()"
            class="transition-[stroke-dashoffset] duration-150 ease-out opacity-90 filter drop-shadow-[0_0_8px_var(--color-primary)]"
          />
        </svg>

        <!-- Close Button (Top Right) -->
        <button 
          (click)="close.emit()" 
          class="absolute top-6 right-6 z-50 p-2 rounded-full bg-[var(--color-card-hover)] hover:scale-110 transition-all text-[var(--color-text)] shadow-lg"
          aria-label="Close"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <!-- Background Glow -->
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-[var(--color-primary)] opacity-10 blur-3xl rounded-full pointer-events-none"></div>

        <!-- Scrollable Content -->
        <div 
          #scroller
          (scroll)="onScroll($event)"
          class="overflow-y-auto overflow-x-hidden p-6 md:p-8 custom-scrollbar overscroll-contain flex-grow relative z-10"
        >
          
          <!-- Header -->
          <div class="flex flex-col mb-8 pr-12">
            <h2 class="text-3xl font-black font-sans tracking-tight">Customize</h2>
            <p class="text-[var(--color-text-muted)] text-sm mt-1">Theme & Background</p>
          </div>

          <!-- Theme Section -->
          <div class="mb-6">
            <h3 class="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Color Theme</h3>
            <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
              @for (option of themes; track option.id) {
                <button
                  class="group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-card-hover)]"
                  [class.ring-2]="theme.currentTheme() === option.id"
                  [class.ring-[var(--color-primary)]]="theme.currentTheme() === option.id"
                  [class.bg-[var(--color-card-hover)]]="theme.currentTheme() === option.id"
                  (click)="selectTheme(option.id, $event)"
                >
                  <!-- Color Preview -->
                  <div 
                    class="w-10 h-10 rounded-full shadow-lg relative overflow-hidden transition-transform group-hover:scale-110 flex items-center justify-center"
                    [style.background]="option.background"
                    style="box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.1);"
                  >
                    <div class="absolute bottom-0 w-full h-1/2 opacity-30" [style.background]="option.primary"></div>
                    @if (theme.currentTheme() === option.id) {
                        <div class="w-2 h-2 rounded-full bg-white shadow-sm ring-2 ring-black/20"></div>
                    }
                  </div>
                  
                  <span class="text-xs font-medium opacity-70 group-hover:opacity-100 transition-opacity">{{ option.name }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Divider -->
          <div class="h-px bg-[var(--color-border)] my-6"></div>

          <!-- Background Section -->
          <div>
            <h3 class="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Background Effect</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              @for (bg of backgrounds; track bg.id) {
                <button
                  class="group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-card-hover)]"
                  [class.ring-2]="background.currentBackground() === bg.id"
                  [class.ring-[var(--color-primary)]]="background.currentBackground() === bg.id"
                  [class.bg-[var(--color-card-hover)]]="background.currentBackground() === bg.id"
                  (click)="selectBackground(bg.id)"
                >
                  <!-- Icon/Emoji Preview -->
                  <div 
                    class="w-12 h-12 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
                  >
                    {{ bg.icon }}
                  </div>
                  
                  <div class="text-center">
                    <span class="text-xs font-bold block">{{ bg.name }}</span>
                    <span class="text-[10px] text-[var(--color-text-muted)] block mt-0.5">{{ bg.description }}</span>
                  </div>
                </button>
              }
            </div>
          </div>
          
          <!-- Footer / Hint -->
          <div class="mt-8 text-center text-xs text-[var(--color-text-muted)] font-mono opacity-60">
            PRESS ESC TO CLOSE
          </div>
        </div>
      </div>
    </div>
  `,
  host: {
    '(window:keydown.escape)': 'onEscape()'
  },
  styles: [`
    /* Hide default scrollbar but keep functionality */
    .custom-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .custom-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    :host {
      display: block;
    }
  `]
})
export class ThemeSelectorComponent {
  public theme = inject(Theme);
  public background = inject(Background);

  modalBox = viewChild<ElementRef<HTMLElement>>('modalBox');
  scroller = viewChild<ElementRef<HTMLElement>>('scroller');

  themes = this.theme.availableThemes;
  backgrounds = this.background.availableBackgrounds;
  close = output<void>();

  // State for wild scrollbar
  modalSize = signal({ w: 0, h: 0 });
  scrollProgress = signal(0);
  
  // Computed path properties
  pathD = computed(() => {
    const { w, h } = this.modalSize();
    if (w === 0 || h === 0) return '';
    const r = 24; // rounded-3xl approx
    
    // Path: Top-Middle -> Top-Right -> Right-Bottom -> Bottom-Middle
    return `
      M ${w/2}, 0
      L ${w-r}, 0
      A ${r},${r} 0 0 1 ${w}, ${r}
      L ${w}, ${h-r}
      A ${r},${r} 0 0 1 ${w-r}, ${h}
      L ${w/2}, ${h}
    `;
  });

  pathLength = computed(() => {
    const { w, h } = this.modalSize();
    if (w === 0 || h === 0) return 0;
    const r = 24;
    const pi_r_2 = (Math.PI * r) / 2;
    // Lengths: Top piece + corner + right side + corner + bottom piece
    return (w/2 - r) + pi_r_2 + (h - 2*r) + pi_r_2 + (w/2 - r);
  });

  // Dash array creates a fixed-size thumb (e.g., 240px) followed by a giant gap
  dashArray = computed(() => {
    const total = this.pathLength();
    const thumbLen = 240; // Fixed size thumb (increased from 80)
    return `${thumbLen} ${total}`;
  });

  dashOffset = computed(() => {
    const total = this.pathLength();
    const thumbLen = 240;
    // Offset goes from 0 (start) to -(total - thumbLen) (end)
    return -this.scrollProgress() * (total - thumbLen);
  });

  constructor() {
    afterNextRender(() => {
      this.updateDimensions();
      window.addEventListener('resize', () => this.updateDimensions());
    });
  }

  updateDimensions() {
    const el = this.modalBox()?.nativeElement;
    if (el) {
      this.modalSize.set({ w: el.clientWidth, h: el.clientHeight });
    }
  }

  onScroll(e: Event) {
    const el = e.target as HTMLElement;
    const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
    this.scrollProgress.set(isNaN(progress) ? 0 : progress);
  }

  selectTheme(id: ThemeOption, event: MouseEvent) {
    this.theme.setTheme(id, event);
  }

  selectBackground(id: BackgroundStyle) {
    this.background.setBackground(id);
  }

  onEscape() {
    this.close.emit();
  }
}
