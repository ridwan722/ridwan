// 1. Tipe untuk detail setiap alat yang diinspeksi
export interface InspectionItem {
    no: number;
    alat: string;
    kapasitas: string | null; // Menggunakan string karena ada satuan KG, kVA, Liter, dll. Null jika "-"
    merk_serial: string | null; // Null jika "-"
    kesimpulan: 'memenuhi persyaratan K3' | 'Tidak memenuhi persyaratan K3' | string;
    ijin: 'Berkala' | string;
}

// 2. Tipe untuk dokumen Utama Perusahaan / Cabang
export interface CompanyInspectionReport {
    id?: string; // ID dari database (misal MongoDB _id)
    id_perusahaan: string; // Contoh: "PT. ASTRA INTERNASIONAL TBK."
    id_cabang: string; // Contoh: "DAIHATSU CAB. PLUIT"
    nama_perusahaan: string; // Contoh: "PT. ASTRA INTERNASIONAL TBK."
    nama_cabang: string; // Contoh: "DAIHATSU CAB. PLUIT"
    judul_berita_acara: string; // Contoh: "RANGKUMAN HASIL INSPEKSI"
    // tanggal_berita_acara?: Date; // Sangat disarankan ditambahkan untuk tracking waktu
    daftar_alat: InspectionItem[]; // Array dari alat-alat di atas
    dokumentasi?: string[]; // Array dari nama file dokumen pendukung
    id_kategori_item: string; // ID kategori dari master kategorinam
    nama_kategori_item: string; // Nama kategori dari master kategorinam
}