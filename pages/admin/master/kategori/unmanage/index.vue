<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <!-- Main Content -->
  <v-row align="center">
    <v-col>
      <v-breadcrumbs>
        <v-breadcrumbs-item>
          <span class="font-weight-medium text-h5"> Un Manage Item </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>
  </v-row>

  <v-card>
    <v-card-text>
      <!-- Header -->
      <v-row align="center" justify="space-between" class="mb-2">
        <v-col cols="auto">
          <h3 class="text-body-1 font-weight-medium text-grey-darken-1">
            Filter Pencarian
          </h3>
        </v-col>

        <v-col cols="auto">
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                size="small"
                color="primary"
                variant="flat"
                rounded="xl"
                class="d-flex align-center"
                @click="showFilter = !showFilter"
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

      <!-- Filter -->
      <v-expand-transition>
        <div v-show="showFilter">
          <v-row class="mt-3" align="end">
            <v-col cols="12" sm="3">
              <a-date-picker
                v-model="data.tanggal_awal"
                label="Tanggal Awal"
                :onUpdate:modelValue="(n: string) => (data.tanggal_awal = n)"
              />
            </v-col>

            <v-col cols="12" sm="3">
              <a-date-picker
                v-model="data.tanggal_akhir"
                label="Tanggal Akhir"
                :onUpdate:modelValue="(n: string) => (data.tanggal_akhir = n)"
              />
            </v-col>

            <v-col cols="12" sm="2">
              <a-select
                v-model="data.nama_perusahaan"
                label="Nama Perusahaan"
                :items="masterPerusahaanStore.getDataPerusahaan"
                item-title="nama_perusahaan"
                item-value="nama_perusahaan"
              />
            </v-col>

            <v-col cols="12" sm="2">
              <a-select
                v-model="data.nama_cabang"
                label="Cabang Perusahaan"
                :items="masterPerusahaanStore.getDataCabang"
                item-title="nama_cabang"
                item-value="nama_cabang"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" sm="2">
              <a-select
                v-model="data.status"
                label="Status"
                variant="solo"
                :items="['Draft', 'Penawaran', 'Invoice']"
              />
            </v-col>

            <v-col cols="12" sm="12" class="d-flex justify-end">
              <v-btn
                size="small"
                color="primary"
                class="mt-4"
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
  <v-card flat rounded="lg" class="border">
    <v-card-title class="pa-3">
      <v-row align="center">
        <v-col cols="12" sm="10">
          <a-text-field
            v-model="data.search"
            placeholder="Search"
            style="max-width: 280px"
          />

          <v-btn
            size="35"
            variant="outlined"
            class="border ml-3"
            @click="refreshData"
          >
            <v-icon size="23" icon="mdi-refresh" />
            <v-tooltip activator="parent" location="top">
              Refresh Data
            </v-tooltip>
          </v-btn>
        </v-col>

        <v-col cols="12" sm="2" class="text-caption text-grey-darken-1">
          Total:
          {{ unmanageStore.getDataunmanage.length }} kategori item
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      :headers="data.headKategoriItem"
      :items="kategoriWithDeadline"
      :search="data.search"
      v-model:page="data.page"
      :items-per-page="data.itemsPerPage"
      density="comfortable"
      :sort-by="[{ key: 'createdAt', order: 'desc' }]"
      hover
    >
      <template v-slot:item.no="{ index }">
        <span class="text-caption font-weight-bold text-grey-darken-1">
          {{ (data.page - 1) * data.itemsPerPage + index + 1 }}
        </span>
      </template>

      <template v-slot:item.nama_kategori_item="{ item }">
        <div style="width: 250px">
          <span> {{ item.nama_kategori_item }}</span>
        </div>
      </template>

      <template v-slot:item.kode_kategori_item="{ item }">
        <v-chip
          size="x-small"
          color="grey-darken-1"
          variant="tonal"
          class="font-weight-medium rounded-sm px-2"
          style="font-family: monospace"
        >
          {{ item.kode_kategori_item }}
        </v-chip>
      </template>

      <template v-slot:item.nama_cabang="{ item }">
        <v-chip
          size="small"
          variant="tonal"
          color="success"
          rounded="lg"
          class="font-weight-bold cursor-pointer"
          style="border-bottom: 2px solid #2e7d32"
          :to="'/admin/master/kategori/unmanage/' + item.id"
        >
          <v-icon start size="14" icon="mdi-eye" />
          {{ item.nama_cabang }}
          <v-tooltip activator="parent" location="top">Detail</v-tooltip>
        </v-chip>
      </template>

      <template v-slot:bottom>
        <v-divider />

        <div class="bg-grey-lighten-5 px-4 py-2">
          <v-row no-gutters align="center">
            <v-col
              cols="12"
              md="8"
              class="d-flex align-center flex-wrap"
              style="gap: 8px"
            >
              <div
                class="d-flex align-center bg-white border rounded-lg px-3 py-1 shadow-sm mr-2"
              >
                <v-icon
                  size="16"
                  color="primary"
                  icon="mdi-database-outline"
                  class="mr-2"
                />
                <span class="text-caption font-weight-medium">
                  <span class="text-grey">Menampilkan</span>
                  <strong class="text-primary ml-1">
                    {{ (data.page - 1) * data.itemsPerPage + 1 }}-{{
                      Math.min(
                        data.page * data.itemsPerPage,
                        kategoriWithDeadline.length,
                      )
                    }}
                  </strong>
                  <span class="text-grey mx-1">/</span>
                  <strong>{{ kategoriWithDeadline.length }}</strong>
                  <span class="text-grey mx-1">Data</span>
                </span>
              </div>

              <v-divider
                vertical
                inset
                class="mr-1 d-none d-sm-flex"
                style="height: 20px"
              />

              <div
                class="d-flex align-center bg-white border rounded-lg px-1 py-1"
                style="gap: 4px"
              >
                <v-chip
                  size="x-small"
                  variant="text"
                  class="px-2"
                  color="grey-darken-2"
                >
                  <v-icon
                    start
                    icon="mdi-file-document-edit-outline"
                    size="14"
                  />
                  <span class="font-weight-black">{{
                    statusCounts.onProgress
                  }}</span>
                  <span class="ml-1 text-grey-darken-1 d-none d-sm-inline"
                    >Draft</span
                  >
                </v-chip>

                <v-divider vertical class="my-1" />

                <v-chip
                  size="x-small"
                  variant="text"
                  class="px-2"
                  color="blue-darken-2"
                >
                  <v-icon start icon="mdi-send-circle-outline" size="14" />
                  <span class="font-weight-black">{{
                    statusCounts.penawaran
                  }}</span>
                  <span class="ml-1 text-blue-darken-1 d-none d-sm-inline"
                    >Penawaran</span
                  >
                </v-chip>

                <v-divider vertical class="my-1" />

                <v-chip
                  size="x-small"
                  variant="text"
                  class="px-2"
                  color="orange-darken-3"
                >
                  <v-icon
                    start
                    icon="mdi-receipt-text-check-outline"
                    size="14"
                  />
                  <span class="font-weight-black">{{
                    statusCounts.invoice
                  }}</span>
                  <span class="ml-1 text-orange-darken-2 d-none d-sm-inline"
                    >Invoice</span
                  >
                </v-chip>
              </div>

              <v-chip
                v-if="statusCounts.approachingDeadline > 0"
                size="x-small"
                color="red-darken-1"
                variant="flat"
                class="font-weight-bold"
              >
                <v-icon start icon="mdi-alert-circle-check" size="14" />
                {{ statusCounts.approachingDeadline }} Deadline
              </v-chip>
            </v-col>

            <v-col
              cols="12"
              md="4"
              class="d-flex justify-md-end justify-center mt-2 mt-md-0"
            >
              <div
                class="d-flex align-center bg-white border rounded-lg px-3 py-0"
                style="min-width: 140px; height: 32px"
              >
                <v-icon
                  size="14"
                  color="grey"
                  icon="mdi-layers-outline"
                  class="mr-2"
                />
                <span
                  class="text-caption text-grey-darken-1 mr-2"
                  style="white-space: nowrap"
                  >Tampilkan:</span
                >

                <v-select
                  v-model="data.itemsPerPage"
                  :items="[
                    { title: '10', value: 10 },
                    { title: '25', value: 25 },
                    { title: '50', value: 50 },
                    { title: 'Semua', value: -1 },
                  ]"
                  variant="plain"
                  density="compact"
                  hide-details
                  class="mt-n2"
                  @update:model-value="data.page = 1"
                >
                  <template v-slot:selection="{ item }">
                    <span class="text-caption font-weight-black text-primary">{{
                      item.title
                    }}</span>
                  </template>
                </v-select>
              </div>
            </v-col>
          </v-row>
        </div>
      </template>

      <template v-slot:item.jumlah_unit="{ item }">
        <div v-if="item.jumlahUnit" class="d-flex align-center">
          <v-avatar size="24" color="primary-lighten-5" class="mr-2">
            <span class="text-caption font-weight-bold text-primary">{{
              item.jumlahUnit
            }}</span>
          </v-avatar>
          <span class="text-body-2 text-grey-darken-2">Unit</span>
        </div>

        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Kosong
        </span>
      </template>

      <template v-slot:item.ukuran="{ item }">
        <div
          v-if="item.ukuran && item.ukuran.length > 0"
          class="d-flex flex-wrap"
          style="gap: 4px"
        >
          <v-chip
            v-for="(u, i) in item.ukuran"
            :key="i"
            size="x-small"
            variant="outlined"
            color="secondary"
          >
            {{ u }}
          </v-chip>
        </div>
        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Kosong
        </span>
      </template>

      <template v-slot:item.periode="{ item }">
        <div
          v-if="item.periode && item.periode.mulai !== '-'"
          class="d-flex align-center pa-2"
        >
          <v-sheet
            rounded="s-lg"
            class="px-2 py-1 bg-grey-lighten-4 text-caption font-weight-bold border"
          >
            {{ item.periode.mulai }}
          </v-sheet>

          <v-sheet
            border="top bottom"
            class="px-1 bg-primary text-caption"
            style="height: 26px; line-height: 24px"
          >
            <v-icon size="12" color="white">mdi-arrow-right</v-icon>
          </v-sheet>

          <v-sheet
            border
            rounded="e-lg"
            class="px-2 py-1 bg-grey-lighten-4 text-caption font-weight-bold"
          >
            {{ item.periode.selesai }}
          </v-sheet>
        </div>
        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Tidak ada data
        </span>
      </template>

      <template v-slot:item.nominal="{ item }">
        <div v-if="item.nominal" class="font-weight-bold text-success">
          Rp {{ item.nominal.toLocaleString("id-ID") }}
        </div>
        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Tidak ada data
        </span>
      </template>

      <template v-slot:item.keterangan="{ item }">
        <p v-if="item.keterangan" class="font-italic text-caption">
          {{ item.keterangan }}
        </p>

        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Tidak ada data
        </span>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip
          :color="
            item.status == 'Draft'
              ? 'grey'
              : item.status == 'Penawaran'
                ? 'blue'
                : 'orange'
          "
          label
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.aksi="{ item }">
        <div class="d-flex justify-center">
          <v-btn
            size="27"
            variant="tonal"
            color="info"
            class="rounded-lg mr-1"
            @click="backtoitemkategori(item)"
          >
            <v-icon icon="mdi-arrow-right" />
            <v-tooltip activator="parent" location="top"
              >Batalkan Unmanage</v-tooltip
            >
          </v-btn>
        </div>
      </template>

      <template v-slot:no-data>
        <div class="py-8 text-center text-grey-darken-1">
          <v-icon
            size="48"
            color="grey-lighten-1"
            class="mb-2"
            icon="mdi-shape-plus-outline"
          />

          <div class="text-body-1">Tidak ada data Kategori Item</div>
        </div>
      </template>

      <template v-slot:item.deadlineSort="{ item }">
        <div v-if="item.periode?.selesai && item.periode.selesai !== '-'">
          <!-- Progress Bar Container -->
          <div class="deadline-container">
            <!-- Progress Bar -->
            <div class="progress-wrapper">
              <v-progress-linear
                :model-value="calculateProgress(item.periode.selesai)"
                :color="
                  getProgressColor(calculateProgress(item.periode.selesai))
                "
                height="8"
                rounded
                class="progress-bar"
              />
            </div>

            <!-- Deadline Info -->
            <div class="deadline-info">
              <v-chip
                size="small"
                :color="getDeadlineColor(item.periode.selesai)"
                variant="flat"
                class="mr-2"
              >
                <v-icon start size="12"> mdi-calendar-clock </v-icon>
                {{ countdownday(item.periode.selesai) }}
              </v-chip>

              <!-- Deadline Date -->
              <span class="text-caption text-grey-darken-2">
                {{ formatDeadlineDate(item.periode.selesai) }}
              </span>
            </div>

            <!-- Progress Percentage -->
            <div class="progress-percentage">
              <span
                class="text-caption font-weight-bold"
                :class="
                  getProgressTextColor(calculateProgress(item.periode.selesai))
                "
              >
                {{ calculateProgress(item.periode.selesai) }}%
              </span>
            </div>
          </div>
        </div>
        <div v-else>
          <v-chip size="small" color="grey" variant="tonal">
            <v-icon start size="12">mdi-calendar-remove</v-icon>
            Tidak ada
          </v-chip>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import type { ConfirmationDialog } from "#components";
