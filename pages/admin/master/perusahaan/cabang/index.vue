<template>
  <ConfirmationDialog ref="confirmationDialog" />
  <!-- Dialog Tambah Cabang -->
  <v-dialog
    v-model="data.dialogAdd"
    :width="$vuetify.display.mdAndUp ? '380px' : '90%'"
  >
    <v-card class="rounded-lg">
      <v-card-title
        class="px-4 text-subtitle-1 font-weight-bold bg-primary pa-3"
      >
        TAMBAH CABANG
      </v-card-title>

      <v-card-text>
        <a-select
          v-model="newCabang.id_perusahaan"
          label="Perusahaan"
          :items="masterCabangStore.getDataPerusahaan"
          item-title="nama_perusahaan"
          item-value="id"
          
        />

        <a-text-field
          v-model="newCabang.nama_cabang"
          label="Nama Cabang"
          
        />

        <a-textarea v-model="newCabang.alamat_cabang" label="Alamat" />
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-3 bg-grey-lighten-4">
        <v-btn
          variant="flat"
          color="grey-darken-2"
          @click="closeDialogAdd"
          class="text-capitalize px-3"
          size="small"
        >
          Batal
        </v-btn>

        <v-btn
          color="primary"
          @click="saveCabang"
          variant="flat"
          class="text-capitalize px-3"
          size="small"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog Edit Cabang -->
  <v-dialog
    v-model="data.dialogEdit"
    :width="$vuetify.display.mdAndUp ? '380px' : '90%'"
    max-width="480"
  >
    <v-card class="rounded-lg">
      <v-card-title
        class="px-4 text-subtitle-1 font-weight-bold bg-primary pa-3"
      >
        EDIT CABANG
      </v-card-title>

      <v-card-text>
        <a-text-field
          v-model="editCabang.id_perusahaan"
          label="Perusahaan"
          class="mb-3"
          disabled
        />

        <a-text-field
          v-model="editCabang.nama_cabang"
          label="Nama Cabang"
          class="mb-3"
          disabled
        />

        <a-textarea v-model="editCabang.alamat_cabang" label="Alamat" />
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-3 bg-grey-lighten-4">
        <v-btn
          variant="flat"
          color="grey-darken-2"
          @click="closeDialogEdit"
          class="text-capitalize px-3"
          size="small"
        >
          Batal
        </v-btn>

        <v-btn
          color="primary"
          @click="ubahCabang"
          variant="flat"
          class="text-capitalize px-3"
          size="small"
        >
          Edit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Main Content -->
  <v-row align="center">
    <v-col cols="9">
      <v-breadcrumbs>
        <v-breadcrumbs-item>
          <span class="font-weight-medium text-h5"> Master Cabang </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>

    <v-col cols="3">
      <v-btn
        size="28"
        variant="outlined"
        color="grey-darken-1"
        class="border mr-3"
        @click="refreshData"
      >
        <v-icon size="18" icon="mdi-refresh" />
        <v-tooltip activator="parent" location="top"> Refresh Data </v-tooltip>
      </v-btn>

      <v-btn
        color="primary"
        @click="openDialogAdd"
        variant="flat"
        size="small"
        class="text-capitalize px-3"
        prepend-icon="mdi-plus"
      >
        Tambah Cabang
      </v-btn>
    </v-col>
  </v-row>

  <v-card>
    <v-card-text>
      <!-- Header -->
      <v-row align="center" justify="space-between" class="mb-2">
        <v-col cols="auto">
          <h3 class="text-body-1 font-weight-medium text-grey-darken-1">
            Filter Pencarian
          </h3>
        </v-col>

        <v-col cols="auto">
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                size="small"
                color="primary"
                variant="flat"
                rounded="xl"
                class="d-flex align-center"
                @click="showFilter = !showFilter"
              >
                <v-icon size="x-large">
                  {{ showFilter ? "mdi-chevron-up" : "mdi-chevron-down" }}
                </v-icon>
              </v-btn>
            </template>
            <span>Tampilkan / Sembunyikan Filter</span>
          </v-tooltip>
        </v-col>
      </v-row>

      <v-divider />

      <!-- Filter -->
      <v-expand-transition>
        <div v-show="showFilter">
          <v-row class="mt-3" align="end">
            <!-- <v-col cols="12" sm="3">
              <a-date-picker
                v-model="data.tanggal_awal"
                label="Tanggal Awal"
                :onUpdate:modelValue="(n: string) => (data.tanggal_awal = n)"
              />
            </v-col>

            <v-col cols="12" sm="3">
              <a-date-picker
                v-model="data.tanggal_akhir"
                label="Tanggal Akhir"
                :onUpdate:modelValue="(n: string) => (data.tanggal_akhir = n)"
              />
            </v-col> -->

            <v-col cols="12" sm="2">
              <a-select
                v-model="data.nama_perusahaan"
                label="Nama Perusahaan"
                :items="perusahaanStore.getDataPerusahaan"
                item-title="nama_perusahaan"
                item-value="nama_perusahaan"
              />
            </v-col>

            <v-col cols="12" sm="2">
              <v-btn
                size="small"
                color="primary"
                class="mb-2"
                @click="cekrekapan"
              >
                Terapkan
                <v-tooltip activator="parent" location="top">
                  Cek data Pesanan Pembelian
                </v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>
    </v-card-text>
  </v-card>
  <br />

  <!-- Table Card -->
  <v-card flat rounded="lg" class="border">
    <v-card-title class="pa-3">
      <v-row align="center">
        <v-col cols="12" sm="10">
          <a-text-field
            v-model="data.search"
            placeholder="Search"
            style="max-width: 280px"
          />
        </v-col>

        <v-col cols="12" sm="2" class="text-caption text-grey-darken-1">
          Total: {{ masterCabangStore.getDataCabang.length }} cabang
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      v-model:page="data.page"
      :items-per-page="data.itemsPerPage"
      :headers="data.headCabang"
      :search="data.search"
      :items="masterCabangStore.getDataCabang"
      :sort-by="[{ key: 'createdAt', order: 'desc' }]"
      density="compact"
      :hover="true"
    >
      <template v-slot:item.no="{ index }">
        <span class="text-caption font-weight-bold text-grey-darken-1">
          {{ (data.page - 1) * data.itemsPerPage + index + 1 }}
        </span>
      </template>

      <template v-slot:item.id="{ item }">
        <v-chip
          size="x-small"
          color="grey-darken-1"
          variant="tonal"
          class="font-weight-medium rounded-sm px-2"
          style="font-family: monospace"
        >
          {{ item.id }}
        </v-chip>
      </template>

      <template v-slot:item.nama_perusahaan="{ item }">
        <v-chip
          v-if="item.nama_perusahaan"
          size="small"
          variant="flat"
          color="blue-grey-lighten-5"
          class="text-blue-grey-darken-3 font-weight-bold border"
        >
          <v-avatar start color="blue-grey-darken-1" size="18">
            <span class="text-white" style="font-size: 8px">
              {{ item.nama_perusahaan.substring(0, 1) }}
            </span>
          </v-avatar>
          {{ item.nama_perusahaan.toUpperCase() }}
        </v-chip>

        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Tidak ada data
        </span>
      </template>

      <!-- <template v-slot:item.nama_cabang="{ item }">
        <div class="d-flex align-center" v-if="item.nama_cabang">
          <span class="text-body-2 font-weight-bold text-grey-darken-3">
            {{ item.nama_cabang }}
          </span>
        </div>

        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Tidak ada data
        </span>
      </template> -->

      <!-- <template v-slot:item.nama_cabang="{ item }">
        <v-chip
          size="small"
          variant="tonal"
          color="success"
          rounded="lg"
          class="font-weight-bold cursor-pointer"
          style="border-bottom: 2px solid #2e7d32"
          :to="'/admin/master/perusahaan/cabang/' + item.id! "
        >
          <v-icon start size="14" icon="mdi-eye" />
          {{ item.nama_cabang }}
          <v-tooltip activator="parent" location="top">Detail</v-tooltip>
        </v-chip>
      </template> -->

      <template v-slot:item.alamat_cabang="{ item }">
        <div class="address-cell py-2" v-if="item.alamat_cabang">
          <div class="d-flex align-start">
            <v-icon
              size="14"
              color="blue-darken-1"
              icon="mdi-map-marker-radius"
              class="mr-1 mt-1"
            />
            <div class="address-text">
              {{ item.alamat_cabang }}
            </div>
          </div>
        </div>

        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Tidak ada data
        </span>
      </template>

      <template v-slot:item.aksi="{ item }">
        <div class="d-flex justify-center">
          <v-btn
            size="27"
            variant="tonal"
            color="info"
            class="rounded-lg mr-1"
            :to="'/admin/master/perusahaan/cabang/' + item.id! "
          >
            <v-icon icon="mdi-eye" />
            <v-tooltip activator="parent" location="top">Detail</v-tooltip>
          </v-btn>

          <v-btn
            size="27"
            variant="tonal"
            color="info"
            class="rounded-lg mr-1"
            @click="openDialogEdit(item)"
          >
            <v-icon icon="mdi-pencil-outline" />
            <v-tooltip activator="parent" location="top">Edit</v-tooltip>
          </v-btn>

          <v-btn
            size="27"
            variant="tonal"
            color="error"
            class="rounded-lg"
            @click="hapusCabang(item)"
          >
            <v-icon icon="mdi-trash-can-outline" />
            <v-tooltip activator="parent" location="top">Hapus</v-tooltip>
          </v-btn>
        </div>
      </template>

      <template v-slot:no-data>
        <div class="py-8 text-center text-grey-darken-1">
          <v-icon
            size="48"
            color="grey-lighten-1"
            class="mb-2"
            icon="mdi-office-building-cog-outline"
          />

          <div class="text-body-1">Tidak ada data Cabang Perusahaan</div>
        </div>
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
                    {{ (data.page - 1) * data.itemsPerPage + 1 }}-{{
                      Math.min(
                        data.page * data.itemsPerPage,
                        masterCabangStore.getDataCabang.length
                      )
                    }}
                  </strong>
                  <span class="text-grey mx-1">/</span>
                  <strong>{{ masterCabangStore.getDataCabang.length }}</strong>
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
                  v-model="data.itemsPerPage"
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
                    <span class="text-caption font-weight-black text-primary">{{
                      item.title
                    }}</span>
                  </template>
                </v-select>
              </div>
            </v-col>
          </v-row>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import type { ConfirmationDialog } from "#components";
