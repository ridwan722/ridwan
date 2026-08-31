<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <div class="page-container">
    <header
      class="page-header d-flex align-center justify-space-between flex-wrap gap-3 mb-6"
    >
      <div>
        <h1 class="text-h5 font-weight-bold text-grey-darken-3 mb-1">
          Reminder Pekerjaan
        </h1>
        <p class="text-caption text-grey-darken-1 mb-0">
          Catatan Pekerjaan 3 bulan kebelakang dan kedepan
        </p>
      </div>

      <v-btn
        variant="flat"
        color="grey-lighten-4"
        class="text-grey-darken-2 text-none border rounded-lg"
        @click="refreshData"
      >
        <v-icon size="18" icon="mdi-refresh" start />
        Refresh Data
        <v-tooltip activator="parent" location="bottom"
          >Muat ulang data dari server</v-tooltip
        >
      </v-btn>
    </header>

    <v-card flat rounded="xl" class="border filter-card mb-6">
      <v-card-text class="pa-5 pa-md-6">
        <div class="d-flex align-center gap-2 mb-4">
          <v-icon color="primary" size="20">mdi-filter-variant</v-icon>
          <span class="text-subtitle-1 font-weight-bold text-grey-darken-3"
            >Rekapitulasi & Filter</span
          >
        </div>

        <v-row class="g-3">
          <v-col cols="12" md="6" class="d-flex align-center ga-2">
            <a-select
              v-model="data.nama_perusahaan_perbulan"
              label="Nama Perusahaan"
              placeholder="Pilih Perusahaan..."
              variant="outlined"
              density="compact"
              hide-details
              prepend-inner-icon="mdi-office-building"
              :items="masterPerusahaanStore.getDataPerusahaan"
              item-title="nama_perusahaan"
              item-value="nama_perusahaan"
              class="flex-grow-1"
              @update:model-value="cekHabisMasaBerlaku"
            />

            <v-chip
              link
              color="grey"
              class="mt-5"
              variant="tonal"
              size="small"
              @click="
                data.nama_perusahaan_perbulan = null;
                cekHabisMasaBerlaku();
              "
            >
              <v-icon icon="mdi-close" size="small" />
            </v-chip>
          </v-col>

          <v-col cols="12" md="6" class="d-flex flex-column justify-end ga-2">
            <div class="toggle-container">
              <v-btn-toggle
                v-model="data.rangeFilter"
                mandatory
                selected-class="active-btn"
                rounded="lg"
                density="compact"
                class="range-toggle w-100"
                @update:model-value="
                  () => {
                    data.bulanSubFilter = 'all';
                    cekHabisMasaBerlaku();
                  }
                "
              >
                <v-btn
                  value="previous"
                  class="flex-grow-1 text-caption font-weight-medium"
                >
                  <v-icon start size="16">mdi-arrow-left</v-icon>
                  <span class="d-none d-sm-inline">3 Bln</span> Lalu
                </v-btn>

                <v-btn
                  value="both"
                  class="flex-grow-1 text-caption font-weight-medium"
                >
                  Semua
                </v-btn>

                <v-btn
                  value="next"
                  class="flex-grow-1 text-caption font-weight-medium"
                >
                  <span class="d-none d-sm-inline">3 Bln</span> Nanti
                  <v-icon end size="16">mdi-arrow-right</v-icon>
                </v-btn>
              </v-btn-toggle>
            </div>

            <div class="toggle-container">
              <v-btn-toggle
                v-model="data.bulanSubFilter"
                mandatory
                selected-class="active-sub-btn"
                rounded="lg"
                density="compact"
                class="range-toggle w-100 overflow-x-auto"
                @update:model-value="cekHabisMasaBerlaku"
              >
                <!-- <v-btn
                  value="all"
                  class="flex-grow-1 text-caption font-weight-medium"
                >
                  Semua Bulan
                </v-btn> -->

                <v-btn
                  v-for="opt in subBulanOptions"
                  :key="opt.value"
                  :value="opt.value"
                  class="flex-grow-1 text-caption font-weight-medium text-capitalize"
                >
                  {{ opt.label }}
                </v-btn>
              </v-btn-toggle>
            </div>
          </v-col>
        </v-row>

        <div
          class="d-flex justify-space-between align-center flex-wrap gap-3 mt-5 pt-4 border-t"
        >
          <span class="text-caption text-grey">
            <v-icon size="14" class="mr-1">mdi-information-outline</v-icon>
            Pilih filter untuk memperbarui rekapitulasi data.
          </span>

          <div class="d-flex align-center gap-2 flex-wrap w-xs-100">
            <v-btn
              color="success"
              variant="flat"
              size="small"
              rounded="lg"
              class="text-none flex-grow-1 flex-sm-grow-0"
              prepend-icon="mdi-file-excel-outline"
              :disabled="hasilRekapan.length === 0"
              @click="downloadExcel"
            >
              Unduh Excel
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-card flat rounded="xl" class="border custom-table-card">
      <div
        class="pa-4 pa-md-5 border-b d-flex align-center justify-space-between flex-wrap gap-3"
      >
        <a-text-field
          v-model="data.search"
          placeholder="Cari kategori..."
          variant="outlined"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-magnify"
          class="search-field"
        />

        <div
          class="d-flex align-center text-caption text-grey-darken-1 bg-grey-lighten-4 px-3 py-1-5 rounded-lg"
        >
          <v-icon size="16" class="mr-1-5 text-grey">mdi-layers-outline</v-icon>
          Total:
          <strong class="text-grey-darken-3 ml-1">{{
            masterKategoriItemStore.getDataItemKategori.length
          }}</strong
          >&nbsp;kategori
        </div>
      </div>

      <v-data-table
        :headers="data.headKategoriItem"
        :items="dataTable"
        :search="data.search"
        :items-per-page="-1"
        density="comfortable"
        class="clean-table"
      >
        <template v-slot:item.no="{ index }">
          <span class="text-caption font-weight-medium text-grey">
            {{ (data.page - 1) * data.itemsPerPage + index + 1 }}
          </span>
        </template>

        <template v-slot:item.nama_kategori_item="{ item }">
          <div class="py-1">
            <NuxtLink
    :to="`/admin/master/kategori/item/${item.id_cabang}-${item.kode_kategori_item}`"
    class="kategori-link"
  >
    {{ item.nama_kategori_item }}
  </NuxtLink>
          </div>
        </template>

        <template v-slot:item.periode="{ item }">
          <div v-if="item.periode && item.periode.mulai !== '-'" class="py-1">
            <v-chip
              v-if="filterAktifRange === 'previous'"
              color="warning"
              variant="tonal"
              size="x-small"
              class="font-weight-medium"
            >
              3 Bulan Sebelumnya
            </v-chip>

            <v-chip
              v-else-if="filterAktifRange === 'next'"
              color="info"
              variant="tonal"
              size="x-small"
              class="font-weight-medium"
            >
              3 Bulan Berikutnya
            </v-chip>

            <v-chip
              v-else
              :color="
                getRangeLabel(item.periode.selesai) === 'previous'
                  ? 'warning'
                  : 'info'
              "
              variant="tonal"
              size="x-small"
              class="font-weight-medium"
            >
              {{
                getRangeLabel(item.periode.selesai) === "previous"
                  ? "3 Bulan Sebelumnya"
                  : "3 Bulan Berikutnya"
              }}
            </v-chip>
          </div>

          <span v-else class="text-caption text-grey-lighten-1 font-italic">
            Tidak ada data
          </span>
        </template>

        <template v-slot:item.deadlineSort="{ item }">
          <div
            v-if="item.periode?.selesai && item.periode.selesai !== '-'"
            class="deadline-wrapper py-2"
          >
            <div class="d-flex align-center justify-space-between mb-1">
              <v-chip
                size="x-small"
                :color="getDeadlineColor(item.periode.selesai)"
                variant="flat"
                class="font-weight-bold"
              >
                <v-icon start size="10">mdi-clock-outline</v-icon>
                {{ countdownday(item.periode.selesai) }}
              </v-chip>

              <span
                class="text-caption font-weight-bold ml-2"
                :class="
                  getProgressTextColor(calculateProgress(item.periode.selesai))
                "
              >
                {{ calculateProgress(item.periode.selesai) }}%
              </span>
            </div>

            <v-progress-linear
              :model-value="calculateProgress(item.periode.selesai)"
              :color="getProgressColor(calculateProgress(item.periode.selesai))"
              height="6"
              rounded
              class="mb-1"
            />

            <span
              class="text-body-2 text-truncate d-block"
              style="font-size: 0.725rem !important"
            >
              {{ formatDeadlineDate(item.periode.selesai) }}
            </span>
          </div>

          <div v-else class="py-1">
            <span class="text-caption text-grey-lighten-1"> - </span>
          </div>
        </template>

        <template v-slot:item.tindakan="{ item }">
          <v-btn
            size="x-small"
            variant="tonal"
            color="primary"
            class="rounded-lg mr-1"
            append-icon="mdi-open-in-new"
          >
            Detail Pekerjaan
            <v-tooltip activator="parent" location="top"
              >Detail Pekerjaan</v-tooltip
            >
          </v-btn>
        </template>

        <template v-slot:no-data>
          <div class="py-10 text-center">
            <v-icon size="40" color="grey-lighten-1" class="mb-2">
              mdi-folder-open-outline
            </v-icon>
            <p class="text-body-2 text-grey-darken-1 mb-0">
              Tidak ada data Kategori Item
            </p>
          </div>
        </template>

        <template v-slot:bottom>
          <div class="bg-grey-lighten-5 border-t px-4 py-3">
            <div
              class="d-flex align-center justify-space-between flex-wrap gap-3"
            >
              <div class="d-flex align-center text-caption text-grey-darken-2">
                <v-icon size="16" color="primary" class="mr-1-5"
                  >mdi-database</v-icon
                >
                <span>
                  Menampilkan
                  <strong class="text-primary">
                    {{ (data.page - 1) * data.itemsPerPage + 1 }}-{{
                      Math.min(data.page * data.itemsPerPage, dataTable.length)
                    }}
                  </strong>
                  dari
                  <strong>{{ dataTable.length }}</strong> Data
                </span>
              </div>

              <div class="d-flex align-center flex-wrap gap-2">
                <div class="status-pill border bg-white">
                  <v-icon size="12" color="grey-darken-1" class="mr-1"
                    >mdi-file-document-outline</v-icon
                  >
                  <span
                    class="text-caption font-weight-bold text-grey-darken-2"
                    >{{ statusCounts.onProgress }}</span
                  >
                  <span class="text-caption text-grey ml-1 d-none d-sm-inline"
                    >Draft</span
                  >
                </div>

                <div class="status-pill border bg-white">
                  <v-icon size="12" color="blue" class="mr-1"
                    >mdi-send-outline</v-icon
                  >
                  <span
                    class="text-caption font-weight-bold text-blue-darken-2"
                    >{{ statusCounts.penawaran }}</span
                  >
                  <span class="text-caption text-grey ml-1 d-none d-sm-inline"
                    >Penawaran</span
                  >
                </div>

                <div class="status-pill border bg-white">
                  <v-icon size="12" color="orange-darken-2" class="mr-1"
                    >mdi-receipt-outline</v-icon
                  >
                  <span
                    class="text-caption font-weight-bold text-orange-darken-3"
                    >{{ statusCounts.invoice }}</span
                  >
                  <span class="text-caption text-grey ml-1 d-none d-sm-inline"
                    >Invoice</span
                  >
                </div>

                <v-chip
                  v-if="statusCounts.overdue > 0"
                  size="x-small"
                  color="red"
                  variant="flat"
                  class="font-weight-bold"
                >
                  <v-icon start icon="mdi-alert-circle" size="12" />
                  {{ statusCounts.overdue }} Overdue
                </v-chip>
              </div>
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { ConfirmationDialog } from "#components";
import _ from "lodash";
import moment from "moment";
import "moment/locale/id";
import { useMasterKategoriStore } from "~/stores/master/kategoriStore";
import { useMasterPerusahaanStore } from "~/stores/master/perusahaanStore";
import * as XLSX from "xlsx-js-style";

