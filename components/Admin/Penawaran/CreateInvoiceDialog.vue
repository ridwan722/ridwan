<template>
  <v-dialog :model-value="modelValue" max-width="900" scrollable @update:model-value="emit('update:modelValue', $event)">
    <v-card class="rounded-xl overflow-hidden">
      <v-card-item class="bg-primary pa-5">
        <v-card-title class="text-white font-weight-bold">Buat Invoice</v-card-title>
        <v-card-subtitle class="text-white">Data invoice diambil dari penawaran terpilih.</v-card-subtitle>
      </v-card-item>

      <v-card-text class="pa-6">
        <div class="text-subtitle-2 font-weight-bold text-primary mb-3">Informasi Customer</div>
        <v-row density="comfortable">
          <v-col cols="12" md="6">
            <a-text-field v-model="form.nama_customer" label="Nama Customer" disabled />
          </v-col>
          <v-col cols="12" md="6">
            <a-text-field v-model="form.pic" label="PIC / Attention" />
          </v-col>
          <v-col cols="12">
            <a-textarea v-model="form.alamat_customer" label="Alamat Customer" />
          </v-col>
          <v-col cols="12" md="6">
            <a-date-picker v-model="form.tanggal" label="Tanggal Invoice" />
          </v-col>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-switch v-model="form.pakai_ppn" color="primary" label="Tambahkan PPN 11%" hide-details />
          </v-col>
        </v-row>

        <v-divider class="my-5" />

        <div class="d-flex align-center justify-space-between mb-3">
          <span class="text-subtitle-2 font-weight-bold text-primary">Item Invoice</span>
          <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-plus" @click="addItem">
            Tambah Item
          </v-btn>
        </div>

        <v-card
          v-for="(item, index) in form.item_pekerjaan"
          :key="index"
          variant="outlined"
          class="rounded-lg pa-3 mb-3"
        >
          <v-row align="center" density="compact">
            <v-col cols="12" md="5"><a-text-field v-model="item.nama" label="Nama Item" /></v-col>
            <v-col cols="4" md="2"><a-field-number v-model="item.qty" label="Qty" /></v-col>
            <v-col cols="4" md="2"><a-text-field v-model="item.uom" label="Satuan" /></v-col>
            <v-col cols="4" md="2"><a-field-number v-model="item.amount" label="Harga" /></v-col>
            <v-col cols="12" md="1" class="text-center">
              <v-btn icon="mdi-trash-can-outline" color="error" variant="text" size="small" @click="removeItem(index)" />
            </v-col>
          </v-row>
          <div class="text-right text-caption font-weight-bold">
            Subtotal: Rp {{ rupiah(itemSubtotal(item)) }}
          </div>
        </v-card>

        <v-card variant="flat" class="bg-blue-grey-lighten-5 rounded-xl pa-4 mt-5">
          <div class="d-flex justify-space-between mb-2"><span>Subtotal</span><strong>Rp {{ rupiah(subtotal) }}</strong></div>
          <div class="d-flex justify-space-between mb-2"><span>PPN 11%</span><strong>Rp {{ rupiah(ppn) }}</strong></div>
          <v-divider class="my-2" />
          <div class="d-flex justify-space-between text-h6 text-primary"><span>Grand Total</span><strong>Rp {{ rupiah(grandTotal) }}</strong></div>
        </v-card>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4 bg-grey-lighten-5">
        <v-spacer />
        <v-btn variant="outlined" @click="emit('update:modelValue', false)">Batal</v-btn>
        <v-btn color="primary" :loading="saving" @click="save">Simpan Invoice</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import moment from "moment";
import type { invoiceItemM, invoiceM } from "~/types/invoice";
import type { penawaranM } from "~/types/penawaranModel";

const props = defineProps<{ modelValue: boolean; penawaran: penawaranM }>();
const emit = defineEmits<{ "update:modelValue": [value: boolean]; saved: [] }>();

const invoiceStore = useinvoiceStore();
const penawaranStore = usePenawaranStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const saving = ref(false);

const emptyForm = (): invoiceM => ({
  no_inv: "",
  id_customer: "",
  nama_customer: "",
  alamat_customer: "",
  pic: "",
  tanggal: moment().format("YYYY-MM-DD"),
  item_pekerjaan: [],
  pakai_ppn: false,
  subtotal_invoice: 0,
  ppn: 0,
  grandtotal_invoice: 0,
  status: "Draft",
  createdAt: 0,
  createdBy: "",
});

const form = ref<invoiceM>(emptyForm());
const itemSubtotal = (item: invoiceItemM) => Number(item.qty || 0) * Number(item.amount || 0);
const subtotal = computed(() => form.value.item_pekerjaan.reduce((sum, item) => sum + itemSubtotal(item), 0));
const ppn = computed(() => form.value.pakai_ppn ? Math.round(subtotal.value * 0.11) : 0);
const grandTotal = computed(() => subtotal.value + ppn.value);

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return;
    form.value = {
      ...emptyForm(),
      id_customer: props.penawaran.id_perusahaan,
      nama_customer: props.penawaran.nama_perusahaan,
      alamat_customer: props.penawaran.alamat_perusahaan || "",
      pic: props.penawaran.pic,
      item_pekerjaan: (props.penawaran.penawaran_item || []).map((item) => ({
        nama: item.nama,
        qty: item.qty,
        uom: item.uom,
        amount: item.amount,
        subtotal_item: item.subtotal_item,
      })),
    };
  },
);

function addItem() {
  form.value.item_pekerjaan.push({ nama: "", qty: 1, uom: "", amount: 0, subtotal_item: 0 });
}

function removeItem(index: number) {
  if (form.value.item_pekerjaan.length === 1) return notificationStore.showError("Minimal satu item invoice");
  form.value.item_pekerjaan.splice(index, 1);
}

async function save() {
  if (!form.value.tanggal || !form.value.id_customer || !form.value.nama_customer || !form.value.pic) {
    return notificationStore.showError("Data customer, PIC, dan tanggal wajib diisi");
  }
  if (!form.value.item_pekerjaan.length || form.value.item_pekerjaan.some((item) => !item.nama || item.qty <= 0 || item.amount <= 0)) {
    return notificationStore.showError("Setiap item wajib memiliki nama, qty, dan harga");
  }

  form.value.item_pekerjaan.forEach((item) => { item.subtotal_item = itemSubtotal(item); });
  const payload: invoiceM = {
    ...form.value,
    subtotal_invoice: subtotal.value,
    ppn: ppn.value,
    grandtotal_invoice: grandTotal.value,
    createdAt: moment().unix(),
    createdBy: userStore.getEmail,
  };

  saving.value = true;
  const result = await invoiceStore.createInvoiceAct(payload);
  if (!result) {
    saving.value = false;
    return;
  }

  const penawaran = JSON.parse(JSON.stringify(props.penawaran)) as penawaranM;
  const penawaranUpdated = await penawaranStore.updatePenawaranAct({
    ...penawaran,
    status: "INVOICE",
    invoice_at: moment().unix(),
    invoice_by: userStore.getEmail,
  });
  saving.value = false;
  if (!penawaranUpdated) return;

  emit("update:modelValue", false);
  emit("saved");
}
</script>
