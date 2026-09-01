<template>
  <v-dialog v-model="dialogWarna" max-width="340px">
    <v-card>
      <v-card-title class="text-h6 d-flex align-center justify-space-between">
        <span>Pilih Warna Header</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="dialogWarna = false"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="d-flex justify-center pa-4">
        <v-color-picker
          v-model="warnaBackgroundCustom"
          mode="hex"
          hide-inputs
          show-swatches
          elevation="0"
        ></v-color-picker>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="dialogWarna = false">
          Selesai
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div>
    <div id="offer-to-print" class="offer-card">
      <div class="watermark">
        <img src="/public/Logo-SNS.png" />
      </div>
      <div class="header-section">
        <div class="header-logo">
          <img src="/public/Logo-SNS.png" />
        </div>
        <div class="header-address">
          <h2>CV. SOLUSI NUSA SEGARA</h2>
          <p>
            Ruko Dream Land Blok A No.05, Dreamland Square, Marina City <br />
            Tanjung Riau, Kec. Sekupang, Kota Batam 29425
          </p>
          <p>Telp. +62 xxx</p>
        </div>
      </div>

      <div class="content-body" style="font-size: 11px">
        <p class="text-right mb-6">
          Batam,
          {{ rubahtanggalpenawaran(props.detailpenawaran.tanggal_penawaran) }}
        </p>

        <div class="info-row">
          <div class="label">Quotation Ref No.</div>
          <div class="value">
            : {{ props.detailpenawaran.no_penawaran || "-" }}
          </div>
        </div>

        <div class="info-row">
          <div class="label">Nama Perusahaan</div>
          <div class="value">
            :
            <span>{{ props.detailpenawaran.nama_perusahaan || "-" }}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="label">Attn</div>
          <div class="value">
            :
            <span>{{ props.detailpenawaran.pic || "-" }}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="label">Subject</div>
          <div class="value">
            :
            <span>{{ props.detailpenawaran.perihal || "-" }}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="label">Vessel</div>
          <div class="value">: xxx</div>
        </div>

        <p class="mt-6"><i>Dengan Hormat,</i></p>

        <p class="text-justify">
          <span>Dengan ini kami</span> memberikan Penawaran
          {{ props.detailpenawaran.perihal }} kepada
          {{ props.detailpenawaran.nama_perusahaan }}, Adapun penawaran yang
          kami berikan adalah sebagai berikut:
        </p>

        <table class="modern-table">
          <thead
            class="row-divider2"
            :style="{
              fontSize: '9px',
              backgroundColor: warnaBackgroundCustom,
            }"
          >
            <tr>
              <th width="30">
                <v-tooltip location="left">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      class="no-print"
                      size="20"
                      color="blue"
                      icon="mdi-palette"
                      @click="dialogWarna = true"
                      elevation="0"
                    />
                  </template>

                  <span style="font-size: 11px; padding: 2px 4px">
                    Ganti warna Header
                  </span>
                </v-tooltip>
              </th>
              <th class="text-left" style="max-width: 10px">Keterangan</th>
              <th style="width: 65px" class="text-center">QTY</th>
              <th style="width: 65px" class="text-right">UOM</th>
              <th style="width: 115px" class="text-right">Amount/Unit</th>
              <th style="width: 111px" class="text-right">
                <v-text-field
                  v-model="labelSubTotal"
                  variant="plain"
                  density="compact"
                  hide-details
                  class="text-right-input"
                />
              </th>
            </tr>
          </thead>

          <tbody ref="tableBodyRef" style="font-size: 11px">
            <tr class="row-divider-bottom">
              <td colspan="100%" style="padding: 0; border: none">
                <table
                  style="
                    width: 100%;
                    font-size: 11px;
                    border-collapse: collapse;
                  "
                >
                  <tr
                    v-for="(item, index) in props.detailpenawaran
                      .penawaran_item"
                  >
                    <td style="width: 20px" class="bullet-cell drag-handle">
                      {{ index + 1 }}.
                    </td>
                    <td class="text-left">{{ item.nama }}</td>
                    <td class="text-center" style="width: 65px">
                      {{ item.qty }}
                    </td>
                    <td class="text-right" style="width: 65px">
                      {{ item.uom }}
                    </td>
                    <td class="text-right" style="width: 115px">
                      {{ rupiah(item.amount) }}
                    </td>
                    <td class="text-right" style="width: 115px">
                      {{ rupiah(item.subtotal_item) }}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        <table class="modern-table">
          <tr>
            <td>
              <strong>Total</strong>
              <strong style="margin-left: 37px"
                >: Rp
                {{
                  rupiah(props.detailpenawaran.grand_total_penawaran)
                }}</strong
              >
            </td>
          </tr>

          <tr>
            <td colspan="4" class="text-left" style="width: 30%">
              <div style="display: flex">
                <strong>Terbilang</strong>

                <strong style="margin-left: 9px">
                  :
                  {{ jadirupiah(props.detailpenawaran.grand_total_penawaran) }}

                  <span>Rupiah</span>
                </strong>
              </div>
            </td>
          </tr>
        </table>

        <p class="mb-5" v-if="showTable">
          Demikian surat penawaran ini kami buat atas perhatian dan kerjasamanya
          kami ucapkan terimakasih.
        </p>

        <div class="signature-grid">
          <div class="sig-column">
            <p>Hormat kami,</p>
            <v-img width="77px" src="/public/TTD.png" />
            <p><strong>Muhammad Ridwan</strong></p>
          </div>
          <div class="sig-column text-left">
            <p>Approve</p>
            <div class="sig-wrapper"></div>
            <p>( .................................... )</p>
          </div>
        </div>

        <div class="signature-grid no-print" style="border: none">
          <div style="height: 150px" />
        </div>
      </div>

      <div class="footer-wave">
        <svg viewBox="0 0 500 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color: #1e467a; stop-opacity: 1" />
              <stop
                offset="100%"
                style="stop-color: #0d2a4a; stop-opacity: 1"
              />
            </linearGradient>
          </defs>

          <path
            d="M0,0 C150,80 350,80 500,0 L500,120 L0,120 Z"
            fill="#1a4f8b"
            opacity="0.2"
          ></path>

          <path
            d="M0,25 C150,90 350,90 500,25 L500,120 L0,120 Z"
            fill="#1a4f8b"
            opacity="0.4"
          ></path>

          <path
            d="M0,50 C150,110 350,110 500,50 L500,120 L0,120 Z"
            fill="url(#grad1)"
          ></path>
        </svg>
      </div>
    </div>

    <div class="d-flex justify-center align-center fill-height mt-3 mb-10">
      <v-btn
        width="70%"
        variant="outlined"
        color="indigo-darken-3"
        prepend-icon="mdi-printer"
        @click="handlePrint"
        class="text-capitalize"
      >
        Cetak Penawaran
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { penawaranM } from "~/types/penawaranModel";