import type { cabangM } from "~/types/master/perusahaanModel";
import { useMasterPerusahaanStore } from "~/stores/master/perusahaanStore";

definePageMeta({
  layout: "admin",
});

const userStore = useUserStore();
const masterCabangStore = useMasterPerusahaanStore();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null
);
const perusahaanStore = useMasterPerusahaanStore();

const showFilter = ref(false);

onMounted(async () => {
  await masterCabangStore.tarikDataCabangAct();
  await perusahaanStore.tarikDataPerusahaanAct();
});

const newCabang = ref<cabangM>({
  id_perusahaan: "",
  nama_perusahaan: "",
  nama_cabang: "",
  alamat_cabang: "",
  createdAt: 0,
  createdBy: "",
  nama_group_pt: ""
});

const editCabang = ref<cabangM>({
  id_perusahaan: "",
  nama_perusahaan: "",
  nama_cabang: "",
  alamat_cabang: "",
  createdAt: 0,
  createdBy: "",
  nama_group_pt: ""
});

const data = reactive({
  search: "",
  dialogAdd: false,
  tanggal_awal: "",
  tanggal_akhir: "",
  nama_perusahaan: "",
  dialogEdit: false,
  page: 1,
  itemsPerPage: 10,

  headCabang: [
    {
      title: "No",
      value: "no",
      align: "center" as const,
      width: "50px",
    },
    // { title: "ID Cabang", value: "id", sortable: true, width: "50px" },
    {
      title: "Group",
      value: "nama_group_pt",
      sortable: true,
    },
    {
      title: "Perusahaan",
      value: "nama_perusahaan",
      sortable: true,
      width: "50px",
    },
    {
      title: "Cabang",
      value: "nama_cabang",
      sortable: true,
      width: "50px",
    },
    { title: "Alamat", value: "alamat_cabang", sortable: true, width: "350px" },
    {
      title: "Aksi",
      value: "aksi",
      align: "center" as const,
      width: "50px",
      sortable: false,
    },
  ],
});

