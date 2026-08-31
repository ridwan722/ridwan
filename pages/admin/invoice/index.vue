<template>
  <ConfirmationDialog ref="confirmationDialog" />
  <v-row>
    <v-col>
      <v-breadcrumbs>
        <v-breadcrumbs-item active>
          <span class="font-weight-medium text-h5">Draft Invoice </span>
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
              <a-select
                v-model="data.status"
                label="Status"
                variant="solo"
                :items="[
                  'Draft',
                  'Dikirim',
                  'Disetujui',
                  'Ditolak',
                  'Diterima',
                  'Selesai',
                ]"
              />
            </v-col>

            <v-col cols="12" sm="12" class="d-flex justify-end">
              <v-btn
                size="small"
                color="primary"
                class="mt-4"
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
    <v-card-title class="pa-4">
      <v-row align="center" justify="space-between">
        <!-- Search -->
        <v-col cols="12" md="4">
          <a-text-field
            v-model="data.search"
            placeholder="Search"
            hide-details
          />
        </v-col>

        <!-- Total + Action -->
        <v-col cols="12" md="8">
          <div
            class="d-flex flex-column flex-md-row justify-md-end align-md-center"
            style="gap: 12px"
          >
            <div class="text-caption text-grey-darken-1">
              Total keseluruhan:
              <strong>{{ invoicestore.getDataInvoice.length }}</strong>
              invoice
            </div>

            <div class="d-flex flex-wrap" style="gap: 10px">
              <v-btn
                color="primary"
                size="small"
                variant="elevated"
                prepend-icon="mdi-cloud-download"
                class="rounded-lg font-weight-bold"
                @click="tarikSemuaInvoice"
              >
                Tarik Semua Invoice
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      :headers="data.headinvoice"
      :search="data.search"
      :items="invoicestore.dataInvoiceTampil"
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

      <template v-slot:item.createdAt="{ item }">
        <div style="width: 100px">
          <span>{{ rubahtanggalunix(item.createdAt) }}</span>
        </div>
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

      <template v-slot:item.perihal_invoice="{ item }">
        <div style="width: 300px">
          <span>{{ item.perihal_invoice }}</span>
        </div>
      </template>

      <template v-slot:item.grandtotal="{ item }">
        <span>{{ rupiah(item.grandtotal) }}</span>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip
          :color="
            {
              Disetujui: 'success',
              Dikirim: 'info',
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

      <template v-slot:item.total="{ item }">
        <div class="text-right">
          <span class="text-body-2 font-weight-black text-blue-grey-darken-4">
            {{ rupiah(item.total) }}
          </span>
        </div>
      </template>

      <template v-slot:item.nama_cabang_perusahaan="{ item }">
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
      </template>

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

      <template v-slot:item.aksi="{ item }">
        <div class="d-flex justify-center pa-2">
          <v-btn
            size="27"
            variant="tonal"
            color="error"
            class="rounded-lg"
            :disabled="item.status != 'Draft'"
            @click="hapusinvoice(item)"
          >
            <v-icon icon="mdi-trash-can-outline" />
            <v-tooltip activator="parent" location="top">Hapus</v-tooltip>
          </v-btn>
        </div>
      </template>

      <template v-slot:no-data>
        <div class="py-8 text-center text-grey-darken-1">
          <v-icon
            size="48"
            color="grey-lighten-1"
            class="mb-2"
            icon="mdi-file-plus-outline"
          />
          <div class="text-body-1">Tidak ada data invoice</div>
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
    </v-data-table>
  </v-card>

  <!-- <v-row class="mb-5 mt-1" g-2>
    <v-col
      cols="12"
      sm="6"
      md="3"
      v-for="(card, index) in summaryData"
      :key="index"
    >
      <v-card
        class="rounded-xl border"
        flat
        :style="`border-color: ${card.hex} !important; background-color: ${card.bg}`"
      >
        <v-card-text class="pa-3">
          <div class="d-flex align-center">
            <v-avatar :color="card.color" size="36" variant="flat" class="me-3">
              <v-icon :icon="card.icon" size="18" color="white" />
            </v-avatar>

            <div>
              <div
                class="text-caption text-grey-darken-1 font-weight-medium mb-n1"
              >
                {{ card.label }}
              </div>
              <div class="d-flex align-baseline ga-1">
                <span class="text-h6 font-weight-black text-blue-grey-darken-4">
                  {{ rupiah(card.value).replace(",00", "") }}
                </span>
                <span class="text-caption font-weight-bold text-grey">
                  ({{ card.count }})
                </span>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row> -->
</template>

<script setup lang="ts">
import _ from "lodash";
import { useMasterPerusahaanStore } from "~/stores/master/perusahaanStore";
import type { invoiceM } from "~/types/InvoiceModel";

definePageMeta({
  layout: "admin",
});

const invoicestore = useInvoiceStore();
const perusahaanStore = useMasterPerusahaanStore();

const now = ref(new Date());
let timer: any = null;

onMounted(async () => {
  await invoicestore.tarikDataInvoiceAct();
  await invoicestore.tarikdataInvoicebystatus("Draft");
  await perusahaanStore.tarikDataCabangAct();
  await perusahaanStore.tarikDataPerusahaanAct();

  timer = setInterval(() => {
    now.value = new Date();
  }, 60000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

const tarikSemuaInvoice = async () => {
  useloadingStore().setLoading(true); // Aktifkan loading panel
  try {
    // Menarik semua data penawaran dari server
    await invoicestore.tarikDataInvoiceAct();
  } catch (error) {
    console.error("Gagal menarik semua data penawaran:", error);
  } finally {
    useloadingStore().setLoading(false); // Matikan loading panel
  }
};

const dataDraft = computed(() =>
  invoicestore.dataInvoice.filter(
    (item) => item.status === "Draft"
  )
);

const data = reactive({
  search: "",
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
      title: "Tanggal Inv",
      value: "createdAt",
      sortable: true,
    },
    {
      title: "No Invoice",
      value: "no_inv",
      sortable: true,
    },
    {
      title: "Perusahaan",
      value: "nama_perusahaan",
      sortable: true,
    },
    {
      title: "Cabang ",
      value: "nama_cabang_perusahaan",
      sortable: true,
    },
    {
      title: "Perihal",
      value: "perihal_invoice",
      sortable: true,
    },
    {
      title: "Jatuh Tempo",
      value: "jatuhTempo",
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
      title: "Aksi",
      value: "aksi",

      sortable: true,
    },
  ],
});

watch(
  () => data.nama_perusahaan,

  async (idperusahaan) => {
    const dataperusahaan = perusahaanStore.getDataPerusahaan;

    const b = _.find(
      dataperusahaan,
      (o: any) => o.nama_perusahaan == idperusahaan,
    );

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

    if (!_.isUndefined(b)) {
    }
  },
);

const calculateProgress = (startDate: string, dueDate: string) => {
  if (!startDate || !dueDate) return 0;
  const start = new Date(startDate).getTime();
  const end = new Date(dueDate).getTime();
  const current = now.value.getTime();

  if (current >= end) return 100;
  if (current <= start) return 0;

  const total = end - start;
  const progress = current - start;
  return Math.round((progress / total) * 100);
};

const filterStatus = ref("Semua");

const filteredInvoices = computed(() => {
  const allData = invoicestore.dataInvoiceTampil;
  if (filterStatus.value === "Semua") return allData;
  return allData.filter(
    (item) =>
      calculateDaysLeft(item.jatuhTempo).category === filterStatus.value,
  );
});

const counts = computed(() => {
  const allData = invoicestore.dataInvoiceTampil;
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
      category: "Mendekati Batas",
    };
  } else {
    return {
      text: `Sisa ${diffDays} Hari`,
      textColor: "blue-darken-2",
      barColor: "blue-lighten-1",
      icon: "mdi-calendar-check",
      category: "Terjadwal",
    };
  }
};
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);
const notificationStore = useNotificationStore();

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);

    notificationStore.showSuccess(`Nomor invoice ${text} berhasil disalin`);
  } catch (err) {
    notificationStore.showError("Gagal menyalin nomor invoice");
    console.error("Gagal menyalin: ", err);
  }
};

