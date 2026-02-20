import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type BackgroundStyle = 'aurora' | 'crystal' | 'waves' | 'blobs' | 'terrain' | 'galaxy' | 'none';

export interface BackgroundOption {
  id: BackgroundStyle;
  name: string;
  description: string;
  icon: string; // Emoji for quick visual
}

@Injectable({
  providedIn: 'root'
})
export class Background {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  readonly availableBackgrounds: BackgroundOption[] = [
    { id: 'aurora', name: 'Aurora', description: 'Flowing northern lights', icon: '🌌' },
    { id: 'terrain', name: 'Terrain', description: 'Noise-based landscape', icon: '🏔️' },
    { id: 'crystal', name: 'Crystal', description: 'Prismatic rotating structure', icon: '💎' },
    { id: 'waves', name: 'Waves', description: 'Flowing curved lines', icon: '〰️' },
    { id: 'blobs', name: 'Blobs', description: 'Morphing organic shapes', icon: '🫧' },
    { id: 'galaxy', name: 'Galaxy', description: 'Swirling vortex', icon: '🌀' },
    { id: 'none', name: 'None', description: 'Solid background', icon: '⬛' }
  ];

  private _currentBackground = signal<BackgroundStyle>(this.loadSavedBackground());
  
  readonly currentBackground = this._currentBackground.asReadonly();
  
  readonly currentBackgroundInfo = computed(() => 
    this.availableBackgrounds.find(b => b.id === this._currentBackground()) 
    ?? this.availableBackgrounds[0]
  );

  private loadSavedBackground(): BackgroundStyle {
    if (!this.isBrowser) return 'aurora';
    const saved = localStorage.getItem('portfolio-background');
    if (saved && this.availableBackgrounds.some(b => b.id === saved)) {
      return saved as BackgroundStyle;
    }
    return 'aurora'; // Default
  }

  setBackground(style: BackgroundStyle) {
    this._currentBackground.set(style);
    if (this.isBrowser) {
      localStorage.setItem('portfolio-background', style);
    }
  }

  nextBackground() {
    const currentIndex = this.availableBackgrounds.findIndex(
      b => b.id === this._currentBackground()
    );
    const nextIndex = (currentIndex + 1) % this.availableBackgrounds.length;
    this.setBackground(this.availableBackgrounds[nextIndex].id);
  }
}