watch(
  () => newCabang.value.id_perusahaan,
  (id_perusahaan) => {
    const dataPerusahaan = masterCabangStore.getDataPerusahaan;

    const b = _.find(dataPerusahaan, (o: any) => o.id == id_perusahaan);
    if (!_.isUndefined(b)) {
      newCabang.value.nama_perusahaan = b!.nama_perusahaan;
      newCabang.value.nama_group_pt = b!.nama_group_pt;
    }
  }
);

watch(
  () => data.search,
  () => {
    data.page = 1;
  }
);

const openDialogAdd = async () => {
  await masterCabangStore.tarikDataPerusahaanAct();
  newCabang.value = {
    id_perusahaan: "",
    nama_perusahaan: "",
    nama_group_pt:"",
    nama_cabang: "",
    alamat_cabang: "",
    createdAt: 0,
    createdBy: "",
  };
  data.dialogAdd = true;
};

const closeDialogAdd = () => {
  newCabang.value = {
    id_perusahaan: "",
    nama_perusahaan: "",
    nama_group_pt:"",
    nama_cabang: "",
    alamat_cabang: "",
    createdAt: 0,
    createdBy: "",
  };
  data.dialogAdd = false;
};

const saveCabang = () => {
  const cabangSave = newCabang.value;

  // Validasi perusahaan
  if (!cabangSave.id_perusahaan) {
    return notificationStore.showError("Perusahaan wajib dipilih");
  }

  // Validasi nama cabang
  if (!cabangSave.nama_cabang || cabangSave.nama_cabang.trim() === "") {
    return notificationStore.showError("Nama cabang tidak boleh kosong");
  }

  // Validasi alamat
  if (!cabangSave.alamat_cabang || cabangSave.alamat_cabang.trim() === "") {
    return notificationStore.showError("Alamat cabang tidak boleh kosong");
  }

  // Set metadata
  cabangSave.createdAt = tanggalunixskrg();
  cabangSave.createdBy = userStore.getEmail;

  // Simpan
  masterCabangStore.addMasterCabangAct(cabangSave);
  closeDialogAdd();
  refreshData();
};

