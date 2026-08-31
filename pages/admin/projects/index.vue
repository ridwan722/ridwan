<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <v-dialog v-model="data.dialoglemparjson" max-width="800">
    <v-card>
      <v-card-title class="dialog-header"> INPUT PROJECT (JSON) </v-card-title>
      <v-card-text class="pa-8">
        <a-textarea
          v-model="data.jsonInput"
          placeholder="Paste JSON Project di sini..."
          rows="15"
        />
      </v-card-text>
      <v-card-actions class="dialog-footer pa-4">
        <v-btn color="red" @click="data.dialoglemparjson = false" variant="flat"
          >Batal</v-btn
        >
        <v-spacer />
        <v-btn color="primary" @click="handleSaveJson" variant="flat"
          >Simpan Project</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-row align="center">
    <v-col cols="9">
      <v-breadcrumbs>
        <v-breadcrumbs-item>
          <span class="font-weight-medium text-h5">
            Manajemen Project Aresa Perizinan
          </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>

    <v-col cols="3">
      <v-btn
        color="primary"
        @click="openDialogAdd"
        variant="flat"
        size="small"
        class="text-capitalize px-3"
        prepend-icon="mdi-plus"
      >
        Buat Project
      </v-btn>
    </v-col>
  </v-row>

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
          Total: {{ projectStore.getDataProject.length }} project
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="projectStore.getDataProject"
      :search="data.search"
      v-model:page="data.page"
      :items-per-page="data.itemsPerPage"
      :sort-by="[{ key: 'createdAt', order: 'desc' }]"
      :hover="true"
    >
      <template v-slot:item.no="{ index }">
        <span class="text-caption font-weight-bold text-grey-darken-1">
          {{ (data.page - 1) * data.itemsPerPage + index + 1 }}
        </span>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip
          :color="item.status === 'Completed' ? 'success' : 'warning'"
          size="small"
          label
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.aksi="{ item }">
        <div class="d-flex justify-center">
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
            @click="confirmDelete(item)"
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
            icon="mdi-file-document-outline"
          />

          <div class="text-body-1">Tidak ada data project</div>
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
                        projectStore.getDataProject.length,
                      )
                    }}
                  </strong>
                  <span class="text-grey mx-1">/</span>
                  <strong>{{ projectStore.getDataProject.length }}</strong>
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
import type { ProjectM } from "~/types/projectRealTimeModel";
import type { ConfirmationDialog } from "#components";

definePageMeta({ layout: "admin" });

const projectStore = useProjectRealTimeStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

const data = reactive({
  dialoglemparjson: false,
  jsonInput: "",
  search: "",
  page: 1,
  itemsPerPage: 10,
});

const headers = [
  { title: "Klien", value: "client" },
  { title: "Project", value: "title" },
  { title: "Kategori", value: "category" },
  { title: "Status", value: "status", align: "center" as const },
  {
    title: "Aksi",
    value: "aksi",
    align: "center" as const,
    sortable: false,
  },
];

onMounted(() => projectStore.tarikDataProject());

const openDialogAdd = () => {
  data.jsonInput = JSON.stringify(templateJson, null, 2);
  data.dialoglemparjson = true;
};

const openDialogEdit = (item: ProjectM) => {
  data.jsonInput = JSON.stringify(item, null, 2);
  data.dialoglemparjson = true;
};

const handleSaveJson = async () => {
  try {
    const parsed: ProjectM = JSON.parse(data.jsonInput);
    if (!parsed.slug) throw new Error("Slug wajib ada!");
    await projectStore.saveProject(parsed);
    data.dialoglemparjson = false;
  } catch (e) {
    alert("Format JSON Salah atau Slug Kosong!");
  }
};

const confirmDelete = async (item: ProjectM) => {
  const ok = await confirmationDialog.value?.show(
    "Hapus Project",
    `Hapus ${item.title}?`,
  );
  if (ok) await projectStore.deleteProject(item.slug);
};

// Template untuk mempermudah user input
const templateJson = {
  title: "",
  slug: "",
  category: "Legalitas",
  client: "",
  status: "In Progress",
  image: "",
  id_image: "",
  description: "",
  published_at: new Date().toISOString(),
  details: { duration: "", location: "", scope: [] },
  seoMeta: { metaTitle: "", metaDescription: "" },
};
</script>

<style scoped>
.dialog-header {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  color: white;
  text-align: center;
}
</style>
