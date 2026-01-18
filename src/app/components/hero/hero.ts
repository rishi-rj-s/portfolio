import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-hero',
  imports: [
    CommonModule,
  ],
  templateUrl: './hero.html',
  styles: [`
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    @keyframes fadeInOpacity {
      from { opacity: 0; }
      to { opacity: 0.1; }
    }

    .animate-float {
      animation: float 6s ease-in-out infinite;
    }

    .animate-float-with-fade {
      opacity: 0;
      animation-name: float, fadeInOpacity;
      animation-duration: 6s, 1.5s;
      animation-timing-function: ease-in-out, ease-out;
      animation-iteration-count: infinite, 1;
      animation-fill-mode: none, forwards;
    }
  `]
})
export class Hero {}