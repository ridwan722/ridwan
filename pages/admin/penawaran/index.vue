<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <!-- Tombol Kembali -->
  <v-btn
    variant="text"
    color="grey-darken-3"
    prepend-icon="mdi-arrow-left"
    @click="$router.go(-1)"
    class="text-capitalize font-weight-bold mb-2"
  >
    Kembali
  </v-btn>

  <!-- Dialog Tambah / Edit Quotation -->
  <v-dialog
    v-model="data.dialogTambahPenawaran"
    max-width="800"
    scrollable
    fullscreen-sm-and-down
  >
    <v-card class="rounded-xl-md overflow-hidden elevation-3 border-0">
      <v-card-item class="bg-grey-lighten-4 pa-4 text-center">
        <h4 class="font-weight-bold text-grey-darken-3 text-h6 text-sm-h5">
          {{ data.penawaranAddEdit === "add" ? "Create" : "Edit" }} Quotation
        </h4>
        <p class="text-caption text-grey-darken-1 m-0">
          Lengkapi rincian penawaran harga dan item pekerjaan di bawah ini.
        </p>
      </v-card-item>

      <v-card-text class="pa-4 pa-sm-6">
        <!-- Section: Informasi Utama -->
        <div class="text-subtitle-2 font-weight-bold text-primary mb-3">
          Informasi Utama
        </div>
        <v-row density="comfortable">
          <v-col cols="12" sm="6">
            <a-select-new
              v-model="newPenawaran.id_perusahaan"
              label="Client"
              placeholder="Select"
              item-title="nama"
              item-value="id"
              :items="customerStore.getDataCustomer"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <a-date-picker-new
              v-model="newPenawaran.tanggal_penawaran"
              label="Quotation Date"
            />
          </v-col>
          <v-col cols="12">
            <a-text-field-new
              v-model="newPenawaran.alamat_perusahaan"
              label="Address"
              disabled
              placeholder="*Auto"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <a-text-field-new
              v-model="newPenawaran.pic"
              label="PIC"
              disabled
              placeholder="*Auto"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <a-text-field-new
              v-model="newPenawaran.no_telp"
              label="Phone Number"
              disabled
              placeholder="*Auto"
            />
          </v-col>
        </v-row>

        <v-divider class="my-4 border-opacity-50" />

        <a-textarea-new
          v-model="newPenawaran.perihal"
          label="Subject"
          placeholder="Quotation Subject"
          rows="2"
        />

        <v-divider class="my-4 border-opacity-50" />

        <!-- Section: Rincian Item -->
        <div class="d-flex align-center justify-space-between mb-3">
          <span class="text-subtitle-2 font-weight-bold text-primary">
            Rincian Item & Penawaran
          </span>
          <v-btn
            size="small"
            variant="tonal"
            color="primary"
            prepend-icon="mdi-plus"
            class="text-none font-weight-semibold rounded-lg"
            @click="tambahBarisPenawaran"
          >
            Tambah Baris
          </v-btn>
        </div>

        <!-- Loop Item Penawaran -->
        <div
          v-for="(item, index) in newPenawaran.penawaran_item"
          :key="index"
          class="bg-grey-lighten-5 rounded-lg pa-3 pa-sm-4 mb-4 border border-dashed position-relative"
        >
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-caption font-weight-bold text-grey-darken-2"
              >Item #{{ index + 1 }}</span
            >
            <v-btn
              icon="mdi-trash-can-outline"
              size="x-small"
              variant="text"
              color="error"
              @click="hapusBarisPenawaran(index)"
            />
          </div>

          <a-textarea-new
            v-model="item.nama"
            label="Description"
            placeholder="Description"
            rows="2"
            class="mb-2"
          />

          <v-row density="compact">
            <v-col cols="6" sm="3">
              <a-field-number-new
                v-model="item.qty"
                label="Qty"
                placeholder="0"
              />
            </v-col>
            <v-col cols="6" sm="3">
              <a-select-new
                :items="['Unit', 'Pcs', 'Kg']"
                v-model="item.uom"
                label="UOM"
                placeholder="Select"
              />
            </v-col>
            <v-col cols="12" sm="3">
              <a-field-number-new
                v-model="item.amount"
                label="Amount/Pcs (Rp)"
                placeholder="0"
              />
            </v-col>
            <v-col cols="12" sm="3">
              <a-text-field-new
                :model-value="
                  (
                    Number(item.qty || 0) * Number(item.amount || 0)
                  ).toLocaleString('id-ID')
                "
                label="Subtotal"
                placeholder="0"
                disabled
              />
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-4 border-opacity-50" />

        <!-- Section: Ringkasan Biaya -->
        <div class="text-subtitle-2 font-weight-bold text-primary mb-3">
          Ringkasan Biaya
        </div>

        <v-card variant="flat" class="bg-blue-grey-lighten-5 rounded-xl pa-4">
          <div class="d-flex justify-space-between align-center">
            <span class="text-subtitle-1 font-weight-bold text-grey-darken-4"
              >Total</span
            >
            <span class="text-h6 text-sm-h5 font-weight-black text-primary">
              Rp {{ rupiah(subtotalPenawaran) }}
            </span>
          </div>
        </v-card>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4 bg-grey-lighten-5">
        <v-spacer class="hidden-xs-only" />
        <v-btn
          size="medium"
          variant="outlined"
          color="grey-darken-1"
          class="px-5 text-none rounded-lg flex-grow-1 flex-sm-grow-0"
          @click="data.dialogTambahPenawaran = false"
        >
          Batal
        </v-btn>
        <v-btn
          size="medium"
          color="primary"
          variant="flat"
          class="px-6 text-none rounded-lg font-weight-bold flex-grow-1 flex-sm-grow-0"
          @click="simpanPenawaranDialog"
        >
          {{ data.penawaranAddEdit === "add" ? "Save" : "Edit" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Header & Top Action -->
  <div
    class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center mb-4 gap-2"
  >
    <h1 class="text-h5 font-weight-bold my-0">Penawaran</h1>
    <v-btn
      color="primary"
      variant="flat"
      size="small"
      class="text-capitalize w-100 w-sm-auto"
      prepend-icon="mdi-plus"
      @click="openDialogTambahPenawaran"
    >
      Create New Quotation
    </v-btn>
  </div>

  <!-- Main Table Card -->
  <v-card class="border rounded-lg" flat>
    <v-card-title class="pa-3 pa-sm-4">
      <div class="d-flex align-center gap-2">
        <div class="flex-grow-1">
          <a-text-field-new
            v-model="data.searchPenawaran"
            placeholder="Cari no. penawaran / customer"
            hide-details
            density="compact"
          />
        </div>
        <v-btn
          size="38"
          variant="outlined"
          class="border flex-shrink-0"
          @click="refreshData"
        >
          <v-icon size="20" icon="mdi-refresh" />
          <v-tooltip activator="parent" location="top">
            Refresh Data
          </v-tooltip>
        </v-btn>
      </div>
    </v-card-title>

    <v-divider />

    <!-- Responsive Table -->
    <v-data-table
      :headers="data.headPenawaran"
      :items="penawaranStore.getDataPenawaran"
      :search="data.searchPenawaran"
      density="compact"
      :sort-by="[{ key: 'created_at', order: 'desc' }]"
      :hover="true"
      class="text-no-wrap"
    >
      <template v-slot:item.no="{ index }"> {{ index + 1 }}</template>

      <template v-slot:item.no_penawaran="{ item }">
        <NuxtLink
          :to="'/admin/penawaran/' + item.id"
          class="penawaran-link font-weight-medium"
        >
          {{ item.no_penawaran }}
        </NuxtLink>
      </template>

      <template v-slot:item.tanggal_penawaran="{ item }">
        {{ rubahtanggallengkap(item.tanggal_penawaran) }}
      </template>

      <template v-slot:item.grand_total="{ item }">
        Rp {{ rupiah(item.grand_total_penawaran) }}
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip
          size="x-small"
          :color="statusColor(item.status)"
          variant="flat"
          class="font-weight-bold"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.aksi="{ item }">
        <div class="d-flex justify-center align-center">
          <v-btn
            size="28"
            variant="tonal"
            color="info"
            class="rounded-lg mr-1"
            :to="'/admin/penawaran/' + item.id"
          >
            <v-icon size="16" icon="mdi-eye" />
            <v-tooltip activator="parent" location="top"
              >Detail Penawaran</v-tooltip
            >
          </v-btn>

          <v-btn
            :disabled="item.status !== 'Draft'"
            size="28"
            variant="tonal"
            color="warning"
            class="rounded-lg mr-1"
            @click="openDialogEditPenawaran(item)"
          >
            <v-icon size="16" icon="mdi-pencil-outline" />
            <v-tooltip activator="parent" location="top"
              >Edit Penawaran</v-tooltip
            >
          </v-btn>

          <v-btn
            size="28"
            variant="tonal"
            color="grey"
            class="rounded-lg"
            @click="hapusPenawaran(item)"
          >
            <v-icon size="16" icon="mdi-trash-can-outline" />
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
            icon="mdi-file-document-edit-outline"
          />
          <div class="text-body-1">Belum ada data Penawaran</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";
import type { ConfirmationDialog } from "#components";
import type { penawaranM } from "~/types/penawaranModel";

definePageMeta({
  layout: "admin",
});

const router = useRouter();
const customerStore = usecustomerStore();
const penawaranStore = usePenawaranStore();
const invoiceStore = useinvoiceStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

const filterStatusOptions = [
  { label: "Semua Status", value: "" },
  { label: "Draft", value: "Draft" },
  { label: "Pending", value: "Pending" },
  { label: "Disetujui", value: "Disetujui" },
  { label: "Ditolak", value: "Ditolak" },
];

const data = reactive({
  searchPenawaran: "",

  dialogTambahPenawaran: false,
  penawaranAddEdit: "add" as "add" | "edit",
  editOriginalCustomerId: "",
  headPenawaran: [
    { title: "No", value: "no", width: "10px" },
    { title: "Date", value: "tanggal_penawaran", sortable: true },
    { title: "Quotation Ref No", value: "no_penawaran", sortable: true },
    { title: "Client", value: "nama_perusahaan", sortable: true },
    { title: "Subject", value: "perihal", sortable: true },
    { title: "Total Amount", value: "grand_total", sortable: true },
    { title: "Status", value: "status", sortable: true },
    { title: "Aksi", align: "center" as const, value: "aksi", width: "120px" },
  ],
});

function emptyPenawaran(): penawaranM {
  const generatedNo = generateNoPenawaran();
  return {
    no_penawaran: generatedNo,
    id_perusahaan: "",
    pic: "",
    nama_perusahaan: "",
    alamat_perusahaan: "",
    no_telp: "",
    tanggal_penawaran: moment().format("YYYY-MM-DD"),
    created_at: 0,
    created_by: "",
    status: "Draft",
    perihal: "",
    penawaran_item: [
      { nama: "", qty: 1, uom: "Unit", amount: 0, subtotal_item: 0 },
    ],
    subtotal_penawaran: 0,
    grand_total_penawaran: 0,
    terbilang: "",
  };
}

function generateNoPenawaran(): string {
  const year = moment().format("YYYY");
  const pattern = new RegExp(`^QT/ICI/${year}/SNS/(\\d{5})$`);
  const lastSequence = (penawaranStore.getDataPenawaran || []).reduce(
    (highest, penawaran) => {
      const match = penawaran.no_penawaran?.match(pattern);
      return match ? Math.max(highest, Number(match[1])) : highest;
    },
    0,
  );

  return `QT/ICI/${year}/SNS/${String(lastSequence + 1).padStart(5, "0")}`;
}

const newPenawaran = ref<penawaranM>(emptyPenawaran());

const subtotalPenawaran = computed(() =>
  newPenawaran.value.penawaran_item.reduce(
    (total, item) =>
      total + (Number(item.qty) || 0) * (Number(item.amount) || 0),
    0,
  ),
);

watch(
  () => newPenawaran.value.id_perusahaan,
  (idCustomer) => {
    if (
      data.penawaranAddEdit === "edit" &&
      idCustomer === data.editOriginalCustomerId
    ) {
      return;
    }
    const customer = customerStore.getDataCustomer.find(
      (item: any) => item.id === idCustomer,
    );
    if (!customer) return;
    newPenawaran.value.id_perusahaan = customer.id ?? "";
    newPenawaran.value.nama_perusahaan = customer.nama;
    newPenawaran.value.alamat_perusahaan = customer.alamat;
    newPenawaran.value.pic = customer.pic;
    newPenawaran.value.no_telp = customer.no_telp;
  },
);

onMounted(async () => {
  await customerStore.tarikDataCustomerAct();
  await penawaranStore.tarikDataPenawaranAct();
});

function statusColor(status: string) {
  if (status === "INVOICE") return "warning";
  if (status === "Draft") return "primary";
  if (status === "Ditolak") return "error";
  return "grey";
}

function openDialogTambahPenawaran() {
  data.penawaranAddEdit = "add";
  data.editOriginalCustomerId = "";
  newPenawaran.value = emptyPenawaran();
  data.dialogTambahPenawaran = true;
}

function openDialogEditPenawaran(item: penawaranM) {
  const customer = customerStore.getDataCustomer.find(
    (dataCustomer: any) =>
      dataCustomer.id === item.id_perusahaan ||
      dataCustomer.nama === item.id_perusahaan ||
      dataCustomer.nama === item.nama_perusahaan ||
      dataCustomer.pic === item.pic,
  );

  const penawaran = JSON.parse(JSON.stringify(item)) as penawaranM;
  if (customer?.id) {
    penawaran.id_perusahaan = customer.id;
    penawaran.nama_perusahaan = customer.nama;
  }

  data.penawaranAddEdit = "edit";
  data.editOriginalCustomerId = penawaran.id_perusahaan;
  newPenawaran.value = penawaran;
  data.dialogTambahPenawaran = true;
}

function tambahBarisPenawaran() {
  newPenawaran.value.penawaran_item.push({
    nama: "",
    amount: 0,
    uom: "",
    qty: 1,
    subtotal_item: 0,
  });
}

function hapusBarisPenawaran(index: number) {
  if (newPenawaran.value.penawaran_item.length === 1) {
    return notificationStore.showError("Minimal harus ada 1 baris item");
  }
  newPenawaran.value.penawaran_item.splice(index, 1);
}

async function simpanPenawaranDialog() {
  if (!newPenawaran.value.id_perusahaan) {
    return notificationStore.showError("Client belum dipilih");
  }
  if (
    !newPenawaran.value.tanggal_penawaran ||
    !newPenawaran.value.perihal.trim()
  ) {
    return notificationStore.showError("Tanggal dan perihal wajib diisi");
  }
  if (
    !newPenawaran.value.penawaran_item.length ||
    newPenawaran.value.penawaran_item.some(
      (item) => !item.nama || item.qty <= 0 || item.amount <= 0,
    )
  ) {
    return notificationStore.showError("Setiap item harus dilengkapi");
  }

  newPenawaran.value.penawaran_item.forEach((item) => {
    item.subtotal_item = Number(item.qty) * Number(item.amount);
  });
  newPenawaran.value.subtotal_penawaran = subtotalPenawaran.value;
  newPenawaran.value.grand_total_penawaran = subtotalPenawaran.value;
  newPenawaran.value.terbilang = terbilang(subtotalPenawaran.value);

  if (data.penawaranAddEdit === "add") {
    newPenawaran.value.no_penawaran ||= generateNoPenawaran();
    newPenawaran.value.id_penawaran =
      newPenawaran.value.no_penawaran.replaceAll("/", "-");
    newPenawaran.value.created_at = moment().unix();
    newPenawaran.value.created_by = userStore.getEmail;
    useloadingStore().setLoading(true);
    const result = await setPenawaran(newPenawaran.value);
    if (result !== "ok") {
      notificationStore.showError(result || "Gagal menyimpan penawaran");
      return;
    }

    data.dialogTambahPenawaran = false;
    newPenawaran.value = emptyPenawaran();
    useloadingStore().setLoading(false);
    await penawaranStore.tarikDataPenawaranAct();
    return;
  }

  await penawaranStore.updatePenawaranAct(newPenawaran.value);

  data.dialogTambahPenawaran = false;
  newPenawaran.value = emptyPenawaran();
}

async function hapusPenawaran(item: penawaranM) {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus penawaran ini?",
    { variant: "danger" },
  );
  if (!confirmed) return notificationStore.showError("Penghapusan dibatalkan");
  await penawaranStore.deletePenawaranAct(item);
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("penawaran");
  await penawaranStore.tarikDataPenawaranAct();
  useloadingStore().setLoading(false);
  notificationStore.showSuccess("Data Penawaran berhasil diperbarui");
}
</script>

<style scoped>
.penawaran-link {
  color: rgb(11, 66, 194);
  transition: color 0.2s ease;
}

.gap-2 {
  gap: 8px;
}
</style>