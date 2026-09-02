<template>
  <div class="page-shell">
    <v-dialog v-model="dialogImage" max-width="900">
      <v-card rounded="xl">
        <v-toolbar color="white" density="comfortable">
          <v-toolbar-title>Preview Gambar</v-toolbar-title>

          <v-spacer />

          <v-btn icon="mdi-close" variant="text" @click="dialogImage = false" />
        </v-toolbar>

        <v-card-text class="pa-4 text-center">
          <v-img
            :src="selectedImage"
            max-height="70vh"
            contain
            class="rounded-lg"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <form @submit.prevent="submitBeritaAcara" class="form-container">
      <!-- HEADER BAR -->
      <header class="top-bar">
        <div class="top-bar-left">
          <h1 class="page-title">
            {{
              props.mode == "create"
                ? "Buat Berita Acara Baru"
                : "Update Berita Acara"
            }}
          </h1>
        </div>

        <div class="top-bar-actions">
          <button type="button" class="btn btn-danger" @click="emit('close')">
            <svg
              class="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18 6L6 18M6 6l12 12"
              />
            </svg>
            Batal
          </button>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loadingSubmit"
          >
            <svg
              class="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            {{ loadingSubmit ? "Memproses..." : "Simpan Berita Acara" }}
          </button>
        </div>
      </header>

      <div class="vertical-stack">
        <!-- SECTION 1: INFORMASI UTAMA -->
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title">
              <svg
                class="title-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>Informasi Utama</span>
            </div>
          </div>

          <div class="panel-body">
            <div class="info-form-grid">
              <!-- Nama Perusahaan -->
              <div class="form-field">
                <label class="label"
                  >Nama Perusahaan <span class="dot-required">*</span></label
                >
                <div class="select-wrapper">
                  <a-text-field
                    v-model="form.id_perusahaan"
                    class="input-control select-control"
                    style="cursor: pointer;"
                    
                  >
                    <option value="" disabled selected>
                      Pilih Perusahaan...
                    </option>
                    <option
                      v-for="item in perusahaanStore.getDataPerusahaan"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.nama_perusahaan }}
                    </option>
                  </a-text-field>
                </div>
              </div>

              <!-- Judul Laporan -->
              <div class="form-field">
                <label class="label"
                  >Judul Berita Acara <span class="dot-required">*</span></label
                >
                <input
                  type="text"
                  v-model="form.judul_berita_acara"
                  placeholder="Cth. RANGKUMAN HASIL INSPEKSI"
                  class="input-control"

                />
              </div>

              <!-- Cabang Perusahaan -->
              <div class="form-field">
                <label class="label"
                  >Cabang Perusahaan <span class="dot-required">*</span></label
                >
                <div class="select-wrapper">
                  <select
                    v-model="form.id_cabang"
                    class="input-control select-control"
                    
                    style="cursor: pointer;"
                    :disabled="!form.id_perusahaan"
                  >
                    <option value="" disabled selected>Pilih Cabang...</option>
                    <option
                      v-for="item in perusahaanStore.getDataCabang"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.nama_cabang }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Tanggal Berita Acara -->
              <div class="form-field">
                <label class="label">
                  Tanggal Berita Acara <span class="dot-required">*</span>
                </label>
                <input
                  type="date"
                  v-model="tanggalInput"
                  class="input-control"
                  
                  style="cursor: pointer;"
                />
              </div>

              <!-- Item Kategori -->
              <div class="form-field">
                <label class="label"
                  >item kategori <span class="dot-required">*</span></label
                >
                <div>
                  <a-autocomplete
                    v-model="form.id_kategori_item"
                    :items="filteredKategoriItem"
                    item-title="nama_kategori_item"
                    item-value="id"
                    placeholder="Pilih Item Kategori..."
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    :disabled="form.id_cabang === ''"
                    clearable
                    
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 2: DAFTAR ALAT -->
        <section class="panel-card">
          <div class="panel-header flex-between">
            <div class="panel-title">
              <svg
                class="title-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Daftar Hasil Inspeksi Alat</span>
              <span class="counter-pill"
                >{{ form.daftar_alat.length }} Item</span
              >
            </div>
          </div>

          <div class="panel-body flat-body">
            <div v-if="form.daftar_alat.length > 0" class="table-frame">
              <table class="ui-table">
                <thead>
                  <tr>
                    <th class="th-num">No</th>
                    <th>Nama Alat / Instalasi *</th>
                    <th>Kapasitas</th>
                    <th>Merk / Serial</th>
                    <th>Kesimpulan K3 *</th>
                    <th>Ijin</th>
                    <th class="th-act">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in form.daftar_alat"
                    :key="index"
                    class="table-row"
                  >
                    <td class="td-num">
                      <span class="num-badge">{{ index + 1 }}</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        v-model="item.alat"
                        placeholder="Nama alat/instalasi..."
                        class="cell-input"
                        
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        v-model="item.kapasitas"
                        placeholder="e.g. 3000 KG"
                        class="cell-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        v-model="item.merk_serial"
                        placeholder="e.g. BISHAMON"
                        class="cell-input"
                      />
                    </td>
                    <td>
                      <div
                        class="status-select-wrap"
                        :class="
                          item.kesimpulan === 'memenuhi persyaratan K3'
                            ? 'is-pass'
                            : 'is-fail'
                        "
                      >
                        <select
                          v-model="item.kesimpulan"
                          class="cell-input select-status"
                          
                        >
                          <option value="memenuhi persyaratan K3">
                            Memenuhi K3
                          </option>
                          <option value="Tidak memenuhi persyaratan K3">
                            Tidak Memenuhi K3
                          </option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <select v-model="item.ijin" class="cell-input">
                        <option value="Berkala">Berkala</option>
                        <option value="Khusus">Khusus</option>
                        <option value="Baru">Baru</option>
                      </select>
                    </td>
                    <td class="td-act">
                      <button
                        type="button"
                        class="action-btn-danger"
                        :disabled="form.daftar_alat.length === 1"
                        @click="hapusBarisAlat(index)"
                        title="Hapus Baris"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="empty-state">
              <h3>Belum ada item inspeksi</h3>
              <p>
                Tambahkan setidaknya satu item alat untuk melengkapi laporan
                ini.
              </p>
              <button
                type="button"
                class="btn btn-secondary"
                @click="tambahBarisAlat"
              >
                + Tambah Alat Pertama
              </button>
            </div>
          </div>
          <div class="pa-4 text-center">
            <button
              type="button"
              class="btn btn-secondary"
              @click="tambahBarisAlat"
            >
              <svg
                class="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tambah Alat
            </button>
          </div>
        </section>

        <!-- SECTION 3: DOKUMENTASI -->
        <section class="panel-card">
          <div class="panel-header flex-between">
            <div class="panel-title">
              <svg
                class="title-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Dokumentasi Inspeksi</span>
              <span class="counter-pill"
                >{{ form.dokumentasi.length }} Item</span
              >
            </div>
          </div>

          <div class="panel-body">
            <div class="table-frame">
              <table class="doc-table ui-table">
                <thead>
                  <tr>
                    <th style="width: 60px" class="text-center">No.</th>
                    <th style="width: 260px">Gambar (Maks. 2)</th>
                    <th>Keterangan</th>
                    <th>Notes</th>
                    <th style="width: 60px" class="text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="(doc, index) in form.dokumentasi"
                    :key="index"
                    class="table-row"
                  >
                    <td class="text-center font-medium">
                      {{ index + 1 }}
                    </td>

                    <td>
                      <div class="image-gallery">
                        <div class="gallery-header">
                          <span class="gallery-title"> 📷 Dokumentasi </span>

                          <span class="gallery-count">
                            {{ doc.images.length }}/2
                          </span>
                        </div>

                        <div class="image-grid">
                          <div
                            v-for="(img, imgIdx) in doc.images"
                            :key="imgIdx"
                            class="image-card"
                            @click="
                              selectedImage = img;
                              dialogImage = true;
                            "
                          >
                            <img :src="img" class="preview-img" />

                            <div class="image-overlay">
                              <span>Lihat</span>
                            </div>

                            <button
                              class="btn-delete-img"
                              @click.stop="hapusGambar(index, imgIdx)"
                            >
                              ✕
                            </button>
                          </div>

                          <div
                            v-if="doc.images.length < 2"
                            class="upload-card"
                            @click="triggerFileInput(index)"
                          >
                            <div class="upload-content">
                              <div class="upload-circle">+</div>

                              <span>Tambah</span>
                            </div>

                            <input
                              :ref="(el) => (fileInputs[index] = el)"
                              type="file"
                              accept="image/*"
                              hidden
                              @change="(e) => handleFileUpload(e, index)"
                            />
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <textarea
                        v-model="doc.keterangan"
                        class="form-control cell-input"
                        rows="2"
                        placeholder="Masukkan keterangan foto..."
                      />
                    </td>

                    <td>
                      <textarea
                        v-model="doc.notes"
                        class="form-control cell-input"
                        rows="2"
                        placeholder="Masukkan catatan/notes..."
                      />
                    </td>

                    <td class="text-center">
                      <button
                        type="button"
                        class="action-btn-danger"
                        :disabled="form.dokumentasi.length === 1"
                        title="Hapus baris dokumentasi"
                        @click="hapusBarisDokumentasi(index)"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="pa-4 text-center mt-3">
              <button
                type="button"
                class="btn btn-secondary"
                @click="tambahBarisDokumentasi"
              >
                + Tambah Baris Dokumentasi
              </button>
            </div>
          </div>
        </section>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import _ from "lodash";