definePageMeta({
  layout: "admin",
});

const masterPerusahaanStore = useMasterPerusahaanStore();
const masterKategoriItemStore = useMasterKategoriStore();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

const showFilter = ref(true);
const filterAktifRange = ref("both");
const sudahFilter = ref(false);

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
  nama_perusahaan_perbulan: "",
  nama_cabang_perbulan: "",
  bulanAcuan: moment().format("YYYY-MM"),
  rangeFilter: "both",
  bulanSubFilter: "all",
  status: "",
  headKategoriItem: [
    {
      title: "No",
      value: "no",
      align: "center" as const,
      width: "60px",
    },
    { title: "Perusahaan", value: "nama_perusahaan", sortable: true },
    { title: "Pekerjaan", value: "nama_kategori_item", sortable: true },
    { title: "Kategori", value: "periode", sortable: true },
    {
      title: "Deadline",
      value: "deadlineSort",
      sortable: true,
      width: "220px",
    },
    {
      title: "Tindakan",
      value: "tindakan",
      sortable: true,
      width: "60px",
    },
  ],
  headerdokument: [
    { title: "No", value: "no" },
    { title: "Nama Dokumen", value: "nama_dokumen", sortable: true },
    { title: "No Dokumen", value: "no_dokumen", sortable: true },
    { title: "File Dokumen", value: "file_dokumen", sortable: true },
    { title: "Aksi", value: "aksi" },
  ],
});

