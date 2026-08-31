import _ from "lodash";
import { defineStore } from "pinia";
import { useloadingStore } from "./loadingStore";
import type { reminderM } from "~/types/reminderModel";

export const useReminderStore = defineStore("ReminderAresa", {
    state: () => {
        return {
            dataReminder: [] as reminderM[],
            detailReminder: {} as reminderM,
        };
    },

    getters: {
        getDataReminder(state) {
            return state.dataReminder;
        },
        getDetailReminder(state) {
            return state.detailReminder;
        },
    },

    actions: {
        async addReminderAct(lemparReminder: reminderM) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true);
                await tambahdatabase("reminder", lemparReminder);
                this.tarikDataReminderAct();
                notificationStore.showSuccess("Data berhasil ditambahkan");
                useloadingStore().setLoading(false);
            } catch (error) {
                notificationStore.showError("Gagal menyimpan data");
                useloadingStore().setLoading(false);
            }
        },

        async updateReminderAct(status: string, id: string, update_by: string) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true);
                await updatedatabase("reminder", id, { status, update_by });
                this.tarikDataReminderAct();
                notificationStore.showSuccess("Data berhasil diupdate");
                useloadingStore().setLoading(false);
            } catch (error) {
                notificationStore.showError("Gagal menyimpan data");
                useloadingStore().setLoading(false);
            }
        },

        async addContactReminderAct(lemparReminder: reminderM) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true);
                await updatedatabase("reminder", lemparReminder.id!, lemparReminder);
                this.tarikDataReminderAct();
                notificationStore.showSuccess("Data berhasil ditambahkan");
                useloadingStore().setLoading(false);
            } catch (error) {
                notificationStore.showError("Gagal menyimpan data");
                useloadingStore().setLoading(false);
            }
        },

        async deleteReminderAct(id: string) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true);

                await hapusdatabase("reminder", id);
                sessionStorage.removeItem("reminder");
                this.tarikDataReminderAct();

                notificationStore.showSuccess("Data Berhasil Dihapus");
                useloadingStore().setLoading(false);
            } catch (error) {
                notificationStore.showError("Gagal menghapus data");
            }
        },

        async tarikDataReminderAct() {
            const datatarik = await queryambilid("reminder");
            this.dataReminder = datatarik as unknown as reminderM[];
        },

        async tarikDetailReminderAct(id: string) {
            const datatarik = await tarikdetaildatabase("reminder", id);
            this.detailReminder = datatarik as unknown as reminderM;
        },
    },
});
