<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { useRoute } from "vue-router";
import { useMasterPerusahaanStore } from "~/stores/master/perusahaanStore";
import { usePenawaranStore } from "~/stores/penawaranStore";
import type { ConfirmationDialog } from "#components";
import { ref } from "vue";
import { useMasterKategoriStore } from "~/stores/master/kategoriStore";
import type { penawaranM } from "~/types/penawaranModel";
import { useMasterDokumenStore } from "~/stores/master/dokumenStore";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import CreateInvoiceDialog from "~/components/Admin/Penawaran/CreateInvoiceDialog.vue";

const generatePdfFromCanvas = async () => {
  if (process.server) return;

  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const element = document.getElementById("offer-to-print");
  if (!element) return;

  // ✅ AKTIFKAN MODE PDF
  document.body.classList.add("export-pdf");

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
  });

  // ❗ WAJIB: BALIKIN KE NORMAL
  document.body.classList.remove("export-pdf");

  const imgData = canvas.toDataURL("image/png");

  const namaFile = detailpenawaran.value.perihal;

  const pdf = new jsPDF("p", "mm", "a4");
  pdf.addImage(imgData, "PNG", 0, 0, 210, 297);

  const blob = pdf.output("blob");

  return new File([blob], `${namaFile}.pdf`, {
    type: "application/pdf",
  });
};

const body = ref("");
const masterdokumenstore = useMasterDokumenStore();

definePageMeta({ layout: "admin" });

const route = useRoute();
const masterobjectstore = useMasterKategoriStore();
const penawaranstore = usePenawaranStore();
const perusahaanStore = useMasterPerusahaanStore();
const masterCabangStore = useMasterPerusahaanStore();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

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

const totalUnit = computed(() => {
  return _.sumBy(masterCabangStore.getDataItemKategori, "jumlahUnit");
});

const data = reactive({
  dialogAdd: false,
  dialogRevisi: false,
  itemsPerPageKategori: 10,
  page: 1,
  itemsPerPage: 10,
  pageKategori: 1,
  dialogkirimpenawaran: false,
  dialogspk: false,
  dialogpemberkasan: false,
  dialogaddberkas: false,
  dialogPenawaran: false,
  dokumen_pemberkasan: [],
  item_kode_bayar: [],
  attachments: [] as string[],
  tambahupdateberkas: "",

  new_kirim_penawaran: {
    email: [],
    email_cc: [],
    email_bcc: [],
    body_email: "",
    tanggal_kirim_penawaran: "",
  },

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

  new_spk: {
    document_spk: [] as string[],
    tanggal_spk: "",
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
    { title: "Dok Kode Bayar", value: "file_kode_bayar" },
    { title: "Aksi", value: "aksi" },
  ],

  header: [
    { title: "No", value: "no" },
    { title: "Item", value: "new_item" },
  ],

  headers_items: [
    { title: "Nama", key: "nama_kategori_item" },
    { title: "Jumlah", key: "jumlahUnit" },
    { title: "Periode Penawaran", value: "periode_penawaran", sortable: true },
    { title: "Nominal", key: "nominal" },
    { title: "Subtotal", key: "subtotal" },
    { title: "Aksi", key: "actions", sortable: false },
  ],

  headKategoriItem: [
    {
      title: "No",
      value: "no",
      align: "center" as const,
      width: "50px",
    },
    { title: "Nama", value: "nama_kategori_item", sortable: true },
    { title: "Jumlah", value: "jumlah_unit", sortable: true, width: "50px" },
    { title: "Periode Terakhir", value: "periode", sortable: true },
    { title: "Periode Penawaran", value: "periode_penawaran", sortable: true },
    { title: "Nominal", value: "nominal", sortable: true },
    { title: "Status", value: "status", sortable: true },
    {
      title: "Pilih",
      value: "select",
      align: "center" as const,
      width: "50px",
    },
  ],
  headItemTambahan: [
    {
      title: "No",
      value: "no",
      align: "center" as const,
      width: "50px",
    },
    { title: "Keterangan", value: "keterangan_penawaran", sortable: true },
    { title: "Nominal", value: "nominal_tambahan", sortable: true },
    { title: "Aksi", value: "aksi", width: "50px" },
  ],
});

const selectedItems = ref<string[]>([]);

const newlisitemtambahan = ref<listitemtambahanPenawaranM>({
  keterangan_penawaran: "",
  nominal_tambahan: 0,
  kena_ppn: false,
  kena_pph: false,
  ppn_tambahan: 0,
  pph_tambahan: 0,
  status_item_tambahan: false,
});

