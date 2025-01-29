import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export function withRoles(allowedRoles: string[]) {
  return async function roleMiddleware(request: NextRequest) {
    try {
      // Extract token from Authorization header
      const token = request.headers.get('authorization')?.split(' ')[1];
      if (!token) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Unauthorized',
            message: 'No authentication token provided'
          }), 
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Verify JWT token
      const decoded = await verifyToken(token);
      if (!decoded) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Unauthorized',
            message: 'Invalid authentication token'
          }), 
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Check if user has required role
      const hasRequiredRole = allowedRoles.some(role => 
        decoded.roles.includes(role)
      );

      if (!hasRequiredRole) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Forbidden',
            message: 'Insufficient permissions to access this resource'
          }), 
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Add user info to request for downstream handlers
      request.headers.set('user', JSON.stringify(decoded));
      
      return NextResponse.next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Internal Server Error',
          message: 'Authentication process failed'
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}

// Usage example for specific routes
export const config = {
  matcher: [
    '/api/admin/:path*',
    '/api/protected/:path*'
  ]
}; 