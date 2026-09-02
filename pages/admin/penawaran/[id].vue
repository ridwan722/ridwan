<script setup lang="ts">
import _ from "lodash";
import { useRoute } from "vue-router";
import { usePenawaranStore } from "~/stores/penawaranStore";
import type { ConfirmationDialog } from "#components";

import "@vueup/vue-quill/dist/vue-quill.snow.css";
import dialogBuatInvoice from "~/components/Admin/Penawaran/dialog-buat-invoice.vue";

definePageMeta({ layout: "admin" });

const route = useRoute();

const penawaranstore = usePenawaranStore();


onMounted(async () => {
  useloadingStore().setLoading(true); // Aktifkan loading
  try {
    await penawaranstore.tarikDetailPenawaranAct(String(route.params.id));
    await penawaranstore.tarikDataPenawaranrevisAct(String(route.params.id));
  } finally {
    useloadingStore().setLoading(false); // Matikan loading setelah semua selesai
  }
});

const detailpenawaran = computed(() => penawaranstore.getDetailPenawaran);

const data = reactive({
  dialogAdd: false,
  dialogRevisi: false,
  itemsPerPageKategori: 10,
  page: 1,
  itemsPerPage: 10,
  pageKategori: 1,
  dialogPenawaran: false,

  new_pemberkasan: {
    id_dokumen: "",
    nama_dokumen: "",
    file_dokumen: "",
    no_dokumen: "",
    id_kategori_item: "",
    nama_kategori_item: "",
    periode_mulai: "",
    periode_selesai: "",
    status_dokumen: "Asli",
  },

  headers_items: [
    { title: "Nama", key: "nama_kategori_item" },
    { title: "Jumlah", key: "jumlahUnit" },
    { title: "Periode Penawaran", value: "periode_penawaran", sortable: true },
    { title: "Nominal", key: "nominal" },
    { title: "Subtotal", key: "subtotal" },
    { title: "Aksi", key: "actions", sortable: false },
  ],
});

async function opendialogaddinv() {
  data.dialogAdd = true;
}

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const uploadFile = async (file: File): Promise<string> => {
  const storage = getStorage();

  const fileName = `${Date.now()}-${file.name}`;
  const fileRef = storageRef(storage, `penawaran/${fileName}`);

  await uploadBytes(fileRef, file);

  const downloadURL = await getDownloadURL(fileRef);

  return downloadURL;
};

// Fungsi Cetak dengan Iframe (Menjaga keutuhan gaya CSS)
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

  // Mengambil gaya asli (Ini yang membuat Mac Anda benar sebelumnya)
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
        <title>Surat Penawaran - ${detailpenawaran.value?.nomor}</title>
        <style>
          ${styles} /* Gaya asli aplikasi Anda */

          @media print {
            @page {
              size: A4;
              margin: 0;
            }

            body {
              margin: 0;
              padding: 0;
              background: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .offer-card {
              box-shadow: none !important;
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 !important;
              padding: 15mm 15mm !important;
              box-sizing: border-box !important;
              /* JANGAN gunakan position static global di sini agar Mac tidak rusak */
            }

            /* FIX KHUSUS UNTUK WINDOWS (Tumpang Tindih) */
            /* Fokus hanya pada area yang berantakan di gambar tadi */

            .total-section, .terbilang-box, .signature-wrapper {
              position: relative !important;
              display: block !important;
              page-break-inside: avoid;
              margin-top: 10px !important;
              top: auto !important; /* Reset jika ada top: px liar */
              left: auto !important;
            }

            /* Sembunyikan tombol-tombol yang muncul di gambar */
            .no-print, button, .eye-icon, .reset-item,
            [class*="Tampilkan"], [class*="Reset"] {
              display: none !important;
            }

            .modern-table {
              width: 100% !important;
              border-collapse: collapse !important;
            }

            .modern-table th {
              background-color: #f8f9fa !important;
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

  // Gunakan fungsi pendeteksi loading gambar agar tidak blank/berantakan
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
    // Fallback jika onload tidak jalan
    printAction();
  }
};
</script>

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

  <div v-if="detailpenawaran" class="page-container">

    <!-- // DIALOG BUAT INVOICE \\ -->
    <dialog-buat-invoice
      v-model="data.dialogAdd"
      :penawaran="detailpenawaran"
      @saved="navigateTo('/admin/invoice')"
    />

    <!-- // DETAIL PENAWARAN \\ -->
    <v-card
      variant="outlined"
      class="rounded-lg border-thin no-print"
      color="grey-lighten-2"
    >
      <v-card-text class="pa-4">
        <div class="d-flex align-start mb-3">
          <div class="d-flex justify-space-between align-start flex-grow-1">
            <div>
              <div
                class="text-caption text-primary text-uppercase font-weight-bold"
                style="letter-spacing: 1px"
              >
                Quotation Ref No.
              </div>
              <div class="text-h6 font-weight-black text-grey-darken-4">
                {{ detailpenawaran.no_penawaran }}
              </div>
            </div>
          </div>
        </div>

        <v-divider class="mb-4" opacity="90"></v-divider>

        <v-row no-gutters>
          <v-col cols="12" md="7" class="mb-4 mb-md-0">
            <div class="text-caption text-primary font-weight-bold">
              Client
            </div>
            <div class="text-body-2 text-grey-darken-1">
              <v-icon size="small" color="primary" class="mr-1"
                >mdi-office-building</v-icon
              >
              {{ detailpenawaran.nama_perusahaan }}
              <span class="mx-2 text-grey-lighten-1">|</span>
              <v-icon size="small" color="primary" class="mr-1"
                >mdi-phone</v-icon
              >
              {{ detailpenawaran.no_telp }}
            </div>
          </v-col>

          <v-col cols="12" md="5">
            <div class="d-flex flex-column ga-1">
              <!-- Perihal -->
              <div>
                <div
                  class="text-primary font-weight-bold mb-1 d-flex align-center ga-2"
                  style="font-size: 12px; letter-spacing: 1px"
                >
                  <v-icon size="15" color="primary"
                    >mdi-file-document-outline</v-icon
                  >
                  Subject
                </div>

                <div
                  class="text-body-1 text-grey-darken-4 font-weight-medium"
                  style="line-height: 1.8"
                >
                  {{ detailpenawaran.perihal }}
                </div>
              </div>

            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- // TINDAKAN \\ -->
    <v-row
      class="mb-3 mt-3 no-print px-4 py-2 bg-grey-lighten-4 rounded-lg align-center border shadow-sm mx-0"
    >
      <div
        class="text-subtitle-2 font-weight-bold text-grey-darken-2 mr-auto"
      />

      <div class="d-flex flex-wrap gap-2">

        <v-btn
          color="success"
          prepend-icon="mdi-file-document-plus"
          @click="opendialogaddinv"
        >
          Buat Invoice
        </v-btn>
      </div>
    </v-row>

    <!-- // CANVAS \\ -->
    <canvas-penawaran :detailpenawaran="detailpenawaran" />
  </div>
</template>

<style scoped>
/* Kertas A4 */
.offer-card {
  width: 210mm;
  min-height: 297mm;
  padding: 15mm;
  margin: 0 auto;
  background: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: "Times New Roman", Times, serif;
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

/* Watermark */
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

/* Header Styling */
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

/* Body Content */
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
  width: 80px;
}
.recipient-block {
  margin-top: 25px;
  line-height: 1.2;
}

/* Table Styling - Compact Version */
.modern-table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0; /* Dikurangi dari 25px */

  font-size: 11.5px; /* Lebih kecil dari font body */
}