const newRevisi = ref<revisipenawaranM>({
  id_perusahaan: "",
  id_cabang_perusahaan: "",
  id_object_kategori: "",
  nama_kategori_object: "",
  nama_cabang_perusahaan: "",
  nama_perusahaan: "",
  nama_group_pt: "",
  telepon_perusahaan: "",
  nama_surat: "",
  tanggal: "",
  perihal: "",
  items: [],
  total: 0,
  status: "",
  item_tambahan: [],
  createdAt: 0,
  createdBy: "",
});

//REVISI

const totalPenawaranRevisi = computed(() => {
  const totalItem = _.sumBy(newRevisi.value.items ?? [], (item: any) => {
    return Number(item.nominal || 0) * Number(item.jumlahUnit || 0);
  });

  const totalTambahan = _.sumBy(
    newRevisi.value.item_tambahan ?? [],
    (item: any) => Number(item.nominal_tambahan || 0),
  );

  return totalItem + totalTambahan;
});

const isOpeningDialogRevisi = ref(false);

watch(
  () => newRevisi.value.id_perusahaan,
  async (idperusahaan) => {
    if (isOpeningDialogRevisi.value) return; // ⛔ STOP saat open dialog
    const dataperusahaan = perusahaanStore.getDataPerusahaan;
    const b = _.find(dataperusahaan, (o: any) => o.id == idperusahaan);
    if (!_.isUndefined(b)) {
      newRevisi.value.nama_perusahaan = b!.nama_perusahaan;
      newRevisi.value.nama_surat = b!.nama_surat!;
      newRevisi.value.telepon_perusahaan = b!.telepon_perusahaan;
      newRevisi.value.nama_group_pt = b!.nama_group_pt;
      // Reset cabang dan item kategori ketika perusahaan berubah
      newRevisi.value.id_cabang_perusahaan = "";
      newRevisi.value.id_object_kategori = "";
      masterCabangStore.clearDataItemKategori();
      selectAll.value = false;
      data.pageKategori = 1;

      await masterCabangStore.tarikDataCabangPerusahaan(b.id!);

      // Berikan notifikasi jika berhasil memuat cabang
      if (masterCabangStore.getDataCabang.length > 0) {
        notificationStore.showSuccess(
          `Berhasil memuat ${masterCabangStore.getDataCabang.length} cabang`,
        );
      }
    }
  },
);

// Tambahkan watch untuk cabang
watch(
  () => newRevisi.value.id_cabang_perusahaan,
  async (idcabang) => {
    if (isOpeningDialogRevisi.value) return; // ⛔ STOP saat open dialog
    const datacabang = masterCabangStore.getDataCabang;
    const b = _.find(datacabang, (o: any) => o.id == idcabang);

    if (!_.isUndefined(b)) {
      newRevisi.value.nama_cabang_perusahaan = b!.nama_cabang;
      newRevisi.value.alamat_cabang = b!.alamat_cabang;
      // Reset object dan item kategori ketika cabang berubah
      newRevisi.value.id_object_kategori = "";
      masterCabangStore.clearDataItemKategori();
      selectAll.value = false;
      data.pageKategori = 1;

      notificationStore.showInfo(
        "Silakan pilih Object untuk melihat item kategori",
      );
    }
  },
);

watch(
  () => newRevisi.value.id_object_kategori,
  async (idobject) => {
    const dataobject = masterobjectstore.getDataObjectKategori;

    const b = _.find(dataobject, (o: any) => o.id == idobject);
    if (!_.isUndefined(b)) {
      newRevisi.value.nama_kategori_object = b!.nama;

      // Reset selected items ketika object berubah
      selectAll.value = false;

      // Reset pagination
      data.pageKategori = 1;

      // Cek apakah perusahaan dan cabang sudah dipilih
      if (!newRevisi.value.id_perusahaan) {
        notificationStore.showInfo("Silakan pilih Perusahaan terlebih dahulu");
        masterCabangStore.clearDataItemKategori();
        return;
      }

      if (!newRevisi.value.id_cabang_perusahaan) {
        notificationStore.showInfo("Silakan pilih Cabang terlebih dahulu");
        masterCabangStore.clearDataItemKategori();
        return;
      }

      // Tunggu sampai data selesai dimuat
      await masterCabangStore.tarikDataItemKategori(
        newRevisi.value.id_perusahaan,
        newRevisi.value.id_cabang_perusahaan,
        b.id!,
      );

      // Berikan notifikasi jika berhasil memuat data
      if (masterCabangStore.getDataItemKategori.length > 0) {
        notificationStore.showSuccess(
          `Berhasil memuat ${masterCabangStore.getDataItemKategori.length} item kategori`,
        );
      } else {
        notificationStore.showInfo(
          "Tidak ada item kategori untuk kombinasi ini",
        );
      }
    } else {
      // Jika object dikosongkan
      masterCabangStore.clearDataItemKategori();
      selectAll.value = false;
    }
  },
);

