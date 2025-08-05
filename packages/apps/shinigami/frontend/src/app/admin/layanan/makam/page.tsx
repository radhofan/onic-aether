import Header from '@onic/shinigami-frontend/components/Header';
import Footer from '@onic/shinigami-frontend/components/Footer';
import MakamTable from '@onic/shinigami-frontend/components/MakamTable';

export default function Admin() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header hideBanner />

      <main className="flex-1 p-12">
        <MakamTable />
      </main>

      <Footer />
    </div>
  );
}
