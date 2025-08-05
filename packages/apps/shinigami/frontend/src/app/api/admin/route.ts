import { prisma } from '@onic/shinigami-frontend/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// GET
export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const query = url.searchParams.get('query');

  if (id) {
    const admin = await prisma.admin.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json(admin);
  }

  let admins;

  if (query) {
    admins = await prisma.admin.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
      },
    });
  } else {
    admins = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
      },
    });
  }

  return NextResponse.json(admins);
}

// POST
export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password, contact } = body;

  const newAdmin = await prisma.admin.create({
    data: { name, email, password, contact },
  });

  return NextResponse.json(newAdmin, { status: 201 });
}

// PUT
export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  const body = await request.json();
  const { name, email, contact, password } = body;

  if (!name || !email || contact === undefined) {
    return NextResponse.json(
      { error: 'Name, email, and contact are required' },
      { status: 400 }
    );
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: { id: Number(id) },
  });

  if (!existingAdmin) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }

  const updatedData: {
    name: string;
    email: string;
    contact: string;
    password?: string;
  } = {
    name,
    email,
    contact,
  };

  if (password && password.trim() !== '') {
    updatedData.password = await bcrypt.hash(password, 10);
  }

  const updatedAdmin = await prisma.admin.update({
    where: { id: Number(id) },
    data: updatedData,
  });

  const { ...safeAdmin } = updatedAdmin;

  return NextResponse.json(safeAdmin);
}

// DELETE
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  try {
    await prisma.admin.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error);
    return NextResponse.json(
      { error: 'Failed to delete admin' },
      { status: 500 }
    );
  }
}