watch(
  () => newRevisi.value.items,
  (val) => {
    newRevisi.value.total = totalPenawaran.value;
  },
  { deep: true },
);

watch(
  () => newRevisi.value.items,
  (items) => {
    items.forEach((item: any) => {
      item.subtotal = Number(item.nominal || 0) * Number(item.jumlahUnit || 0);
    });
  },
  { deep: true },
);

const canAddItemRevisi = (item: any) => {
  return !newRevisi.value.items.some((i) => i.id_kategori_item === item.id);
};

function tambahItemRevisi(item: any) {
  if (!canAddItemRevisi(item)) return; // pakai helper ini

  // 1. Validasi Keberadaan Data Periode
  if (!item.periode_penawaran?.mulai || !item.periode_penawaran?.selesai) {
    // Anda bisa mengganti alert ini dengan snackbar/toast library Anda
    notificationStore.showError(
      "Harap isi Periode Awal dan Periode Akhir terlebih dahulu!",
    );
    return;
  }

  // 2. Validasi Logika Tanggal (Selesai tidak boleh sebelum Mulai)
  const tglMulai = item.periode_penawaran.mulai;
  const tglSelesai = item.periode_penawaran.selesai;

  if (tglSelesai < tglMulai) {
    notificationStore.showError(
      "Tanggal Akhir tidak boleh lebih kecil dari Tanggal Awal!",
    );
    return;
  }

  // // Cek status item
  // if (item.status !== "Draft") {
  //   return notificationStore.showError(
  //     "Item dengan status selain Draft tidak bisa ditambahkan",
  //   );
  // }

  // Cek jika sudah ditambahkan sebelumnya
  if (addedItemIds.value.includes(item.id)) {
    return notificationStore.showInfo("Item sudah ditambahkan");
  }

  const itemBaru = {
    id_kategori_item: item.id,
    id_object_kategori: item.id_object_kategori,
    id_perusahaan: item.id_perusahaan,
    id_cabang_perusahaan: item.id_cabang,
    nama_kategori_item: item.nama_kategori_item,
    nama_kategori_object: item.nama_kategori_object,
    nama_perusahaan: item.nama_perusahaan,
    nama_group_pt: item.nama_group_pt,
    nama_cabang: item.nama_cabang,
    kode_kategori_item: item.kode_kategori_item,
    jumlahUnit: item.jumlahUnit,
    ukuran: item.ukuran ?? [],
    periode: item.periode ?? { mulai: "-", selesai: "-" },
    periode_penawaran: item.periode_penawaran ?? { mulai: "-", selesai: "-" },
    keterangan: item.keterangan ?? "-",
    dokumen: item.dokumen ?? [],
    nominal: Number(item.nominal) || 0,
  };
  console.log(itemBaru, "itembaru");
  console.log(newRevisi.value.items, "cek items");
  newRevisi.value.items.push(itemBaru);
  addedItemIds.value.push(item.id); // tandai sudah ditambahkan
}

async function hapusitemsrevisi(index: number) {
  if (!confirmationDialog.value)
    return notificationStore.showError("Dialog tidak tersedia");

  const confirmed = await confirmationDialog.value.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) return;

  const item = newRevisi.value.items[index];
  if (!item) return;

  try {
    _.pullAt(newRevisi.value.items, index);

    // 🔥 WAJIB hapus dari addedItemIds juga
    _.pull(addedItemIds.value, item.id_kategori_item);

    notificationStore.showSuccess("Item penawaran berhasil dihapus");
  } catch (error: any) {
    console.error(error);
    notificationStore.showError(
      error.message || "Gagal menghapus item penawaran",
    );
  }
}

//REVISI

const newPenawaran = ref<penawaranM>({
  id_perusahaan: "",
  id_cabang_perusahaan: "",
  nomor: "",
  tanggal: "",
  perihal: "",
  items: [],
  catatan: [],
  total: 0,
  terbilang: "",
  status: "Draft",
  createdAt: 0,
  createdBy: "",
  nama_cabang_perusahaan: "",
  nama_perusahaan: "",
  nama_group_pt: "",
  nama_surat: "",
  id_object_kategori: "",
  nama_kategori_object: "",
  telepon_perusahaan: "",
  item_tambahan: [],
  handle_by_aresa: false,
  // status_terkirim_email: false,
  item_kode_bayar: [],
});

watch(
  () => data.new_pemberkasan.id_dokumen,

  (idDokumen) => {
    const dataDokumen = masterdokumenstore.getDataDokumen;

    const b = _.find(dataDokumen, (o: any) => o.id == idDokumen);
    // console.logb, 'si b')
    if (!_.isUndefined(b)) {
      data.new_pemberkasan.nama_dokumen = b!.nama_dokumen;
    }
  },
);

