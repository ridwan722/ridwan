<template>
  <v-row>
    <v-col>
      <v-breadcrumbs>
        <v-breadcrumbs-item active>
          <span class="font-weight-medium text-h5"> Invoice Dikirim</span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>
  </v-row>
  <ConfirmationDialog ref="confirmationDialog" />

  <v-dialog v-model="data.dialogterima" max-width="450" scrollable>
    <v-card>
      <v-card-title class="px-6 py-3 bg-primary">
        <span
          class="d-flex align-center text-subtitle-1 font-weight-bold text-white"
        >
          UPLOAD TANDA TERIMA
        </span>
      </v-card-title>

      <v-card-text>
        <a-text-field
          label="No Invoice"
          v-model="data.detailinvoice.no_inv"
          disabled
          class="mb-1"
        />

        <v-row>
          <v-col>
            <a-text-field
              label="Nama Perusahaan"
              v-model="data.detailinvoice.nama_perusahaan"
              disabled
            />
          </v-col>
          <v-col>
            <a-text-field
              label="Nama Cabang"
              v-model="data.detailinvoice.nama_cabang_perusahaan"
              disabled
            />
          </v-col>
        </v-row>

        <a-textarea
          label="Alamat"
          v-model="data.detailinvoice.alamat_cabang"
          disabled
        />

        <v-divider class="my-3"></v-divider>

        <!-- <h3 class="text-blue mb-3 font-weight-medium">
          Upload Tanda Terima
        </h3> -->
        <upload-image
          typefolder="doc_tanda_terima"
          label="Upload Tanda Terima"
        />

        <v-btn
          color="primary"
          block
          class="mb-4 mt-5 rounded-small font-weight-medium"
          prepend-icon="mdi-menu-down"
          append-icon="mdi-menu-down"
          size="small"
          @click="addpic"
        >
          Tambahkan ke Daftar
        </v-btn>

        <!-- Jika ada gambar -->
        <template v-if="pictureStore.getter_pictures.length">
          <v-row dense>
            <v-col
              v-for="(item, index) in pictureStore.getter_pictures"
              :key="index"
              cols="12"
            >
              <v-card
                elevation="1"
                class="pa-3 d-flex align-center justify-space-between rounded-lg"
                style="transition: all 0.3s ease; border: 1px solid #e5e7eb"
              >
                <div class="d-flex align-center">
                  <v-avatar size="38" color="blue-lighten-5" class="mr-3">
                    <v-icon color="blue-darken-2"
                      >mdi-file-document-outline</v-icon
                    >
                  </v-avatar>
                  <div>
                    <div class="text-body-1 font-weight-medium">
                      {{ getFileName(item) }}
                    </div>
                  </div>
                </div>

                <div class="d-flex align-center gap-2">
                  <v-btn
                    v-if="item"
                    color="primary"
                    size="small"
                    variant="tonal"
                    :href="item"
                    target="_blank"
                    prepend-icon="mdi-eye"
                  >
                    Lihat
                  </v-btn>
                  <v-btn
                    color="red"
                    size="small"
                    variant="text"
                    @click="pictureStore.removePic(item)"
                    icon
                  >
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </template>

        <!-- Jika belum ada gambar -->
        <template v-else>
          <v-card
            class="d-flex flex-column align-center justify-center pa-10 rounded-lg"
            style="
              border: 2px dashed #cbd5e1;
              background-color: #f9fafb;
              min-height: 150px;
              transition: all 0.3s ease;
            "
          >
            <p class="mt-3 mb-0 text-caption text-grey-darken-1">
              Belum ada file yang ditambahkan
            </p>
          </v-card>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="data.dialogterima = false">Batal</v-btn>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-send"
          @click="inputtandaterima"
          >Simpan</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

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
          {{ invoicestore.getDataInvoice.length }} invoice
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      :headers="data.headinvoice"
      :search="data.search"
      :items="dataDikirim"
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

      <!-- <template v-slot:item.no_inv="{ item }">
        <v-btn
          variant="flat"
          color="grey-lighten-4"
          size="small"
          class="text-none font-weight-bold text-monospace px-2"
          rounded="lg"
          @click="copyToClipboard(item.no_inv)"
        >
          <span class="text-blue-grey-darken-4">{{ item.no_inv }}</span>
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
              Disetujui: 'success',
              Terkirim: 'info',
              Ditolak: 'error',
              Draft: 'grey',
            }[item.status]
          "
          size="small"
          rounded="lg"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.subtotal="{ item }">
        <div class="text-right font-weight-medium text-grey-darken-1">
          {{ rupiah(item.subtotal) }}
        </div>
      </template>

      <!-- <template v-slot:item.createdAt="{ item }">
        <div style="width: 100px">
          <span>{{ rubahtanggalunix(item.createdAt) }}</span>
        </div>
      </template> -->

      <template v-slot:item.dikirimAt="{ item }">
        <span>{{ rubahtanggalunix(item.dikirimAt) }}</span>
      </template>

      <template v-slot:item.perihal="{ item }">
        <div style="width: 250px">
          <span>{{ item.perihal }}</span>
        </div>
      </template>

      <template v-slot:item.grandtotal="{ item }">
        <span>{{ rupiah(item.grandtotal) }}</span>
      </template>

      <template v-slot:item.perihal_invoice="{ item }">
        <div style="min-width: 220px">{{ item.perihal_invoice }}</div>
      </template>

      <!-- <template v-slot:item.nama_cabang_perusahaan="{ item }">
        <v-chip
          size="small"
          variant="tonal"
          color="success"
          rounded="lg"
          class="font-weight-bold cursor-pointer"
          style="border-bottom: 2px solid #2e7d32"
          :to="'/admin/invoice/' + item.id"
        >
          <v-icon start size="14" icon="mdi-eye" />
          {{ item.nama_cabang_perusahaan }}
          <v-tooltip activator="parent" location="top">Detail</v-tooltip>
        </v-chip>
      </template> -->

      <template v-slot:item.jatuhTempo="{ item }">
        <div class="py-1" style="min-width: 160px">
          <div class="d-flex justify-space-between align-end mb-1">
            <span
              class="text-caption font-weight-bold"
              style="font-size: 0.75rem !important"
            >
              {{
                new Date(item.jatuhTempo).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              }}
            </span>
            <span
              class="text-caption font-weight-black"
              :class="`text-${calculateDaysLeft(item.jatuhTempo).textColor}`"
              style="font-size: 10px !important"
            >
              {{ calculateProgress(item.tanggal, item.jatuhTempo) }}%
            </span>
          </div>

          <v-progress-linear
            :model-value="calculateProgress(item.tanggal, item.jatuhTempo)"
            :color="calculateDaysLeft(item.jatuhTempo).barColor"
            height="4"
            rounded
            class="mb-1"
          />

          <div class="d-flex align-center">
            <v-icon
              start
              size="12"
              :color="calculateDaysLeft(item.jatuhTempo).textColor"
              :icon="calculateDaysLeft(item.jatuhTempo).icon"
              class="me-1"
            />
            <span
              class="font-weight-medium"
              :class="`text-${calculateDaysLeft(item.jatuhTempo).textColor}`"
              style="font-size: 10px"
            >
              {{ calculateDaysLeft(item.jatuhTempo).text }}
            </span>
          </div>
        </div>
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

      <template v-slot:no-data>
        <div class="py-8 text-center text-grey-darken-1">
          <v-icon
            size="48"
            color="grey-lighten-1"
            class="mb-2"
            icon="mdi-file-plus-outline"
          />
          <div class="text-body-1">Tidak ada data invoice dikirim</div>
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
                        invoicestore.getDataInvoice.length,
                      )
                    }}
                  </strong>
                  <span class="text-grey mx-1">/</span>
                  <strong>{{ invoicestore.getDataInvoice.length }}</strong>
                  <span class="text-grey mx-1">Data</span>
                </span>
              </div>

              <v-divider vertical class="mx-3 d-none d-sm-flex" />

              <div
                class="d-flex align-center ga-4"
                style="border-color: #e0e0e0 !important"
              >
                <div
                  class="d-flex align-center ga-1 cursor-pointer hover-filter"
                  @click="filterStatus = 'Terlewat'"
                  :class="{ 'filter-active': filterStatus === 'Terlewat' }"
                >
                  <v-badge dot color="red" inline />
                  <span class="text-caption text-grey-darken-1">Terlewat</span>
                  <span
                    class="text-obsidian font-weight-black text-red"
                    style="font-size: 10px"
                    >{{ counts.Terlewat }}</span
                  >
                </div>

                <div
                  class="d-flex align-center ga-1 cursor-pointer hover-filter"
                  @click="filterStatus = 'Hari Ini'"
                  :class="{ 'filter-active': filterStatus === 'Hari Ini' }"
                >
                  <v-badge dot color="deep-orange" inline />
                  <span class="text-caption text-grey-darken-1">Hari Ini</span>
                  <span
                    class="text-obsidian font-weight-black text-deep-orange"
                    style="font-size: 10px"
                    >{{ counts.HariIni }}</span
                  >
                </div>

                <div
                  class="d-flex align-center ga-1 cursor-pointer hover-filter"
                  @click="filterStatus = 'Mepet'"
                  :class="{ 'filter-active': filterStatus === 'Mepet' }"
                >
                  <v-badge dot color="teal-lighten-1" inline />
                  <span class="text-caption text-grey-darken-1">< 7 Hari</span>
                  <span
                    class="text-obsidian font-weight-black text-teal"
                    style="font-size: 10px"
                    >{{ counts.Mepet }}</span
                  >
                </div>

                <div
                  class="d-flex align-center ga-1 cursor-pointer hover-filter"
                  @click="filterStatus = 'Aman'"
                  :class="{ 'filter-active': filterStatus === 'Aman' }"
                >
                  <v-badge dot color="blue-lighten-1" inline />
                  <span class="text-caption text-grey-darken-1">Aman</span>
                  <span
                    class="text-obsidian font-weight-black text-blue"
                    style="font-size: 10px"
                    >{{ counts.Aman }}</span
                  >
                </div>
              </div>
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

      <template v-slot:item.actions="{ item }">
        <v-btn
          color="success"
          variant="flat"
          rounded="lg"
          size="small"
          prepend-icon="mdi-check-circle"
          @click="opendialogterima(item)"
        >
          Terima
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { useMasterPerusahaanStore } from "~/stores/master/perusahaanStore";
import type { invoiceM } from "~/types/InvoiceModel";

