<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <!-- /// DIALOG TAMBAH INVOICE \\\ -->
  <v-dialog v-model="data.dialogTambahInvoice" max-width="900" scrollable>
    <v-card class="rounded-xl overflow-hidden elevation-3 border-0">
      <v-card-item class="bg-grey-lighten-4 pa-3 text-center">
        <h4 class="font-weight-bold text-grey-darken-3">
          {{ data.invoiceAddEdit === "add" ? "Buat" : "Edit" }} Invoice
          <span class="text-primary">Solusi Nusa Segara</span>
        </h4>
        <p class="text-caption text-grey-darken-1 m-0">
          Lengkapi rincian tagihan dan item pekerjaan di bawah ini.
        </p>
      </v-card-item>

      <v-card-text class="pa-6">
        <div class="text-subtitle-2 font-weight-bold text-primary mb-3">
          Informasi Utama
        </div>
        <v-row density="comfortable">
          <v-col cols="12" md="8">
            <a-select
              v-model="newInvoice.id_customer"
              label="Customer"
              placeholder="Pilih Customer"
              item-title="nama"
              item-value="id"
              :items="customerStore.getDataCustomer"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <a-date-picker
              v-model="newInvoice.tanggal"
              label="Tanggal Invoice"
            />
          </v-col>
        </v-row>
        <a-textarea
          v-model="newInvoice.alamat_customer"
          class="mt-2"
          label="Alamat Customer"
          placeholder="Alamat customer terisi otomatis, bisa diedit"
        />
        <v-divider class="my-6 border-opacity-50" />

        <div class="d-flex align-center justify-space-between mb-3">
          <span class="text-subtitle-2 font-weight-bold text-primary">
            Rincian Item & Layanan
          </span>
          <v-btn
            size="small"
            variant="tonal"
            color="primary"
            prepend-icon="mdi-plus"
            class="text-none font-weight-semibold rounded-lg"
            @click="tambahBarisInvoice"
          >
            Tambah Baris
          </v-btn>
        </div>

        <div
          v-for="(item, index) in newInvoice.item_pekerjaan"
          :key="index"
          class="bg-grey-lighten-5 rounded-lg pa-4 mb-4 border border-dashed"
        >
          <v-row align="center" density="compact" class="mb-2">
            <v-col cols="12" sm="7">
              <a-textarea
                v-model="item.description_pekerjaan"
                label="Pekerjaan"
                placeholder="Deskripsi pekerjaan"
              />
            </v-col>
            <v-col cols="10" sm="4">
              <a-field-number
                v-model="item.amount"
                label="Jumlah (Amount)"
                placeholder="0"
              />
            </v-col>
            <v-col cols="2" sm="1" class="text-center">
              <v-btn
                icon="mdi-trash-can-outline"
                size="small"
                variant="text"
                color="error"
                class="mt-5"
                @click="hapusBarisInvoice(index)"
              />
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-6 border-opacity-50" />

        <div class="text-subtitle-2 font-weight-bold text-primary mb-3">
          Rincian Biaya
        </div>

        <v-card
          variant="flat"
          class="bg-blue-grey-lighten-5 rounded-xl pa-4 mt-4"
        >
          <v-row justify="end" align="center">
            <v-col cols="12" md="6">
              <div
                class="d-flex align-center justify-space-between px-3 py-1 bg-grey-lighten-5 rounded-lg border"
              >
                <span class="text-body-2 font-weight-medium text-grey-darken-2"
                  >Sertakan PPN 11%</span
                >
                <v-switch
                  v-model="newInvoice.pakai_ppn"
                  color="primary"
                  hide-details
                  density="compact"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div
                class="d-flex justify-space-between text-body-2 text-grey-darken-2 mb-1"
              >
                <span>Subtotal</span>
                <span class="font-weight-medium text-grey-darken-3"
                  >Rp {{ rupiah(subtotalInvoice) }}</span
                >
              </div>
              <div
                class="d-flex justify-space-between text-body-2 text-grey-darken-2 mb-2"
              >
                <span>PPN 11%</span>
                <span class="font-weight-medium text-grey-darken-3"
                  >Rp {{ rupiah(ppnInvoice) }}</span
                >
              </div>
              <v-divider class="my-2" />
              <div class="d-flex justify-space-between align-center">
                <span
                  class="text-subtitle-1 font-weight-bold text-grey-darken-4"
                  >Grand Total</span
                >
                <span class="text-h6 font-weight-black text-primary"
                  >Rp {{ rupiah(grandtotalInvoice) }}</span
                >
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4 bg-grey-lighten-5">
        <v-spacer />
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          class="px-5 text-none rounded-lg"
          @click="data.dialogTambahInvoice = false"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="px-6 text-none rounded-lg font-weight-bold"
          @click="simpanInvoiceDialog"
        >
          {{
            data.invoiceAddEdit === "add"
              ? "Simpan Invoice"
              : "Simpan Perubahan"
          }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- /// DIALOG TAMBAH CUTOMER \\\ -->
  <v-dialog
    v-model="data.dialogCustomer"
    :width="$vuetify.display.mdAndUp ? '380px' : '90%'"
  >
    <v-card class="rounded-lg">
      <v-card-title
        class="px-4 text-subtitle-1 font-weight-bold bg-primary pa-3"
      >
        {{
          data.customerAddEdit === "add" ? "TAMBAH CUSTOMER" : "EDIT CUSTOMER"
        }}
      </v-card-title>

      <v-card-text>
        <a-text-field
          v-model="newCustomer.nama"
          label="Nama Customer"
          placeholder="Nama Customer"
        />
        <a-textarea
          v-model="newCustomer.alamat"
          label="Alamat"
          placeholder="Alamat Customer"
        />
      </v-card-text>

      <v-card-actions class="pa-3 bg-grey-lighten-4">
        <v-btn
          variant="flat"
          color="grey-darken-2"
          @click="data.dialogCustomer = false"
          class="text-capitalize px-3"
          size="small"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          @click="simpanCustomer"
          variant="flat"
          class="text-capitalize px-3"
          size="small"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-row align="center">
    <v-col cols="12">
      <v-breadcrumbs>
        <v-breadcrumbs-item>
          <span class="font-weight-medium text-h5">Invoice Solusi Nusa Segara</span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>
  </v-row>

  <v-card class="border rounded-lg" flat>
    <v-tabs v-model="data.tab" color="primary" class="w-100">
      <v-tab value="invoice">Invoice</v-tab>
      <v-tab value="customer">Customer</v-tab>
    </v-tabs>

    <v-divider />

    <v-window v-model="data.tab">
      <v-window-item value="invoice">
        <v-card-title class="pa-3">
          <v-row align="center">
            <v-col>
              <a-text-field
                v-model="data.searchInvoice"
                placeholder="Cari no. invoice / customer"
                style="max-width: 280px"
              />
            </v-col>
            <v-col>
              <a-select
                v-model="data.filterStatus"
                label=""
                placeholder="Semua Status"
                :items="filterStatusOptions"
              />
            </v-col>
            <v-col class="text-right">
              <v-btn
                color="primary"
                variant="flat"
                size="small"
                class="text-capitalize px-3 ml-2"
                prepend-icon="mdi-plus"
                @click="openDialogTambahInvoice"
              >
                Tambah Invoice
              </v-btn>

              <v-btn
                color="green"
                variant="flat"
                size="small"
                class="text-capitalize px-3 ml-2"
                prepend-icon="mdi-database-export"
                @click="getallinvoice()"
              >
                Get All Invoice
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
          :headers="data.headInvoice"
          :items="filteredInvoice"
          :search="data.searchInvoice"
          density="compact"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          :hover="true"
        >
          <template v-slot:item.no="{ index }"> {{ index + 1 }}</template>

          <template v-slot:item.no_inv="{ item }"
            >#{{ item.no_inv_aresa }}</template
          >

          <template v-slot:item.tanggal="{ item }">{{
            rubahtanggallengkap(item.tanggal)
          }}</template>

          <template v-slot:item.grandtotal="{ item }"
            >Rp {{ rupiah(item.grandtotal) }}</template
          >

          <template v-slot:item.status="{ item }">
            <v-chip
              size="small"
              :color="statusColor(item.status)"
              variant="flat"
              >{{ item.status }}</v-chip
            >
          </template>

          <template v-slot:item.aksi="{ item }">
            <div class="d-flex justify-center">
              <v-btn
                size="27"
                variant="tonal"
                color="info"
                class="rounded-lg mr-1"
                @click="router.push(`/admin/invoice/${item.id}`)"
              >
                <v-icon icon="mdi-eye" />
                <v-tooltip activator="parent" location="top"
                  >Detail Invoice</v-tooltip
                >
              </v-btn>
              <v-btn
                size="27"
                variant="tonal"
                color="warning"
                class="rounded-lg mr-1"
                v-if="item.status == 'Draft'"
                @click="openDialogEditInvoice(item)"
              >
                <v-icon icon="mdi-pencil-outline" />
                <v-tooltip activator="parent" location="top"
                  >Edit Invoice</v-tooltip
                >
              </v-btn>
              <v-btn
                size="27"
                variant="tonal"
                color="grey"
                class="rounded-lg"
                v-if="item.status == 'Draft'"
                @click="hapusInvoice(item.id!)"
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
                icon="mdi-receipt-text-outline"
              />
              <div class="text-body-1">Belum ada data Invoice</div>
            </div>
          </template>
        </v-data-table>
      </v-window-item>

      <v-window-item value="customer">
        <v-card-title class="pa-3">
          <v-row align="center">
            <v-col cols="12" sm="8">
              <a-text-field
                v-model="data.searchCustomer"
                placeholder="Cari nama customer"
                style="max-width: 280px"
              />
            </v-col>
            <v-col cols="12" sm="4" class="text-right">
              <v-btn
                color="primary"
                @click="openDialogAddCustomer"
                variant="flat"
                size="small"
                class="text-capitalize px-3"
                prepend-icon="mdi-plus"
              >
                Tambah Customer
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-divider />

        <v-data-table
          :headers="data.headCustomer"
          :items="customerStore.getDataCustomer"
          :search="data.searchCustomer"
          density="compact"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          :hover="true"
        >
          <template v-slot:item.aksi="{ item }">
            <div class="d-flex justify-center">
              <v-btn
                size="27"
                variant="tonal"
                color="info"
                class="rounded-lg mr-1"
                @click="openDialogEditCustomer(item)"
              >
                <v-icon icon="mdi-pencil-outline" />
                <v-tooltip activator="parent" location="top">Edit</v-tooltip>
              </v-btn>
              <v-btn
                size="27"
                variant="tonal"
                color="error"
                class="rounded-lg"
                @click="hapusCustomer(item.id!)"
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
                icon="mdi-account-outline"
              />
              <div class="text-body-1">Belum ada data Customer</div>
            </div>
          </template>
        </v-data-table>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";
import type { ConfirmationDialog } from "#components";
import type { customerAresaDigitalM } from "~/types/customerAresaDigitalModel";
import type { invoiceAresaDigitalM } from "~/types/invoiceAresaDigitalModel";
import { useCustomerAresaDigitalStore } from "~/stores/customerAresaDigitalStore";
import { useInvoiceAresaDigitalStore } from "~/stores/invoiceAresaDigitalStore";
import Index from "../index.vue";

definePageMeta({
  layout: "admin",
});

const router = useRouter();
const customerStore = useCustomerAresaDigitalStore();
const invoiceStore = useInvoiceAresaDigitalStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

const filterStatusOptions = [
  { label: "Semua Status", value: "" },
  { label: "Draft", value: "Draft" },
  { label: "Terkirim", value: "Terkirim" },
  { label: "Lunas", value: "Lunas" },
];

const data = reactive({
  tab: "invoice",
  searchCustomer: "",
  dialogCustomer: false,
  dialogTambahInvoice: false,
  invoiceAddEdit: "add" as "add" | "edit",
  editOriginalCustomerId: "",
  customerAddEdit: "add" as "add" | "edit",
  headCustomer: [
    { title: "Nama Customer", value: "nama", sortable: true },
    { title: "Alamat", value: "alamat", sortable: true },
    { title: "Aksi", align: "center" as const, value: "aksi", width: "100px" },
  ],
  searchInvoice: "",
  filterStatus: "",
  showAllInvoice: false,
  headInvoice: [
    { title: "No", value: "no", width: "10px" },
    { title: "Tanggal", value: "tanggal", sortable: true },
    { title: "No. Invoice", value: "no_inv", sortable: true },
    { title: "Customer", value: "nama_customer", sortable: true },
    { title: "Total", value: "grandtotal", sortable: true },
    { title: "Status", value: "status", sortable: true },
    { title: "Aksi", align: "center" as const, value: "aksi", width: "100px" },
  ],
});

function emptyCustomer(): customerAresaDigitalM {
  return {
    nama: "",
    alamat: "",
    createdAt: 0,
    createdBy: "",
  };
}

const newCustomer = ref<customerAresaDigitalM>(emptyCustomer());

function emptyInvoice(): invoiceAresaDigitalM {
  return {
    no_inv_aresa: "",
    id_customer: "",
    nama_customer: "",
    alamat_customer: "",
    tanggal: moment().format("YYYY-MM-DD"),
    item_pekerjaan: [{ description_pekerjaan: "", amount: 0 }],
    pakai_ppn: true,
    subtotal: 0,
    ppn: 0,
    grandtotal: 0,
    status: "Draft",
    createdAt: 0,
    createdBy: "",
  };
}

const newInvoice = ref<invoiceAresaDigitalM>(emptyInvoice());

const subtotalInvoice = computed(() =>
  newInvoice.value.item_pekerjaan.reduce(
    (total, item) => total + (Number(item.amount) || 0),
    0,
  ),
);
const ppnInvoice = computed(() =>
  newInvoice.value.pakai_ppn ? Math.round(subtotalInvoice.value * 0.11) : 0,
);
const grandtotalInvoice = computed(
  () => subtotalInvoice.value + ppnInvoice.value,
);

watch(
  () => newInvoice.value.id_customer,
  (idCustomer) => {
    if (
      data.invoiceAddEdit === "edit" &&
      idCustomer === data.editOriginalCustomerId
    ) {
      return;
    }
    const customer = customerStore.getDataCustomer.find(
      (item) => item.id === idCustomer,
    );
    if (!customer) return;
    newInvoice.value.id_customer = customer.id ?? "";
    newInvoice.value.nama_customer = customer.nama;
    newInvoice.value.alamat_customer = customer.alamat;
  },
);

onMounted(async () => {
  await customerStore.tarikDataCustomerAct();
  await invoiceStore.tarikDataInvoiceAct();
});

const filteredInvoice = computed(() => {
  if (!data.showAllInvoice) {
    return invoiceStore.getDataInvoice.filter(
      (invoice) => invoice.status === "Draft",
    );
  }
  if (!data.filterStatus) return invoiceStore.getDataInvoice;
  return invoiceStore.getDataInvoice.filter(
    (inv) => inv.status === data.filterStatus,
  );
});

async function getallinvoice() {
  useloadingStore().setLoading(true);
  try {
    data.filterStatus = "";
    sessionStorage.removeItem("invoice_aresa_digital");
    await invoiceStore.tarikDataInvoiceAct();
    data.showAllInvoice = true;
    notificationStore.showSuccess("Semua invoice berhasil dimuat");
  } catch (error) {
    console.error("Gagal memuat semua invoice:", error);
    notificationStore.showError("Gagal memuat semua invoice");
  } finally {
    useloadingStore().setLoading(false);
  }
}

function statusColor(status: string) {
  if (status === "Selesai") return "success";
  if (status === "Dikirim") return "info";
  return "grey";
}

function openDialogTambahInvoice() {
  data.invoiceAddEdit = "add";
  data.editOriginalCustomerId = "";
  newInvoice.value = emptyInvoice();
  data.dialogTambahInvoice = true;
}

function openDialogEditInvoice(item: invoiceAresaDigitalM) {
  const customer = customerStore.getDataCustomer.find(
    (dataCustomer) =>
      dataCustomer.id === item.id_customer ||
      dataCustomer.nama === item.id_customer ||
      dataCustomer.nama === item.nama_customer,
  );

  const invoice = JSON.parse(JSON.stringify(item)) as invoiceAresaDigitalM;
  if (customer?.id) {
    invoice.id_customer = customer.id;
    invoice.nama_customer = customer.nama;
  }

  data.invoiceAddEdit = "edit";
  data.editOriginalCustomerId = invoice.id_customer;
  newInvoice.value = invoice;
  data.dialogTambahInvoice = true;
}

function tambahBarisInvoice() {
  newInvoice.value.item_pekerjaan.push({
    description_pekerjaan: "",
    amount: 0,
  });
}

function hapusBarisInvoice(index: number) {
  if (newInvoice.value.item_pekerjaan.length === 1) {
    return notificationStore.showError("Minimal harus ada 1 baris item");
  }
  newInvoice.value.item_pekerjaan.splice(index, 1);
}

async function simpanInvoiceDialog() {
  if (!newInvoice.value.id_customer) {
    return notificationStore.showError("Customer belum dipilih");
  }
  if (
    newInvoice.value.item_pekerjaan.some(
      (item) => !item.description_pekerjaan || !item.amount,
    )
  ) {
    return notificationStore.showError(
      "Setiap baris item harus punya description dan amount",
    );
  }

  newInvoice.value.subtotal = subtotalInvoice.value;
  newInvoice.value.ppn = ppnInvoice.value;
  newInvoice.value.grandtotal = grandtotalInvoice.value;
  if (data.invoiceAddEdit === "add") {
    newInvoice.value.createdAt = moment().unix();
    newInvoice.value.createdBy = userStore.getEmail;

    const result = await invoiceStore.createInvoiceAct(newInvoice.value);
    if (!result) return;

    data.dialogTambahInvoice = false;
    newInvoice.value = emptyInvoice();
    await router.push(`/admin/invoice/${result.id}`);
    return;
  }

  if (!newInvoice.value.id) {
    return notificationStore.showError("ID invoice tidak ditemukan");
  }

  newInvoice.value.updatedAt = moment().unix();
  newInvoice.value.updatedBy = userStore.getEmail;
  const updated = await invoiceStore.updateInvoiceAct(
    newInvoice.value.id,
    newInvoice.value,
  );
  if (!updated) return;

  await invoiceStore.tarikDataInvoiceAct();
  data.dialogTambahInvoice = false;
  newInvoice.value = emptyInvoice();
}

async function hapusInvoice(id: string) {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus invoice ini?",
    { variant: "danger" },
  );
  if (!confirmed) return notificationStore.showError("Penghapusan dibatalkan");
  await invoiceStore.deleteInvoiceAct(id);
}

