import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { ContactMail } from '../../services/contact';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, NgHcaptchaModule],
  template: `
    <section id="contact" class="flex flex-col justify-center items-center bg-[var(--color-background)] px-6 pt-32 pb-5 min-h-[80vh] relative overflow-hidden">
      
      <!-- Content Container -->
      <div class="w-full max-w-2xl relative z-10">
         @if (!isSubmitted()) {
            <div class="animate-fade-in-up">
              <h2 class="text-4xl md:text-6xl font-black mb-12 text-[var(--color-text)] tracking-tight">LET'S TALK</h2>
              
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-12">
                
                <!-- Name Field -->
                <div class="group relative">
                  <input type="text" formControlName="name" id="name" placeholder=" "
                         style="outline: none !important; box-shadow: none !important;"
                         class="block w-full bg-transparent border-b-2 border-[var(--color-border)] py-4 text-xl md:text-2xl text-[var(--color-text)] focus:border-[var(--color-text)] transition-colors peer">
                  <label for="name" 
                         class="absolute left-0 top-4 text-xl text-[var(--color-text-muted)] duration-300 transform -translate-y-8 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 cursor-text">
                    What's your name?
                  </label>
                </div>

                <!-- Email Field -->
                <div class="group relative">
                  <input type="email" formControlName="email" id="email" placeholder=" "
                         style="outline: none !important; box-shadow: none !important;"
                         class="block w-full bg-transparent border-b-2 border-[var(--color-border)] py-4 text-xl md:text-2xl text-[var(--color-text)] focus:border-[var(--color-text)] transition-colors peer">
                  <label for="email" 
                         class="absolute left-0 top-4 text-xl text-[var(--color-text-muted)] duration-300 transform -translate-y-8 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 cursor-text">
                    Your email address
                  </label>
                </div>

                <!-- Message Field -->
                <div class="group relative">
                  <textarea formControlName="message" id="message" rows="1" placeholder=" "
                            (input)="autoResize($event)"
                            style="outline: none !important; box-shadow: none !important;"
                            class="block w-full bg-transparent border-b-2 border-[var(--color-border)] py-4 text-xl md:text-2xl text-[var(--color-text)] focus:border-[var(--color-text)] transition-colors peer resize-none overflow-hidden"></textarea>
                  <label for="message" 
                         class="absolute left-0 top-4 text-xl text-[var(--color-text-muted)] duration-300 transform -translate-y-8 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 cursor-text">
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
                          class="group relative inline-flex items-center gap-4 text-xl font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="relative z-10 text-[var(--color-text)] group-hover:text-[var(--color-background)] transition-colors duration-300">
                       {{ isSubmitting() ? 'Sending...' : 'Send Message' }}
                    </span>
                    <div class="w-12 h-12 rounded-full border border-[var(--color-text)] flex items-center justify-center group-hover:bg-[var(--color-text)] group-hover:scale-110 transition-all duration-300">
                       <svg class="w-5 h-5 text-[var(--color-text)] group-hover:text-[var(--color-background)] transition-colors duration-300 transform group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                       </svg>
                    </div>
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