const bulanOptions = [
  { title: "Januari", value: 1 },
  { title: "Februari", value: 2 },
  { title: "Maret", value: 3 },
  { title: "April", value: 4 },
  { title: "Mei", value: 5 },
  { title: "Juni", value: 6 },
  { title: "Juli", value: 7 },
  { title: "Agustus", value: 8 },
  { title: "September", value: 9 },
  { title: "Oktober", value: 10 },
  { title: "November", value: 11 },
  { title: "Desember", value: 12 },
];

const bulanDipilih = ref<number | null>(null);
const hasilRekapan = ref<any[]>([]);
const tahunDipilih = ref<number>(new Date().getFullYear());
const filterAktif = ref(false);

const subBulanOptions = computed(() => {
  const bulanAcuan = moment(data.bulanAcuan, "YYYY-MM");
  const options = [];

  if (data.rangeFilter === "previous") {
    for (let i = 3; i >= 1; i--) {
      const m = bulanAcuan.clone().subtract(i, "months");
      options.push({
        label: m.locale("id").format("MMMM"),
        value: m.format("YYYY-MM"),
      });
    }
  } else if (data.rangeFilter === "next") {
    for (let i = 1; i <= 3; i++) {
      const m = bulanAcuan.clone().add(i, "months");
      options.push({
        label: m.locale("id").format("MMMM"),
        value: m.format("YYYY-MM"),
      });
    }
  } else {
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue;
      const m = bulanAcuan.clone().add(i, "months");
      options.push({
        label: m.locale("id").format("MMMM"),
        value: m.format("YYYY-MM"),
      });
    }
  }

  return options;
});

