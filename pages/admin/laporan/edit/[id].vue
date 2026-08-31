<template>
  <v-container>
    <!-- Header -->
    <v-row align="center" class="mb-4">
      <v-col cols="12" sm="8">
        <v-breadcrumbs class="pa-0">
          <v-breadcrumbs-item to="/admin/perusahaan" class="text-grey-darken-1">
            Data Inspeksi
          </v-breadcrumbs-item>
          <v-breadcrumbs-divider>/</v-breadcrumbs-divider>
          <v-breadcrumbs-item active>
            <span class="font-weight-medium text-h5"
              >Edit Laporan Inspeksi</span
            >
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-btn
          color="grey-lighten-3"
          variant="flat"
          class="text-capitalize mr-2"
          to="/admin/perusahaan"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="text-capitalize"
          prepend-icon="mdi-content-save-outline"
          :loading="loadingSubmit"
          @click="updateLaporan"
        >
          Perbarui Laporan
        </v-btn>
      </v-col>
    </v-row>

    <v-form ref="formRef" lazy-validation>
      <v-row>
        <!-- Form Utama (Informasi Perusahaan) -->
        <v-col cols="12" md="4">
          <v-card flat rounded="lg" class="border pa-4">
            <div class="text-subtitle-1 font-weight-bold mb-3 text-primary">
              <v-icon class="mr-1" size="20"
                >mdi-office-building-outline</v-icon
              >
              Informasi Perusahaan
            </div>

            <a-select
              v-model="form.id_perusahaan"
              label="Nama Perusahaan *"
              :items="perusahaanStore.getDataPerusahaan"
              item-title="nama_perusahaan"
              item-value="id"
              :rules="[(v) => !!v || 'Perusahaan wajib dipilih']"
              class="mb-2"
            />

            <a-select
              v-model="form.id_cabang"
              label="Cabang Perusahaan *"
              :items="perusahaanStore.getDataCabang"
              item-title="nama_cabang"
              item-value="id"
              :rules="[(v) => !!v || 'Cabang wajib dipilih']"
              class="mb-2"
            />

            <v-text-field
              v-model="form.judul_laporan"
              label="Judul Laporan *"
              placeholder="Contoh: RANGKUMAN HASIL INSPEKSI"
              variant="outlined"
              density="comfortable"
              :rules="[(v) => !!v || 'Judul laporan wajib diisi']"
              class="mb-2"
            />

            <v-text-field
              v-model="tanggalInput"
              label="Tanggal Inspeksi *"
              type="date"
              variant="outlined"
              density="comfortable"
              :rules="[(v) => !!v || 'Tanggal wajib diisi']"
            />
          </v-card>
        </v-col>

        <!-- Form Dinamis (Daftar Alat/Item Inspeksi) -->
        <v-col cols="12" md="8">
          <v-card flat rounded="lg" class="border">
            <v-card-title class="pa-4 d-flex justify-between align-center">
              <div class="text-subtitle-1 font-weight-bold text-primary">
                <v-icon class="mr-1" size="20">mdi-tools</v-icon>
                Daftar Hasil Inspeksi Alat ({{ form.daftar_alat.length }} Item)
              </div>
              <v-btn
                color="success"
                size="small"
                variant="flat"
                prepend-icon="mdi-plus"
                class="text-capitalize"
                @click="tambahBarisAlat"
              >
                Tambah Alat
              </v-btn>
            </v-card-title>

            <v-divider />

            <!-- Tabel Input Alat -->
            <v-table class="inspection-table">
              <thead>
                <tr>
                  <th width="60px" class="text-center">No</th>
                  <th width="200px">Nama Alat *</th>
                  <th width="130px">Kapasitas</th>
                  <th width="180px">Merk / Serial</th>
                  <th width="220px">Kesimpulan K3 *</th>
                  <th width="120px">Ijin</th>
                  <th width="60px" class="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in form.daftar_alat" :key="index">
                  <td class="text-center font-weight-bold text-grey">
                    {{ index + 1 }}
                  </td>

                  <td>
                    <v-text-field
                      v-model="item.alat"
                      placeholder="Instalasi Alarm..."
                      variant="underlined"
                      density="compact"
                      hide-details="auto"
                      :rules="[(v) => !!v || 'Wajib']"
                    />
                  </td>

                  <td>
                    <v-text-field
                      v-model="item.kapasitas"
                      placeholder="3000 KG"
                      variant="underlined"
                      density="compact"
                      hide-details="auto"
                    />
                  </td>

                  <td>
                    <v-text-field
                      v-model="item.merk_serial"
                      placeholder="BISHAMON / 08..."
                      variant="underlined"
                      density="compact"
                      hide-details="auto"
                    />
                  </td>

                  <td>
                    <v-select
                      v-model="item.kesimpulan"
                      :items="[
                        'memenuhi persyaratan K3',
                        'Tidak memenuhi persyaratan K3',
                      ]"
                      variant="underlined"
                      density="compact"
                      hide-details="auto"
                      :rules="[(v) => !!v || 'Wajib']"
                    />
                  </td>

                  <td>
                    <v-select
                      v-model="item.ijin"
                      :items="['Berkala', 'Khusus', 'Baru']"
                      variant="underlined"
                      density="compact"
                      hide-details="auto"
                    />
                  </td>

                  <td class="text-center">
                    <v-btn
                      icon="mdi-delete-outline"
                      variant="text"
                      color="error"
                      density="comfortable"
                      :disabled="form.daftar_alat.length === 1"
                      @click="hapusBarisAlat(index)"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>

            <v-card-text
              v-if="form.daftar_alat.length === 0"
              class="text-center py-8 text-grey"
            >
              <v-icon size="40" class="mb-2">mdi-alert-circle-outline</v-icon>
              <div>
                Belum ada alat yang ditambahkan. Klik tombol "Tambah Alat" di
                atas.
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import _ from "lodash";
import moment from "moment";
import { useRoute } from "vue-router";
import { useLaporanStore } from "~/stores/laporanStore";
import type { CompanyInspectionReport } from "~/types/laporanModel";
import { useMasterPerusahaanStore } from "~/stores/master/perusahaanStore";

