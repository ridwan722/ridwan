<script setup lang="ts">
import moment from "moment";
import type { ConfirmationDialog } from "#components";
import type { invoiceM } from "~/types/invoice";
import { uploadStore } from "~/stores/uploadStore";

definePageMeta({
  layout: "admin",
});

const invoiceStore = useinvoiceStore();
const uploadStoreInstance = uploadStore();
const notificationStore = useNotificationStore();
const userStore = useUserStore();
const route = useRoute();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);
const dialogDikirim = ref(false);

onMounted(async () => {
  await invoiceStore.tarikDetailInvoiceAct(route.params.id as string);
});

const formatTanggal = (tanggal: string) => {
  if (!tanggal) return "-";

  const date = new Date(tanggal);

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replace(/\//g, "-");
};
const invoiceDetail = computed(() => invoiceStore.getDetailInvoice);

const printArea = ref<HTMLElement | null>(null);

function bukaDialogDikirim() {
  uploadStoreInstance.setReset();
  dialogDikirim.value = true;
}

function tutupDialogDikirim() {
  uploadStoreInstance.setReset();
  dialogDikirim.value = false;
}

async function ubahStatusDikirim() {
  const id = route.params.id as string;
  const invoice = JSON.parse(JSON.stringify(invoiceDetail.value)) as invoiceM;
  invoice.status = "Dikirim";
  invoice.dokumen_dikirim = uploadStoreInstance.getUrlRef;

  invoice.dikirimAt = moment().unix();
  invoice.dikirimBy = userStore.getEmail;

  const updated = await invoiceStore.updateInvoiceAct(id, invoice);
  if (!updated) return;

  await invoiceStore.tarikDetailInvoiceAct(id);
  tutupDialogDikirim();
  navigateTo("/admin/invoice/dikirim");
}

async function ubahStatusSelesai() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Selesai",
    "Anda yakin ingin mengubah status invoice menjadi Selesai?",
  );
  if (!confirmed) return;

  const id = route.params.id as string;
  const invoice = JSON.parse(JSON.stringify(invoiceDetail.value)) as invoiceM;
  invoice.status = "Selesai";
  invoice.selesaiAt = moment().unix();
  invoice.selesaiBy = userStore.getEmail;

  const updated = await invoiceStore.updateInvoiceAct(id, invoice);
  if (!updated) return;
  await invoiceStore.tarikDetailInvoiceAct(id);
}

