<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <!-- /// DIALOG TAMBAH / EDIT Penawaran \\\ -->
  <v-dialog v-model="data.dialogTambahPenawaran" max-width="900" scrollable>
    <v-card class="rounded-xl overflow-hidden elevation-3 border-0">
      <v-card-item class="bg-grey-lighten-4 pa-3 text-center">
        <h4 class="font-weight-bold text-grey-darken-3">
          {{ data.penawaranAddEdit === "add" ? "Buat" : "Edit" }} Penawaran
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
              v-model="newPenawaran.id_customer"
              label="Customer"
              placeholder="Pilih Customer"
              item-title="nama"
              item-value="id"
              :items="customerStore.getDataCustomer"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <a-date-picker
              v-model="newPenawaran.tanggal"
              label="Tanggal Penawaran"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <a-date-picker
              v-model="newPenawaran.tgl_berlaku"
              label="Berlaku Sampai"
            />
          </v-col>
        </v-row>

        <a-textarea
          v-model="newPenawaran.alamat_customer"
          class="mt-2"
          label="Alamat Customer"
          disabled
          placeholder="Alamat customer terisi otomatis"
        />

        <a-text-field
          v-model="newPenawaran.pic"
          class="mt-2"
          label="PIC"
          disabled
          placeholder="PIC"
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
          v-for="(item, index) in newPenawaran.item_pekerjaan"
          :key="index"
          class="bg-grey-lighten-5 rounded-lg pa-4 mb-4 border border-dashed"
        >
          <v-row align="center" density="compact">
            <v-col cols="12" sm="5">
              <a-textarea
                v-model="item.deskripsi_pekerjaan"
                label="Deskripsi Pekerjaan"
                placeholder="Deskripsi barang/jasa"
              />
            </v-col>
            <v-col cols="10" sm="2">
              <a-field-number v-model="item.qty" label="Qty" placeholder="0" />
            </v-col>
            <v-col cols="10" sm="2">
              <a-text-field
                v-model="item.uom"
                label="Satuan"
                placeholder="Pcs/Unit"
              />
            </v-col>
            <v-col cols="10" sm="2">
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
                @click="hapusBarisPenawaran(index)"
              />
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-6 border-opacity-50" />

        <div class="text-subtitle-2 font-weight-bold text-primary mb-3">
          Catatan & Biaya
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <a-textarea
              v-model="newPenawaran.catatan"
              label="Syarat & Ketentuan / Catatan"
              placeholder="Contoh: Harga belum termasuk biaya pengiriman..."
              rows="4"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-card
              variant="flat"
              class="bg-blue-grey-lighten-5 rounded-xl pa-4"
            >
              <div
                class="d-flex align-center justify-space-between px-3 py-1 bg-grey-lighten-5 rounded-lg border mb-3"
              >
                <span class="text-body-2 font-weight-medium text-grey-darken-2"
                  >Sertakan PPN 11%</span
                >
                <v-switch
                  v-model="newPenawaran.pakai_ppn"
                  color="primary"
                  hide-details
                  density="compact"
                />
              </div>
              <div
                class="d-flex justify-space-between text-body-2 text-grey-darken-2 mb-1"
              >
                <span>Subtotal</span>
                <span class="font-weight-medium text-grey-darken-3"
                  >Rp {{ rupiah(subtotalPenawaran) }}</span
                >
              </div>
              <div
                class="d-flex justify-space-between text-body-2 text-grey-darken-2 mb-2"
              >
                <span>PPN 11%</span>
                <span class="font-weight-medium text-grey-darken-3"
                  >Rp {{ rupiah(ppnPenawaran) }}</span
                >
              </div>
              <v-divider class="my-2" />
              <div class="d-flex justify-space-between align-center">
                <span
                  class="text-subtitle-1 font-weight-bold text-grey-darken-4"
                  >Grand Total</span
                >
                <span class="text-h6 font-weight-black text-primary"
                  >Rp {{ rupiah(grandtotalPenawaran) }}</span
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
            Tambah Penawaran
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
      :sort-by="[{ key: 'createdAt', order: 'desc' }]"
      :hover="true"
    >
      <template v-slot:item.no="{ index }"> {{ index + 1 }}</template>

      <template v-slot:item.no_penawaran="{ item }">#{{ item.no_penawaran || item.nomor }}</template>

      <template v-slot:item.tanggal="{ item }">{{
        rubahtanggallengkap(item.tanggal)
      }}</template>

      <template v-slot:item.tgl_berlaku="{ item }">{{
        item.tgl_berlaku ? rubahtanggallengkap(item.tgl_berlaku) : '-'
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
            @click="router.push(`/admin/penawaran/${item.id}`)"
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
            v-if="item.status === 'Draft' || item.status === 'Pending'"
            @click="openDialogEditPenawaran(item)"
          >
            <v-icon icon="mdi-pencil-outline" />
            <v-tooltip activator="parent" location="top"
              >Edit Penawaran</v-tooltip
            >
          </v-btn>

          <!-- Konversi Penawaran ke Invoice -->
          <v-btn
            size="27"
            variant="tonal"
            color="success"
            class="rounded-lg mr-1"
            v-if="item.status === 'Disetujui'"
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
            v-if="item.status === 'Draft' || item.status === 'Pending'"
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
  null
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
    { title: "Tanggal", value: "tanggal", sortable: true },
    { title: "No. Penawaran", value: "no_penawaran", sortable: true },
    { title: "Customer", value: "nama_customer", sortable: true },
    { title: "Berlaku s/d", value: "tgl_berlaku", sortable: true },
    { title: "Total", value: "grandtotal", sortable: true },
    { title: "Status", value: "status", sortable: true },
    { title: "Aksi", align: "center" as const, value: "aksi", width: "120px" },
  ],
});

