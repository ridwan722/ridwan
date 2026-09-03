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

  <!-- /// DIALOG BUAT INVOICE \\\ -->
  <v-dialog v-model="data.dialogTambahInvoice" max-width="900" scrollable>
    <v-card class="overflow-hidden elevation-3 border-0">
      <v-card-item class="bg-grey-lighten-4 pa-3 text-center">
        <h4 class="font-weight-bold text-grey-darken-3">
          {{ data.invoiceAddEdit === "add" ? "Buat" : "Edit" }} Invoice
          <span class="text-primary">Solusi Nusa Segara</span>
        </h4>
        <p class="text-caption text-grey-darken-1 m-0">
          Lengkapi rincian tagihan dan item pekerjaan di bawah ini.
        </p>
      </v-card-item>

      <v-card-text class="pa-3">
        <div class="text-subtitle-2 font-weight-bold text-primary mb-3">
          Informasi Utama
        </div>
        <v-row density="comfortable">
          <v-col cols="12" sm="6">
            <a-select-new
              v-model="newInvoice.id_customer"
              label="Customer"
              placeholder="Select"
              item-title="nama"
              item-value="id"
              :items="customerStore.getDataCustomer"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <a-date-picker-new
              v-model="newInvoice.tanggal"
              label="Tanggal Invoice"
            />
          </v-col>
        </v-row>
        <a-textarea-new
          v-model="newInvoice.alamat_customer"
          class="mt-2"
          label="Address"
          disabled
          placeholder="*Auto"
        />

        <v-row>
          <v-col>
            <a-text-field-new
              v-model="newInvoice.pic"
              class="mt-2"
              label="PIC"
              disabled
              placeholder="*Auto"
            />
          </v-col>
          <v-col>
            <a-text-field-new
              v-model="newInvoice.no_telp"
              class="mt-2"
              label="No Telp"
              disabled
              placeholder="*Auto"
            />
          </v-col>
        </v-row>
        <v-divider class="my-2 border-opacity-50" />

        <a-textarea-new
          v-model="newInvoice.perihal"
          class="mt-2"
          label="Subject"
          placeholder="*Auto"
        />

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
          <a-text-field-new
            v-model="item.nama"
            label="Deskripsi"
            placeholder="Deskripsi"
          />
          <v-row align="center" density="compact" class="mb-2">
            <v-col cols="6" md="2">
              <a-field-number-new
                v-model="item.qty"
                label="Qty"
                placeholder="0"
              />
            </v-col>
            <v-col cols="6" md="3">
              <a-select-new
                :items="['Unit', 'Pcs', 'Kg']"
                v-model="item.uom"
                label="UOM"
                placeholder="Select"
              />
            </v-col>
            <v-col cols="6" md="3">
              <a-field-number-new
                v-model="item.amount"
                label="Amount/unit"
                placeholder="0"
              />
            </v-col>
            <v-col cols="6" md="3">
              <a-field-number-new
                v-model="item.subtotal_item"
                label="Subtotal"
                placeholder="0"
                disabled
              />
            </v-col>
            <v-col cols="1" class="text-center">
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
                  >Rp {{ rupiah(subtotal_invoice) }}</span
                >
              </div>
              <div
                v-if="newInvoice.pakai_ppn == true"
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
                  >Rp {{ rupiah(grandtotal_invoice) }}</span
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
          size="x-small"
          variant="outlined"
          color="grey-darken-1"
          class="px-5 text-none"
          @click="data.dialogTambahInvoice = false"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          size="x-small"
          class="px-6 text-none font-weight-bold"
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

  <v-row align="center">
    <v-col cols="12">
      <v-breadcrumbs>
        <v-breadcrumbs-item>
          <span class="font-weight-medium text-h5">Invoice</span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>
  </v-row>

  <v-card class="border rounded-lg" flat>
    <v-card-title class="pa-3">
      <v-row align="center">
        <v-col>
          <a-text-field-new
            v-model="data.searchInvoice"
            placeholder="Cari no. invoice / customer"
            style="max-width: 280px"
          />
        </v-col>
        <v-col>
          <a-select-new
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
            Create Invoice
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

      <template v-slot:item.no_inv="{ item }">#{{ item.no_inv }}</template>

      <template v-slot:item.tanggal="{ item }">{{
        rubahtanggallengkap(item.tanggal)
      }}</template>

      <template v-slot:item.grandtotal="{ item }"
        >Rp {{ rupiah(item.grandtotal) }}</template
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
  </v-card>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";
