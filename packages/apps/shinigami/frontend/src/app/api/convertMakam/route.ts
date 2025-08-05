import { prisma } from '@onic/shinigami-frontend/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = parseInt(body.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    const status = await prisma.makamStatus.findUnique({
      where: { id },
    });

    if (!status) {
      return NextResponse.json(
        { error: 'Makam status tidak ditemukan' },
        { status: 404 }
      );
    }

    const newMakam = await prisma.makam.create({
      data: {
        blok: status.blok,
        nama: status.nama,
        lokasi: status.lokasi,
        silsilah: status.silsilah,
        ext: 'PAID',
        masa_aktif: status.masa_aktif,
        nama_penanggung_jawab: status.nama_penanggung_jawab,
        kontak_penanggung_jawab: status.kontak_penanggung_jawab,
        description: status.description,
        payment: 'PAID',
        approved: 'APPROVED',
        userId: status.userId,
      },
    });

    await prisma.makamStatus.delete({ where: { id } });

    if (status.userId) {
      const remainingStatusCount = await prisma.makamStatus.count({
        where: { userId: status.userId },
      });

      const newStatus = remainingStatusCount > 0 ? 'AKTIF/PESAN' : 'AKTIF';

      await prisma.user.update({
        where: { id: status.userId },
        data: { status: newStatus },
      });
    }

    return NextResponse.json({
      message: 'Berhasil disetujui dan status user diupdate',
      makam: newMakam,
    });
  } catch (err) {
    console.error('[approveMakam]', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menyetujui makam.' },
      { status: 500 }
    );
  }
}
