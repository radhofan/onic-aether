import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@onic/argus-frontend/lib/auth';

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ message: 'Logout successful' });

  clearAuthCookie(response);

  return response;
}