import type { ConfirmationDialog } from "#components";
import type { customerM } from "~/types/customerModel";
import type { invoiceM } from "~/types/invoice";
import { useinvoiceStore } from "~/stores/invoiceStore";
import Index from "../index.vue";

definePageMeta({
  layout: "admin",
});

const router = useRouter();
const customerStore = usecustomerStore();
const invoiceStore = useinvoiceStore();
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
    { title: "PIC", value: "pic", sortable: true },
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
    { title: "Total", value: "grandtotal_invoice", sortable: true },
    { title: "Status", value: "status", sortable: true },
    { title: "Aksi", align: "center" as const, value: "aksi", width: "100px" },
  ],
});

function emptyCustomer(): customerM {
  return {
    nama: "",
    pic: "",
    alamat: "",
    createdAt: 0,
    createdBy: "",
  };
}

const newCustomer = ref<customerM>(emptyCustomer());

function emptyInvoice(): invoiceM {
  return {
    no_inv: "",
    id_customer: "",
    nama_customer: "",
    pic: "",
    alamat_customer: "",
    tanggal: moment().format("YYYY-MM-DD"),
    item_pekerjaan: [
      { nama: "", qty: 1, uom: "Unit", amount: 0, subtotal_item: 0 },
    ],
    pakai_ppn: false,
    subtotal_invoice: 0,
    ppn: 0,
    grandtotal_invoice: 0,
    status: "Draft",
    createdAt: 0,
    createdBy: "",
  };
}

const newInvoice = ref<invoiceM>(emptyInvoice());

const subtotal_invoice = computed(() =>
  newInvoice.value.item_pekerjaan.reduce(
    (total, item) => total + (Number(item.amount) || 0),
    0,
  ),
);
const ppnInvoice = computed(() =>
  newInvoice.value.pakai_ppn ? Math.round(subtotal_invoice.value * 0.11) : 0,
);
const grandtotal_invoice = computed(
  () => subtotal_invoice.value + ppnInvoice.value,
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
    newInvoice.value.pic = customer.pic;
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
    sessionStorage.removeItem("invoice");
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

function openDialogEditInvoice(item: invoiceM) {
  const customer = customerStore.getDataCustomer.find(
    (dataCustomer) =>
      dataCustomer.id === item.id_customer ||
      dataCustomer.nama === item.id_customer ||
      dataCustomer.nama === item.nama_customer ||
      dataCustomer.pic === item.pic,
  );

  const invoice = JSON.parse(JSON.stringify(item)) as invoiceM;
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
    deskripsi_pekerjaan: "",
    amount: 0,
    uom: "",
    qty: 0,
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
      (item) => !item.nama || !item.amount,
    )
  ) {
    return notificationStore.showError(
      "Setiap baris item harus punya description dan amount",
    );
  }

  newInvoice.value.subtotal_invoice = subtotal_invoice.value;
  newInvoice.value.ppn = ppnInvoice.value;
  newInvoice.value.grandtotal_invoice = grandtotal_invoice.value;
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

function openDialogEditCustomer(item: customerM) {
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
  sessionStorage.removeItem("invoice");
  await invoiceStore.tarikDataInvoiceAct();
  useloadingStore().setLoading(false);
  notificationStore.showSuccess("Data berhasil diperbarui");
}
</script>
