'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Spin } from 'antd';
import SidebarLayout from '@onic/argus-frontend/app/components/SidebarLayout';
import AuthBootstrapper from './AuthBootstrapper';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname === '/login';

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  if (isAuthPage) return <>{children}</>;

  if (!isReady) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <AuthBootstrapper />
      <SidebarLayout>{children}</SidebarLayout>
    </>
  );
}
