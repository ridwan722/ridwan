
export interface CompanyInspectionReport {
    id?: string; // ID dari database (misal MongoDB _id)
    id_customer: string; // Contoh: "PT. ASTRA INTERNASIONAL TBK."
    nama_customer: string; // Contoh: "PT. ASTRA INTERNASIONAL TBK."
    judul_berita_acara: string; // Contoh: "RANGKUMAN HASIL INSPEKSI"  
    pic:string; // Contoh: "John Doe"
    no_telp:string; // Contoh: "08123456789"
    alamat:string; // Contoh: "Jl. Merdeka No. 123"
}