watch(
  () => data.new_pemberkasan.id_kategori_item,
  (id) => {
    const b = _.find(
      detailpenawaran.value.items,
      (o: any) => o.id_kategori_item === id,
    );
    if (!_.isUndefined(b)) {
      data.new_pemberkasan.nama_kategori_item = b!.nama_kategori_item;
      // ensure we always assign a string (fallback to empty string if undefined)
      data.new_pemberkasan.periode_mulai = b!.periode_penawaran?.mulai ?? "-";
      data.new_pemberkasan.periode_selesai =
        b!.periode_penawaran?.selesai ?? "-";
    }
  },
);

const tempBerkas = ref<any[]>([]);
const tempKodeBayar = ref<any[]>([]);

const groupedBerkas = computed(() => {
  const groups: Record<string, any> = {};

  const list = detailpenawaran.value?.berkas || [];

  list.forEach((item: any) => {
    if (!groups[item.id_kategori_item]) {
      groups[item.id_kategori_item] = {
        nama_kategori_item: item.nama_kategori_item,
        items: [],
      };
    }

    groups[item.id_kategori_item].items.push(item);
  });

  return Object.values(groups);
});

async function opendialogaddinv() {
  data.dialogAdd = true;
}

const opendialogspk = () => {
  data.dialogspk = true;
};

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

async function suratperintahkerja() {
  if (data.new_spk.tanggal_spk == "") {
    return notificationStore.showError("Tanggal tidak boleh kosong");
  }
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Dokumen SPK",
    "Anda yakin ingin menyimpan SPK ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Simpan dibatalkan");
  }
  useloadingStore().setLoading(true);
  const dataset = detailpenawaran.value;
  dataset.status = "SPK";
  dataset.tanggal_spk = data.new_spk.tanggal_spk;
  const c = await updatepenawaran(dataset);
  if (c == "ok") {
    notificationStore.showSuccess("SPK Berhasil disimpan");
  } else {
    notificationStore.showError("SPK Gagal disimpan");
  }
  useloadingStore().setLoading(false);
  data.new_spk.document_spk = [];
  data.dialogspk = false;
}

async function prosespenawaran() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi ke Tahap Proses",
    "Anda yakin ingin memproses penawaran ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Proses dibatalkan");
  }
  useloadingStore().setLoading(true);
  const dataset = detailpenawaran.value;

  dataset.status = "Proses";
  const c = await updatepenawaran(dataset);
  if (c == "ok") {
    notificationStore.showSuccess("Penawaran berhasil masuk ke tahap Proses");
    navigateTo("/admin/penawaran/proses");
  } else {
    notificationStore.showError("Penawaran Gagal diproses");
  }
  useloadingStore().setLoading(false);
}

async function dibatalkan() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Batal",
    "Anda yakin ingin membatalkan penawaran ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Tindakan dibatalkan");
  }
  useloadingStore().setLoading(true);
  const dataset = detailpenawaran.value;

  dataset.status = "Dibatalkan";
  const c = await updatepenawaran(dataset);
  if (c == "ok") {
    notificationStore.showSuccess("Penawaran Berhasil dibatalkan");
  } else {
    notificationStore.showError("Tindakan Gagal");
  }
  useloadingStore().setLoading(false);
}

async function ditolak() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Dibatalkan",
    "Anda yakin ingin membatalkan penawaran ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Penawaran dibatalkan");
  }
  useloadingStore().setLoading(true);
  const dataset = detailpenawaran.value;

  dataset.status = "Ditolak";
  const c = await updatepenawaran(dataset);
  if (c == "ok") {
    notificationStore.showSuccess("Data Penawaran Berhasil Diubah");
  } else {
    notificationStore.showError("Data Penawaran Gagal Diubah");
  }
  useloadingStore().setLoading(false);
}

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
const addedItemIds = ref<number[]>([]);
const selectAll = ref(false);
watch(
  () => masterCabangStore.getDataItemKategori,
  (items) => {
    items.forEach((item: any) => {
      if (!item.periode_penawaran) {
        item.periode_penawaran = {
          mulai: "",
          selesai: "",
        };
      }
    });
  },
  { deep: true },
);

const canAddItem = (item: any) => {
  return !newPenawaran.value.items.some((i) => i.id_kategori_item === item.id);
};

