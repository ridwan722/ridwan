export interface invoiceItemM {
  description_pekerjaan: string;
  amount: number;
}

export interface invoiceM {
  id?: string;
  id_invoice_aresa?: string;
  no_inv_aresa: string;
  id_customer: string;
  nama_customer: string;
  alamat_customer: string;
  tanggal: string;
  item_pekerjaan: invoiceItemM[];
  pakai_ppn: boolean;
  subtotal: number;
  ppn: number;
  grandtotal: number;
  status: string;
  dokumen_dikirim?: string;
  createdAt: number;
  createdBy: string;
  updatedAt?: number;
  updatedBy?: string;
  dikirimAt?: number;
  dikirimBy?: string;
  selesaiAt?: number;
  selesaiBy?: string;
}
