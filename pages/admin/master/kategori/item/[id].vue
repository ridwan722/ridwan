<script setup lang="ts">
import _ from "lodash";
import { useMasterKategoriStore } from "~/stores/master/kategoriStore";
import { useloadingStore } from "~/stores/loadingStore";
import type { ItemDokumenM, itemKategoriM } from "~/types/master/kategoriModel";
import { useMasterDokumenStore } from "~/stores/master/dokumenStore";
import moment from "moment";
import { ref } from "vue";

const isExpanded = ref(false);

definePageMeta({ layout: "admin" });
const masterdokumenstore = useMasterDokumenStore();
const masterKategoriItemStore = useMasterKategoriStore();
const loadingStore = useloadingStore();
const route = useRoute();
const notificationStore = useNotificationStore();
const pictureStore = usePictureStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);
const penawaranstore = usePenawaranStore();

const uploadstore = uploadStore();

const rubahtanggalunix = (unix?: number) => {
  if (!unix) return "-";
  return new Date(unix * 1000).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
const activeFilter = ref("Penawaran");

const data = reactive({
  dialogdokumen: false,
  updatedokumen: [] as ItemDokumenM[],
  search: "",
  headerdokument: [
    {
      title: "No",
      value: "no",
    },
    { title: "Nama Dokumen", value: "nama_dokumen", sortable: true },
    { title: "No Dokumen", value: "no_dokumen", sortable: true },
    { title: "File Dokumen", value: "file_dokumen", sortable: true },
    {
      title: "Aksi",
      value: "aksi",
    },
  ],

  headPenawaran: [
    { title: "No", value: "no", width: "50px" },
    { title: "Tanggal", value: "tanggal", sortable: true },
    { title: "No. Penawaran", value: "no_penawaran", sortable: true },
    { title: "Perihal", value: "perihal", sortable: true },
    { title: "Total", value: "total", sortable: true },
    {
      title: "Status",
      value: "status",
      sortable: true,
      align: "center" as const,
    },

    { title: "Aksi", value: "aksi", align: "center" as const, width: "50px" },
  ],

  headinvoice: [
    { title: "No", value: "no" },

    {
      title: "Tanggal",
      value: "createdAt",
      sortable: true,
    },

    {
      title: "Nomor invoice",
      value: "no_inv",
      sortable: true,
    },
    {
      title: "Total",
      value: "grandtotal",
      sortable: true,
    },

    {
      title: "Status",
      value: "status",
      sortable: true,
    },

    {
      title: "Aksi",
      value: "aksi",
      align: "center" as const,
      width: 120,
    },
  ],
});

const newdokument = ref<ItemDokumenM>({
  id_dokumen: "",
  nama_dokumen: "",
  no_dokumen: "",
  file_dokumen: "",
});

onMounted(async () => {
  const id = route.params.id;
  if (id) {
    try {
      loadingStore.setLoading(true);
      await masterKategoriItemStore.tarikDetailItemKategoriAct(_.toString(id));
      await masterKategoriItemStore.tarikDataItemKategoriInvoice(
        _.toString(id),
      );
      await masterKategoriItemStore.tarikDataItemKategoriPenawaran(
        _.toString(id),
      );
    } catch (e) {
      console.error("Fetch detail error:", e);
    } finally {
      loadingStore.setLoading(false);
    }
  }
});

// Fungsi untuk menghitung sisa hari (Pastikan Moment.js sudah terinstall)
const countdowndayPenawaran = (tanggal: string) => {
  if (!tanggal) return 0;
  const target = moment(tanggal);
  const sekarang = moment();
  const selisih = target.diff(sekarang, "days");
  return selisih > 0 ? selisih : 0;
};

// Fungsi menghitung progress (Asumsi 30 hari adalah jangka waktu maksimal penawaran)
const calculateProgressPenawaran = (tanggal: string) => {
  const sisa = countdowndayPenawaran(tanggal);
  const max = 30; // Batas durasi dalam hari
  const progress = (sisa / max) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

// Warna yang lebih "Vibrant" untuk UI modern
const getDeadlineColorPenawaran = (tanggal: string) => {
  const hari = countdowndayPenawaran(tanggal);
  if (hari > 20) return "teal-accent-4"; // Masih sangat aman
  if (hari > 10) return "light-blue-darken-1"; // Aman
  if (hari > 5) return "amber-darken-2"; // Perlu diperhatikan
  return "red-accent-3"; // Segera/Kritis
};

const detailKategoriItem = computed(() => {
  return masterKategoriItemStore.getDetailItemKategori as itemKategoriM;
});
const itemsKategoriPenawaran = computed(
  () => masterKategoriItemStore.getDataItemKategoriPenawaran || [],
);
const itemsKategoriInvoice = computed(
  () => masterKategoriItemStore.getDataItemKategoriInvoice || [],
);

// Badge Count Dinamis berdasar status
const countItems = computed(() => {
  return {
    penawaran: masterKategoriItemStore.getDataItemKategoriPenawaran.length,
    invoice: masterKategoriItemStore.getDataItemKategoriInvoice.length,
  };
});

const tableItems = computed(() => {
  switch (activeFilter.value) {
    case "Penawaran":
      return itemsKategoriPenawaran.value ?? [];
    case "Invoice":
      return itemsKategoriInvoice.value ?? [];
    default:
      return [];
  }
});

const tableHeaders = computed(() => {
  if (activeFilter.value === "Penawaran") {
    return data.headPenawaran;
  }

  if (activeFilter.value === "Invoice") {
    return data.headinvoice;
  }

  return [];
});

watch(
  () => newdokument.value.id_dokumen,

  (idDokumen) => {
    const dataDokumen = masterdokumenstore.getDataDokumen;

    const b = _.find(dataDokumen, (o: any) => o.id == idDokumen);
    // console.logb, 'si b')
    if (!_.isUndefined(b)) {
      newdokument.value.nama_dokumen = b!.nama_dokumen;
    }
  },
);

function adddokument() {
  newdokument.value.file_dokumen = uploadstore.getUrlRef;
  if (!newdokument.value.nama_dokumen) {
    return notificationStore.showError("Silakan pilih dokumen terlebih dahulu");
  }
  if (!newdokument.value.no_dokumen) {
    return notificationStore.showError("no dokumen tidak boleh kosong");
  }
  if (!newdokument.value.file_dokumen) {
    return notificationStore.showError("file dokumen tidak boleh kosong");
  }
  console.log("Tambah dokument", newdokument.value);
  data.updatedokumen.push(newdokument.value);
  uploadstore.setReset();
  newdokument.value = {
    id_dokumen: "",
    nama_dokumen: "",
    no_dokumen: "",
    file_dokumen: "",
  };
}

function removeDokument(index: number) {
  data.updatedokumen.splice(index, 1);
}

function updatefiledokumen() {
  if (!newdokument.value.id_dokumen) return;
  newdokument.value.file_dokumen = uploadstore.getUrlRef;
  detailKategoriItem.value.dokumen = [{ ...newdokument.value }];
  console.log("update dokument", detailKategoriItem.value.dokumen);
  masterKategoriItemStore.updateMasterItemKategoriAct(detailKategoriItem.value);
  newdokument.value = {
    id_dokumen: "",
    nama_dokumen: "",
    no_dokumen: "",
    file_dokumen: "",
  };
  data.dialogdokumen = false;
}

const openDialogEdit = async () => {
  await masterdokumenstore.tarikDataMasterDokumenAct();
  data.dialogdokumen = true;
};

const isLoading = computed(() => loadingStore.getLoading);
</script>

<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <div class="d-flex align-center justify-space-between mb-4">
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="tonal"
      color="grey-darken-3"
      class="text-none"
      rounded="lg"
      size="small"
      @click="$router.back()"
    >
      Kembali
    </v-btn>
  </div>

  <div v-if="detailKategoriItem">
    <v-dialog v-model="data.dialogdokumen" max-width="650px">
      <v-card rounded="xl">
        <v-card-title class="px-6 py-4 d-flex align-center bg-grey-lighten-4">
          <v-icon class="mr-2">mdi-file-edit-outline</v-icon>
          <span class="text-h6 font-weight-bold">Update Dokumen Pendukung</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="12" sm="6">
              <a-select
                v-model="newdokument.id_dokumen"
                item-title="nama_dokumen"
                item-value="id"
                :items="masterdokumenstore.getDataDokumen"
                placeholder="Pilih Jenis Dokumen"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <a-text-field
                v-model="newdokument.no_dokumen"
                placeholder="No. Dokumen"
              />
            </v-col>
            <v-col cols="12" class="mt-2">
              <upload-image />
            </v-col>
          </v-row>

          <!-- <v-btn block color="primary" size="small" @click="adddokument"
            ><strong>Tambah</strong></v-btn
          >

          <v-data-table
            hide-default-footer
            :headers="data.headerdokument"
            :items="data.updatedokumen"
            class="mt-4 border rounded-lg"
          >
            <template v-slot:item.no="{ index }"> {{ index + 1 }} </template>
            <template v-slot:item.file_dokumen="{ item }">
              <v-btn
                size="x-small"
                color="blue"
                variant="tonal"
                :href="item.file_dokumen"
                target="_blank"
                >Lihat File</v-btn
              >
            </template>
            <template v-slot:item.aksi="{ index }">
              <v-btn
                icon="mdi-trash-can"
                size="x-small"
                color="error"
                variant="text"
                @click="removeDokument(index)"
              />
            </template>
          </v-data-table> -->
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" color="grey" @click="data.dialogdokumen = false"
            >Batal</v-btn
          >
          <v-btn
            color="primary"
            variant="flat"
            class="px-6"
            @click="updatefiledokumen"
            >Simpan Perubahan</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card variant="flat" class="mb-4 border rounded-xl overflow-hidden">
      <div class="bg-primary-lighten-5 pa-4 d-flex align-center border-bottom">
        <v-avatar color="primary" size="48" class="mr-4 elevation-2">
          <v-icon color="white">mdi-package-variant-closed</v-icon>
        </v-avatar>
        <div>
          <div class="text-h6 font-weight-black">
            {{ detailKategoriItem.nama_kategori_item || "-" }}
          </div>
          <div class="text-caption text-grey-darken-1">
            {{ detailKategoriItem.nama_perusahaan }} •
            {{ detailKategoriItem.nama_cabang }}
          </div>
        </div>
      </div>

      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="3" class="border-right-md">
            <label class="text-overline text-grey">Kategori Objek</label>
            <div class="text-body-1 font-weight-bold">
              {{ detailKategoriItem.nama_kategori_object }} ||
              {{ detailKategoriItem.id_object_kategori }}
            </div>
          </v-col>
          <v-col cols="12" md="3" class="border-right-md">
            <label class="text-overline text-grey">Jumlah Unit</label>
            <div class="text-body-1 font-weight-bold">
              {{ detailKategoriItem.jumlahUnit || "0" }} Unit
            </div>
          </v-col>
          <v-col cols="12" md="3" class="border-right-md">
            <label class="text-overline text-grey">Nominal</label>
            <div class="text-h6 font-weight-black text-success">
              Rp {{ (detailKategoriItem.nominal || 0).toLocaleString("id-ID") }}
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-overline text-grey">Masa Berlaku</label>
            <div class="d-flex align-center">
              <v-icon size="16" color="blue" class="mr-1"
                >mdi-calendar-range</v-icon
              >
              <span class="text-caption font-weight-bold">
                {{ detailKategoriItem.periode?.mulai || "-" }} —
                {{ detailKategoriItem.periode?.selesai || "-" }}
              </span>
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <v-row>
          <v-col cols="12" sm="6">
            <label class="text-overline text-grey">Ukuran</label>
            <div class="d-flex flex-wrap gap-2 mt-1">
              <v-chip
                v-for="sz in detailKategoriItem.ukuran || []"
                :key="sz"
                size="small"
                variant="tonal"
                color="grey-darken-3"
              >
                {{ sz }}
              </v-chip>
              <span
                v-if="!detailKategoriItem.ukuran?.length"
                class="text-caption text-grey font-italic"
                >tidak memiliki ukuran</span
              >
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <label class="text-overline text-grey">Keterangan</label>
            <p class="text-body-2 text-medium-emphasis font-italic">
              "{{
                detailKategoriItem.keterangan ||
                "Tidak ada keterangan tambahan."
              }}"
            </p>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />
      <div
        class="pa-3 bg-grey-lighten-4 d-flex flex-wrap justify-space-between align-center px-6"
      >
        <div class="text-caption text-grey">
          <v-icon size="14">mdi-plus-circle-outline</v-icon>
          Dibuat: <b>{{ detailKategoriItem.createdBy }}</b> ({{
            rubahtanggalunix(detailKategoriItem.createdAt)
          }})
        </div>
        <div v-if="detailKategoriItem.updatedAt" class="text-caption text-grey">
          <v-icon size="14">mdi-pencil-outline</v-icon>
          Update terakhir:
          <b>{{ rubahtanggalunix(detailKategoriItem.updatedAt) }}</b>
        </div>
      </div>
    </v-card>

    <!-- // DOKUMEN PENDUKUNG \\ -->
    <div class="d-flex align-center justify-space-between mb-3 mt-6">
      <div class="text-subtitle-1 font-weight-bold d-flex align-center">
        <v-icon start color="blue-darken-2">mdi-attachment</v-icon>
        Dokumen Pendukung
        <v-badge
          :content="detailKategoriItem.dokumen?.length || 0"
          color="blue"
          inline
          class="ml-2"
        />
      </div>
      <v-btn
        variant="text"
        color="primary"
        size="small"
        prepend-icon="mdi-plus"
        @click="openDialogEdit"
        class="text-none"
      >
        Update Dokumen
      </v-btn>
    </div>

    <v-row dense class="mb-6">
      <v-col
        v-for="(doc, i) in detailKategoriItem.dokumen || []"
        :key="i"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card variant="outlined" class="rounded-lg hover-doc border-dashed">
          <div class="pa-3 d-flex align-center">
            <v-avatar
              rounded="lg"
              color="blue-lighten-5"
              size="40"
              class="mr-3"
            >
              <v-icon color="primary">mdi-file-document-outline</v-icon>
            </v-avatar>
            <div class="overflow-hidden mr-2">
              <div class="text-caption font-weight-bold text-truncate">
                {{ doc.nama_dokumen }}
              </div>
              <div class="text-grey" style="font-size: 10px">
                {{ doc.no_dokumen }}
              </div>
            </div>
            <v-spacer />
            <v-btn
              icon="mdi-eye"
              size="x-small"
              variant="tonal"
              color="primary"
              :href="doc.file_dokumen"
              target="_blank"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- // HISTORY BERKAS \\ -->
    <div class="d-flex align-center justify-space-between mb-3 mt-6">
      <div class="text-subtitle-1 font-weight-bold d-flex align-center">
        <v-icon start color="blue-darken-2">mdi-attachment</v-icon>
        History Berkas
      </div>
    </div>

    <div
      class="document-section"
      v-if="detailKategoriItem?.dokumen_berkas?.length > 0"
    >
      <div
        :class="['document-grid-wrapper', { 'is-expanded': isExpanded }]"
        :style="{ maxHeight: isExpanded ? '550px' : '122px' }"
      >
        <v-row dense>
          <v-col
            v-for="(doc, i) in detailKategoriItem.dokumen_berkas || []"
            :key="i"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              variant="outlined"
              class="rounded-lg hover-doc border-dashed mt-1"
            >
              <div class="pa-3 d-flex align-center">
                <v-avatar
                  rounded="lg"
                  color="blue-lighten-5"
                  size="40"
                  class="mr-3"
                >
                  <v-icon color="primary">mdi-file-document-outline</v-icon>
                </v-avatar>

                <div class="overflow-hidden mr-2">
                  <div class="text-body-2 font-weight-bold text-truncate">
                    {{ doc.nama_dokumen }}
                  </div>
                  <div class="text-caption" style="font-size: 10px">
                    No Dokumen : {{ doc.no_dokumen }}
                  </div>
                  <v-chip
                    class="my-1"
                    :color="doc.status_dokumen === 'Asli' ? 'primary' : 'grey'"
                    size="x-small"
                    >{{ doc.status_dokumen }}</v-chip
                  >
                  <v-divider class="mb-1" />
                  <div class="text-truncate" style="font-size: 10px">
                    {{ doc.periode_mulai }} s/d {{ doc.periode_selesai }}
                  </div>
                </div>

                <v-spacer />

                <v-btn
                  size="x-small"
                  variant="tonal"
                  color="primary"
                  :href="doc.file_dokumen"
                  target="_blank"
                  prepend-icon="mdi-file-document-outline"
                >
                  View
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <div
        v-if="(detailKategoriItem.dokumen_berkas || []).length > 3"
        class="mt-2 text-center"
      >
        <v-btn
          variant="text"
          color="primary"
          size="small"
          class="text-none"
          @click="isExpanded = !isExpanded"
        >
          {{ isExpanded ? "Tampilkan Lebih Sedikit" : "Lihat Semua" }}
          <v-icon end>{{
            isExpanded ? "mdi-chevron-up" : "mdi-chevron-down"
          }}</v-icon>
        </v-btn>
      </div>
    </div>

    <div
      v-else
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 50px;
        border: 1px dashed #ccc;
        border-radius: 8px;
        color: #999;
        font-size: 14px;
      "
      class="font-italic"
    >
      history berkas kosong
    </div>

    <v-card flat class="border rounded-xl mt-6">
      <v-tabs
        v-model="activeFilter"
        color="primary"
        density="comfortable"
        class="border-bottom"
      >
        <v-tab value="Penawaran" class="text-none font-weight-bold">
          Penawaran
          <v-chip size="x-small" class="ml-2">{{
            countItems.penawaran
          }}</v-chip>
        </v-tab>
        <v-tab value="Invoice" class="text-none font-weight-bold">
          Invoice
          <v-chip size="x-small" class="ml-2">{{ countItems.invoice }}</v-chip>
        </v-tab>
      </v-tabs>

      <div class="pa-4 d-flex align-center bg-grey-lighten-5">
        <v-text-field
          v-model="data.search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Cari data..."
          variant="solo"
          density="compact"
          hide-details
          rounded="lg"
          flat
          class="max-width-search border"
        />
      </div>

      <v-data-table
        :items="tableItems"
        :headers="tableHeaders"
        :search="data.search"
        :loading="loadingStore.getLoading"
        class="compact-table"
      >
        <template v-slot:item.no="{ index }">
          <span>{{ index + 1 }}</span>
        </template>

        <template v-slot:item.perihal="{ item }">
          <div style="min-width: 220px">
            {{ item.perihal }}
          </div>
        </template>

        <template v-slot:item.total="{ item }">
          <div style="width: 100px">
            <span class="font-weight-bold">Rp {{ rupiah(item.total) }}</span>
          </div>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            size="x-small"
            variant="flat"
            class="text-uppercase font-weight-bold"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template
          v-slot:item.subtotal="{ item }"
          v-if="activeFilter === 'Invoice'"
        >
          <span class="font-weight-bold text-success">{{
            rupiah(item.subtotal)
          }}</span>
        </template>

        <template
          v-slot:item.no_inv="{ item }"
          v-if="activeFilter === 'Invoice'"
        >
          <span>#{{ item.no_inv }}</span>
        </template>

        <template
          v-slot:item.createdAt="{ item }"
          v-if="activeFilter === 'Invoice'"
        >
          <span>{{ rubahtanggalunix(item.createdAt) }}</span>
        </template>

        <template
          v-slot:item.grandtotal="{ item }"
          v-if="activeFilter === 'Invoice'"
        >
          <span class="font-weight-bold">Rp {{ rupiah(item.grandtotal) }}</span>
        </template>
        <template v-slot:item.aksi="{ item }">
          <v-btn
            icon="mdi-eye-outline"
            size="small"
            variant="text"
            color="primary"
            :to="
              (activeFilter === 'Penawaran'
                ? '/admin/penawaran/'
                : '/admin/invoice/') + item.id
            "
          />
        </template>
      </v-data-table>
    </v-card>
  </div>

  <div
    v-else-if="isLoading"
    class="d-flex flex-column align-center justify-center py-12"
  >
    <v-progress-circular indeterminate color="primary" size="50" />
    <div class="mt-4 text-grey">Memuat Detail Kategori...</div>
  </div>
