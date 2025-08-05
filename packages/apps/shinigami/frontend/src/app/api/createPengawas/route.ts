import { prisma } from '@onic/shinigami-frontend/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const existingPengawas = await prisma.pengawas.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingPengawas) {
      return NextResponse.json(
        { error: 'Pengawas with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const pengawas = await prisma.pengawas.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const { ...pengawasData } = pengawas;

    return NextResponse.json(
      {
        message: 'Pengawas created successfully',
        pengawas: pengawasData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Pengawas creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
