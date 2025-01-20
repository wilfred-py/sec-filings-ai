import { NextResponse } from 'next/server';
import Subscription from "@/app/models/Subscription"
import WelcomeEmail from '@/app/emails/WelcomeEmail';
import { Resend } from 'resend';
import connectDB from '@/lib/mongodb';
import { User } from '@/app/models';

const resend = new Resend(process.env.RESEND_API_KEY);



// Add these utility functions at the top of the file
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function sendEmailWithRetry(email: string, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await resend.emails.send({
        from: 'tldrSEC <noreply@waitlist.tldrsec.app>',
        subject: 'Welcome to tldrSEC Waitlist!',
        to: email,
        react: WelcomeEmail({ email }),
      });
      return;
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  } 
}

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
};

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find existing subscription first
    const existing = await Subscription.findOne({ email });
    
    if (existing) {
      return NextResponse.json(
        { message: 'Email already subscribed' },
        { status: 400 }
      );
    }

    // Create new subscription
    await Subscription.create({
      email,
      createdAt: new Date()
    });

    // Create new user
    await User.create({
      email,
      createdAt: new Date()
    });

    // Send welcome email asynchronously
    sendEmailWithRetry(email).catch(error => {
      console.error('Welcome email error after retries:', error);
    });

    return NextResponse.json(
      { message: 'You are now on the waitlist!' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    const status = errorMessage.includes('timeout') ? 504 : 500;
    
    return NextResponse.json(
      { message: errorMessage },
      { status }
    );
  }
} 