import moment from "moment";
import { useBeritaAcaraStore } from "~/stores/beritaAcaraStore";
import type { CompanyInspectionReport } from "~/types/beritaAcaraModel";
import { useMasterPerusahaanStore } from "~/stores/master/perusahaanStore";
import { useMasterKategoriStore } from "~/stores/master/kategoriStore";
const props = defineProps({
  mode: {
    type: String,
    default: "create",
  },
  dataEdit: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved"): void;
}>();

interface DokumentasiItem {
  keterangan: string;
  notes: string;
  images: string[];
}

interface FormBeritaAcaraFull extends CompanyInspectionReport {
  tanggal_berita_acara?: string;
  dokumentasi: DokumentasiItem[];
}

definePageMeta({ layout: "admin" });

const perusahaanStore = useMasterPerusahaanStore();
const beritaAcaraStore = useBeritaAcaraStore();
const loadingSubmit = ref(false);
const tanggalInput = ref(moment().format("YYYY-MM-DD"));
const fileInputs = ref<any[]>([]);
const dialogImage = ref(false);
const selectedImage = ref("");
const masterKategoriItemStore = useMasterKategoriStore();

const form = reactive<FormBeritaAcaraFull>({
  id_perusahaan: "",
  nama_perusahaan: "",
  id_cabang: "",
  nama_cabang: "",
  judul_berita_acara: "",
  daftar_alat: [
    {
      no: 1,
      alat: "",
      kapasitas: null,
      merk_serial: null,
      kesimpulan: "memenuhi persyaratan K3",
      ijin: "Berkala",
    },
  ],
  dokumentasi: [
    {
      keterangan: "",
      notes: "",
      images: [],
    },
  ],
  id_kategori_item: "",
  nama_kategori_item: "",
});

watch(
  () => props.dataEdit,
  async (val: any) => {
    if (!val) return;

    Object.assign(form, _.cloneDeep(val));

    tanggalInput.value = moment(val.tanggal_berita_acara).format("YYYY-MM-DD");

    await perusahaanStore.tarikDataCabangPerusahaan(form.id_perusahaan);
  },
  {
    immediate: true,
    deep: true,
  },
);

onMounted(async () => {
  await perusahaanStore.tarikDataPerusahaanAct();
  await masterKategoriItemStore.tarikDataItemKategoriAct();
});

watch(
  () => form.id_perusahaan,
  async (newIdPerusahaan) => {
    // Reset Cabang
    form.id_cabang = "";
    form.nama_cabang = "";

    // Reset Kategori
    form.id_kategori_item = "";
    form.nama_kategori_item = "";
    const dataPerusahaan = perusahaanStore.getDataPerusahaan;
    const perusahaanTerpilih = _.find(
      dataPerusahaan,
      (o: any) => o.id == newIdPerusahaan,
    );
    if (!_.isUndefined(perusahaanTerpilih)) {
      form.nama_perusahaan = perusahaanTerpilih.nama_perusahaan;
      await perusahaanStore.tarikDataCabangPerusahaan(perusahaanTerpilih.id!);
    }
  },
);

watch(
  () => form.id_cabang,
  (newIdCabang) => {
    const dataCabang = perusahaanStore.getDataCabang;
    const cabangTerpilih = _.find(dataCabang, (o: any) => o.id == newIdCabang);
    if (!_.isUndefined(cabangTerpilih)) {
      form.nama_cabang = cabangTerpilih.nama_cabang;
    }
  },
);

watch(
  () => form.id_kategori_item,
  (newIdKategori) => {
    const dataKategori = masterKategoriItemStore.getDataItemKategori;
    const kategoriTerpilih = _.find(
      dataKategori,
      (o: any) => o.id == newIdKategori,
    );
    if (!_.isUndefined(kategoriTerpilih)) {
      form.nama_kategori_item = kategoriTerpilih.nama_kategori_item;
    }
  },
);

const filteredKategoriItem = computed(() => {
  if (!form.id_perusahaan || !form.id_cabang) {
    return [];
  }

  return masterKategoriItemStore.getDataItemKategori.filter((item: any) => {
    return (
      item.id_perusahaan === form.id_perusahaan &&
      item.id_cabang === form.id_cabang
    );
  });
});

/* DAFTAR ALAT */
const tambahBarisAlat = () => {
  form.daftar_alat.push({
    no: form.daftar_alat.length + 1,
    alat: "",
    kapasitas: null,
    merk_serial: null,
    kesimpulan: "memenuhi persyaratan K3",
    ijin: "Berkala",
  });
};

const hapusBarisAlat = (index: number) => {
  form.daftar_alat.splice(index, 1);
  form.daftar_alat.forEach((item, idx) => {
    item.no = idx + 1;
  });
};

/* DOKUMENTASI */
const tambahBarisDokumentasi = () => {
  form.dokumentasi.push({
    keterangan: "",
    notes: "",
    images: [],
  });
};

const hapusBarisDokumentasi = (index: number) => {
  form.dokumentasi.splice(index, 1);
};

const triggerFileInput = (index: number) => {
  if (fileInputs.value[index]) {
    fileInputs.value[index].click();
  }
};

// Fungsi Helper untuk Kompresi Gambar sebelum disimpan ke Base64 (Mencegah Error 413 / Request Payload Too Large)
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800; // Resolusi disesuaikan agar ukuran file kecil
        const scaleSize = MAX_WIDTH / img.width;

        if (scaleSize < 1) {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Kompres ke JPEG dengan kualitas 0.7 (70%)
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        resolve(compressedBase64);
      };
    };
  });
};

