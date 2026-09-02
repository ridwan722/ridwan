<template>
  <div class="page-container pa-6">
    <div v-if="loading" class="text-center py-12 no-print">
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      ></v-progress-circular>
      <div class="mt-3 text-body-2 text-grey-darken-1 font-weight-medium">
        Memuat detail Berita Acara...
      </div>
    </div>

    <div v-else-if="!detailData" class="text-center py-12 empty-state no-print">
      <v-icon size="64" color="error">mdi-alert-circle-outline</v-icon>
      <h3 class="text-h6 font-weight-bold mt-3 text-grey-darken-3">
        Data Berita Acara Tidak Ditemukan
      </h3>
      <p class="text-body-2 text-grey">
        Berita Acara yang Anda cari mungkin telah dihapus atau ID tidak valid.
      </p>
      <v-btn
        color="grey-darken-1"
        variant="outlined"
        prepend-icon="mdi-arrow-left"
        class="text-none rounded-lg mt-4"
        @click="kembali"
      >
        Kembali
      </v-btn>
    </div>

    <div v-else class="laporan-wrapper">
      <div class="d-flex justify-space-between align-center mb-6 no-print">
        <div class="d-flex align-center ga-3">
          <v-btn
            icon="mdi-arrow-left"
            variant="tonal"
            color="grey-darken-2"
            class="rounded-lg"
            density="comfortable"
            @click="kembali"
          ></v-btn>
          <div>
            <h1 class="text-h5 font-weight-bold text-slate-900">
              Detail Berita Acara  <span class="text-primary">#{{ detailData.id }}</span>
            </h1>
            <p class="text-caption text-grey">
              Ringkasan dokumen inspeksi alat
            </p>
          </div>
        </div>
        <div class="d-flex ga-2">
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-printer"
            class="text-none rounded-lg px-4"
            elevation="0"
            @click="cetakBeritaAcara"
          >
            Cetak Berita Acara
          </v-btn>
        </div>
      </div>

      <div class="printable-area">
        <div class="modern-card info-card mb-6 pa-6">
          <div class="d-flex justify-space-between align-start ga-4">
            <div class="flex-grow-1">
              <!-- <span class="badge-category mb-2">Laporan Resmi Inspeksi</span> -->
              <h2 class="text-h5 font-weight-bold text-slate-900 mb-2">
                {{ detailData.judul_berita_acara }}
              </h2>
              <v-chip
                :href="`/admin/master/kategori/item/${detailData.id_kategori_item}`"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                variant="tonal"
                size="small"
                append-icon="mdi-open-in-new"
                link
                class="cursor-pointer mb-3"
              >
                {{ detailData.nama_kategori_item }}
              </v-chip>
              <div
                class="d-flex flex-wrap align-center ga-3 text-body-2 text-grey-darken-1"
              >
                <div class="d-flex align-center ga-1">
                  <v-icon size="18" color="grey-darken-1" class="no-print"
                    >mdi-domain</v-icon
                  >
                  <span class="font-weight-medium text-slate-800">{{
                    detailData.nama_perusahaan
                  }}</span>
                  <span v-if="detailData.nama_cabang"
                    >({{ detailData.nama_cabang }})</span
                  >
                </div>
                <span>•</span>
                <div class="d-flex align-center ga-1">
                  <v-icon size="18" color="grey-darken-1" class="no-print"
                    >mdi-account-outline</v-icon
                  >
                  <span>{{ detailData.createdBy }}</span>
                </div>
                <span>•</span>
                <div class="d-flex align-center ga-1">
                  <v-icon size="18" color="grey-darken-1" class="no-print"
                    >mdi-calendar-clock-outline</v-icon
                  >
                  <span>{{ rubahtanggalbulanunix(detailData.createdAt) }}</span>
                </div>
              </div>
            </div>

            <div class="logo-container">
              <img src="/Logo-SNS.png" alt="Logo Aresa" class="header-logo" />
            </div>
          </div>
        </div>

        <div class="modern-card mb-6 pa-0 overflow-hidden">
          <div class="card-section-header pa-4 border-b">
            <h3 class="text-subtitle-1 font-weight-bold text-slate-800">
              Daftar Alat & Hasil Inspeksi
            </h3>
          </div>

          <div class="table-responsive">
            <table class="modern-table">
              <thead>
                <tr>
                  <th style="width: 50px" class="text-center">No</th>
                  <th style="width: 20%" class="text-left">Nama Alat</th>
                  <th style="width: 15%" class="text-left">Kapasitas</th>
                  <th style="width: 20%" class="text-left">Merk / Serial No</th>
                  <th class="text-left">Kesimpulan</th>
                  <th style="width: 110px" class="text-center">Ijin</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in detailData.daftar_alat || []"
                  :key="index"
                >
                  <td class="text-center font-weight-medium text-grey-darken-1">
                    {{ index + 1 }}
                  </td>
                  <td class="text-left font-weight-semibold text-slate-800">
                    {{ item.alat }}
                  </td>
                  <td class="text-left">{{ item.kapasitas || "-" }}</td>
                  <td class="text-left text-slate-700 font-mono">
                    {{ item.merk_serial || "-" }}
                  </td>
                  <td class="text-left">
                    <span class="text-slate-700">{{
                      item.kesimpulan || "-"
                    }}</span>
                  </td>
                  <td class="text-center">
                    <span
                      :class="[
                        'status-chip',
                        item.ijin && item.ijin.toLowerCase().includes('ada')
                          ? 'status-success'
                          : 'status-warning',
                      ]"
                    >
                      {{ item.ijin || "-" }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-if="
              !detailData.daftar_alat || detailData.daftar_alat.length === 0
            "
            class="text-center py-8 text-grey"
          >
            Tidak ada daftar alat pada laporan ini.
          </div>
        </div>

        <div class="modern-card pa-0 overflow-hidden">
          <div class="card-section-header pa-4 border-b">
            <h3 class="text-subtitle-1 font-weight-bold text-slate-800">
              Dokumentasi Lapangan
            </h3>
          </div>

          <div class="table-responsive">
            <table class="modern-table">
              <thead>
                <tr>
                  <th style="width: 50px" class="text-center">No.</th>
                  <th style="width: 280px" class="text-left">
                    Foto Dokumentasi
                  </th>
                  <th class="text-left">Keterangan</th>
                  <th class="text-left">Catatan Tambahan</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in detailData.dokumentasi || []"
                  :key="index"
                >
                  <td class="text-center font-weight-medium text-grey-darken-1">
                    {{ index + 1 }}
                  </td>
                  <td class="text-left">
                    <div class="image-gallery">
                      <template v-if="item.images && item.images.length">
                        <div
                          v-for="(img, imgIdx) in item.images"
                          :key="imgIdx"
                          class="img-box clickable"
                          @click="openImageDialog(img)"
                        >
                          <img :src="img" alt="Dokumentasi" />
                        </div>
                      </template>
                      <span v-else class="text-caption text-grey italic"
                        >Tidak ada foto</span
                      >
                    </div>
                  </td>
                  <td class="text-left text-slate-700 align-top">
                    {{ item.keterangan || "-" }}
                  </td>
                  <td class="text-left text-slate-700 align-top">
                    {{ item.notes || "-" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-if="
              !detailData.dokumentasi || detailData.dokumentasi.length === 0
            "
            class="text-center py-8 text-grey"
          >
            Tidak ada data dokumentasi.
          </div>
        </div>

        <div class="system-footer mt-6 text-center">
          <em>Generated by System - ARESA</em>
        </div>
      </div>
    </div>

    <v-dialog v-model="imageDialog" max-width="800" class="no-print">
      <v-card class="rounded-lg overflow-hidden position-relative">
        <v-btn
          icon="mdi-close"
          size="x-small"
          variant="flat"
          color="grey-darken-3"
          class="position-absolute"
          style="top: 10px; right: 10px; z-index: 10"
          @click="imageDialog = false"
        ></v-btn>
        <div class="d-flex justify-center align-center pa-2">
          <img
            :src="selectedImage"
            alt="Preview Foto"
            style="max-width: 100%; max-height: 80vh; object-fit: contain"
          />
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import _ from "lodash";
import moment from "moment";
import { useBeritaAcaraStore } from "~/stores/beritaAcaraStore";
import type { CompanyInspectionReport } from "~/types/beritaAcaraModel";

definePageMeta({
  layout: "admin",
});

const route = useRoute();
const router = useRouter();
const beritaAcaraStore = useBeritaAcaraStore();

// State
const loading = ref(true);
const detailData = ref<CompanyInspectionReport | null>(null);

// State Dialog Gambar
const imageDialog = ref(false);
const selectedImage = ref("");

// Fungsi Buka Dialog Gambar
const openImageDialog = (imgUrl: string) => {
  selectedImage.value = imgUrl;
  imageDialog.value = true;
};

// Fungsi Kembali ke Halaman Sebelumnya
const kembali = () => {
  router.back();
};

// Ambil data detail saat halaman di-load
const loaddetailBeritaAcara = async () => {
  try {
    loading.value = true;
    await beritaAcaraStore.tarikDataBeritaAcaraAct();
    const beritaAcaraId = route.params.id as string;

    if (beritaAcaraId) {
      const allBeritaAcara = beritaAcaraStore.getDataBeritaAcara;
      const match = _.find(allBeritaAcara, (o: any) => o.id === beritaAcaraId);

      if (match) {
        detailData.value = _.cloneDeep(match);
      }
    }
  } catch (error) {
    console.error("Gagal memuat detail laporan:", error);
  } finally {
    loading.value = false;
  }
};

// Fungsi Print Laporan
const cetakBeritaAcara = () => {
  window.print();
};

onMounted(() => {
  loaddetailBeritaAcara();
});

// Format Tanggal
const formatTanggal = (dateString: string) => {
  if (!dateString) return "-";
  return moment(dateString).format("DD MMMM YYYY, HH:mm");
};
</script>

<style scoped>
.laporan-wrapper {
  margin: 0 auto;
}

/* Base Modern Card Style */
.modern-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

.info-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.border-b {
  border-bottom: 1px solid #e2e8f0;
}

.card-section-header {
  background-color: #f8fafc;
}

/* Header & Logo Container */
.logo-container {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  padding-top: 2px;
}

.header-logo {
  height: 75px;
  width: auto;
  object-fit: contain;
}

/* Badge Categories */
.badge-category {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 9999px;
}

/* Modern Tables */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  table-layout: fixed;
}

.modern-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.04em;
  text-align: left;
  word-wrap: break-word;
}

.modern-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.modern-table td.align-top {
  vertical-align: top;
}

.modern-table tbody tr:last-child td {
  border-bottom: none;
}

/* Status Chips */
.status-chip {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
}

.status-success {
  background-color: #dcfce7;
  color: #15803d;
}

.status-warning {
  background-color: #fef3c7;
  color: #b45309;
}

/* Gallery & Images */
.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.img-box {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  overflow: hidden;
  background-color: #f8fafc;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

/* Effect hover untuk menandakan gambar dapat diklik */
.img-box.clickable {
  cursor: pointer;
}

.img-box.clickable:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* System Footer */
.system-footer {
  font-size: 11px;
  color: #94a3b8;
  letter-spacing: 0.03em;
}

.text-slate-900 {
  color: #0f172a;
}
.text-slate-800 {
  color: #1e293b;
}
.text-slate-700 {
  color: #334155;
}
.font-mono {
  font-family: monospace;
}
</style>

<style>
@media print {
  /* 1. Hilangkan tanggal, waktu, dan URL halaman bawaan browser */
  @page {
    margin: 0;
    size: A4 portrait;
  }

  /* 2. Sembunyikan navigasi, tombol, dan overlay Vuetify */
  .no-print,
  .v-navigation-drawer,
  .v-app-bar,
  .v-footer,
  .v-overlay-container {
    display: none !important;
  }

  /* 3. Reset layout halaman */
  html,
  body,
  #__nuxt,
  .v-application,
  .v-application--wrap,
  main.v-main {
    background: #ffffff !important;
    padding: 0 !important;
    margin: 0 !important;
    position: static !important;
    overflow: visible !important;
    height: auto !important;
    min-height: auto !important;
  }

  main.v-main {
    display: block !important;
  }

  .page-container {
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Berikan padding internal pada area cetak pengganti margin kertas */
  .printable-area {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 15mm 12mm !important;
    box-sizing: border-box !important;
  }

  /* 4. Style komponen saat dicetak */
  .modern-card {
    border: 1px solid #cbd5e1 !important;
    box-shadow: none !important;
    margin-bottom: 12px !important;
    border-radius: 6px !important;
    padding: 12px !important;
    page-break-inside: avoid;
  }

  .modern-table th,
  .modern-table td {
    padding: 8px 10px !important;
    font-size: 11px !important;
  }

  .status-chip {
    border: 1px solid #ccc;
    padding: 2px 6px !important;
    font-size: 10px !important;
  }

  .img-box {
    width: 100px !important;
    height: 100px !important;
  }

  .header-logo {
    height: 60px !important;
  }

  .system-footer {
    margin-top: 16px !important;
    font-size: 10px !important;
    color: #64748b !important;
  }
}
</style>