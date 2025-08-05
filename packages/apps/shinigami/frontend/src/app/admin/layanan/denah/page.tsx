'use client';
import { useEffect, useRef } from 'react';
import Header from '@onic/shinigami-frontend/components/Header';
import Footer from '@onic/shinigami-frontend/components/Footer';
import DenahSVG from '@onic/shinigami-frontend/assets/Denah.inline.svg';

export default function Denah() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    const id = (e.target as HTMLElement).id;
    if (id) console.log('Clicked ID:', id);
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const elements = svgRef.current.querySelectorAll('*');
    elements.forEach((el) => {
      const id = el.id || '';

      if (!id.startsWith('Line')) {
        el.setAttribute('stroke', 'black');
        el.setAttribute('stroke-width', '1');
        el.setAttribute('cursor', 'pointer');
      } else if (id.startsWith('Line')) {
        el.setAttribute('stroke', 'black');
        el.setAttribute('stroke-width', '1');
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header hideBanner />
      <div className="text-3xl font-bold text-center mb-4">
        Status Pemakaman
      </div>
      <main className="flex-grow container mx-auto px-4 py-10 mb-8">
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
        </div>

        <div onClick={handleClick} className="overflow-auto max-h-[80vh]">
          <DenahSVG
            ref={svgRef}
            className="w-full h-auto max-w-full object-contain"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
