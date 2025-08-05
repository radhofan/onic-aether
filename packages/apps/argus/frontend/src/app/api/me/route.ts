import { NextRequest, NextResponse } from 'next/server';
import {
  verifyToken,
  getTokenFromRequest,
} from '@onic/argus-frontend/lib/auth';

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return NextResponse.json({ error: 'No token' }, { status: 401 });
  }

  try {
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      bidang: user.bidang,
      subBidang: user.subBidang,
    });
  } catch (error) {
    console.error('JWT verification failed:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
