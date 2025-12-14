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
  <div class="relative min-h-screen">
    <app-navbar />
    <div class="relative">
      <router-outlet />
    </div>
  </div>
  `
})
export class App { }