const labelSubTotal = ref("SUB TOTAL");

const props = defineProps<{
  detailpenawaran: penawaranM;
}>();

// 2. STATE REFS
const dialogWarna = ref(false);
const warnaBackgroundCustom = ref("#feff02");
const showTable = ref(true);

const hiddenRows = ref<number[]>([]);

const tableBodyRef = ref<HTMLElement | null>(null);

const formatTanggal = (tanggal: string) => {
  if (!tanggal) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(tanggal));
};

// Metode pembantu tiruan (sesuaikan internal injector mixins global Anda jika berbeda)
const rubahtanggalpenawaran = (tgl: any) => formatTanggal(tgl);
const rupiah = (val: number) => new Intl.NumberFormat("id-ID").format(val);

const handlePrint = () => {
  const printContents = document.getElementById("offer-to-print")?.innerHTML;
  if (!printContents) return;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  let styles = "";
  document.querySelectorAll("link[rel='stylesheet'], style").forEach((node) => {
    if (node.tagName === "LINK") {
      styles += `@import url('${(node as HTMLLinkElement).href}');`;
    } else {
      styles += node.innerHTML;
    }
  });

  doc.write(`
    <html>
      <head>
        <title>Surat Penawaran - ${props.detailpenawaran?.id_penawaran}</title>

<style>
  ${styles} 

  @media print {
    @page {
      size: A4;
      margin: 0mm; /* Kita kontrol margin di .offer-card saja */
      
    }

    html, body {
    font-family: Verdana, Geneva, sans-serif;
      height: 100%;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden; /* Mencegah munculnya halaman kosong kedua */
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .offer-card {
      box-shadow: none !important;
      width: 210mm !important;
      height: 297mm !important; /* Paksa tinggi pas A4 */
      margin: 0 !important;
      padding: 10mm 15mm !important; /* Kurangi padding atas-bawah sedikit */
      box-sizing: border-box !important;
      position: relative !important;
      overflow: hidden !important; /* Mengunci konten agar tidak spill-over */
      page-break-after: avoid;
      page-break-before: avoid;
    }

    /* FIX KHUSUS WINDOWS: Terkadang font di Windows lebih 'gemuk' */
    .content-body {
      font-size: 10.5px !important; /* Turunkan sedikit dari 11px untuk safety margin */
      line-height: 1.3 !important;
    }

    /* Sembunyikan elemen UI yang seringkali ikut tercetak di Windows */
    .no-print, .btn-wrapper, .table-action, button, .v-icon, .eye-btn {
      display: none !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Fix posisi wave agar tetap di bawah tanpa mendorong halaman */
    .footer-wave {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      height: 120px !important; /* Kurangi tinggi wave jika konten teks banyak */
      z-index: -1;
    }
  }
</style>
      </head>
      <body>
        <div class="offer-card">
          ${printContents}
        </div>
      </body>
    </html>
  `);

  doc.close();

  const images = doc.getElementsByTagName("img");
  const printAction = () => {
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 600);
  };

  if (images.length > 0) {
    let loaded = 0;
    for (let i = 0; i < images.length; i++) {
      images[i].onload = () => {
        loaded++;
        if (loaded === images.length) printAction();
      };
    }
  } else {
    iframe.onload = printAction;

    printAction();
  }
};
</script>

