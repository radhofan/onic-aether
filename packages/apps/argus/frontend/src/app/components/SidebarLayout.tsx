'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  ApartmentOutlined,
  FileAddOutlined,
  FileTextOutlined,
  MailOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import Logout from './Logout';
import { useStore } from 'zustand';
import { authStore } from '@onic/argus-frontend/stores/useAuthStore';

const { Sider, Header, Content, Footer } = Layout;

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useStore(authStore, (s) => s.user);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const selectedKey = (() => {
    if (pathname === '/') return '1';
    if (pathname.startsWith('/pengajuan-baru')) return '2';
    if (pathname.startsWith('/daftar-vendor')) return '3';
    return '';
  })();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <div
            style={{
              height: 64,
              margin: 16,
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 12,
              textAlign: 'center',
              lineHeight: '32px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {collapsed ? 'MONITORING' : 'APLIKASI MONITORING KHS'}
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{
              marginTop: 'auto',
              flexGrow: 1,
              position: 'relative',
              paddingBottom: collapsed
                ? 0
                : user?.bidang === 'Bidang Perencanaan'
                  ? 790
                  : 740,
            }}
          >
            <Menu.Item key="1" icon={<FileTextOutlined />}>
              <Link href="/">Daftar Kontrak</Link>
            </Menu.Item>
            {user?.bidang !== 'Bidang Perencanaan' && (
              <Menu.Item key="2" icon={<FileAddOutlined />}>
                <Link href="/pengajuan-baru">Pengajuan Baru</Link>
              </Menu.Item>
            )}
            <Menu.Item key="3" icon={<TeamOutlined />}>
              <Link href="/daftar-vendor">Daftar Vendor</Link>
            </Menu.Item>

            {!collapsed && (
              <Menu.Item
                key="user-info"
                style={{
                  marginTop: 'auto',
                  position: 'absolute',
                  bottom: 0,
                  zIndex: 1,
                  height: 'fit-content',
                  color: '#ffffff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    marginBottom: 8,
                  }}
                >
                  <UserOutlined />
                  <span
                    style={{
                      fontSize: 14,
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      display: 'block',
                      lineHeight: 1.2,
                    }}
                  >
                    {user?.name || 'Radho Ramdhani'}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    marginBottom: 8,
                  }}
                >
                  <MailOutlined />
                  <span
                    style={{
                      fontSize: 14,
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      display: 'block',
                      lineHeight: 1.2,
                    }}
                  >
                    {user?.email || 'Not Logged in'}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    marginBottom: 8,
                  }}
                >
                  <ApartmentOutlined />
                  <span
                    style={{
                      fontSize: 14,
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      display: 'block',
                      lineHeight: 1.2,
                    }}
                  >
                    <div>{user?.bidang || 'Not Logged in'}</div>
                    <div>{user?.subBidang || ''}</div>
                  </span>
                </div>
                <Logout />
              </Menu.Item>
            )}
          </Menu>
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: 'all 0.2s ease',
        }}
      >
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          © 2025 PLN KHS Monitoring System
        </Footer>
      </Layout>
    </Layout>
  );
}