definePageMeta({
  layout: "admin",
});

const invoicestore = useInvoiceStore();
const pictureStore = usePictureStore();
const uploadstore = uploadStore();
const now = ref(new Date());
let timer: any = null;

const dataDikirim = computed(() =>
  invoicestore.dataInvoice.filter((item) => item.status === "Dikirim"),
);

onMounted(async () => {
  await invoicestore.tarikdataInvoicebystatus("Dikirim");
  await invoicestore.tarikDataInvoiceAct();
  await perusahaanStore.tarikDataCabangAct();
  await perusahaanStore.tarikDataPerusahaanAct();

  // Update waktu setiap 60 detik
  timer = setInterval(() => {
    now.value = new Date();
  }, 60000);
});

onBeforeUnmount(() => {
  // Bersihkan timer saat komponen dihancurkan
  if (timer) clearInterval(timer);
});

const data = reactive({
  search: "",
  dialogterima: false,
  documents_terima: [] as string[],
  detailinvoice: {} as invoiceM,
  tanggal_awal: "",
  tanggal_akhir: "",
  status: "",
  nama_perusahaan: "",
  nama_cabang: "",
  itemsPerPage: 10,
  page: 1,

  headinvoice: [
    {
      title: "No",
      value: "no",
      width: "50px",
    },
    {
      title: "Tanggal Dikirim",
      value: "dikirimAt",
      sortable: true,
    },
    {
      title: "No Invoice",
      value: "no_inv",
      sortable: true,
    },
    {
      title: "Perusahaan",
      value: "nama_perusahaan", // Diambil dari id_perusahaan/nama_perusahaan
      sortable: true,
    },
    {
      title: "Cabang ",
      value: "nama_cabang_perusahaan", // Diambil dari id_perusahaan/nama_perusahaan
      sortable: true,
    },
    {
      title: "Perihal",
      value: "perihal_invoice", // Menambahkan info kategori item
      sortable: true,
    },
    {
      title: "Jatuh Tempo",
      value: "jatuhTempo", // Menambahkan info tenggat waktu
      sortable: true,
    },
    {
      title: "Total",
      value: "grandtotal",
      align: "end" as const,
      sortable: true,
    },
    {
      title: "Status",
      value: "status",

      sortable: true,
    },
    {
      title: "Actions",
      value: "actions",
      align: "center" as const,
      sortable: true,
    },
  ],
});

