import { increment } from "firebase/database";
import moment from "moment";
import { defineStore } from "pinia";
import type { invoiceM } from "~/types/InvoiceModel";

export const useInvoiceStore = defineStore("InvoiceStore", {
    state: () => {
        return {
            dataInvoice: [] as invoiceM[],
            dataInvoiceTampil: [] as invoiceM[], // DATA FILTER (Untuk Tabel di Halaman)
            detalinvoice: {} as invoiceM,
            datarevisi: [] as invoiceM[],

            tgl_awal: "",
            tgl_akhir: ""
        };
    },

    getters: {
        getDataInvoice(state) {
            return state.dataInvoice;
        },

        getDetailInvoice(state) {
            return state.detalinvoice;
        },

        getDataRevisiInvoice(state) {
            return state.datarevisi;
        },

        getInvoiceByStatus: (state) => {
            return (status: string) =>
                state.dataInvoice.filter((p) => p.status === status);
        },

        getInvoiceById: (state) => {
            return (id: string) =>
                state.dataInvoice.find((p) => p.id! === id);
        },
    },

    actions: {
        // CREATE
        async addInvoiceAct(lemparInvoice: invoiceM) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true);

                await setdatabase(
                    "invoice",
                    lemparInvoice.id!,
                    lemparInvoice
                );

                await this.tarikDataInvoiceAct();

                notificationStore.showSuccess("Invoice berhasil ditambahkan");
                useloadingStore().setLoading(false);
            } catch (error) {
                notificationStore.showError("Gagal menyimpan Invoice");
                useloadingStore().setLoading(false);
            }
        },

        // UPDATE
        async addRevisiInvoiceAct(lemparInvoice: invoiceM) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true);


                const databatch = [
                    {
                        type: "update",
                        id: lemparInvoice.id!,
                        collection: "invoice",
                        data: lemparInvoice,
                    },
                ];

                await batching(databatch)

                await this.tarikDataInvoiceAct();

                notificationStore.showSuccess("Invoice berhasil diperbarui");
                useloadingStore().setLoading(false);
            } catch (error) {
                notificationStore.showError("Gagal memperbarui Invoice");
                useloadingStore().setLoading(false);
            }
        },

        async updateInvoiceAct(lemparInvoice: invoiceM) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true);

                await updatedatabase(
                    "invoice",
                    lemparInvoice.id!,
                    lemparInvoice
                );

                await this.tarikDataInvoiceAct();

                notificationStore.showSuccess("Invoice berhasil diperbarui");
                useloadingStore().setLoading(false);
            } catch (error) {
                notificationStore.showError("Gagal memperbarui Invoice");
                useloadingStore().setLoading(false);
            }
        },

        // DELETE
        async deleteInvoiceAct(lemparinvoice: invoiceM) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true);

                // await hapusdatabase("invoice", id);
                const email = useUserStore().getEmail
                const now = moment().unix()
                const uniqueKategori = [
                    ...new Set(lemparinvoice.items.map(i => i.id_kategori_item)),
                ];

                let newCount = 0;

                if (lemparinvoice.id_inv!.endsWith("AB")) {
                    newCount = 1;
                } else if (lemparinvoice.id_inv!.endsWith("A")) {
                    newCount = 0;
                } else {
                    newCount = 0;
                }

                // 🔥 CEK SISA INVOICE
                const existingInvoices = this.dataInvoice.filter(
                    i => i.id_penawaran === lemparinvoice.id_penawaran
                );

                const sisaInvoice = existingInvoices.filter(
                    i => i.id_inv !== lemparinvoice.id_inv
                );

                // 🔥 OVERRIDE PALING PENTING
                if (sisaInvoice.length === 0) {
                    newCount = 0;
                }
                const jumlah_invoice = sisaInvoice.length;

                const databatch = [
                    {
                        type: "delete",
                        id: lemparinvoice.id!,
                        collection: "invoice",
                        data: lemparinvoice,
                    },
                    {
                        type: "delete",
                        id: lemparinvoice.id!,
                        collection: `penawaran/${lemparinvoice.id_penawaran}/invoice`,
                        data: lemparinvoice,
                    },
                    {
                        type: "update",
                        id: lemparinvoice.id_penawaran,
                        collection: "penawaran",
                        data: {
                            status: 'Pemberkasan', updatedAt: now, updatedBy: email, pemberkasanAt: now, pemberkasanBy: email, invoice_count: newCount, jumlah_invoice: jumlah_invoice,
                            ...(sisaInvoice.length === 0 && {
                                id_penomoran_invoice: ""
                            })
                        },
                    },
                    ...uniqueKategori.map(id => ({
                        type: "delete",
                        id: lemparinvoice.id!,
                        collection: `m_item_kategori/${id}/invoice`,
                        data: lemparinvoice,
                    })),
                    ...uniqueKategori.map(id => ({
                        type: "update",
                        id: lemparinvoice.id_penawaran!,
                        collection: `m_item_kategori/${id}/penawaran`,
                        data: {
                            status: 'Pemberkasan', updatedAt: now, updatedBy: email, pemberkasanAt: now, pemberkasanBy: email, invoice_count: newCount, jumlah_invoice: jumlah_invoice,
                            ...(sisaInvoice.length === 0 && {
                                id_penomoran_invoice: ""
                            })
                        },
                    })),
                    ...uniqueKategori.map(id => ({
                        type: "update",
                        id: id,
                        collection: `m_cabang/${lemparinvoice.id_cabang_perusahaan}/m_item_kategori`,
                        data: { status: 'Penawaran', updatedAt: now, updatedBy: email },
                    })),
                    ...uniqueKategori.map(id => ({
                        type: "update",
                        id: id,
                        collection: `m_item_kategori`,
                        data: { status: 'Penawaran', updatedAt: now, updatedBy: email },
                    })),
                ];

                await batching(databatch)

                await this.tarikDataInvoiceAct();

                notificationStore.showSuccess("Invoice berhasil dihapus");
                useloadingStore().setLoading(false);
            } catch (error) {
                notificationStore.showError("Gagal menghapus Invoice");
                useloadingStore().setLoading(false);
            }
        },

        // READ
        async tarikDataInvoiceAct() {
            const datatarik = await queryambilid("invoice");
            const hasil = datatarik as unknown as invoiceM[];
            this.dataInvoice = hasil; // Simpan ke Master
            this.dataInvoiceTampil = hasil; // Default tampilkan semua
        },

        // Ambil data berdasarkan status (Panggil ini di halaman Proses/Sent/dll)
        async tarikdataInvoicebystatus(status: string) {
            this.dataInvoiceTampil = [];
            const datatarik = await queryInvoiceBystatus(status);
            // JANGAN TIMPA this.dataInvoice
            this.dataInvoiceTampil = datatarik as unknown as invoiceM[];
        },

        // async tarikDataInvoiceAct() {
        //     const datatarik = await queryambilid("invoice");
        //     this.dataInvoice = datatarik as unknown as invoiceM[];
        // },

        // async tarikdataInvoicebystatus(status: string) {
        //     const datatarik = await queryInvoiceBystatus(status);
        //     this.dataInvoice = datatarik as unknown as invoiceM[];
        // },

        async tarikDetailInvoiceAct(id: string) {
            const datatarik = await tarikdetaildatabase("invoice", id);
            this.detalinvoice = datatarik as unknown as invoiceM;
        },

        async tarikdatarevisiinvoice(id: string) {
            const datatarik = await queryambilid("invoice/" + id + "/revisi_invoice");
            this.datarevisi = datatarik as unknown as invoiceM[];
        },


        async queryrekapaninvoice(
            tgl_awal: string,
            tgl_akhir: string,
            nama_perusahaan: string,
            nama_cabang: string,
            status: string
        ) {
            try {
                useloadingStore().setLoading(true);

                this.tgl_awal = tgl_awal;
                this.tgl_akhir = tgl_akhir;
                const datatarik = await queryRekapanInvoiceByStatus
                    (
                        tgl_awal,
                        tgl_akhir,
                        nama_perusahaan,
                        nama_cabang,
                        status
                    );
                this.dataInvoice = datatarik as unknown as invoiceM[];
                useloadingStore().setLoading(false);
            } catch (error) {
                useloadingStore().setLoading(false);
            }
        },
    },
});
