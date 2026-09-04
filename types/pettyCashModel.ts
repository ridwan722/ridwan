export type PettyCashCategory = "Debet" | "Kredit";
export type PettyCashType = "in" | "out";

export interface pettyCashM {
  id?: string;
  createdBy?: string;
  createdAt?: number;
  updatedBy?: string;
  updatedAt?: number;
  amount: number;
  keterangan: string;
  bukti: string;
  type: PettyCashType;
  tanggal: string;
  kategori: PettyCashCategory;
}