// LOGIC PROGRESS BAR (Terupdate otomatis)
const calculateProgress = (startDate: string, dueDate: string) => {
  if (!startDate || !dueDate) return 0;
  const start = new Date(startDate).getTime();
  const end = new Date(dueDate).getTime();
  const current = now.value.getTime(); // Menggunakan referensi timer

  if (current >= end) return 100;
  if (current <= start) return 0;

  const total = end - start;
  const progress = current - start;
  return Math.round((progress / total) * 100);
};

// Tambahkan di dalam <script setup>
const filterStatus = ref("Dikirim");

const filteredInvoices = computed(() => {
  const allData = invoicestore.getDataInvoice;
  if (filterStatus.value === "Dikirim") return allData;
  return allData.filter(
    (item) =>
      calculateDaysLeft(item.jatuhTempo).category === filterStatus.value,
  );
});

// Menghitung jumlah untuk badge indikator
const counts = computed(() => {
  const allData = invoicestore.getDataInvoice;
  return {
    Terlewat: allData.filter(
      (item) => calculateDaysLeft(item.jatuhTempo).category === "Terlewat",
    ).length,
    HariIni: allData.filter(
      (item) => calculateDaysLeft(item.jatuhTempo).category === "Hari Ini",
    ).length,
    Mepet: allData.filter(
      (item) => calculateDaysLeft(item.jatuhTempo).category === "Mepet",
    ).length,
    Aman: allData.filter(
      (item) => calculateDaysLeft(item.jatuhTempo).category === "Aman",
    ).length,
  };
});

