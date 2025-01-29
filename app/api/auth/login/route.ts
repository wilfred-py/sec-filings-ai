import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const limiter = await rateLimit(request);
    if (!limiter.success) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many login attempts' }), 
        { 
          status: 429,
          headers: { 'Retry-After': limiter.retryAfter?.toString() || '60' }
        }
      );
    }

    const { email, password } = await request.json();

    // Authenticate user
    const token = await AuthService.authenticateUser(email, password);

    return NextResponse.json({ 
      token,
      message: 'Login successful' 
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: 'Invalid credentials' 
    }, { 
      status: 401 
    });
  }
} 