function emptyPenawaran(): penawaranM {
  const generatedNo = `QUO-${moment().format("YYYYMMDDHHmmss")}`;
  return {
    
  } as penawaranM;
}

const newPenawaran = ref<penawaranM>(emptyPenawaran());

const subtotalPenawaran = computed(() =>
  (newPenawaran.value.item_pekerjaan || []).reduce(
    (total, item) => total + (Number(item.amount) || 0),
    0
  )
);
const ppnPenawaran = computed(() =>
  newPenawaran.value.pakai_ppn ? Math.round(subtotalPenawaran.value * 0.11) : 0
);
const grandtotalPenawaran = computed(
  () => subtotalPenawaran.value + ppnPenawaran.value
);

watch(
  () => newPenawaran.value.id_customer,
  (idCustomer) => {
    if (
      data.penawaranAddEdit === "edit" &&
      idCustomer === data.editOriginalCustomerId
    ) {
      return;
    }
    const customer = customerStore.getDataCustomer.find(
      (item: any) => item.id === idCustomer
    );
    if (!customer) return;
    newPenawaran.value.id_customer = customer.id ?? "";
    newPenawaran.value.nama_customer = customer.nama;
    newPenawaran.value.alamat_customer = customer.alamat;
    newPenawaran.value.pic = customer.pic;
  }
);

onMounted(async () => {
  await customerStore.tarikDataCustomerAct();
  await penawaranStore.tarikDataPenawaranAct();
});

const filteredPenawaran = computed(() => {
  const dataset = penawaranStore.getDataPenawaran || [];
  if (!data.filterStatus) return dataset;
  return dataset.filter(
    (quo: penawaranM) => quo.status === data.filterStatus
  );
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
      dataCustomer.id === item.id_customer ||
      dataCustomer.nama === item.id_customer ||
      dataCustomer.nama === item.nama_customer ||
      dataCustomer.pic === item.pic
  );

  const penawaran = JSON.parse(JSON.stringify(item)) as penawaranM;
  if (customer?.id) {
    penawaran.id_customer = customer.id;
    penawaran.nama_customer = customer.nama;
  }

  data.penawaranAddEdit = "edit";
  data.editOriginalCustomerId = penawaran.id_customer;
  newPenawaran.value = penawaran;
  data.dialogTambahPenawaran = true;
}