const openDialogEdit = async (item: cabangM) => {
  await masterCabangStore.tarikDataPerusahaanAct();
  editCabang.value = _.assign({}, item);
  data.dialogEdit = true;
};

const closeDialogEdit = () => {
  editCabang.value = {
    id_perusahaan: "",
    nama_perusahaan: "",
    nama_group_pt:"",
    nama_cabang: "",
    alamat_cabang: "",
    createdAt: 0,
    createdBy: "",
  };
  data.dialogEdit = false;
};

const ubahCabang = async () => {
  const cabangEdit = editCabang.value;

  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Edit",
    "Anda yakin ingin mengedit data ini?"
  );

  if (!confirmed) {
    return notificationStore.showError("Perubahan dibatalkan");
  }

  cabangEdit.updatedAt = tanggalunixskrg();
  cabangEdit.updatedBy = userStore.getEmail;
  masterCabangStore.updateMasterCabangAct(cabangEdit);

  closeDialogEdit();
  refreshData();
};

const hapusCabang = async (item: cabangM) => {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?"
  );

  if (!confirmed) {
    return notificationStore.showError("Penghapusan dibatalkan");
  }

  masterCabangStore.deleteMasterCabangAct(item);
  refreshData();
};

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_cabang");
  await masterCabangStore.tarikDataCabangAct();
  useloadingStore().setLoading(false);
  notificationStore.showSuccess("Data berhasil diperbarui");
}

const cekrekapan = () => {
  const { tanggal_awal, tanggal_akhir, nama_perusahaan } = data;

  // 1. Semua filter kosong
  if (!tanggal_awal && !tanggal_akhir && !nama_perusahaan) {
    notificationStore.showError("Minimal isi salah satu filter pencarian");
    return;
  }

  // 2. Validasi tanggal harus berpasangan
  if ((tanggal_awal && !tanggal_akhir) || (!tanggal_awal && tanggal_akhir)) {
    notificationStore.showError(
      "Tanggal Awal dan Tanggal Akhir harus diisi bersamaan"
    );
    return;
  }
  console.log(nama_perusahaan, "nama_perusahaan");
  // 3. Eksekusi query
  masterCabangStore.getrekapancabangbyperusahaan(
    tanggal_awal,
    tanggal_akhir,
    nama_perusahaan
  );
};
</script>

<style scoped>
:deep() thead th {
  font-weight: bold !important;
  border: 1px solid #cbcbcb !important;
  background-color: #dddddd !important;
}

:deep() tbody td {
  border-right: 1px solid #e0e0e0 !important;
}
</style>
