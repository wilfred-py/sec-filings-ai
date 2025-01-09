import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import WelcomeEmail from '@/app/emails/WelcomeEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email Subscription Schema
const SubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Get or create model
const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { email } = await request.json();
    
    // Validate email
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return NextResponse.json(
        { message: 'Email already subscribed' },
        { status: 400 }
      );
    }

    // Create new subscription
    await Subscription.create({ email });

    // Send welcome email
    await resend.emails.send({
      from: 'SEC Filings AI <onboarding@resend.dev>',
      to: 'wilfredchen1@gmail.com',
      subject: 'Welcome to SEC Filings AI Waitlist!',
      react: WelcomeEmail({ email }),
    });

    return NextResponse.json(
      { message: 'You are now on the waitlist!' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your subscription' },
      { status: 500 }
    );
  }
} 