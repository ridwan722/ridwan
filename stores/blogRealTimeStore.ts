import { defineStore } from "pinia";
import {
  deleteDataRTB,
  getdatartb,
  setDataRTB,
  updateDataRTB,
  hapusartikelindex, // Asumsi fungsi ini ada di composables
} from "~/composables/firestore-realtime";
import type { BlogM } from "~/types/blogRealTimeModel";

export const useBlogRealTimeStore = defineStore("Blogtore", {
  state: () => ({
    dataBlog: [] as BlogM[],
  }),

  getters: {
    getDataBlog(state) {
      return state.dataBlog;
    },
  },

  actions: {
    // Helper untuk memanggil store lain
    getNotifStore() {
      return useNotificationStore();
    },

    getLoadingStore() {
      return useloadingStore();
    },

    async saveBlog(Blog: BlogM) {
      const notif = this.getNotifStore();
      const loading = this.getLoadingStore();
      try {
        loading.setLoading(true);
        await setDataRTB("blogs", Blog.slug, Blog);
        await hapusartikelindex();

        // Ganti Toast
        notif.showSuccess("Data Blog Berhasil Disimpan!");

        await this.tarikDataBlog();
        loading.setLoading(false);
      } catch (error) {
        loading.setLoading(false);
        // Ganti Toast
        notif.showError(`Gagal menyimpan data: `);
      }
    },

    async updateBlog(Blog: BlogM) {
      const notif = this.getNotifStore();
      const loading = this.getLoadingStore();
      try {
        loading.setLoading(true);
        await updateDataRTB("blogs", Blog.slug, Blog);

        // Ganti Toast
        notif.showSuccess("Data Blog Berhasil Diperbarui.");

        await this.tarikDataBlog();
        loading.setLoading(false);
      } catch (error) {
        loading.setLoading(false);
        // Ganti Toast
        notif.showError(`Gagal memperbarui data: `);
      }
    },

    async deleteIndexBlog() {
      const notif = this.getNotifStore();
      const loading = this.getLoadingStore();
      try {
        loading.setLoading(true);
        await hapusartikelindex();

        // Ganti Toast
        notif.showSuccess("Indeks Blog Berhasil Dihapus.");

        await this.tarikDataBlog();
        loading.setLoading(false);
      } catch (error) {
        loading.setLoading(false);
        // Ganti Toast
        notif.showError(`Gagal menghapus index: `);
      }
    },

    async deleteBlog(id: string) {
      const notif = this.getNotifStore();
      const loading = this.getLoadingStore();
      try {
        loading.setLoading(true);
        await deleteDataRTB("blogs", id);
        // Asumsi hapusartikelindex adalah fungsi yang relevan
        await hapusartikelindex();

        // Ganti Toast
        notif.showSuccess("Data Blog Berhasil Dihapus Permanen.");

        await this.tarikDataBlog();
        loading.setLoading(false);
      } catch (error) {
        loading.setLoading(false);
        // Ganti Toast
        notif.showError(`Gagal menghapus data: `);
      }
    },

    async tarikDataBlog() {
      const datatarik = await getdatartb("blogs");
      this.dataBlog = (datatarik || []) as unknown as BlogM[];
    },
  },
});
