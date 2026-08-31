import { defineStore } from "pinia";
import type { invoiceM } from "~/types/invoice";

const COLLECTION = "invoice";

export const useinvoiceStore = defineStore("invoiceStore", {
  state: () => ({
    dataInvoice: [] as invoiceM[],
    detailInvoice: {} as invoiceM,
  }),

  getters: {
    getDataInvoice(state) {
      return state.dataInvoice;
    },
    getDetailInvoice(state) {
      return state.detailInvoice;
    },
  },

  actions: {
    async tarikDataInvoiceAct() {
      const datatarik = await queryambilid(COLLECTION);
      this.dataInvoice = datatarik as unknown as invoiceM[];
    },

    async tarikDetailInvoiceAct(id: string) {
      const datatarik = await tarikdetaildatabase2(COLLECTION, id);
      if (!datatarik) {
        throw new Error("Invoice tidak ditemukan");
      }
      this.detailInvoice = {
        ...(datatarik as invoiceM),
        id,
      };
      return this.detailInvoice;
    },

    async createInvoiceAct(data: invoiceM) {
      const notificationStore = useNotificationStore();
      try {
        useloadingStore().setLoading(true);
        const result = await createInvoiceAresaDigital(data);
        // sessionStorage.removeItem(COLLECTION);
        notificationStore.showSuccess("Invoice berhasil dibuat");
        return result;
      } catch (error) {
        notificationStore.showError("Gagal membuat invoice");
        return null;
      } finally {
        useloadingStore().setLoading(false);
      }
    },

    async updateInvoiceAct(id: string, data: invoiceM) {
      const notificationStore = useNotificationStore();
      try {
        useloadingStore().setLoading(true);
        const plainData = JSON.parse(JSON.stringify(data)) as invoiceM;
        const { id: _documentId, ...updateData } = plainData;

        await updatedatabase(COLLECTION, id, updateData);
        // sessionStorage.removeItem(COLLECTION);
        this.detailInvoice = { ...plainData, id };
        notificationStore.showSuccess("Perubahan berhasil disimpan");
        return true;
      } catch (error) {
        console.error("Gagal memperbarui invoice Solusi Nusa Segara:", error);
        notificationStore.showError("Gagal memperbarui invoice");
        return false;
      } finally {
        useloadingStore().setLoading(false);
      }
    },

    async deleteInvoiceAct(id: string) {
      const notificationStore = useNotificationStore();
      try {
        useloadingStore().setLoading(true);
        await hapusdatabase(COLLECTION, id);
        // sessionStorage.removeItem(COLLECTION);
        await this.tarikDataInvoiceAct();
        notificationStore.showSuccess("Invoice berhasil dihapus");
      } catch (error) {
        notificationStore.showError("Gagal menghapus invoice");
      } finally {
        useloadingStore().setLoading(false);
      }
    },
  },
});
