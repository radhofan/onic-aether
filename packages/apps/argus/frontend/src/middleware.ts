import { NextRequest, NextResponse } from 'next/server';
import {
  verifyToken,
  getTokenFromRequest,
} from '@onic/argus-frontend/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname === '/login' ||
    pathname.startsWith('/api/login') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = getTokenFromRequest(req);

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname === '/pengajuan-baru' && user.bidang === 'Bidang Perencanaan') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}
