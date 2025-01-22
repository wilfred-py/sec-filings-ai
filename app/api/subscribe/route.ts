import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Subscription } from '@/app/models/index';  
import { Resend } from 'resend';
import WelcomeEmail from '@/app/emails/WelcomeEmail';

// Add error handling and timeout
export const maxDuration = 10; // Set max duration to 3 seconds
export const dynamic = 'force-dynamic'; // Disable static optimization

const resend = new Resend(process.env.RESEND_API_KEY);

// Calculate safe timeout duration (80% of maxDuration to leave buffer for cleanup)
const DB_TIMEOUT_MS = Math.floor(maxDuration * 1000 * 0.8);

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
        react: WelcomeEmail({ email })
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

// Define headers once
const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
};

// Add performance monitoring
const logTiming = (label: string, startTime: number) => {
  const duration = Date.now() - startTime;
  console.log(`[Timing] ${label}: ${duration}ms`);
  return Date.now(); // Return current time for next measurement
};

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    // Parse request body first to fail fast if invalid
    let email: string;
    try {
      const body = await request.json();
      email = body.email;
      logTiming('Request parsing', startTime);
    } catch (error) {
      console.error('Invalid request format', error);
      return NextResponse.json(
        { message: 'Invalid request format' },
        { status: 400, headers },
      );
    }

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400, headers }
      );
    }

    // DB Connection timing
    const dbStartTime = Date.now();
    const dbPromise = Promise.race([
      connectDB(),
      new Promise((_, reject) => 
        setTimeout(
          () => reject(new Error(`Database connection timeout after ${DB_TIMEOUT_MS}ms`)), 
          DB_TIMEOUT_MS
        )
      )
    ]);

    try {
      await dbPromise;
      logTiming('DB Connection', dbStartTime);
    } catch (error) {
      console.error('Database connection error details:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.name : 'Unknown type',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      const isTimeout = error instanceof Error && 
        (error.message.includes('timeout') || error.message.includes('ETIMEDOUT'));
      
      return NextResponse.json(
        { 
          message: isTimeout ? 
            'Service is experiencing high load, please try again' : 
            'Service temporarily unavailable'
        },
        { status: 503, headers }
      );
    }

    // DB Operations (these are fast, keep them synchronous)
    const dbOpStartTime = Date.now();
    const existing = await Subscription.findOne({ email });
    logTiming('DB Find Operation', dbOpStartTime);
    
    if (existing) {
      return NextResponse.json(
        { message: 'Email already subscribed' },
        { status: 400, headers }
      );
    }

    const createStartTime = Date.now();
    await Subscription.create({
      email,
      createdAt: new Date()
    });
    logTiming('DB Create Operation', createStartTime);

    // Start email send asynchronously without awaiting
    const emailStartTime = Date.now();
    sendEmailWithRetry(email)
      .then(() => {
        logTiming('Async Email Send', emailStartTime);
      })
      .catch((error) => {
        console.error('Async email sending error:', error);
      });

    // Return response immediately without waiting for email
    logTiming('Total Request Duration', startTime);
    return NextResponse.json(
      { 
        message: 'You are now on the waitlist! Please check your email shortly.',
        emailStatus: 'queued'
      },
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

// Add OPTIONS handler for CORS if needed
export async function OPTIONS() {
  return NextResponse.json(
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
}

// Add a GET handler that returns 405
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { 
      status: 405,
      headers: { 'Allow': 'POST' }
    }
  );
} 