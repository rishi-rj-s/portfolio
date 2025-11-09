import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, timeout, retry, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Web3FormsResponse {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactMail {
  private readonly WEB3_API_URL = environment.web3formsUrl;
  private readonly ACCESS_KEY = environment.web3formsKey;
  private readonly REQUEST_TIMEOUT = 15000; // 15 seconds

  constructor(private http: HttpClient) {}

  sendForm(payload: ContactFormPayload, hCaptchaToken: string): Observable<Web3FormsResponse> {
    // Validate payload
    if (!this.ACCESS_KEY) {
      return throwError(() => new Error('Web3Forms access key not configured'));
    }

    if (!hCaptchaToken) {
      return throwError(() => new Error('hCaptcha token is required'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const data = {
      access_key: this.ACCESS_KEY,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      subject: payload.subject.trim(),
      message: payload.message.trim(),
      from_name: payload.name.trim(),
      replyto: payload.email.trim().toLowerCase(),
      'h-captcha-response': hCaptchaToken
    };

    return this.http.post<Web3FormsResponse>(this.WEB3_API_URL, data, { headers }).pipe(
      timeout(this.REQUEST_TIMEOUT),
      retry({
        count: 1,
        delay: 1000,
        resetOnSuccess: true
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while sending your message.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
          break;
        case 400:
          errorMessage = 'Invalid form data. Please check your inputs.';
          break;
        case 401:
          errorMessage = 'Authentication failed. Please contact support.';
          break;
        case 403:
          errorMessage = 'Access denied. Please verify the captcha.';
          break;
        case 422:
          errorMessage = 'Form validation failed. Please check all fields.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = error.error?.message || errorMessage;
      }
    }

    console.error('ContactMail Error:', {
      status: error.status,
      message: errorMessage,
      error: error.error
    });

    return throwError(() => ({
      status: error.status,
      message: errorMessage
    }));
  }
}