import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';


interface FormField {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact-form',
  imports: [
    CommonModule,
    FormsModule,
  ],
  template: `
    <section class="contact-section" aria-labelledby="contact-heading">
      <div class="container">
        <div class="contact-content">
          <div class="contact-info">
            <h2 id="contact-heading" class="section-title">Let's Build Something</h2>
            <p class="section-description">
              Open to full-stack development opportunities, architectural consultations, 
              and collaborative projects. Let's discuss how we can work together.
            </p>

            <div class="contact-methods">
              <div class="contact-method">
                <div class="method-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div class="method-content">
                  <div class="method-label">Email</div>
                  <a href="mailto:rishirajsajeev@gmail.com" class="method-value">rishirajsajeev&#64;gmail.com</a>
                </div>
              </div>

              <div class="contact-method">
                <div class="method-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div class="method-content">
                  <div class="method-label">Phone</div>
                  <a href="tel:+917012256686" class="method-value">+91 7012256686</a>
                </div>
              </div>

              <div class="contact-method">
                <div class="method-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div class="method-content">
                  <div class="method-label">Location</div>
                  <div class="method-value">Kerala, India</div>
                </div>
              </div>
            </div>
          </div>

          <form class="contact-form" 
                (ngSubmit)="handleSubmit()"
                [attr.aria-label]="'Contact form'">
            
            <div class="form-group">
              <label for="name" class="form-label">
                Name
                <span class="required" aria-label="required">*</span>
              </label>
              <input 
                type="text" 
                id="name" 
                name="name"
                class="form-input"
                [(ngModel)]="formData().name"
                [class.error]="showErrors() && !isFieldValid('name')"
                required
                aria-required="true"
                aria-describedby="name-error"
                placeholder="Your full name">
              @if (showErrors() && !isFieldValid('name')) {
                <span id="name-error" class="error-message" role="alert">Name is required</span>
              }
            </div>

            <div class="form-group">
              <label for="email" class="form-label">
                Email
                <span class="required" aria-label="required">*</span>
              </label>
              <input 
                type="email" 
                id="email" 
                name="email"
                class="form-input"
                [(ngModel)]="formData().email"
                [class.error]="showErrors() && !isFieldValid('email')"
                required
                aria-required="true"
                aria-describedby="email-error"
                placeholder="your.email@example.com">
              @if (showErrors() && !isFieldValid('email')) {
                <span id="email-error" class="error-message" role="alert">Valid email is required</span>
              }
            </div>

            <div class="form-group">
              <label for="subject" class="form-label">
                Subject
                <span class="required" aria-label="required">*</span>
              </label>
              <input 
                type="text" 
                id="subject" 
                name="subject"
                class="form-input"
                [(ngModel)]="formData().subject"
                [class.error]="showErrors() && !isFieldValid('subject')"
                required
                aria-required="true"
                aria-describedby="subject-error"
                placeholder="What's this about?">
              @if (showErrors() && !isFieldValid('subject')) {
                <span id="subject-error" class="error-message" role="alert">Subject is required</span>
              }
            </div>

            <div class="form-group">
              <label for="message" class="form-label">
                Message
                <span class="required" aria-label="required">*</span>
              </label>
              <textarea 
                id="message" 
                name="message"
                class="form-textarea"
                [(ngModel)]="formData().message"
                [class.error]="showErrors() && !isFieldValid('message')"
                rows="6"
                required
                aria-required="true"
                aria-describedby="message-error"
                placeholder="Tell me about your project or inquiry..."></textarea>
              @if (showErrors() && !isFieldValid('message')) {
                <span id="message-error" class="error-message" role="alert">Message is required</span>
              }
            </div>

            <button 
              type="submit" 
              class="submit-button"
              [disabled]="isSubmitting()"
              [attr.aria-busy]="isSubmitting()">
              @if (isSubmitting()) {
                <span class="spinner" aria-hidden="true"></span>
                <span>Sending...</span>
              } @else {
                <span>Send Message</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              }
            </button>

            @if (submitSuccess()) {
              <div class="success-message" role="status">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Message sent successfully! I'll get back to you soon.</span>
              </div>
            }
          </form>
        </div>
      </div>
    </section>
  `,
  styles: `
    .contact-section {
      padding-block: 6rem;
      background: linear-gradient(180deg, 
        var(--color-background) 0%, 
        color-mix(in srgb, var(--color-card) 20%, var(--color-background)) 100%);
    }

    .container {
      inline-size: 100%;
      max-inline-size: 1280px;
      margin-inline: auto;
      padding-inline: 1.5rem;
    }

    .contact-content {
      display: grid;
      gap: 4rem;
      align-items: start;
    }

    @media (min-width: 1024px) {
      .contact-content {
        grid-template-columns: 1fr 1.5fr;
      }
    }

    .section-title {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 800;
      margin-block-end: 1rem;
      background: linear-gradient(135deg, var(--color-text), var(--color-primary));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .section-description {
      font-size: 1.125rem;
      line-height: 1.7;
      color: var(--color-text-muted);
      margin-block-end: 3rem;
    }

    .contact-methods {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .contact-method {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.25rem;
      background: color-mix(in srgb, var(--color-card) 60%, transparent);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      transition: all 0.3s ease;
    }

    .contact-method:hover {
      background: var(--color-card);
      border-color: var(--color-primary);
      transform: translateX(4px);
    }

    .method-icon {
      flex-shrink: 0;
      inline-size: 48px;
      block-size: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--color-primary) 15%, transparent);
      border-radius: 0.5rem;
      color: var(--color-primary);
    }

    .method-content {
      flex: 1;
    }

    .method-label {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin-block-end: 0.25rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .method-value {
      font-size: 1.125rem;
      color: var(--color-text);
      font-weight: 500;
      text-decoration: none;
      display: block;
    }

    a.method-value:hover {
      color: var(--color-primary);
    }

    .contact-form {
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: 1.25rem;
      padding: 2.5rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }

    .form-group {
      margin-block-end: 1.5rem;
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text);
      margin-block-end: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .required {
      color: var(--color-accent);
      margin-inline-start: 0.25rem;
    }

    .form-input,
    .form-textarea {
      inline-size: 100%;
      padding-inline: 1rem;
      padding-block: 0.875rem;
      background: color-mix(in srgb, var(--color-background) 50%, transparent);
      border: 1px solid var(--color-border);
      border-radius: 0.5rem;
      color: var(--color-text);
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.3s ease;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
    }

    .form-input.error,
    .form-textarea.error {
      border-color: var(--color-accent);
    }

    .form-textarea {
      resize: vertical;
      min-block-size: 120px;
    }

    .error-message {
      display: block;
      font-size: 0.875rem;
      color: var(--color-accent);
      margin-block-start: 0.5rem;
    }

    .submit-button {
      inline-size: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding-inline: 2rem;
      padding-block: 1rem;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-button:hover:not(:disabled) {
      background: color-mix(in srgb, var(--color-primary) 90%, black);
      transform: translateY(-2px);
      box-shadow: 0 8px 16px color-mix(in srgb, var(--color-primary) 40%, transparent);
    }

    .submit-button:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      inline-size: 18px;
      block-size: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: color-mix(in srgb, var(--color-primary) 15%, transparent);
      border: 1px solid var(--color-primary);
      border-radius: 0.5rem;
      color: var(--color-primary);
      margin-block-start: 1.5rem;
      font-weight: 500;
    }

    @media (prefers-reduced-motion: reduce) {
      .contact-method,
      .form-input,
      .form-textarea,
      .submit-button {
        transition: none;
      }
      
      .spinner {
        animation: none;
      }
    }
  `,
})
export class ContactForm {
    // Signal-based form state
  formData = signal<FormField>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  showErrors = signal(false);
  isSubmitting = signal(false);
  submitSuccess = signal(false);

  // Computed validation
  isFormValid = computed(() => {
    const data = this.formData();
    return data.name.trim() !== '' &&
           data.email.trim() !== '' &&
           this.isValidEmail(data.email) &&
           data.subject.trim() !== '' &&
           data.message.trim() !== '';
  });

  isFieldValid(field: keyof FormField): boolean {
    const data = this.formData();
    if (field === 'email') {
      return data.email.trim() !== '' && this.isValidEmail(data.email);
    }
    return data[field].trim() !== '';
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  handleSubmit() {
    this.showErrors.set(true);

    if (!this.isFormValid()) {
      return;
    }

    this.isSubmitting.set(true);
    this.submitSuccess.set(false);

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', this.formData());
      
      // Reset form
      this.formData.set({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      this.isSubmitting.set(false);
      this.submitSuccess.set(true);
      this.showErrors.set(false);

      // Hide success message after 5 seconds
      setTimeout(() => {
        this.submitSuccess.set(false);
      }, 5000);
    }, 2000);
  }
}