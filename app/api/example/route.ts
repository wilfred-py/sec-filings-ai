import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Email Schema
const EmailSchema = new mongoose.Schema({
  emailAddress: String,
  createdAt: { type: Date, default: Date.now }
});

// Get or create model
const Email = mongoose.models.Email || mongoose.model('Email', EmailSchema);

export async function GET() {
  try {
    await connectDB();
    const examples = await Email.find({});
    return NextResponse.json({ examples }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const newExample = await Email.create(body);
    return NextResponse.json(newExample, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 