function tambahItem(item: any) {
  if (!canAddItem(item)) return; // pakai helper ini

  // 1. Validasi Keberadaan Data Periode
  if (!item.periode_penawaran?.mulai || !item.periode_penawaran?.selesai) {
    // Anda bisa mengganti alert ini dengan snackbar/toast library Anda
    notificationStore.showError(
      "Harap isi Periode Awal dan Periode Akhir terlebih dahulu!",
    );
    return;
  }

  // 2. Validasi Logika Tanggal (Selesai tidak boleh sebelum Mulai)
  const tglMulai = item.periode_penawaran.mulai;
  const tglSelesai = item.periode_penawaran.selesai;

  if (tglSelesai < tglMulai) {
    notificationStore.showError(
      "Tanggal Akhir tidak boleh lebih kecil dari Tanggal Awal!",
    );
    return;
  }

  if (addedItemIds.value.includes(item.id)) {
    return notificationStore.showInfo("Item sudah ditambahkan");
  }

  const itemBaru = {
    id_kategori_item: item.id,
    id_object_kategori: item.id_object_kategori,
    id_perusahaan: item.id_perusahaan,
    id_cabang_perusahaan: item.id_cabang,
    nama_kategori_item: item.nama_kategori_item,
    nama_kategori_object: item.nama_kategori_object,
    nama_perusahaan: item.nama_perusahaan,
    nama_group_pt: item.nama_group_pt,
    nama_cabang: item.nama_cabang,
    kode_kategori_item: item.kode_kategori_item,
    jumlahUnit: item.jumlahUnit,
    ukuran: item.ukuran ?? [],
    periode: item.periode ?? { mulai: "-", selesai: "-" },
    periode_penawaran: item.periode_penawaran ?? { mulai: "-", selesai: "-" },
    keterangan: item.keterangan ?? "-",
    dokumen: item.dokumen ?? [],
    nominal: Number(item.nominal) || 0,
  };
  console.log(itemBaru, "itembaru");
  console.log(newPenawaran.value.items, "cek items");
  newPenawaran.value.items.push(itemBaru);
  addedItemIds.value.push(item.id); // tandai sudah ditambahkan
}
const isOpeningDialogPenawaran = ref(false);

watch(
  () => newPenawaran.value.id_object_kategori,
  async (idobject) => {
    const dataobject = masterobjectstore.getDataObjectKategori;

    const b = _.find(dataobject, (o: any) => o.id == idobject);
    if (!_.isUndefined(b)) {
      newPenawaran.value.nama_kategori_object = b!.nama;

      // Reset selected items ketika object berubah
      selectAll.value = false;

      // Reset pagination
      data.pageKategori = 1;

      // Cek apakah perusahaan dan cabang sudah dipilih
      if (!newPenawaran.value.id_perusahaan) {
        notificationStore.showInfo("Silakan pilih Perusahaan terlebih dahulu");
        masterCabangStore.clearDataItemKategori();
        return;
      }

      if (!newPenawaran.value.id_cabang_perusahaan) {
        notificationStore.showInfo("Silakan pilih Cabang terlebih dahulu");
        masterCabangStore.clearDataItemKategori();
        return;
      }

      // Tunggu sampai data selesai dimuat
      await masterCabangStore.tarikDataItemKategori(
        newPenawaran.value.id_perusahaan,
        newPenawaran.value.id_cabang_perusahaan,
        b.id!,
      );

      // Berikan notifikasi jika berhasil memuat data
      if (masterCabangStore.getDataItemKategori.length > 0) {
        notificationStore.showSuccess(
          `Berhasil memuat ${masterCabangStore.getDataItemKategori.length} item kategori`,
        );
      } else {
        notificationStore.showInfo(
          "Tidak ada item kategori untuk kombinasi ini",
        );
      }
    } else {
      // Jika object dikosongkan
      masterCabangStore.clearDataItemKategori();
      selectAll.value = false;
    }
  },
);

watch(
  () => newPenawaran.value.id_perusahaan,
  async (idperusahaan) => {
    if (isOpeningDialogPenawaran.value) return; // ⛔ STOP saat open dialog

    const dataperusahaan = perusahaanStore.getDataPerusahaan;
    const b = _.find(dataperusahaan, (o: any) => o.id == idperusahaan);

    if (!_.isUndefined(b)) {
      newPenawaran.value.nama_perusahaan = b!.nama_perusahaan;
      newPenawaran.value.nama_surat = b!.nama_surat!;
      newPenawaran.value.telepon_perusahaan = b!.telepon_perusahaan;
      newPenawaran.value.nama_group_pt = b!.nama_group_pt;

      // Reset cabang dan item kategori ketika perusahaan berubah
      newPenawaran.value.id_cabang_perusahaan = "";
      newPenawaran.value.id_object_kategori = "";
      masterCabangStore.clearDataItemKategori();
      selectAll.value = false;
      data.pageKategori = 1;

      await masterCabangStore.tarikDataCabangPerusahaan(b.id!);

      // Berikan notifikasi jika berhasil memuat cabang
      if (masterCabangStore.getDataCabang.length > 0) {
        notificationStore.showSuccess(
          `Berhasil memuat ${masterCabangStore.getDataCabang.length} cabang`,
        );
      }
    }
  },
);

