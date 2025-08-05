export interface Kontrak {
  key: string;
  namaPekerjaan: string;
  subBidang: string;
  tipePekerjaan: string;
  direksiPekerjaan: string;
  pengawasPekerjaan: string;
  vendorKey: string;
  vendorKHS: string;
  nilaiTotal: number;
  nomorKontrak: string;
  nomorAmandemenKontrak: string;
  amandemenKontrakDetail?: AmandemenKontrak;
  tanggalMulai: string;
  tanggalSelesai: string;
  terminPembayaran: string;
  infoStatusPembayaran:
    | 'Terbayar Semua'
    | 'Belum Terbayar Semua'
    | 'Terbayar Sebagian';
  dataStatusPembayaran: Record<number, TerminDetail>;
  infoEvaluasi: 'Selesai' | 'Belum Selesai';
}

export interface Vendor {
  key: string;
  namaVendor: string;
  nilaiKeseluruhan: number;
  evaluasiVendor: number;
  suratPeringatan: 'Ada' | 'Tidak ada';
  totalProyek: number;
  suratPeringatanDetail?: SuratPeringatan[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  bidang: string;
  subBidang: string;
}

/////////////////////////////////////////////////////////////

export interface TerminDetail {
  status: 'Terbayar' | 'Belum Terbayar';
  dokumen?: string[];
}

export type AmandemenKontrak = {
  nomorAmandemen: string;
  nomorKontrak: string;
  tanggal: string;
  deskripsi: string;
};

export type SuratPeringatan = {
  nomor: string;
  tanggal: string;
  alasan: string;
};