const summaryData = computed(() => {
  const allData = invoicestore.getDataInvoice;

  const calculateTotal = (items: any[]) =>
    items.reduce((acc, curr) => acc + (curr.total || 0), 0);

  return [
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

const cekrekapan = () => {
  const { tanggal_awal, tanggal_akhir, nama_perusahaan, nama_cabang, status } =
    data;

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

  if ((tanggal_awal && !tanggal_akhir) || (!tanggal_awal && tanggal_akhir)) {
    notificationStore.showError(
      "Tanggal Awal dan Tanggal Akhir harus diisi bersamaan",
    );
    return;
  }
  console.log(nama_perusahaan, "nama_perusahaan");
  console.log(nama_cabang, "nama_cabang");

  invoicestore.queryrekapaninvoice(
    tanggal_awal,
    tanggal_akhir,
    nama_perusahaan,
    nama_cabang,
    status,
  );
};

async function hapusinvoice(item: invoiceM) {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus Invoice",
    "Anda yakin ingin menghapus Invoice ini? Pastikan Tindakan ini Benar-benar dibutuhkan",
  );

  if (!confirmed) {
    return notificationStore.showError("Penghapusan Invoice dibatalkan");
  }
  sessionStorage.removeItem("m_item_kategori");
  await invoicestore.deleteInvoiceAct(item);
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