// Tambahkan watch untuk cabang
watch(
  () => newPenawaran.value.id_cabang_perusahaan,
  async (idcabang) => {
    if (isOpeningDialogPenawaran.value) return; // ⛔ STOP saat open dialog

    const datacabang = masterCabangStore.getDataCabang;
    const b = _.find(datacabang, (o: any) => o.id == idcabang);

    if (!_.isUndefined(b)) {
      newPenawaran.value.nama_cabang_perusahaan = b!.nama_cabang;
      newPenawaran.value.alamat_cabang = b!.alamat_cabang;
      // Reset object dan item kategori ketika cabang berubah
      newPenawaran.value.id_object_kategori = "";
      masterCabangStore.clearDataItemKategori();
      selectAll.value = false;
      data.pageKategori = 1;

      notificationStore.showInfo(
        "Silakan pilih Object untuk melihat item kategori",
      );
    }
  },
);

watch(
  () => newPenawaran.value.items,
  (val) => {
    newPenawaran.value.total = totalPenawaran.value;

    // notificationStore.showInfo("Berhasil ditambahkan");
  },
  { deep: true },
);

watch(
  () => newPenawaran.value.items,
  (items) => {
    items.forEach((item: any) => {
      item.subtotal = Number(item.nominal || 0) * Number(item.jumlahUnit || 0);
    });
  },
  { deep: true },
);

const getNoDataMessage = () => {
  if (!newPenawaran.value.id_perusahaan) {
    return "Silakan pilih Perusahaan terlebih dahulu";
  }
  if (!newPenawaran.value.id_cabang_perusahaan) {
    return "Silakan pilih Cabang terlebih dahulu";
  }
  if (!newPenawaran.value.id_object_kategori) {
    return "Silakan pilih Object untuk melihat item kategori";
  }
  return "Tidak ada item kategori yang tersedia";
};

const getNoDataSubMessage = () => {
  if (!newPenawaran.value.id_perusahaan) {
    return "Pilih perusahaan dari dropdown di atas untuk melanjutkan";
  }
  if (!newPenawaran.value.id_cabang_perusahaan) {
    return "Pilih cabang dari dropdown setelah memilih perusahaan";
  }
  if (!newPenawaran.value.id_object_kategori) {
    return "Pilih object dari dropdown setelah memilih cabang";
  }
  return "Pastikan Anda telah memilih perusahaan, cabang, dan object yang tepat";
};

const getNoDataIcon = () => {
  if (!newPenawaran.value.id_perusahaan) {
    return "mdi-office-building-outline";
  }
  if (!newPenawaran.value.id_cabang_perusahaan) {
    return "mdi-map-marker-outline";
  }
  if (!newPenawaran.value.id_object_kategori) {
    return "mdi-cube-outline";
  }
  return "mdi-package-variant";
};

function additemtambahan() {
  if (newlisitemtambahan.value.keterangan_penawaran.trim() === "") {
    return notificationStore.showError("Keterangan tambahan wajib diisi");
  }
  if (newlisitemtambahan.value.nominal_tambahan <= 0) {
    return notificationStore.showError("Nominal tambahan harus lebih dari 0");
  }
  newPenawaran.value.item_tambahan.push(newlisitemtambahan.value);
  newlisitemtambahan.value = {
    keterangan_penawaran: "",
    nominal_tambahan: 0,
    kena_ppn: false,
    kena_pph: false,
    ppn_tambahan: 0,
    pph_tambahan: 0,
    status_item_tambahan: false,
  };
}

function deleteitemtambahan(index: number) {
  _.pullAt(newPenawaran.value.item_tambahan, index);
}

async function hapusitemspenawaran(index: number) {
  if (!confirmationDialog.value)
    return notificationStore.showError("Dialog tidak tersedia");

  const confirmed = await confirmationDialog.value.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) return notificationStore.showError("Penghapusan dibatalkan");

  if (index < 0 || index >= newPenawaran.value.items.length) {
    return notificationStore.showError("Index item tidak valid");
  }
  const item = newPenawaran.value.items[index];

  try {
    _.pullAt(newPenawaran.value.items, index);
    // 🔥 WAJIB hapus dari addedItemIds juga
    _.pull(addedItemIds.value, item.id_kategori_item);
    notificationStore.showSuccess("Item penawaran berhasil dihapus");
  } catch (error: any) {
    console.error(error);
    notificationStore.showError(
      error.message || "Gagal menghapus item penawaran",
    );
  }
}

