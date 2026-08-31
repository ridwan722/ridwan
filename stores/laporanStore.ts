import { defineStore } from "pinia";
import type { CompanyInspectionReport } from "~/types/laporanModel";

export const useLaporanStore = defineStore("laporanStore", {
  state: () => {
    return {
      dataLaporan: [] as CompanyInspectionReport[],
    };
  },

  getters: {
    getDataLaporan(state) {
      return state.dataLaporan;
    },
  },

  actions: {
    // 1. Aksi untuk menarik data dari database
    async tarikDataLaporannAct() {
      try {
        const datatarik = await queryambilidsesion("laporan");
        this.dataLaporan = datatarik as unknown as CompanyInspectionReport[];
      } catch (error) {
        console.error("Gagal menarik data Laporann:", error);
      }
    },

    // 2. Aksi untuk menambahkan laporan Laporann baru
    async addLaporannAct(lempar: CompanyInspectionReport) {
      const notificationStore = useNotificationStore();
      try {
        useloadingStore().setLoading(true);
        await setlaporan(lempar);
        sessionStorage.removeItem("laporan");

        await this.tarikDataLaporannAct();
        notificationStore.showSuccess("Laporan Laporann berhasil ditambahkan");
        useloadingStore().setLoading(false);
      } catch (error) {
        notificationStore.showError("Gagal menyimpan laporan Laporann");
        useloadingStore().setLoading(false);
      }
    },

    // 3. Aksi untuk memperbarui laporan Laporann yang ada
    async updateLaporannAct(lempar: CompanyInspectionReport) {
      const notificationStore = useNotificationStore();
      try {
        useloadingStore().setLoading(true);

        await updatedatabase("laporan", lempar.id!, lempar);
        sessionStorage.removeItem("laporan");

        await this.tarikDataLaporannAct();
        notificationStore.showSuccess("Perubahan berhasil disimpan");
        useloadingStore().setLoading(false);
      } catch (error) {
        notificationStore.showError("Gagal memperbarui data Laporann");
        useloadingStore().setLoading(false);
      }
    },

    // 4. Aksi untuk menghapus data laporan Laporann
    async deleteLaporannAct(id: string) {
      const notificationStore = useNotificationStore();
      try {
        useloadingStore().setLoading(true);

        await hapusdatabase("laporan", id);
        sessionStorage.removeItem("laporan");

        await this.tarikDataLaporannAct();
        notificationStore.showSuccess("Laporan berhasil dihapus");
        useloadingStore().setLoading(false);
      } catch (error) {
        notificationStore.showError("Gagal menghapus data Laporann");
        useloadingStore().setLoading(false);
      }
    },
  },
});