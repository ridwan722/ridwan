<template>
  <!-- Dialog Color Picker -->
  <v-dialog v-model="dialogWarna" max-width="360px">
    <v-card class="rounded-xl elevation-8">
      <v-card-title class="d-flex align-center justify-space-between pa-4 bg-slate-50">
        <div class="d-flex align-center gap-2">
          <v-icon color="primary" size="20">mdi-palette-outline</v-icon>
          <span class="text-subtitle-1 font-weight-bold color-slate-800">Tema Warna Header</span>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" density="comfortable" @click="dialogWarna = false" />
      </v-card-title>
      <v-divider />
      <v-card-text class="d-flex justify-center pa-4">
        <v-color-picker
          v-model="warnaBackgroundCustom"
          mode="hex"
          hide-inputs
          show-swatches
          elevation="0"
        />
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-3 bg-slate-50">
        <v-spacer />
        <v-btn color="primary" variant="flat" size="small" class="px-5 rounded-lg" @click="dialogWarna = false">
          Terapkan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div>
    <!-- Container Penawaran -->
    <div id="offer-to-print" class="offer-card">
      <!-- Watermark Background -->
      <div class="watermark">
        <img src="/public/Logo-SNS.png" alt="Logo Watermark" />
      </div>

      <!-- Section Kop Surat -->
      <div class="header-section">
        <div class="header-brand">
          <div class="logo-wrapper">
            <img src="/public/Logo-SNS.png" alt="Logo Header" />
          </div>
          <div class="company-titles">
            <h1 class="company-name">CV. SOLUSI NUSA SEGARA</h1>
          </div>
        </div>

        <div class="header-contact">
          <p class="address-line">
            Ruko Dream Land Blok A No.05,<br> Dreamland Square,  Marina City 
          Tanjung Riau, <br>Kec. Sekupang, Kota Batam 29425</p>
          <p class="phone-line">

            Hp. +62821 9998 8670
          </p>
        </div>
      </div>

      <!-- Accent Divider Line -->
      <div class="header-divider">
        <div class="accent-bar" :style="{ backgroundColor: warnaBackgroundCustom }"></div>
        <div class="secondary-bar"></div>
      </div>

      <!-- Main Document Content -->
      <div class="content-body">
        <!-- Top Info Line (Document Title & Date) -->
        <div class="doc-meta-header">
          <div class="doc-badge" :style="{ borderColor: warnaBackgroundCustom }">

          </div>
          <div class="doc-date">
            <span>Batam, </span>
            <strong>{{ rubahtanggalpenawaran(props.detailpenawaran.tanggal_penawaran) }}</strong>
          </div>
        </div>

        <!-- Info Grid (Two Columns Cards) -->
        <div class="info-grid-card">
          <div class="grid-col">
            <div class="meta-row">
              <span class="lbl">Quotation Ref No</span>
              <span class="sep">:</span>
              <span class="val bold">{{ props.detailpenawaran.no_penawaran || "-" }}</span>
            </div>
            <div class="meta-row">
              <span class="lbl">To</span>
              <span class="sep">:</span>
              <span class="val bold">{{ props.detailpenawaran.nama_perusahaan || "-" }}</span>
            </div>
            <div class="meta-row">
              <span class="lbl">Attn</span>
              <span class="sep">:</span>
              <span class="val">{{ props.detailpenawaran.pic || "-" }}</span>
            </div>

            <div class="meta-row">
              <span class="lbl">Telp</span>
              <span class="sep">:</span>
              <span class="val">{{ props.detailpenawaran.no_telp || "-" }}</span>
            </div>
          </div>
          <div class="grid-col">
            <div class="meta-row">
              <span class="lbl">Subject</span>
              <span class="sep">:</span>
              <span class="val bold-navy">{{ props.detailpenawaran.perihal || "-" }}</span>
            </div>
            <div class="meta-row">
              <span class="lbl">Vessel</span>
              <span class="sep">:</span>
              <span class="val">xxx</span>
            </div>
          </div>
        </div>

        <!-- Salutation & Opening Paragraph -->
        <div class="text-salutation">
          <p class="salutation-title">Dengan Hormat,</p>
          <p class="salutation-body">
            Sehubungan dengan kebutuhan operasional perusahaan Bapak/Ibu, bersama surat ini kami mengajukan penawaran harga untuk 
            <strong>{{ props.detailpenawaran.perihal }}</strong> kepada <strong>{{ props.detailpenawaran.nama_perusahaan }}</strong> dengan rincian sebagai berikut:
          </p>
        </div>

        <!-- Main Items Table -->
        <div class="table-container">
          <table class="modern-table">
            <thead>
              <tr :style="{ backgroundColor: warnaBackgroundCustom, color: warnaTeksHeader }">
                <th width="36" class="text-center no-print-cell" :style="{ color: warnaTeksHeader }">
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        class="no-print theme-btn"
                        size="20"
                        variant="flat"
                        icon="mdi-palette"
                        :style="{ color: warnaTeksHeader }"
                        @click="dialogWarna = true"
                      />
                    </template>
                    <span>Ubah Warna Aksentuasi</span>
                  </v-tooltip>
                </th>
                <th width="32" class="text-center print-only-cell" :style="{ color: warnaTeksHeader }">NO</th>
                <th class="text-left" :style="{ color: warnaTeksHeader }">DESCRIPTION / KETERANGAN</th>
                <th width="60" class="text-center" :style="{ color: warnaTeksHeader }">QTY</th>
                <th width="65" class="text-center" :style="{ color: warnaTeksHeader }">UOM</th>
                <th width="125" class="text-right" :style="{ color: warnaTeksHeader }">UNIT PRICE</th>
                <th width="135" class="text-right" :style="{ color: warnaTeksHeader }">
                  <v-text-field
                    v-model="labelSubTotal"
                    variant="plain"
                    density="compact"
                    hide-details
                    class="header-input-field"
                    :style="{ '--header-text-color': warnaTeksHeader }"
                  />
                </th>
              </tr>
            </thead>
            <tbody ref="tableBodyRef">
              <tr 
                v-for="(item, index) in props.detailpenawaran.penawaran_item" 
                :key="index"
                :class="{ 'zebra-row': index % 2 === 1 }"
              >
                <!-- Drag Handle & Numbering Cell -->
                <td class="text-center row-num drag-handle" width="36">
                 <div style="display: flex; align-items: center;">
                   <v-icon size="12" class="drag-icon no-print mr-1">mdi-drag-vertical</v-icon>
                  <span>{{ index + 1 }}.</span>
                 </div>
                </td>
                <td class="text-left font-weight-bold text-slate-800">{{ item.nama }}</td>
                <td class="text-center">{{ item.qty }}</td>
                <td class="text-center text-slate-500">{{ item.uom }}</td>
                <td class="text-right text-slate-600">Rp {{ rupiah(item.amount) }}</td>
                <td class="text-right  text-navy">Rp {{ rupiah(item.subtotal_item) }}</td>
              </tr>
            </tbody>

            <!-- Table Footer for Subtotal, Grand Total & Terbilang -->
            <tfoot>
              <!-- Subtotal Row -->
              <tr class="summary-row subtotal-row">
                <td colspan="5" class="text-right text-slate-600">SUBTOTAL</td>
                <td class="text-right text-slate-800">
                  Rp {{ rupiah(props.detailpenawaran.subtotal_penawaran || props.detailpenawaran.grand_total_penawaran) }}
                </td>
              </tr>

              <!-- Grand Total Row -->
              <tr class="summary-row grand-total-row">
                <td colspan="5" class="text-right font-weight-bold text-navy">GRAND TOTAL</td>
                <td class="text-right font-weight-bold text-navy gt-text">
                  Rp {{ rupiah(props.detailpenawaran.grand_total_penawaran) }}
                </td>
              </tr>

              <!-- Terbilang Row -->
              <tr class="terbilang-row">
                <td colspan="6">
                  <div class="terbilang-inner">
                    <span class="terbilang-lbl">TERBILANG:</span>
                    <span class="terbilang-val"># {{ jadirupiah(props.detailpenawaran.grand_total_penawaran) }} Rupiah #</span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Closing Paragraph -->
        <p class="closing-paragraph" v-if="showTable">
          Demikian penawaran harga ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.
        </p>

        <!-- Signature Section -->
        <div class="signatures-wrapper">
          <div class="sig-block">
            <p class="sig-header">Hormat Kami,</p>
            <p class="sig-sub">CV. SOLUSI NUSA SEGARA</p>
            <div class="sig-img-container">
              <img src="/public/ttd_ridwan.png" alt="Signature" class="sig-image" />
            </div>
            <p class="sig-person-name">Muhammad Ridwan</p>
          </div>

          <div class="sig-block">
            <p class="sig-header">Disetujui Oleh,</p>
            <p class="sig-sub">{{ props.detailpenawaran.nama_perusahaan || '' }}</p>
            <div class="sig-placeholder"></div>
            <p class="sig-person-name">( .................................... )</p>
            <p class="sig-person-role">Stamp & Signature</p>
          </div>
        </div>
      </div>

      <!-- Footer Wave Graphic -->
      <div class="footer-wave">
        <!-- <svg viewBox="0 0 500 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color: #0f2b48; stop-opacity: 1" />
              <stop offset="100%" style="stop-color: #1a4f8b; stop-opacity: 1" />
            </linearGradient>
          </defs>
          <path d="M0,0 C150,80 350,80 500,0 L500,120 L0,120 Z" fill="#2563eb" opacity="0.12"></path>
          <path d="M0,25 C150,90 350,90 500,25 L500,120 L0,120 Z" fill="#1d4ed8" opacity="0.25"></path>
          <path d="M0,50 C150,110 350,110 500,50 L500,120 L0,120 Z" fill="url(#grad1)"></path>
        </svg> -->
      </div>
    </div>

    <!-- Floating Print Button -->
    <div class="d-flex justify-center align-center mt-6 mb-12 no-print">
      <v-btn
        width="300"
        height="46"
        color="indigo-darken-3"
        elevation="3"
        prepend-icon="mdi-printer"
        class="text-capitalize font-weight-bold rounded-lg text-subtitle-2"
        @click="handlePrint"
      >
        Print Quotation
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { penawaranM } from "~/types/penawaranModel";