async function saverevisi() {
  if (!newPenawaran.value.tanggal)
    return notificationStore.showError("Tanggal wajib diisi");

  if (!newPenawaran.value.handle_by_aresa)
    return notificationStore.showError("Handle By wajib dipilih");

  if (!newPenawaran.value.id_perusahaan)
    return notificationStore.showError("Perusahaan wajib dipilih");

  if (!newPenawaran.value.id_cabang_perusahaan)
    return notificationStore.showError("Cabang wajib dipilih");

  if (!newPenawaran.value.id_object_kategori)
    return notificationStore.showError("Object wajib dipilih");
  if (!newPenawaran.value.items.length)
    return notificationStore.showError("Pilih minimal satu item");
  useloadingStore().setLoading(true);
  newPenawaran.value.total = totalPenawaran.value;
  const c = await setrevisipenawaran(newPenawaran.value);
  console.log("HASILREVISI", c);
  console.log("DATARIVISI", newPenawaran.value);
  if (c == "ok") {
    await penawaranstore.tarikDataPenawaranrevisAct(
      String(detailpenawaran.value.id_penawaran || route.params.id),
    );
    notificationStore.showSuccess("Data Penawaran Berhasil Di Revisi");
  } else {
    notificationStore.showError("Data Penawaran Gagal Di Revisi");
  }
  useloadingStore().setLoading(false);
  data.dialogPenawaran = false;
}

async function saverevisitopenawaran(item: revisipenawaranM) {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Penawaran",
    "Anda yakin ingin menggunakan penawaran ini?",
  );
  if (!confirmed) return notificationStore.showError("Revisi dibatalkan");
  const loading = useloadingStore();
  loading.setLoading(true);
  try {
    const result = await setrevisitopenawaran(item, detailpenawaran.value);
    console.log("HASILREVISI", result);
    console.log("DATARIVISI", item);
    if (result === "ok") {
      notificationStore.showSuccess("Penawaran berhasil Diterapkan");
      data.dialogRevisi = false; // tutup dialog hanya kalau sukses
    } else {
      notificationStore.showError(result || "Penawaran Gagal Diterapkan");
    }
  } catch (error) {
    console.error(error);
    notificationStore.showError("Terjadi kesalahan sistem");
  } finally {
    await masterCabangStore.tarikDataItemKategori(
      item.id_perusahaan,
      item.id_cabang_perusahaan,
      item.id_object_kategori,
    );
    loading.setLoading(false);
  }
}

const formatTanggal = (tanggal: string) => {
  if (!tanggal) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(tanggal));
};

const totalPenawaran = computed(() => {
  const totalItem = _.sumBy(newPenawaran.value.items ?? [], (item: any) => {
    return Number(item.nominal || 0) * Number(item.jumlahUnit || 0);
  });

  const totalTambahan = _.sumBy(
    newPenawaran.value.item_tambahan ?? [],
    (item: any) => Number(item.nominal_tambahan || 0),
  );

  return totalItem + totalTambahan;
});