// Update fungsi calculateDaysLeft untuk menyertakan kategori
const calculateDaysLeft = (dueDate: string) => {
  if (!dueDate)
    return { text: "", textColor: "", icon: "", barColor: "", category: "" };

  const today = new Date(now.value);
  today.setHours(0, 0, 0, 0);
  const target = new Date(dueDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: `Terlambat ${Math.abs(diffDays)} Hari`,
      textColor: "red-darken-2",
      barColor: "red",
      icon: "mdi-alert-circle",
      category: "Terlewat",
    };
  } else if (diffDays === 0) {
    return {
      text: "Batas Waktu Hari Ini",
      textColor: "deep-orange-darken-1",
      barColor: "deep-orange",
      icon: "mdi-clock-alert",
      category: "Hari Ini",
    };
  } else if (diffDays <= 7) {
    return {
      text: `Sisa ${diffDays} Hari`,
      textColor: "teal-darken-1",
      barColor: "teal-lighten-1",
      icon: "mdi-clock-outline",
      category: "Mendekati Batas", // Lebih profesional daripada "Mepet"
    };
  } else {
    return {
      text: `Sisa ${diffDays} Hari`,
      textColor: "blue-darken-2",
      barColor: "blue-lighten-1",
      icon: "mdi-calendar-check",
      category: "Terjadwal", // Lebih profesional daripada "Aman"
    };
  }
};

const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // Menggunakan notificationStore (asumsi menggunakan method success/show)
    notificationStore.showSuccess(`Nomor invoice ${text} berhasil disalin`);
  } catch (err) {
    notificationStore.showError("Gagal menyalin nomor invoice");
    console.error("Gagal menyalin: ", err);
  }
};