const labelSubTotal = ref("SUB TOTAL");

const props = defineProps<{
  detailpenawaran: penawaranM;
}>();

const dialogWarna = ref(false);
const warnaBackgroundCustom = ref("#F02424");
const showTable = ref(true);
const tableBodyRef = ref<HTMLElement | null>(null);

// Menghitung kontras warna teks (gelap/terang) berdasarkan background
const warnaTeksHeader = computed(() => {
  const hex = warnaBackgroundCustom.value.replace("#", "");
  if (hex.length !== 6) return "#0f2b48";
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#0f2b48" : "#ffffff";
});

const formatTanggal = (tanggal: string) => {
  if (!tanggal) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(tanggal));
};

const rubahtanggalpenawaran = (tgl: any) => formatTanggal(tgl);
const rupiah = (val: number) => new Intl.NumberFormat("id-ID").format(val || 0);

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
        <title>Penawaran_${props.detailpenawaran?.no_penawaran || 'SNS'}</title>
        <style>
          ${styles} 

          @media print {
            @page {
              size: A4;
              margin: 0mm;
            }

            html, body {
              font-family: 'Segoe UI', Arial, sans-serif;
              height: 100%;
              margin: 0 !important;
              padding: 0 !important;
              background: #fff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .offer-card {
              box-shadow: none !important;
              width: 210mm !important;
              height: 297mm !important;
              margin: 0 !important;
              padding: 12mm 16mm 20mm 16mm !important;
              box-sizing: border-box !important;
              position: relative !important;
              overflow: hidden !important;
              page-break-after: avoid;
              page-break-before: avoid;
            }

            .no-print, .no-print-cell, .drag-icon {
              display: none !important;
            }

            .print-only-cell {
              display: table-cell !important;
            }

            .footer-wave {
              position: absolute !important;
              bottom: 0 !important;
              left: 0 !important;
              width: 100% !important;
              height: 130px !important;
              z-index: 0 !important;
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
      images[i].onerror = () => {
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
/* Page Paper Box */
.offer-card {
  width: 210mm;
  min-height: 297mm;
  padding: 14mm 18mm 25mm 18mm;
  margin: 0 auto;
  background: #ffffff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.1);
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  color: #1e293b;
  box-sizing: border-box;
}

/* Background Watermark */
.watermark {
  position: absolute;
  top: 67%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.105;
  width: 440px;
  z-index: 0;
  pointer-events: none;
}
.watermark img {
  width: 100%;
}

/* Kop Surat Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  z-index: 1;
  padding-bottom: 8px;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-wrapper img {
  width: 105px;
  height: auto;
  display: block;
}

.company-name {
  font-size: 17px;
  font-weight: 800;
  color: #0f2b48;
  letter-spacing: 0.3px;
  margin: 0;
  line-height: 1.2;
}

.header-contact {
  text-align: right;
  line-height: 1.4;
}

.address-line, .phone-line {
  font-size: 9.5px;
  color: #475569;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  max-width: 250px;
}

/* Header Divider Lines */
.header-divider {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 6px;
  margin-bottom: 16px;
}

.accent-bar {
  height: 4px;
  width: 100%;
  border-radius: 2px;
  transition: background-color 0.2s ease;
}

.secondary-bar {
  height: 1px;
  width: 100%;
  background-color: #cbd5e1;
}

/* Document Content Body */
.content-body {
  position: relative;
  z-index: 1;
}

/* Meta Top Row (Title Badge & Date) */
.doc-meta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.doc-badge {
  font-size: 11px;
  font-weight: 800;
  color: #0f2b48;
  letter-spacing: 0.8px;
  padding: 3px 10px;

  background: #f8fafc;
  text-transform: uppercase;
}

.doc-date {
  font-size: 11px;
  color: #475569;
}

/* Info Card */
.info-grid-card {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 14px;
}

.meta-row {
  display: flex;
  align-items: center;
  font-size: 10.5px;
  margin-bottom: 3px;
}
.meta-row:last-child {
  margin-bottom: 0;
}

.meta-row .lbl {
  width: 95px;
  color: #64748b;
  font-weight: 600;
  flex-shrink: 0;
}

.meta-row .sep {
  width: 12px;
  color: #94a3b8;
}

.meta-row .val {
  color: #334155;
  font-weight: 500;
}

.meta-row .val.highlight {
  font-weight: 700;
  color: #2563eb;
}

.meta-row .val.bold {
  font-weight: 700;
  color: #1e293b;
}

.meta-row .val.bold-navy {
  font-weight: 700;
  color: #0f2b48;
}

/* Opening Text */
.text-salutation {
  font-size: 11px;
  line-height: 1.5;
  color: #334155;
  margin-bottom: 12px;
}

.salutation-title {
  font-weight: 700;
  margin-bottom: 3px;
  color: #0f2b48;
}

.salutation-body {
  text-align: justify;
  margin: 0;
}

/* Modern Items Table */
.table-container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #cbd5e1;
  margin-bottom: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10.5px;
}

.modern-table th {
  padding: 7px 10px;
  font-weight: 700;
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 1px solid #cbd5e1;
  transition: color 0.3s ease;
}

.modern-table td {
  padding: 7px 10px;
  color: #334155;
  vertical-align: middle;
  border-bottom: 1px solid #f1f5f9;
}

.modern-table tbody tr.zebra-row {
  background-color: #f8fafc;
}

.modern-table tbody tr:last-child td {
  border-bottom: 1px solid #cbd5e1;
}

/* Table Footer Summary Styles */
.modern-table tfoot .summary-row td {
  padding: 6px 10px;
  font-size: 10px;
  letter-spacing: 0.3px;
  border-bottom: 1px solid #e2e8f0;
}

.modern-table tfoot .subtotal-row {
  background-color: #f8fafc;
}

.modern-table tfoot .grand-total-row {
  background-color: #f1f5f9;
}

.gt-text {
  font-size: 11.5px !important;
}

.terbilang-row td {
  background-color: #f8fafc;
  padding: 8px 10px !important;
  border-bottom: none !important;
}

.terbilang-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
}

.terbilang-lbl {
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.5px;
}

.terbilang-val {
  font-style: italic;
  font-weight: 700;
  color: #0f2b48;
}

/* Drag Handle Styles */
.drag-handle {
  cursor: move !important;
  user-select: none;
}

.drag-icon {
  opacity: 0.4;
  transition: opacity 0.2s;
}

.drag-handle:hover .drag-icon {
  opacity: 1;
}

.row-num {
  color: #64748b;
  font-weight: 600;
}

.print-only-cell {
  display: none;
}

/* Closing Paragraph */
.closing-paragraph {
  font-size: 10.5px;
  color: #475569;
  line-height: 1.4;
  margin-bottom: 20px;
}

/* Signature Grid */
.signatures-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  page-break-inside: avoid;
}