const handleFileUpload = async (event: Event, index: number) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const compressedBase64 = await compressImage(file);
    form.dokumentasi[index].images.push(compressedBase64);
    target.value = "";
  }
};

const hapusGambar = (docIndex: number, imgIndex: number) => {
  form.dokumentasi[docIndex].images.splice(imgIndex, 1);
};

/* SIMPAN LAPORAN ke STORE / DATABASE */
const submitBeritaAcara = async () => {
  // if (!form.id_perusahaan || !form.id_cabang || !form.judul_berita_acara) {
  //   alert("Mohon lengkapi Perusahaan, Cabang, dan Judul Laporan!");
  //   return;
  // }

  try {
    loadingSubmit.value = true;

    // Susun payload yang dikirim ke backend
    const payload = {
      ..._.cloneDeep(form),
      tanggal_berita_acara: tanggalInput.value,
      // Kirim juga variasi snake_case jika backend membutuhkannya
      daftar_alat: form.daftar_alat,
      dokumentasi: form.dokumentasi,
    };

    console.log("=== Mengirim Payload Berita Acara ===", payload);

    // Panggil aksi Simpan
    let res;

    if (props.mode == "create") {
      res = await beritaAcaraStore.addBeritaAcaraAct(payload);
    } else {
      res = await beritaAcaraStore.updateBeritaAcaraAct(payload);
    }

    console.log("=== Response Backend ===", res);

    // alert("Laporan berhasil disimpan ke database!");
    emit("saved");
    emit("close");
  } catch (error: any) {
    console.error("=== Error Simpan Laporan ===", error);

    const serverMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Terjadi kesalahan pada server.";

    if (error?.response?.status === 413) {
      alert(
        "Gagal Simpan: Ukuran foto/file terlalu besar untuk diterima server.",
      );
    } else if (error?.response?.status === 422) {
      alert(
        `Gagal Validasi Backend (422): ${JSON.stringify(error?.response?.data?.errors || serverMessage)}`,
      );
    } else {
      alert(`Gagal menyimpan data: ${serverMessage}`);
    }
  } finally {
    loadingSubmit.value = false;
  }
};
</script>

