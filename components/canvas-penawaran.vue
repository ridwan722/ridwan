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

  <div
    v-if="
      detailpenawaran.status != 'SPK' &&
      detailpenawaran.status != 'Proses' &&
      detailpenawaran.status != 'Pemberkasan' &&
      detailpenawaran.status != 'Invoice'
    "
  >
    <div id="offer-to-print" class="offer-card">
      <div
        class="watermark"
        v-if="props.detailpenawaran.handle_by_aresa == 'KAM'"
      >
        <img
          src="https://imagedelivery.net/_tN3dTar-XzU6X9_PBgTbA/1a116c03-0715-4e9f-b231-15ff67f6b400/heromobile"
        />
      </div>
      <div
        class="header-section"
        v-if="props.detailpenawaran.handle_by_aresa == 'KAM'"
      >
        <div class="header-logo">
          <img
            src="https://imagedelivery.net/_tN3dTar-XzU6X9_PBgTbA/0b28f068-7fb3-4b86-950e-951de19d5900/heromobile"
          />
        </div>
        <div class="header-address">
          <h2>PT. KARYA ARESA MANDIRI</h2>
          <p>
            Inspeksi Saluran Kalimalang No. 18, RT 007 RW 008<br />Pondok
            Kelapa, Duren Sawit
          </p>
          <p>
            Workshop: Jl. Kebagusan Raya, Mawar No. 54<br />Ps. Minggu, Jakarta
            Selatan 12520
          </p>
          <p>Telp. +6221 2179 8064</p>
        </div>
      </div>

      <div class="content-body" style="font-size: 11px">
        <p class="text-right mb-6">
          Jakarta, {{ rubahtanggalpenawaran(props.detailpenawaran.tanggal) }}
        </p>

        <div class="info-row">
          <div class="label">Nomor</div>
          <div class="value">
            : {{ props.detailpenawaran.no_penawaran || "-" }}
          </div>
        </div>
        <div class="info-row">
          <div class="label">Perihal</div>
          <div class="value">
            :
            <span>{{ props.detailpenawaran.perihal || "-" }}</span>
          </div>
        </div>

        <div class="recipient-block">
          <p>Kepada Yth :</p>
          <span>
            <span>{{ props.detailpenawaran.nama_group_pt }}</span>
            {{
              props.detailpenawaran.id_perusahaan
                ?.replace(/-/g, " ")
                ?.replace(/\b\w/g, (c) => c.toUpperCase()) || ""
            }}
            <span v-if="props.detailpenawaran.nama_cabang_perusahaan"
              >Cab.</span
            >
            {{ props.detailpenawaran.nama_cabang_perusahaan || "" }}
          </span>

          <p>Di</p>
          <p>{{ props.detailpenawaran.alamat_cabang || "-" }}.</p>
        </div>

        <p class="mt-6"><i>Dengan Hormat,</i></p>
        <button
          class="btn-toggle-total2 no-print mr-2"
          @click="showFull = !showFull"
        >
          {{ showFull ? "Versi Singkat" : "Versi Lengkap" }}
        </button>

        <p class="text-justify">
          <span v-if="showFull">
            <span v-if="props.detailpenawaran.handle_by_aresa == 'ABK'"
              >Kami selaku Perorangan</span
            >
            <span v-else>Kami selaku Perusahaan</span>
            yang bergerak dibidang Jasa Pengurusan Perizinan bermaksud untuk
          </span>
          <span v-if="!showFull">Dengan ini kami</span> memberikan
          {{ props.detailpenawaran.perihal }} kepada
          {{ props.detailpenawaran.nama_group_pt }}
          {{ props.detailpenawaran.nama_perusahaan }} Cab.
          {{ props.detailpenawaran.nama_cabang_perusahaan }}. Adapun penawaran
          yang kami berikan adalah sebagai berikut:
        </p>

        <div
          class="btn-wrapper no-print mt-2"
          style="border: none"
          v-if="showTable"
        >
          <button
            class="btn-toggle-total mr-2"
            @click="showHeader = !showHeader"
          >
            {{ showHeader ? "Sembunyikan Header" : "Tampilkan Header" }}
          </button>

          <button
            class="btn-toggle-total mr-2"
            @click="showPeriode = !showPeriode"
          >
            {{ showPeriode ? "Sembunyikan Periode" : "Tampilkan Periode" }}
          </button>

          <button class="btn-toggle-total mr-2" @click="showQty = !showQty">
            {{ showQty ? "Sembunyikan Qty" : "Tampilkan Qty" }}
          </button>

          <button
            class="btn-toggle-total mr-2"
            @click="showHargaUnit = !showHargaUnit"
          >
            {{
              showHargaUnit
                ? "Sembunyikan Harga / Unit"
                : "Tampilkan Harga / Unit"
            }}
          </button>

          <button
            class="btn-toggle-total mr-2"
            @click="showTotalItem = !showTotalItem"
          >
            {{
              showTotalItem ? "Sembunyikan Sub Total" : "Tampilkan Sub Total"
            }}
          </button>

          <button
            class="btn-toggle-total mr-2"
            @click="showDividerItem = !showDividerItem"
          >
            {{
              showDividerItem
                ? "Sembunyikan Underline Pekerjaan"
                : "Tampilkan Underline Pekerjaan"
            }}
          </button>
          <button
            @click="resetHiddenRows"
            class="btn-toggle-total"
            :disabled="!hiddenRows.length"
          >
            Reset Item
          </button>
        </div>

        <button
          class="btn-toggle-total1 mt-2"
          @click="showTable = !showTable"
        >
          {{ showTable ? "Sembunyikan Table" : "Tampilkan Table" }}
        </button>

        <div class="d-flex align-center ga-2 my-6" v-if="!showTable">
          <v-sheet
            v-if="!showInputGlobal"
            border
            rounded="lg"
            @click="showInputGlobal = true"
            class="d-inline-flex align-center px-4 py-1 cursor-pointer no-print"
          >
            <v-icon size="18" class="mr-2">mdi-plus</v-icon>
            <span>Add text</span>
          </v-sheet>

          <v-text-field
            v-if="showInputGlobal"
            v-model="labelGlobal"
            variant="plain"
            density="compact"
            hide-details
            class="text-left-input flex-grow-1"
          />

          <v-sheet
            v-if="showInputGlobal"
            border
            rounded="lg"
            color="red"
            @click="showInputGlobal = false"
            class="d-inline-flex align-center px-1 mt-2 py-1 cursor-pointer"
          >
            <v-icon size="11">mdi-close</v-icon>
          </v-sheet>
        </div>

        <!-- <strong>Rp {{ rupiah(props.detailpenawaran.total) }}</strong> -->

        <table class="modern-table" v-if="showTable">
          <thead
            class="row-divider2"
            :style="{
              fontSize: '9px',
              backgroundColor: warnaBackgroundCustom,
            }"
            v-if="showQty || showHargaUnit || showTotalItem || showHeader"
          >
            <tr v-if="showHeader">
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
              <th style="width: 65px" v-if="showQty" class="text-center">
                QTY
              </th>
              <th style="width: 115px" v-if="showHargaUnit" class="text-right">
                HARGA / UNIT
              </th>
              <th v-if="showTotalItem" style="width: 111px" class="text-right">
                <v-text-field
                  v-model="labelSubTotal"
                  variant="plain"
                  density="compact"
                  hide-details
                  class="text-right-input"
                />
              </th>

              <th class="no-print" style="width: 50px" />
            </tr>
          </thead>

          <tbody ref="tableBodyRef" style="font-size: 11px">
            <tr
              v-for="item in combinedItems"
              :key="item.id"
              :class="{
                'row-divider-bottom':
                  (!item.isExtra &&
                    !hiddenRows.includes(item.originalIndex) &&
                    showDividerItem) ||
                  (item.isExtra && showDividerItemtambahan),
              }"
            >
              <td
                colspan="100%"
                v-if="!item.isExtra"
                v-show="!hiddenRows.includes(item.originalIndex)"
                style="padding: 0; border: none"
              >
                <table
                  style="
                    width: 100%;
                    font-size: 11px;
                    border-collapse: collapse;
                  "
                >
                  <tr>
                    <td style="width: 20px" class="bullet-cell drag-handle">
                      &#10148;
                    </td>
                    <td class="text-left">
                      {{ item.nama_kategori_item }}
                      <br v-if="item.ukuran?.length" />
                      <span v-if="item.ukuran?.length">
                        ( {{ item.ukuran.join(", ") }} )
                      </span>
                      <br
                        v-if="
                          showPeriode &&
                          item.periode_penawaran?.mulai &&
                          item.periode_penawaran?.selesai
                        "
                      />
                      <span
                        v-if="
                          showPeriode &&
                          item.periode_penawaran?.mulai &&
                          item.periode_penawaran?.selesai
                        "
                      >
                        Periode
                        {{ formatTanggal(item.periode_penawaran?.mulai) }} s/d
                        {{ formatTanggal(item.periode_penawaran?.selesai) }}
                      </span>
                    </td>
                    <td class="text-center" style="width: 65px" v-if="showQty">
                      {{ item.jumlahUnit }} Unit
                    </td>
                    <td
                      class="text-right"
                      style="width: 115px"
                      v-if="showHargaUnit"
                    >
                      <div v-if="item.nominal">
                        Rp {{ rupiah(item.nominal) }}
                      </div>
                    </td>
                    <td
                      class="text-right"
                      style="width: 115px"
                      v-if="showTotalItem"
                    >
                      <div v-if="item.nominal > 0">
                        Rp {{ rupiah(item.nominal * item.jumlahUnit) }}
                      </div>

                      <div v-else>Free</div>
                    </td>
                    <td
                      style="width: 30px; border: none"
                      class="text-right no-print"
                    >
                      <v-tooltip location="right">
                        <template #activator="{ props }">
                          <button
                            v-bind="props"
                            class="text-xs eye-btn"
                            @click.stop="toggleRow(item.originalIndex)"
                          >
                            <v-icon size="14">mdi-eye</v-icon>
                          </button>
                        </template>
                        <span style="font-size: 11px; padding: 2px 4px">
                          Sembunyikan item
                        </span>
                      </v-tooltip>
                    </td>
                  </tr>
                </table>
              </td>

              <td
                colspan="100%"
                v-else-if="item.isExtra"
                style="padding: 0; border: none"
              >
                <table
                  style="
                    width: 100%;
                    font-size: 11px;
                    border-collapse: collapse;
                  "
                >
                  <tr>
                    <td style="width: 20px" class="bullet-cell drag-handle">
                      &#10148;
                    </td>
                    <td class="text-left" style="white-space: pre-line">
                      {{ item.keterangan_penawaran }}
                    </td>
                    <td style="width: 50px" v-if="showQty"></td>
                    <td style="width: 85px" v-if="showHargaUnit"></td>
                    <td
                      class="text-right"
                      style="width: 100px"
                      v-if="showNominalTambahan && showTotalItem"
                    >
                      <div v-if="item.nominal_tambahan">
                        Rp {{ rupiah(item.nominal_tambahan) }}
                      </div>
                    </td>
                    <td
                      style="width: 30px; border: none"
                      class="text-right no-print"
                    >
                      <button class="text-xs eye-btn">
                        <v-icon size="14">mdi-eye-lock-outline</v-icon>
                      </button>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        <table class="modern-table" v-if="showTotal && showTable">
          <tr>
            <td>
              <strong>Total</strong>
              <strong style="margin-left: 37px"
                >: Rp {{ rupiah(props.detailpenawaran.total) }}</strong
              >
            </td>
          </tr>

          <tr>
            <td colspan="4" class="text-left" style="width: 30%">
              <div style="display: flex">
                <strong>Terbilang</strong>

                <strong style="margin-left: 9px">
                  : {{ jadirupiah(props.detailpenawaran.total) }}

                  <!-- Kalau kata sedikit = tetap sebaris -->
                  <template
                    v-if="
                      jadirupiah(props.detailpenawaran.total).split(' ')
                        .length < 12
                    "
                  >
                    <span>Rupiah</span>
                  </template>

                  <!-- Kalau terlalu panjang = turun -->
                  <template v-else>
                    <span style="margin-left: 9px">Rupiah</span>
                  </template>
                </strong>
              </div>
            </td>
          </tr>
        </table>

        <div class="table-action" v-if="showTable">
          <button
            class="btn-toggle-total no-print mr-2"
            @click="showDividerItemtambahan = !showDividerItemtambahan"
          >
            {{
              showDividerItemtambahan
                ? "Sembunyikan Underline"
                : "Tampilkan Underline"
            }}
          </button>

          <button
            class="btn-toggle-total no-print mr-2"
            @click="showNominalTambahan = !showNominalTambahan"
          >
            {{
              showNominalTambahan
                ? "Sembunyikan Nominal Tambahan"
                : "Tampilkan Nominal Tambahan"
            }}
          </button>

          <button
            class="btn-toggle-total no-print mr-2"
            @click="showTotal = !showTotal"
          >
            {{
              showTotal
                ? "Sembunyikan Total & Terbilang"
                : "Tampilkan Total & Terbilang"
            }}
          </button>
        </div>
        <p class="mb-5" v-if="showTable">
          Demikian surat penawaran ini kami buat atas perhatian dan kerjasamanya
          kami ucapkan terimakasih.
        </p>

        <div class="signature-grid">
          <div class="sig-column">
            <p>Hormat kami,</p>
            <v-img width="77px" src="/public/TTD.png" />
            <p><strong>Abdul Khalid</strong></p>
            <p v-if="props.detailpenawaran.handle_by_aresa == 'KAM'">
              Manager Operational
            </p>
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

      <div
        class="footer-wave"
        v-if="props.detailpenawaran.handle_by_aresa == 'KAM'"
      >
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
import Sortable from "sortablejs";

