'use client';
import Header from '@onic/shinigami-frontend/components/Header';
import Footer from '@onic/shinigami-frontend/components/Footer';
import { User } from '@onic/shinigami-frontend/components/types';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@onic/shinigami-frontend/stores/useAuthStore';

export default function Pemesanan() {
  const role = useAuthStore((state) => state.role);

  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const today = normalizeDate(new Date());

  const sixMonthsLater = new Date(
    today.getFullYear(),
    today.getMonth() + 6,
    today.getDate()
  );
  const fiveYearsLater = new Date(
    sixMonthsLater.getFullYear() + 5,
    sixMonthsLater.getMonth(),
    sixMonthsLater.getDate()
  );

  const minDate = normalizeDate(sixMonthsLater);
  const maxDate = normalizeDate(fiveYearsLater);

  const years = Array.from(
    { length: maxDate.getFullYear() - minDate.getFullYear() + 1 },
    (_, i) => minDate.getFullYear() + i
  );

  const [masaAktif, setMasaAktif] = useState({
    day: minDate.getDate(),
    month: minDate.getMonth() + 1,
    year: minDate.getFullYear(),
  });

  const router = useRouter();

  const isDateValid = (day: number, month: number, year: number) => {
    const selectedDate = normalizeDate(new Date(year, month - 1, day));
    return selectedDate >= minDate && selectedDate <= maxDate;
  };

  const getValidDays = (month: number, year: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const validDays = [];
    for (let day = 1; day <= daysInMonth; day++) {
      if (isDateValid(day, month, year)) {
        validDays.push(day);
      }
    }
    return validDays;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const selectedDate = new Date(
      masaAktif.year,
      masaAktif.month - 1,
      masaAktif.day
    );
    if (selectedDate < minDate || selectedDate > maxDate) {
      alert(
        `Masa aktif harus antara ${minDate.toLocaleDateString('id-ID')} dan ${maxDate.toLocaleDateString('id-ID')}`
      );
      return;
    }

    const requiredFields = [
      { key: 'namajenazah', label: 'Nama Jenazah' },
      { key: 'blok', label: 'Blok Kavling' },
      { key: 'silsilah', label: 'Silsilah PJ' },
      { key: 'lokasi', label: 'Lokasi Pemakaman' },
      { key: 'notes', label: 'Penjelasan' },
    ];

    if (!useExisting) {
      requiredFields.push(
        { key: 'namapj', label: 'Nama Penanggung Jawab' },
        { key: 'kontak', label: 'Kontak Penanggung Jawab' },
        { key: 'email', label: 'Email Penanggung Jawab' }
      );
    }

    for (const { key, label } of requiredFields) {
      const value = formData.get(key);
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        alert(`Field "${label}" wajib diisi.`);
        return;
      }
    }

    if (useExisting && !selectedUser) {
      const input = form.querySelector<HTMLInputElement>('#userSearch');
      if (input) {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        input.focus();
        input.setCustomValidity(
          'Silakan pilih penanggung jawab yang sudah ada.'
        );
        input.reportValidity();
        input.addEventListener(
          'input',
          () => {
            input.setCustomValidity('');
          },
          { once: true }
        );
      }
      return;
    }

    const day = masaAktif.day.toString().padStart(2, '0');
    const month = masaAktif.month.toString().padStart(2, '0');
    const year = masaAktif.year.toString();
    const masaAktifStr = `${year}-${month}-${day}`;
    let pjId;

    if (useExisting && selectedUser) {
      pjId = selectedUser.id;
      await fetch(`/api/user?id=${pjId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedUser.name,
          contact: selectedUser.contact,
          email: selectedUser.email,
          status: selectedUser.status === 'AKTIF' ? 'AKTIF/PESAN' : 'PESAN',
        }),
      });
    } else {
      const newUserRes = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('namapj'),
          contact: formData.get('kontak'),
          email: formData.get('email'),
          status: 'PESAN',
        }),
      });

      if (!newUserRes.ok) {
        alert('Gagal membuat penanggung jawab baru.');
        return;
      }

      const newUser = await newUserRes.json();
      pjId = newUser.id;
    }

    const payload = {
      nama_penanggung_jawab:
        (formData.get('namapj') as string) ?? selectedUser?.name,
      kontak_penanggung_jawab:
        (formData.get('kontak') as string) ?? selectedUser?.contact,
      nama: formData.get('namajenazah') as string,
      blok: formData.get('blok') as string,
      silsilah: formData.get('silsilah') as string,
      lokasi: formData.get('lokasi') as string,
      description: formData.get('notes') as string,
      masa_aktif: masaAktifStr,
      userId: pjId,
      ext: 'PENDING',
      payment: 'PENDING',
      approved: 'PENDING',
    };

    try {
      const res = await fetch('/api/makamStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Pemesanan berhasil disimpan!');
        router.push('/admin/layanan/pesan/status');
        form.reset();
      } else {
        const error = await res.json();
        console.error('Error submitting form:', error);
        alert('Terjadi kesalahan saat menyimpan data.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Gagal mengirim permintaan.');
    }
  };

  const [useExisting, setUseExisting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const endpoint = searchTerm.trim()
        ? `/api/user?query=${encodeURIComponent(searchTerm)}`
        : '/api/user';

      fetch(endpoint)
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.error(err));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header hideBanner />
      <main className="flex-1 p-12 relative bg-white flex justify-center items-start">
        <form
          className="bg-white border border-gray-400 rounded-lg p-8 w-full max-w-lg space-y-6 mb-8"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-semibold mb-4">Form Pemesanan</h2>

          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Penanggung Jawab
            </h3>
            <div className="flex items-center space-x-4 mb-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="pjOption"
                  checked={!useExisting}
                  onChange={() => setUseExisting(false)}
                  className="form-radio"
                />
                <span className="ml-2">Buat Baru</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="pjOption"
                  checked={useExisting}
                  onChange={() => setUseExisting(true)}
                  className="form-radio"
                />
                <span className="ml-2">Gunakan Pengguna Ada</span>
              </label>
            </div>

            {useExisting ? (
              <div className="relative">
                <label htmlFor="userSearch" className="block mb-1 font-medium">
                  Cari Penanggung Jawab
                </label>
                <input
                  id="userSearch"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => {
                    if (!searchTerm) setSearchTerm('');
                  }}
                  placeholder="Ketik nama atau kontak..."
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <ul className="border border-gray-300 mt-1 rounded bg-white max-h-60 overflow-y-auto z-10 absolute w-full md:w-96 shadow-md">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <li
                        key={user.id}
                        onClick={() => {
                          setSelectedUser(user);
                          setSearchTerm(user.name);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {user.name} - {user.contact}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">
                      Tidak ada hasil ditemukan
                    </li>
                  )}
                </ul>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="namapj" className="block mb-1 font-medium">
                    Nama Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    id="namapj"
                    name="namapj"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nama PJ"
                  />
                </div>
                <div>
                  <label htmlFor="kontak" className="block mb-1 font-medium">
                    No. Kontak PJ
                  </label>
                  <input
                    type="text"
                    id="kontak"
                    name="kontak"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="08XXXXXXXXX"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1 font-medium">
                    Email PJ
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="user@gmail.com"
                  />
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Data Jenazah</h3>
            <div>
              <label htmlFor="namajenazah" className="block mb-1 font-medium">
                Nama Jenazah
              </label>
              <input
                type="text"
                id="namajenazah"
                name="namajenazah"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama Jenazah"
              />
            </div>
            <div>
              <label htmlFor="blok" className="block mb-1 font-medium">
                Blok Kavling
              </label>
              <input
                type="text"
                id="blok"
                name="blok"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan kode blok"
              />
            </div>
            <div>
              <label htmlFor="silsilah" className="block mb-1 font-medium">
                Silsilah PJ
              </label>
              <input
                type="text"
                id="silsilah"
                name="silsilah"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Silsilah"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Data Lainnya</h3>
            <div>
              <label htmlFor="lokasi" className="block mb-1 font-medium">
                Lokasi
              </label>
              <select
                id="lokasi"
                name="lokasi"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Pilih Lokasi Pemakaman
                </option>
                <option value="Karang Anyar">Karang Anyar</option>
                <option value="Dalem Kaum">Dalem Kaum</option>
                <option value="Dayeuhkolot">Dayeuhkolot</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Masa Aktif</label>
              <div className="flex space-x-2">
                <select
                  value={masaAktif.day}
                  onChange={(e) =>
                    setMasaAktif({
                      ...masaAktif,
                      day: parseInt(e.target.value),
                    })
                  }
                  className="border border-gray-300 rounded px-2 py-2"
                >
                  {getValidDays(masaAktif.month, masaAktif.year).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <select
                  value={masaAktif.month}
                  onChange={(e) =>
                    setMasaAktif({
                      ...masaAktif,
                      month: parseInt(e.target.value),
                    })
                  }
                  className="border border-gray-300 rounded px-2 py-2"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={masaAktif.year}
                  onChange={(e) =>
                    setMasaAktif({
                      ...masaAktif,
                      year: parseInt(e.target.value),
                    })
                  }
                  className="border border-gray-300 rounded px-2 py-2"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="block mb-1 font-medium">
                Penjelasan
              </label>
              <textarea
                id="notes"
                name="notes"
                required
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Penjelasan tambahan terkait yang dimakamkan..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => router.push('/admin')}
              type="reset"
              className="px-6 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Cancel
            </button>

            {role === 'admin' && (
              <button
                type="submit"
                className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
