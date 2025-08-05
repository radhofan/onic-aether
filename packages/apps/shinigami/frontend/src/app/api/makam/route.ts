import { prisma } from '@onic/shinigami-frontend/lib/db';
import { NextResponse } from 'next/server';

// GET
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const data = await prisma.makam.findUnique({
      where: { id: parsedId },
    });

    if (!data) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    return NextResponse.json(data);
  }

  const data = await prisma.makam.findMany();
  return NextResponse.json(data);
}

// POST
export async function POST(req: Request) {
  const body = await req.json();

  const newEntry = await prisma.makam.create({
    data: {
      blok: body.blok,
      nama: body.nama,
      lokasi: body.lokasi,
      silsilah: body.silsilah,
      ext: body.ext ?? null,
      masa_aktif: new Date(body.masa_aktif),
      nama_penanggung_jawab: body.nama_penanggung_jawab,
      kontak_penanggung_jawab: body.kontak_penanggung_jawab,
      description: body.description,
      payment: body.payment,
      approved: body.approved,
    },
  });

  return NextResponse.json(newEntry, { status: 201 });
}

// PUT
export async function PUT(req: Request) {
  const body = await req.json();
  const id = body.id;

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: 'Invalid or missing ID' },
      { status: 400 }
    );
  }

  try {
    const updatedEntry = await prisma.makam.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        blok: body.blok,
        nama: body.nama,
        lokasi: body.lokasi,
        silsilah: body.silsilah,
        nama_penanggung_jawab: body.nama_penanggung_jawab,
        kontak_penanggung_jawab: body.kontak_penanggung_jawab,
        description: body.description,
      },
    });

    return NextResponse.json(updatedEntry);
  } catch (err) {
    console.error('Update failed:', err);
    return NextResponse.json(
      { error: 'Failed to update record' },
      { status: 500 }
    );
  }
}
