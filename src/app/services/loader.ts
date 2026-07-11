import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  updateStatus(message: string) {
    if (typeof document !== 'undefined') {
      const statusEl = document.getElementById('loader-status');
      if (statusEl) {
        statusEl.textContent = message;
      }
    }
  }
}
