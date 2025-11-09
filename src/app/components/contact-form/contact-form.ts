import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
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
  templateUrl: './contact-form.html'
})
export class ContactForm {
  // Regular properties work fine with ngModel
  formData: FormField = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  showErrors = signal(false);
  isSubmitting = signal(false);
  submitSuccess = signal(false);

  isFormValid(): boolean {
    return this.formData.name.trim() !== '' &&
      this.formData.email.trim() !== '' &&
      this.isValidEmail(this.formData.email) &&
      this.formData.subject.trim() !== '' &&
      this.formData.message.trim() !== '';
  }

  isFieldValid(field: keyof FormField): boolean {
    if (field === 'email') {
      return this.formData.email.trim() !== '' && this.isValidEmail(this.formData.email);
    }
    return this.formData[field].trim() !== '';
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

    setTimeout(() => {
      console.log('Form submitted:', this.formData);

      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };

      this.isSubmitting.set(false);
      this.submitSuccess.set(true);
      this.showErrors.set(false);

      setTimeout(() => {
        this.submitSuccess.set(false);
      }, 5000);
    }, 2000);
  }
}