import _ from "lodash";
import moment from "moment";
import { useMasterPerusahaanStore } from "~/stores/master/perusahaanStore";
import type { itemKategoriM } from "~/types/master/kategoriModel";
import type { unmanageM } from "~/types/unmanageModel";

definePageMeta({
  layout: "admin",
});

const masterPerusahaanStore = useMasterPerusahaanStore();
const unmanageStore = useunmanageStore();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);
const uploadstore = uploadStore();

onMounted(async () => {
  await unmanageStore.tarikDataunmanageAct();
  await masterPerusahaanStore.tarikDataCabangAct();
  await masterPerusahaanStore.tarikDataPerusahaanAct();
});
const showFilter = ref(false);

const data = reactive({
  search: "",
  dialogunmanage: false,
  alasan_unmanage: "",
  dialogAdd: false,
  dialogEdit: false,
  page: 1,
  itemsPerPage: 10,
  ukuranInput: "",
  listKategoriItem: ["Reklame", "Disnaker", "Izin", "Biaya", "Jasa", "Lainnya"],
  tanggal_awal: "",
  tanggal_akhir: "",
  nama_perusahaan: "",
  nama_cabang: "",
  status: "",
  headKategoriItem: [
    {
      title: "No",
      value: "no",
      align: "center" as const,
      width: "50px",
    },
    // { title: "Kode", value: "kode_kategori_item", sortable: true },
    { title: "Nama", value: "nama_kategori_item", sortable: true },
    { title: "Nama Perusahaan", value: "nama_perusahaan", sortable: true },
    { title: "Nama Cabang", value: "nama_cabang", sortable: true },
    { title: "Alasan", value: "alasan_unmanage", sortable: true },
    { title: "Ukuran", value: "ukuran", sortable: true },
    { title: "Periode", value: "periode", sortable: true },
    { title: "Deadline", value: "deadlineSort", sortable: true },
    { title: "Status", value: "status", sortable: true },
    {
      title: "Aksi",
      value: "aksi",
      align: "center" as const,
      width: "50px",
      sortable: false,
    },
  ],

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
});