function printInvoice() {
  const content = printArea.value;
  if (!content) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const styles = Array.from(
    document.querySelectorAll('style, link[rel="stylesheet"]'),
  )
    .map((style) => style.outerHTML)
    .join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>INV - </title>
        ${styles}
        <style>
          body { background: white !important; margin: 0; padding: 0; }
          .invoice-paper { border: none !important; box-shadow: none !important; width: 100% !important; max-width: 100% !important; }
          @page { margin: 0.5cm; }
        </style>
      </head>
      <body>
        ${content.innerHTML}
        <script>
          window.onload = () => {
            window.print();
            window.close();
          };
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
</script>

<template>
  <div>
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

    <v-dialog v-model="dialogDikirim" max-width="500" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="bg-primary text-white pa-4">
          Kirim Invoice
        </v-card-title>
        <!-- <v-card-text class="pa-5">
          <upload-image
            typefolder="invoice/file_dikirim"
            label="Upload Dokumen"
          />
          <v-img
            v-if="uploadStoreInstance.getUrlRef"
            :src="uploadStoreInstance.getUrlRef"
            max-height="260"
            class="mt-3 rounded-lg border"
            contain
          />
        </v-card-text> -->
        <v-card-actions class="pa-4 bg-grey-lighten-4">
          <v-spacer />
          <v-btn
            variant="outlined"
            color="grey-darken-1"
            @click="tutupDialogDikirim"
          >
            Batal
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-send"
            @click="ubahStatusDikirim"
          >
            Simpan & Kirim
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="preview-container d-flex justify-center">
      <v-card flat class="border rounded-lg pa-4 mb-4 elevation-1" width="850">
        <v-row align="center" justify="space-between">
          <v-col cols="12" sm="6" class="d-flex align-center">
            <v-avatar color="primary" class="mr-3" size="40">
              <v-icon color="white">mdi-file-document-outline</v-icon>
            </v-avatar>
            <div>
              <div class="text-caption text-grey-darken-1 font-weight-medium">
                INVOICE
              </div>
              <div class="text-h6 font-weight-bold primary--text">
                #INV/ICI/2026/SNS/{{ invoiceDetail.id }}
              </div>
            </div>
          </v-col>

          <v-col cols="12" sm="6" class="text-sm-right">
            <v-chip
              size="small"
              class="font-weight-bold text-uppercase mb-2"
              label
            >
              {{ invoiceDetail.status }}
            </v-chip>

            <v-chip
              v-if="invoiceDetail.status == 'Draft'"
              prepend-icon="mdi-check-circle-outline"
              color="primary"
              size="small"
              class="font-weight-bold text-uppercase mb-2 ml-3"
              label
              @click="ubahStatusSelesai"
            >
              Selesai
            </v-chip>

            <div
              class="text-caption text-grey-darken-1 d-flex align-center justify-sm-end mt-2"
            >
              <v-icon size="small" class="mr-1"
                >mdi-account-circle-outline</v-icon
              >
              <span class="font-weight-medium mr-2">{{
                invoiceDetail.createdBy
              }}</span>
              <span>•</span>
              <v-icon size="small" class="ml-2 mr-1">mdi-pencil-outline</v-icon>
              <span>{{ rubahtanggalunix(invoiceDetail.createdAt) }}</span>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <div class="preview-container d-flex justify-center">
      <div ref="printArea" class="invoice-paper-wrapper">
        <v-card width="850" class="pa-10 invoice-paper elevation-2">
          <!-- Header -->
          <div class="d-flex justify-space-between align-start mb-4">
            <div>
              <img src="/public/Logo-SNS.png" height="130" />
              <div class="company-address">
                <strong>CV. SOLUSI NUSA SEGARA</strong><br />
                Ruko Dream Land Blok A No.05, Dreamland Square, Marina City,
                <br />
                Tanjung Riau, Kec. Sekupang, Kota Batam 29425.
                <br />
                Hp. +62821 9998 8670
              </div>
            </div>
            <div class="invoice-title">INVOICE</div>
          </div>

          <!-- Info Customer & Invoice -->
          <div class="info-grid mb-4">
            <div class="info-box-left">
              <table class="w-100">
                <tbody>
                  <tr>
                    <td width="80">Customer</td>
                    <td width="10">:</td>
                    <td>
                      <span>
                        {{ invoiceDetail.nama_customer }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align: top">Location</td>
                    <td style="vertical-align: top">:</td>
                    <td style="vertical-align: top">
                      {{ invoiceDetail.alamat_customer }}
                    </td>
                  </tr>
                  <tr>
                    <td width="80">Attn</td>
                    <td width="10">:</td>
                    <td>
                      <span> {{ invoiceDetail.pic }} </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="info-box-right">
              <table class="w-100">
                <tbody>
                  <tr>
                    <td width="130">Invoice No</td>
                    <td width="10">:</td>
                    <td>INV/ICI/2026/SNS/{{ invoiceDetail.no_inv }}</td>
                  </tr>
                  <tr>
                    <td>Inv Date</td>
                    <td>:</td>
                    <td>{{ formatTanggal(invoiceDetail.tanggal) }}</td>
                  </tr>
                  <tr>
                    <td>Currency</td>
                    <td>:</td>
                    <td>IDR – (Rupiah)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Main Table -->
          <table class="main-table">
            <thead>
              <tr>
                <th width="3%">NO.</th>
                <th width="47%">DESCRIPTION</th>
                <th width="5%">QTY</th>
                <th width="5%">UOM</th>
                <th width="35%">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in invoiceDetail.item_pekerjaan"
                :key="index"
              >
                <td class="no-cell v-align-middle">
                  <div class="text-center font-weight-bold">
                    <span> {{ index + 1 }}. </span>
                  </div>
                </td>

                <td class="desc-cell">
                  <div class="font-weight-bold">
                    <span style="white-space: pre-line">
                      {{ item.nama }}
                    </span>
                  </div>
                </td>

                <td class="qty-cell v-align-middle">
                  <div class="align-center text-center">
                    <span>{{ item.qty }}</span>
                  </div>
                </td>

                <td class="qty-cell v-align-middle">
                  <div class="align-center text-center">
                    <span>{{ item.uom }}</span>
                  </div>
                </td>

                <td class="amount-cell v-align-middle">
                  <div class="d-flex justify-space-between align-center">
                    <span>Rp</span>
                    <span>{{ rupiah(item.amount) }}</span>
                  </div>
                </td>
              </tr>

              <!-- Total & Tax Calculation -->
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td class="footer-label">
                  <strong>SUB TOTAL</strong>
                </td>
                <td class="footer-value">
                  <div class="d-flex justify-space-between">
                    <span>Rp</span
                    ><span>{{ rupiah(invoiceDetail.subtotal_invoice) }}</span>
                  </div>
                </td>
              </tr>
              <tr v-if="invoiceDetail.pakai_ppn == true">
                <td></td>
                <td></td>
                <td></td>
                <td class="footer-label"><strong>PPn 11%</strong></td>
                <td class="footer-value">
                  <div class="d-flex justify-space-between">
                    <span>Rp</span><span>{{ rupiah(invoiceDetail.ppn) }}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td class="footer-label">
                  <strong>TOTAL</strong>
                </td>
                <td class="footer-value">
                  <div class="d-flex justify-space-between font-weight-bold">
                    <span>Rp</span
                    ><span>{{ rupiah(invoiceDetail.grandtotal_invoice) }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Terbilang -->
          <div class="terbilang-strip">
            <strong
              >Terbilang :
              {{ jadirupiah(invoiceDetail.grandtotal_invoice) }}Rupiah</strong
            >
          </div>

          <table>
            <tbody>
              <tr>
                <td class="remark-cell">
                  <div class="remark-border-box">
                    <strong class="text-body-2 font-weight-bold"
                      >TERMS & CONDITIONS :</strong
                    >
                    <ul class="remark-list-style">
                      <li>
                        <strong>Lead time 10-15 Days</strong>
                      </li>
                      <li>
                        <strong>
                          Payment Terms Down Payment (DP) 50%, Balance Prior
                          Delivery
                        </strong>
                      </li>
                      <li>
                        <strong>
                          Validation of this Quotation – 7 Days from Quotation
                          Date
                        </strong>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Bank & Signature -->
          <div class="d-flex justify-space-between mt-6">
            <div class="d-flex justify-space-between">
              <div class="bank-details">
                <div>
                  <strong class="d-block mb-1">BCA BANK ( RUPIAH/IDR )</strong>
                  <table class="bank-table">
                    <tbody>
                      <tr>
                        <td>Cabang</td>
                        <td>:</td>
                        <td>Arkadia</td>
                      </tr>
                      <tr>
                        <td>ACC NO</td>
                        <td>:</td>
                        <td>540 5142 888</td>
                      </tr>
                      <tr>
                        <td>AN</td>
                        <td>:</td>
                        <td>CV. SOLUSI NUSA SEGARA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="text-center signature-area">
              <span class="font-italic">Your sincerely,</span><br /><strong
                >CV. SOLUSI NUSA SEGARA</strong
              >
              <v-img
                src="/public/ttd_ridwan.png"
                width="120"
                class="ml-11"
              ></v-img>
              <strong>( Muhammad Ridwan )</strong>
            </div>
          </div>
        </v-card>
      </div>
    </div>

    <div class="text-center mt-4">
      <v-btn
        prepend-icon="mdi-printer"
        color="indigo"
        variant="elevated"
        @click="printInvoice"
        width="45%"
      >
        Print Invoice
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.invoice-paper {
  font-family: "Arial", sans-serif;
  color: #000;
  line-height: 1.3;
}

.invoice-title {
  font-size: 32px;
  font-weight: bold;
  border-bottom: none;
}
.company-address {
  font-size: 13px;
  margin-top: 5px;
}

.info-grid {
  display: flex;
  border: 1px solid #000;
}
.info-box-left,
.info-box-right {
  padding: 10px;
  font-size: 14px;
  width: 50%;
}
.info-box-right {
  border-left: 1px solid #000;
}

.main-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}
.main-table th {
  background-color: #b8cce4 !important;
  border: 2px solid #000;
  padding: 8px;
  font-weight: bold;
}
.main-table td {
  border: 2px solid #000;
  padding: 6px;
  font-size: 14px;
}

.bg-light-blue {
  background-color: #b8cce4 !important;
}
.remark-box {
  vertical-align: top;
  font-size: 12px;
}
.amount-cell {
  padding-left: 5px !important;
  padding-right: 5px !important;
}

@media print {
  .no-print {
    display: none !important;
  }
}

.terbilang-strip {
  border-top: 2px solid #000;
  border-bottom: 2px solid #000;
  padding: 5px 10px;
  margin: 15px 0;
  font-style: italic;
  font-size: 14px;
}

.bank-details,
.signature-area {
  font-size: 14px;
}
.bank-table {
  border-collapse: collapse;
  font-size: 14px;
}

.bank-table td {
  border: none !important; /* Menghilangkan border dari style main-table jika terbawa */
  padding: 0px 4px 0px 0px !important;
  vertical-align: top;
  line-height: 1.4;
}

/* Mengatur lebar kolom label agar titik dua sejajar sempurna */
.bank-table td:first-child {
  width: 70px;
  font-weight: bold;
}

/* Memastikan teks "BCA BANK" ada jarak sedikit dengan tabel di bawahnya */
.d-block {
  display: block;
}
@media print {
  .bg-light-blue,
  th {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

.main-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

.main-table th,
.main-table td {
  border: 1px solid #000;
  padding: 6px;
  font-size: 14px;
}

.main-table th {
  background-color: #fa0000 !important;
  font-weight: bold;
  color: white;
  border: 2px solid #000;
}

.desc-cell {
  padding: 8px !important;
}

.qty-cell {
  vertical-align: top;
  width: 15%;
}

.no-cell {
  width: 5%;
}

.amount-cell {
  vertical-align: top;
  width: 125%;
}

.remark-cell {
  vertical-align: middle;
}

.remark-border-box {
  border: 1px solid #000;
  padding: 8px;
  min-height: 80px;
  height: 100px;
}

.remark-list-style {
  list-style: none;
  padding-left: 0;
  margin: 5px 0 0 0;
  font-size: 12px;
}

.remark-list-style li::before {
  content: "* ";
  font-weight: bold;
}

.footer-label {
  width: 15%;

  padding-right: 10px !important;
  white-space: nowrap;
}

.footer-value {
  width: 20%;
}

.d-flex {
  display: flex;
}
.justify-space-between {
  justify-content: space-between;
}
.text-center {
  text-align: center;
}
.font-weight-bold {
  font-weight: bold;
}
.italic-text {
  font-style: italic;
}
.v-align-top {
  vertical-align: top;
}

@media print {
  .bg-blue-total,
  .main-table th {
    background-color: #fa0000 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid black;
  }
}

.align-center {
  align-items: center;
}

.v-align-middle {
  vertical-align: middle !important;
}

.invoice-status-row .v-col {
  padding-top: 6px;
  padding-bottom: 6px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e8e8e8;
}

.icon-box {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #f4f6f8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box i {
  color: #555;
}

.info-label {
  font-size: 11px;
  color: #8a8a8a;
}

.info-value {
  font-size: 13px;
  font-weight: 600;
  color: #2c2c2c;
}

.custom-toggle {
  background-color: white !important;
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.custom-toggle .v-btn {
  text-transform: none !important; /* Menghilangkan Uppercase otomatis */
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 0 20px !important;
  transition: all 0.3s ease;
}

/* Memberikan efek hover */
.custom-toggle .v-btn:hover {
  background-color: #f5f5f5;
}

/* Styling khusus untuk button yang aktif */
.v-btn--active {
  background-color: #265ffc !important; /* Indigo Darken 4 */
  color: white !important;
}

.info-card {
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  .v-btn {
    opacity: 0.6;
    transition: 0.2s;

    &:hover {
      opacity: 1;
    }
  }
}

.btn-selesai {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  letter-spacing: 0.5px;
  height: 52px;
  transition: all 0.25s ease;

  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(34, 197, 94, 0.35);
    filter: brightness(1.05);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4px 10px rgba(34, 197, 94, 0.2);
  }
}
</style>
