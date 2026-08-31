<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { useRoute } from "vue-router";
import { useMasterPerusahaanStore } from "~/stores/master/perusahaanStore";
import { usePenawaranStore } from "~/stores/penawaranStore";
import { uselnvoiceStore } from "~/stores/invoiceStore";
import { useUserStore } from "~/stores/userStore";
import type { invoiceM } from "~/types/InvoiceModel";
import type { ConfirmationDialog } from "#components";
import { ref } from "vue";
import { useMasterKategoriStore } from "~/stores/master/kategoriStore";
import type {
  listitemtambahanPenawaranM,
  penawaranM,
  revisipenawaranM,
} from "~/types/penawaranModel";
import type { itemKategoriM } from "~/types/master/kategoriModel";
import { useMasterDokumenStore } from "~/stores/master/dokumenStore";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
const showTotal = ref(true);
const showTotalItem = ref(true);
const showQty = ref(true);
const showHargaUnit = ref(true);
const kopAresa = ref(true);
const showDividerItem = ref(true);
const showDividerItemtambahan = ref(true);
const showNominalTambahan = ref(true);
const masterdokumenstore = useMasterDokumenStore();

const hiddenRows = ref<number[]>([]);
const toggleRow = (index: number) => {
  if (hiddenRows.value.includes(index)) {
    hiddenRows.value = hiddenRows.value.filter((i) => i !== index);
  } else {
    hiddenRows.value.push(index);
  }
};

const resetHiddenRows = () => {
  hiddenRows.value = [];
};

definePageMeta({ layout: "admin" });

const route = useRoute();
const masterobjectstore = useMasterKategoriStore();
const penawaranstore = usePenawaranStore();
const perusahaanStore = useMasterPerusahaanStore();
const masterCabangStore = useMasterPerusahaanStore();
const invoicestore = uselnvoiceStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);
const pictureStore = usePictureStore();
const uploadstore = uploadStore();

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
const selectedPpnItems = ref<string[]>([]);
const selectedPphItems = ref<string[]>([]);
const selectedPpnPphItems = ref<string[]>([]);
const selectedNominalItemTambahan = ref<string[]>([]);
const selectedTaxItemTambahan = ref<string[]>([]);

function handleSelectItem(item, index) {
  const key = `${item.id}-${index}`;

  // kalau item di-uncheck → paksa hapus PPN juga
  if (!selectedItems.value.includes(key)) {
    selectedPpnItems.value = selectedPpnItems.value.filter((k) => k !== key);
  }
}

function toggleAllItems() {
  const items = detailpenawaran.value.items || [];

  if (isAllSelected.value) {
    // unselect semua
    selectedItems.value = [];
    selectedPpnItems.value = [];
  } else {
    // select semua
    selectedItems.value = items.map((item, index) => `${item.id}-${index}`);
  }
}

const isAllSelected = computed(() => {
  const items = detailpenawaran.value.items || [];

  return (
    items.length > 0 &&
    items.every((item, index) =>
      selectedItems.value.includes(`${item.id}-${index}`),
    )
  );
});

const isIndeterminate = computed(() => {
  const items = detailpenawaran.value.items || [];
  const selected = selectedItems.value.length;
  return selected > 0 && selected < items.length;
});

const isAllTaxSelected = computed(() => {
  const items = detailpenawaran.value.items || [];
  return (
    items.length > 0 &&
    items.every((item, index) =>
      selectedPpnItems.value.includes(`${item.id}-${index}`),
    )
  );
});

// const toggleAllItems = () => {
//   const items = detailpenawaran.value.items || [];

//   if (isAllSelected.value) {
//     // kalau sudah semua → unselect semua
//     selectedItems.value = [];
//   } else {
//     // kalau belum semua → select semua
//     selectedItems.value = items.map((item, index) => `${item.id}-${index}`);
//   }
// };

const toggleAllTax = (val: boolean) => {
  const items = detailpenawaran.value.items || [];

  if (val) {
    selectedPpnItems.value = items.map((item, index) => `${item.id}-${index}`);
  } else {
    selectedPpnItems.value = [];
  }
};

// watch(selectedItems, (val) => {
//   selectedPpnItems.value = [...val];
// });

watch(
  () => detailpenawaran.value?.item_tambahan,
  (items) => {
    if (!items) return;

    const values = items.map(
      (item: any, index: number) => `${item.id}-${index}`,
    );

    selectedNominalItemTambahan.value = values;
    // selectedPpnItemTambahan.value = values;
    // selectedPphItemTambahan.value = values;
  },
  { immediate: true },
);
const selectedPpnItemTambahan = ref<string[]>([]);
const selectedPphItemTambahan = ref<string[]>([]);
const selectedItemTambahan = ref<string[]>([]);

function handleItemTambahanChange(key: string) {
  const isSelected = selectedItemTambahan.value.includes(key);

  // kalau UNCHECK → hapus juga tax
  if (!isSelected) {
    selectedTaxItemTambahan.value = selectedTaxItemTambahan.value.filter(
      (k) => k !== key,
    );
  }
}

function handleNominalItemTambahan(item: any, index: number) {
  const key = `${item.id}-${index}`;

  const selected = selectedNominalItemTambahan.value.includes(key);

  if (!selected) {
    selectedTaxItemTambahan.value = selectedTaxItemTambahan.value.filter(
      (v) => v !== key,
    );

    item.ppn_item_tambahan = 0;
    item.pph_item_tambahan = 0;
  }
}

function handlePpnItemTambahan(item: any, index: number) {
  const key = `${item.id}-${index}`;

  if (selectedPpnItemTambahan.value.includes(key)) {
    item.ppn_item_tambahan = item.nominal_tambahan * 0.11;
  } else {
    item.ppn_item_tambahan = 0;
  }
}

function handlePphItemTambahan(item: any, index: number) {
  const key = `${item.id}-${index}`;

  if (selectedPphItemTambahan.value.includes(key)) {
    item.pph_item_tambahan = item.nominal_tambahan * 0.02;
  } else {
    item.pph_item_tambahan = 0;
  }
}

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
const subtotalRevisi = computed(() => {
  return newRevisi.value.items.reduce(
    (sum: number, item: any) =>
      sum + Number(item.nominal) * Number(item.jumlahUnit),
    0,
  );
});

const selectedPpnDetailItemsRevisi = computed(() => {
  return newRevisi.value.items.filter((item: any, index: number) =>
    selectedPpnItems.value.includes(`${item.id}-${index}`),
  );
});

const selectedPphDetailItemsRevisi = computed(() => {
  return newRevisi.value.items.filter((item: any, index: number) =>
    selectedPphItems.value.includes(`${item.id}-${index}`),
  );
});

const dasarPpnRevisi = computed(() => {
  return selectedPpnDetailItemsRevisi.value.reduce(
    (sum, item) => sum + item.nominal * item.jumlahUnit,
    0,
  );
});

const dasarPphRevisi = computed(() => {
  return selectedPphDetailItemsRevisi.value.reduce(
    (sum, item) => sum + item.nominal * item.jumlahUnit,
    0,
  );
});

const ppnRevisi = computed(() => dasarPpnRevisi.value * 0.11);
const pphRevisi = computed(() => dasarPphRevisi.value * 0.02);
const grandtotalRevisi = computed(() => {
  return (
    subtotalRevisi.value +
    ppnRevisi.value -
    pphRevisi.value +
    Number(new_invoice.value.adm || 0) +
    Number(new_invoice.value.jasa || 0)
  );
});

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
      selectedItems.value = [];
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
      selectedItems.value = [];
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
      selectedItems.value = [];
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
      selectedItems.value = [];
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

const new_invoice = ref<invoiceM>({
  id_perusahaan: "",
  id_cabang_perusahaan: "",
  nama_perusahaan: "",
  nama_group_pt: "",
  nama_cabang_perusahaan: "",
  nama_kategori_object: "",
  kategori_object: "",
  id_penawaran: "",
  tanggal: "",
  jatuhTempo: "",
  remark: "",
  pajak: 0, // FIXED dari Samsat
  subtotal: 0,
  ppn: 0,
  pph: 0,
  status: "Draft",
  items: [],
  createdAt: 0,
  createdBy: "",
  nama_surat: "",
  nama_kategori_item: "",
  item_tambahan: [],
  subtotal_pekerjaan: 0,
  perihal_invoice: "",
  handle_by_aresa: "",
  jumlah_revisi: 1,
  pic: "",
});

const getKey = (item: any, index: number) => `${item.id}-${index}`;

const isKAM = computed(() => {
  return detailpenawaran.value?.handle_by_aresa === "KAM";
});

const isABK = computed(() => {
  return detailpenawaran.value?.handle_by_aresa != "KAM";
});

const dasarPpnTambahan = computed(() => {
  return (detailpenawaran.value.item_tambahan || [])
    .filter((item, index) =>
      selectedTaxItemTambahan.value.includes(`${item.id}-${index}`),
    )
    .reduce((sum, item) => sum + Number(item.nominal_tambahan || 0), 0);
});

const dasarPphTambahan = computed(() => {
  return (detailpenawaran.value.item_tambahan || [])
    .filter((item, index) =>
      selectedTaxItemTambahan.value.includes(`${item.id}-${index}`),
    )
    .reduce((sum, item) => sum + Number(item.nominal_tambahan || 0), 0);
});

// ========================
// 🔹 SUBTOTAL ITEM UTAMA
// ========================
const subtotalItems = computed(() => {
  const items = detailpenawaran.value.items || [];

  if (isKAM.value) {
    return items.reduce(
      (sum, item) => sum + getHarga(item) * Number(item.jumlahUnit),
      0,
    );
  }

  return items
    .filter((item, index) =>
      selectedItems.value.includes(`${item.id}-${index}`),
    )
    .reduce((sum, item) => sum + getHarga(item) * Number(item.jumlahUnit), 0);
});

const subtotalItemTambahan = computed(() => {
  const items = detailpenawaran.value.item_tambahan || [];

  const filteredItems = isKAM.value
    ? items
    : items.filter((item, index) =>
        selectedItems.value.includes(`${item.id}-${index}`),
      );

  return filteredItems.reduce(
    (sum, item) => sum + Number(item.nominal_tambahan || 0),
    0,
  );
});

// ========================
// 🔹 SUBTOTAL ITEM TAMBAHAN
// ========================
const subtotalTambahan = computed(() => {
  return (detailpenawaran.value.item_tambahan || [])
    .filter((item, index) =>
      selectedItemTambahan.value.includes(`${item.id}-${index}`),
    )
    .reduce((sum, item) => sum + Number(item.nominal_tambahan || 0), 0);
});

// ========================
// 🔹 SUBTOTAL TOTAL (TANPA PAJAK)
// ========================
const subtotal = computed(() => {
  return subtotalItems.value + subtotalTambahan.value;
});

// ========================
// 🔹 DASAR PAJAK ITEM UTAMA
// ========================
const dasarPajakItems = computed(() => {
  const items = detailpenawaran.value.items || [];

  if (isKAM.value) {
    return items
      .filter((item, index) =>
        selectedPpnPphItems.value.includes(`${item.id}-${index}`),
      )
      .reduce((sum, item) => sum + getHarga(item) * Number(item.jumlahUnit), 0);
  }

  return items.reduce((sum, item, index) => {
    const key = `${item.id}-${index}`;

    if (selectedPpnItems.value.includes(key)) {
      return sum + getHarga(item) * Number(item.jumlahUnit);
    }

    return sum;
  }, 0);
});

// ========================
// 🔹 DASAR PAJAK TAMBAHAN
// ========================
const dasarPajakTambahan = computed(() => {
  return (detailpenawaran.value.item_tambahan || [])
    .filter((item, index) =>
      selectedTaxItemTambahan.value.includes(`${item.id}-${index}`),
    )
    .reduce((sum, item) => sum + Number(item.nominal_tambahan || 0), 0);
});

// ========================
// 🔹 PPN
// ========================
const ppn = computed(() => {
  return (dasarPajakItems.value + dasarPajakTambahan.value) * 0.11;
});

// ========================
// 🔹 PPH
// ========================
const pph = computed(() => {
  return (dasarPajakItems.value + dasarPajakTambahan.value) * 0.02;
});

// ========================
// 🔹 GRAND TOTAL
// ========================
const grandtotal = computed(() => {
  return subtotal.value + ppn.value - pph.value;
});

const subtotal_pekerjaan = computed(() => {
  const subtotalItems = (detailpenawaran.value.items || []).reduce(
    (sum: number, item: any) => sum + Number(item.subtotal),
    0,
  );

  return subtotalItems;
});

const selectedNominalDetailItemTambahan = computed(() => {
  return (detailpenawaran.value.item_tambahan || []).filter(
    (item: any, index: number) =>
      selectedNominalItemTambahan.value.includes(`${item.id}-${index}`),
  );
});

const selectedTaxDetailItemTambahan = computed(() => {
  return (detailpenawaran.value.item_tambahan || []).filter(
    (item: any, index: number) =>
      selectedTaxItemTambahan.value.includes(`${item.id}-${index}`),
  );
});

