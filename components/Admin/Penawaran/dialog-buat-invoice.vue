<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="emit('update:modelValue', false)">
    <div class="modal-card">
      <!-- Header -->
      <div class="modal-header">
        <div class="title-group">
          <svg class="icon-doc" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          <span class="modal-title">Buat Invoice</span>
        </div>
        <button class="btn-close" @click="emit('update:modelValue', false)">&times;</button>
      </div>

      <!-- Content Body -->
      <div class="modal-body">
        <!-- Customer Info Section -->
        <div class="section-title">Informasi Pelanggan</div>
        <div class="form-grid">
            <a-text-field-new type="text" v-model="form.nama_customer" disabled  />
            <a-text-field-new type="text" v-model="form.pic" disabled  />
            <a-text-field-new type="text" v-model="form.no_telp" disabled  />
        </div>
         <a-textarea-new v-model="form.alamat_customer" disabled></a-textarea-new>

         <v-divider class="my-3" />

          <a-date-picker-new v-model="form.tanggal" label="Invoice Date"></a-date-picker-new>
            <a-text-field-new class="mt-2" label="Subject" v-model="form.perihal"></a-text-field-new>

        <!-- Items Table Section -->
        <div class="section-title mt-3">Description</div>
        <div class="table-container">
          <table class="compact-table">
            <thead>
              <tr>
                <th style="width: 5%;">No.</th>
                <th style="width: 45%;" class="text-left">Item / Services</th>
                <th style="width: 8%; text-align: center;">Qty</th>
                <th style="width: 10%; text-align: center;">Satuan</th>
                <th style="width: 15%; text-align: right;">Harga Satuan</th>
                <th style="width: 15%; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form.item_pekerjaan" :key="index">
                <td class="text-center">
                  {{ index + 1}}.
                </td>
                <td class="text-left">
                  {{ item.nama }}
                </td>
                <td class="text-center">
                  {{ item.qty }}
                </td>
                <td class="text-center">
                  {{ item.uom }}
                </td>
                <td class="text-right">
                  {{ item.amount }}
                </td class="text-right">
                <td class="text-right font-bold text-subtotal">
                  Rp {{ rupiah(itemSubtotal(item)) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Section -->
        <div class="summary-wrapper">
          <div class="summary-box">
            <div class="summary-row">
              <span class="text-muted">Subtotal</span>
              <span class="font-medium">Rp {{ rupiah(subtotal) }}</span>
            </div>

            <div class="summary-row align-center">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.pakai_ppn" />
                <span>PPN 11%</span>
              </label>
              <span class="font-medium">Rp {{ rupiah(ppn) }}</span>
            </div>

            <div class="divider"></div>

            <div class="summary-row total-row">
              <span class="font-bold">Grand Total</span>
              <span class="grand-total-val">Rp {{ rupiah(grandTotal) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="emit('update:modelValue', false)">Batal</button>
        <button class="btn btn-primary" :disabled="saving" @click="save">
          <span v-if="saving">Memproses...</span>
          <span v-else>Simpan Invoice</span>
        </button>
      </div>
    </div>
  </div>
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
  no_telp: "",
  tanggal: moment().format("YYYY-MM-DD"),
  item_pekerjaan: [],
  pakai_ppn: false,
  subtotal_invoice: 0,
  ppn: 0,
  perihal: "",
  grandtotal_invoice: 0,
  status: "Draft",
  createdAt: 0,
  createdBy: "",
});

const form = ref<invoiceM>(emptyForm());
const itemSubtotal = (item: invoiceItemM) => Number(item.qty || 0) * Number(item.amount || 0);
const subtotal = computed(() => form.value.item_pekerjaan.reduce((sum, item) => sum + itemSubtotal(item), 0));
const ppn = computed(() => (form.value.pakai_ppn ? Math.round(subtotal.value * 0.11) : 0));
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
      no_telp: props.penawaran.no_telp || "",
      perihal: props.penawaran.perihal || "",
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

async function save() {
  if (!form.value.tanggal || !form.value.id_customer || !form.value.nama_customer || !form.value.pic) {
    return notificationStore.showError("Data customer, PIC, dan tanggal wajib diisi");
  }
  if (!form.value.item_pekerjaan.length || form.value.item_pekerjaan.some((item) => !item.nama || item.qty <= 0 || item.amount <= 0)) {
    return notificationStore.showError("Setiap item wajib memiliki nama, qty, dan harga");
  }

  form.value.item_pekerjaan.forEach((item) => {
    item.subtotal_item = itemSubtotal(item);
  });
  const payload: invoiceM = {
    ...form.value,
    subtotal_invoice: subtotal.value,
    ppn: ppn.value,
    grandtotal_invoice: grandTotal.value,
    id_penawaran: props.penawaran.id,
    no_penawaran: props.penawaran.no_penawaran,
    createdAt: moment().unix(),
    createdBy: userStore.getEmail,
  };

  saving.value = true;
  const result = await createInvoicePenawaran(payload);
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

<style scoped>
/* Reset & Base Fonts */
* {
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Modal Structure */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-card {
  background: #ffffff;
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

/* Header */
.modal-header {
  padding: 10px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-doc {
  width: 18px;
  height: 18px;
  fill: #1976d2;
}

.modal-title {
  font-size: 14px;
  font-weight: 700;
  color: #212529;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6c757d;
  line-height: 1;
}

.btn-close:hover {
  color: #000;
}

/* Body */
.modal-body {
  padding: 12px 16px;
  overflow-y: auto;
}

.section-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #6c757d;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.mt-3 {
  margin-top: 12px;
}

/* Grid Layout */
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group.span-2 {
  grid-column: span 2;
}

.form-group label {
  font-size: 11px;
  font-weight: 600;
  color: #495057;
}

.input-field {
  width: 100%;
  padding: 5px 8px;
  font-size: 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  outline: none;
  background: #fff;
  transition: border-color 0.15s ease-in-out;
}

.input-field:focus {
  border-color: #1976d2;
}

.input-field.disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.textarea {
  resize: vertical;
}

/* Compact Table */
.table-container {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  overflow: hidden;
}

.compact-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.compact-table th {
  background: #f1f3f5;
  color: #343a40;
  font-weight: 600;
  padding: 6px 8px;
  border-bottom: 1px solid #dee2e6;
}

.compact-table td {
  padding: 4px;
  border-bottom: 1px solid #e9ecef;
}

.table-input {
  width: 100%;
  padding: 4px 6px;
  font-size: 12px;
  border: 1px solid #ced4da;
  border-radius: 3px;
  outline: none;
}

.table-input:focus {
  border-color: #1976d2;
}

/* Text Align Helpers */
.text-center { text-align: center; }
.text-right { text-align: right; }
.font-bold { font-weight: 700; }
.font-medium { font-weight: 500; }
.text-muted { color: #6c757d; }
.text-subtotal { padding-right: 8px; font-size: 12px; }

/* Summary Area */
.summary-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.summary-box {
  width: 260px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.summary-row.align-center {
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.divider {
  height: 1px;
  background: #dee2e6;
  margin: 6px 0;
}

.total-row {
  margin-bottom: 0;
  font-size: 13px;
}

.grand-total-val {
  font-weight: 700;
  color: #1976d2;
}

/* Footer & Buttons */
.modal-footer {
  padding: 8px 16px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn-secondary {
  background: #fff;
  border-color: #ced4da;
  color: #495057;
}

.btn-secondary:hover {
  background: #f8f9fa;
}

.btn-primary {
  background: #1976d2;
  color: #fff;
}

.btn-primary:hover {
  background: #1565c0;
}

.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>