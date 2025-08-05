import { prisma } from '@onic/shinigami-frontend/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id || isNaN(parseInt(id, 10))) {
      return NextResponse.json(
        { error: 'Invalid or missing ID' },
        { status: 400 }
      );
    }

    const updated = await prisma.makamStatus.update({
      where: { id: parseInt(id, 10) },
      data: {
        payment: 'PAID',
        ext: 'PAID',
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[PUT /api/resolved]', err);
    return NextResponse.json(
      { error: 'Failed to update status to PAID' },
      { status: 500 }
    );
  }
}
