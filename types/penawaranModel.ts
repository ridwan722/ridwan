import type { itemKategoriM } from "./master/kategoriModel";

export interface penawaranM {
  id?: string;
  id_penawaran?: string;
  no_penawaran?: string;

  id_perusahaan: string;
  pic: string;
  nama_perusahaan: string;
  alamat_perusahaan?: string;
  telp_perusahaan: string;

  tanggal_penawaran: string;

  created_at: number;
  created_by: string;

  status: string;

  tanggal_kirim_penawaran?: string;

  terkirim_at?: number;
  terkirim_by?: string;

  perihal: string; 
  penawaran_item: penawaranItemM[]; 
  subtotal_penawaran: number;
  grand_total_penawaran: number;
  terbilang: string;

  spk_at?: number;
  spk_by?: string;
  tanggal_spk?: string;

  invoice_at?: number;
  invoice_by?: string;
}

export interface penawaranItemM {
  nama: string;
  qty: number;
  uom: string;
  amount: number;
  subtotal_item: number;
}