const dasarNominalItemTamabahan = computed(() => {
  return (detailpenawaran.value.item_tambahan || []).reduce(
    (sum: number, item: any) => sum + Number(item.nominal_tambahan),
    0,
  );
});

const dasarPajakItemTambahan = computed(() => {
  return selectedTaxDetailItemTambahan.value.reduce(
    (sum, item) => sum + Number(item.nominal_tambahan || 0),
    0,
  );
});

const ppnItemTambahan = computed(() => {
  return (detailpenawaran.value.item_tambahan || [])
    .filter((item, index) =>
      selectedTaxItemTambahan.value.includes(`${item.id}-${index}`),
    )
    .reduce((sum, item) => {
      return sum + Number(item.nominal_tambahan || 0) * 0.11;
    }, 0);
});

const pphItemTambahan = computed(() => {
  return (detailpenawaran.value.item_tambahan || [])
    .filter((item, index) =>
      selectedTaxItemTambahan.value.includes(`${item.id}-${index}`),
    )
    .reduce((sum, item) => {
      return sum + Number(item.nominal_tambahan || 0) * 0.02;
    }, 0);
});
const selectedTaxDetailItems = computed(() => {
  return detailpenawaran.value.items.filter((item: any, index: number) =>
    selectedPpnPphItems.value.includes(`${item.id}-${index}`),
  );
});

const getHarga = (item: any) => {
  if (
    item.nominal_edit !== null &&
    item.nominal_edit !== undefined &&
    item.nominal_edit !== "" &&
    item.nominal_edit !== 0 // 🔥 TAMBAHAN PENTING
  ) {
    return Number(item.nominal_edit);
  }
  return Number(item.nominal);
};

const dasarPajak = computed(() => {
  const items = detailpenawaran.value.items || [];

  if (isKAM.value) {
    return items
      .filter((item, index) =>
        selectedPpnPphItems.value.includes(`${item.id}-${index}`),
      )
      .reduce((sum, item) => {
        return sum + getHarga(item) * item.jumlahUnit;
      }, 0);
  } else {
    return items.reduce((sum, item, index) => {
      const key = `${item.id}-${index}`;

      let total = 0;

      if (selectedPpnItems.value.includes(key)) {
        total += getHarga(item) * item.jumlahUnit;
      }

      if (selectedPphItems.value.includes(key)) {
        total += getHarga(item) * item.jumlahUnit;
      }

      return sum + total;
    }, 0);
  }
});

const dasarPajakTotal = computed(
  () => dasarPajak.value + dasarPajakItemTambahan.value,
);

const dasarPphTotal = computed(
  () => dasarPajak.value + dasarPajakItemTambahan.value,
);
// const ppn = computed(() => {
//   return dasarPajak.value * 0.11 + ppnItemTambahan.value;
// });

// const pph = computed(() => {
//   return dasarPajak.value * 0.02 + pphItemTambahan.value;
// });
// const grandtotal = computed(() => {
//   return subtotal.value + ppn.value - pph.value;
// });

watch(
  () => new_invoice.value.id_perusahaan,
  (id) => {
    const b = _.find(
      perusahaanStore.getDataPerusahaan,
      (o: any) => o.id === id,
    );
    if (b) new_invoice.value.nama_perusahaan = b.nama_perusahaan;
  },
);

/* ================= AUTO NAMA CABANG ================= */
watch(
  () => new_invoice.value.id_cabang_perusahaan,
  (id) => {
    const b = _.find(masterCabangStore.getDataCabang, (o: any) => o.id === id);
    if (b) new_invoice.value.nama_cabang_perusahaan = b.nama_cabang;
  },
);

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

async function addkodebayar() {
  const file = uploadstore.getUrlRef2; // sesuaikan kalau perlu .value / ()

  if (!data.new_kodebayar.kode_bayar) {
    return notificationStore.showError("Kode Bayar tidak boleh kosong");
  }

  if (!file) {
    return notificationStore.showError(
      "Doc wajib diisi untuk menambahkan ke list",
    );
  }

  tempKodeBayar.value.push({
    kode_bayar: data.new_kodebayar.kode_bayar,
    file_kode_bayar: file,
  });

  data.new_kodebayar = {
    kode_bayar: "",
    file_kode_bayar: "",
  };

  uploadstore.setReset2();
}

async function deletekodebayar(index: number) {
  _.pullAt(tempKodeBayar.value, index);
}

async function addkodebayarPemberkasan() {
  data.new_kodebayar.file_kode_bayar = uploadstore.getUrlRef2;
  if (data.new_kodebayar.kode_bayar == "") {
    return notificationStore.showError("Kode Bayar tidak boleh kosong");
  }
  if (data.new_kodebayar.file_kode_bayar == "") {
    return notificationStore.showError(
      "Doc wajib diisi untuk menambahkan ke list",
    );
  }

  detailpenawaran.value.item_kode_bayar.push({ ...data.new_kodebayar });
  data.new_kodebayar = {
    kode_bayar: "",
    file_kode_bayar: "",
  };
  uploadstore.setReset2();
}

async function deletekodebayarPemberkasan(index: number) {
  _.pullAt(detailpenawaran.value.item_kode_bayar, index);
}

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
  detailpenawaran.value.berkas.push({ ...data.new_pemberkasan });
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
  _.pullAt(detailpenawaran.value.berkas, index);
}

function adddocBerkas() {
  const file = uploadstore.getUrlRef; // sesuaikan (.value / ())

  if (!data.new_pemberkasan.id_kategori_item) {
    return notificationStore.showError("pilih kategori item terlebih dahulu");
  }

  if (!data.new_pemberkasan.id_dokumen) {
    return notificationStore.showError("pilih jenis dokumen terlebih dahulu");
  }

  if (!data.new_pemberkasan.no_dokumen) {
    return notificationStore.showError("input no dokumen terlebih dahulu");
  }

  if (!file) {
    return notificationStore.showError("upload dokumen berkas terlebih dahulu");
  }

  tempBerkas.value.push({
    ...data.new_pemberkasan,
    file_dokumen: file,
  });

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

function deletedocBerkas(index: number) {
  _.pullAt(tempBerkas.value, index);
}

async function savepemberkasan() {
  // if (data.item_kode_bayar.length < 1) {
  //   return notificationStore.showError("isi kode bayar terlebih dahulu");
  // }
  // if (detailpenawaran.value.berkas.length < 1) {
  //   return notificationStore.showError("isi berkas terlebih dahulu");
  // }
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi simpan Berkas",
    "Anda yakin ingin menyimpan berkas untuk penawaran ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Pemberkasan dibatalkan");
  }
  useloadingStore().setLoading(true);
  const dataset = detailpenawaran.value;
  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;
  dataset.pemberkasanAt = moment().unix();
  dataset.pemberkasanBy = useUserStore().getEmail;
  dataset.status = "Pemberkasan";
  const c = await uploadPemberkasanPenawaran(dataset);
  if (c == "ok") {
    notificationStore.showSuccess("Pemberkasan berhasil disimpan");
    data.dialogpemberkasan = false;
    data.dokumen_pemberkasan = [];
  } else {
    notificationStore.showError("Pemberkasan Gagal disimpan");
  }
  useloadingStore().setLoading(false);
}

async function cancelpemberkasan() {
  data.dialogpemberkasan = false;
  const id = route.params.id;
  await penawaranstore.tarikDetailPenawaranAct(_.toString(id));
}

async function addberkas() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi simpan Berkas",
    "Anda yakin ingin menyimpan berkas untuk penawaran ini?",
  );
  if (!confirmed) {
    return notificationStore.showError("Pemberkasan dibatalkan");
  }

  useloadingStore().setLoading(true);
  const dataset = detailpenawaran.value;

  // 🔥 commit ke data utama
  detailpenawaran.value.berkas = [
    ...(detailpenawaran.value.berkas || []),
    ...tempBerkas.value,
  ];
  detailpenawaran.value.item_kode_bayar = [
    ...(detailpenawaran.value.item_kode_bayar || []),
    ...tempKodeBayar.value,
  ];
  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;

  const c = await uploadPemberkasanPenawaran(dataset);
  if (c == "ok") {
    notificationStore.showSuccess("Pemberkasan berhasil disimpan");
    data.dialogaddberkas = false;
    data.dokumen_pemberkasan = [];
    tempBerkas.value = [];
    tempKodeBayar.value = [];
  } else {
    notificationStore.showError("Pemberkasan Gagal disimpan");
  }
  useloadingStore().setLoading(false);
}

function handleSubmitBerkas() {
  if (data.tambahupdateberkas === "add") {
    addberkas();
  } else if (data.tambahupdateberkas === "update") {
    savepemberkasan();
  }
}

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
  selectedItems.value = [];
  selectedPphItems.value = [];
  selectedPpnItems.value = [];
  // await perusahaanStore.tarikDataPerusahaanAct();
  // await masterCabangStore.tarikDataCabangAct();
  new_invoice.value.pajak = detailpenawaran.value.total;
  new_invoice.value.items = detailpenawaran.value.items;
  new_invoice.value.nama_surat = detailpenawaran.value.nama_surat || "-";
  new_invoice.value.telepon_perusahaan =
    detailpenawaran.value.telepon_perusahaan || "-";
  new_invoice.value.nama_kategori_item =
    detailpenawaran.value.items[0].nama_kategori_item || "-";
  new_invoice.value.id_perusahaan = detailpenawaran.value.id_perusahaan || "-";
  new_invoice.value.nama_perusahaan =
    detailpenawaran.value.nama_perusahaan || "-";
  new_invoice.value.id_cabang_perusahaan =
    detailpenawaran.value.id_cabang_perusahaan || "-";
  new_invoice.value.nama_cabang_perusahaan =
    detailpenawaran.value.nama_cabang_perusahaan || "-";
  new_invoice.value.id_penawaran = detailpenawaran.value.id!;
  new_invoice.value.nama_group_pt = detailpenawaran.value.nama_group_pt || "-";
  new_invoice.value.perihal = detailpenawaran.value.perihal || "-";
  new_invoice.value.alamat_cabang = detailpenawaran.value.alamat_cabang || "-";
  new_invoice.value.nama_kategori_object =
    detailpenawaran.value.nama_kategori_object || "-";
  new_invoice.value.berkas = detailpenawaran.value.berkas || [];
  new_invoice.value.item_kode_bayar =
    detailpenawaran.value.item_kode_bayar || [];
  new_invoice.value.handle_by_aresa =
    detailpenawaran.value.handle_by_aresa || false;
  new_invoice.value.kategori_object =
    detailpenawaran.value.kategori_object || "-";
  data.dialogAdd = true;
}

async function buatinvoice() {
  if (new_invoice.value.tanggal == "" || new_invoice.value.jatuhTempo == "") {
    return notificationStore.showError("Tanggal dan Jatuh Tempo harus diisi");
  }
  if (new_invoice.value.perihal_invoice == "") {
    return notificationStore.showError("Perihal Invoice harus diisi");
  }
  if (new_invoice.value.pic == "") {
    return notificationStore.showError("Perihal Invoice harus diisi");
  }
  if (subtotal.value! <= 0) {
    return notificationStore.showError("Subtotal harus lebih dari 0");
  }
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Buat Invoice",
    "Anda yakin ingin buat invoice ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Buat Invoice dibatalkan");
  }

  new_invoice.value.createdAt = moment().unix();
  new_invoice.value.createdBy = userStore.getEmail;
  new_invoice.value.subtotal = subtotal.value;
  new_invoice.value.ppn = ppn.value;
  new_invoice.value.pph = pph.value;
  new_invoice.value.grandtotal = grandtotal.value;
  new_invoice.value.subtotal_pekerjaan = subtotal_pekerjaan.value;
  new_invoice.value.subtotal_item_tambahan = subtotalItemTambahan.value;
  new_invoice.value.item_tambahan = (
    detailpenawaran.value.item_tambahan || []
  ).map((item, index) => {
    const key = `${item.id}-${index}`;

    const isSelected = selectedItemTambahan.value.includes(key);

    // KAM pakai 1 checkbox
    const isTax = selectedTaxItemTambahan.value.includes(key);

    return {
      ...item,
      status_item_tambahan: isSelected,
      kena_ppn: isTax,
      kena_pph: isTax,
      ppn_tambahan: isTax ? Number(item.nominal_tambahan) * 0.11 : 0,
      pph_tambahan: isTax ? Number(item.nominal_tambahan) * 0.02 : 0,
    };
  });
  new_invoice.value.items = detailpenawaran.value.items.map(
    (item: any, index: number) => {
      const key = `${item.id}-${index}`;

      if (isKAM.value) {
        const isTax = selectedPpnPphItems.value.includes(key);

        return {
          ...item,
          status_item: true, // semua item masuk invoice di KAM
          kena_ppn: isTax,
          kena_pph: isTax,
        };
      } else {
        return {
          ...item,
          status_item: selectedItems.value.includes(key),

          kena_ppn:
            selectedItems.value.includes(key) &&
            selectedPpnItems.value.includes(key),

          kena_pph:
            selectedItems.value.includes(key) &&
            selectedPpnItems.value.includes(key),
        };
      }
    },
  );
  useloadingStore().setLoading(true);
  console.log(new_invoice.value, "cek data invoice");
  const c = await setinvoice(new_invoice.value);
  if (c == "ok") {
    data.dialogAdd = false;
    sessionStorage.removeItem("m_item_kategori");
    notificationStore.showSuccess("Invoice Berhasil Dibuat");
  } else {
    notificationStore.showError(c || "Invoice Gagal Dibuat");
  }
  data.dialogAdd = false;
  navigateTo("/admin/invoice");
  useloadingStore().setLoading(false);
}

