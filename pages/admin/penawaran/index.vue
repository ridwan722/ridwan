<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <v-btn
    variant="text"
    color="grey-darken-3"
    prepend-icon="mdi-arrow-left"
    @click="$router.go(-1)"
    class="text-capitalize font-weight-bold mb-2"
  >
    Kembali
  </v-btn>

  <!-- /// DIALOG TAMBAH / EDIT Penawaran \\\ -->
  <v-dialog v-model="data.dialogTambahPenawaran" max-width="1300" scrollable>
    <v-card class="rounded-xl overflow-hidden elevation-3 border-0">
      <v-card-item class="bg-grey-lighten-4 pa-3 text-center">
        <h4 class="font-weight-bold text-grey-darken-3">
          {{ data.penawaranAddEdit === "add" ? "Create" : "Edit" }} Quotation
        </h4>
        <p class="text-caption text-grey-darken-1 m-0">
          Lengkapi rincian penawaran harga dan item pekerjaan di bawah ini.
        </p>
      </v-card-item>

      <v-card-text class="pa-6">
        <div class="text-subtitle-2 font-weight-bold text-primary mb-3">
          Informasi Utama
        </div>
        <v-row density="comfortable">
          <v-col cols="12" md="4">
            <a-select
              v-model="newPenawaran.id_perusahaan"
              label="Client"
              placeholder="Select"
              item-title="nama"
              item-value="id"
              :items="customerStore.getDataCustomer"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <a-date-picker
              v-model="newPenawaran.tanggal_penawaran"
              label="Quotation Date"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <a-text-field
              v-model="newPenawaran.no_penawaran"
              label="Quotation Ref No"
              disabled
            />
          </v-col>
        </v-row>

        <a-textarea
          v-model="newPenawaran.alamat_perusahaan"
          class="mt-2"
          label="Address"
          disabled
          placeholder="*Auto"
        />

        <a-text-field
          v-model="newPenawaran.pic"
          class="mt-2"
          label="PIC"
          disabled
          placeholder="PIC"
        />

        <a-text-field
          v-model="newPenawaran.no_telp"
          class="mt-2"
          label="Phone Number"
          disabled
          placeholder="+00 0000"
        />

        <v-divider class="my-6 border-opacity-50" />

        <a-textarea
          v-model="newPenawaran.perihal"
          label="Subject"
          placeholder="Quotation Subject"
        />

        <v-divider class="my-6 border-opacity-50" />

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

        <div
          v-for="(item, index) in newPenawaran.penawaran_item"
          :key="index"
          class="bg-grey-lighten-5 rounded-lg pa-4 mb-4 border border-dashed"
        >
          <v-row align="center" density="compact">
            <v-col cols="12" sm="3">
              <a-textarea
                v-model="item.nama"
                label="Description"
                placeholder="description"
              />
            </v-col>
            <v-col cols="10" sm="2">
              <a-field-number v-model="item.qty" label="Qty" placeholder="0" />
            </v-col>
            <v-col cols="10" sm="2">
              <a-select
                :items="['Unit', 'Pcs', 'Kg']"
                v-model="item.uom"
                label="UOM"
                placeholder="Select"
              />
            </v-col>
            <v-col cols="10" sm="2">
              <a-field-number
                v-model="item.amount"
                label="Amount/Pcs"
                placeholder="0"
              />
            </v-col>

            <v-col cols="10" sm="2">
              <a-text-field
                v-model="item.subtotal_item"
                label="Subtotal"
                placeholder="0"
                disabled
              />
            </v-col>
            <v-col cols="1" sm="1" class="text-center">
              <v-btn
                icon="mdi-trash-can-outline"
                size="small"
                variant="text"
                color="error"
                class="mt-5"
                @click="hapusBarisPenawaran(index)"
              />
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-6 border-opacity-50" />

        <div class="text-subtitle-2 font-weight-bold text-primary mb-3">
          Ringkasan Biaya
        </div>

        <v-row>
          <v-col cols="12">
            <v-card
              variant="flat"
              class="bg-blue-grey-lighten-5 rounded-xl pa-4"
            >
              <div
                class="d-flex justify-space-between text-body-2 text-grey-darken-2 mb-1"
              >
                <span>Subtotal</span>
                <span class="font-weight-medium text-grey-darken-3"
                  >Rp {{ rupiah(subtotalPenawaran) }}</span
                >
              </div>
              <v-divider class="my-2" />
              <div class="d-flex justify-space-between align-center">
                <span
                  class="text-subtitle-1 font-weight-bold text-grey-darken-4"
                  >Grand Total</span
                >
                <span class="text-h6 font-weight-black text-primary"
                  >Rp {{ rupiah(subtotalPenawaran) }}</span
                >
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4 bg-grey-lighten-5">
        <v-spacer />
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          class="px-5 text-none rounded-lg"
          @click="data.dialogTambahPenawaran = false"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="px-6 text-none rounded-lg font-weight-bold"
          @click="simpanPenawaranDialog"
        >
          {{
            data.penawaranAddEdit === "add"
              ? "Simpan Penawaran"
              : "Simpan Perubahan"
          }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- /// HEADER & TOOLBAR \\\ -->
  <v-row align="center">
    <v-col cols="12">
      <v-breadcrumbs>
        <v-breadcrumbs-item>
          <span class="font-weight-medium text-h5">Penawaran</span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>
  </v-row>

  <v-card class="border rounded-lg" flat>
    <v-card-title class="pa-3">
      <v-row align="center">
        <v-col cols="12" sm="4">
          <a-text-field
            v-model="data.searchPenawaran"
            placeholder="Cari no. penawaran / customer"
            style="max-width: 280px"
          />
        </v-col>
        <v-col cols="12" sm="3">
          <a-select
            v-model="data.filterStatus"
            placeholder="Semua Status"
            :items="filterStatusOptions"
          />
        </v-col>
        <v-col cols="12" sm="5" class="text-right">
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            class="text-capitalize px-3 ml-2"
            prepend-icon="mdi-plus"
            @click="openDialogTambahPenawaran"
          >
            Create New Quotation
          </v-btn>

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
      </v-row>
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="data.headPenawaran"
      :items="filteredPenawaran"
      :search="data.searchPenawaran"
      density="compact"
      :sort-by="[{ key: 'created_at', order: 'desc' }]"
      :hover="true"
    >
      <template v-slot:item.no="{ index }"> {{ index + 1 }}</template>

      <template v-slot:item.no_penawaran="{ item }">{{
        item.no_penawaran
      }}</template>

      <template v-slot:item.tanggal_penawaran="{ item }">{{
        rubahtanggallengkap(item.tanggal_penawaran)
      }}</template>

      <template v-slot:item.grand_total="{ item }"
        >Rp {{ rupiah(item.grand_total_penawaran) }}</template
      >

      <template v-slot:item.status="{ item }">
        <v-chip size="small" :color="statusColor(item.status)" variant="flat">{{
          item.status
        }}</v-chip>
      </template>

      <template v-slot:item.aksi="{ item }">
        <div class="d-flex justify-center">
          <v-btn
            size="27"
            variant="tonal"
            color="info"
            class="rounded-lg mr-1"
            :to="'/admin/penawaran/' + item.id"
          >
            <v-icon icon="mdi-eye" />
            <v-tooltip activator="parent" location="top"
              >Detail Penawaran</v-tooltip
            >
          </v-btn>

          <v-btn
            size="27"
            variant="tonal"
            color="warning"
            class="rounded-lg mr-1"
            @click="openDialogEditPenawaran(item)"
          >
            <v-icon icon="mdi-pencil-outline" />
            <v-tooltip activator="parent" location="top"
              >Edit Penawaran</v-tooltip
            >
          </v-btn>

          <v-btn
            size="27"
            variant="tonal"
            color="success"
            class="rounded-lg mr-1"
            @click="convertToInvoice(item)"
          >
            <v-icon icon="mdi-file-document-outline" />
            <v-tooltip activator="parent" location="top"
              >Buat Invoice dari Penawaran</v-tooltip
            >
          </v-btn>

          <v-btn
            size="27"
            variant="tonal"
            color="grey"
            class="rounded-lg"
            @click="hapusPenawaran(item)"
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
  filterStatus: "",
  dialogTambahPenawaran: false,
  penawaranAddEdit: "add" as "add" | "edit",
  editOriginalCustomerId: "",
  headPenawaran: [
    { title: "No", value: "no", width: "10px" },
    { title: "Tanggal", value: "tanggal_penawaran", sortable: true },
    { title: "Quotation Ref No", value: "no_penawaran", sortable: true },
    { title: "Perusahaan", value: "nama_perusahaan", sortable: true },
    { title: "Perihal", value: "perihal", sortable: true },
    { title: "Total", value: "grand_total", sortable: true },
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

const filteredPenawaran = computed(() => {
  const dataset = penawaranStore.getDataPenawaran || [];
  if (!data.filterStatus) return dataset;
  return dataset.filter((quo: penawaranM) => quo.status === data.filterStatus);
});

function statusColor(status: string) {
  if (status === "Disetujui") return "success";
  if (status === "Pending") return "warning";
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
    return notificationStore.showError("Customer belum dipilih");
  }
  if (
    !newPenawaran.value.tanggal_penawaran ||
    !newPenawaran.value.perihal.trim() ||
    !newPenawaran.value.no_telp.trim()
  ) {
    return notificationStore.showError(
      "Tanggal, perihal, dan telepon perusahaan wajib diisi",
    );
  }
  if (
    !newPenawaran.value.penawaran_item.length ||
    newPenawaran.value.penawaran_item.some(
      (item) => !item.nama || item.qty <= 0 || item.amount <= 0,
    )
  ) {
    return notificationStore.showError(
      "Setiap item harus memiliki nama, qty, dan harga satuan",
    );
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

    // Memanggil action addPenawaranAct di Store
    await penawaranStore.addPenawaranAct(newPenawaran.value);

    data.dialogTambahPenawaran = false;
    newPenawaran.value = emptyPenawaran();
    return;
  }

  // Mode Edit
  // Memanggil action updatePenawaranAct di Store (1 parameter)
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

  // Memanggil action deletePenawaranAct di Store (Passing seluruh objek item penawaran)
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
