import { prisma } from '@onic/shinigami-frontend/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = parseInt(body.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    const updated = await prisma.makamStatus.update({
      where: { id },
      data: { approved: 'APPROVED' },
    });

    return NextResponse.json({
      message: 'Berhasil disetujui',
      status: updated,
    });
  } catch (err) {
    console.error('[approveMakamStatus]', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menyetujui status makam.' },
      { status: 500 }
    );
  }
}
