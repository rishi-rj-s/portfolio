import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center text-[var(--color-text)] p-6 text-center select-none overflow-hidden relative">
       
       <!-- Background Noise -->
       <div class="absolute inset-0 pointer-events-none opacity-20 bg-[url('/assets/noise.svg')]"></div>

       <!-- Glow behind content -->
       <div class="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none"
            style="background: radial-gradient(circle, var(--color-primary), transparent 70%);">
       </div>

       <!-- Giant 404 -->
       <h1 class="text-[12rem] md:text-[20rem] font-black leading-none tracking-tighter absolute select-none"
           style="color: var(--color-primary); opacity: 0.08;">404</h1>
       
       <div class="relative z-10 animate-fade-in-up">
          <div class="text-6xl md:text-8xl mb-4">🤨</div>
          <h2 class="text-4xl md:text-6xl font-black tracking-tight mb-2">
            Why you do <span style="color: var(--color-primary);">that</span>?
          </h2>
          <p class="text-xl md:text-2xl font-mono mb-12" style="color: var(--color-accent);">System cannot locate this sector.</p>
          
          <a routerLink="/" 
             class="inline-block px-8 py-4 border-2 font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105"
             style="border-color: var(--color-primary); color: var(--color-primary);"
             onmouseenter="this.style.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue('--color-primary');this.style.color=getComputedStyle(document.documentElement).getPropertyValue('--color-background');"
             onmouseleave="this.style.backgroundColor='transparent';this.style.color=getComputedStyle(document.documentElement).getPropertyValue('--color-primary');">
             Return to Base
          </a>
       </div>
    </div>
  `
})
export class NotFound {}
