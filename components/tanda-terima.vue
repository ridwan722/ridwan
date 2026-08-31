<template>
  <div
    v-if="props.datainv"
    class="flex flex-col items-center p-8 bg-gray-100 min-h-screen container-master"
  >
    <div ref="printArea" class="receipt-card">
      <div class="top-header" v-if="props.datainv.handle_by_aresa == 'KAM'">
        <img
          src="https://imagedelivery.net/_tN3dTar-XzU6X9_PBgTbA/0b28f068-7fb3-4b86-950e-951de19d5900/heromobile"
          class="logo"
        />
        <div class="header-address">
          <h5>PT. KARYA ARESA MANDIRI</h5>
          <p>
            Jl. Kebagusan Raya, Mawar No. 54<br />Jakarta Selatan – Indonesia
            12520<br />021 2179 8064 / 0812 9656 8990
          </p>
        </div>
      </div>

      <div class="header-title">
        <h1>TANDA TERIMA</h1>
      </div>

      <div class="content">
        <div class="row">
          <div class="label">Tanggal Terima</div>
          <div class="colon">:</div>
          <div class="value">_____/____________20____</div>
        </div>
        <div class="row">
          <div class="label">No Invoice</div>
          <div class="colon">:</div>
          <div class="value">{{ props.datainv.no_inv }}</div>
        </div>
        <div class="row">
          <div class="label">Telah diterima dari</div>
          <div class="colon">:</div>
          <div class="value" v-if="props.datainv.handle_by_aresa == 'KAM'">
            PT. KARYA ARESA MANDIRI
          </div>
          <div class="value" v-else>ABDUL KHALID</div>
        </div>
        <div class="row">
          <div class="label">UP</div>
          <div class="colon">:</div>
          <div class="value text-uppercase">{{ props.datainv.nama_perusahaan }}</div>
        </div>
        <div class="row">
          <div class="label">Berupa</div>
          <div class="colon">:</div>
          <div class="value" style="text-transform: uppercase">
            INVOICE & KWITANSI ASLI {{ props.datainv.perihal_invoice }}
            <span v-if="showPt">, {{ props.datainv.nama_group_pt }}
             {{ props.datainv.nama_perusahaan }} CAB.
            {{ props.datainv.nama_cabang_perusahaan }}, PERIODE
            {{
              props.datainv.items?.[0]?.periode_penawaran?.mulai.split("-")[0]
            }}
            -
            {{
              props.datainv.items?.[0]?.periode_penawaran?.selesai.split("-")[0]
            }} 
              </span>
               <v-chip
              @click="showPt = !showPt"
              style="cursor: pointer"
              link
              v-ripple
              size="x-small"
              class="no-print"
            >
              <v-icon start size="16">
                {{ showPt ? "mdi-eye-outline" : "mdi-undo-variant" }}
              </v-icon>

              {{ showPt ? "Sembunyikan Perusahaan & Periode" : "Tampilkan Perusahaan & Periode" }}
            </v-chip>
          </div>
          
        </div>
        
      </div>

      <div class="footer">
        <div class="date-location">Jakarta, _____/____________20____</div>

        <div class="signature-section">
          <div class="sig-box">
            <p>Yang Menerima</p>
            <div class="sig-space"></div>
            <p>
              (
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )
            </p>
          </div>
          <div class="sig-box">
            <p>Yang Menyerahkan</p>
            <div class="sig-space"></div>
            <p>
              (
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )
            </p>
          </div>
        </div>
      </div>
    </div>
    <button @click="printOnlyCard" class="print-btn">Cetak Tanda Terima</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { invoiceM } from "~/types/InvoiceModel";
const props = defineProps<{
  datainv: invoiceM;
}>();

const printArea = ref(null);
const showPt = ref(true);
const printOnlyCard = () => {
  // Menggunakan outerHTML agar atribut data-v-xxx milik Vue tetap terbawa
  const content = printArea.value.outerHTML;

  // Mengambil SEMUA style (tag <style> dan link CSS external/Tailwind)
  const styles = Array.from(
    document.querySelectorAll('style, link[rel="stylesheet"]'),
  )
    .map((el) => el.outerHTML)
    .join("\n");

  const printWindow = window.open("", "_blank", "width=900,height=800");

  printWindow.document.write(`
    <html>
      <head>
        <title>Cetak Tanda Terima</title>
        ${styles}
        <style>
          /* Menjaga konsistensi warna dan layout di Windows/Chrome */
          body { 
            margin: 0; 
            padding: 20px; 
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-btn { display: none !important; }
          .receipt-card { 
            box-shadow: none !important; 
            margin: 0 auto !important;
          }
          @page { size: auto; margin: 5mm; }
        </style>
      </head>
      <body>
          ${content}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  // Memastikan gambar termuat sebelum dialog print muncul
  const images = printWindow.document.querySelectorAll("img");
  let loadedCount = 0;

  const triggerPrint = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  if (images.length > 0) {
    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
        if (loadedCount === images.length) triggerPrint();
      } else {
        img.onload = () => {
          loadedCount++;
          if (loadedCount === images.length) triggerPrint();
        };
      }
    });
  } else {
    triggerPrint();
  }
};
</script>

<style scoped>
/* CSS ASLI ANDA TANPA PERUBAHAN */
.container-master {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  font-family: Arial, sans-serif;
}

.print-btn {
  margin-top: 20px;
  padding: 12px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.receipt-card {
  background: white;
  width: 850px;
  padding: 40px 50px;
  border: 1px solid #ffffff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  color: black;
  font-family: Arial, sans-serif;
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.logo {
  width: 80px;
  height: auto;
}

.header-address {
  text-align: right;
}

.header-address h5 {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
}

.header-address p {
  font-size: 12px;
  margin: 2px 0;
  line-height: 1.4;
}

.header-title {
  border-bottom: 1px solid black;
  text-align: center;
  margin-bottom: 25px;
  padding-bottom: 10px;
}

.header-title h1 {
  font-size: 24px;
  margin: 0;
  font-weight: bold;
}

.content {
  font-weight: bold;
  font-size: 11px;
}

.row {
  display: flex;
  margin-bottom: 0px;
  align-items: flex-start;
}

.label {
  width: 180px;
  flex-shrink: 0;
}

.colon {
  width: 20px;
  flex-shrink: 0;
}

.value {
  flex: 1;
}

.footer {
  border-top: 1px solid black;
  margin-top: 30px;
  font-size: 11px;
}

@media print {
  .no-print {
    display: none !important;
  }
}

.date-location {
  text-align: right;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 30px;
  padding-right: 20px;
}

.signature-section {
  display: flex;
  justify-content: space-between;
}

.sig-box {
  text-align: center;
  width: 250px;
  font-weight: bold;
}

.sig-space {
  height: 80px;
}
</style>
