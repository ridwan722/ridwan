

<template>
  <v-dialog v-model="data.dialogtambahdaftaritem" max-width="900px" scrollable>
    <v-card class="elevation-3">
      <v-card-title class="d-flex align-center justify-space-between pb-2">
        <div>
          <div class="text-subtitle-1 font-weight-bold">
            Tanda Terima Sertifikasi
          </div>
          <div class="text-caption text-grey-darken-1">
            Input Berkas
          </div>
        </div>
        <v-icon color="primary">mdi-file-document-outline</v-icon>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
       
        <v-row no-gutters>
          <v-col cols="12" md="5" style="padding: 0 10px 0 10px">
            <div class="text-subtitle-2 mb-3 font-weight-bold">KODE BAYAR</div>
            <a-text-field-new
              v-model="data.new_kodebayar.kode_bayar"
              label="Kode Bayar"
              placeholder="kode bayar"
              density="compact"
              variant="outlined"
              bg-color="white"
              class="mb-3"
            />
            <upload-image2 label="Doc" class="mb-3" />
            <v-btn
              color="success"
              size="small"
              block
              elevation="1"
              @click="addkodebayar"
              prepend-icon="mdi-plus"
              >Add</v-btn
            >

            <div class="mt-4 border rounded bg-white">
              <v-data-table-virtual
                :headers="data.headerkodebayar"
                :items="props.datainv.item_kode_bayar"
                height="165"
                density="compact"
              >
                <template v-slot:item.no="{ index }">
                  <span class="text-caption">{{ index + 1 }}.</span>
                </template>

                <template v-slot:item.aksi="{ index }">
                  <v-btn
                    @click="deletekodebayar(index)"
                    color="error"
                    size="small"
                    variant="text"
                    icon="mdi-delete-outline"
                  ></v-btn>
                </template>

                <template v-slot:item.file_kode_bayar="{ item }">
                  <v-btn
                    color="blue"
                    target="_blank"
                    size="30"
                    v-if="item.file_kode_bayar"
                    :href="item.file_kode_bayar"
                    ><v-icon>mdi-file-image</v-icon></v-btn
                  >
                </template>
              </v-data-table-virtual>
            </div>
          </v-col>

          <v-col cols="12" md="7" style="padding-left: 20px">
            <div class="text-subtitle-2 mb-4 font-weight-bold">BERKAS</div>

            <v-row dense>
              <v-col cols="12">
                <a-select-new
                  label="Pilih Item Kategori"
                  v-model="data.new_pemberkasan.id_kategori_item"
                  :items="props.datainv.items"
                  item-title="nama_kategori_item"
                  item-value="id_kategori_item"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="6">
                <a-text-field-new
                  label="Periode Awal"
                  v-model="data.new_pemberkasan.periode_mulai"
                  disabled
                  placeholder="----/--/--"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="6">
                <a-text-field-new
                  label="Periode Akhir"
                  v-model="data.new_pemberkasan.periode_selesai"
                  disabled
                  placeholder="----/--/--"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="6">
                <a-select-new
                  label="Jenis dokumen"
                  v-model="data.new_pemberkasan.id_dokumen"
                  :items="masterdokumenstore.getDataDokumen"
                  item-title="nama_dokumen"
                  item-value="id"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="6">
                <a-text-field-new
                  label="No Dokumen"
                  placeholder="Cth. 0123"
                  v-model="data.new_pemberkasan.no_dokumen"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>

            <v-row align="center" class="mt-0">
              <v-col cols="7" class="mt-1">
                <upload-image label="Upload" />
              </v-col>
              <v-col>
                <a-select-new
                  label="Status Dokumen"
                  class="mb-2"
                  v-model="data.new_pemberkasan.status_dokumen"
                  :items="['Asli', 'Copy']"
                />
              </v-col>
              <v-col cols="auto">
                <v-btn
                  color="success"
                  size="small"
                  @click="adddocpemberkasan"
                  prepend-icon="mdi-plus"
                >
                  Add
                </v-btn>
              </v-col>
            </v-row>

            <v-data-table-virtual
              :headers="data.headerberkas"
              :items="props.datainv.berkas"
              height="300"
              fixed-header
              density="compact"
            >
              <template v-slot:item.no="{ index }">
                <span class="text-caption">{{ index + 1 }}.</span>
              </template>

              <template v-slot:item.periode="{ item }">
                {{ item.periode_mulai }} - {{ item.periode_selesai }}
              </template>

              <template v-slot:item.file_dokumen="{ item }">
                <div style="width: 70px">
                  <v-btn
                    color="info"
                    size="small"
                    variant="text"
                    icon="mdi-file-eye-outline"
                    :href="item.file_dokumen"
                    target="_blank"
                  ></v-btn>
                  <span style="font-size: 11px; color: grey">{{
                    item.status_dokumen
                  }}</span>
                </div>
              </template>

              <template v-slot:item.aksi="{ index }">
                <v-btn
                  color="error"
                  size="small"
                  variant="text"
                  icon="mdi-delete-outline"
                  @click="deletedocpemberkasan(index)"
                ></v-btn>
              </template>
            </v-data-table-virtual>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>

        <v-btn
          variant="flat"
          color="red"
          class="text-none"
          @click="data.dialogtambahdaftaritem = false"
        >
          Batal
        </v-btn>

        <v-btn
          variant="flat"
          color="primary"
          class="text-none font-weight-bold"
          elevation="2"
          @click="simpanKeDatabase"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div class="container-master">
    <v-btn
      color="primary"
      class="text-none font-weight-bold mb-3"
      rounded="lg"
      elevation="2"
      @click="bukadialogtambahdaftaritem"
    >
      Input Daftar Item
    </v-btn>

    <!-- PRINT AREA -->
    <div class="a4-page" ref="printArea">
      <div v-for="i in 2" :key="i" class="receipt-section">
        <table class="main-table">
          <thead>
            <tr class="bg-excel">
              <th colspan="4" class="header-title">
                <div class="text-upper">
                  Tanda Terima Sertifikasi 
                   {{
              props.datainv.items?.[0]?.periode_penawaran?.mulai.split("-")[0]
            }}
            -
            {{
              props.datainv.items?.[0]?.periode_penawaran?.selesai.split("-")[0]
            }} 
                </div>
                <div class="text-sub">
                  {{ props.datainv.nama_group_pt }} –
                  {{ props.datainv.nama_perusahaan }}
                </div>
              </th>
            </tr>
            <tr class="bg-excel text-bold">
              <th style="width: 40px">NO</th>
              <th>Nama Alat</th>
              <th>No Sertifikasi</th>
              <th style="width: 120px">Asli/Copy</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in props.datainv.berkas" :key="index">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="px-8">{{ item.nama_dokumen }}</td>
              <td class="px-8">{{ item.no_dokumen }}</td>
              <td class="text-center">{{ item.status_dokumen }}</td>
            </tr>
          </tbody>
        </table>

        <div class="signature-container">
          <div class="date-row">
            Jakarta,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{ rubahbulantahun(props.datainv.createdAt) }}
          </div>

          <div class="sign-row">
            <div class="sign-box">
              <div class="sign-label">Yang Menerima</div>
              <div class="sign-space">
                (
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                )
              </div>
            </div>
            <div class="sign-box">
              <div class="sign-label">Yang Menyerahkan</div>
              <div class="sign-space">
                (
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                )
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="no-print-area">
      <button class="btn-print" @click="printOnlyA4">
        Cetak Tanda Terima Sertifikasi Disnaker
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { ref, reactive } from "vue";
import { useMasterDokumenStore } from "~/stores/master/dokumenStore";

