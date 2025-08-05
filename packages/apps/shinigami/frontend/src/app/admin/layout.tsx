'use client';
import { useAuthStore } from '@onic/shinigami-frontend/stores/useAuthStore';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const PROTECTED_ROUTES = ['/admin/layanan/pesan', '/admin/layanan/histori'];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, hydrated, hydrate } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   if (sessionStorage.getItem('wasRefreshed') !== 'true') {
  //     sessionStorage.setItem('wasRefreshed', 'true');
  //     window.location.reload();
  //   }
  // }, []);

  useEffect(() => {
    setIsClient(true);
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isClient || !hydrated) return;

    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute && role === 'guest') {
      router.push('/admin/login/admin');
    }
  }, [isClient, hydrated, role, pathname, router]);

  if (!isClient || !hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