const labelSubTotal = ref("SUB TOTAL");

const labelGlobal = ref("Isi...");
// 1. PROPS DI BARIS UTAMA
const props = defineProps<{
  detailpenawaran: penawaranM;
}>();

// 2. STATE REFS
const dialogWarna = ref(false);
const warnaBackgroundCustom = ref("#feff02");
const showTable = ref(true);
const showInputGlobal = ref(false);
const showTotal = ref(true);
const showTotalItem = ref(true);
const showQty = ref(true);
const showHeader = ref(true);
const showFull = ref(true);
const showHargaUnit = ref(true);
const showPeriode = ref(true);
const showDividerItem = ref(true);
const showDividerItemtambahan = ref(true);
const showNominalTambahan = ref(true);

const hiddenRows = ref<number[]>([]);
const combinedItems = ref<any[]>([]);
const tableBodyRef = ref<HTMLElement | null>(null);

// 3. FUNGSI LOGIKA GABUNG DATA
const initCombinedItems = () => {
  const mainItems = (props.detailpenawaran?.items || []).map((item, index) => ({
    ...item,
    id: `main-${index}`,
    isExtra: false,
    originalIndex: index,
  }));

  const extraItems = (props.detailpenawaran?.item_tambahan || []).map(
    (extra, index) => ({
      ...extra,
      id: `extra-${index}`,
      isExtra: true,
      originalIndex: index,
    }),
  );

  combinedItems.value = [...mainItems, ...extraItems];
};

// 4. WATCH DAN LIFECYCLE
watch(
  () => props.detailpenawaran,
  () => {
    initCombinedItems();
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  if (tableBodyRef.value) {
    Sortable.create(tableBodyRef.value, {
      handle: ".drag-handle",
      animation: 150,
      ghostClass: "sortable-ghost",
      onEnd: (evt) => {
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;

        if (oldIndex !== undefined && newIndex !== undefined) {
          const movedItem = combinedItems.value.splice(oldIndex, 1)[0];
          combinedItems.value.splice(newIndex, 0, movedItem);
        }
      },
    });
  }
});

const toggleRow = (originalIndex: number) => {
  if (hiddenRows.value.includes(originalIndex)) {
    hiddenRows.value = hiddenRows.value.filter((i) => i !== originalIndex);
  } else {
    hiddenRows.value.push(originalIndex);
  }
};

const resetHiddenRows = () => {
  hiddenRows.value = [];
};

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
        <title>Surat Penawaran - ${props.detailpenawaran?.nomor}</title>

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
  width: 80px;
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
