import { useDatabaseList } from "vuefire";
import { getDatabase, ref as dbRef, push, set, update, remove } from "firebase/database";

// Fungsi untuk mendapatkan data dari Firebase
export const getdatartb = async (col: string) => {
  const db = getDatabase();
  return useDatabaseList(dbRef(db, col)); // Mengambil data secara real-time
};

// Simpan data baru ke Firebase
export const saveDataRTB = async (col: string, data: any) => {
  try {
    const db = getDatabase();
    const colRef = dbRef(db, col);
    const newRef = push(colRef); // Buat ID unik
    await set(newRef, data);
    console.log("Data berhasil disimpan!", newRef.key);
    return newRef.key; // Kembalikan ID yang baru dibuat
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
  }
};

// Simpan data id ditentukan baru ke Firebase
export const setDataRTB = async (col: string, id: string, data: any) => {
  try {
    const db = getDatabase();
    const itemRef = dbRef(db, `${col}/${id}`);
    await update(itemRef, data);
    console.log("Data berhasil diperbarui!");
  } catch (error) {
    console.error("Gagal memperbarui data:", error);
  }
};

// Perbarui data yang ada di Firebase
export const updateDataRTB = async (col: string, id: string, data: any) => {
  try {
    const db = getDatabase();
    const itemRef = dbRef(db, `${col}/${id}`);
    await update(itemRef, data);
    console.log("Data berhasil diperbarui!");
  } catch (error) {
    console.error("Gagal memperbarui data:", error);
  }
};

// Hapus data dari Firebase
export const deleteDataRTB = async (col: string, id: string) => {
  try {
    const db = getDatabase();
    const itemRef = dbRef(db, `${col}/${id}`);
    await remove(itemRef);
    console.log("Data berhasil dihapus!");
  } catch (error) {
    console.error("Gagal menghapus data:", error);
  }
};

export const hapusartikelindex = async () => {
  const url = 'https://api.perkasaracking.co.id/data?key=articles'
  // const config = useRuntimeConfig()
  const tokekv = 'logan098098'
  console.log(tokekv, 'cek token kv hapus index')
  const userCredential = $fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokekv}`
    },
  })
  return userCredential;
}