const opendialogkirimpenawaran = async () => {
  data.dialogkirimpenawaran = true;

  const pdfFile = await generatePdfFromCanvas();

  if (pdfFile) {
    data.attachments = [pdfFile];
  }
};

const getFileUrl = (file) => {
  return URL.createObjectURL(file);
};

const previewFile = (file: string) => {
  if (!file) return;

  const url = URL.createObjectURL(file);
  window.open(url, "_blank");
};

const opendialogspk = () => {
  data.dialogspk = true;
};

const opendialogaddberkas = async () => {
  data.tambahupdateberkas = "add";
  tempBerkas.value = [];
  tempKodeBayar.value = [];
  await penawaranstore.tarikDetailPenawaranAct(detailpenawaran.value.id!);
  await masterdokumenstore.tarikDataMasterDokumenAct();
  data.dialogaddberkas = true;
};

const opendialogpemberkasan = async () => {
  data.tambahupdateberkas = "update";
  await penawaranstore.tarikDetailPenawaranAct(detailpenawaran.value.id!);
  await masterdokumenstore.tarikDataMasterDokumenAct();
  data.dialogpemberkasan = true;
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
const loading = useloadingStore();
const isLoadingEmail = ref(false);

async function terkirim() {
  if (!data.new_kirim_penawaran.email.length) {
    return notificationStore.showError("minimal 1 email tujuan");
  }

  if (data.new_kirim_penawaran.tanggal_kirim_penawaran == "") {
    return notificationStore.showError("input tanggal terlebih dahulu");
  }

  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Kirim Penawaran",
    "Anda yakin ingin mengirim penawaran ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Kirim dibatalkan");
  }
  useloadingStore().setLoading(true);
  const dataset = detailpenawaran.value;

  // =========================
  // META DATA
  // =========================
  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;
  dataset.terkirimAt = moment().unix();
  dataset.terkirimBy = useUserStore().getEmail;
  dataset.status = "Dikirim";

  // =========================
  // DATA EMAIL
  // =========================
  dataset.email_kirim = data.new_kirim_penawaran.email;
  dataset.email_cc = data.new_kirim_penawaran.email_cc || "-";
  dataset.email_bcc = data.new_kirim_penawaran.email_bcc || "-";

  dataset.tanggal_kirim_penawaran =
    data.new_kirim_penawaran.tanggal_kirim_penawaran;

  dataset.perihal = detailpenawaran.value.perihal;

  // isi body dari quill editor
  dataset.body_email = body.value;

  // =========================
  // ATTACHMENTS
  // =========================

  // upload paralel
  let uploadedFiles: string[] = [];

  if (data.attachments?.length) {
    uploadedFiles = await Promise.all(
      data.attachments.map((file) => uploadFile(file)),
    );
  }

  dataset.attachments = uploadedFiles;

  console.log("DATAKIRIM", dataset);

  const c = await updatepenawaran(dataset);
  useloadingStore().setLoading(false);

  if (c == "ok") {
    notificationStore.showSuccess("Data Penawaran Berhasil di Kirim");
  } else {
    notificationStore.showError("Data Penawaran Gagal di Kirim");
  }

  data.dialogkirimpenawaran = false;
}