// Tambahkan di dalam script setup
const summaryData = computed(() => {
  const allData = invoicestore.getDataInvoice;

  const calculateTotal = (items: any[]) =>
    items.reduce((acc, curr) => acc + (curr.total || 0), 0);

  return [
    {
      label: "Semua Invoice",
      value: calculateTotal(allData),
      count: allData.length,
      icon: "mdi-file-document-multiple",
      color: "blue",
    },
    {
      label: "Terbayar/Setuju",
      value: calculateTotal(allData.filter((i) => i.status === "Disetujui")),
      count: allData.filter((i) => i.status === "Disetujui").length,
      icon: "mdi-check-decagram",
      color: "success",
    },
    {
      label: "Menunggu",
      value: calculateTotal(allData.filter((i) => i.status === "Terkirim")),
      count: allData.filter((i) => i.status === "Terkirim").length,
      icon: "mdi-clock-fast",
      color: "info",
    },
    {
      label: "Jatuh Tempo",
      value: calculateTotal(
        allData.filter(
          (i) => calculateDaysLeft(i.jatuhTempo).category === "Terlewat",
        ),
      ),
      count: allData.filter(
        (i) => calculateDaysLeft(i.jatuhTempo).category === "Terlewat",
      ).length,
      icon: "mdi-alert-octagon",
      color: "error",
    },
  ];
});

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
  invoicestore.queryrekapaninvoice(
    tanggal_awal,
    tanggal_akhir,
    nama_perusahaan,
    nama_cabang,
    "Dikirim",
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

function getFileName(url: string) {
  try {
    const decoded = decodeURIComponent(url);
    return decoded.split("/").pop()?.split("?")[0] || "file";
  } catch {
    return "file";
  }
}

const addpic = () => {
  if (uploadstore.getUrlRef == "") {
    return notificationStore.showError("Foto tidak boleh kosong");
  }
  pictureStore.pushPic(uploadstore.getUrlRef);
  uploadstore.setReset();
};

function opendialogterima(item: invoiceM) {
  data.detailinvoice = _.assign({}, item);
  data.dialogterima = true;
}

async function inputtandaterima() {
  if (pictureStore.getter_pictures.length === 0) {
    return notificationStore.showError("Upload file terlebih dahulu");
  }

  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Tanda Terima",
    "Anda yakin ingin menyimpan Tanda Terima ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Tindakan dibatalkan");
  }

  useloadingStore().setLoading(true);

  try {
    const idInvoice = data.detailinvoice.id_inv || data.detailinvoice.id;

    const dataset = {
      ...data.detailinvoice,
      updatedAt: moment().unix(),
      updatedBy: useUserStore().getEmail,
      tanda_terima_at: moment().unix(),
      tanda_terima_By: useUserStore().getEmail,
      status: "Diterima",
      tanda_terima_invoice: [...pictureStore.getter_pictures],
    };

    const result = await updateinvoice(dataset);

    if (result !== "ok") {
      throw new Error(result);
    }

    /*
     * Hapus invoice yang baru diubah dari daftar Dikirim.
     * Sesuaikan `dataInvoice` dengan nama state di store Anda.
     */
    invoicestore.dataInvoice = invoicestore.dataInvoice.filter(
      (item) => (item.id_inv || item.id) !== idInvoice,
    );

    // Tetap tarik ulang sebagai sinkronisasi
    await invoicestore.tarikdataInvoicebystatus("Dikirim");

    notificationStore.showSuccess("Tanda Terima Berhasil Diubah");

    uploadstore.setReset();
    pictureStore.reset();

    data.documents_terima = [];
    data.dialogterima = false;
  } catch (error) {
    console.error("Gagal mengubah tanda terima:", error);
    notificationStore.showError(
      error instanceof Error ? error.message : "Tanda Terima gagal diubah",
    );
  } finally {
    useloadingStore().setLoading(false);
    await invoicestore.tarikdataInvoicebystatus("Dikirim");
  }
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
</style>
