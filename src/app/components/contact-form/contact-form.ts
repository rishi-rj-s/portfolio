import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, signal, AfterViewInit, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactMail, ContactFormPayload } from '../../services/contact';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    hcaptcha?: any;
    hcaptchaOnLoad?: () => void;
  }
}

@Component({
  selector: 'app-contact-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.html'
})
export class ContactForm implements OnInit, AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private hCaptchaWidgetId: string | null = null;
  private scriptLoadTimeout?: number;
  private renderAttempts = 0;
  private readonly MAX_RENDER_ATTEMPTS = 10;

  // SSR-safe check
  isBrowser = signal(false);

  formData: ContactFormPayload = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  showErrors = signal(false);
  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal<string | null>(null);
  captchaReady = signal(false);

  constructor(
    private contactMail: ContactMail,
    @Inject(PLATFORM_ID) private platformId: Object,
    private elementRef: ElementRef
  ) {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }

  ngOnInit() {
    // defer script loading to intersection observer
  }

  ngAfterViewInit() {
    if (this.isBrowser()) {
      // Check if already loaded
      if (window.hcaptcha && !this.captchaReady()) {
        this.renderHCaptcha();
      } else if ('IntersectionObserver' in window) {
        // Lazy load on scroll
        this.observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            this.loadHCaptchaScript();
            this.observer?.disconnect();
            this.observer = null;
          }
        }, { rootMargin: '100px' });

        this.observer.observe(this.elementRef.nativeElement);
      } else {
        // Fallback for browsers without IntersectionObserver
        this.loadHCaptchaScript();
      }
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.scriptLoadTimeout) {
      clearTimeout(this.scriptLoadTimeout);
    }
    this.cleanupCaptcha();
  }

  private cleanupCaptcha() {
    if (this.isBrowser() && window.hcaptcha && this.hCaptchaWidgetId) {
      try {
        window.hcaptcha.remove(this.hCaptchaWidgetId);
        this.hCaptchaWidgetId = null;
      } catch (e) {
        console.warn('hCaptcha cleanup failed:', e);
      }
    }
  }

  private loadHCaptchaScript() {
    const scriptId = 'hcaptcha-script';

    // Check if script already exists
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      // Script exists, check if hcaptcha is loaded
      if (window.hcaptcha) {
        this.renderHCaptcha();
      } else {
        // Wait for it to load
        window.hcaptchaOnLoad = () => this.renderHCaptcha();
      }
      return;
    }

    // Set up callback before loading script
    window.hcaptchaOnLoad = () => {
      // console.log('hCaptcha script loaded');
      this.renderHCaptcha();
    };

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://js.hcaptcha.com/1/api.js?onload=hcaptchaOnLoad&render=explicit`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.error('Failed to load hCaptcha script');
      this.submitError.set('Failed to load security verification. Please refresh the page.');
      this.captchaReady.set(false);
    };

    document.head.appendChild(script);

    // Timeout fallback
    this.scriptLoadTimeout = window.setTimeout(() => {
      if (!this.captchaReady()) {
        this.submitError.set('Security verification timed out. Please refresh the page.');
      }
    }, 15000);
  }

  private renderHCaptcha() {
    // Safety check
    if (!this.isBrowser() || !window.hcaptcha) {
      return;
    }

    // Prevent multiple render attempts if already rendered
    if (this.captchaReady()) {
      return;
    }

    // Increment render attempts
    this.renderAttempts++;
    if (this.renderAttempts > this.MAX_RENDER_ATTEMPTS) {
      console.error('Max captcha render attempts reached');
      this.submitError.set('Failed to load captcha. Please refresh the page.');
      return;
    }

    // Wait for Angular to render the DOM
    setTimeout(() => {
      const container = document.querySelector('[data-captcha="true"]') as HTMLElement;

      if (!container) {
        console.warn(`Captcha container not found (attempt ${this.renderAttempts})`);
        // Retry after a delay
        if (this.renderAttempts < this.MAX_RENDER_ATTEMPTS) {
          this.renderHCaptcha();
        }
        return;
      }

      // Check if container is visible
      if (container.offsetParent === null) {
        console.warn('Captcha container is hidden');
        setTimeout(() => this.renderHCaptcha(), 200);
        return;
      }

      // Clear any existing content
      container.innerHTML = '';

      try {
        // console.log('Rendering hCaptcha...');
        this.hCaptchaWidgetId = window.hcaptcha.render(container, {
          sitekey: environment.hcaptchaSiteKey,
          theme: 'dark',
          size: 'normal',
          callback: (token: string) => {
            // console.log('Captcha completed');
            this.submitError.set(null);
          },
          'expired-callback': () => {
            // console.log('Captcha expired');
            this.submitError.set('Security verification expired. Please verify again.');
          },
          'error-callback': (error: any) => {
            console.error('Captcha error:', error);
            this.submitError.set('Security verification failed. Please try again.');
          },
          'chalexpired-callback': () => {
            // console.log('Challenge expired');
            this.submitError.set('Challenge expired. Please try again.');
          }
        });

        this.captchaReady.set(true);
        // console.log('hCaptcha rendered successfully, widget ID:', this.hCaptchaWidgetId);
      } catch (error) {
        console.error('hCaptcha render error:', error);
        this.submitError.set('Failed to initialize security verification.');
        this.captchaReady.set(false);
      }
    }, 100);
  }

  private getCaptchaToken(): string | null {
    if (!this.isBrowser() || !window.hcaptcha || !this.hCaptchaWidgetId) {
      return null;
    }

    try {
      const response = window.hcaptcha.getResponse(this.hCaptchaWidgetId);
      // console.log('Captcha token retrieved:', response ? 'exists' : 'empty');
      return response || null;
    } catch (error) {
      console.error('Error getting captcha response:', error);
      return null;
    }
  }

  private resetCaptcha() {
    if (!this.isBrowser() || !window.hcaptcha || !this.hCaptchaWidgetId) {
      return;
    }

    try {
      window.hcaptcha.reset(this.hCaptchaWidgetId);
      // console.log('Captcha reset');
    } catch (error) {
      console.error('Error resetting captcha:', error);
    }
  }

  isFormValid(): boolean {
    return (
      this.formData.name.trim() !== '' &&
      this.formData.email.trim() !== '' &&
      this.isValidEmail(this.formData.email) &&
      this.formData.subject.trim() !== '' &&
      this.formData.message.trim() !== ''
    );
  }

  isFieldValid(field: keyof ContactFormPayload): boolean {
    if (field === 'email') {
      return this.isValidEmail(this.formData.email);
    }
    return this.formData[field].trim() !== '';
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  handleSubmit() {
    this.showErrors.set(true);
    this.submitError.set(null);

    // Validate form fields
    if (!this.isFormValid()) {
      this.submitError.set('Please fill in all required fields correctly.');
      return;
    }

    // Check if in browser
    if (!this.isBrowser()) {
      this.submitError.set('Form submission not available during server-side rendering.');
      return;
    }

    // Check if captcha is ready
    if (!this.captchaReady()) {
      this.submitError.set('Security verification is still loading. Please wait.');
      return;
    }

    // Get captcha token
    const captchaToken = this.getCaptchaToken();
    if (!captchaToken) {
      this.submitError.set('Please complete the security verification.');
      return;
    }

    // console.log('Submitting form with captcha token');
    this.isSubmitting.set(true);
    this.submitSuccess.set(false);

    // Submit form with captcha token
    this.contactMail.sendForm(this.formData, captchaToken).subscribe({
      next: (res: any) => {
        // console.log('Form submission response:', res);
        this.isSubmitting.set(false);

        if (res.success) {
          // Success - reset everything
          this.formData = { name: '', email: '', subject: '', message: '' };
          this.submitSuccess.set(true);
          this.showErrors.set(false);
          this.submitError.set(null);
          this.resetCaptcha();

          // Auto-hide success message
          setTimeout(() => this.submitSuccess.set(false), 5000);
        } else {
          // API returned false
          this.submitError.set(res.message || 'Failed to send message. Please try again.');
          this.resetCaptcha();
        }
      },
      error: (err: any) => {
        console.error('Form submission failed:', err);
        this.isSubmitting.set(false);

        // Show user-friendly error
        this.submitError.set(err.message || 'Failed to send message. Please try again later.');
        this.resetCaptcha();
      }
    });
  }
}