async function suratperintahkerja() {
  if (data.new_spk.tanggal_spk == "") {
    return notificationStore.showError("Tanggal tidak boleh kosong");
  }
  if (data.new_spk.document_spk.length == 0) {
    return notificationStore.showError("List Dokumen tidak boleh kosong");
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
  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;
  dataset.spkAt = moment().unix();
  dataset.spkBy = useUserStore().getEmail;
  dataset.status = "SPK";
  dataset.document_spk = data.new_spk.document_spk;
  dataset.tanggal_spk = data.new_spk.tanggal_spk;
  const c = await updatepenawaran(dataset);
  if (c == "ok") {
    notificationStore.showSuccess("SPK Berhasil disimpan");
  } else {
    notificationStore.showError("SPK Gagal disimpan");
  }
  useloadingStore().setLoading(false);
  uploadstore.setReset();
  pictureStore.reset();
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
  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;
  dataset.prosesAt = moment().unix();
  dataset.prosesBy = useUserStore().getEmail;
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

async function disetujui() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Disetujui",
    "Anda yakin ingin menyetujui penawaran ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Penawaran dibatalkan");
  }
  useloadingStore().setLoading(true);
  const dataset = detailpenawaran.value;
  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;
  dataset.disetujuiAt = moment().unix();
  dataset.disetujuiBy = useUserStore().getEmail;
  dataset.status = "Disetujui";
  const c = await updatesetujuiPenawaran(dataset);
  if (c == "ok") {
    notificationStore.showSuccess("Data Penawaran Berhasil Diubah");
    sessionStorage.removeItem("m_item_kategori");
  } else {
    notificationStore.showError("Data Penawaran Gagal Diubah");
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
  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;
  dataset.dibatalkanAt = moment().unix();
  dataset.dibatalkanBy = useUserStore().getEmail;
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
  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;
  dataset.dibatalkanAt = moment().unix();
  dataset.dibatalkanBy = useUserStore().getEmail;
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
      selectedItems.value = [];
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
      selectedItems.value = [];
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
      selectedItems.value = [];
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
      selectedItems.value = [];
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

async function setnamagrouppt() {
  for (const element of penawaranstore.getDataPenawaran) {
    await updatedatabase("penawaran", element.id!, {
      nama_group_pt: "PT. Astra International Tbk",
    });
    for (const elementitem of element.items) {
      await updatedatabase(
        "m_item_kategori/" + elementitem.id_kategori_item + "/penawaran",
        element.id!,
        {
          nama_group_pt: "PT. Astra International Tbk",
        },
      );
    }
    notificationStore.showSuccess(
      "Berhasil memperbarui nama group PT",
      element.id,
    );
  }
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
      detailpenawaran.value.id_penawaran,
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

async function opendialogrevisi(item: revisipenawaranM) {
  isOpeningDialogRevisi.value = true;
  await masterobjectstore.tarikDataObjectKategoriAct();
  await perusahaanStore.tarikDataPerusahaanAct();
  await masterCabangStore.tarikDataCabangAct();
  newRevisi.value = _.assign({}, item);
  data.dialogRevisi = true;
  nextTick(() => {
    isOpeningDialogRevisi.value = false;
  });
}

function getFileName(url: string) {
  try {
    const decoded = decodeURIComponent(url);
    return decoded.split("/").pop()?.split("?")[0] || "file";
  } catch {
    return "file";
  }
}

const addpic = () => {
  if (uploadstore.getUrlRef == "") {
    return notificationStore.showError("Foto tidak boleh kosong");
  }
  data.new_spk.document_spk.push(uploadstore.getUrlRef);
  pictureStore.pushPic(uploadstore.getUrlRef);
  uploadstore.setReset();
};

function additemtambahanlainya() {
  const item = newlisitemtambahan.value;

  if (!item.keterangan_penawaran || item.keterangan_penawaran.trim() === "") {
    return notificationStore.showError(
      "Keterangan tambahan tidak boleh kosong",
    );
  }

  if (!item.nominal_tambahan || item.nominal_tambahan <= 0) {
    return notificationStore.showError("Nominal tidak boleh 0");
  }

  detailpenawaran.value.item_tambahan.push({
    ...item,
    nominal_tambahan: Number(item.nominal_tambahan),
  });
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

function deleteitemtambahanlainya(index: number) {
  _.pullAt(detailpenawaran.value.item_tambahan, index);
}

const startEdit = (item) => {
  item.nominal_edit = item.nominal;
  item.isEdit = true;
};

const saveEdit = (item) => {
  item.nominal = item.nominal_edit;
  item.subtotal = item.nominal_edit;
  item.isEdit = false;
};

const cancelEdit = (item) => {
  item.nominal_edit = item.nominal; // reset
  item.isEdit = false;
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
    <!-- // KIRIM EMAIL \\ -->
    <v-dialog
      v-model="data.dialogkirimpenawaran"
      max-width="800"
      scrollable
      persistent
    >
      <Loading-email v-if="isLoadingEmail" />
      <v-card rounded="0" class="elevation-24" style="overflow: hidden">
        <v-card-title
          class="pa-2 bg-grey-darken-4 d-flex align-center"
          style="font-size: 1rem; min-height: 40px"
        >
          <span class="ml-2 font-weight-medium">Kirim Email</span>
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            density="comfortable"
            class="text-white"
            @click="data.dialogkirimpenawaran = false"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pa-0 bg-white">
          <div class="px-4 pt-2">
            <v-row class="mt-2" dense>
              <v-col>
                <v-combobox
                  v-model="data.new_kirim_penawaran.email"
                  multiple
                  clearable
                  label="Kepada"
                  variant="underlined"
                  placeholder="Ketik email dan tekan Enter"
                >
                  <template #chip="{ props, item }">
                    <v-chip
                      v-bind="props"
                      color="primary"
                      size="small"
                      class="ma-1"
                    >
                      <template v-slot:prepend>
                        <v-avatar class="bg-primary text-uppercase" start>
                          {{ item.title.slice(0, 1) }}
                        </v-avatar>
                      </template>
                      {{ item.title }}
                    </v-chip>
                  </template>
                </v-combobox>
              </v-col>

              <v-col cols="12" sm="4">
                <date-picker-auto
                  v-model="data.new_kirim_penawaran.tanggal_kirim_penawaran"
                  class="w-100 custom-datepicker"
                  label="Tgl Kirim Penawaran"
                />
              </v-col>
            </v-row>

            <div style="margin-top: -15px">
              <v-combobox
                v-model="data.new_kirim_penawaran.email_cc"
                multiple
                clearable
                label="Cc"
                variant="underlined"
                placeholder="Ketik email Cc dan tekan Enter"
              >
                <template #chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    color="primary"
                    size="small"
                    class="ma-1"
                  >
                    <template v-slot:prepend>
                      <v-avatar class="bg-primary text-uppercase" start>
                        {{ item.title.slice(0, 1) }}
                      </v-avatar>
                    </template>
                    {{ item.title }}
                  </v-chip>
                </template>
              </v-combobox>
            </div>
            <div style="margin-top: -15px">
              <v-combobox
                v-model="data.new_kirim_penawaran.email_bcc"
                multiple
                clearable
                label="Bcc"
                variant="underlined"
                placeholder="Ketik email Bcc dan tekan Enter"
              >
                <template #chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    color="primary"
                    size="small"
                    class="ma-1"
                  >
                    <template v-slot:prepend>
                      <v-avatar class="bg-primary text-uppercase" start>
                        {{ item.title.slice(0, 1) }}
                      </v-avatar>
                    </template>
                    {{ item.title }}
                  </v-chip>
                </template>
              </v-combobox>

              <v-text-field
                v-model="detailpenawaran.perihal"
                placeholder="Subjek"
                label="Subjek"
                variant="underlined"
                density="compact"
                color="primary"
                hide-details
                readonly
                class="custom-field mb-3 mt-2"
              />
            </div>
          </div>

          <div class="editor-wrapper">
            <QuillEditor
              v-model:content="body"
              contentType="html"
              theme="snow"
              toolbar="essential"
              style="min-height: 100px; border: none !important"
            />
          </div>

          <div
            v-if="data.attachments && data.attachments.length > 0"
            class="px-4 py-2 d-flex flex-wrap gap-2 border-t"
          >
            <v-chip
              v-for="(file, index) in data.attachments"
              :key="index"
              color="blue"
              label
              class="mr-2 mb-1"
              @click="previewFile(file)"
              @click:close="data.attachments.splice(index, 1)"
            >
              <v-icon start size="small">mdi-paperclip</v-icon>
              <span class="text-truncate" style="max-width: 250px">
                {{ file.name }}
              </span>
              <v-icon end size="small">mdi-open-in-new</v-icon>
            </v-chip>
          </div>
          <div
            v-else
            class="px-4 py-3 d-flex align-center justify-start border-t"
            style="gap: 10px"
          >
            <!-- Spinner -->
            <v-progress-circular
              indeterminate
              size="20"
              width="2"
              color="primary"
            />

            <!-- Text -->
            <span class="text-caption text-grey-darken-1">
              Sedang menyiapkan file...
            </span>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-3 bg-white">
          <v-btn
            color="blue-darken-2"
            variant="flat"
            :loading="isLoadingEmail"
            @click="terkirim"
            class="px-6 text-none font-weight-bold mr-2"
            rounded="pill"
          >
            Simpan Data
            <!-- {{
              detailpenawaran.status_terkirim_email
                ? "Simpan Data"
                : "Simpan Data & Kirim"
            }} -->
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            icon="mdi-delete-outline"
            variant="text"
            color="grey-darken-2"
            @click="data.dialogkirimpenawaran = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

          <div class="pa-2 rounded-lg mt-3">
            <upload-image
              typefolder="doc_spk"
              label="Upload Dokumen SPK (.pdf)"
            />

            <v-btn
              color="primary"
              block
              class="mb-4 mt-5 rounded-small font-weight-medium"
              prepend-icon="mdi-menu-down"
              append-icon="mdi-menu-down"
              size="small"
              @click="addpic"
            >
              Tambahkan ke Daftar
            </v-btn>

            <template v-if="pictureStore.getter_pictures.length">
              <v-row dense>
                <v-col
                  v-for="item in pictureStore.getter_pictures"
                  :key="item"
                  cols="12"
                >
                  <v-card
                    elevation="0"
                    class="pa-3 rounded-lg"
                    style="border: 1px solid #e2e8f0; background-color: #ffffff"
                  >
                    <div class="d-flex align-center">
                      <v-avatar
                        size="40"
                        color="blue-lighten-5"
                        class="mr-3 flex-shrink-0"
                      >
                        <v-icon color="blue-darken-1" size="20"
                          >mdi-file-document-outline</v-icon
                        >
                      </v-avatar>

                      <div class="flex-grow-1 overflow-hidden">
                        <a
                          :href="item"
                          target="_blank"
                          class="text-decoration-none"
                          style="display: block; color: inherit"
                        >
                          <div
                            class="text-body-1 text-blue-darken-2"
                            style="
                              word-break: break-all;
                              line-height: 1.2;
                              cursor: pointer;
                              text-decoration: underline;
                            "
                          >
                            {{ getFileName(item) }}
                          </div>
                        </a>
                        <div class="text-caption text-grey">
                          Klik untuk melihat file
                        </div>
                      </div>

                      <v-btn
                        color="error"
                        variant="text"
                        size="small"
                        icon
                        class="ml-2"
                        @click="pictureStore.removePic(item)"
                      >
                        <v-icon size="20">mdi-delete-outline</v-icon>
                      </v-btn>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </template>

            <template v-else>
              <v-card
                flat
                class="d-flex flex-column align-center justify-center pa-10 rounded-lg text-center"
                style="
                  border: 2px dashed #cbd5e1;
                  background-color: #f9fafb;
                  min-height: 120px;
                "
              >
                <div class="text-body-2 font-weight-medium text-grey-darken-1">
                  Belum ada file yang ditambahkan
                </div>
              </v-card>
            </template>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="data.dialogspk = false">Batal</v-btn>
          <v-btn color="primary" variant="flat" @click="suratperintahkerja"
            >Simpan</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- // DIALOG PEMBERKASAN \\ -->
    <v-dialog
      v-model="data.dialogpemberkasan"
      max-width="1250"
      scrollable
      persistent
    >
      <v-card rounded="lg">
        <v-card-title class="px-6 py-3 bg-primary">
          <span
            class="d-flex align-center text-subtitle-1 font-weight-bold text-white"
          >
            PEMBERKASAN
          </span>
        </v-card-title>

        <v-card-text class="pa-0">
          <v-row no-gutters>
            <v-col cols="12" md="5" class="pa-6 border-e bg-grey-lighten-5">
              <div class="mb-4">
                <a-text-field
                  label="No Penawaran"
                  v-model="detailpenawaran.no_penawaran"
                  disabled
                  density="compact"
                  variant="outlined"
                  bg-color="white"
                />
                <a-textarea
                  label="Perihal"
                  v-model="detailpenawaran.perihal"
                  disabled
                  density="compact"
                  variant="outlined"
                  bg-color="white"
                  rows="2"
                  class="mt-3"
                />
              </div>

              <v-divider class="my-6"></v-divider>

              <div class="text-subtitle-2 mb-3 font-weight-bold">
                KODE BAYAR
              </div>
              <a-text-field
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
                @click="addkodebayarPemberkasan"
                prepend-icon="mdi-plus"
                >Add</v-btn
              >

              <div class="mt-4 border rounded bg-white">
                <v-data-table-virtual
                  :headers="data.headerkodebayar"
                  :items="detailpenawaran.item_kode_bayar"
                  height="165"
                  density="compact"
                >
                  <template v-slot:item.no="{ index }">
                    <span class="text-caption">{{ index + 1 }}.</span>
                  </template>

                  <template v-slot:item.aksi="{ index }">
                    <v-btn
                      @click="deletekodebayarPemberkasan(index)"
                      color="error"
                      size="small"
                      variant="text"
                      icon="mdi-delete-outline"
                    ></v-btn>
                  </template>

                  <template v-slot:item.file_kode_bayar="{ item }">
                    <v-btn
                      size="x-small"
                      variant="tonal"
                      color="primary"
                      v-if="item.file_kode_bayar"
                      :href="item.file_kode_bayar"
                      prepend-icon="mdi-file-document-outline"
                      target="_blank"
                    >
                      View
                    </v-btn>
                  </template>
                </v-data-table-virtual>
              </div>
            </v-col>

            <v-col cols="12" md="7" class="pa-6">
              <div class="text-subtitle-2 mb-4 font-weight-bold">Berkas</div>

              <v-row dense>
                <v-col cols="12">
                  <a-select
                    label="Pilih Item Kategori"
                    v-model="data.new_pemberkasan.id_kategori_item"
                    :items="detailpenawaran.items"
                    item-title="nama_kategori_item"
                    item-value="id_kategori_item"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6">
                  <a-text-field
                    label="Periode Awal"
                    v-model="data.new_pemberkasan.periode_mulai"
                    disabled
                    placeholder="----/--/--"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6">
                  <a-text-field
                    label="Periode Akhir"
                    v-model="data.new_pemberkasan.periode_selesai"
                    disabled
                    placeholder="----/--/--"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6">
                  <a-select
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
                  <a-text-field
                    label="No Dokumen"
                    placeholder="Cth. 0123"
                    v-model="data.new_pemberkasan.no_dokumen"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
              </v-row>

              <v-row align="center" style="margin-top: -25px">
                <v-col cols="7" class="mt-4">
                  <div class="mt-3">
                    <upload-image label="Upload" />
                  </div>
                </v-col>
                <v-col>
                  <a-select
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

              <v-card class="pa-2">
                <v-data-table-virtual
                  :headers="data.headerberkas"
                  :items="detailpenawaran.berkas"
                  height="250"
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
                    <v-btn
                      color="info"
                      size="small"
                      variant="text"
                      icon="mdi-file-eye-outline"
                      :href="item.file_dokumen"
                      target="_blank"
                    ></v-btn>
                    <span style="font-size: 11px">{{
                      item.status_dokumen
                    }}</span>
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
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-3 bg-white">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="cancelpemberkasan"
            class="px-4"
            >Batal</v-btn
          >
          <v-btn
            color="primary"
            variant="flat"
            @click="savepemberkasan"
            class="px-8"
            >Simpan Berkas</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- // DIALOG PEMBERKASAN \\ -->
    <v-dialog v-model="data.dialogaddberkas" max-width="1250" scrollable>
      <v-card rounded="lg">
        <v-card-title class="px-6 py-3 bg-primary">
          <span
            class="d-flex align-center text-subtitle-1 font-weight-bold text-white"
          >
            TAMBAH BERKAS
          </span>
        </v-card-title>

        <v-card-text class="pa-0">
          <v-row no-gutters>
            <v-col cols="12" md="5" class="pa-6 border-e bg-grey-lighten-5">
              <div class="mb-4">
                <a-text-field
                  label="No Penawaran"
                  v-model="detailpenawaran.no_penawaran"
                  disabled
                  density="compact"
                  variant="outlined"
                  bg-color="white"
                />
                <a-textarea
                  label="Perihal"
                  v-model="detailpenawaran.perihal"
                  disabled
                  density="compact"
                  variant="outlined"
                  bg-color="white"
                  rows="2"
                  class="mt-3"
                />
              </div>

              <v-divider class="my-6"></v-divider>

              <div class="text-subtitle-2 mb-3 font-weight-bold">
                KODE BAYAR
              </div>
              <a-text-field
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
                  :items="tempKodeBayar"
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
                      size="x-small"
                      variant="tonal"
                      color="primary"
                      v-if="item.file_kode_bayar"
                      :href="item.file_kode_bayar"
                      prepend-icon="mdi-file-document-outline"
                      target="_blank"
                    >
                      View
                    </v-btn>
                  </template>
                </v-data-table-virtual>
              </div>
            </v-col>

            <v-col cols="12" md="7" class="pa-6">
              <div class="text-subtitle-2 mb-4 font-weight-bold">Berkas</div>

              <v-row dense>
                <v-col cols="12">
                  <a-select
                    label="Pilih Item Kategori"
                    v-model="data.new_pemberkasan.id_kategori_item"
                    :items="detailpenawaran.items"
                    item-title="nama_kategori_item"
                    item-value="id_kategori_item"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6">
                  <a-text-field
                    label="Periode Awal"
                    v-model="data.new_pemberkasan.periode_mulai"
                    disabled
                    placeholder="----/--/--"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6">
                  <a-text-field
                    label="Periode Akhir"
                    v-model="data.new_pemberkasan.periode_selesai"
                    disabled
                    placeholder="----/--/--"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6">
                  <a-select
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
                  <a-text-field
                    label="No Dokumen"
                    placeholder="Cth. 0123"
                    v-model="data.new_pemberkasan.no_dokumen"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
              </v-row>

              <v-row align="center" style="margin-top: -25px">
                <v-col cols="7" class="mt-4">
                  <div class="mt-3">
                    <upload-image label="Upload" />
                  </div>
                </v-col>
                <v-col>
                  <a-select
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
                    @click="adddocBerkas"
                    prepend-icon="mdi-plus"
                  >
                    Add
                  </v-btn>
                </v-col>
              </v-row>

              <v-card class="pa-2">
                <v-data-table-virtual
                  :headers="data.headerberkas"
                  :items="tempBerkas"
                  height="250"
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
                    <v-btn
                      color="info"
                      size="small"
                      variant="text"
                      icon="mdi-file-eye-outline"
                      :href="item.file_dokumen"
                      target="_blank"
                    ></v-btn>
                    <span style="font-size: 11px">{{
                      item.status_dokumen
                    }}</span>
                  </template>

                  <template v-slot:item.aksi="{ index }">
                    <v-btn
                      color="error"
                      size="small"
                      variant="text"
                      icon="mdi-delete-outline"
                      @click="deletedocBerkas(index)"
                    ></v-btn>
                  </template>
                </v-data-table-virtual>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-3 bg-white">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="data.dialogaddberkas = false"
            class="px-4"
            >Batal</v-btn
          >
          <v-btn color="primary" variant="flat" @click="addberkas" class="px-8"
            >Simpan Berkas</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- // DIALOG REVISI PENAWARAN \\ -->
    <v-dialog
      v-model="data.dialogPenawaran"
      width="1250px"
      persistent
      scrollable
    >
      <v-card class="rounded-lg">
        <v-card-title class="px-6 py-3 bg-orange d-flex align-center">
          <span class="text-subtitle-1 font-weight-bold text-white">
            REVISI PENAWARAN
          </span>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4 bg-grey-lighten-5" style="max-height: 80vh">
          <div class="d-flex align-center mb-2 px-1">
            <v-icon
              size="18"
              color="primary"
              class="mr-2"
              icon="mdi-numeric-1-circle"
            />

            <span class="text-caption font-weight-black text-grey-darken-2">
              INFORMASI DOKUMEN
            </span>
          </div>

          <v-card variant="flat" border class="rounded-lg pa-4 mb-5 bg-white">
            <a-select
              label="Handle By"
              :items="[
                { label: 'Karya Aresa Mandiri (KAM)', value: 'KAM' },
                { label: 'Abdul Khalid (ABK)', value: 'ABK' },
              ]"
              v-model="newPenawaran.handle_by_aresa"
              class="mb-3"
            />

            <v-row>
              <v-col cols="12" sm="6">
                <a-select
                  label="Perusahaan"
                  item-title="nama_perusahaan"
                  item-value="id"
                  :items="perusahaanStore.getDataPerusahaan"
                  v-model="newPenawaran.id_perusahaan"
                  class="mb-3"
                />

                <a-select
                  label="Cabang Perusahaan"
                  item-title="nama_cabang"
                  item-value="id"
                  :items="masterCabangStore.getDataCabang"
                  v-model="newPenawaran.id_cabang_perusahaan"
                  class="mb-3"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <a-date-picker
                  v-model="newPenawaran.tanggal"
                  label="Tanggal Penawaran"
                  class="mb-3"
                />

                <a-text-field
                  label="No Telp Perusahaan"
                  v-model="newPenawaran.telepon_perusahaan"
                  class="mb-3"
                />
              </v-col>
            </v-row>

            <v-divider opacity="0"></v-divider>

            <a-select
              label="Nama Object"
              item-title="nama"
              item-value="id"
              :items="masterobjectstore.getDataObjectKategori"
              v-model="newPenawaran.id_object_kategori"
              class="mb-3"
            />

            <a-textarea
              label="Perihal"
              v-model="newPenawaran.perihal"
              class="mb-3"
            />
          </v-card>

          <div class="d-flex align-center mb-2 px-1">
            <v-icon
              size="18"
              color="primary"
              class="mr-2"
              icon="mdi-numeric-2-circle"
            />

            <span class="text-caption font-weight-black text-grey-darken-2">
              DAFTAR ITEM KATEGORI
            </span>
          </div>

          <v-card
            variant="flat"
            border
            class="rounded-lg overflow-hidden bg-white"
          >
            <div
              class="bg-grey-lighten-4 px-4 py-2 border-b d-flex align-center"
            >
              <span class="text-caption font-weight-bold text-grey-darken-3"
                >ITEM LIST</span
              >
              <v-spacer />
              <v-chip
                size="x-small"
                color="#4F7DFF"
                variant="flat"
                class="font-weight-bold mr-2"
              >
                TOTAL UNIT : {{ totalUnit }}
              </v-chip>

              <v-chip
                size="x-small"
                color="primary"
                variant="flat"
                class="font-weight-bold"
              >
                TOTAL ITEM : {{ masterCabangStore.getDataItemKategori.length }}
              </v-chip>
            </div>

            <v-data-table
              :headers="data.headKategoriItem"
              :items="masterCabangStore.getDataItemKategori"
              density="compact"
              :sort-by="[{ key: 'createdAt', order: 'desc' }]"
              :hover="true"
              :items-per-page="data.itemsPerPageKategori"
              v-model:page="data.pageKategori"
              class="compact-table"
            >
              <template v-slot:item.no="{ index }">
                <span
                  class="text-caption font-weight-medium text-grey-darken-1"
                >
                  {{ index + 1 }}
                </span>
              </template>

              <template v-slot:item.nama_kategori_item="{ item }">
                <div style="width: 200px">
                  {{ item.nama_kategori_item }}
                </div>
              </template>

              <template v-slot:item.jumlah_unit="{ item }">
                <v-chip
                  v-if="item.jumlahUnit"
                  size="x-small"
                  color="blue-darken-1"
                  variant="flat"
                  class="font-weight-bold text-body-2"
                >
                  {{ item.jumlahUnit }} Unit
                </v-chip>
                <span v-else class="text-body-2 text-disabled">0</span>
              </template>

              <template v-slot:item.periode="{ item }">
                <div
                  v-if="item.periode && item.periode.mulai !== '-'"
                  class="d-flex flex-column py-1"
                >
                  <div class="d-flex align-center mb-n1">
                    <v-icon size="12" color="success" class="me-1"
                      >mdi-play-circle</v-icon
                    >
                    <span class="text-xxs text-grey-darken-3">{{
                      formatTanggal(item.periode.mulai)
                    }}</span>
                  </div>
                  <div class="d-flex align-center mt-1">
                    <v-icon size="12" color="error" class="me-1"
                      >mdi-stop-circle</v-icon
                    >
                    <span class="text-xxs text-error font-weight-bold">{{
                      formatTanggal(item.periode.selesai)
                    }}</span>
                  </div>
                </div>
                <span v-else class="text-caption text-disabled">—</span>
              </template>

              <template v-slot:item.periode_penawaran="{ item }">
                <div class="d-flex align-center gap-2 py-1">
                  <a-date-picker
                    label="Periode Awal"
                    v-model="item.periode_penawaran.mulai"
                  />
                  <a-date-picker
                    class="ml-2"
                    label="Periode Akhir"
                    v-model="item.periode_penawaran.selesai"
                  />
                </div>
              </template>

              <template v-slot:item.nominal="{ item }">
                <div style="width: 140px" class="py-1">
                  <a-text-field
                    v-model.number="item.nominal"
                    :disabled="addedItemIds.includes(item.id)"
                    placeholder="Rp."
                  />
                </div>
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip
                  v-if="item.status"
                  size="x-small"
                  variant="tonal"
                  class="font-weight-bold"
                  :color="
                    item.status === 'Draft'
                      ? 'green'
                      : item.status === 'Penawaran'
                        ? 'blue'
                        : 'orange'
                  "
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:item.select="{ item }">
                <v-btn
                  size="25"
                  color="blue"
                  @click="tambahItem(item)"
                  :disabled="!canAddItem(item)"
                  ><v-icon size="15">mdi-plus</v-icon></v-btn
                >
                <!-- !item.nominal ||
                  Number(item.nominal) <= 0 -->
              </template>

              <template v-slot:bottom>
                <v-divider />

                <div class="bg-grey-lighten-5 px-4 py-2">
                  <v-row no-gutters align="center">
                    <v-col
                      cols="12"
                      md="8"
                      class="d-flex align-center flex-wrap"
                      style="gap: 8px"
                    >
                      <div
                        class="d-flex align-center bg-white border rounded-lg px-3 py-1 shadow-sm mr-2"
                      >
                        <v-icon
                          size="16"
                          color="primary"
                          icon="mdi-database-outline"
                          class="mr-2"
                        />
                        <span class="text-caption font-weight-medium">
                          <span class="text-grey">Menampilkan</span>
                          <strong class="text-primary ml-1">
                            {{
                              (data.page - 1) * data.itemsPerPageKategori + 1
                            }}-{{
                              Math.min(
                                data.page * data.itemsPerPageKategori,
                                masterCabangStore.getDataItemKategori.length,
                              )
                            }}
                          </strong>
                          <span class="text-grey mx-1">/</span>
                          <strong>{{
                            masterCabangStore.getDataItemKategori.length
                          }}</strong>
                          <span class="text-grey mx-1">Data</span>
                        </span>
                      </div>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                      class="d-flex justify-md-end justify-center mt-2 mt-md-0"
                    >
                      <div
                        class="d-flex align-center bg-white border rounded-lg px-3 py-0"
                        style="min-width: 140px; height: 32px"
                      >
                        <v-icon
                          size="14"
                          color="grey"
                          icon="mdi-layers-outline"
                          class="mr-2"
                        />
                        <span
                          class="text-caption text-grey-darken-1 mr-2"
                          style="white-space: nowrap"
                          >Tampilkan:</span
                        >

                        <v-select
                          v-model="data.itemsPerPageKategori"
                          :items="[
                            { title: '10', value: 10 },
                            { title: '25', value: 25 },
                            { title: '50', value: 50 },
                            { title: 'Semua', value: -1 },
                          ]"
                          variant="plain"
                          density="compact"
                          hide-details
                          class="mt-n2"
                          @update:model-value="data.page = 1"
                        >
                          <template v-slot:selection="{ item }">
                            <span
                              class="text-caption font-weight-black text-primary"
                              >{{ item.title }}</span
                            >
                          </template>
                        </v-select>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </template>

              <template v-slot:no-data>
                <div class="py-8 text-center text-grey-darken-1">
                  <v-icon
                    size="48"
                    color="grey-lighten-1"
                    class="mb-2"
                    :icon="getNoDataIcon()"
                  />
                  <div class="text-body-1">{{ getNoDataMessage() }}</div>
                  <div class="text-caption text-grey mt-1">
                    {{ getNoDataSubMessage() }}
                  </div>
                </div>
              </template>
            </v-data-table>
          </v-card>
          <v-card class="mt-2">
            <v-card-title class="text-h6"> Item Penawaran </v-card-title>
            <v-card-text>
              <v-data-table-virtual
                :headers="data.headers_items"
                :items="newPenawaran.items"
                item-value="id"
                class="rounded-lg"
              >
                <template #item.subtotal="{ item }">
                  {{ rupiah(item.subtotal) }}
                </template>
                <template v-slot:item.jumlahUnit="{ item }">
                  <v-chip
                    v-if="item.jumlahUnit"
                    size="x-small"
                    color="blue-darken-1"
                    variant="flat"
                    class="font-weight-bold text-body-2"
                  >
                    {{ item.jumlahUnit }} Unit
                  </v-chip>
                  <span v-else class="text-body-2 text-disabled">0</span>
                </template>
                <template v-slot:item.periode_penawaran="{ item }">
                  <div class="d-flex align-center gap-2 py-1">
                    <a-date-picker
                      label="Periode Awal"
                      v-model="item.periode_penawaran.mulai"
                    />
                    <a-date-picker
                      class="ml-2"
                      label="Periode Akhir"
                      v-model="item.periode_penawaran.selesai"
                    />
                  </div>
                </template>

                <template v-slot:item.nominal="{ item }">
                  <a-text-field
                    v-model="item.nominal"
                    label="Nominal"
                  ></a-text-field>
                </template>

                <template #item.actions="{ index }">
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        size="22"
                        class="bg-red-darken-2"
                        @click="hapusitemspenawaran(index)"
                      >
                        <v-icon size="15" color="white">
                          mdi-trash-can-outline
                        </v-icon>
                      </v-btn>
                    </template>

                    <span>Hapus item dari Penawran</span>
                  </v-tooltip>
                </template>
              </v-data-table-virtual>
            </v-card-text>
          </v-card>
          <br />
          <div class="d-flex align-center mb-2 px-1">
            <v-icon
              size="18"
              color="primary"
              class="mr-2"
              icon="mdi-numeric-3-circle"
            />

            <div class="d-flex flex-column">
              <span class="text-caption font-weight-black text-grey-darken-2">
                DAFTAR ITEM TAMBAHAN
              </span>
              <span class="text-caption text-grey-darken-1">
                Cth. Jasa / Biaya Koordinasi / dll
              </span>
            </div>
          </div>

          <v-row>
            <v-col>
              <a-text-field
                label="Keterangan"
                v-model="newlisitemtambahan.keterangan_penawaran"
              />
            </v-col>

            <v-col cols="4">
              <a-field-number
                label="Nominal"
                v-model="newlisitemtambahan.nominal_tambahan"
              />
            </v-col>

            <v-col cols="1">
              <v-btn
                color="blue"
                size="25"
                @click="additemtambahan"
                class="mt-8"
              >
                <v-icon size="25" color="white" icon="mdi-plus" />
              </v-btn>
            </v-col>
          </v-row>

          <v-card
            variant="flat"
            border
            class="rounded-lg overflow-hidden bg-white mt-3"
          >
            <div
              class="bg-grey-lighten-4 px-4 py-2 border-b d-flex align-center"
            >
              <span class="text-caption font-weight-bold text-grey-darken-3"
                >ITEM TAMBAHAN</span
              >
            </div>

            <v-data-table
              :headers="data.headItemTambahan"
              :items="newPenawaran.item_tambahan"
              hide-default-footer
              density="compact"
              :hover="true"
              :items-per-page="data.itemsPerPageKategori"
              v-model:page="data.pageKategori"
              class="compact-table"
            >
              <template v-slot:item.no="{ index }">
                <span
                  class="text-caption font-weight-medium text-grey-darken-1"
                >
                  {{ index + 1 }}
                </span>
              </template>
              <template v-slot:item.nominal_tambahan="{ item }">
                <span
                  class="text-caption font-weight-medium text-grey-darken-1"
                >
                  Rp {{ rupiah(item.nominal_tambahan) }}
                </span>
              </template>
              <template v-slot:item.aksi="{ index }">
                <v-btn
                  color="blue"
                  size="20"
                  @click="deleteitemtambahan(index)"
                >
                  <v-icon size="15" color="white">mdi-trash-can</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>

          <div class="mt-3 bg-grey-lighten-5">
            <v-card
              color="primary-lighten-5"
              variant="flat"
              class="pa-3 rounded-lg border-primary border-dashed border-sm"
            >
              <!-- <div class="d-flex justify-space-between text-caption">
                <span>Total Item Kategori</span>
                <span>Rp {{ rupiah(totalPenawaran - totalItemTambahan) }}</span>
              </div>

              <div class="d-flex justify-space-between text-caption">
                <span>Total Item Tambahan</span>
                <span>Rp {{ rupiah(totalItemTambahan) }}</span>
              </div> -->

              <!-- <v-divider class="my-2" /> -->

              <div class="d-flex justify-space-between font-weight-black">
                <span>Estimasi Total Penawaran</span>
                <span>Rp {{ rupiah(totalPenawaran) }}</span>
              </div>
            </v-card>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3">
          <!-- <a-checkbox
            v-model="newPenawaran.status_terkirim_email"
            label="Penawaran sudah dikirim email"
            hide-details
            density="compact"
            class="ma-0"
            color="blue"
          /> -->
          <!-- <v-divider vertical class="ml-2" style="opacity: 100%" />
          <a-checkbox
            v-model="newPenawaran.handle_by_aresa"
            label="Handle By Aresa"
            hide-details
            density="compact"
            class="ma-0"
            color="blue"
          />
          <v-divider vertical class="ml-2" style="opacity: 100%" /> -->
          <v-btn
            variant="flat"
            color="grey-lighten-1"
            @click="data.dialogPenawaran = false"
            class="text-capitalize px-3"
          >
            Batal
          </v-btn>

          <v-btn
            color="primary"
            variant="flat"
            class="text-capitalize px-3"
            @click="saverevisi"
          >
            Simpan Revisi
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- // DIALOG BUAT INVOICE \\ -->
    <v-dialog v-model="data.dialogAdd" max-width="1050" scrollable>
      <v-card class="rounded-lg">
        <v-card-title class="bg-success text-center">
          <span class="font-weight-bold text-white"> Buat Invoice </span>
        </v-card-title>

        <v-divider />

        <v-card-text class="bg-grey-lighten-5">
          <v-row dense>
            <v-col cols="12" class="mb-1 d-flex align-center">
              <v-icon
                size="16"
                color="primary"
                class="mr-2"
                icon="mdi-account-box"
              />

              <span
                class="text-caption font-weight-bold text-grey-darken-2 text-uppercase"
                style="letter-spacing: 1px"
              >
                Data Customer
              </span>
            </v-col>

            <v-col cols="12" md="6">
              <a-text-field
                v-model="new_invoice.nama_group_pt"
                label="Nama Group"
                disabled
              />
            </v-col>

            <v-col cols="12" md="6">
              <a-text-field
                v-model="new_invoice.nama_perusahaan"
                label="Nama Perusahaan"
                disabled
              />
            </v-col>

            <v-col cols="12" md="6">
              <a-text-field
                v-model="new_invoice.nama_cabang_perusahaan"
                label="Nama Cabang"
                disabled
              />
            </v-col>

            <v-col cols="12" md="6">
              <a-text-field
                v-model="new_invoice.telepon_perusahaan"
                label="Telepon Perusahaan"
                disabled
              />
            </v-col>

            <v-divider class="mt-3 mb-1"></v-divider>

            <v-col cols="12">
              <a-textarea
                v-model="new_invoice.perihal_invoice"
                placeholder="Cth. Pembayaran Pengurusan..."
                label="Perihal Invoice"
              />

              <a-text-field
                class="mt-2"
                v-model="new_invoice.pic"
                label="UP / Attention"
                placeholder="Bpk."
              />
            </v-col>

            <v-col cols="12" class="mt-4 mb-1 d-flex align-center">
              <v-icon
                size="16"
                color="primary"
                class="mr-2"
                icon="mdi-calendar-clock"
              />

              <span
                class="text-caption font-weight-bold text-grey-darken-2 text-uppercase"
                style="letter-spacing: 1px"
              >
                Item Invoice
              </span>
            </v-col>

            <v-col cols="12" md="6">
              <a-date-picker
                v-model="new_invoice.tanggal"
                :onUpdate:modelValue="(n: string) => (new_invoice.tanggal = n)"
                label="Tanggal Invoice"
              />
            </v-col>

            <v-col cols="12" md="6">
              <a-date-picker
                v-model="new_invoice.jatuhTempo"
                :onUpdate:modelValue="
                  (n: string) => (new_invoice.jatuhTempo = n)
                "
                label="Jatuh Tempo"
              />
            </v-col>

            <div
              style="border: grey solid 1px; border-radius: 10px"
              class="mt-3"
            >
              <v-col cols="12">
                <v-sheet border rounded class="overflow-hidden">
                  <v-table density="compact" class="compact-invoice-table">
                    <thead class="bg-grey-lighten-4">
                      <tr>
                        <th
                          class="text-center font-weight-bold text-caption"
                          width="110"
                        >
                          No
                        </th>
                        <th
                          class="text-left font-weight-bold text-caption"
                          width="320"
                        >
                          PEKERJAAN
                        </th>
                        <th
                          class="text-center font-weight-bold text-caption"
                          width="120"
                        >
                          Qty
                        </th>
                        <th
                          class="text-center font-weight-bold text-caption"
                          width="170"
                        >
                          Harga /Unit
                        </th>
                        <th
                          class="text-right font-weight-bold text-caption"
                          width="130"
                        >
                          SUB TOTAL
                        </th>

                        <th class="font-weight-bold text-caption" width="120">
                          Tindakan
                        </th>
                      </tr>
                    </thead>
                    <tbody class="text-caption">
                      <tr
                        v-for="(item, index) in detailpenawaran.items"
                        :key="index"
                      >
                        <td class="text-center text-grey-darken-1">
                          {{ index + 1 }}
                        </td>
                        <td class="font-weight-medium">
                          {{ item.nama_kategori_item }}
                        </td>
                        <td class="text-center">{{ item.jumlahUnit }}</td>
                        <td class="text-right">
                          <div class="mt-1">
                            <div
                              v-if="!item.isEdit"
                              class="d-flex align-center justify-end"
                            >
                              <span>Rp {{ rupiah(item.nominal) }}</span>

                              <v-btn
                                icon="mdi-pencil"
                                size="x-small"
                                variant="text"
                                color="primary"
                                class="ml-1"
                                @click="startEdit(item)"
                              />
                            </div>

                            <!-- EDIT MODE -->
                            <v-expand-transition>
                              <div
                                v-if="item.isEdit"
                                class="d-flex flex-column align-end"
                              >
                                <a-text-field
                                  v-model.number="item.nominal_edit"
                                  density="compact"
                                  hide-details
                                  style="max-width: 120px"
                                  @keyup.enter="saveEdit(item)"
                                />

                                <div class="d-flex ga-1 mt-1">
                                  <v-chip
                                    size="x-small"
                                    :color="
                                      item.nominal_edit ===
                                      Math.round(item.nominal * 0.5)
                                        ? 'primary'
                                        : undefined
                                    "
                                    :variant="
                                      item.nominal_edit ===
                                      Math.round(item.nominal * 0.5)
                                        ? 'flat'
                                        : 'outlined'
                                    "
                                    @click="
                                      item.nominal_edit = Math.round(
                                        item.nominal * 0.5,
                                      )
                                    "
                                  >
                                    50%
                                  </v-chip>

                                  <br />

                                  <v-tooltip
                                    text="Kembali ke nominal awal"
                                    location="top"
                                  >
                                    <template #activator="{ props }">
                                      <v-chip
                                        size="x-small"
                                        variant="outlined"
                                        @click="cancelEdit(item)"
                                        color="red"
                                      >
                                        <v-icon>mdi-cancel</v-icon>
                                      </v-chip>
                                    </template>
                                    <span style="font-size: 11px">
                                      Kembali ke harga awal
                                    </span>
                                  </v-tooltip>
                                </div>
                              </div>
                            </v-expand-transition>
                          </div>
                        </td>
                        <td class="text-right font-weight-bold">
                          Rp {{ rupiah(getHarga(item) * item.jumlahUnit) }}
                        </td>

                        <td class="pa-1" v-if="isKAM">
                          <div class="d-flex flex-column ga-0">
                            <v-checkbox
                              v-model="selectedPpnPphItems"
                              :value="`${item.id}-${index}`"
                              @change="handleSelectItem(item, index)"
                              density="compact"
                              hide-details
                              color="primary"
                              class="ma-0 pa-0"
                              style="
                                min-height: 22px;
                                margin-top: -6px !important;
                              "
                            >
                              <template #label>
                                <span
                                  class="text-caption"
                                  style="line-height: 1; font-size: 11px"
                                  >PPN & PPh</span
                                >
                              </template>
                            </v-checkbox>
                          </div>
                        </td>

                        <td class="pa-1" v-if="isABK">
                          <div class="d-flex flex-column ga-0">
                            <v-checkbox
                              :model-value="isAllSelected"
                              :indeterminate="isIndeterminate"
                              @click="toggleAllItems"
                              density="compact"
                              hide-details
                              color="primary"
                              class="ma-0 pa-0"
                              style="min-height: 22px"
                            >
                              <template #label>
                                <span
                                  class="text-caption"
                                  style="line-height: 1; font-size: 11px"
                                  >Pilih</span
                                >
                              </template>
                            </v-checkbox>

                            <v-checkbox
                              :disabled="
                                !selectedItems.includes(`${item.id}-${index}`)
                              "
                              v-model="selectedPpnItems"
                              :value="`${item.id}-${index}`"
                              density="compact"
                              hide-details
                              color="primary"
                              class="ma-0 pa-0"
                              style="
                                min-height: 22px;
                                margin-top: -6px !important;
                              "
                            >
                              <template #label>
                                <span
                                  class="text-caption"
                                  style="line-height: 1; font-size: 11px"
                                  >PPN & PPh</span
                                >
                              </template>
                            </v-checkbox>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-sheet>
              </v-col>

              <!-- // DIPAKE LAGI \\ -->
              <v-col cols="12" class="mb-2">
                <div class="d-flex align-center mb-1">
                  <v-icon size="18" color="primary" class="mr-2">
                    mdi-cash-plus
                  </v-icon>
                  <span
                    class="text-caption font-weight-medium text-grey-darken-2 text-uppercase"
                    style="letter-spacing: 1px"
                  >
                    Biaya Tambahan Lainnya
                  </span>
                </div>

                <div class="d-flex align-center ga-2">
                  <div style="flex: 1">
                    <a-text-field
                      v-model.number="newlisitemtambahan.keterangan_penawaran"
                      label="Keterangan"
                      placeholder="isi"
                      density="compact"
                    />
                  </div>

                  <div style="flex: 1">
                    <a-field-number
                      v-model.number="newlisitemtambahan.nominal_tambahan"
                      label="Nominal"
                      placeholder="0"
                      density="compact"
                    />
                  </div>

                  <v-btn
                    color="primary"
                    size="32"
                    class="mt-5"
                    @click="additemtambahanlainya"
                  >
                    <v-icon size="13">mdi-plus</v-icon>
                  </v-btn>
                </div>
              </v-col>

              <!-- // DIPAKE LAGI \\ -->

              <v-col cols="12">
                <v-sheet border rounded class="overflow-hidden">
                  <v-table density="compact" class="compact-invoice-table">
                    <thead class="bg-grey-lighten-4">
                      <tr>
                        <th
                          class="text-center font-weight-bold text-caption"
                          width="20"
                        >
                          No
                        </th>
                        <th class="font-weight-bold text-caption" width="260">
                          Tambahan
                        </th>
                        <th class="font-weight-bold text-caption" width="160">
                          Nominal
                        </th>
                        <th class="font-weight-bold text-caption" width="10">
                          Tindakan
                        </th>
                      </tr>
                    </thead>
                    <tbody class="text-caption">
                      <tr
                        v-for="(item, index) in detailpenawaran.item_tambahan"
                        :key="index"
                      >
                        <td class="text-center text-grey-darken-1">
                          {{ index + 1 }}.
                        </td>
                        <td class="font-weight-medium">
                          {{ item.keterangan_penawaran }}
                        </td>
                        <td>{{ rupiah(item.nominal_tambahan) }}</td>

                        <td>
                          <div class="d-flex align-center ga-3">
                            <a-checkbox
                              v-model="selectedItemTambahan"
                              :value="`${item.id}-${index}`"
                              @change="
                                handleItemTambahanChange(`${item.id}-${index}`)
                              "
                              density="compact"
                              label="Pilih"
                            />

                            <a-checkbox
                              v-if="
                                selectedItemTambahan.includes(
                                  `${item.id}-${index}`,
                                )
                              "
                              v-model="selectedTaxItemTambahan"
                              :value="`${item.id}-${index}`"
                              density="compact"
                              label="PPN & PPh"
                            />

                            <!-- Tombol Hapus -->
                            <v-tooltip text="Hapus item" location="top">
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  color="red"
                                  size="20"
                                  variant="text"
                                  class="ml-auto"
                                  @click="deleteitemtambahanlainya(index)"
                                >
                                  <v-icon size="16"
                                    >mdi-trash-can-outline</v-icon
                                  >
                                </v-btn>
                              </template>
                            </v-tooltip>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-sheet>
              </v-col>
            </div>

            <v-col cols="12" class="mt-4">
              <v-card
                variant="outlined"
                class="bg-white border-dashed rounded-lg"
              >
                <div class="pa-4">
                  <div class="d-flex justify-space-between text-caption mb-2">
                    <span class="text-grey-darken-1 font-weight-medium"
                      >Sub Total</span
                    >
                    <span class="font-weight-bold text-grey-darken-4"
                      >Rp {{ rupiah(subtotal) }}</span
                    >
                  </div>
                  <div class="d-flex justify-space-between text-caption mb-2">
                    <span class="text-grey-darken-1 font-weight-medium"
                      >PPN 11%</span
                    >
                    <span class="font-weight-bold text-green-darken-2"
                      >+ Rp {{ rupiah(ppn) }}
                    </span>
                  </div>
                  <div class="d-flex justify-space-between text-caption mb-2">
                    <span class="text-grey-darken-1 font-weight-medium"
                      >PPH 2%</span
                    >
                    <span class="font-weight-bold text-orange-darken-2"
                      >- Rp {{ rupiah(pph) }}</span
                    >
                  </div>
                  <v-divider />
                  <div class="d-flex justify-space-between align-center py-1">
                    <span class="text-subtitle-2 font-weight-black"
                      >GRAND TOTAL</span
                    >
                    <span class="text-h6 font-weight-black text-primary"
                      >Rp {{ rupiah(grandtotal) }}</span
                    >
                  </div>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" class="mt-2">
              <a-textarea v-model="new_invoice.remark" label="Keterangan Inv" />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3 bg-grey-lighten-4">
          <v-btn
            variant="flat"
            color="grey-darken-2"
            @click="data.dialogAdd = false"
            class="text-capitalize px-3"
          >
            Batal
          </v-btn>

          <v-btn
            color="primary"
            @click="buatinvoice"
            variant="flat"
            class="text-capitalize px-3"
          >
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- // PINDAH PENAWARAN \\ -->
    <v-dialog v-model="data.dialogRevisi" width="1250px" persistent scrollable>
      <v-card class="rounded-lg">
        <v-card-title class="px-6 py-3 bg-primary d-flex align-center">
          <span class="text-subtitle-1 font-weight-bold text-white">
            REVISI : {{ newRevisi.id }}
          </span>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4 bg-grey-lighten-5" style="max-height: 80vh">
          <div class="d-flex align-center mb-2 px-1">
            <v-icon
              size="18"
              color="primary"
              class="mr-2"
              icon="mdi-numeric-1-circle"
            />

            <span class="text-caption font-weight-black text-grey-darken-2">
              INFORMASI DOKUMEN
            </span>
          </div>

          <v-card variant="flat" border class="rounded-lg pa-4 mb-5 bg-white">
            <v-row>
              <v-col cols="12" sm="6">
                <a-select
                  label="Perusahaan"
                  item-title="nama_perusahaan"
                  item-value="id"
                  :items="perusahaanStore.getDataPerusahaan"
                  v-model="newRevisi.id_perusahaan"
                  class="mb-3"
                />

                <a-select
                  label="Cabang Perusahaan"
                  item-title="nama_cabang"
                  item-value="id"
                  :items="masterCabangStore.getDataCabang"
                  v-model="newRevisi.id_cabang_perusahaan"
                  class="mb-3"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <a-date-picker
                  v-model="newRevisi.tanggal"
                  label="Tanggal Penawaran"
                  class="mb-3"
                />

                <a-text-field
                  label="No Telp Perusahaan"
                  v-model="newRevisi.telepon_perusahaan"
                  class="mb-3"
                />
              </v-col>
            </v-row>

            <v-divider opacity="0"></v-divider>

            <a-select
              label="Nama Object"
              item-title="nama"
              item-value="id"
              :items="masterobjectstore.getDataObjectKategori"
              v-model="newRevisi.id_object_kategori"
              class="mb-3"
            />

            <a-textarea
              label="Perihal"
              v-model="newRevisi.perihal"
              class="mb-3"
            />
          </v-card>

          <div class="d-flex align-center mb-2 px-1">
            <v-icon
              size="18"
              color="primary"
              class="mr-2"
              icon="mdi-numeric-2-circle"
            />

            <span class="text-caption font-weight-black text-grey-darken-2">
              DAFTAR ITEM KATEGORI
            </span>
          </div>

          <v-card
            variant="flat"
            border
            class="rounded-lg overflow-hidden bg-white"
          >
            <div
              class="bg-grey-lighten-4 px-4 py-2 border-b d-flex align-center"
            >
              <span class="text-caption font-weight-bold text-grey-darken-3"
                >ITEM LIST</span
              >
              <v-spacer />
              <v-chip
                size="x-small"
                color="#4F7DFF"
                variant="flat"
                class="font-weight-bold mr-2"
              >
                TOTAL UNIT : {{ totalUnit }}
              </v-chip>

              <v-chip
                size="x-small"
                color="primary"
                variant="flat"
                class="font-weight-bold"
              >
                TOTAL ITEM : {{ masterCabangStore.getDataItemKategori.length }}
              </v-chip>
            </div>

            <v-data-table
              :headers="data.headKategoriItem"
              :items="masterCabangStore.getDataItemKategori"
              density="compact"
              :sort-by="[{ key: 'createdAt', order: 'desc' }]"
              :hover="true"
              :items-per-page="data.itemsPerPageKategori"
              v-model:page="data.pageKategori"
              class="compact-table"
            >
              <template v-slot:item.no="{ index }">
                <span
                  class="text-caption font-weight-medium text-grey-darken-1"
                >
                  {{ index + 1 }}
                </span>
              </template>

              <template v-slot:item.nama_kategori_item="{ item }">
                <div style="width: 200px">
                  {{ item.nama_kategori_item }}
                </div>
              </template>

              <template v-slot:item.jumlah_unit="{ item }">
                <v-chip
                  v-if="item.jumlahUnit"
                  size="x-small"
                  color="blue-darken-1"
                  variant="flat"
                  class="font-weight-bold text-body-2"
                >
                  {{ item.jumlahUnit }} Unit
                </v-chip>
                <span v-else class="text-body-2 text-disabled">0</span>
              </template>

              <template v-slot:item.periode="{ item }">
                <div
                  v-if="item.periode && item.periode.mulai !== '-'"
                  class="d-flex flex-column py-1"
                >
                  <div class="d-flex align-center mb-n1">
                    <v-icon size="12" color="success" class="me-1"
                      >mdi-play-circle</v-icon
                    >
                    <span class="text-xxs text-grey-darken-3">{{
                      formatTanggal(item.periode.mulai)
                    }}</span>
                  </div>
                  <div class="d-flex align-center mt-1">
                    <v-icon size="12" color="error" class="me-1"
                      >mdi-stop-circle</v-icon
                    >
                    <span class="text-xxs text-error font-weight-bold">{{
                      formatTanggal(item.periode.selesai)
                    }}</span>
                  </div>
                </div>
                <span v-else class="text-caption text-disabled">—</span>
              </template>

              <template v-slot:item.periode_penawaran="{ item }">
                <div class="d-flex align-center gap-2 py-1">
                  <a-date-picker
                    label="Periode Awal"
                    v-model="item.periode_penawaran.mulai"
                  />
                  <a-date-picker
                    class="ml-2"
                    label="Periode Akhir"
                    v-model="item.periode_penawaran.selesai"
                  />
                </div>
              </template>

              <template v-slot:item.nominal="{ item }">
                <div style="width: 140px" class="py-1">
                  <a-text-field
                    v-model.number="item.nominal"
                    :disabled="addedItemIds.includes(item.id)"
                    placeholder="Rp."
                  />
                </div>
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip
                  v-if="item.status"
                  size="x-small"
                  variant="tonal"
                  class="font-weight-bold"
                  :color="
                    item.status === 'Draft'
                      ? 'green'
                      : item.status === 'Penawaran'
                        ? 'blue'
                        : 'orange'
                  "
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:item.select="{ item }">
                <v-btn
                  size="25"
                  color="blue"
                  @click="tambahItemRevisi(item)"
                  :disabled="!canAddItemRevisi(item)"
                  ><v-icon size="15">mdi-plus</v-icon></v-btn
                >
                <!-- !item.nominal ||
                  Number(item.nominal) <= 0 -->
              </template>

              <template v-slot:bottom>
                <v-divider />

                <div class="bg-grey-lighten-5 px-4 py-2">
                  <v-row no-gutters align="center">
                    <v-col
                      cols="12"
                      md="8"
                      class="d-flex align-center flex-wrap"
                      style="gap: 8px"
                    >
                      <div
                        class="d-flex align-center bg-white border rounded-lg px-3 py-1 shadow-sm mr-2"
                      >
                        <v-icon
                          size="16"
                          color="primary"
                          icon="mdi-database-outline"
                          class="mr-2"
                        />
                        <span class="text-caption font-weight-medium">
                          <span class="text-grey">Menampilkan</span>
                          <strong class="text-primary ml-1">
                            {{
                              (data.page - 1) * data.itemsPerPageKategori + 1
                            }}-{{
                              Math.min(
                                data.page * data.itemsPerPageKategori,
                                masterCabangStore.getDataItemKategori.length,
                              )
                            }}
                          </strong>
                          <span class="text-grey mx-1">/</span>
                          <strong>{{
                            masterCabangStore.getDataItemKategori.length
                          }}</strong>
                          <span class="text-grey mx-1">Data</span>
                        </span>
                      </div>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                      class="d-flex justify-md-end justify-center mt-2 mt-md-0"
                    >
                      <div
                        class="d-flex align-center bg-white border rounded-lg px-3 py-0"
                        style="min-width: 140px; height: 32px"
                      >
                        <v-icon
                          size="14"
                          color="grey"
                          icon="mdi-layers-outline"
                          class="mr-2"
                        />
                        <span
                          class="text-caption text-grey-darken-1 mr-2"
                          style="white-space: nowrap"
                          >Tampilkan:</span
                        >

                        <v-select
                          v-model="data.itemsPerPageKategori"
                          :items="[
                            { title: '10', value: 10 },
                            { title: '25', value: 25 },
                            { title: '50', value: 50 },
                            { title: 'Semua', value: -1 },
                          ]"
                          variant="plain"
                          density="compact"
                          hide-details
                          class="mt-n2"
                          @update:model-value="data.page = 1"
                        >
                          <template v-slot:selection="{ item }">
                            <span
                              class="text-caption font-weight-black text-primary"
                              >{{ item.title }}</span
                            >
                          </template>
                        </v-select>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </template>

              <template v-slot:no-data>
                <div class="py-8 text-center text-grey-darken-1">
                  <v-icon
                    size="48"
                    color="grey-lighten-1"
                    class="mb-2"
                    :icon="getNoDataIcon()"
                  />
                  <div class="text-body-1">{{ getNoDataMessage() }}</div>
                  <div class="text-caption text-grey mt-1">
                    {{ getNoDataSubMessage() }}
                  </div>
                </div>
              </template>
            </v-data-table>
          </v-card>
          <v-card class="mt-2">
            <v-card-text>
              <v-data-table
                :headers="data.headers_items"
                :items="newRevisi.items"
                item-value="id"
                class="rounded-lg"
              >
                <template #item.nominal="{ item }">
                  {{ rupiah(item.nominal) }}
                </template>

                <template #item.subtotal="{ item }">
                  {{ rupiah(item.subtotal) }}
                </template>
                <template v-slot:item.jumlah_unit="{ item }">
                  <v-chip
                    v-if="item.jumlahUnit"
                    size="x-small"
                    color="blue-darken-1"
                    variant="flat"
                    class="font-weight-bold text-body-2"
                  >
                    {{ item.jumlahUnit }} Unit
                  </v-chip>
                  <span v-else class="text-body-2 text-disabled">0</span>
                </template>
                <template v-slot:item.periode_penawaran="{ item }">
                  <div
                    v-if="
                      item.periode_penawaran &&
                      item.periode_penawaran.mulai !== '-'
                    "
                    class="d-flex flex-column py-1"
                  >
                    <div class="d-flex align-center mb-n1">
                      <v-icon size="12" color="success" class="me-1"
                        >mdi-play-circle</v-icon
                      >
                      <span class="text-xxs text-grey-darken-3">
                        {{ formatTanggal(item.periode.mulai) }}</span
                      >
                    </div>
                    <div class="d-flex align-center mt-1">
                      <v-icon size="12" color="error" class="me-1"
                        >mdi-stop-circle</v-icon
                      >
                      <span class="text-xxs text-error font-weight-bold">{{
                        formatTanggal(item.periode.selesai)
                      }}</span>
                    </div>
                  </div>
                  <span v-else class="text-caption text-disabled">—</span>
                </template>

                <template #item.actions="{ index }">
                  <v-btn
                    icon
                    size="x-small"
                    class="bg-red-darken-2"
                    @click="hapusitemsrevisi(index)"
                  >
                    <v-icon size="16" color="white">
                      mdi-trash-can-outline
                    </v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
          <br />
          <div class="d-flex align-center mb-2 px-1">
            <v-icon
              size="18"
              color="primary"
              class="mr-2"
              icon="mdi-numeric-3-circle"
            />

            <div class="d-flex flex-column">
              <span class="text-caption font-weight-black text-grey-darken-2">
                DAFTAR ITEM TAMBAHAN
              </span>
              <span class="text-caption text-grey-darken-1">
                Cth. Jasa / Biaya Koordinasi / dll
              </span>
            </div>
          </div>

          <v-row>
            <v-col>
              <a-text-field
                label="Keterangan"
                v-model="newlisitemtambahan.keterangan_penawaran"
              />
            </v-col>

            <v-col cols="4">
              <a-field-number
                label="Nominal"
                v-model="newlisitemtambahan.nominal_tambahan"
              />
            </v-col>

            <v-col cols="1">
              <v-btn
                color="blue"
                size="25"
                @click="additemtambahan"
                class="mt-8"
              >
                <v-icon size="25" color="white" icon="mdi-plus" />
              </v-btn>
            </v-col>
          </v-row>

          <v-card
            variant="flat"
            border
            class="rounded-lg overflow-hidden bg-white mt-3"
          >
            <div
              class="bg-grey-lighten-4 px-4 py-2 border-b d-flex align-center"
            >
              <span class="text-caption font-weight-bold text-grey-darken-3"
                >ITEM TAMBAHAN</span
              >
            </div>

            <v-data-table
              :headers="data.headItemTambahan"
              :items="newRevisi.item_tambahan"
              hide-default-footer
              density="compact"
              :hover="true"
              :items-per-page="data.itemsPerPageKategori"
              v-model:page="data.pageKategori"
              class="compact-table"
            >
              <template v-slot:item.no="{ index }">
                <span
                  class="text-caption font-weight-medium text-grey-darken-1"
                >
                  {{ index + 1 }}
                </span>
              </template>
              <template v-slot:item.nominal_tambahan="{ item }">
                <span
                  class="text-caption font-weight-medium text-grey-darken-1"
                >
                  Rp {{ rupiah(item.nominal_tambahan) }}
                </span>
              </template>
              <template v-slot:item.aksi="{ index }">
                <v-btn
                  color="blue"
                  size="20"
                  @click="deleteitemtambahan(index)"
                >
                  <v-icon size="15" color="white">mdi-trash-can</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>

          <div class="mt-3 bg-grey-lighten-5">
            <v-card
              color="primary-lighten-5"
              variant="flat"
              class="pa-3 rounded-lg border-primary border-dashed border-sm"
            >
              <div class="d-flex justify-space-between font-weight-black">
                <span>Estimasi Total Penawaran</span>
                <span>Rp {{ rupiah(totalPenawaranRevisi) }}</span>
              </div>
            </v-card>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3">
          <a-checkbox
            v-model="newRevisi.handle_by_aresa"
            label="Handle By Aresa"
            hide-details
            density="compact"
            class="ma-0"
            color="blue"
          />

          <v-btn
            variant="flat"
            color="grey-lighten-1"
            @click="data.dialogRevisi = false"
            class="text-capitalize px-3"
          >
            Batal
          </v-btn>

          <v-btn
            color="primary"
            variant="flat"
            class="text-capitalize px-3"
            @click="saverevisitopenawaran"
          >
            Revisi
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            src="/public/Logo-SNS.png"
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
        <v-btn
          v-if="detailpenawaran.status == 'Draft'"
          color="orange"
          variant="tonal"
          prepend-icon="mdi-file-document-edit-outline"
          class="text-capitalize"
          @click="openDialogRevisiPenawaran"
        >
          Revisi Penawaran
        </v-btn>

        <v-btn
          color="indigo"
          prepend-icon="mdi-send"
          @click="opendialogkirimpenawaran"
          class="text-capitalize"
          v-if="detailpenawaran.status == 'Draft'"
        >
          Kirim
        </v-btn>

        <v-btn
          v-if="detailpenawaran.status == 'Dikirim'"
          color="indigo"
          @click="opendialogspk"
          class="text-capitalize"
        >
          SPK
        </v-btn>

        <v-btn
          v-if="detailpenawaran.status == 'SPK'"
          color="orange"
          @click="prosespenawaran"
          class="text-capitalize"
        >
          Proses
        </v-btn>

        <v-btn
          v-if="detailpenawaran.status == 'Proses'"
          color="orange"
          @click="opendialogpemberkasan"
          class="text-capitalize"
          prepend-icon="mdi-folder-open-outline"
        >
          Pemberkasan
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

    <!-- // LIST BERKAS & STATUS \\ -->
    <v-row no-gutters class="py-4 mb-5 border-t border-b">
      <v-col cols="12" md="9" class="pr-md-10">
        <div>
          <div class="mb-2 d-flex justify-space-between align-center">
            <div>
              <div
                class="text-body-2 font-weight-bold text-primary mb-1"
                style="letter-spacing: 0.8px"
              >
                <v-icon size="16" class="mr-2" color="primary">
                  mdi-circle-multiple-outline
                </v-icon>
                Berkas
              </div>
            </div>

            <v-btn
              variant="outlined"
              color="grey-darken-1"
              size="x-small"
              class="text-none px-3"
              prepend-icon="mdi-plus"
              @click="opendialogaddberkas"
            >
              Tambah Berkas
            </v-btn>
          </div>

          <v-expansion-panels
            variant="accordion"
            elevation="0"
            v-if="groupedBerkas && groupedBerkas.length > 0"
          >
            <v-expansion-panel
              v-for="(kategori, i) in groupedBerkas"
              :key="i"
              class="bg-transparent border-t"
              style="border-radius: 0 !important"
            >
              <v-expansion-panel-title>
                <div class="d-flex align-center">
                  <span class="text-body-2 font-weight-bold">
                    {{ kategori.nama_kategori_item }}
                  </span>
                  <span class="text-caption text-grey ml-2">
                    / {{ kategori.items.length }}
                  </span>
                </div>

                <template v-slot:actions="{ expanded }">
                  <v-icon size="16">
                    {{ expanded ? "mdi-chevron-up" : "mdi-chevron-down" }}
                  </v-icon>
                </template>
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <div
                  v-for="(dok, idx) in kategori.items"
                  :key="idx"
                  class="d-flex align-center py-2 px-3 mb-1 border-s-sm bg-grey-lighten-5"
                >
                  <div class="flex-grow-1">
                    <div class="text-body-2 font-weight-bold">
                      {{ dok.nama_dokumen }}
                    </div>

                    <div style="font-size: 12px">
                      <span>No Dokumen : {{ dok.no_dokumen }}</span> <br />
                      <v-chip
                        class="my-1"
                        :color="
                          dok.status_dokumen === 'Asli' ? 'primary' : 'grey'
                        "
                        size="x-small"
                        >{{ dok.status_dokumen }}</v-chip
                      >

                      <v-divider class="my-1" style="width: 95%" />

                      <span class="text-grey"
                        >Periode : {{ dok.periode_mulai }} s/d
                        {{ dok.periode_selesai }}</span
                      >
                    </div>
                  </div>

                  <v-btn
                    variant="text"
                    size="x-small"
                    color="primary"
                    :href="dok.file_dokumen"
                    target="_blank"
                    prepend-icon="mdi-file-document-outline"
                  >
                    VIEW
                  </v-btn>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <div
            v-else
            class="d-flex flex-column align-center justify-center text-center py-2 px-4 border rounded-lg"
            style="
              border-style: dashed;
              border-color: #e0e0e0;
              background: #fafafa;
            "
          >
            <v-icon size="30" color="grey-lighten-1" class="mb-2">
              mdi-folder-open-outline
            </v-icon>

            <div class="text-caption text-grey mb-1" style="max-width: 240px">
              Belum ada Berkas yang ditambahkan pada Penawaran ini
            </div>
          </div>
        </div>

        <div
          class="mt-6"
          v-if="
            detailpenawaran.item_kode_bayar &&
            detailpenawaran.item_kode_bayar.length > 0
          "
        >
          <div class="mb-4">
            <div
              class="text-body-2 font-weight-bold text-primary mb-1 d-flex align-center"
              style="letter-spacing: 1px"
            >
              <v-icon size="16" class="mr-2" color="primary">
                mdi-circle-multiple-outline
              </v-icon>
              Kode Bayar
            </div>
            <v-divider width="80" thickness="2" color="primary"></v-divider>
          </div>

          <v-row dense>
            <v-col
              cols="12"
              md="6"
              v-for="item in detailpenawaran.item_kode_bayar"
            >
              <v-card class="kode-card" elevation="0">
                <v-card-text
                  class="d-flex align-center justify-space-between py-3 px-4"
                >
                  <div>
                    <div class="text-caption text-grey">Kode Bayar</div>
                    <div class="text-subtitle-2 font-weight-bold">
                      {{ item.kode_bayar }}
                    </div>
                  </div>

                  <v-btn
                    size="x-small"
                    variant="text"
                    color="primary"
                    :href="item.file_kode_bayar"
                    target="_blank"
                    prepend-icon="mdi-file-document-outline"
                  >
                    View
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>

      <v-col cols="12" md="3" class="mt-6 mt-md-0">
        <div
          class="pa-4 rounded-e-xl"
          style="
            border-left: 3px solid rgba(0, 0, 0, 0.1);

            border-top: 1px solid rgba(0, 0, 0, 0.06);

            border-right: 1px solid rgba(0, 0, 0, 0.06);

            border-bottom: 1px solid rgba(0, 0, 0, 0.06);

            background: linear-gradient(145deg, #ffffff, #fafafa);
          "
        >
          <div
            class="text-caption font-weight-bold text-grey-darken-1 mb-3"
            style="letter-spacing: 1px; font-size: 11px"
          >
            STATUS PENAWARAN
          </div>

          <div class="d-flex align-center justify-space-between mb-2">
            <v-chip
              variant="tonal"
              :color="
                detailpenawaran.status === 'Draft'
                  ? 'grey-darken-1'
                  : detailpenawaran.status === 'Terkirim'
                    ? 'blue-darken-2'
                    : detailpenawaran.status === 'SPK'
                      ? 'deep-purple-darken-1'
                      : detailpenawaran.status === 'Proses'
                        ? 'warning'
                        : detailpenawaran.status === 'Pemberkasan'
                          ? 'success'
                          : 'black'
              "
              size="small"
              class="font-weight-bold px-3 rounded-0"
              style="
                letter-spacing: 0.5px;
                border: 1px solid currentColor !important;
              "
            >
              <v-icon start size="12" class="mr-1">
                {{
                  detailpenawaran.status === "Draft"
                    ? "mdi-file-edit-outline"
                    : detailpenawaran.status === "Terkirim"
                      ? "mdi-send-outline"
                      : detailpenawaran.status === "SPK"
                        ? "mdi-file-certificate-outline"
                        : detailpenawaran.status === "Proses"
                          ? "mdi-progress-check"
                          : "mdi-check-circle-outline"
                }}
              </v-icon>
              {{ detailpenawaran.status }}
            </v-chip>

            <div class="d-flex align-center ga-1 text-grey-darken-1">
              <v-icon size="14" class="opacity-60">mdi-calendar-outline</v-icon>

              <span class="text-caption">
                {{
                  {
                    Draft: detailpenawaran.tanggal,

                    Terkirim: rubahtanggalunix(detailpenawaran.terkirimAt!),

                    Dibatalkan: rubahtanggalunix(detailpenawaran.dibatalkanAt!),

                    SPK: rubahtanggalunix(detailpenawaran.spkAt!),

                    Proses: rubahtanggalunix(detailpenawaran.prosesAt!),

                    Pemberkasan: rubahtanggalunix(
                      detailpenawaran.pemberkasanAt!,
                    ),

                    Invoice: rubahtanggalunix(detailpenawaran.invoiceAt!),
                  }[detailpenawaran.status] || "-"
                }}
              </span>
            </div>
          </div>

          <v-divider class="my-2" />

          <div
            v-if="
              detailpenawaran.status === 'Pemberkasan' ||
              (detailpenawaran.jumlah_invoice &&
                detailpenawaran.jumlah_invoice > 0)
            "
            class="d-flex align-center justify-space-between px-3 py-2 rounded-lg"
            style="background: rgba(0, 0, 0, 0.03)"
          >
            <div class="d-flex flex-column">
              <span class="text-caption text-grey-darken-1">
                Invoice dibuat
              </span>

              <!-- <span class="text-caption text-grey"> Total invoice </span> -->
            </div>

            <div class="text-body-1 font-weight-bold text-primary">
              {{ detailpenawaran.jumlah_invoice }}
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- // ITEM REVISI PENAWARAN \\ -->
    <div
      class="my-3 mb-6"
      v-if="
        penawaranstore.getDataRevisiPenawaran?.length &&
        detailpenawaran.status == 'Draft' &&
        detailpenawaran.jumlah_revisi! > 1
      "
    >
      <span class="text-caption">󠁯•󠁏 Revisi Penawaran</span> <br />
      <v-btn-toggle
        density="compact"
        class="border-0 mt-1 mr-2"
        background-color="transparent"
      >
        <v-btn
          v-for="item in penawaranstore.getDataRevisiPenawaran"
          :key="item.id"
          size="x-small"
          variant="outlined"
          color="grey-lighten-1"
          class="text-grey-darken-2 px-2 text-none mt-1 btn-revisi mr-2"
          @click="saverevisitopenawaran(item)"
        >
          <strong>
            {{
              item.id.split("-").pop() === "01"
                ? "Penawaran Awal"
                : `Revisi ${item.id.split("-").pop()}`
            }}
          </strong>
        </v-btn>
      </v-btn-toggle>

      <v-divider class="mt-3" />
    </div>

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
        :src="detailpenawaran.document_spk"
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

/* Menghilangkan border default dan merapatkan baris tabel */
.compact-invoice-table :deep(table) {
  border-collapse: collapse !important;
}

.compact-invoice-table :deep(td),
.compact-invoice-table :deep(th) {
  height: 36px !important; /* Baris lebih rapat */
  padding: 0 12px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.compact-invoice-table :deep(th) {
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #616161 !important;
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
