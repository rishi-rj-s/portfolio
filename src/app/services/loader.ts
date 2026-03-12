import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _webglReady = signal(false);
  readonly webglReady = this._webglReady.asReadonly();

  setWebglReady() {
    console.log('LoaderService: WebGL ready signal received');
    this._webglReady.set(true);
    this.updateStatus('CORE SYSTEMS ONLINE');
  }

  updateStatus(message: string) {
    if (typeof document !== 'undefined') {
      const statusEl = document.getElementById('loader-status');
      if (statusEl) {
        statusEl.textContent = message;
      }
    }
    console.log(`Loader Status: ${message}`);
  }
}
