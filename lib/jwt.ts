import jwt from 'jsonwebtoken';
import { IUser } from '@/app/models/User';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '24h';

export interface JWTPayload {
  email: string;
  roles: string[];
}

export function generateToken(user: IUser): string {
  const payload: JWTPayload = {
    email: user.email,
    roles: user.roles
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
} 