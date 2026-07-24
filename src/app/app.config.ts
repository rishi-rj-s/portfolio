import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withViewTransitions({ skipInitialTransition: true }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),
    provideClientHydration(
      withIncrementalHydration()
    ),
    provideHttpClient(
      withFetch()
    ),
    // Config only — captcha UI/script loads with the deferred contact form chunk
    importProvidersFrom(
      NgHcaptchaModule.forRoot({
        siteKey: environment.hcaptchaSiteKey
      })
    )
  ]
};