onMounted(async () => {
  await masterPerusahaanStore.tarikDataPerusahaanAct();
  await masterKategoriItemStore.tarikDataItemKategoriAct();
  cekHabisMasaBerlaku();
});

const kategoriWithDeadline = computed(() => {
  return [...masterKategoriItemStore.getDataItemKategori]
    .map((item) => {
      const deadline =
        item.periode?.selesai && item.periode.selesai !== "-"
          ? new Date(item.periode.selesai).getTime()
          : Infinity;

      return {
        ...item,
        deadlineSort: deadline,
      };
    })
    .sort((a, b) => a.deadlineSort - b.deadlineSort);
});

const getRangeLabel = (deadlineDate: string) => {
  const bulanAcuan = moment(data.bulanAcuan, "YYYY-MM");
  const deadline = moment(deadlineDate);

  if (deadline.isBefore(bulanAcuan.clone().startOf("month"))) {
    return "previous";
  }

  return "next";
};

const tahunOptions = computed(() => {
  const tahunSet = new Set<number>();

  masterKategoriItemStore.getDataItemKategori.forEach((item: any) => {
    if (item?.periode?.selesai) {
      tahunSet.add(new Date(item.periode.selesai).getFullYear());
    }
  });

  return Array.from(tahunSet)
    .sort((a, b) => b - a)
    .map((tahun) => ({
      title: String(tahun),
      value: tahun,
    }));
});

