import { NextResponse } from 'next/server';
import User from '@/app/models/User';
import connectDB from '@/lib/mongodb';
import { Resend } from 'resend';
import crypto from 'crypto';
import WelcomeEmail from '@/app/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

// Utility function for exponential backoff with jitter
function calculateBackoff(attempt: number, baseDelay = 1000, maxDelay = 10000) {
  const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
  const jitter = exponentialDelay * 0.1 * (Math.random() * 2 - 1);
  return exponentialDelay + jitter;
}

async function sendEmailWithRetry(email: string, verificationToken: string, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await resend.emails.send({
        from: 'tldrSEC <noreply@waitlist.tldrsec.app>',
        to: email,
        subject: 'Verify Your Email - tldrSEC Waitlist',
        react: WelcomeEmail({ token: verificationToken })
      });
      return;
    } catch (error) {
      console.error(`Email attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) throw error;
      
      const backoffTime = calculateBackoff(attempt);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email } = await request.json();

    // Find the user
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { 
        status: 404 
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({ 
        error: 'Email is already verified' 
      }, { 
        status: 400 
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    // Send new verification email
    await sendEmailWithRetry(email, verificationToken);

    return NextResponse.json({ 
      message: 'Verification email sent' 
    }, { 
      status: 200 
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ 
      error: 'Failed to resend verification email' 
    }, { 
      status: 500 
    });
  }
}
