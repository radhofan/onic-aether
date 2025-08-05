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

    const makam = await prisma.makam.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!makam || !makam.masa_aktif) {
      return NextResponse.json(
        { error: 'Makam not found or masa_aktif missing' },
        { status: 404 }
      );
    }

    const newMasaAktif = new Date(makam.masa_aktif);
    newMasaAktif.setFullYear(newMasaAktif.getFullYear() + 1);

    const updated = await prisma.makam.update({
      where: { id: makam.id },
      data: {
        ext: 'PAID',
        masa_aktif: newMasaAktif,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[PUT /api/resolvedMakam]', err);
    return NextResponse.json(
      { error: 'Failed to update status to PAID' },
      { status: 500 }
    );
  }
}
