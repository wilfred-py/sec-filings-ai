import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { rateLimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  try {
    // Apply rate limiting
    const limiter = await rateLimit(request);
    if (!limiter.success) {
      return new NextResponse(JSON.stringify({ 
        error: 'Too many requests' 
      }), { 
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': limiter.retryAfter?.toString() || '60'
        }
      });
    }

    // Check for auth token
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return new NextResponse(JSON.stringify({ 
        error: 'Unauthorized' 
      }), { 
        status: 401 
      });
    }

    // Verify token
    const decoded = await verifyToken(token);
    if (!decoded) {
      return new NextResponse(JSON.stringify({ 
        error: 'Invalid token' 
      }), { 
        status: 401 
      });
    }

    // Add user info to request
    request.headers.set('user', JSON.stringify(decoded));
    
    return NextResponse.next();
  } catch (error) {
    return new NextResponse(JSON.stringify({ 
      error: 'Authentication failed' 
    }), { 
      status: 401 
    });
  }
}

export const config = {
  matcher: [
    '/api/user/:path*',
    '/api/admin/:path*'
  ]
}; 