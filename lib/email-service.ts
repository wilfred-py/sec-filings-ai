import WelcomeEmail from "@/app/emails/WelcomeEmail";
import { Resend } from "resend";

// Create a service to handle email logic
export class EmailService {
  private static baseUrl = process.env.NEXT_PUBLIC_APP_URL_DEV;
  private static resend = new Resend(process.env.RESEND_API_KEY);

  static async sendWelcomeEmail(email: string, token: string) {
    if (!this.baseUrl) {
      throw new Error("APP_URL environment variable is not set");
    }

    return this.resend.emails.send({
      from: "tldrSEC <noreply@waitlist.tldrsec.app>",
      to: email,
      subject: "Welcome to tldrSEC!",
      react: WelcomeEmail({
        token,
        baseUrl: this.baseUrl, // Pass the server's environment variable
      }),
    });
  }
}
