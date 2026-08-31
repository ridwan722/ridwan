import { defineStore } from "pinia";
import type { invoiceAresaDigitalM } from "~/types/invoiceAresaDigitalModel";

const COLLECTION = "invoice_aresa_digital";

export const useInvoiceAresaDigitalStore = defineStore("invoiceAresaDigitalStore", {
  state: () => ({
    dataInvoice: [] as invoiceAresaDigitalM[],
    detailInvoice: {} as invoiceAresaDigitalM,
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
      this.dataInvoice = datatarik as unknown as invoiceAresaDigitalM[];
    },

    async tarikDetailInvoiceAct(id: string) {
      const datatarik = await tarikdetaildatabase2(COLLECTION, id);
      if (!datatarik) {
        throw new Error("Invoice tidak ditemukan");
      }
      this.detailInvoice = {
        ...(datatarik as invoiceAresaDigitalM),
        id,
      };
      return this.detailInvoice;
    },

    async createInvoiceAct(data: invoiceAresaDigitalM) {
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

    async updateInvoiceAct(id: string, data: invoiceAresaDigitalM) {
      const notificationStore = useNotificationStore();
      try {
        useloadingStore().setLoading(true);
        const plainData = JSON.parse(JSON.stringify(data)) as invoiceAresaDigitalM;
        const { id: _documentId, ...updateData } = plainData;

        await updatedatabase(COLLECTION, id, updateData);
        // sessionStorage.removeItem(COLLECTION);
        this.detailInvoice = { ...plainData, id };
        notificationStore.showSuccess("Perubahan berhasil disimpan");
        return true;
      } catch (error) {
        console.error("Gagal memperbarui invoice Aresa Digital:", error);
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
