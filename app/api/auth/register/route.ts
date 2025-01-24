import { NextResponse } from 'next/server';
import User from '@/app/models/User';
import { generateToken } from '@/lib/jwt';
import WelcomeEmail from '@/app/emails/WelcomeEmail';
import connectDB from '@/lib/mongodb';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Utility function for exponential backoff with jitter
function calculateBackoff(attempt: number, baseDelay = 1000, maxDelay = 10000) {
    // Calculate exponential backoff: 2^attempt * baseDelay
    const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
    // Add random jitter (±10%) to prevent thundering herd
    const jitter = exponentialDelay * 0.1 * (Math.random() * 2 - 1);
    return exponentialDelay + jitter;
  }

  async function sendEmailWithRetry(email: string, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await resend.emails.send({
          from: 'tldrSEC <noreply@waitlist.tldrsec.app>',
          to: email,
          subject: 'Welcome to tldrSEC Waitlist!',
          react: WelcomeEmail({ })
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

    const { email, password } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ 
        error: 'Email already registered' 
      }, { 
        status: 400 
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      roles: ['user']
    });

    // Generate token
    const token = generateToken(user);

    // Send welcome email
    await sendEmailWithRetry(email);

    return NextResponse.json({
      token,
      user: {
        email: user.email,
        roles: user.roles
      }
    }, { 
      status: 201 
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: 'Registration failed' 
    }, { 
      status: 500 
    });
  }
} 