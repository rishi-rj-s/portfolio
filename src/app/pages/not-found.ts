import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] text-[var(--color-text)] p-6 text-center select-none overflow-hidden relative">
       
       <!-- Background Noise -->
       <div class="absolute inset-0 pointer-events-none opacity-20 bg-[url('/assets/noise.svg')]"></div>

       <h1 class="text-[12rem] md:text-[20rem] font-black leading-none opacity-10 tracking-tighter absolute select-none">404</h1>
       
       <div class="relative z-10 animate-fade-in-up">
          <div class="text-6xl md:text-8xl mb-4">🤨</div>
          <h2 class="text-4xl md:text-6xl font-black tracking-tight mb-2">Why you do that?</h2>
          <p class="text-xl md:text-2xl text-[var(--color-text-muted)] font-mono mb-12">System cannot locate this sector.</p>
          
          <a routerLink="/" 
             class="inline-block px-8 py-4 border-2 border-[var(--color-text)] text-[var(--color-text)] font-bold uppercase tracking-widest hover:bg-[var(--color-text)] hover:text-[var(--color-background)] transition-all duration-300">
             Return to Base
          </a>
       </div>
    </div>
  `
})
export class NotFound {}