const props = defineProps({
  datainv: Object,
});
const uploadstore = uploadStore();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

const dataSertifikasi = ref([]);

const form = ref({
  nama_alat: "",
  no_sertifikasi: "",

  id_dokumen: "",
  nama_dokumen: "",
  file_dokumen: "",
  no_dokumen: "",
  id_kategori_item: "",
  nama_kategori_item: "",
  periode_mulai: "",
  periode_selesai: "",
  status_dokumen: "Asli",
});

const data = reactive({
  dialogtambahdaftaritem: false,
  header_sertifikasi: [
    { title: "No", value: "no" },
    { title: "Nama Alat", value: "nama_alat" },
    { title: "No Sertifikasi", value: "no_sertifikasi" },
    { title: "Status Sertifikasi", value: "status_dokumen" },
    { title: "Aksi", value: "action" },
  ],

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

  new_kodebayar: {
    kode_bayar: "",
    file_kode_bayar: "",
  },

  headerberkas: [
    { title: "No", value: "no" },
    { title: "Nama Kategori Item", value: "nama_kategori_item" },
    { title: "Jenis Dokumen", value: "nama_dokumen" },
    { title: "No Dokumen", value: "no_dokumen" },
    { title: "File Dokumen", value: "file_dokumen" },
    { title: "Aksi", value: "aksi" },
  ],

  headerkodebayar: [
    { title: "No.", value: "no" },
    { title: "Kode Bayar", value: "kode_bayar" },
    { title: "File Dokumen", value: "file_kode_bayar" },
    { title: "Aksi", value: "aksi" },
  ],
});