async function openDialogRevisiPenawaran() {
  isOpeningDialogPenawaran.value = true;
  await masterobjectstore.tarikDataObjectKategoriAct();
  await perusahaanStore.tarikDataPerusahaanAct();
  await masterCabangStore.tarikDataCabangAct();
  newPenawaran.value = _.cloneDeep(detailpenawaran.value);
  data.dialogPenawaran = true;
  nextTick(() => {
    isOpeningDialogPenawaran.value = false;
  });
}
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
    <!-- // DIALOG SPK \\ -->
    <v-dialog v-model="data.dialogspk" max-width="450" scrollable>
      <v-card>
        <v-card-title class="px-6 py-3 bg-primary text-center">
          <span class="font-weight-bold text-white"> SPK </span>
        </v-card-title>

        <v-card-text>
          <a-date-picker
            class="mt-3"
            label="Tanggal SPK"
            v-model="data.new_spk.tanggal_spk"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="data.dialogspk = false">Batal</v-btn>
          <v-btn color="primary" variant="flat" @click="suratperintahkerja"
            >Simpan</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- // DIALOG BUAT INVOICE \\ -->
    <CreateInvoiceDialog
      v-model="data.dialogAdd"
      :penawaran="detailpenawaran"
      @saved="navigateTo('/admin/invoice')"
    />

    <!-- // PINDAH PENAWARAN \\ -->

    <!-- // DETAIL PENAWARAN \\ -->
    <v-card
      variant="outlined"
      class="rounded-lg border-thin no-print"
      color="grey-lighten-2"
    >
      <v-card-text class="pa-4">
        <div class="d-flex align-start mb-3">
          <img
            v-if="detailpenawaran.handle_by_aresa == 'KAM'"
            src="/public/aresa_typo.png"
            alt="Aresa Logo"
            style="height: 45px; margin-right: 12px"
          />

          <div class="d-flex justify-space-between align-start flex-grow-1">
            <div>
              <div
                class="text-caption text-primary text-uppercase font-weight-bold"
                style="letter-spacing: 1px"
              >
                No. Penawaran
              </div>
              <div class="text-h6 font-weight-black text-grey-darken-4">
                {{ detailpenawaran.no_penawaran }}
              </div>
            </div>

            <v-chip
              size="small"
              color="primary"
              variant="tonal"
              class="font-weight-bold text-uppercase"
            >
              {{ detailpenawaran.nama_kategori_object }}
            </v-chip>
          </div>
        </div>

        <v-divider class="mb-4" opacity="90"></v-divider>

        <v-row no-gutters>
          <v-col cols="12" md="7" class="mb-4 mb-md-0">
            <div class="text-caption text-primary font-weight-bold">
              PERUSAHAAN
            </div>
            <div class="text-body-1 font-weight-bold text-grey-darken-3">
              {{ detailpenawaran.nama_group_pt }}
              {{ detailpenawaran.nama_perusahaan }}
            </div>
            <div class="text-body-2 text-grey-darken-1">
              <v-icon size="small" color="primary" class="mr-1"
                >mdi-office-building</v-icon
              >
              Cab. {{ detailpenawaran.nama_cabang_perusahaan }}
              <span class="mx-2 text-grey-lighten-1">|</span>
              <v-icon size="small" color="primary" class="mr-1"
                >mdi-phone</v-icon
              >
              {{ detailpenawaran.telepon_perusahaan }}
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
                  PERIHAL
                </div>

                <div
                  class="text-body-1 text-grey-darken-4 font-weight-medium"
                  style="line-height: 1.8"
                >
                  {{ detailpenawaran.perihal }}
                </div>
              </div>

              <v-divider opacity="50"></v-divider>
              <!-- Total Unit -->
              <div class="d-flex align-center ga-2">
                <v-icon size="18" color="primary">
                  mdi-package-variant-closed
                </v-icon>

                <span
                  class="text-caption text-grey-darken-1"
                  style="letter-spacing: 0.5px"
                >
                  Total Unit :
                </span>

                <span class="text-body-1 font-weight-bold text-primary">
                  {{
                    detailpenawaran?.items?.reduce(
                      (total, item) => total + Number(item.jumlahUnit || 0),
                      0,
                    )
                  }}
                </span>

                <span class="text-caption text-grey-darken-1"> Unit </span>
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
        <v-btn color="indigo" @click="opendialogspk" class="text-capitalize">
          SPK
        </v-btn>

        <v-btn
          v-if="
            detailpenawaran.status == 'Draft' ||
            detailpenawaran.status == 'Terkirim'
          "
          color="orange"
          prepend-icon="mdi-close-circle"
          @click="dibatalkan"
          class="text-capitalize"
          >Batal</v-btn
        >

        <!-- <v-btn
          v-if="
            detailpenawaran.status == 'Draft' ||
            detailpenawaran.status == 'Terkirim'
          "
          color="red-darken-1"
          prepend-icon="mdi-close-circle"
          @click="ditolak"
          class="text-capitalize"
          >Tolak</v-btn
        > -->

        <v-btn
          color="success"
          prepend-icon="mdi-file-document-plus"
          @click="opendialogaddinv"
        >
          Buat Invoice
        </v-btn>

        <!-- <v-btn
          variant="outlined"
          color="indigo-darken-3"
          prepend-icon="mdi-printer"
          @click="handlePrint"
          class="text-capitalize"
          v-if="
            detailpenawaran.status != 'Pemberkasan' &&
            detailpenawaran.status != 'Proses' &&
            detailpenawaran.status != 'SPK' &&
            detailpenawaran.status != 'Invoice'
          "
        >
          Cetak
        </v-btn> -->
      </div>
    </v-row>

    <!-- // SPK PREVIEW \\ -->
    <div
      style="height: 100vw"
      v-if="
        detailpenawaran.status == 'Pemberkasan' ||
        detailpenawaran.status == 'Proses' ||
        detailpenawaran.status == 'SPK' ||
        detailpenawaran.status == 'Invoice'
      "
    >
      <div class="spk-header">
        <v-icon size="18" class="mr-2">mdi-file-document-outline</v-icon>
        <span class="spk-title">Dokumen SPK Penawaran</span>
      </div>
      <iframe
        :src="detailpenawaran.tanggal_spk"
        width="100%"
        height="100%"
        style="border: none"
      />
    </div>

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
