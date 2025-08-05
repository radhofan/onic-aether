import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { signToken, setAuthCookie } from '@onic/argus-frontend/lib/auth';

const users = [
  {
    id: '1',
    name: 'Radho',
    email: 'radho.perencanaan@gmail.com',
    bidang: 'Bidang Perencanaan',
    subBidang: '',
    passwordHash: bcrypt.hashSync('password', 10),
  },
  {
    id: '2',
    name: 'Radho',
    email: 'radho.erpfinance@gmail.com',
    bidang: 'Bidang Aplikasi',
    subBidang: 'ERP Finance',
    passwordHash: bcrypt.hashSync('password', 10),
  },
  {
    id: '3',
    name: 'Radho',
    email: 'radho.erphc@gmail.com',
    bidang: 'Bidang Aplikasi',
    subBidang: 'ERP Human Capital',
    passwordHash: bcrypt.hashSync('password', 10),
  },
  {
    id: '4',
    name: 'Radho',
    email: 'radho.erpproc@gmail.com',
    bidang: 'Bidang Aplikasi',
    subBidang: 'ERP Procurement & Logistic',
    passwordHash: bcrypt.hashSync('password', 10),
  },
  {
    id: '5',
    name: 'Radho',
    email: 'radho.distribusi@gmail.com',
    bidang: 'Bidang Aplikasi',
    subBidang: 'Distribusi & Pelayanan Pelanggan',
    passwordHash: bcrypt.hashSync('password', 10),
  },
  {
    id: '6',
    name: 'Radho',
    email: 'radho.proyek@gmail.com',
    bidang: 'Bidang Aplikasi',
    subBidang: 'Proyek, Pembangkit & Transmisi',
    passwordHash: bcrypt.hashSync('password', 10),
  },
  {
    id: '7',
    name: 'Radho',
    email: 'radho.dataanalitik@gmail.com',
    bidang: 'Bidang Aplikasi',
    subBidang: 'Data Analitik & Geospasial',
    passwordHash: bcrypt.hashSync('password', 10),
  },
];

/**
 * STEP 1: Parse email/password from request
 * STEP 2: Validate against users
 * STEP 3: Create token with userId + role
 * STEP 4: Set cookie
 * STEP 5: Return JSON response
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // STEP 1
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // STEP 2
    const user = users.find((u) => u.email === email);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // STEP 3
    const token = signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      bidang: user.bidang,
      subBidang: user.subBidang,
    });

    // STEP 4 & 5
    const response = NextResponse.json({
      message: 'Login successful',
      // user: { id: user.id, email: user.email, role: user.role },
    });

    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