<style scoped>
.offer-card {
  width: 210mm;
  min-height: 297mm;
  padding: 15mm;
  margin: 0 auto;
  background: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: Verdana, Geneva, sans-serif;
  color: #1a1a1a;
  box-sizing: border-box;
}

.p {
  font-size: 9px;
}
.span {
  font-size: 9px;
}
.strong {
  font-size: 9px;
}

.watermark {
  position: absolute;
  top: 75%;
  left: 40%;
  transform: translate(-50%, -50%);
  opacity: 0.1;
  width: 50%;
  z-index: 0;
  pointer-events: none;
}
.watermark img {
  width: 100%;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 1;
}
.header-logo img {
  width: 120px;
}
.header-address {
  text-align: right;
  line-height: 1.3;
}
.header-address h2 {
  font-size: 20px;
  margin-bottom: 5px;
  font-weight: 900;
}
.header-address p {
  font-size: 11px;
  margin: 0;
}

.header-line {
  border-bottom: 3px solid #1a4f8b;
  margin: 15px 0 25px;
}

.content-body {
  position: relative;
  z-index: 1;
  font-size: 13.5px;
  line-height: 1.5;
}
.info-row {
  display: flex;
  margin-bottom: 2px;
}
.info-row .label {
  width: 120px;
}
.recipient-block {
  margin-top: 25px;
  line-height: 1.2;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
  font-size: 11.5px;
}
.modern-table th {
  padding: 2px 4px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
}
.modern-table td {
  padding: 3px 8px;
  line-height: 1.2;
}

.total-row td {
  font-weight: bold;
  background: #fff;
  padding: 8px;
  border-top: 1px solid #000;
}

.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
.text-left {
  text-align: left;
}

.signature-grid {
  display: flex;
  justify-content: space-between;
}
.sig-column {
  width: 220px;
}
.sig-wrapper {
  height: 110px;
  position: relative;
  display: flex;
  align-items: center;
}

