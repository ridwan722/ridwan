// export type PenawaranStatus = "draft" | "sent" | "approved" | "rejected";

import type { itemKategoriM } from "./master/kategoriModel";

export interface penawaranM {
  id?: string;
  jumlah_revisi?: number;
  id_penawaran?: string;
  no_penawaran?: string;
  id_perusahaan: string;
  id_cabang_perusahaan: string;
  id_object_kategori: string;
  nama_kategori_object: string;
  kategori_object?: string;
  alamat_cabang?: string;
  nama_cabang_perusahaan: string;
  nama_perusahaan: string;
  nama_group_pt: string;
  telepon_perusahaan: string;
  nama_surat: string;
  nomor: string;
  tanggal: string; // YYYY-MM-DD
  perihal: string;
  items: itemKategoriM[]; // 🔥 FLAT DI SINI
  total: number;
  terbilang: string;
  status: string;
  tanggal_kirim_penawaran?: string;
  email_kirim?: string[];
  catatan?: string[];
  item_tambahan: listitemtambahanPenawaranM[],
  createdAt: number;
  createdBy: string;
  updatedAt?: number;
  updatedBy?: string;
  disetujuiAt?: number;
  disetujuiBy?: string;
  invoiceAt?: number;
  pemberkasanAt?: number;
  pemberkasanBy?: string;
  item_kode_bayar?: any[],
  berkas?: any[];
  spkAt?: number;
  spkBy?: string;
  prosesAt?: number;
  prosesBy?: string;
  document_spk?: string[];
  tanggal_spk?: string;
  dibatalkanAt?: number;
  dibatalkanBy?: string;
  terkirimAt?: number;
  terkirimBy?: string;
  handle_by_aresa?: string;
  status_terkirim_email?: boolean;
  periode_awal?: string;
  periode_akhir?: string;
  email_cc?: string[];
  email_bcc?: string[];
  body_email?: string;
  attachments?: string[];
  invoice_count?: number;
  jumlah_invoice?: number;
}

export interface revisipenawaranM {
  id?: string;
  jumlah_revisi?: number;
  id_penawaran?: string;
  no_penawaran?: string;
  id_perusahaan: string;
  id_revisi?: string;
  no_revisi?: string;
  revisi_dari?: string;
  id_cabang_perusahaan: string;
  id_object_kategori: string;
  nama_kategori_object: string;
  alamat_cabang?: string;
  nama_cabang_perusahaan: string;
  nama_perusahaan: string;
  nama_group_pt: string;
  telepon_perusahaan: string;
  nama_surat: string;
  tanggal: string; // YYYY-MM-DD
  perihal: string;
  items: itemKategoriM[]; // 🔥 FLAT DI SINI
  total: number;
  status: string;
  catatan?: string[];
  item_tambahan: listitemtambahanPenawaranM[],
  createdAt: number;
  createdBy: string;
  updatedAt?: number;
  updatedBy?: string;
  disetujuiAt?: number;
  disetujuiBy?: string;
  dibatalkanAt?: number;
  dibatalkanBy?: string;
  terkirimAt?: number;
  terkirimBy?: string;
  handle_by_aresa?: string;
  periode_awal?: string;
  periode_akhir?: string;
}

export interface penawaranItemM {
  nama: string;
  qty: number;
  harga: number;
  subtotal: number;
}

export interface listitemtambahanPenawaranM {
  keterangan_penawaran: string,
  nominal_tambahan: number,
  kena_ppn: boolean,
  kena_pph: boolean,
  ppn_tambahan: number,
  pph_tambahan: number,
  status_item_tambahan: boolean
}