const masterdokumenstore = useMasterDokumenStore();

watch(
  () => data.new_pemberkasan.id_dokumen,

  (idDokumen) => {
    const dataDokumen = masterdokumenstore.getDataDokumen;

    const b = _.find(dataDokumen, (o: any) => o.id == idDokumen);

    if (!_.isUndefined(b)) {
      data.new_pemberkasan.nama_dokumen = b!.nama_dokumen;
    }
  },
);

watch(
  () => data.new_pemberkasan.id_kategori_item,
  (id) => {
    const b = _.find(
      props.datainv.items,
      (o: any) => o.id_kategori_item === id,
    );
    if (!_.isUndefined(b)) {
      data.new_pemberkasan.nama_kategori_item = b!.nama_kategori_item;

      data.new_pemberkasan.periode_mulai = b!.periode_penawaran?.mulai ?? "-";
      data.new_pemberkasan.periode_selesai =
        b!.periode_penawaran?.selesai ?? "-";
    }
  },
);

function adddocpemberkasan() {
  data.new_pemberkasan.file_dokumen = uploadstore.getUrlRef;
  if (data.new_pemberkasan.id_kategori_item == "") {
    return notificationStore.showError("pilih kategori item terlebih dahulu");
  }
  if (data.new_pemberkasan.id_dokumen == "") {
    return notificationStore.showError("pilih jenis dokumen terlebih dahulu");
  }
  if (data.new_pemberkasan.no_dokumen == "") {
    return notificationStore.showError("input no dokumen terlebih dahulu");
  }
  if (data.new_pemberkasan.file_dokumen == "") {
    return notificationStore.showError("upload dokumen berkas terlebih dahulu");
  }
  props.datainv.berkas.push(data.new_pemberkasan);
  data.new_pemberkasan = {
    id_dokumen: "",
    nama_dokumen: "",
    file_dokumen: "",
    no_dokumen: "",
    id_kategori_item: "",
    nama_kategori_item: "",
    periode_mulai: "",
    periode_selesai: "",
    status_dokumen: "Asli",
  };
  uploadstore.setReset();
}

function deletedocpemberkasan(index: number) {
  _.pullAt(props.datainv.berkas, index);
}

async function addkodebayar() {
  data.new_kodebayar.file_kode_bayar = uploadstore.getUrlRef2;
  if (data.new_kodebayar.kode_bayar == "") {
    return notificationStore.showError("Kode Bayar tidak boleh kosong");
  }
  if (data.new_kodebayar.file_kode_bayar == "") {
    return notificationStore.showError(
      "Doc wajib diisi untuk menambahkan ke list",
    );
  }

  props.datainv.item_kode_bayar.push(data.new_kodebayar);
  data.new_kodebayar = {
    kode_bayar: "",
    file_kode_bayar: "",
  };
  uploadstore.setReset2();
}

async function deletekodebayar(index: number) {
  _.pullAt(props.datainv.item_kode_bayar, index);
}

const bukadialogtambahdaftaritem = async () => {
  await masterdokumenstore.tarikDataMasterDokumenAct();
  data.dialogtambahdaftaritem = true;
};

const tambahItem = () => {
  if (!form.value.nama_alat || !form.value.no_sertifikasi) return;
  dataSertifikasi.value.push(form.value);
  form.value = {
    nama_alat: "",
    no_sertifikasi: "",
    status_dokumen: "",
  };
};

function hapusitem(index: number) {
  _.pullAt(dataSertifikasi.value, index);
}

const simpanKeDatabase = async () => {
  const confirmed = confirm("Simpan daftar sertifikasi dan update invoice?");
  if (!confirmed) return;

  useloadingStore().setLoading(true);

  const dataset = JSON.parse(JSON.stringify(props.datainv));
  console.log("Dataset sebelum disimpan:", dataset);

  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;

  if (!dataset.id_inv || !dataset.id_penawaran) {
    notificationStore.showError("ID invoice / penawaran tidak valid");
    return;
  }

  if (!dataset.items || !Array.isArray(dataset.items)) {
    notificationStore.showError("Data items tidak tersedia");
    return;
  }

  try {
    console.log("Dataset yang akan dikirim:", dataset);
    const result = await addberkasPenawaraninv(dataset);
    if (result === "ok") {
      notificationStore.showSuccess("Berkas berhasil ditambahkan");
      data.dialogtambahdaftaritem = false;
    } else {
      notificationStore.showError("Gagal Update: " + result);
    }
  } catch (e) {
    console.error(e);
    notificationStore.showError("Terjadi kesalahan sistem");
  } finally {
    useloadingStore().setLoading(false);
  }
};

