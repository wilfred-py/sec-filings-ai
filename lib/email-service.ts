import { Resend } from "resend";
import WelcomeEmail from "@/app/emails/WelcomeEmail";
import { ReactElement } from "react";

// Define types for email templates and their props
type EmailTemplate = ReactElement;
type EmailOptions = {
  to: string;
  subject: string;
  template: EmailTemplate;
};

// Create a service to handle email logic
export class EmailService {
  private static baseUrl = process.env.NEXT_PUBLIC_APP_URL_DEV;
  private static resend = new Resend(process.env.RESEND_API_KEY);
  private static readonly FROM_ADDRESS =
    "tldrSEC <noreply@waitlist.tldrsec.app>";
  private static readonly MAX_RETRIES = 3;

  // Base method for sending any email
  private static async sendEmail(options: EmailOptions): Promise<void> {
    if (!this.baseUrl) {
      throw new Error("APP_URL environment variable is not set");
    }

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        await this.resend.emails.send({
          from: this.FROM_ADDRESS,
          to: options.to,
          subject: options.subject,
          react: options.template,
        });
        return;
      } catch (error) {
        console.error(`Email attempt ${attempt} failed:`, error);
        if (attempt === this.MAX_RETRIES) throw error;

        const backoffTime = this.calculateBackoff(attempt);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }
  }

  // Utility method for backoff calculation
  private static calculateBackoff(
    attempt: number,
    baseDelay = 1000,
    maxDelay = 10000,
  ): number {
    const exponentialDelay = Math.min(
      baseDelay * Math.pow(2, attempt - 1),
      maxDelay,
    );
    const jitter = exponentialDelay * 0.1 * (Math.random() * 2 - 1);
    return exponentialDelay + jitter;
  }

  // Public methods for specific email types
  static async sendWelcomeEmail(email: string, token: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: "Welcome to tldrSEC!",
      template: WelcomeEmail({ token, baseUrl: this.baseUrl }),
    });
  }

  // Example of how to add more email types
  //   static async sendPasswordResetEmail(
  //     email: string,
  //     token: string,
  //   ): Promise<void> {
  //     await this.sendEmail({
  //       to: email,
  //       subject: "Reset Your Password - tldrSEC",
  //       template: PasswordResetEmail({ token, baseUrl: this.baseUrl }), // You'll create this component
  //     });
  //   }

  //   static async sendSubscriptionConfirmation(
  //     email: string,
  //     details: SubscriptionDetails,
  //   ): Promise<void> {
  //     await this.sendEmail({
  //       to: email,
  //       subject: "Subscription Confirmed - tldrSEC",
  //       template: SubscriptionEmail({ details, baseUrl: this.baseUrl }), // You'll create this component
  //     });
  //   }
}

// // Types for future email templates
// interface SubscriptionDetails {
//   plan: string;
//   startDate: Date;
//   // ... other subscription details
// }