.modern-table th {
  padding: 4px 6px; /* Padding sangat rapat */
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  background: #fff; /* Bersih tanpa warna abu */
}

.modern-table td {
  padding: 3px 8px; /* Padding rapat */
  line-height: 1.2;
}

.total-row td {
  font-weight: bold;
  background: #fff;
  padding: 8px;
  border-top: 1px solid #000; /* Garis pemisah total lebih tegas */
}

/* Mengatur alignment spesifik */
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}

/* Signatures */
.signature-grid {
  display: flex;
  justify-content: space-between;
  /* margin-top: 40px; */
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

/* Footer Wave */
.footer-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 180px; /* Anda bisa naikkan ini sesuai keinginan */
  z-index: 1;
  overflow: hidden;
  line-height: 0; /* Penting: Menghilangkan celah di bawah elemen inline-block */
  margin: 0; /* Memastikan tidak ada margin yang mendorong halaman */
  padding: 0;
}

.footer-wave svg {
  width: 100%;
  height: 100%;
  display: block;
  margin-bottom: -1px; /* Trik untuk memastikan SVG benar-benar "menggigit" dasar halaman */
}

.font-bold {
  font-weight: bold;
}
.text-justify {
  text-align: justify;
}

/* Styling untuk barisan tombol */
.no-print {
  align-items: center;
  border: 1px solid #e0e0e0;
}

.gap-2 {
  gap: 12px; /* Memberikan jarak antar tombol */
}

/* Mempercantik tampilan tombol agar lebih modern */
.v-btn {
  letter-spacing: 0.5px;
  font-weight: 500;
  border-radius: 8px; /* Membuat sudut tombol lebih halus */
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

/* Garis putus-putus untuk area summary agar terlihat modern */
.border-dashed {
  border-style: dashed !important;
  border-width: 1px !important;
  border-color: #bdbdbd !important;
}

/* Custom scrollbar untuk v-card-text */
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
  box-shadow: 0 4px 10px rgba(30, 64, 175, 0.4);
  transform: translateY(-1px);
}

.btn-toggle-total:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(30, 64, 175, 0.3);
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
    background-color 0.2s ease,
    transform 0.15s ease;
}

.eye-btn:hover {
  background-color: rgba(25, 118, 210, 0.12); /* primary soft */
  transform: scale(1.1);
}

.eye-btn:hover .v-icon {
  color: #1976d2; /* primary */
}
.row-divider {
  border-top: 0.5px solid rgba(0, 0, 0, 0.35);
}

:deep(.ql-toolbar.ql-snow) {
  border: none !important;
  border-top: 1px solid #f0f0f0 !important;
  border-bottom: 1px solid #f0f0f0 !important;
  padding: 4px 12px !important;
  background: #fafafa;
}

:deep(.ql-container.ql-snow) {
  border: none !important;
  font-family: "Roboto", Arial, sans-serif !important;
  font-size: 14px;
}

.custom-field :deep(.v-field__label) {
  font-size: 0.9rem;
  color: #757575;
}

.editor-wrapper {
  background: white;
}

.border-t {
  border-top: 1px solid #eee;
}

.border-right-md {
  @media (min-width: 960px) {
    border-right: 1px solid rgba(0, 0, 0, 0.12) !important;
  }
}
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.spk-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 600;
  color: #2b2b2b;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
}

.spk-title {
  letter-spacing: 0.3px;
}

.kode-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  transition: all 0.25s ease;

  &:hover {
    border-color: rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
}

.hide-for-pdf {
  display: none !important;
}

.export-pdf .no-print {
  display: none !important;
}

.btn-revisi {
  transition: all 0.2s ease;

  &:hover {
    background-color: #e68b02 !important;
    border-color: #ff9800 !important;
    color: white !important;
  }
}
</style>
