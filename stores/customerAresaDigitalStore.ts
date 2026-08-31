import { defineStore } from "pinia";
import type { customerAresaDigitalM } from "~/types/customerAresaDigitalModel";

const COLLECTION = "customer_aresa_digital";

export const useCustomerAresaDigitalStore = defineStore("customerAresaDigitalStore", {
  state: () => ({
    dataCustomer: [] as customerAresaDigitalM[],
  }),

  getters: {
    getDataCustomer(state) {
      return state.dataCustomer;
    },
  },

  actions: {
    async tarikDataCustomerAct() {
      const datatarik = await queryambilid(COLLECTION);
      this.dataCustomer = datatarik as unknown as customerAresaDigitalM[];
    },

    async addCustomerAct(data: customerAresaDigitalM) {
      const notificationStore = useNotificationStore();
      try {
        useloadingStore().setLoading(true);
        await tambahdatabase(COLLECTION, data);
        // sessionStorage.removeItem(COLLECTION);
        await this.tarikDataCustomerAct();
        notificationStore.showSuccess("Customer berhasil ditambahkan");
      } catch (error) {
        notificationStore.showError("Gagal menyimpan customer");
      } finally {
        useloadingStore().setLoading(false);
      }
    },

    async updateCustomerAct(data: customerAresaDigitalM) {
      const notificationStore = useNotificationStore();
      try {
        useloadingStore().setLoading(true);
        await updatedatabase(COLLECTION, data.id!, data);
        // sessionStorage.removeItem(COLLECTION);
        await this.tarikDataCustomerAct();
        notificationStore.showSuccess("Perubahan berhasil disimpan");
      } catch (error) {
        notificationStore.showError("Gagal memperbarui customer");
      } finally {
        useloadingStore().setLoading(false);
      }
    },

    async deleteCustomerAct(id: string) {
      const notificationStore = useNotificationStore();
      try {
        useloadingStore().setLoading(true);
        await hapusdatabase(COLLECTION, id);
        // sessionStorage.removeItem(COLLECTION);
        await this.tarikDataCustomerAct();
        notificationStore.showSuccess("Customer berhasil dihapus");
      } catch (error) {
        notificationStore.showError("Gagal menghapus customer");
      } finally {
        useloadingStore().setLoading(false);
      }
    },
  },
});