function tambahBarisPenawaran() {
  if (!newPenawaran.value.item_pekerjaan) {
    newPenawaran.value.item_pekerjaan = [];
  }
  newPenawaran.value.item_pekerjaan.push({
    deskripsi_pekerjaan: "",
    amount: 0,
    uom: "",
    qty: 0,
  });
}

function hapusBarisPenawaran(index: number) {
  if (newPenawaran.value.item_pekerjaan.length === 1) {
    return notificationStore.showError("Minimal harus ada 1 baris item");
  }
  newPenawaran.value.item_pekerjaan.splice(index, 1);
}

async function simpanPenawaranDialog() {
  if (!newPenawaran.value.id_customer) {
    return notificationStore.showError("Customer belum dipilih");
  }
  if (
    !newPenawaran.value.item_pekerjaan ||
    newPenawaran.value.item_pekerjaan.some(
      (item) => !item.deskripsi_pekerjaan || !item.amount
    )
  ) {
    return notificationStore.showError(
      "Setiap baris item harus punya deskripsi dan amount"
    );
  }

  // Sinkronkan items jika tipe data mewajibkannya
  if (!newPenawaran.value.items) {
    newPenawaran.value.items = [];
  }

  // Isi nomor default jika kosong
  if (!newPenawaran.value.nomor) {
    newPenawaran.value.nomor = newPenawaran.value.no_penawaran || `QUO-${moment().format("YYYYMMDDHHmmss")}`;
  }

  newPenawaran.value.subtotal = subtotalPenawaran.value;
  newPenawaran.value.ppn = ppnPenawaran.value;
  newPenawaran.value.grandtotal = grandtotalPenawaran.value;

  if (data.penawaranAddEdit === "add") {
    newPenawaran.value.createdAt = moment().unix();
    newPenawaran.value.createdBy = userStore.getEmail;

    // Memanggil action addPenawaranAct di Store
    await penawaranStore.addPenawaranAct(newPenawaran.value);

    data.dialogTambahPenawaran = false;
    newPenawaran.value = emptyPenawaran();
    return;
  }

  // Mode Edit
  newPenawaran.value.updatedAt = moment().unix();
  newPenawaran.value.updatedBy = userStore.getEmail;
  
  // Memanggil action updatePenawaranAct di Store (1 parameter)
  await penawaranStore.updatePenawaranAct(newPenawaran.value);

  data.dialogTambahPenawaran = false;
  newPenawaran.value = emptyPenawaran();
}

async function convertToInvoice(item: penawaranM) {
  const confirmed = await confirmationDialog.value?.show(
    "Konversi ke Invoice",
    `Apakah Anda ingin membuat Invoice baru berdasarkan penawaran #${item.no_penawaran || item.nomor}?`,
    { variant: "info" }
  );
  if (!confirmed) return;

  const invoicePayload = {
    id_customer: item.id_customer,
    nama_customer: item.nama_customer,
    pic: item.pic,
    alamat_customer: item.alamat_customer,
    tanggal: moment().format("YYYY-MM-DD"),
    item_pekerjaan: [...(item.item_pekerjaan || [])],
    pakai_ppn: item.pakai_ppn,
    subtotal: item.subtotal,
    ppn: item.ppn,
    grandtotal: item.grandtotal,
    status: "Draft",
    createdAt: moment().unix(),
    createdBy: userStore.getEmail,
  };

  const newInv = await invoiceStore.createInvoiceAct(invoicePayload);
  if (newInv?.id) {
    notificationStore.showSuccess("Invoice berhasil dibuat dari Penawaran");
    router.push(`/admin/invoice/${newInv.id}`);
  }
}

async function hapusPenawaran(item: penawaranM) {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus penawaran ini?",
    { variant: "danger" }
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