.footer-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 180px;
  z-index: 1;
  overflow: hidden;
  line-height: 0;
  margin: 0;
  padding: 0;
}
.footer-wave svg {
  width: 100%;
  height: 100%;
  display: block;
  margin-bottom: -1px;
}
.text-justify {
  text-align: justify;
}
.no-print {
  align-items: center;
}

.v-btn {
  letter-spacing: 0.5px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.v-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media print {
  .no-print {
    display: none !important;
  }
}

.v-divider--vertical {
  height: 24px;
  align-self: center;
  border-color: rgba(0, 0, 0, 0.12) !important;
}

.compact-invoice-table :deep(table) {
  border-collapse: collapse !important;
}

.compact-invoice-table :deep(td),
.compact-invoice-table :deep(th) {
  height: 36px !important;
  padding: 0 12px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.compact-invoice-table :deep(th) {
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #616161 !important;
}

.border-dashed {
  border-style: dashed !important;
  border-width: 1px !important;
  border-color: #bdbdbd !important;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #bdbdbd;
}

.table-action {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}
.btn-toggle-total {
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.25px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35);
  transition: all 0.2s ease;
}
.btn-toggle-total:hover {
  background: linear-gradient(135deg, #1e40af, #1e3a8a);
  transform: translateY(-1px);
}

.btn-toggle-total1 {
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: 8px;
  width: 100%;
  font-weight: 800;
  letter-spacing: 0.25px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35);
  transition: all 0.2s ease;
}
.btn-toggle-total1:hover {
  background: linear-gradient(135deg, #1e40af, #1e3a8a);
  transform: translateY(-1px);
}

.btn-toggle-total2 {
  padding: 4px 9px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 0.25px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35);
  transition: all 0.2s ease;
}
.btn-toggle-total2:hover {
  background: linear-gradient(135deg, #1e40af, #1e3a8a);
  transform: translateY(-1px);
}

.btn-wrapper {
  display: flex;
  justify-content: flex-end;
}

.reset-btn {
  padding: 2px 7px;
  font-size: 12px;
  border-radius: 6px;
  background: #e5e7eb;
  transition: 0.2s;
}

.reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.eye-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 6px;
  transition:
    background-color 0.2s,
    transform 0.15s;
}
.eye-btn:hover {
  background-color: rgba(25, 118, 210, 0.12);
  transform: scale(1.1);
}

.eye-btn:hover .v-icon {
  color: #1976d2;
}
.row-divider {
  border-top: 0.5px solid rgba(0, 0, 0, 0.35);
}

.row-divider2 {
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.35);
}

/* DRAG & DROP STYLING */
.drag-handle {
  cursor: move !important;
}

.sortable-ghost {
  opacity: 0.3;
  background-color: #f0fdf4 !important;
  border: 1px dashed #22c55e !important;
}
.row-divider-bottom {
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
}

:deep(.text-right-input input) {
  text-align: right !important;
  font-size: 9px !important; /* Menyamakan dengan font-size thead */
  font-weight: bold; /* Tetap tebal seperti th biasa */
  min-height: unset !important; /* Mengizinkan input untuk lebih ceper */
  padding-top: 0 !important; /* Menghilangkan sisa padding atas */
  padding-bottom: 0 !important; /* Menghilangkan sisa padding bawah */
}

/* Opsional: Jika tinggi box-nya masih terasa terlalu tinggi */
:deep(.text-right-input .v-field__input) {
  padding: 0 !important;
  min-height: 20px !important;
}

:deep(.text-left-input input) {
  text-align: left !important;
  font-size: 11px !important; /* Menyamakan dengan font-size thead */
  min-height: unset !important; /* Mengizinkan input untuk lebih ceper */
  padding-top: 0 !important; /* Menghilangkan sisa padding atas */
  padding-bottom: 0 !important; /* Menghilangkan sisa padding bawah */
}

/* Opsional: Jika tinggi box-nya masih terasa terlalu tinggi */
:deep(.text-left-input .v-field__input) {
  padding: 0 !important;
  min-height: 20px !important;
}
</style>