.sig-block {
  width: 210px;
  text-align: center;
}

.sig-header {
  font-size: 10.5px;
  font-weight: 600;
  color: #475569;
  margin: 0;
}

.sig-sub {
  font-size: 9.5px;
  font-weight: 700;
  color: #0f2b48;
  margin: 2px 0 0 0;
  text-transform: uppercase;
}

.sig-img-container {
  height: 95px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sig-image {
  max-height: 95px;
  max-width: 130px;
  object-fit: contain;
}

.sig-placeholder {
  height: 95px;
}

.sig-person-name {
  font-size: 10.5px;
  font-weight: 700;
  color: #0f2b48;
  margin: 0;
  border-bottom: 1px solid #94a3b8;
  padding-bottom: 2px;
}

.sig-person-role {
  font-size: 9px;
  color: #64748b;
  margin-top: 2px;
}

/* Bottom Decorative SVG Wave */
.footer-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 130px;
  z-index: 0;
  pointer-events: none;
}

.footer-wave svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* Helpers & Utilities */
.text-navy { color: #0f2b48; }
.text-slate-800 { color: #1e293b; }
.text-slate-600 { color: #475569; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.uppercase { text-transform: uppercase; }

.theme-btn {
  background: transparent !important;
  box-shadow: none !important;
}

/* Vuetify Field Overrides Dynamic Text Color */
:deep(.header-input-field input) {
  text-align: right !important;
  font-size: 9.5px !important;
  font-weight: 800 !important;
  text-transform: uppercase;
  color: var(--header-text-color, #0f2b48) !important;
  padding: 0 !important;
  min-height: unset !important;
  transition: color 0.3s ease;
}

:deep(.header-input-field .v-field__input) {
  padding: 0 !important;
  min-height: 18px !important;
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>