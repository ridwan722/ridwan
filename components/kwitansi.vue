<template>
  <v-container>
    <v-card
      id="kwitansi-to-print"
      class="mx-auto bg-white kwitansi-paper"
      max-width="800"
      rounded="0"
    >
      <v-row
        no-gutters
        class="pa-6 pb-2"
        v-if="props.datainv.handle_by_aresa == 'KAM'"
      >
        <v-col cols="2">
          <v-img
            src="https://imagedelivery.net/_tN3dTar-XzU6X9_PBgTbA/0b28f068-7fb3-4b86-950e-951de19d5900/heromobile"
            width="120"
            class="my-1"
          />
        </v-col>

        <v-col cols="10" class="text-left pl-4">
          <h1
            class="text-h5 font-weight-bold mb-0"
            style="letter-spacing: 1px !important"
          >
            PT. KARYA ARESA MANDIRI
          </h1>
          <div class="font-weight-bold mt-4" style="font-size: 10px">
            Head Office :
          </div>
          <div class="line-height-tight" style="font-size: 10px">
            Jl. Kebagusan Raya, Mawar No. 54 Jakarta Selatan, 12520 Indonesia<br />
            Telp : 021 - 2179 8064
          </div>
        </v-col>
      </v-row>

      <div
        class="text-left ml-6 font-weight-bold my-6"
        v-if="props.datainv.handle_by_aresa == 'ABK'"
        style="font-size: 34px"
      >
        KWITANSI
      </div>

      <div class="mx-6 mt-2 border-black">
        <v-row no-gutters class="text-caption">
          <v-col cols="6" class="border-right-black">
            <div
              class="d-flex border-bottom-black py-0 px-2 align-start"
              style="min-height: 24px"
            >
              <span class="info-label">To</span>
              <span class="px-2">:</span>
              <span class="font-weight-bold" style="font-size: 10px">
                <span v-if="showPic">{{ props.datainv.nama_group_pt }}</span>
                {{ props.datainv.nama_perusahaan }}
                <br v-if="showPic" />
                <span v-if="showPic">
                  Cab. {{ props.datainv.nama_cabang_perusahaan }}</span
                >
              </span>
            </div>
            <div
              class="d-flex border-bottom-black py-0 px-2 align-start"
              style="min-height: 24px"
            >
              <span class="info-label">Alamat</span>
              <span class="px-2">:</span>
              <span class="line-height-tight py-1" style="font-size: 10px">
                {{ props.datainv.alamat_cabang }}
              </span>
            </div>
            <div class="d-flex py-0 px-2 align-center" style="min-height: 24px">
              <span class="info-label">Attn</span>
              <span class="px-2">:</span>
              <span v-if="showPic">{{ props.datainv.pic }} </span>
              <span v-if="!showPic"> {{ props.datainv.nama_perusahaan }}</span>
            </div>
            <!-- <v-btn
              class="no-print"
              variant="tonal"
              size="x-small"
              color="primary"
              @click="showPic = !showPic"
            >
              <v-icon start size="16">
                {{ showPic ? "mdi-eye-off-outline" : "mdi-eye-outline" }}
              </v-icon>

              {{ showPic ? "Tampilkan Nama Perusahaan Saja" : "Kembalikan" }}
            </v-btn> -->

            <v-chip
              @click="showPic = !showPic"
              style="cursor: pointer"
              link
              v-ripple
              size="x-small"
              class="ml-1 no-print"
            >
              <v-icon start size="16">
                {{ showPic ? "mdi-eye-off-outline" : "mdi-undo-variant" }}
              </v-icon>

              {{ showPic ? "Tampilkan Nama Perusahaan Saja" : "Kembalikan" }}
            </v-chip>
          </v-col>

          <v-col cols="6">
            <div
              class="d-flex border-bottom-black py-0 px-2 align-center"
              style="min-height: 34px"
            >
              <span class="info-label-short">Invoice No.</span>
              <span class="px-2">:</span>
              <span>
                {{ props.datainv.no_invoice_kwitansi }}
              </span>
            </div>
            <div
              class="d-flex border-bottom-black py-0 px-2 align-center"
              style="min-height: 33px"
            >
              <span class="info-label-short">Date</span>
              <span class="px-2">:</span>
              <span>{{ formatinvDate(props.datainv.tanggal) }}</span>
            </div>
            <div class="d-flex py-0 px-2 align-start" style="min-height: 24px">
              <span class="info-label-short mt-1">Job No.</span>
              <span class="px-2">:</span>
              <span
                class="font-weight-medium mt-0"
                style="white-space: pre-line"
              >
                {{ props.datainv.perihal_invoice }}
              </span>
            </div>
          </v-col>
        </v-row>
      </div>

      <div class="my-2">
        <div
          class="text-center font-weight-bold"
          v-if="props.datainv.handle_by_aresa == 'KAM'"
        >
          KWITANSI
        </div>
      </div>

      <div class="mx-6 border-black receipt-content text-body-2">
        <v-row no-gutters class="align-center py-1">
          <v-col cols="3" class="px-3">
            <div class="font-weight-bold text-decoration-underline text-small">
              Sudah Terima Dari
            </div>
            <div class="text-smaller italic">Received From</div>
          </v-col>
          <v-col cols="1" class="text-center">:</v-col>
          <v-col cols="8" class="pr-4 font-weight-medium text-caption">
            <span v-if="showPic">
              {{ props.datainv.nama_group_pt }}
            </span>

            <br v-if="showPic" />

            {{ props.datainv.nama_perusahaan }}

            <span v-if="showPic">
              Cab.
              {{ props.datainv.nama_cabang_perusahaan }}
            </span>
          </v-col>
        </v-row>

        <v-row no-gutters class="align-center py-1">
          <v-col cols="3" class="px-3">
            <div class="font-weight-bold text-decoration-underline text-small">
              Untuk Pembayaran
            </div>
            <div class="text-smaller italic">In Payment Of</div>
          </v-col>
          <v-col cols="1" class="text-center">:</v-col>
          <v-col cols="8" class="pr-4 text-small">
            <span style="white-space: pre-line">{{
              props.datainv.perihal_invoice
            }}</span>
            <br />
            <span v-if="showPeriode">
              Periode :
              {{ props.datainv.items?.[0]?.periode_penawaran?.mulai }} s/d
              {{ props.datainv.items?.[0]?.periode_penawaran?.selesai }}
            </span>

            <v-chip
              @click="showPeriode = !showPeriode"
              style="cursor: pointer"
              link
              v-ripple
              size="x-small"
              class="ml-1 no-print"
            >
              <v-icon start>
                {{ showPeriode ? "mdi-eye-off" : "mdi-eye" }}
              </v-icon>
              Periode
            </v-chip>
          </v-col>
        </v-row>

        <v-row no-gutters class="align-center">
          <v-col cols="3" class="px-3 py-2">
            <div class="font-weight-bold text-decoration-underline text-small">
              Terbilang
            </div>
            <div class="text-smaller italic">The Amount Of</div>
          </v-col>
          <v-col cols="1" class="text-center">:</v-col>
          <v-col
            cols="8"
            class="fill-pattern font-italic font-weight-bold text-small"
            style="padding: 10px 0 10px 3px"
          >
            {{ jadirupiah(props.datainv.grandtotal) }} Rupiah
          </v-col>
        </v-row>

        <v-row no-gutters class="align-center">
          <v-col cols="3" class="px-3 py-2">
            <div class="font-weight-bold text-decoration-underline text-small">
              JUMLAH
            </div>
            <div class="text-smaller italic">Total</div>
          </v-col>
          <v-col cols="1" class="text-center font-weight-bold">:</v-col>
          <v-col cols="8" class="fill-pattern d-flex align-center">
            <span
              class="text-small font-weight-bold"
              style="padding: 10px 0 10px 3px"
              >Rp</span
            >
            <span class="text-small ml-10 font-weight-bold">{{
              rupiah(props.datainv.grandtotal)
            }}</span>
          </v-col>
        </v-row>
      </div>

      <v-row no-gutters class="mx-6 mt-4 pb-6">
        <v-col cols="7">
          <div class="text-smaller font-weight-bold mb-1">
            Please Remit Payment By Cheque / Transfer To :
          </div>
          <v-row
            no-gutters
            class="text-smaller font-weight-bold"
            v-if="props.datainv.handle_by_aresa == 'KAM'"
          >
            <v-col cols="4">Acc Name</v-col>
            <v-col cols="8">: PT. Karya Aresa Mandiri</v-col>
            <v-col cols="4">Bank Name</v-col>
            <v-col cols="8">: Bank BCA</v-col>
            <v-col cols="4">Acc Number</v-col>
            <v-col cols="8">: 540 5142 888</v-col>
          </v-row>
          <v-row no-gutters class="text-smaller font-weight-bold" v-else>
            <v-col cols="4">Acc Name</v-col>
            <v-col cols="8">: Abdul Khalid</v-col>
            <v-col cols="4">Bank Name</v-col>
            <v-col cols="8">: Bank Permata</v-col>
            <v-col cols="4">Acc Number</v-col>
            <v-col cols="8">: 4121 5181 50</v-col>
          </v-row>
        </v-col>
        <v-col cols="5" class="text-center pt-2">
          <div class="text-caption">Best Regards</div>
          <div
            style="margin-top: 100px"
            class="text-body-2 font-weight-bold text-decoration-underline"
          >
            Abdul Khalid
          </div>
        </v-col>
      </v-row>
    </v-card>

    <div class="no-print mt-2 d-flex justify-center">
      <v-btn
        color="primary"
        prepend-icon="mdi-printer"
        elevation="2"
        @click="handlePrint"
        class="text-none"
      >
        Print Kwitansi
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import type { invoiceM } from "~/types/InvoiceModel";
import { ref } from "vue";
const props = defineProps<{
  datainv: invoiceM;
}>();
const showPic = ref(true);
const showPeriode = ref(true);
const handlePrint = () => {
  const printContents = document.getElementById("kwitansi-to-print")?.innerHTML;
  if (!printContents) return;

  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, {
    position: "fixed",
    right: "0",
    bottom: "0",
    width: "0",
    height: "0",
    border: "0",
  });
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  // Tarik link stylesheet (untuk Vuetify dari Vite/CDN)
  let links = "";
  document
    .querySelectorAll('link[rel="stylesheet"]')
    .forEach((el) => (links += el.outerHTML));

  // Tarik style block (untuk style scoped)
  let styles = "";
  document.querySelectorAll("style").forEach((el) => (styles += el.innerHTML));

  doc.write(`
    <html>
      <head>
        <title>Kwitansi_${props.datainv.no_inv || "Print"}</title>
        ${links}
        <style>
          ${styles}
          @page { size: A4 portrait; margin: 0; }
          body { margin: 0; padding: 20px; background: white; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .kwitansi-paper { width: 100% !important; max-width: none !important; box-shadow: none !important; border: none !important; }
          .v-application { background: none !important; }
          /* Paksa background pattern muncul di Windows */
          .fill-pattern { background-color: #d2d2d2 !important; -webkit-print-color-adjust: exact; }
        </style>
      </head>
      <body>
        <div class="v-application v-theme--light">
          <div class="v-application--wrap">
            <div class="v-card v-theme--light v-card--density-default rounded-0 v-card--variant-flat kwitansi-paper">
              ${printContents}
            </div>
          </div>
        </div>
      </body>
    </html>
  `);

  doc.close();

  // Tunggu render selesai (terutama image dan font di Windows)
  iframe.contentWindow?.addEventListener("load", () => {
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 800);
  });
};