function openDialogAddCustomer() {
  data.customerAddEdit = "add";
  newCustomer.value = emptyCustomer();
  data.dialogCustomer = true;
}

function openDialogEditCustomer(item: customerAresaDigitalM) {
  data.customerAddEdit = "edit";
  newCustomer.value = { ...item };
  data.dialogCustomer = true;
}

async function simpanCustomer() {
  if (!newCustomer.value.nama) {
    return notificationStore.showError("Nama customer tidak boleh kosong");
  }
  if (!newCustomer.value.alamat) {
    return notificationStore.showError("Alamat customer tidak boleh kosong");
  }

  if (data.customerAddEdit === "add") {
    newCustomer.value.createdAt = moment().unix();
    newCustomer.value.createdBy = userStore.getEmail;
    await customerStore.addCustomerAct(newCustomer.value);
  } else {
    newCustomer.value.updatedAt = moment().unix();
    newCustomer.value.updatedBy = userStore.getEmail;
    await customerStore.updateCustomerAct(newCustomer.value);
  }
  data.dialogCustomer = false;
}

async function hapusCustomer(id: string) {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus customer ini?",
    { variant: "danger" },
  );
  if (!confirmed) return notificationStore.showError("Penghapusan dibatalkan");
  await customerStore.deleteCustomerAct(id);
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("invoice_aresa_digital");
  await invoiceStore.tarikDataInvoiceAct();
  useloadingStore().setLoading(false);
  notificationStore.showSuccess("Data berhasil diperbarui");
}
</script>