const newKategoriItem = ref<unmanageM>({
  id_object_kategori: "",
  kode_kategori_item: "",
  nama_kategori_item: "",
  jumlahUnit: 0,
  createdAt: 0,
  createdBy: "",
  dokumen: [],
  ukuran: [],
  periode: {
    mulai: "-",
    selesai: "-",
  },
  keterangan: "",
  id_cabang: "",
  nama_cabang: "",
  id_perusahaan: "",
  nama_perusahaan: "",
  nama_kategori_object: "",
  status: "Draft",
  nama_group_pt: "",
});

const kategoriWithDeadline = computed(() => {
  return [...unmanageStore.getDataunmanage]
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

watch(
  () => data.nama_perusahaan,

  async (idperusahaan) => {
    const dataperusahaan = masterPerusahaanStore.getDataPerusahaan;

    const b = _.find(
      dataperusahaan,
      (o: any) => o.nama_perusahaan == idperusahaan,
    );
    // console.logb, 'si b')
    if (!_.isUndefined(b)) {
      await masterPerusahaanStore.tarikDataCabangPerusahaan(b.id!);
    }
  },
);

watch(
  () => data.nama_cabang,

  async (idcabang) => {
    const datacabang = masterPerusahaanStore.getDataCabang;

    const b = _.find(datacabang, (o: any) => o.nama_cabang == idcabang);
    // console.logb, 'si b')
    if (!_.isUndefined(b)) {
    }
  },
);

const openDialogEdit = async (item: itemKategoriM) => {
  data.dialogEdit = true;
};

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("unmanage_item_kategori");
  await unmanageStore.tarikDataunmanageAct();
  useloadingStore().setLoading(false);
  notificationStore.showSuccess("Data berhasil diperbarui");
}

const cekrekapanitemkategori = () => {
  const { tanggal_awal, tanggal_akhir, nama_perusahaan, nama_cabang, status } =
    data;

  // 1. Semua filter kosong
  if (
    !tanggal_awal &&
    !tanggal_akhir &&
    !nama_perusahaan &&
    !nama_cabang &&
    !status
  ) {
    notificationStore.showError("Minimal isi salah satu filter pencarian");
    return;
  }

  // 2. Validasi tanggal harus berpasangan
  if ((tanggal_awal && !tanggal_akhir) || (!tanggal_awal && tanggal_akhir)) {
    notificationStore.showError(
      "Tanggal Awal dan Tanggal Akhir harus diisi bersamaan",
    );
    return;
  }
  console.log(nama_perusahaan, "nama_perusahaan");
  console.log(nama_cabang, "nama_cabang");
  // 3. Eksekusi query
  unmanageStore.queryrekapanunmanageitemkategori(
    tanggal_awal,
    tanggal_akhir,
    nama_perusahaan,
    nama_cabang,
    status,
  );
};

// Fungsi untuk menghitung progress deadline
const calculateProgress = (deadlineDate: string) => {
  if (!deadlineDate || deadlineDate === "-") return 0;

  const now = new Date();
  const deadline = new Date(deadlineDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Jika deadline sudah lewat
  if (deadline < today) return 100;

  // Hitung total hari dari sekarang sampai deadline
  const totalDays = Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Asumsi waktu pengerjaan standar 30 hari
  const standardDays = 30;

  // Jika kurang dari standardDays, hitung progress
  if (totalDays > standardDays) {
    return 0; // Masih awal
  }

  const progress = ((standardDays - totalDays) / standardDays) * 100;
  const roundedProgress = Math.round(progress); // Membulatkan ke bilangan bulat terdekat

  return Math.min(Math.max(roundedProgress, 0), 100);
};

// Fungsi untuk menentukan warna progress bar
const getProgressColor = (progress: number) => {
  if (progress >= 80) return "red";
  if (progress >= 60) return "orange";
  if (progress >= 30) return "blue";
  return "green";
};

// Fungsi untuk menentukan warna teks progress
const getProgressTextColor = (progress: number) => {
  if (progress >= 80) return "text-red-darken-2";
  if (progress >= 60) return "text-orange-darken-2";
  if (progress >= 30) return "text-blue-darken-2";
  return "text-green-darken-2";
};

// Fungsi untuk format tanggal deadline
const formatDeadlineDate = (dateString: string) => {
  if (!dateString || dateString === "-") return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Update fungsi countdownday jika belum ada
const countdownday = (deadlineDate: string) => {
  if (!deadlineDate || deadlineDate === "-") return "-";

  const now = new Date();
  const deadline = new Date(deadlineDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Set waktu ke 00:00:00 untuk perbandingan yang akurat
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hari ini";
  if (diffDays < 0) return `${Math.abs(diffDays)} hari lewat`;
  return `${diffDays} hari lagi`;
};

// Fungsi getDeadlineColor tetap sama
const getDeadlineColor = (deadlineDate: string) => {
  if (!deadlineDate || deadlineDate === "-") return "grey";

  const now = new Date();
  const deadline = new Date(deadlineDate);
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "red"; // Sudah lewat
  if (diffDays === 0) return "orange"; // Hari ini
  if (diffDays <= 3) return "orange"; // 3 hari lagi
  if (diffDays <= 7) return "yellow"; // 7 hari lagi
  return "green"; // Masih lama
};

// Atau alternatif yang lebih ringkas:
const statusCounts = computed(() => {
  const counts = {
    onProgress: 0,
    penawaran: 0,
    invoice: 0,
    approachingDeadline: 0,
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  unmanageStore.getDataunmanage.forEach((item) => {
    // Hitung berdasarkan status
    if (item.status === "Draft") counts.onProgress++;
    if (item.status === "Penawaran") counts.penawaran++;
    if (item.status === "Invoice") counts.invoice++;

    // Hitung deadline mendekati
    if (item.periode?.selesai && item.periode.selesai !== "-") {
      const deadline = new Date(item.periode.selesai);
      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 3) {
        counts.approachingDeadline++;
      }
    }
  });

  return counts;
});

async function backtoitemkategori(item: unmanageM) {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Set Item Kategori",
    "Anda yakin ingin menyetujui set item kategori ini?",
  );
  if (!confirmed)
    return notificationStore.showError("set item kategori dibatalkan");
  newKategoriItem.value.dokumen = item.dokumen;
  newKategoriItem.value.createdAt = item.itemKategoriAt!;
  newKategoriItem.value.createdBy = item.itemKategoriBy!;
  newKategoriItem.value.id_kategori_item = item.id_kategori_item;
  newKategoriItem.value.id_object_kategori = item.id_object_kategori;
  newKategoriItem.value.id_cabang = item.id_cabang;
  newKategoriItem.value.id_perusahaan = item.id_perusahaan;
  newKategoriItem.value.jumlahUnit = item.jumlahUnit;
  newKategoriItem.value.keterangan = item.keterangan;
  newKategoriItem.value.kode_kategori_item = item.kode_kategori_item;
  newKategoriItem.value.nama_cabang = item.nama_cabang;
  newKategoriItem.value.nama_kategori_item = item.nama_kategori_item;
  newKategoriItem.value.nama_kategori_object = item.nama_kategori_object;
  newKategoriItem.value.nama_perusahaan = item.nama_perusahaan;
  newKategoriItem.value.nama_group_pt = item.nama_group_pt;
  newKategoriItem.value.periode = item.periode;
  newKategoriItem.value.status = item.status;
  newKategoriItem.value.ukuran = item.ukuran;
  console.log(item.id, "cek id newkategori");
  console.log(newKategoriItem.value, "save new kategori");
  await unmanageStore.backtoitemkategoriAct(newKategoriItem.value, item.id!);
  sessionStorage.removeItem("m_item_kategori");
}
</script>

<style scoped>
:deep() thead th {
  font-weight: bold !important;
  border: 1px solid #cbcbcb !important;
  background-color: #dddddd !important;
}

:deep() tbody td {
  border-right: 1px solid #e0e0e0 !important;
}

.deadline-container {
  width: 200px;
  max-width: 100%;
}

.progress-wrapper {
  position: relative;
  margin-bottom: 4px;
}

.progress-bar {
  width: 100%;
}

.deadline-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
}

.progress-percentage {
  text-align: right;
  margin-top: 2px;
}

/* Style untuk table cell */
:deep() .v-data-table__td {
  padding: 8px 16px;
}

:deep() .v-chip {
  font-size: 11px;
  height: 20px;
}

:deep() .v-progress-linear {
  border-radius: 4px;
}
</style>
