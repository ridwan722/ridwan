<script setup lang="ts">
import _ from "lodash";
import { useloadingStore } from "~/stores/loadingStore";

definePageMeta({ layout: "admin" });
const loadingStore = useloadingStore();
const route = useRoute();
const unmanageStore = useunmanageStore();

const rubahtanggalunix = (unix?: number) => {
  if (!unix) return "-";
  return new Date(unix * 1000).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(async () => {
  const id = route.params.id;
  if (id) {
    try {
      loadingStore.setLoading(true);
      await unmanageStore.tarikDetailunmanageAct(_.toString(id));
    } catch (e) {
      console.error("Fetch detail error:", e);
    } finally {
      loadingStore.setLoading(false);
    }
  }
});

const detailKategoriItem = computed(() => {
  return unmanageStore.getDetailunmanage;
});
const isLoading = computed(() => loadingStore.getLoading);
</script>

<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <div class="d-flex align-center justify-space-between mb-4">
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="tonal"
      color="grey-darken-3"
      class="text-none"
      rounded="lg"
      @click="$router.back()"
    >
      Kembali
    </v-btn>

    <div v-if="detailKategoriItem" class="text-right">
      <v-chip
        color="primary"
        variant="flat"
        rounded="lg"
        class="font-weight-bold"
      >
        <v-icon start icon="mdi-barcode" size="14" />
        {{ detailKategoriItem.kode_kategori_item || "-" }}
      </v-chip>
    </div>
  </div>

  <div v-if="detailKategoriItem">
    <v-card variant="flat" class="mb-4 border rounded-xl overflow-hidden">
      <div class="bg-primary-lighten-5 pa-4 d-flex align-center border-bottom">
        <v-avatar color="primary" size="48" class="mr-4 elevation-2">
          <v-icon color="white">mdi-package-variant-closed</v-icon>
        </v-avatar>
        <div>
          <div class="text-h6 font-weight-black">
            {{ detailKategoriItem.nama_kategori_item || "-" }}
          </div>
          <div class="text-caption text-grey-darken-1">
            {{ detailKategoriItem.nama_perusahaan }} •
            {{ detailKategoriItem.nama_cabang }}
          </div>
        </div>
      </div>

      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="3" class="border-right-md">
            <label class="text-overline text-grey">Kategori Objek</label>
            <div class="text-body-1 font-weight-bold">
              {{ detailKategoriItem.nama_kategori_object || "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="3" class="border-right-md">
            <label class="text-overline text-grey">Jumlah Unit</label>
            <div class="text-body-1 font-weight-bold">
              {{ detailKategoriItem.jumlahUnit || "0" }} Unit
            </div>
          </v-col>
          <v-col cols="12" md="3" class="border-right-md">
            <label class="text-overline text-grey">Nominal</label>
            <div class="text-h6 font-weight-black text-success">
              Rp {{ (detailKategoriItem.nominal || 0).toLocaleString("id-ID") }}
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <label class="text-overline text-grey">Masa Berlaku</label>
            <div class="d-flex align-center">
              <v-icon size="16" color="blue" class="mr-1"
                >mdi-calendar-range</v-icon
              >
              <span class="text-caption font-weight-bold">
                {{ detailKategoriItem.periode?.mulai || "-" }} —
                {{ detailKategoriItem.periode?.selesai || "-" }}
              </span>
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <v-row>
          <v-col cols="12" sm="6">
            <label class="text-overline text-grey">Ukuran Tersedia</label>
            <div class="d-flex flex-wrap gap-2 mt-1">
              <v-chip
                v-for="sz in detailKategoriItem.ukuran || []"
                :key="sz"
                size="small"
                variant="tonal"
                color="grey-darken-3"
              >
                {{ sz }}
              </v-chip>
              <span
                v-if="!detailKategoriItem.ukuran?.length"
                class="text-body-2 text-grey"
                >-</span
              >
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <label class="text-overline text-grey">Keterangan</label>
            <p class="text-body-2 text-medium-emphasis font-italic">
              "{{
                detailKategoriItem.keterangan ||
                "Tidak ada keterangan tambahan."
              }}"
            </p>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />
      <div
        class="pa-3 bg-grey-lighten-4 d-flex flex-wrap justify-space-between align-center px-6"
      >
        <div class="text-caption text-grey">
          <v-icon size="14">mdi-plus-circle-outline</v-icon>
          Dibuat: <b>{{ detailKategoriItem.createdBy }}</b> ({{
            rubahtanggalunix(detailKategoriItem.createdAt)
          }})
        </div>
        <div v-if="detailKategoriItem.updatedAt" class="text-caption text-grey">
          <v-icon size="14">mdi-pencil-outline</v-icon>
          Update terakhir:
          <b>{{ rubahtanggalunix(detailKategoriItem.updatedAt) }}</b>
        </div>
      </div>
    </v-card>

    <div class="d-flex align-center justify-space-between mb-3 mt-6">
      <div class="text-subtitle-1 font-weight-bold d-flex align-center">
        <v-icon start color="blue-darken-2">mdi-attachment</v-icon>
        Dokumen Pendukung
        <v-badge
          :content="detailKategoriItem.dokumen?.length || 0"
          color="blue"
          inline
          class="ml-2"
        />
      </div>
    </div>

    <v-row dense class="mb-6">
      <v-col
        v-for="(doc, i) in detailKategoriItem.dokumen || []"
        :key="i"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card variant="outlined" class="rounded-lg hover-doc border-dashed">
          <div class="pa-3 d-flex align-center">
            <v-avatar
              rounded="lg"
              color="blue-lighten-5"
              size="40"
              class="mr-3"
            >
              <v-icon color="primary">mdi-file-document-outline</v-icon>
            </v-avatar>
            <div class="overflow-hidden mr-2">
              <div class="text-caption font-weight-bold text-truncate">
                {{ doc.nama_dokumen }}
              </div>
              <div class="text-grey" style="font-size: 10px">
                {{ doc.no_dokumen }}
              </div>
            </div>
            <v-spacer />
            <v-btn
              icon="mdi-download"
              size="x-small"
              variant="tonal"
              color="primary"
              :href="doc.file_dokumen"
              target="_blank"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>

  <div
    v-else-if="isLoading"
    class="d-flex flex-column align-center justify-center py-12"
  >
    <v-progress-circular indeterminate color="primary" size="50" />
    <div class="mt-4 text-grey">Memuat Detail Kategori...</div>
  </div>
</template>

<style scoped>
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}
.border-right-md {
  @media (min-width: 960px) {
    border-right: 1px solid rgba(0, 0, 0, 0.05);
  }
}
.border-dashed {
  border: 1.5px dashed #e0e0e0 !important;
}
.gap-2 {
  gap: 8px;
}
.max-width-search {
  max-width: 300px;
}
.hover-doc {
  transition: all 0.2s ease;
}
.hover-doc:hover {
  background: #f8fbff;
  border-color: #1767c0 !important;
  transform: translateY(-2px);
}
.compact-table :deep(thead th) {
  background-color: #fcfcfc !important;
  text-transform: uppercase;
  font-size: 11px !important;
  letter-spacing: 0.5px;
  font-weight: 700 !important;
  color: #616161 !important;
}
</style>
