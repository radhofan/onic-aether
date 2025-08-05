"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

type Grave = {
  id: string;
  occupied: boolean;
};

const generateGraves = (): Grave[] => {
  const graves: Grave[] = [];
  const rows = "ABCDEFGH";
  for (const row of rows) {
    for (let i = 1; i <= 20; i++) {
      graves.push({
        id: `${row}${i}`,
        occupied: Math.random() < 0.3,
      });
    }
  }
  return graves;
};

export default function Denah() {
  const [graves, setGraves] = useState<Grave[]>([]);
  const [selectedGrave, setSelectedGrave] = useState<Grave | null>(null);

  useEffect(() => {
    setGraves(generateGraves());
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header hideBanner />
      <div className="text-3xl font-bold text-center mb-4">
        Status Pemakaman
      </div>
      <main className="flex-grow container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 text-left">Pilih Kavling</h1>
        <div className="flex justify-between items-center mb-6">
          <div>
            <label htmlFor="graveyard-select" className="mr-2 font-semibold">
              Pilih Daerah:
            </label>
            <select
              id="graveyard-select"
              defaultValue="Dalem Kaum"
              className="border border-gray-300 rounded-md p-1"
            >
              <option>Dalem Kaum</option>
              <option>Dayeuhkolot</option>
              <option>Karang Anyar</option>
            </select>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-green-600"></div>
              <span className="text-sm font-medium">Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-white border-2 border-green-600"></div>
              <span className="text-sm font-medium">Empty</span>
            </div>
          </div>

          
        </div>
      
        <div className="overflow-x-auto">
          <div className="grid grid-cols-20 gap-2 justify-center">
            {graves.map((grave) => (
                <div
                  key={grave.id}
                  onClick={() => setSelectedGrave(grave)}
                  className={`w-16 h-12 flex items-center justify-center rounded-xl text-sm font-medium cursor-pointer transition ${
                    grave.occupied
                      ? "bg-green-600 text-white"
                      : "bg-white border-2 border-green-600 text-green-600"
                  }`} 
                >
                  {grave.id}
                </div>
              ))}
          </div>

          {selectedGrave && (
            <div
              onClick={() => setSelectedGrave(null)}
              className="fixed inset-0 bg-black opacity-60 z-40"
            />
          )}

          {selectedGrave && (
            <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transition-transform transform translate-x-0 flex flex-col">
              
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Detail Kavling</h2>
                <button
                  onClick={() => setSelectedGrave(null)}
                  className="text-gray-500 hover:text-red-600 text-xl"
                >
                  &times;
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1 space-y-6">
                <div className="bg-white rounded-lg shadow-md p-5 space-y-4 text-gray-800 text-sm">
                  <p><span className="font-semibold">ID:</span> 16</p>
                  <p><span className="font-semibold">Nama Jenazah:</span> John Doe</p>
                  <p><span className="font-semibold">Lokasi:</span> Karang Anyar</p>
                  <p><span className="font-semibold">Silsilah:</span> Father</p>
                  <p>
                    <span className="font-semibold">Masa Aktif:</span>{" "}
                    <span
                      className={`font-medium ${
                        "PAID" === "PAID" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      31-12-2025
                    </span>
                  </p>

                  <p><span className="font-semibold">Penanggung Jawab:</span> Michael Doe</p>
                  <p><span className="font-semibold">Kontak:</span> 081234567890</p>

                  <div>
                    <p className="font-semibold mb-1">Deskripsi:</p>
                    <p className="text-gray-700 leading-relaxed">
                      Pemilik kavling merupakan ayah dari Michael Doe. Pembayaran telah diselesaikan secara penuh pada tanggal yang telah ditentukan.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t">
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => console.log("Navigate to edit page")}
                >
                  Edit
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}

