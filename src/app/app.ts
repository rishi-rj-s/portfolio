import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
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