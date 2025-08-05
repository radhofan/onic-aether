'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '@onic/shinigami-frontend/components/Header';
import Footer from '@onic/shinigami-frontend/components/Footer';
import { Admin } from '@onic/shinigami-frontend/components/types';
import { useAuthStore } from '@onic/shinigami-frontend/stores/useAuthStore';

export default function AdminTable() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { role } = useAuthStore();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch('/api/admin');
        if (!res.ok) throw new Error('Failed to fetch admins');
        const data = await res.json();
        setAdmins(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header hideBanner />

      <main className="flex-1 p-6 sm:p-12">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Daftar Kontak</h1>
          {role === 'admin' && (
            <Link
              href="/admin/layanan/kontak/add"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition transform hover:scale-105 active:scale-95 font-medium"
            >
              + Tambah Kontak Baru
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600 text-lg font-medium">Loading...</p>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-700">
              <p className="font-medium">
                Untuk informasi terkait pemesanan, perpanjangan, atau lainnya
                silakan hubungi admin yang tertera:
              </p>
            </div>

            {/* ✅ Table Wrapper to Prevent Overflow */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 text-sm font-sans text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-center">
                      Nama
                    </th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Kontak
                    </th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Email
                    </th>
                    {role === 'admin' && (
                      <th className="px-4 py-3 font-semibold text-center">
                        Edit
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {admins.map((user) => (
                    <tr
                      key={user.id}
                      className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {user.contact ?? '-'}
                      </td>
                      <td className="px-4 py-3 text-center max-w-[200px] truncate">
                        {user.email}
                      </td>
                      {role === 'admin' && (
                        <td className="px-4 py-3 text-center">
                          <Link
                            href={`/admin/layanan/kontak/${user.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={`Edit ${user.name}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L12 14l-4 1 1-4 7.5-7.5z"
                              />
                            </svg>
                            Edit
                          </Link>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