const cekHabisMasaBerlaku = () => {
  filterAktifRange.value = data.rangeFilter;
  sudahFilter.value = true;

  const perusahaan = data.nama_perusahaan_perbulan?.trim();
  const bulanAcuan = moment(data.bulanAcuan, "YYYY-MM").startOf("month");

  let start;
  let end;

  if (data.bulanSubFilter && data.bulanSubFilter !== "all") {
    const selectedMonth = moment(data.bulanSubFilter, "YYYY-MM");
    start = selectedMonth.clone().startOf("month");
    end = selectedMonth.clone().endOf("month");
  } else {
    switch (data.rangeFilter) {
      case "previous":
        start = bulanAcuan.clone().subtract(3, "months").startOf("month");
        end = bulanAcuan.clone().subtract(1, "month").endOf("month");
        break;

      case "next":
        start = bulanAcuan.clone().add(1, "month").startOf("month");
        end = bulanAcuan.clone().add(3, "months").endOf("month");
        break;

      case "both":
      default:
        start = bulanAcuan.clone().subtract(3, "months").startOf("month");
        end = bulanAcuan.clone().add(3, "months").endOf("month");
        break;
    }
  }

  hasilRekapan.value = masterKategoriItemStore.getDataItemKategori.filter(
    (item: any) => {
      if (!item?.periode?.selesai || item.periode.selesai === "-") {
        return false;
      }

      if (perusahaan && item.nama_perusahaan?.trim() !== perusahaan) {
        return false;
      }

      const deadline = moment(item.periode.selesai, "YYYY-MM-DD", true);

      if (!deadline.isValid()) {
        return false;
      }

      return (
        deadline.isSameOrAfter(start, "day") &&
        deadline.isSameOrBefore(end, "day")
      );
    },
  );

  if (hasilRekapan.value.length === 0) {
    notificationStore.showInfo("Tidak ada data yang sesuai dengan filter");
  }
};

const dataTable = computed(() => {
  if (sudahFilter.value) {
    return hasilRekapan.value;
  }

  return kategoriWithDeadline.value;
});

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_item_kategori");
  await masterKategoriItemStore.tarikDataItemKategoriAct();
  useloadingStore().setLoading(false);
  notificationStore.showSuccess("Data berhasil diperbarui");
}

