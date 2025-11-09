import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule,
  ],
  templateUrl: './footer.html'
})
export class Footer {
  currentYear = new Date().getFullYear();
}