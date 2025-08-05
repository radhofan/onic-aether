'use client';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Header from '@onic/shinigami-frontend/components/Header';
import Footer from '@onic/shinigami-frontend/components/Footer';
import { useAuthStore } from '@onic/shinigami-frontend/stores/useAuthStore';

function Input({
  label,
  id,
  value,
  onChange,
  readOnly,
  disabled,
}: {
  label: string;
  id: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  disabled?: boolean;
}) {
  const isInactive = readOnly || disabled;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={id}
        required
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 ${
          isInactive
            ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
            : 'border-gray-300 focus:ring-blue-500'
        }`}
      />
    </div>
  );
}

function StatusCard({
  title,
  status,
}: {
  title: string;
  status: string;
  onResolve: () => void;
}) {
  const color =
    status === 'YES'
      ? 'bg-green-100 text-green-700'
      : status === 'PAID'
        ? 'bg-green-100 text-green-700'
        : status === 'APPROVED'
          ? 'bg-green-100 text-green-700'
          : status === 'PENDING'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{title}</label>

      <div className="flex items-center justify-center gap-3">
        <span
          className={`px-4 py-2 text-sm rounded-full font-semibold ${color}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

export default function Edit() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const typeParam = searchParams.get('type');
  const type = typeParam === 'makam' ? 'makam' : 'makamStatus'; // default fallback
  const [formData, setFormData] = useState({
    namapj: '',
    kontak: '',
    namajenazah: '',
    silsilah: '',
    lokasi: '',
    notes: '',
    payment: '',
    ext: '',
    approved: '',
    blok: '',
    userId: '',
  });

  const router = useRouter();
  const { role } = useAuthStore();

  const fetchData = async () => {
    try {
      setLoading(true); // Start loading

      const res = await fetch(`/api/${type}?id=${id}`);
      const data = await res.json();

      setFormData({
        namapj: data.nama_penanggung_jawab || '',
        kontak: data.kontak_penanggung_jawab || '',
        namajenazah: data.nama || '',
        silsilah: data.silsilah || '',
        lokasi: data.lokasi || '',
        notes: data.description || '',
        payment: data.payment || '',
        ext: data.ext || '',
        approved: data.approved,
        blok: data.blok,
        userId: data.userId,
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  async function convertMakam(id: string): Promise<boolean> {
    try {
      const res = await fetch('/api/convertMakam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || 'Konversi makam gagal');
      }

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Convert error:', err);
        alert('Gagal mengaktifkan makam: ' + err.message);
      } else {
        console.error('Unknown error:', err);
        alert('Terjadi kesalahan tidak dikenal.');
      }
      return false;
    }
  }

  const markAsResolvingMakamStatus = async (id: string) => {
    await fetch('/api/resolving', {
      method: 'PUT',
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const markAsResolvedMakamStatus = async (id: string) => {
    await fetch('/api/resolved', {
      method: 'PUT',
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const markAsResolvingMakam = async (id: string) => {
    await fetch('/api/resolvingMakam', {
      method: 'PUT',
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const markAsResolvedMakam = async (id: string) => {
    await fetch('/api/resolvedMakam', {
      method: 'PUT',
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/${type}?id=${id}`);
        const data = await res.json();

        setFormData({
          namapj: data.nama_penanggung_jawab || '',
          kontak: data.kontak_penanggung_jawab || '',
          namajenazah: data.nama || '',
          silsilah: data.silsilah || '',
          lokasi: data.lokasi || '',
          notes: data.description || '',
          payment: data.payment || '',
          ext: data.ext || '',
          approved: data.approved,
          blok: data.blok,
          userId: data.userId,
        });
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, type]);

  async function approveMakam(id: string): Promise<boolean> {
    try {
      const res = await fetch('/api/approveMakam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || 'Approval failed');
      }

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Approval error:', err);
        alert('Gagal menyetujui makam: ' + err.message);
      } else {
        console.error('Unknown error:', err);
        alert('Terjadi kesalahan tidak dikenal.');
      }
      return false;
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      { field: formData.namapj, name: 'Nama Penanggung Jawab' },
      { field: formData.kontak, name: 'Kontak Penanggung Jawab' },
      { field: formData.namajenazah, name: 'Nama Jenazah' },
      { field: formData.silsilah, name: 'Silsilah' },
      { field: formData.lokasi, name: 'Lokasi' },
      { field: formData.notes, name: 'Penjelasan' },
      { field: formData.blok, name: 'Blok Makam' },
    ];

    const emptyField = requiredFields.find(
      ({ field }) => !field || field.trim() === ''
    );
    if (emptyField) {
      alert(`Field "${emptyField.name}" wajib diisi.`);
      return;
    }

    const payload = {
      id,
      blok: formData.blok,
      nama: formData.namajenazah,
      lokasi: formData.lokasi,
      silsilah: formData.silsilah,
      nama_penanggung_jawab: formData.namapj,
      kontak_penanggung_jawab: formData.kontak,
      description: formData.notes,
    };

    try {
      const res = await fetch(`/api/${type}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Update failed:', err);
        alert('Failed to update record!');
      } else {
        alert('Makam updated successfully!');
        router.push('/admin/layanan/histori');
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('An error occurred while submitting the form.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header hideBanner />
      <main className="flex-1 p-6 md:p-10 bg-white flex justify-center items-start mb-24">
        {loading ? (
          <div className="w-full max-w-4xl text-center py-20">
            <p className="text-gray-500 text-lg animate-pulse">
              Memuat data status pemesanan...
            </p>
          </div>
        ) : (
          <form
            className="bg-white border border-gray-400 rounded-lg p-6 md:p-10 w-full max-w-4xl space-y-8"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-semibold text-center text-gray-800">
              Status Pemesanan Makam
            </h2>

            <section>
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Informasi Dasar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nama Penanggung Jawab"
                  id="namapj"
                  value={formData.namapj}
                  onChange={handleChange}
                  readOnly
                />
                <Input
                  label="No. Kontak PJ"
                  id="kontak"
                  value={formData.kontak}
                  onChange={handleChange}
                  readOnly
                />
                <Input
                  label="Hubungan Silsilah"
                  id="silsilah"
                  value={formData.silsilah}
                  onChange={handleChange}
                  readOnly={role !== 'admin'}
                />
                <Input
                  label="Nama Jenazah"
                  id="namajenazah"
                  value={formData.namajenazah}
                  onChange={handleChange}
                  readOnly={role !== 'admin'}
                />
                <div>
                  <label
                    htmlFor="lokasi"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Lokasi
                  </label>
                  <select
                    id="lokasi"
                    name="lokasi"
                    required
                    value={formData.lokasi}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={role !== 'admin'}
                  >
                    <option value="" disabled>
                      Pilih Lokasi Pemakaman
                    </option>
                    <option value="Karang Anyar">Karang Anyar</option>
                    <option value="Dalem Kaum">Dalem Kaum</option>
                    <option value="Dayeuhkolot">Dayeuhkolot</option>
                  </select>
                </div>
                <Input
                  label="Blok Makam"
                  id="blok"
                  value={formData.blok}
                  onChange={handleChange}
                  readOnly={role !== 'admin'}
                />
              </div>
            </section>

            <section>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Penjelasan
              </label>
              <textarea
                id="notes"
                name="notes"
                required
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly={role !== 'admin'}
              />
            </section>

            <section className="flex flex-wrap gap-6">
              <StatusCard
                title="Status Approval"
                status={formData.approved}
                onResolve={() => {}}
              />
              <StatusCard
                title="Status Pembayaran"
                status={formData.payment}
                onResolve={() => {}}
              />
              <StatusCard
                title="Status Perpanjangan"
                status={formData.ext}
                onResolve={() => {}}
              />
            </section>

            <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 pt-6 border-t">
              <button
                type="button"
                className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
                onClick={() =>
                  router.push(`/admin/layanan/histori/user/${formData.userId}`)
                }
              >
                Cancel
              </button>

              {role === 'admin' && (
                <div className="flex flex-col sm:flex-row gap-3">
                  {type === 'makam' && (
                    <>
                      {formData.ext === 'PENDING' && (
                        <button
                          type="button"
                          onClick={() => markAsResolvingMakam(id as string)}
                          className="px-6 py-2 rounded-lg bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition"
                        >
                          Mark as Resolving
                        </button>
                      )}
                      {formData.ext === 'PENDING' && (
                        <button
                          type="button"
                          onClick={() => markAsResolvedMakam(id as string)}
                          className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                        >
                          Approve Payment
                        </button>
                      )}
                      {formData.ext === 'RESOLVING' && (
                        <button
                          type="button"
                          onClick={() => markAsResolvedMakam(id as string)}
                          className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                        >
                          Mark as Resolved
                        </button>
                      )}
                    </>
                  )}
                  {type === 'makamStatus' && (
                    <>
                      {formData.payment === 'PENDING' &&
                        formData.approved === 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() =>
                              markAsResolvingMakamStatus(id as string)
                            }
                            className="px-6 py-2 rounded-lg bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition"
                          >
                            Mark as Resolving
                          </button>
                        )}

                      {formData.payment === 'PENDING' &&
                        formData.approved === 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() =>
                              markAsResolvedMakamStatus(id as string)
                            }
                            className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                          >
                            Approve Payment
                          </button>
                        )}

                      {formData.payment === 'RESOLVING' &&
                        formData.approved === 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() =>
                              markAsResolvedMakamStatus(id as string)
                            }
                            className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                          >
                            Mark as Resolved
                          </button>
                        )}

                      {formData.payment === 'PAID' &&
                        formData.ext === 'PAID' &&
                        formData.approved === 'APPROVED' && (
                          <button
                            type="button"
                            onClick={async () => {
                              const success = await convertMakam(id as string);
                              if (success) router.push('/admin/layanan/makam');
                            }}
                            className="px-6 py-2 rounded-lg bg-green-700 text-white font-medium hover:bg-green-800 transition"
                          >
                            Aktifkan Makam
                          </button>
                        )}
                    </>
                  )}

                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                </div>
              )}

              {role === 'approver' && formData.approved !== 'APPROVED' && (
                <button
                  type="button"
                  onClick={async () => {
                    const success = await approveMakam(id as string);
                    if (success) router.push('/admin/layanan/pesan/status');
                  }}
                  className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                >
                  Approve
                </button>
              )}
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