<style scoped>
.page-shell {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 24px 32px 48px;
  font-family:
    "Inter",
    system-ui,
    -apple-system,
    sans-serif;
  color: #0f172a;
}

/* Header & Top Bar */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0f172a;
  margin: 0;
}

.top-bar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Vertical Layout Container */
.vertical-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Form Grid untuk Informasi Utama (2x2 di desktop, 1-kolom di HP) */
.info-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 24px;
}

@media (max-width: 768px) {
  .info-form-grid {
    grid-template-columns: 1fr;
  }
}

/* Panel Card */
.panel-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.02),
    0 1px 2px -1px rgba(0, 0, 0, 0.02);
  overflow: hidden;
}

.panel-header {
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.title-icon {
  width: 18px;
  height: 18px;
  color: #3b82f6;
}

.counter-pill {
  background-color: #eff6ff;
  color: #1d4ed8;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  margin-left: 4px;
}

.panel-body {
  padding: 20px;
}

.panel-body.flat-body {
  padding: 0;
}

/* Form Controls */
.form-field {
  display: flex;
  flex-direction: column;
}

.label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

.dot-required {
  color: #ef4444;
}

.input-control {
  width: 100%;
  padding: 9px 12px;
  font-size: 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: #ffffff;
  color: #0f172a;
  outline: none;
  transition: all 0.15s ease-in-out;
  box-sizing: border-box;
}

.input-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.input-control:disabled {
  background-color: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: "";
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #64748b;
  pointer-events: none;
}

.select-control {
  appearance: none;
  padding-right: 32px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 11px;
  font-size: 0.775rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
}

.btn-primary {
  background-color: #2563eb;
  color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(37, 99, 235, 0.2);
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-danger {
  background-color: #eb2525;
  color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(37, 99, 235, 0.2);
}

.btn-danger:hover {
  background-color: #d81d1d;
}

.btn-secondary {
  background-color: #10b981;
  color: #ffffff;
}

.btn-secondary:hover {
  background-color: #059669;
}

.btn-ghost {
  background-color: transparent;
  color: #64748b;
  border-color: #e2e8f0;
}

.btn-ghost:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.btn-icon {
  width: 10px;
  height: 10px;
}

/* Table Styling */
.table-frame {
  overflow-x: auto;
}

.ui-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;
}

.ui-table th {
  background-color: #f8fafc;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 12px 14px;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.ui-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.table-row {
  transition: background-color 0.12s ease;
}

.table-row:hover {
  background-color: #f8fafc;
}

.th-num,
.td-num {
  width: 44px;
  text-align: center;
}
.th-act,
.td-act {
  width: 50px;
  text-align: center;
}

.num-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #f1f5f9;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 600;
}

