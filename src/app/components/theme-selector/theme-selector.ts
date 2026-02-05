import { Component, output, inject } from "@angular/core";
import { ThemeOption, Theme } from "../../services/theme";

@Component({
  selector: 'app-theme-selector',
  imports: [],
  template: `
    <div 
      class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" 
      (click)="close.emit()"
      tabindex="-1"
    >
      <div 
        class="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-8 shadow-2xl max-w-lg w-full animate-scale-in relative overflow-hidden overflow-y-auto max-h-[85vh]"
        (click)="$event.stopPropagation()"
      >
        <!-- Background Glow -->
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-[var(--color-primary)] opacity-10 blur-3xl rounded-full pointer-events-none"></div>
      
        <!-- Header -->
        <div class="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 class="text-2xl font-black font-sans tracking-tight">Select Theme</h2>
            <p class="text-[var(--color-text-muted)] text-sm mt-1">Choose your preferred ambiance</p>
          </div>
          <button (click)="close.emit()" class="p-2 rounded-full hover:bg-[var(--color-card-hover)] transition-colors text-[var(--color-text)]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
          @for (option of themes; track option.id) {
            <button
              class="group relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-card-hover)]"
              [class.ring-2]="theme.currentTheme() === option.id"
              [class.ring-[var(--color-primary)]]="theme.currentTheme() === option.id"
              [class.bg-[var(--color-card-hover)]]="theme.currentTheme() === option.id"
              (click)="selectTheme(option.id, $event)"
            >
              <!-- Color Preview -->
              <div 
                class="w-16 h-16 rounded-full shadow-lg relative overflow-hidden transition-transform group-hover:scale-110 flex items-center justify-center"
                [style.background]="option.background"
                style="box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.1);"
              >
                 <!-- Accent Strip -->
                 <div class="absolute bottom-0 w-full h-1/2 opacity-20" [style.background]="option.primary"></div>
                 
                 <!-- Checkmark for active -->
                 @if (theme.currentTheme() === option.id) {
                    <div class="w-2 h-2 rounded-full bg-white shadow-sm ring-2 ring-black/20"></div>
                 }
              </div>
              
              <span class="text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity">{{ option.name }}</span>
            </button>
          }
        </div>
        
        <!-- Footer / Hint -->
        <div class="mt-8 text-center text-xs text-[var(--color-text-muted)] font-mono opacity-60">
          PRESS ESC TO CLOSE
        </div>
      </div>
    </div>
  `,
  host: {
    '(window:keydown.escape)': 'onEscape()'
  }
})
export class ThemeSelectorComponent {
  public theme = inject(Theme);

  themes = this.theme.availableThemes;
  close = output<void>();

  selectTheme(id: ThemeOption, event: MouseEvent) {
    this.theme.setTheme(id, event);
  }

  onEscape() {
    this.close.emit();
  }
}
