export interface invoiceItemM {
  nama: string;
  qty: number;
  uom: string;
  amount: number;
  subtotal_item: number;
}

export interface invoiceM {
  id?: string;
  id_invoice?: string;
  no_inv: string;
  id_customer: string;
  nama_customer: string;
  alamat_customer: string;
  pic: string,
  tanggal: string;
  item_pekerjaan: invoiceItemM[];
  pakai_ppn: boolean;
  subtotal_invoice: number;
  ppn: number;
  grandtotal_invoice: number;
  status: string;
  dokumen_dikirim?: string;
  createdAt: number;
  createdBy: string;
  dikirimAt?: number;
  dikirimBy?: string;
  selesaiAt?: number;
  selesaiBy?: string;
}
