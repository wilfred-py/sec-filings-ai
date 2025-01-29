import { NextRequest, NextResponse } from 'next/server';
import { withRoles } from '@/middleware/role-guard';
import User from '@/app/models/User';

// Protect all admin routes
export const middleware = withRoles(['admin']);

export async function GET() {
  try {
    const users = await User.find(
      {}, 
      { password: 0, resetPasswordToken: 0 }
    ).lean();
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' }, 
      { status: 500 }
    );
  }
} 