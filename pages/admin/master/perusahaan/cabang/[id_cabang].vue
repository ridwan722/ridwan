<template>
  <v-row class="mb-3">
    <v-col cols="12">
      <v-btn
        prepend-icon="mdi-arrow-left"
        variant="flat"
        color="white"
        class="text-none border"
        rounded="lg"
        @click="$router.back()"
      >
        Kembali
      </v-btn>
    </v-col>
  </v-row>

  <v-container fluid v-if="detailCabang" class="pa-0">
     <!-- // DETAIL CABANG \\ -->
    <v-card rounded="xl" flat class="mb-6 border-left-blue elevation-sm">
      <v-card-title class="pa-5 d-flex align-center flex-wrap">
        <v-avatar size="56" color="primary" variant="tonal" class="mr-4">
          <v-icon size="32" icon="mdi-office-building-marker" />
        </v-avatar>

        <div>
          <div class="text-overline mb-n1 text-primary font-weight-bold">
            Profil Lokasi Cabang
          </div>

          <h2 class="text-h5 font-weight-black">
            {{ detailCabang.nama_cabang }}
          </h2>
          <div class="text-body-2 text-grey-darken-1">
            {{ detailCabang.nama_perusahaan }} Group
          </div>
        </div>

        <v-spacer />

        <div class="text-right mt-2 mt-sm-0">
          <div
            class="text-caption text-grey-darken-1 font-weight-black text-uppercase"
          >
            Total Valuasi Aset
          </div>

          <div class="text-h4 font-weight-black text-success">
            {{ totalValuasi }}
          </div>
        </div>
      </v-card-title>
      <v-divider />

      <v-card-text class="bg-blue-grey-lighten-5 pa-5">
        <v-row dense>
          <v-col cols="12" md="6">
            <div
              class="text-caption text-grey-darken-1 font-weight-bold text-uppercase"
            >
              Alamat Operasional
            </div>

            <div class="text-body-2">{{ detailCabang.alamat_cabang }}</div>
          </v-col>

          <v-col cols="12" md="3">
            <div
              class="text-caption text-grey-darken-1 font-weight-bold text-uppercase"
            >
              Kontak Pusat
            </div>

            <div class="text-body-2">
              {{ detailCabang.telepon_perusahaan || "-" }}
            </div>
          </v-col>

          <v-col cols="12" md="3" class="text-md-right">
            <div
              class="text-caption text-grey-darken-1 font-weight-bold text-uppercase"
            >
              Update Terakhir
            </div>

            <div class="text-body-2 font-weight-black">
              {{
                rubahtanggalunix(
                  detailCabang.updatedAt || detailCabang.createdAt,
                )
              }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <br />

    <!-- // FILTER PENCARIAN \\ -->
    <v-card>
      <v-card-text>
        <v-row
          align="center"
          justify="space-between"
          style="justify-content: center"
          class="mb-2"
        >
          <!-- Judul -->
          <v-col cols="auto">
            <h3 class="text-body-1 font-weight-medium text-grey-darken-1">
              Filter Pencarian
            </h3>
          </v-col>

          <!-- Tombol Filter -->
          <v-col cols="auto">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="small"
                  color="primary"
                  variant="flat"
                  rounded="xl"
                  @click="showFilter = !showFilter"
                  class="d-flex align-center gap-1"
                >
                  <v-icon size="x-large">
                    {{ showFilter ? "mdi-chevron-up" : "mdi-chevron-down" }}
                  </v-icon>
                </v-btn>
              </template>
              <span>Tampilkan / Sembunyikan Filter</span>
            </v-tooltip>
          </v-col>
        </v-row>

        <v-divider />

        <v-expand-transition>
          <div v-show="showFilter">
            <v-row justify="end" class="mt-3">
              <v-col cols="12" sm="4">
                <a-date-picker
                  v-model="data.tanggal_awal"
                  :onUpdate:modelValue="(n: string) => (data.tanggal_awal = n)"
                  label="Pilih Tanggal Awal"
                />
              </v-col>

              <v-col cols="12" sm="4">
                <a-date-picker
                  v-model="data.tanggal_akhir"
                  :onUpdate:modelValue="(n: string) => (data.tanggal_akhir = n)"
                  label="Pilih Tanggal Akhir"
                />
              </v-col>

              <v-col cols="12" sm="4" class="d-flex">
                <a-select
                  v-model="data.status"
                  variant="solo"
                  label="Status"
                  :items="['Draft', 'Penawaran', 'Invoice']"
                />

                <v-btn
                  size="small"
                  class="mt-8 ml-3"
                  color="primary"
                  @click="cekrekapanitemkategori"
                >
                  Terapkan
                  <v-tooltip activator="parent" location="top">
                    Cek data Pesanan Pembelian
                  </v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </v-card-text>
    </v-card>
    <br />

     <!-- // TABLE PEKERJAAN \\ -->
    <v-card flat rounded="xl" class="border elevation-sm overflow-hidden">
      <v-tabs
        v-model="activeFilter"
        bg-color="white"
        color="primary"
        align-tabs="start"
        height="65"
        border-bottom
        show-arrows
      >
        <v-tab value="all" class="text-none font-weight-black">
          Semua Item
          <v-badge
            :content="countItems.all"
            color="grey-lighten-1"
            inline
            class="ml-2"
          />
        </v-tab>

        <v-tab
          value="Draft"
          class="text-none font-weight-black text-blue-darken-2"
        >
          Draft
          <v-badge
            :content="countItems.progres"
            color="blue-darken-2"
            inline
            class="ml-2"
          />
        </v-tab>

        <v-tab
          value="Penawaran"
          class="text-none font-weight-black text-orange-darken-3"
        >
          Penawaran
          <v-badge
            :content="countItems.penawaran"
            color="orange-darken-3"
            inline
            class="ml-2"
          />
        </v-tab>

        <v-tab value="Invoice" class="text-none font-weight-black text-success">
          Invoice
          <v-badge
            :content="countItems.invoice"
            color="success"
            inline
            class="ml-2"
          />
        </v-tab>

        <!-- <v-tab value="expired" class="text-none font-weight-black text-error">
          Expired
          <v-badge
            :content="countItems.expired"
            color="error"
            inline
            class="ml-2"
          />

        </v-tab> -->
      </v-tabs>

      <v-divider />

      <div class="pa-4 bg-white d-flex align-center flex-wrap">
        <div class="text-subtitle-2 font-weight-black text-grey-darken-2">
          History Kategori Item ({{ filteredItems.length }})
        </div>

        <v-spacer />

        <a-text-field
          v-model="data.search"
          placeholder="Cari item, kode, atau kategori..."
          style="max-width: 350px; width: 100%"
        />
      </div>

      <v-data-table
        v-model:items-per-page="data.itemsPerPage"
        :headers="data.headDetailKategoriItem"
        :items="kategoriWithDeadline"
        :search="data.search"
        :loading="loadingStore.getLoading"
        :sort-by="[{ key: 'createdAt', order: 'desc' }]"
        :hover="true"
        class="custom-table"
      >
        <template v-slot:item.no="{ index }">
          <span class="text-grey text-caption font-weight-bold">
            {{ index + 1 }}
          </span>
        </template>

        <template v-slot:item.kategori_gabung="{ item }">
          <div class="py-3">
            <div class="d-flex align-center mb-1">
              <div
                class="text-caption font-weight-black text-primary text-uppercase"
              >
                {{ item.nama_kategori_object }}
              </div>

              <v-divider vertical class="mx-2" length="10" />

              <v-chip
                v-if="item.status"
                size="x-small"
                variant="flat"
                :color="getColorStatusPekerjaan(item.status)"
                class="px-2 font-weight-bold text-uppercase"
              >
                {{ item.status }}
              </v-chip>
            </div>

            <div class="text-body-2 font-weight-bold text-grey-darken-4">
              {{ item.nama_kategori_item }}
              <span class="text-primary font-weight-black">
                ({{ item.jumlahUnit }} Unit)
              </span>
            </div>

            <div
              class="text-caption text-grey font-italic mt-1 d-flex align-center"
            >
              <v-icon size="10" class="mr-1" icon="mdi-tag-outline" />

              {{ item.kode_kategori_item }}

              <v-icon
                v-if="item.dokumen?.length"
                size="14"
                color="red"
                class="ml-2"
                icon="mdi-file-pdf-box"
              />

              <span
                v-if="item.dokumen?.length"
                class="text-caption text-red font-weight-bold ml-1"
              >
                {{ item.dokumen.length }} Dokumen
              </span>
            </div>
          </div>
        </template>

        <template v-slot:item.periode="{ item }">
          <div class="py-2" style="min-width: 180px">
            <div class="d-flex align-center justify-space-between mb-1">
              <v-chip
                :color="checkStatus(item.periode.selesai).color"
                size="x-small"
                variant="flat"
                class="font-weight-black px-1"
              >
                {{ checkStatus(item.periode.selesai).text }}
              </v-chip>

              <span
                class="text-caption font-weight-black"
                :class="`text-${checkStatus(item.periode.selesai).color}`"
              >
                {{ checkStatus(item.periode.selesai).daysLabel }}
              </span>
            </div>

            <v-progress-linear
              :model-value="
                hitungPersentaseWaktu(item.periode.mulai, item.periode.selesai)
              "
              :color="checkStatus(item.periode.selesai).color"
              height="6"
              rounded
            />

            <div class="text-caption text-grey mt-1">
              <span class="font-weight-medium">Mulai:</span>
              {{ item.periode.mulai }}
              <span class="mx-1">–</span>
              <span class="font-weight-medium">Selesai:</span>
              {{ item.periode.selesai }}
            </div>
          </div>
        </template>

        <template v-slot:item.nominal="{ item }">
          <div class="text-right">
            <div class="text-body-2 font-weight-black text-success">
              {{
                item.nominal
                  ? "Rp " + item.nominal.toLocaleString("id-ID")
                  : "-"
              }}
            </div>

            <div class="text-caption text-grey font-weight-bold font-italic">
              Valuasi Item
            </div>
          </div>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            size="27"
            variant="tonal"
            color="green"
            class="rounded-lg"
            @click="openDetailItem(item)"
          >
            <v-icon icon="mdi-eye-outline" />

            <v-tooltip activator="parent" location="top">Detail</v-tooltip>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <v-dialog v-model="modalDetail.show" max-width="900">
    <v-card v-if="modalDetail.data" rounded="xl">
      <v-card-title
        class="px-4 text-subtitle-1 font-weight-bold bg-primary pa-3 d-flex justify-space-between align-center"
      >
        DETAIL INFORMASI PEKERJAAN

        <v-btn
          size="40"
          variant="text"
          rounded="xl"
          @click="modalDetail.show = false"
        >
          <v-icon icon="mdi-close" />
          <v-tooltip activator="parent" location="top">Tutup</v-tooltip>
        </v-btn>
      </v-card-title>

      <v-card-text class="bg-grey-lighten-5">
        <v-row>
          <v-col cols="12" md="7">
            <div class="text-overline text-primary font-weight-bold mb-1">
              Status Prosedur
            </div>

            <v-card flat rounded="lg" class="pa-4 mb-6 bg-white border">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-body-2 font-weight-bold">
                  {{ modalDetail.data.status }}
                </span>

                <v-chip size="x-small" color="primary" variant="flat">
                  {{ modalDetail.data.jumlahUnit }} Unit
                </v-chip>
              </div>

              <v-progress-linear
                :model-value="getStepperValue(modalDetail.data.status)"
                :color="getColorStatusPekerjaan(modalDetail.data.status)"
                height="8"
                rounded
                striped
              />

              <div
                class="d-flex justify-space-between mt-2 text-overline text-grey"
                style="font-size: 8px !important"
              >
                <span>Draft</span>
                <span>PENAWARAN</span>
                <span>INVOICE</span>
              </div>
            </v-card>

            <v-card
              flat
              rounded="lg"
              class="pa-0 overflow-hidden border bg-white"
            >
              <v-table density="comfortable" class="text-body-2">
                <tbody>
                  <tr>
                    <td width="160" class="bg-grey-lighten-4 font-weight-bold">
                      Nama Item
                    </td>

                    <td>{{ modalDetail.data.nama_kategori_item }}</td>
                  </tr>

                  <tr>
                    <td class="bg-grey-lighten-4 font-weight-bold">
                      Kategori Objek
                    </td>

                    <td>{{ modalDetail.data.nama_kategori_object }}</td>
                  </tr>

                  <tr>
                    <td class="bg-grey-lighten-4 font-weight-bold">
                      Ukuran / Spek
                    </td>

                    <td>
                      <div
                        v-for="(uk, i) in modalDetail.data.ukuran"
                        :key="i"
                        class="pa-2 bg-blue-lighten-5 rounded mb-1 text-caption font-weight-bold"
                      >
                        <v-icon
                          size="12"
                          color="primary"
                          class="mr-1"
                          icon="mdi-label-outline"
                        />

                        {{ uk }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>

          <v-col cols="12" md="5">
            <div class="text-overline text-primary font-weight-bold mb-1">
              Masa Kontrak
            </div>

            <v-card
              flat
              rounded="lg"
              class="pa-5 mb-6 border bg-white text-center"
            >
              <div class="text-h4 font-weight-black text-primary">
                {{
                  hitungTotalHari(
                    modalDetail.data.periode.mulai,
                    modalDetail.data.periode.selesai,
                  )
                }}
              </div>

              <div class="text-caption text-grey font-weight-bold mb-4">
                TOTAL HARI
              </div>

              <v-divider class="mb-4" />

              <div
                class="d-flex justify-space-between text-body-2 font-weight-bold px-2 text-center"
              >
                <div>
                  <div class="text-caption text-grey">Mulai</div>

                  <div>{{ modalDetail.data.periode.mulai }}</div>
                </div>

                <v-icon color="grey-lighten-2" icon="mdi-chevron-right" />

                <div>
                  <div class="text-caption text-grey">Selesai</div>

                  <div class="text-error">
                    {{ modalDetail.data.periode.selesai }}
                  </div>
                </div>
              </div>
            </v-card>

            <div class="text-overline text-primary font-weight-bold mb-2">
              Arsip Dokumen
            </div>

            <v-list
              v-if="modalDetail.data.dokumen?.length"
              border
              rounded="lg"
              class="pa-0 bg-white"
            >
              <v-list-item
                v-for="(doc, idx) in modalDetail.data.dokumen"
                :key="idx"
                :title="doc.nama_dokumen"
                :subtitle="doc.no_dokumen"
              >
                <template v-slot:prepend>
                  <v-icon color="red" icon="mdi-file-pdf-box" />
                </template>

                <template v-slot:append>
                  <v-btn
                    icon="mdi-open-in-new"
                    variant="text"
                    size="small"
                    color="primary"
                    @click="bukaFile(doc.file_dokumen)"
                  />
                </template>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="bg-white pa-4 text-caption text-grey">
        User: {{ modalDetail.data.createdBy }} ({{
          rubahtanggalunix(modalDetail.data.createdAt)
        }})
        <v-spacer />

        <span v-if="modalDetail.data.updatedBy">
          Terakhir Update:
          {{ rubahtanggalunix(modalDetail.data.updatedAt) }}
        </span>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import _ from "lodash";
import { useMasterPerusahaanStore } from "~/stores/master/perusahaanStore";

definePageMeta({ layout: "admin" });

const route = useRoute();
const cabangStore = useMasterPerusahaanStore();
const loadingStore = useloadingStore();
const showFilter = ref(false);
const notificationStore = useNotificationStore();

/* ================= STATE ================= */
const activeFilter = ref<string>("all");

const data = reactive({
  search: "",
  tanggal_awal: "",
  tanggal_akhir: "",
  status: "",
  itemsPerPage: 10,

  headDetailKategoriItem: [
    { title: "No", key: "no", width: "50px" },
    {
      title: "Item & Status",
      key: "kategori_gabung",
      align: "start" as const,
      sortable: true,
    },
    { title: "Masa Berlaku", key: "periode", sortable: true },
    { title: "Valuasi", key: "nominal", align: "end" as const, sortable: true },
    { title: "Aksi", key: "actions", align: "center" as const },
  ],
});

const kategoriWithDeadline = computed(() => {
  return [...tableItems.value]
    .map((item) => {
      const deadline =
        item.periode?.selesai && item.periode.selesai !== "-"
          ? new Date(item.periode.selesai).getTime()
          : Infinity; // biar "-" selalu di bawah

      return {
        ...item,
        deadlineSort: deadline,
      };
    })
    .sort((a, b) => {
      // TERLAMA → TERBARU
      return a.deadlineSort - b.deadlineSort;
    });
});

const modalDetail = reactive({
  show: false,
  data: null as any,
});

/* ================= FETCH DATA ================= */
onMounted(async () => {
  const id = route.params.id_cabang;
  loadingStore.setLoading(true);
  try {
    await Promise.all([
      cabangStore.tarikDetailCabangAct(_.toString(id)),
      cabangStore.tarikDataCabangItemKategori(_.toString(id)),
    ]);
  } finally {
    loadingStore.setLoading(false);
  }
});

/* ================= SOURCE DATA ================= */
const detailCabang = computed(() => cabangStore.getDetailCabang);
const allItems = computed<any[]>(() => cabangStore.getDataItemKategori || []);

/* ================= FILTER TAB ================= */
const filteredItems = computed(() => {
  if (activeFilter.value === "all") return allItems.value;

  if (activeFilter.value === "expired") {
    return allItems.value.filter(
      (i) => checkStatus(i.periode?.selesai).text === "Expired",
    );
  }

  return allItems.value.filter((i) => i.status === activeFilter.value);
});

/* ================= SEARCH ================= */
const tableItems = computed(() => {
  if (!data.search) return filteredItems.value;

  const keyword = data.search.toLowerCase();

  return filteredItems.value.filter((i) =>
    [
      i.nama_kategori_item,
      i.nama_kategori_object,
      i.kode_kategori_item,
      i.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(keyword),
  );
});

/* ================= BADGE COUNT ================= */
const countItems = computed(() => ({
  all: allItems.value.length,
  progres: allItems.value.filter((i) => i.status === "Draft").length,
  penawaran: allItems.value.filter((i) => i.status === "Penawaran").length,
  invoice: allItems.value.filter((i) => i.status === "Invoice").length,
  // expired: allItems.value.filter(
  //   (i) => checkStatus(i.periode?.selesai).text === "Expired"
  // ).length,
}));

/* ================= VALUASI ================= */
const totalValuasi = computed(() => {
  const total = _.sumBy(allItems.value, "nominal") || 0;
  return "Rp " + total.toLocaleString("id-ID");
});

/* ================= HELPERS ================= */
const getColorStatusPekerjaan = (status: string) => {
  switch (status) {
    case "Draft":
      return "blue-darken-1";
    case "Penawaran":
      return "orange-darken-2";
    case "Invoice":
      return "success";
    default:
      return "grey";
  }
};

const getStepperValue = (status: string) => {
  if (status === "Draft") return 33;
  if (status === "Penawaran") return 66;
  if (status === "Invoice") return 100;
  return 0;
};

// Helpers
const checkStatus = (selesai: string) => {
  if (!selesai || selesai === "-")
    return { text: "N/A", color: "grey", daysLabel: "-" };
  const diff = new Date(selesai).getTime() - new Date().getTime();
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (diffDays < 0)
    return {
      text: "Expired",
      color: "error",
      daysLabel: `Lewat ${Math.abs(diffDays)} H`,
    };
  if (diffDays <= 30)
    return {
      text: "Urgent",
      color: "warning",
      daysLabel: `Sisa ${diffDays} H`,
    };
  return { text: "Aktif", color: "success", daysLabel: `Sisa ${diffDays} H` };
};

const hitungPersentaseWaktu = (mulai: string, selesai: string) => {
  const start = new Date(mulai).getTime();
  const end = new Date(selesai).getTime();
  const now = Date.now();

  if (now >= end) return 100;
  if (now <= start) return 0;

  return ((now - start) / (end - start)) * 100;
};

const hitungTotalHari = (mulai: string, selesai: string) => {
  if (!mulai || !selesai) return 0;
  return Math.ceil(
    Math.abs(new Date(selesai).getTime() - new Date(mulai).getTime()) /
      (1000 * 60 * 60 * 24),
  );
};

/* ================= ACTION ================= */
const openDetailItem = (item: any) => {
  modalDetail.data = item;
  modalDetail.show = true;
};
const bukaFile = (url?: string) => {
  if (url) window.open(url, "_blank");
};

const cekrekapanitemkategori = () => {
  const id = route.params.id_cabang;
  // Jika datanya kosong semua
  if (!data.tanggal_awal && !data.tanggal_akhir && !data.status) {
    notificationStore.showError("Pencarian kosong");
    return;
  }
  // Jika tanggal_awal ada tapi tanggal_akhir kosong
  if (data.tanggal_awal && !data.tanggal_akhir) {
    notificationStore.showError(
      "Tanggal Akhir tidak boleh kosong jika Tanggal Awal diisi",
    );
    return;
  }
  // Jika tanggal_akhir ada tapi tanggal_awal kosong
  if (data.tanggal_akhir && !data.tanggal_awal) {
    notificationStore.showError(
      "Tanggal Awal tidak boleh kosong jika Tanggal Akhir diisi",
    );
    return;
  }
  cabangStore.queryrekapancabangitemkategori(
    _.toString(id),
    data.tanggal_awal,
    data.tanggal_akhir,
    data.status,
  );
};
</script>

<style scoped>
.border-left-blue {
  border-left: 8px solid #1867c0 !important;
}

.border-right {
  border-right: 1px solid #e0e0e0;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

.custom-table :deep(thead th) {
  font-weight: 900 !important;
  color: #333 !important;
  background-color: #f8fafc !important;
  text-transform: uppercase;
  font-size: 11px;
}

.v-tab--selected {
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>
