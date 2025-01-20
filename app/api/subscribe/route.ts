import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Subscription } from '@/app/models/index';
import { Resend } from 'resend';
import WelcomeEmail from '@/app/emails/WelcomeEmail';

// Add error handling and timeout
export const maxDuration = 3; // Set max duration to 10 seconds
export const dynamic = 'force-dynamic'; // Disable static optimization

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmailWithRetry(email: string, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await resend.emails.send({
        from: 'tldrSEC <noreply@waitlist.tldrsec.app>',
        to: email,
        subject: 'Welcome to tldrSEC Waitlist!',
        react: WelcomeEmail({ email })
      });
      return;
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Define headers once
const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
};

export async function POST(request: Request) {
  try {
    // Add timeout to DB connection
    const dbPromise = Promise.race([
      connectDB(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 5000)
      )
    ]);

    // Parse request body
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400, headers }
      );
    }

    // Wait for DB connection with error handling
    try {
      await dbPromise;
    } catch (error) {
      console.error('Database connection error:', error);
      return NextResponse.json(
        { message: 'Service temporarily unavailable' },
        { status: 503, headers }
      );
    }

    // Find existing subscription first
    const existing = await Subscription.findOne({ email });
    
    if (existing) {
      return NextResponse.json(
        { message: 'Email already subscribed' },
        { status: 400, headers }
      );
    }

    // Create new subscription
    await Subscription.create({
      email,
      createdAt: new Date()
    });

    // Send welcome email asynchronously
    sendEmailWithRetry(email).catch(error => {
      console.error('Welcome email error after retries:', error);
    });

    return NextResponse.json(
      { message: 'You are now on the waitlist!' },
      { status: 201, headers }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    
    // Check for JSON parsing error
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: 'Invalid request format' },
        { status: 400, headers }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500, headers }
    );
  }
} 