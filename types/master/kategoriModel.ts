export interface masterObjectKategoriM {
  id?: string;
  nama: string;
  kategori: string;
  createdAt: number;
  createdBy: string;
  updatedAt?: number;
  updatedBy?: string;
}

export interface itemKategoriM {
  id?: string;
  id_kategori_item?: string;
  id_cabang: string;
  id_cabang_perusahaan?: string;
  nama_cabang: string;
  id_perusahaan: string;
  nama_group_pt: string;
  nama_perusahaan: string;
  id_object_kategori: string;
  nama_kategori_object: string;
  nama_object: string;
  nama_kategori_item: string;
  kode_kategori_item: string;
  dokumen: ItemDokumenM[];
  dokumen_berkas: ItemDokumenM[];
  jumlahUnit: number;
  ukuran?: string[];
  periode: {
    mulai: string;
    selesai: string;
  };
  periode_penawaran?: {
    mulai: string;
    selesai: string;
  };
  nominal?: number;
  nominal_edit?: number;
  keterangan: string;
  createdAt?: number;
  createdBy?: string;
  updatedAt?: number;
  updatedBy?: string;
  status?: string;
}

export interface ItemDokumenM {
  id_dokumen: string;
  nama_dokumen: string;
  no_dokumen?: string;
  file_dokumen?: string;
  periode_mulai?: string;
  periode_selesai?: string;
  status_dokumen?: string;
}