const calculateProgress = (deadlineDate: string) => {
  if (!deadlineDate || deadlineDate === "-") return 0;

  const now = new Date();
  const deadline = new Date(deadlineDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (deadline < today) return 100;

  const totalDays = Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  const standardDays = 30;

  if (totalDays > standardDays) {
    return 0;
  }

  const progress = ((standardDays - totalDays) / standardDays) * 100;
  const roundedProgress = Math.round(progress);

  return Math.min(Math.max(roundedProgress, 0), 100);
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "red-darken-1";
  if (progress >= 60) return "orange-darken-1";
  if (progress >= 30) return "blue-darken-1";
  return "green-darken-1";
};

const getProgressTextColor = (progress: number) => {
  if (progress >= 80) return "text-red-darken-1";
  if (progress >= 60) return "text-orange-darken-1";
  if (progress >= 30) return "text-blue-darken-1";
  return "text-green-darken-1";
};

const formatDeadlineDate = (dateString: string) => {
  if (!dateString || dateString === "-") return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const countdownday = (deadlineDate: string) => {
  if (!deadlineDate || deadlineDate === "-") return "-";

  const now = new Date();
  const deadline = new Date(deadlineDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hari ini";
  if (diffDays < 0) return `${Math.abs(diffDays)} hari lewat`;
  return `${diffDays} hari lagi`;
};

const getDeadlineColor = (deadlineDate: string) => {
  if (!deadlineDate || deadlineDate === "-") return "grey";

  const now = new Date();
  const deadline = new Date(deadlineDate);
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "red-darken-1";
  if (diffDays === 0) return "orange-darken-1";
  if (diffDays <= 3) return "orange-darken-1";
  if (diffDays <= 7) return "amber-darken-2";
  return "emerald";
};

const normalizeDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const statusCounts = computed(() => {
  const counts = {
    onProgress: 0,
    penawaran: 0,
    invoice: 0,
    approachingDeadline: 0,
    overdue: 0,
  };

  const today = normalizeDate(new Date());

  const sourceData =
    hasilRekapan.value.length > 0
      ? hasilRekapan.value
      : masterKategoriItemStore.getDataItemKategori;

  sourceData.forEach((item: any) => {
    if (item.status === "Draft") counts.onProgress++;
    if (item.status === "Penawaran") counts.penawaran++;
    if (item.status === "Invoice") counts.invoice++;

    if (item.periode?.selesai && item.periode.selesai !== "-") {
      const deadlineRaw = new Date(item.periode.selesai);

      if (isNaN(deadlineRaw.getTime())) return;

      const deadline = normalizeDate(deadlineRaw);

      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 3) {
        counts.approachingDeadline++;
      }

      if (diffDays < 0) {
        counts.overdue++;
      }
    }
  });

  return counts;
});

const downloadExcel = () => {
  const currentData = dataTable.value;

  if (!currentData || currentData.length === 0) {
    notificationStore.showError("Tidak ada data yang bisa diunduh");
    return;
  }

  const dataUntukExcel = currentData.map((item, index) => ({
    No: index + 1,
    "Nama Perusahaan": item.nama_perusahaan || "-",
    Cabang: item.nama_cabang || "-",
    Pekerjaan: item.nama_kategori_item || "-",
    "Jumlah Unit": item.jumlahUnit || 0,
    "Periode Awal": item.periode?.mulai || "-",
    "Periode Akhir": item.periode?.selesai || "-",
  }));

  const worksheet = XLSX.utils.aoa_to_sheet([]);

  const bulanAktif = bulanOptions.find((b) => b.value === bulanDipilih.value);

  const namaBulan = bulanAktif ? bulanAktif.title : "";
  const tahun = tahunDipilih.value || "";

  const perusahaan = data.nama_perusahaan_perbulan;
  const cabang = data.nama_cabang_perbulan;

  let teksJudul = "";

  if (perusahaan && cabang) {
    teksJudul = `REMINDER ${perusahaan} Cab. ${cabang}`;
  } else {
    teksJudul = `REMINDER BULAN ${namaBulan.toUpperCase()} ${tahun}`;
  }

  XLSX.utils.sheet_add_aoa(worksheet, [[""], [teksJudul], []], {
    origin: "A1",
  });

  XLSX.utils.sheet_add_json(worksheet, dataUntukExcel, {
    origin: "A4",
    skipHeader: false,
  });

  const startRow = 5;
  const endRow = startRow + dataUntukExcel.length - 1;

  if (worksheet["E4"]) {
    worksheet["E4"].s = {
      ...(worksheet["E4"].s || {}),
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  if (worksheet["F4"]) {
    worksheet["F4"].s = {
      ...(worksheet["F4"].s || {}),
      alignment: { horizontal: "right", vertical: "center" },
    };
  }

  if (worksheet["A4"]) {
    worksheet["A4"].s = {
      ...(worksheet["A4"].s || {}),
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  if (worksheet["G4"]) {
    worksheet["G4"].s = {
      ...(worksheet["G4"].s || {}),
      alignment: { horizontal: "right", vertical: "center" },
    };
  }

  for (let row = startRow; row <= endRow; row++) {
    if (worksheet[`E${row}`]) {
      worksheet[`E${row}`].s = {
        ...(worksheet[`E${row}`].s || {}),
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    if (worksheet[`A${row}`]) {
      worksheet[`A${row}`].s = {
        ...(worksheet[`A${row}`].s || {}),
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    if (worksheet[`F${row}`]) {
      worksheet[`F${row}`].s = {
        ...(worksheet[`F${row}`].s || {}),
        alignment: { horizontal: "right", vertical: "center" },
      };
    }

    if (worksheet[`G${row}`]) {
      worksheet[`G${row}`].s = {
        ...(worksheet[`G${row}`].s || {}),
        alignment: { horizontal: "right", vertical: "center" },
      };
    }
  }

  const lastRow = dataUntukExcel.length + 7;

  XLSX.utils.sheet_add_aoa(
    worksheet,
    [[], [`Generated by System Aresa - ${new Date().toLocaleString("id-ID")}`]],
    {
      origin: `A${lastRow}`,
    },
  );

  worksheet["!merges"] = [
    XLSX.utils.decode_range("A1:G1"),
    XLSX.utils.decode_range("A2:G2"),
    XLSX.utils.decode_range(`A${lastRow + 1}:G${lastRow + 1}`),
  ];

  ["A1", "A2", `A${lastRow + 1}`].forEach((cell) => {
    if (worksheet[cell]) {
      worksheet[cell].s = {
        ...(worksheet[cell].s || {}),
        alignment: { horizontal: "center", vertical: "center" },
        font: { bold: true },
      };
    }
  });

  const headers = Object.keys(dataUntukExcel[0]);

  worksheet["!cols"] = headers.map((key) => ({
    wch:
      Math.max(
        key.length,
        ...dataUntukExcel.map((row) => String(row[key] ?? "").length),
      ) + 5,
  }));

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Kategori Item");

  const fileName = `${teksJudul}.xlsx`;

  XLSX.writeFile(workbook, fileName);

  notificationStore.showSuccess("File Excel berhasil diunduh");
};
</script>

<style scoped>
.page-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Custom Card & Elevation Styles */
.filter-card {
  background-color: #ffffff;
  border-color: #e5e7eb !important;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02) !important;
}

.custom-table-card {
  background-color: #ffffff;
  border-color: #e5e7eb !important;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02) !important;
  overflow: hidden;
}

/* Search Field */
.search-field {
  max-width: 320px;
  width: 100%;
}

@media (max-width: 600px) {
  .search-field {
    max-width: 100%;
  }
}

/* Button Toggle Clean Design */
.toggle-container {
  background-color: #f9fafb;
  padding: 3px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.range-toggle {
  background: transparent !important;
  border: none !important;
  height: 36px !important;
}

/* Base style untuk tombol tidak aktif */
.range-toggle :deep(.v-btn) {
  border: none !important;
  border-radius: 8px !important;
  text-transform: none !important;
  color: #4b5563 !important;
}

/* Style tombol RANGE UTAMA AKTIF */
.range-toggle :deep(.active-btn) {
  background-color: #2563eb !important; /* Background biru */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

.range-toggle :deep(.active-btn),
.range-toggle :deep(.active-btn .v-btn__content),
.range-toggle :deep(.active-btn span),
.range-toggle :deep(.active-btn .v-icon) {
  color: #ffffff !important;
}

/* Style tombol SUB-FILTER BULAN AKTIF */
.range-toggle :deep(.active-sub-btn) {
  background-color: #0d9488 !important; /* Background teal/emerald */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

.range-toggle :deep(.active-sub-btn),
.range-toggle :deep(.active-sub-btn .v-btn__content),
.range-toggle :deep(.active-sub-btn span),
.range-toggle :deep(.active-sub-btn .v-icon) {
  color: #ffffff !important;
}

/* Status Badges Bottom */
.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 6px;
  border-color: #e5e7eb !important;
  height: 24px;
}

/* Custom Table Design Minimalist */
.clean-table :deep(thead th) {
  font-weight: 600 !important;
  font-size: 0.8125rem !important;
  color: #4b5563 !important;
  background-color: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb !important;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  height: 44px !important;
}

.clean-table :deep(tbody td) {
  border-bottom: 1px solid #f3f4f6 !important;
  font-size: 0.875rem !important;
  color: #374151;
}

.clean-table :deep(tbody tr:hover) {
  background-color: #f9fafb !important;
}

/* Gap Utilities */
.gap-2 {
  gap: 0.5rem;
}
.gap-3 {
  gap: 0.75rem;
}
.mr-1-5 {
  margin-right: 0.375rem;
}
.py-1-5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}

@media (max-width: 600px) {
  .w-xs-100 {
    width: 100% !important;
  }
}

.kategori-link {
  color: #374151;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.kategori-link:hover {
  color: #1976d2;
  text-decoration: underline;
}
</style>
