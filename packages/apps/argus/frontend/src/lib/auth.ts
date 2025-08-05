import jwt from 'jsonwebtoken';
import { jwtVerify, JWTPayload } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@onic/argus-frontend/types/types';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-dev';
const JWT_SECRET_BUFFER = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'token';

/**
 * Sign a JWT token with user payload.
 */
export function signToken(user: User): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify and decode a JWT token.
 */
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_BUFFER);

    // Optional: Validate the shape
    const { id, name, email, bidang, subBidang } = payload as JWTPayload &
      Partial<User>;

    if (
      typeof id === 'string' &&
      typeof name === 'string' &&
      typeof email === 'string' &&
      typeof bidang === 'string' &&
      typeof subBidang === 'string'
    ) {
      return { id, name, email, bidang, subBidang };
    }

    return null; // missing required fields
  } catch {
    return null;
  }
}

/**
 * Set auth cookie in the response.
 */
export function setAuthCookie(res: NextResponse, token: string): void {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear auth cookie from the response.
 */
export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

/**
 * Extract token string from a NextRequest.
 */
export function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get(COOKIE_NAME)?.value || null;
}
