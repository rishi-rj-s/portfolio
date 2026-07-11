import { Component, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { ContactMail } from '../../services/contact';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, NgHcaptchaModule],
  template: `
    <section id="contact" class="relative border-t border-[var(--color-border)] overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">
        <!-- Left panel -->
        <div
          class="relative page-gutter py-[var(--section-pad-y)] flex flex-col justify-between bg-[var(--color-ink)] text-[var(--color-background)]"
        >
          <div>
            <p class="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-primary)] mb-6">
              04 — Contact
            </p>
            <h2 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.04em] leading-[0.95] mb-6">
              Let's build<br />
              something<br />
              <span class="text-[var(--color-primary)]">that ships.</span>
            </h2>
            <p class="text-base md:text-lg opacity-70 max-w-md leading-relaxed">
              Roles, freelance systems, or product ideas — drop a message. I reply personally.
            </p>
          </div>

          <div class="mt-16 space-y-4 font-mono text-sm">
            <a
              href="mailto:rishirajsajeev@gmail.com"
              class="block hover:text-[var(--color-primary)] transition-colors"
              >rishirajsajeev@gmail.com</a
            >
            <a
              href="https://github.com/rishi-rj-s"
              target="_blank"
              rel="noopener noreferrer"
              class="block opacity-70 hover:opacity-100 hover:text-[var(--color-primary)] transition-colors"
              >github.com/rishi-rj-s</a
            >
            <a
              href="https://linkedin.com/in/rishiraj-sajeev"
              target="_blank"
              rel="noopener noreferrer"
              class="block opacity-70 hover:opacity-100 hover:text-[var(--color-primary)] transition-colors"
              >linkedin.com/in/rishiraj-sajeev</a
            >
          </div>

          <div
            class="absolute bottom-0 right-0 text-[clamp(6rem,20vw,14rem)] font-black leading-none opacity-[0.06] select-none pointer-events-none translate-x-1/4 translate-y-1/4"
            aria-hidden="true"
          >
            GO
          </div>
        </div>

        <!-- Right form -->
        <div class="page-gutter py-[var(--section-pad-y)] flex items-center bg-[var(--color-background)]">
          <div class="w-full max-w-lg mx-auto lg:mx-0 lg:ml-8 xl:ml-16">
            @if (!isSubmitted()) {
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" autocomplete="on" class="space-y-8 animate-fade-in-up">
                <div class="relative">
                  <label for="name" class="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-text-muted)] block mb-2"
                    >Name</label
                  >
                  <input
                    type="text"
                    formControlName="name"
                    id="name"
                    name="name"
                    autocomplete="name"
                    class="contact-input w-full bg-transparent border-b-2 border-[var(--color-border)] py-3 text-xl text-[var(--color-text)] focus:border-[var(--color-primary)] transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div class="relative">
                  <label for="email" class="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-text-muted)] block mb-2"
                    >Email</label
                  >
                  <input
                    type="email"
                    formControlName="email"
                    id="email"
                    name="email"
                    autocomplete="email"
                    class="contact-input w-full bg-transparent border-b-2 border-[var(--color-border)] py-3 text-xl text-[var(--color-text)] focus:border-[var(--color-primary)] transition-colors"
                    placeholder="you@company.com"
                  />
                </div>

                <div class="relative">
                  <label for="message" class="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-text-muted)] block mb-2"
                    >Message</label
                  >
                  <textarea
                    formControlName="message"
                    id="message"
                    name="message"
                    autocomplete="off"
                    rows="3"
                    (input)="autoResize($event)"
                    class="contact-input w-full bg-transparent border-b-2 border-[var(--color-border)] py-3 text-xl text-[var(--color-text)] focus:border-[var(--color-primary)] transition-colors resize-none overflow-hidden"
                    placeholder="What are we building?"
                  ></textarea>
                </div>

                @if (showCaptcha()) {
                  <div class="flex justify-start scale-90 origin-left">
                    <ng-hcaptcha
                      id="h-captcha"
                      name="h-captcha"
                      [siteKey]="siteKey"
                      (verify)="onCaptchaResolved($event)"
                    ></ng-hcaptcha>
                  </div>
                }

                <button
                  type="submit"
                  id="submit-button"
                  name="submit-button"
                  [disabled]="contactForm.invalid || isSubmitting() || !canSubmit()"
                  class="signal-btn w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {{ isSubmitting() ? 'Sending…' : 'Send message' }}
                  @if (!isSubmitting()) {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                  }
                </button>

                @if (errorMessage()) {
                  <p class="text-red-500 text-sm font-mono" role="alert">{{ errorMessage() }}</p>
                }
              </form>
            } @else {
              <div class="animate-scale-in py-8">
                <p class="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-primary)] mb-4">Sent</p>
                <h3 class="text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text)] mb-4">
                  Message received.
                </h3>
                <p class="text-[var(--color-text-muted)] mb-8">I'll get back to you shortly.</p>
                <button type="button" (click)="resetForm()" class="signal-btn signal-btn-ghost">
                  Send another
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .contact-input {
        outline: none !important;
        box-shadow: none !important;
      }
      .contact-input::placeholder {
        color: var(--color-text-muted);
        opacity: 0.45;
      }
    `,
  ],
})
export class ContactForm {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactMail);
  private platformId = inject(PLATFORM_ID);

  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly isLocalhost =
    this.isBrowser &&
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
  });

  isSubmitting = signal(false);
  isSubmitted = signal(false);
  errorMessage = signal('');
  captchaToken = signal('');
  siteKey = environment.hcaptchaSiteKey;

  readonly showCaptcha = computed(() => this.isBrowser && !this.isLocalhost);
  readonly canSubmit = computed(() => !!this.captchaToken() || this.isLocalhost);

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  onCaptchaResolved(token: string) {
    this.captchaToken.set(token);
  }

  onSubmit() {
    if (this.contactForm.valid && this.canSubmit()) {
      this.isSubmitting.set(true);
      this.errorMessage.set('');
      const payload = {
        ...this.contactForm.value,
        subject: `Portfolio Contact from ${this.contactForm.value.name}`,
      };
      const token = this.captchaToken() || 'localhost-dev-bypass';
      this.contactService.sendForm(payload, token).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.isSubmitted.set(true);
          this.captchaToken.set('');
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err.message || 'Failed to send message. Please try again.');
        },
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