const formatinvDate = (tanggal: string) => {
  if (!tanggal) return "";

  const [tahun, bulan, hari] = tanggal.split("-");
  return `${hari}-${bulan}-${tahun}`;
};
</script>

<style scoped>
.kwitansi-paper {
  font-family: "Arial", sans-serif !important;
  color: black !important;
  line-height: 1.4;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}
.border-black {
  border: 1.5px solid black;
}
.border-right-black {
  border-right: 1.5px solid black;
}
.border-bottom-black {
  border-bottom: 1.5px solid black;
}
.info-label {
  min-width: 50px;
  font-weight: bold;
  font-size: 10px;
}
.info-label-short {
  min-width: 80px;
  font-size: 10px;
  font-weight: bold;
}
.text-smaller {
  font-size: 0.7rem;
}
.italic {
  font-style: italic;
}
.text-small {
  font-size: 11px;
}
.fill-pattern {
  background-image: radial-gradient(#aaa 10%, transparent 10%);
  background-size: 3px 3px;
  background-color: #d2d2d2 !important;
}
.line-height-tight {
  line-height: 1.2;
}
/* .no-print {
  display: block;
} */

@media print {
  .no-print {
    display: none !important;
  }
  .kwitansi-paper {
    box-shadow: none !important;
  }
}
</style>