// 1. Inisialisasi Stores & Nuxt Utilities
const route = useRoute();
const perusahaanStore = useMasterPerusahaanStore();
const laporanStore = useLaporanStore();
const formRef = ref<any>(null);
const loadingSubmit = ref(false);

// Flag untuk memblokir reset otomatis saat inisialisasi data edit
const isDataLoading = ref(false);

// Tanggal lokal untuk input type="date"
const tanggalInput = ref(moment().format("YYYY-MM-DD"));

// 2. Deklarasi State Form
const form = reactive<CompanyInspectionReport>({
  id: "",
  id_perusahaan: "",
  nama_perusahaan: "",
  id_cabang: "",
  nama_cabang: "",
  judul_laporan: "RANGKUMAN HASIL INSPEKSI",
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
});

// 3. Lifecycle Hooks (Mengambil Detail Data berdasarkan ID)
onMounted(async () => {
  isDataLoading.value = true;

  // Ambil master perusahaan untuk dropdown list
  await perusahaanStore.tarikDataPerusahaanAct();

  // Pastikan data laporan di store sudah ter-update paling baru
  await laporanStore.tarikDataLaporannAct();

  // Ambil ID dari parameter URL (misal: /admin/perusahaan/edit/[id])
  const laporanId = route.params.id as string;

  if (laporanId) {
    const dataLaporan = laporanStore.getDataLaporan;
    const detailLaporan = _.find(dataLaporan, (o: any) => o.id === laporanId);

    if (detailLaporan) {
      // Masukkan data detail ke dalam form
      form.id = detailLaporan.id;
      form.id_perusahaan = detailLaporan.id_perusahaan;
      form.nama_perusahaan = detailLaporan.nama_perusahaan;

      // Ambil data cabang dari perusahaan terkait agar a-select cabang memiliki items data
      await perusahaanStore.tarikDataCabangPerusahaan(
        detailLaporan.id_perusahaan,
      );

      form.id_cabang = detailLaporan.id_cabang;
      form.nama_cabang = detailLaporan.nama_cabang;
      form.judul_laporan = detailLaporan.judul_laporan;

      // if (detailLaporan.tanggal_inspeksi) {
      //   tanggalInput.value = moment(detailLaporan.tanggal_inspeksi).format(
      //     "YYYY-MM-DD",
      //   );
      // }

      form.daftar_alat = _.cloneDeep(detailLaporan.daftar_alat);
    }
  }

  // Selesai memuat data, kembalikan flag ke false agar watcher bisa berfungsi normal kembali
  setTimeout(() => {
    isDataLoading.value = false;
  }, 200);
});

// 4. Watcher State dengan proteksi isDataLoading
watch(
  () => form.id_perusahaan,
  async (newIdPerusahaan) => {
    if (isDataLoading.value) return; // Abaikan reset jika sedang mengisi form dari detail data

    form.id_cabang = "";
    form.nama_cabang = "";

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
    if (isDataLoading.value) return;

    const dataCabang = perusahaanStore.getDataCabang;
    const cabangTerpilih = _.find(dataCabang, (o: any) => o.id == newIdCabang);

    if (!_.isUndefined(cabangTerpilih)) {
      form.nama_cabang = cabangTerpilih.nama_cabang;
    }
  },
);

// 5. Functions / Actions Halaman
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

const updateLaporan = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    loadingSubmit.value = true;
    // form.tanggal_inspeksi = moment(tanggalInput.value).toDate();

    const payload = _.cloneDeep(form);
    await laporanStore.updateLaporannAct(payload);
    await navigateTo("/admin/perusahaan");
  } catch (error) {
    console.error("Gagal memperbarui data:", error);
  } finally {
    loadingSubmit.value = false;
  }
};
</script>

<style scoped>
.inspection-table th {
  font-weight: bold !important;
  color: #374151 !important;
  background-color: #f9fafb !important;
}
.inspection-table td {
  padding: 8px 12px !important;
}
</style>
