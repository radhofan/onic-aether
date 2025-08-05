'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@onic/shinigami-frontend/components/Header';
import Footer from '@onic/shinigami-frontend/components/Footer';
import { User } from '@onic/shinigami-frontend/components/types';
import { useAuthStore } from '@onic/shinigami-frontend/stores/useAuthStore';

export default function UserDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    data: '',
  });
  const [success, setSuccess] = useState(false);
  const { role } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user?id=${id}`);
        const data = await res.json();
        setUser(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          contact: data.contact || '',
          data: data.status,
        });
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        console.error('Gagal memperbarui user');
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header hideBanner />

      <main className="flex-1 px-4 py-8 md:px-8 lg:px-16 xl:px-24 mb-24">
        {loading && !user ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <p className="text-gray-500">Memuat data pengguna...</p>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
              Detail Pengguna
            </h1>

            <div className="bg-white p-8 max-w-5xl mx-auto space-y-10">
              <form
                onSubmit={handleUpdate}
                className="space-y-6 max-w-lg mx-auto"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Kontak
                  </label>
                  <input
                    id="contact"
                    name="contact"
                    type="text"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/layanan/histori')}
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition transform hover:scale-105 active:scale-95"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    onClick={() => router.push('/admin/layanan/histori')}
                    disabled={role !== 'admin'}
                    className={`px-6 py-3 font-semibold rounded-lg transition transform active:scale-95 ${
                      role === 'admin'
                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Simpan Perubahan
                  </button>
                </div>
                {success && (
                  <p className="text-green-600 text-center text-sm mt-2 animate-fade-in-down">
                    ✔ Berhasil diperbarui!
                  </p>
                )}
              </form>

              <section className="max-w-lg mx-auto w-full mb-12">
                <h3 className="font-bold text-gray-800 text-xl mb-4 text-center">
                  Daftar Makam
                </h3>
                <div className="space-y-3">
                  {(user?.makams?.length ?? 0) > 0 ||
                  (user?.statuses?.length ?? 0) > 0 ? (
                    <>
                      {/* AKTIF Makam */}
                      {user?.makams?.map((m) => (
                        <button
                          key={`aktif-${m.id}`}
                          onClick={() =>
                            router.push(
                              `/admin/layanan/histori/${m.id}?type=makam`
                            )
                          }
                          className="relative w-full p-5 border border-gray-400 rounded-lg hover:border-blue-400 hover:bg-blue-50 text-left shadow-sm transition-all"
                        >
                          <div className="font-semibold text-gray-800">
                            {m.nama}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {m.lokasi}
                          </div>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            AKTIF
                          </div>
                        </button>
                      ))}

                      {/* PESAN Makam */}
                      {user?.statuses?.map((s) => (
                        <button
                          key={`pesan-${s.id}`}
                          onClick={() =>
                            router.push(
                              `/admin/layanan/histori/${s.id}?type=makamStatus`
                            )
                          }
                          className="relative w-full p-5 border border-gray-400 rounded-lg hover:border-green-400 hover:bg-green-50 text-left shadow-sm transition-all"
                        >
                          <div className="font-medium text-gray-800">
                            {s.nama}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {s.lokasi}
                          </div>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600">
                            PESAN
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    <p className="text-gray-500 italic text-center">
                      Tidak ada makam atau pesanan berlangsung.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