.cell-input {
  cursor: pointer;
  width: 100%;
  padding: 6px 10px;
  font-size: 0.85rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: #ffffff;
  color: #0f172a;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s ease;
}

.cell-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.status-select-wrap {
  border-radius: 6px;
  padding: 2px;
}

.status-select-wrap.is-pass .cell-input {
  background-color: #f0fdf4;
  color: #166534;
  border-color: #bbf7d0;
  font-weight: 600;
}

.status-select-wrap.is-fail .cell-input {
  background-color: #fef2f2;
  color: #991b1b;
  border-color: #fecaca;
  font-weight: 600;
}

.action-btn-danger {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.action-btn-danger svg {
  width: 18px;
  height: 18px;
}

.action-btn-danger:hover:not(:disabled) {
  background-color: #fef2f2;
  color: #ef4444;
}

.action-btn-danger:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  padding: 48px 24px;
  text-align: center;
  background-color: #f8fafc;
  margin: 20px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
}

.empty-icon-wrap {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  color: #94a3b8;
}

.empty-state h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.empty-state p {
  font-size: 0.825rem;
  color: #64748b;
  margin: 0 0 16px 0;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-gallery {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px;
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.gallery-title {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.gallery-count {
  background: #eff6ff;
  color: #2563eb;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.image-grid {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

/* Card Foto */

.image-card {
  position: relative;
  width: 90px;
  height: 90px;
  overflow: hidden;
  border-radius: 14px;
  cursor: pointer;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: 0.3s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.image-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.18);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.4s;
}

.image-card:hover .preview-img {
  transform: scale(1.08);
}

/* Overlay */

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 13px;
  font-weight: 600;
  opacity: 0;
  transition: 0.25s;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

/* Delete */

.btn-delete-img {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 50%;
  background: white;
  color: #ef4444;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.8);
  transition: 0.25s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.image-card:hover .btn-delete-img {
  opacity: 1;
  transform: scale(1);
}

.btn-delete-img:hover {
  background: #ef4444;
  color: white;
}

/* Upload */

.upload-card {
  width: 90px;
  height: 90px;
  border: 2px dashed #cbd5e1;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.3s;
  background: #fafafa;
}

.upload-card:hover {
  border-color: #2563eb;
  background: #eff6ff;
  transform: translateY(-4px);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  font-weight: bold;
}

.upload-content span {
  font-size: 12px;
  color: #475569;
  font-weight: 600;
}
</style>
