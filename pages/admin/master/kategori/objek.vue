<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <!-- Dialog Tambah ObjectKategori -->
  <v-dialog
    v-model="data.dialogAdd"
    :width="$vuetify.display.mdAndUp ? '380px' : '90%'"
    max-width="480"
  >
    <v-card class="rounded-lg">
      <v-card-title
        class="px-4 text-subtitle-1 font-weight-bold bg-primary pa-3"
      >
        TAMBAH OBJEK KATEGORI
      </v-card-title>

      <v-card-text>
         <a-select
          v-model="newObjectKategori.kategori"
          label="Kategori"
          class="mb-3"
          :items="[
            'Reklame',
            'Ketenagakerjaan',
            'Lingkungan',
            'Damkar',
            'Teknis',
            'Lain-lain',
          ]"
        />

        <a-textarea
          v-model="newObjectKategori.nama"
          label="Nama"
          class="mb-3"
        />
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
          @click="saveObjectKategori"
          variant="flat"
          class="text-capitalize px-3"
          size="small"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog Edit ObjectKategori -->
  <v-dialog
    v-model="data.dialogEdit"
    :width="$vuetify.display.mdAndUp ? '380px' : '90%'"
    max-width="480"
  >
    <v-card class="rounded-lg">
      <v-card-title
        class="px-4 text-subtitle-1 font-weight-bold bg-primary pa-3"
      >
        EDIT OBJEK KATEGORI
      </v-card-title>

      <v-card-text>

        <a-select
          v-model="editObjectKategori.kategori"
          label="Kategori"
          class="mb-3"
          :items="[
            'Reklame',
            'Ketenagakerjaan',
            'Lingkungan',
            'Damkar',
            'Teknis',
            'Lain-lain',
          ]"
        />

         <a-textarea
          v-model="editObjectKategori.nama"
          label="Nama"
          class="mb-3"
          disabled
        />
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
          @click="ubahObjectKategori"
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
        <v-breadcrumbs-item active>
          <span class="font-weight-medium text-h5">
            Master Kategori Objek
          </span>
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
        <v-icon size="18">mdi-refresh</v-icon>
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
        Tambah Objek
      </v-btn>
    </v-col>
  </v-row>

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
          Total:
          {{ masterObjectKategoriStore.getDataObjectKategori.length }} objek
          kategori
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      :headers="data.headObjectKategori"
      :search="data.search"
      :items="masterObjectKategoriStore.getDataObjectKategori"
      :sort-by="[{ key: 'createdAt', order: 'desc' }]"
      v-model:page="data.page"
      :items-per-page="data.itemsPerPage"
      density="compact"
      :hover="true"
    >
      <template v-slot:item.no="{ index }">
        <span class="text-caption font-weight-bold text-grey-darken-1">
          {{ (data.page - 1) * data.itemsPerPage + index + 1 }}
        </span>
      </template>

      <!-- <template v-slot:item.id="{ item }">
        <v-chip
          size="x-small"
          color="grey-darken-1"
          variant="tonal"
          class="font-weight-medium rounded-sm px-2"
          style="font-family: monospace"
        >
          {{ item.id }}
        </v-chip>
      </template> -->

      <template v-slot:item.kategori="{ item }">
        <v-chip size="small" variant="tonal" color="primary" class="px-3">
          <v-icon start size="14">mdi-tag-outline</v-icon>
          {{ item.kategori }}
        </v-chip>
      </template>

      <template v-slot:item.aksi="{ item }">
        <div class="d-flex justify-center pa-2">
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
            @click="hapusObjectKategori(item.id!)"
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
            icon="mdi-shape-outline"
          />
          <div class="text-body-1">Tidak ada data object kategori</div>
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
                        masterObjectKategoriStore.getDataObjectKategori.length
                      )
                    }}
                  </strong>
                  <span class="text-grey mx-1">/</span>
                  <strong>{{
                    masterObjectKategoriStore.getDataObjectKategori.length
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
import { useMasterKategoriStore } from "~/stores/master/kategoriStore";
import type { masterObjectKategoriM } from "~/types/master/kategoriModel";

definePageMeta({
  layout: "admin",
});

const userStore = useUserStore();
const masterObjectKategoriStore = useMasterKategoriStore();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null
);

onMounted(async () => {
  await masterObjectKategoriStore.tarikDataObjectKategoriAct();
});

const newObjectKategori = ref<masterObjectKategoriM>({
  nama: "",
  kategori: "",
  createdAt: 0,
  createdBy: "",
});

const editObjectKategori = ref<masterObjectKategoriM>({
  nama: "",
  kategori: "",
  createdAt: 0,
  createdBy: "",
});

const data = reactive({
  search: "",
  dialogAdd: false,
  dialogEdit: false,
  page: 1,
  itemsPerPage: 30,

  headObjectKategori: [
    { title: "No", value: "no", width: "50px" },
    // { title: "ID ", value: "id", sortable: true },
    { title: "Kategori", value: "kategori", sortable: true },
    { title: "Nama", value: "nama", sortable: true },
    {
      title: "Aksi",
      value: "aksi",
      align: "center" as const,
      width: "100px",
    },
  ],
});

const openDialogAdd = async () => {
  newObjectKategori.value = {
    nama: "",
    kategori: "",
    createdAt: 0,
    createdBy: "",
  };
  data.dialogAdd = true;
};

const closeDialogAdd = () => {
  newObjectKategori.value = {
    nama: "",
    kategori: "",
    createdAt: 0,
    createdBy: "",
  };
  data.dialogAdd = false;
};

const saveObjectKategori = () => {
  const cabangSave = newObjectKategori.value;
  if (cabangSave.nama == "") {
    return notificationStore.showError("nama tidak boleh kosong");
  }
  if (cabangSave.kategori == "") {
    return notificationStore.showError("kategori tidak boleh kosong");
  }
  // Set metadata
  cabangSave.createdAt = tanggalunixskrg();
  cabangSave.createdBy = userStore.getEmail;

  // Simpan
  masterObjectKategoriStore.addMasterObjectKategoriAct(cabangSave);
  closeDialogAdd();
  refreshData();
};

const openDialogEdit = async (item: masterObjectKategoriM) => {
  await masterObjectKategoriStore.tarikDataObjectKategoriAct();
  editObjectKategori.value = _.assign({}, item);
  data.dialogEdit = true;
};

const closeDialogEdit = () => {
  editObjectKategori.value = {
    nama: "",
    kategori: "",
    createdAt: 0,
    createdBy: "",
  };
  data.dialogEdit = false;
};

const ubahObjectKategori = async () => {
  const cabangEdit = editObjectKategori.value;

  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Edit",
    "Anda yakin ingin mengedit data ini?"
  );

  if (!confirmed) {
    return notificationStore.showError("Perubahan dibatalkan");
  }

  cabangEdit.updatedAt = tanggalunixskrg();
  cabangEdit.updatedBy = userStore.getEmail;

  masterObjectKategoriStore.updateObjectKategoriAct(cabangEdit);
  closeDialogEdit();
  refreshData();
};

const hapusObjectKategori = async (id: string) => {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?"
  );

  if (!confirmed) {
    return notificationStore.showError("Penghapusan dibatalkan");
  }

  masterObjectKategoriStore.deleteMasterObjectKategoriAct(id);
  refreshData();
};

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_object_kategori");
  await masterObjectKategoriStore.tarikDataObjectKategoriAct();
  useloadingStore().setLoading(false);
  notificationStore.showSuccess("Data berhasil diperbarui");
}
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
