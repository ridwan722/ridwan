import type { get } from "firebase/database";
import { defineStore } from "pinia";
import type { penawaranM, revisipenawaranM } from "~/types/penawaranModel";

export const usePenawaranStore = defineStore("PenawaranStore", {
  state: () => {
    return {
      dataPenawaran: [] as penawaranM[],
      dataPenawaranTampil: [] as penawaranM[], // DATA FILTER (Untuk Tabel di Halaman)
      detailPenawaran: {} as penawaranM,
      tgl_awal: "",
      tgl_akhir: "",

      // KHUSUS COUNTER SIDEBAR
      dataPenawaranDraft: [] as penawaranM[],
      dataPenawaranProses: [] as penawaranM[],
      dataPenawaranPemberkasan: [] as penawaranM[],


      dataRevisiPenawaran: [] as revisipenawaranM[],
      detailRevisiPenawaran: {} as revisipenawaranM,

    };
  },

  getters: {
    getDataPenawaran(state) {
      return state.dataPenawaran;
    },

    getDataRevisiPenawaran(state) {
      return state.dataRevisiPenawaran;
    },

    getDetailRevisiPenawaran(state) {
      return state.dataRevisiPenawaran;
    },

    getDetailPenawaran(state) {
      return state.detailPenawaran;
    },

    getPenawaranByStatus: (state) => {
      return (status: string) =>
        state.dataPenawaran.filter((p) => p.status === status);
    },

    getPenawaranById: (state) => {
      return (id: string) =>
        state.dataPenawaran.find((p) => p.id! === id);
    },
  },

  actions: {
    // CREATE
    async addPenawaranAct(lemparPenawaran: penawaranM) {
      const notificationStore = useNotificationStore();
      try {
        useloadingStore().setLoading(true);

        await setdatabase(
          "penawaran",
          lemparPenawaran.nomor!,
          lemparPenawaran
        );

        await this.tarikDataPenawaranAct();

        notificationStore.showSuccess("Penawaran berhasil ditambahkan");
        useloadingStore().setLoading(false);
      } catch (error) {
        notificationStore.showError("Gagal menyimpan penawaran");
        useloadingStore().setLoading(false);
      }
    },

    // UPDATE
    async updatePenawaranAct(lemparPenawaran: penawaranM) {
      const notificationStore = useNotificationStore();
      try {
        useloadingStore().setLoading(true);

        await updatedatabase(
          "penawaran",
          lemparPenawaran.nomor,
          lemparPenawaran
        );

        await this.tarikDataPenawaranAct();

        notificationStore.showSuccess("Penawaran berhasil diperbarui");
        useloadingStore().setLoading(false);
      } catch (error) {
        notificationStore.showError("Gagal memperbarui penawaran");
        useloadingStore().setLoading(false);
      }
    },

    // DELETE
    async deletePenawaranAct(lemparinvoice: penawaranM) {
      const notificationStore = useNotificationStore();
      try {
        useloadingStore().setLoading(true);

        // await hapusdatabase("penawaran", id);
        const uniqueKategori = [
          ...new Set(lemparinvoice.items.map(i => i.id_kategori_item)),
        ];
        const databatch = [
          {
            type: "delete",
            id: lemparinvoice.id!,
            collection: "penawaran",
            data: lemparinvoice,
          },
          ...uniqueKategori.map(id => ({
            type: "delete",
            id: lemparinvoice.id!,
            collection: `m_item_kategori/${id}/penawaran`,
            data: lemparinvoice,
          })),
          ...uniqueKategori.map(id => ({
            type: "update",
            id: id,
            collection: `m_cabang/${lemparinvoice.id_cabang_perusahaan}/m_item_kategori`,
            data: { status: 'Draft' },
          })),
          ...uniqueKategori.map(id => ({
            type: "update",
            id: id,
            collection: `m_item_kategori`,
            data: { status: 'Draft' },
          })),
        ];

        await batching(databatch)
        await this.tarikDataPenawaranAct();

        notificationStore.showSuccess("Penawaran berhasil dihapus");
        useloadingStore().setLoading(false);
      } catch (error) {
        notificationStore.showError("Gagal menghapus penawaran");
        useloadingStore().setLoading(false);
      }
    },

    // READ
    // async tarikDataPenawaranAct() {
    //   const datatarik = await queryambilid("penawaran");
    //   this.dataPenawaran = datatarik as unknown as penawaranM[];
    // },

    async tarikDataPenawaranAct() {
      const datatarik = await queryambilid("penawaran");
      const hasil = datatarik as unknown as penawaranM[];
      this.dataPenawaran = hasil; // Simpan ke Master
      this.dataPenawaranTampil = hasil; // Default tampilkan semua
    },

    

    // Ambil data berdasarkan status (Panggil ini di halaman Proses/Sent/dll)
    async tarikdatapenawaranbystatus(status: string) {
      this.dataPenawaranTampil = [];
      const datatarik = await queryPenawaranBystatus(status);
      // JANGAN TIMPA this.dataPenawaran
      this.dataPenawaranTampil = datatarik as unknown as penawaranM[];
    },

    /**
     * KHUSUS SIDEBAR
     * STATUS DRAFT
     */
    async tarikdatapenawaranbystatusDraft(status: string) {
      const datatarik =
        await queryPenawaranBystatus(status);

      this.dataPenawaranDraft =
        datatarik as unknown as penawaranM[];
    },

    async tarikPenawaranProses() {
      const datatarik =
        await queryPenawaranBystatus("Proses");

      this.dataPenawaranProses =
        datatarik as unknown as penawaranM[];
    },

    async tarikPenawaranPemberkasan() {
      const datatarik =
        await queryPenawaranBystatus("Pemberkasan");

      this.dataPenawaranPemberkasan =
        datatarik as unknown as penawaranM[];
    },

    async tarikdatapenawaranbystatusarray(status: string[]) {
      const datatarik = await queryPenawaranBystatusarray(status);
      this.dataPenawaranTampil = datatarik as unknown as penawaranM[];
      // JANGAN timpa this.dataPenawaran di sini!
    },

    async tarikDetailPenawaranAct(id: string) {
      const datatarik = await tarikdetaildatabase("penawaran", id);
      this.detailPenawaran = datatarik as unknown as penawaranM;
    },

    async tarikDataPenawaranrevisAct(id_penawaran: string) {
      const datatarik = await queryambilid("penawaran/" + id_penawaran + "/revisi_penawaran");
      this.dataRevisiPenawaran = datatarik as unknown as revisipenawaranM[];
    },

    async tarikDetailPenawaranrevisAct(id_penawaran: string, id_revisi_penawaran: string) {
      const datatarik = await tarikdetaildatabase("penawaran/" + id_penawaran + "/revisi_penawaran", id_revisi_penawaran);
      this.detailRevisiPenawaran = datatarik as unknown as revisipenawaranM;
    },

    // async tarikdatapenawaranbystatus(status: string) {
    //   const datatarik = await queryPenawaranBystatus(status);
    //   this.dataPenawaran = datatarik as unknown as penawaranM[];
    // },

    //  async tarikdatapenawaranbystatusarray(status: string[]) {
    //   const datatarik = await queryPenawaranBystatusarray(status);
    //   this.dataPenawaran = datatarik as unknown as penawaranM[];
    // },

    async queryrekapanpenawaran(
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
        const datatarik = await queryRekapanPenawaranByStatus
          (
            tgl_awal,
            tgl_akhir,
            nama_perusahaan,
            nama_cabang,
            status
          );
        this.dataPenawaran = datatarik as unknown as penawaranM[];
        useloadingStore().setLoading(false);
      } catch (error) {
        useloadingStore().setLoading(false);
      }
    },
  },
});
