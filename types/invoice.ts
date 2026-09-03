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
  id_penawaran?: string,
  no_penawaran?: string,
  no_telp: string;
  pic: string,
  tanggal: string;
  perihal: string;
  item_pekerjaan: invoiceItemM[];
  pakai_ppn: boolean;
  subtotal_invoice: number;
  ppn: number;
  grandtotal_invoice: number;
  status: string;
  createdAt: number;
  createdBy: string;
  dikirimAt?: number;
  dikirimBy?: string;
  selesaiAt?: number;
  selesaiBy?: string;
}
