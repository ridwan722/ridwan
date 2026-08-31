// export type InvoiceStatus = "unpaid" | "paid" | "void";

import type { itemKategoriM } from "./master/kategoriModel";
import type { listitemtambahanPenawaranM } from "./penawaranModel";

export interface invoiceM {
  id?: string;
  id_inv?: string;
  no_inv?: string;
  id_perusahaan: string;
  id_cabang_perusahaan: string;
  nama_perusahaan: string;
  alamat_cabang?: string;
  nama_group_pt?: string;
  perihal?: string;
  nama_surat: string;
  nama_kategori_item: string;
  nama_cabang_perusahaan: string;
  items: itemKategoriM[]; // 🔥 FLAT DI SINI
  id_penawaran: string;
  telepon_perusahaan?: string;
  tanda_terima_invoice?: string[];
  // invoice_kwitansi_terkirim?:string[];
  invoice_terkirim?: string;
  kwitansi_terkirim?: string
  tanggal: string;
  jatuhTempo: string;
  subtotal: number;
  grandtotal?: number;
  remark?: string;
  pajak?: number;
  // adm?: number;
  // jasa?: number;
  ppn?: number;
  pph?: number;
  status: string; // invoiceStatus
  createdAt: number;
  createdBy: string;
  updatedAt?: number;
  updatedBy?: string;
  disetujuiAt?: number;
  disetujuiBy?: string;
  diterimaAt?: number;
  diterimaBy?: string;
  ditolakAt?: number;
  ditolakBy?: string;
  dikirimAt?: number;
  dikirimBy?: string;
  selesaiAt?: number;
  selesaiBy?: string;
  tanda_terima_at?: number,
  tanda_terima_By?: string,
  item_tambahan: listitemtambahanPenawaranM[],
  subtotal_pekerjaan: number,
  subtotal_item_tambahan: number,
  nama_kategori_object: string
  kategori_object?: string;
  perihal_invoice?: string,
  berkas?: string[];
  item_kode_bayar?: string[];
  handle_by_aresa?: string;
  jumlah_revisi?: number;
  id_revisi?: string;
  pic?: string
}