const printArea = ref(null);

const printOnlyA4 = () => {
  const content = printArea.value.innerHTML;

  // 1. Ambil semua style dari dokumen utama
  const styles = Array.from(document.querySelectorAll("style"))
    .map((style) => style.innerHTML)
    .join("\n");
    
  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map((link) => link.outerHTML)
    .join("\n");

  const printWindow = window.open("", "_blank", "width=900,height=650");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Tanda Terima Sertifikasi - ${props.datainv.nama_perusahaan}</title>
        ${links}
        <style>
          /* RESET KHUSUS WINDOWS */
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            margin: 0;
            padding: 0;
            background: #f0f0f0; /* Memberi warna beda agar terlihat area A4-nya */
            font-family: Arial, sans-serif;
          }

          /* AREA A4 */
          .a4-page {
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            background: white;
            padding: 15mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }

          /* FIX UNTUK VUETIFY UTILITY DI WINDOWS */
          .v-application--wrap { min-height: auto !important; }

          /* TABLE BORDER FIX */
          .main-table {
            border-collapse: collapse !important;
            width: 100% !important;
            border: 1.5px solid black !important;
          }
          
          .main-table th, .main-table td {
            border: 1px solid black !important;
          }

          /* FORCE BACKGROUND EXCEL HEADER */
          .bg-excel {
            background-color: #adb9ca !important;
            -webkit-print-color-adjust: exact !important;
          }

          ${styles}

          @media print {
            body { background: none; }
            .a4-page {
              margin: 0;
              border: none;
              box-shadow: none;
              width: 210mm;
            }
            @page {
              size: A4 portrait;
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="v-application v-theme--light">
          <div class="v-application--wrap">
            <div class="a4-page">
              ${content}
            </div>
          </div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  
  // 2. Logic tunggu loading (Krusial untuk Windows)
  printWindow.focus();
  
  const triggerPrint = () => {
    // Delay 1 detik agar browser selesai kalkulasi layout table
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }, 1000);
  };

  // Pastikan window sudah ter-load sempurna
  if (printWindow.document.readyState === 'complete') {
    triggerPrint();
  } else {
    printWindow.onload = triggerPrint;
  }
};
</script>

<style scoped>
/* ===================== BASE ===================== */
.container-master {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 0 0;
  font-family: Arial, sans-serif;
}

.no-print-area {
  margin-top: 20px;
}

.btn-print {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

/* ===================== A4 ===================== */
.a4-page {
  background-color: white;
  width: 210mm;
  min-height: 297mm;
  padding: 10mm;
  box-sizing: border-box;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.receipt-section {
  width: 100%;
  margin-bottom: 55mm;
}

.receipt-section:last-child {
  margin-bottom: 0;
}

/* ===================== TABLE ===================== */
.main-table {
  width: 100%;
  border-collapse: collapse;
  border: 1.5px solid black;
}

.main-table th,
.main-table td {
  border: 1px solid black;
  padding: 6px 4px;
  font-size: 11px;
  color: black;
}

.bg-excel {
  background-color: #adb9ca !important;
}

.header-title {
  padding: 10px 0;
}

.text-upper {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 15px;
}

.text-sub {
  font-weight: bold;
  font-size: 14px;
}

.text-bold {
  font-weight: bold;
}

.text-center {
  text-align: center;
}

.px-8 {
  padding-left: 8px;
  padding-right: 8px;
}

/* ===================== SIGN ===================== */
.signature-container {
  margin-top: 15px;
}

.date-row {
  text-align: right;
  padding-right: 40px;
  margin-bottom: 25px;
  font-size: 11px;
}

.sign-row {
  display: flex;
  justify-content: space-between;
  padding: 0 60px;
}

.sign-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sign-label {
  font-weight: bold;
  font-size: 11px;
  margin-bottom: 75px;
}

.sign-space {
  font-size: 14px;
}

/* ===================== PRINT ONLY A4 ===================== */
@media print {
  body * {
    visibility: hidden;
  }

  .a4-page,
  .a4-page * {
    visibility: visible;
  }

  .a4-page {
    position: absolute;
    left: 0;
    top: 0;
    width: 210mm;
    min-height: 297mm;
    padding: 15mm;
    box-shadow: none;
  }

  @page {
    size: A4;
    margin: 0;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

.segmented-toggle {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  overflow: hidden;
}

.segmented-toggle .v-btn {
  border-radius: 0 !important;
  height: 42px;
}

.segmented-toggle .v-btn--active {
  background-color: rgb(var(--v-theme-primary));
  color: white;
}
</style>
