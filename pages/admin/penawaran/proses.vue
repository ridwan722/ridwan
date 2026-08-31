<template>
  <v-row align="center">
    <v-col cols="10">
      <v-breadcrumbs>
        <v-breadcrumbs-item active>
          <span class="font-weight-medium text-h5"> Proses </span>
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
                :items="perusahaanStore.getDataPerusahaan"
                item-title="nama_perusahaan"
                item-value="nama_perusahaan"
              />
            </v-col>

            <v-col cols="12" sm="2">
              <a-select
                v-model="data.nama_cabang"
                label="Cabang Perusahaan"
                :items="perusahaanStore.getDataCabang"
                item-title="nama_cabang"
                item-value="nama_cabang"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" sm="2">
              <v-btn
                size="small"
                color="primary"
                class="mb-2"
                @click="cekrekapan"
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
        </v-col>

        <v-col cols="12" sm="2" class="text-caption text-grey-darken-1">
          Total:
          {{ penawaranStore.getDataPenawaran.length }} Proses
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      :headers="data.headPenawaran"
      :search="data.search"
      :items="dataPenawaranTampil"
      :sort-by="[{ key: 'createdAt', order: 'desc' }]"
      v-model:page="data.page"
      :items-per-page="data.itemsPerPage"
      density="compact"
      :hover="true"
    >
      <template v-slot:item.no="{ index }">
        <span class="text-caption font-weight-bold text-grey-darken-1">
          {{ (data.page - 1) * data.itemsPerPage + index + 1 }}
        </span>
      </template>

      <!-- <template v-slot:item.no_penawaran="{ item }">
        <v-btn
          variant="flat"
          color="grey-lighten-4"
          size="small"
          class="text-none font-weight-bold text-monospace px-2"
          rounded="lg"
          @click="copyToClipboard(item.no_penawaran)"
        >
          <span class="text-blue-grey-darken-4">{{ item.no_penawaran }}</span>
          <v-icon end size="14" color="grey-darken-1" class="ms-2"
            >mdi-content-copy</v-icon
          >
          <v-tooltip activator="parent" location="top"> Copy </v-tooltip>
        </v-btn>
      </template> -->

      <template v-slot:item.status="{ item }">
        <v-chip
          :color="
            {
              Draft: 'blue-darken-1',
              Terkirim: 'grey-darken-2',
              SPK: 'deep-purple-darken-1',
              Proses: 'warning',
              Pemberkasan: 'success',
              Disetujui: 'primary',
              Ditolak: 'error',
              Dibatalkan: 'error',
            }[item.status] || 'black'
          "
          size="small"
          rounded="lg"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.nama_cabang_perusahaan="{ item }">
        <v-chip
          size="small"
          variant="tonal"
          color="success"
          rounded="lg"
          class="font-weight-bold cursor-pointer"
          style="border-bottom: 2px solid #2e7d32"
          :to="'/admin/penawaran/' + item.id"
        >
          <v-icon start size="14" icon="mdi-eye" />
          {{ item.nama_cabang_perusahaan }}
          <v-tooltip activator="parent" location="top">Detail</v-tooltip>
        </v-chip>
      </template>

      <template v-slot:item.nama_perusahaan="{ item }">
        <v-chip
          size="small"
          variant="flat"
          color="blue-grey-lighten-5"
          class="text-blue-grey-darken-3 font-weight-bold border"
        >
          <v-avatar start color="blue-grey-darken-1" size="18">
            <span class="text-white" style="font-size: 8px">
              {{ item.nama_perusahaan.substring(0, 1) }}
            </span>
          </v-avatar>
          {{ item.nama_perusahaan.toUpperCase() }}
        </v-chip>
      </template>

      <template v-slot:item.total="{ item }">
        <span class="font-weight-medium">{{
          rupiah(item.total)
        }}</span>
      </template>

       <template v-slot:item.prosesAt="{ item }">
  <span >
    <strong>{{ selisihHari(item.prosesAt) }}</strong> hari
  </span>
</template>

      <!-- <template v-slot:item.deadline="{ item }">
        <div class="py-2" style="min-width: 120px">
          <div class="d-flex justify-space-between align-end mb-1">
            <div class="d-flex align-center">
              <v-icon
                :color="getDeadlineColor(item.tanggal)"
                size="14"
                class="me-1"
              >
                {{
                  countdownday(item.tanggal) <= 5
                    ? "mdi-alert-circle"
                    : "mdi-clock-outline"
                }}
              </v-icon>
              <span
                class="text-caption font-weight-black"
                :class="`text-${getDeadlineColor(item.tanggal)}`"
              >
                {{ countdownday(item.tanggal) }} Hari
              </span>
            </div>
            <span class="text-xxs text-grey-darken-1 font-weight-bold">
              {{ Math.round(calculateProgress(item.tanggal)) }}%
            </span>
          </div>

          <v-progress-linear
            :model-value="calculateProgress(item.tanggal)"
            :color="getDeadlineColor(item.tanggal)"
            height="10"
            rounded
            striped
            indeterminate-extension
            class="rounded-pill shadow-sm"
          >
            <template v-slot:default="{ value }"> </template>
          </v-progress-linear>
        </div>
      </template> -->

      <template v-slot:no-data>
        <div class="py-8 text-center text-grey-darken-1">
          <v-icon
            size="48"
            color="grey-lighten-1"
            class="mb-2"
            icon="mdi-file-check-outline"
          />
          <div class="text-body-1">Tidak ada data Penawaran</div>
        </div>
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
                        penawaranStore.getDataPenawaran.length,
                      )
                    }}
                  </strong>
                  <span class="text-grey mx-1">/</span>
                   <strong>{{ totalProses }}</strong>
                  <span class="text-grey mx-1">Data</span>
                </span>
              </div>

              <!-- <v-divider vertical class="mx-3 d-none d-sm-flex" />

              <div
                class="d-flex align-center flex-wrap mt-1 mt-sm-0"
                style="gap: 12px"
              >
                <div class="d-flex align-center">
                  <v-badge dot color="teal-accent-4" inline class="me-1" />
                  <span class="text-xxs text-grey-darken-1">Aman (>20 hr)</span>
                </div>
                <div class="d-flex align-center">
                  <v-badge dot color="amber-darken-2" inline class="me-1" />
                  <span class="text-xxs text-grey-darken-1"
                    >Mendekati (>5 hr)</span
                  >
                </div>
                <div class="d-flex align-center">
                  <v-badge dot color="red-accent-3" inline class="me-1" />
                  <span class="text-xxs text-grey-darken-1"
                    >Kritis (<5 hr)</span
                  >
                </div>
              </div> -->
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
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { useMasterPerusahaanStore } from "~/stores/master/perusahaanStore";

