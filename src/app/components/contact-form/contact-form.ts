import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { ContactMail } from '../../services/contact';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, NgHcaptchaModule],
  providers: [],
  template: `
    <section id="contact" class="flex flex-col justify-center items-center px-6 min-h-screen relative overflow-hidden">
      
      <!-- Content Container -->
      <div class="w-full max-w-xl relative z-10">
         @if (!isSubmitted()) {
            <div class="animate-fade-in-up">
              <h2 class="text-4xl md:text-6xl font-black mb-8 text-[var(--color-text)] tracking-tight">LET'S TALK</h2>
              
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-6">
                
                <!-- Name Field -->
                <div class="group relative">
                  <input type="text" formControlName="name" id="name" placeholder=" "
                         style="outline: none !important; box-shadow: none !important;"
                         class="block w-full bg-transparent border-b-2 border-[var(--color-border)] py-3 text-lg md:text-xl text-[var(--color-text)] focus:border-[var(--color-text)] transition-colors peer">
                  <label for="name" 
                         class="absolute left-0 top-3 text-lg text-[var(--color-text-muted)] duration-300 transform -translate-y-7 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 cursor-text">
                    What's your name?
                  </label>
                </div>

                <!-- Email Field -->
                <div class="group relative">
                  <input type="email" formControlName="email" id="email" placeholder=" "
                         style="outline: none !important; box-shadow: none !important;"
                         class="block w-full bg-transparent border-b-2 border-[var(--color-border)] py-3 text-lg md:text-xl text-[var(--color-text)] focus:border-[var(--color-text)] transition-colors peer">
                  <label for="email" 
                         class="absolute left-0 top-3 text-lg text-[var(--color-text-muted)] duration-300 transform -translate-y-7 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 cursor-text">
                    Your email address
                  </label>
                </div>

                <!-- Message Field -->
                <div class="group relative">
                  <textarea formControlName="message" id="message" rows="1" placeholder=" "
                            (input)="autoResize($event)"
                            style="outline: none !important; box-shadow: none !important;"
                            class="block w-full bg-transparent border-b-2 border-[var(--color-border)] py-3 text-lg md:text-xl text-[var(--color-text)] focus:border-[var(--color-text)] transition-colors peer resize-none overflow-hidden"></textarea>
                  <label for="message" 
                         class="absolute left-0 top-3 text-lg text-[var(--color-text-muted)] duration-300 transform -translate-y-7 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 cursor-text">
                    Tell me about your project
                  </label>
                </div>

                <!-- hCaptcha (Centered) -->
                @if (isBrowser) {
                  <div class="flex justify-center transform scale-90">
                     <ng-hcaptcha 
                        [siteKey]="siteKey"
                        (verify)="onCaptchaResolved($event)">
                     </ng-hcaptcha>
                  </div>
                }

                <!-- Submit Button -->
                <div>
                  <button type="submit" [disabled]="contactForm.invalid || isSubmitting() || !captchaToken()"
                          class="group relative w-full overflow-hidden rounded-full border border-[var(--color-text)] bg-transparent py-3 md:py-4 text-lg font-bold uppercase tracking-widest text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50">
                    
                    <!-- Hover Slide Effect (Primary Color) -->
                    <div class="absolute inset-0 -translate-y-[101%] bg-[var(--color-primary)] transition-transform duration-300 ease-in-out group-hover:translate-y-0"></div>
                    
                    <!-- Content -->
                    <span class="relative z-10 flex items-center justify-center gap-3 transition-colors duration-300 group-hover:text-[var(--color-background)]">
                       <span>{{ isSubmitting() ? 'Transmitting...' : 'Send Message' }}</span>
                       <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                       </svg>
                    </span>
                  </button>
                  @if (errorMessage()) {
                    <p class="text-red-500 text-sm mt-4 font-mono">{{ errorMessage() }}</p>
                  }
                </div>
              </form>
            </div>
         } @else {
            <!-- Success Message -->
            <div class="flex flex-col items-center justify-center animate-scale-in py-20">
               <h3 class="text-4xl md:text-6xl font-black mb-6 text-[var(--color-text)] text-center">MESSAGE RECEIVED</h3>
               <p class="text-xl text-[var(--color-text-muted)] mb-12 text-center">I'll get back to you shortly.</p>
               <button (click)="resetForm()" class="text-sm font-bold uppercase tracking-widest border-b border-[var(--color-text)] pb-1 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors">
                  Send another
               </button>
            </div>
         }
      </div>

    </section>
  `
})
export class ContactForm {
  contactForm: FormGroup;
  isSubmitting = signal(false);
  isSubmitted = signal(false);
  errorMessage = signal('');
  captchaToken = signal('');
  siteKey = environment.hcaptchaSiteKey;
  isBrowser: boolean;

  constructor(
      private fb: FormBuilder,
      private contactService: ContactMail,
      @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  onCaptchaResolved(token: string) {
    this.captchaToken.set(token);
  }

  onSubmit() {
    if (this.contactForm.valid && this.captchaToken()) {
      this.isSubmitting.set(true);
      this.errorMessage.set('');

      const payload = {
         ...this.contactForm.value,
         subject: `Portfolio Contact from ${this.contactForm.value.name}`
      };
      
      this.contactService.sendForm(payload, this.captchaToken()).subscribe({
         next: () => {
            this.isSubmitting.set(false);
            this.isSubmitted.set(true);
            this.captchaToken.set(''); // Reset captcha
         },
         error: (err) => {
            this.isSubmitting.set(false);
            this.errorMessage.set(err.message || 'Failed to send message. Please try again.');
         }
      });
    }
  }

  resetForm() {
    this.contactForm.reset();
    this.isSubmitted.set(false);
    this.errorMessage.set('');
    this.captchaToken.set('');
  }
}