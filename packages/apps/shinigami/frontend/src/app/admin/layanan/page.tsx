'use client';

import Header from '@onic/shinigami-frontend/components/Header';
import Footer from '@onic/shinigami-frontend/components/Footer';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

export default function Layanan() {
  const [selectedCard, setSelectedCard] = useState(0);

  const cards = [
    {
      title: 'Pemesanan',
      imgSrc: '/images/booking-removebg-preview 1.png',
      description: 'Lakukan pemesanan lokasi makam secara online dengan mudah.',
      link: '/admin/layanan/pesan',
    },
    {
      title: 'Status Pemesanan',
      imgSrc: '/images/status pemesanan.png',
      description: 'Cek status pemesanan Anda kapan saja dan di mana saja.',
      link: '/admin/layanan/pesan/status',
    },
    {
      title: 'List Makam',
      imgSrc: '/images/list makam1.png',
      description:
        'Lihat daftar lokasi makam yang tersedia atau telah dipesan.',
      link: '/admin/layanan/makam',
    },
    {
      title: 'Denah Makam',
      imgSrc: '/images/denah makam1.png',
      description:
        'Lihat denah lokasi pemakaman untuk memilih lokasi yang sesuai.',
      link: '/admin/layanan/denah',
    },
    {
      title: 'Histori Pengguna',
      imgSrc: '/images/history pengguna.png',
      description: 'Lihat riwayat aktivitas dan transaksi Anda di sistem ini.',
      link: '/admin/layanan/histori',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header hideBanner />
      <main className="flex-1 p-6 md:p-24 bg-white-100">
        <div className="mx-auto w-full max-w-6xl flex flex-col md:flex-row gap-10">
          {/* Left Side - List of Cards */}
          <div className="w-full md:w-1/3 space-y-4 border-2 border-gray-300 rounded-xl bg-white shadow-lg p-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 cursor-pointer transition-all duration-200 ease-in-out border-2
                    ${
                      selectedCard === index
                        ? 'border-blue-600 bg-blue-50 shadow-md transform scale-[1.02]'
                        : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-25 hover:shadow-sm hover:scale-[1.01]'
                    }`}
                onClick={() => setSelectedCard(index)}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white">
                    <Image
                      src={card.imgSrc}
                      alt={card.title}
                      fill
                      className="object-contain"
                      priority={true}
                    />
                  </div>
                  <h3
                    className={`text-sm md:text-base font-semibold transition-colors duration-200
                        ${selectedCard === index ? 'text-blue-800' : 'text-gray-800'}
                    `}
                  >
                    {card.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <Link href={cards[selectedCard].link} className="w-full md:w-2/3">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-300 shadow-lg transition-all duration-300 hover:border-blue-500 hover:shadow-xl cursor-pointer h-full">
              <div className="flex flex-col h-full">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 border-b-2 border-gray-300 pb-2">
                  {cards[selectedCard].title}
                </h2>
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="relative w-full max-w-md h-48 md:h-56 mb-6 rounded-lg overflow-hidden bg-white mx-auto">
                    <Image
                      src={cards[selectedCard].imgSrc}
                      alt={cards[selectedCard].title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-gray-700 leading-relaxed max-w-md text-base">
                    {cards[selectedCard].description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