definePageMeta({
  layout: "admin",
});

const penawaranStore = usePenawaranStore();
const notificationStore = useNotificationStore();

const { dataPenawaranTampil } = storeToRefs(penawaranStore);
onMounted(async () => {
  await penawaranStore.tarikdatapenawaranbystatus("Proses");
  await perusahaanStore.tarikDataCabangAct();
  await perusahaanStore.tarikDataPerusahaanAct();
});

const data = reactive({
  search: "",
  tanggal_awal: "",
  tanggal_akhir: "",
  nama_perusahaan: "",
  nama_cabang: "",
  status: "",
  itemsPerPage: 10,
  page: 1,

  headPenawaran: [
    { title: "No", value: "no", width: "50px" },
    { title: "Tanggal Penawaran", value: "tanggal", sortable: true },
    { title: "No. Penawaran", value: "no_penawaran", sortable: true },
    { title: "Perusahaan", value: "nama_perusahaan", sortable: true },
    { title: "Cabang", value: "nama_cabang_perusahaan", sortable: true },
    { title: "Perihal", value: "perihal", sortable: true },
    {
      title: "Sudah di proses",
      value: "prosesAt",
      sortable: true,
    },
    { title: "Nominal", value: "total", sortable: true },
    {
      title: "Status",
      value: "status",
      sortable: true,
      align: "center" as const,
    },
  ],
});

const totalProses = computed(() => {
  return penawaranStore.getDataPenawaran.filter(
    (item: any) => item.status === 'Proses'
  ).length;
});

const selisihHari = (timestamp) => {
  if (!timestamp) return "-"

  const prosesDate = new Date(timestamp * 1000) // unix ke ms
  const now = new Date()

  const diffTime = now - prosesDate
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

// Fungsi untuk menghitung sisa hari (Pastikan Moment.js sudah terinstall)
const countdownday = (tanggal: string) => {
  if (!tanggal) return 0;
  const target = moment(tanggal);
  const sekarang = moment();
  const selisih = target.diff(sekarang, "days");
  return selisih > 0 ? selisih : 0;
};

// Fungsi menghitung progress (Asumsi 30 hari adalah jangka waktu maksimal penawaran)
const calculateProgress = (tanggal: string) => {
  const sisa = countdownday(tanggal);
  const max = 30; // Batas durasi dalam hari
  const progress = (sisa / max) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

// Warna yang lebih "Vibrant" untuk UI modern
const getDeadlineColor = (tanggal: string) => {
  const hari = countdownday(tanggal);
  if (hari > 20) return "teal-accent-4"; // Masih sangat aman
  if (hari > 10) return "light-blue-darken-1"; // Aman
  if (hari > 5) return "amber-darken-2"; // Perlu diperhatikan
  return "red-accent-3"; // Segera/Kritis
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // Menggunakan notificationStore (asumsi menggunakan method success/show)
    notificationStore.showSuccess(`Nomor Penomoran ${text} berhasil disalin`);
  } catch (err) {
    notificationStore.showError("Gagal menyalin nomor Penomoran");
    console.error("Gagal menyalin: ", err);
  }
};

const showFilter = ref(false);

const perusahaanStore = useMasterPerusahaanStore();

const cekrekapan = () => {
  const { tanggal_awal, tanggal_akhir, nama_perusahaan, nama_cabang, status } =
    data;

  // 1. Semua filter kosong
  if (!tanggal_awal && !tanggal_akhir && !nama_perusahaan && !nama_cabang) {
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
  penawaranStore.queryrekapanpenawaran(
    tanggal_awal,
    tanggal_akhir,
    nama_perusahaan,
    nama_cabang,
    "Disetujui",
  );
};

watch(
  () => data.nama_perusahaan,

  async (idperusahaan) => {
    const dataperusahaan = perusahaanStore.getDataPerusahaan;

    const b = _.find(
      dataperusahaan,
      (o: any) => o.nama_perusahaan == idperusahaan,
    );
    // console.logb, 'si b')
    if (!_.isUndefined(b)) {
      await perusahaanStore.tarikDataCabangPerusahaan(b.id!);
    }
  },
);

watch(
  () => data.nama_cabang,

  async (idcabang) => {
    const datacabang = perusahaanStore.getDataCabang;

    const b = _.find(datacabang, (o: any) => o.nama_cabang == idcabang);
    // console.logb, 'si b')
    if (!_.isUndefined(b)) {
    }
  },
);
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

.custom-table :deep(thead) {
  background-color: #f8fafc !important;
}
.custom-table :deep(th) {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.75rem !important;
  letter-spacing: 0.05em;
  color: #64748b !important;
}
</style>