</template>

<style scoped>
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}
.border-right-md {
  @media (min-width: 960px) {
    border-right: 1px solid rgba(0, 0, 0, 0.05);
  }
}
.border-dashed {
  border: 1.5px dashed #e0e0e0 !important;
}
.gap-2 {
  gap: 8px;
}
.max-width-search {
  max-width: 300px;
}
.hover-doc {
  transition: all 0.2s ease;
}
.hover-doc:hover {
  background: #f8fbff;
  border-color: #1767c0 !important;
  transform: translateY(-1px);
}
.compact-table :deep(thead th) {
  background-color: #fcfcfc !important;
  text-transform: uppercase;
  font-size: 11px !important;
  letter-spacing: 0.5px;
  font-weight: 700 !important;
  color: #616161 !important;
}

.document-grid-wrapper {
  overflow: hidden; /* Sembunyikan item yang berlebih di awal */
  transition: max-height 0.3s ease-in-out; /* Animasi buka-tutup */
}

.document-grid-wrapper.is-expanded {
  overflow-y: auto; /* Aktifkan scroll saat mode expand */
  padding-right: 4px;
}

/* Custom Scrollbar */
.document-grid-wrapper::-webkit-scrollbar {
  width: 5px;
}
.document-grid-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.document-grid-wrapper::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

/* Style Card Anda */
.hover-doc {
  transition: all 0.2s;
}
.hover-doc:hover {
  border-color: #195de6 !important;
  background-color: rgba(25, 93, 230, 0.02);
}
</style>
