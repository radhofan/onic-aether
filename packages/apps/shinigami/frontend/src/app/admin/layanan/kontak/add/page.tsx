'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@onic/shinigami-frontend/components/Header';
import Footer from '@onic/shinigami-frontend/components/Footer';
import { useAuthStore } from '@onic/shinigami-frontend/stores/useAuthStore';

export default function AddKontakPage() {
  const router = useRouter();
  const { role } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Gagal menambahkan kontak');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push('/admin/layanan/kontak');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat menambahkan kontak.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header hideBanner />

      <main className="flex-1 px-4 py-8 md:px-8 lg:px-16 xl:px-24 mb-24">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          Tambah Kontak
        </h1>

        <div className="bg-white p-8 max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Nama
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

            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => router.push('/admin/layanan/kontak')}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition transform hover:scale-105 active:scale-95"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={role !== 'admin'}
                className={`px-6 py-3 font-semibold rounded-lg transition transform active:scale-95 ${
                  role === 'admin'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Simpan
              </button>
            </div>

            {success && (
              <p className="text-green-600 text-center text-sm mt-2 animate-fade-in-down">
                ✔ Kontak berhasil ditambahkan!
              </p>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
