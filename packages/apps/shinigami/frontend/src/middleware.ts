// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   if (pathname.startsWith('/admin/login')) {
//     return NextResponse.next();
//   }

//   const protectedRoutes = [
//     '/admin/layanan/pesan',
//     '/admin/layanan/histori',
//   ];

//   const isProtected = protectedRoutes.some((route) =>
//     pathname.startsWith(route)
//   );

//   const isOnMainAdmin = pathname === '/admin' || pathname === '/admin/';

//   if (isProtected || isOnMainAdmin) {
//     const authRole = request.cookies.get('auth-role')?.value;
//     const token = request.cookies.get('token')?.value;

//     if (isProtected && (!authRole || authRole === 'guest' || (authRole === 'admin' && !token))) {
//       return NextResponse.redirect(new URL('/admin/login/admin?expired=true', request.url));
//     }
  
//     if (isOnMainAdmin && authRole === 'admin' && !token) {
//       return NextResponse.redirect(new URL('/admin/login/admin?expired=true', request.url));
//     }
  
//     if (token && authRole === 'admin') {
//       try {
//         const tokenPayload = JSON.parse(atob(token.split('.')[1]));
//         const currentTime = Math.floor(Date.now() / 1000);
      
//         if (tokenPayload.exp && tokenPayload.exp < currentTime) {
//           const response = NextResponse.redirect(new URL('/admin/login/admin?expired=true', request.url));
//           response.cookies.delete('token');
//           response.cookies.delete('auth-role');
//           return response;
//         }
//       } catch {
//         const response = NextResponse.redirect(new URL('/admin/login/admin?expired=true', request.url));
//         response.cookies.delete('token');
//         response.cookies.delete('auth-role');
//         return response;
//       }
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/admin/:path*'],
// };

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/login') || pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login/admin', request.url));
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp && (payload.exp < Math.floor(Date.now() / 1000));
      
      if (isExpired) {
        throw new Error('Token expired');
      }
    } catch {
      const response = NextResponse.redirect(new URL('/admin/login/admin?expired=true', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

// TODO
// 1. Cek Redirect dari path selain login yang protected kalau tokennya valid maka next, kalau tidak lempar ke login
// 2. Cek kalau sudah di login page, kita cek apakah token atau tidak, kalau iya tidak usah login, cek token apa rolenya, kalau string guest masuk sbg guest, kalau token jwt maka verify
// 3. Semua page prot dan login page, middleware harus jalan