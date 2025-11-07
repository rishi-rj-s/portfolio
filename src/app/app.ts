import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar
  ],
  template: `
  <app-navbar />
  <router-outlet />
  `,
  styles: [`
    :host {
      display: block;
      min-block-size: 100vh;
      background-color: var(--color-background);
      color: var(--color-text);
    }
  `]
})
export class App {}