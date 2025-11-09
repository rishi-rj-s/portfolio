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

    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
  `]
})
export class Hero {}