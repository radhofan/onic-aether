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

    const existingApprover = await prisma.approver.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingApprover) {
      return NextResponse.json(
        { error: 'Approver with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const approver = await prisma.approver.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const { ...approverData } = approver;

    return NextResponse.json(
      {
        message: 'Approver created successfully',
        approver: approverData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Approver creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
