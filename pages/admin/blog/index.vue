<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <v-dialog v-model="data.dialoglemparjson" max-width="800">
    <v-card height="900">
      <v-card-title class="dialog-header"> INPUT BLOG (JSON) </v-card-title>

      <v-card-text style="overflow-y: auto; max-height: 80vh" class="pa-8">
        <a-textarea v-model="data.lempar_json.data_json" label="Lempar json" />
      </v-card-text>

      <v-card-actions class="dialog-footer pa-4">
        <v-btn
          color="red"
          @click="data.dialoglemparjson = false"
          variant="flat"
        >
          Batal
        </v-btn>

        <v-btn color="primary" @click="savejson" variant="flat"> Simpan </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="data.dialogarticle" max-width="800">
    <v-card>
      <v-card-title class="dialog-header"> {{ addedit }} BLOG </v-card-title>

      <v-card-text style="overflow-y: auto; max-height: 80vh" class="pa-8">
        <a-textarea v-model="data.lempar_json.data_json" label="Lempar json" />
      </v-card-text>

      <v-card-actions class="dialog-footer pa-4">
        <v-btn color="red" @click="data.dialogarticle = false" variant="flat">
          Batal
        </v-btn>

        <v-btn color="primary" @click="tambahoredit" variant="flat">
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-row align="center">
    <v-col cols="10">
      <v-breadcrumbs>
        <v-breadcrumbs-item active>
          <span class="font-weight-medium text-h5"> Blog </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>

    <v-col cols="2">
      <v-btn
        color="primary"
        variant="flat"
        @click="openDialogAdd"
        class="add-btn rounded-lg"
        size="small"
        prepend-icon="mdi-plus"
      >
        Buat Blog
      </v-btn>
    </v-col>
  </v-row>

  <v-card flat rounded="lg" style="border: 1px solid #e0e0e0">
    <v-card-title class="font-weight-bold">
      <v-row class="ma-0" align="center" justify="end" style="width: 100%">
        <v-btn
          color="red"
          @click="hapusIndexBlogRealTime"
          class="add-btn mr-3 rounded-lg"
          size="30"
          prepend-icon="mdi-close-circle"
        >
          <v-tooltip activator="parent" location="top">
            Hapus index project
          </v-tooltip>
        </v-btn>

        <a-text-field
          v-model="data.search"
          placeholder="Ketik untuk mencari..."
          hide-details
          density="compact"
          clearable
          style="max-width: 250px"
        />
      </v-row>
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="data.headBlog"
      :items="blogRealTimeStore.getDataBlog"
      :search="data.search"
    >
      <template v-slot:item.no="{ index }">
        {{ index + 1 }}
      </template>

      <template v-slot:item.tindakan="{ item }">
        <v-row justify="center" align="center">
          <v-btn
            color="red"
            size="30"
            variant="flat"
            rounded="lg"
            class="ma-1"
            @click="hapusBlogRealTime(item.id!)"
          >
            <v-icon size="15" icon="mdi-delete" />

            <v-tooltip activator="parent" location="top">
              Hapus Blog
            </v-tooltip>
          </v-btn>

          <v-btn
            color="purple"
            size="30"
            variant="flat"
            rounded="lg"
            class="ma-1"
            @click="opendialogjson(item)"
          >
            <v-icon size="15" icon="mdi-code-braces" />

            <v-tooltip activator="parent" location="top">
              Input JSON
            </v-tooltip>
          </v-btn>
        </v-row>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import type { ConfirmationDialog } from "#components";
import type { BlogM } from "~/types/blogRealTimeModel";

definePageMeta({
  layout: "admin",
});

const copySuccess = ref(false);
const blogRealTimeStore = useBlogRealTimeStore();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

onMounted(async () => {
  await blogRealTimeStore.tarikDataBlog();
});

const data = reactive({
  dialoghapus: false,
  dialoglemparjson: false,
  dialogarticle: false,
  nama_id: "",
  id_blog: "",
  tambahedit: "",
  search: "",

  lempar_json: {
    data_json: "",
  },

  headBlog: [
    { title: "Tanggal Publikasi", value: "published_at", sortable: true },
    { title: "Judul Artikel", value: "title", sortable: true },
    { title: "Aksi", align: "center" as const, value: "tindakan" },
  ],
});

const newProject = ref<BlogM>({
  title: "",
  slug: "",
  description: "",
  content: [],
  image: "",
  id_image: "",
  published_at: new Date().toISOString(),
  author: { name: "", profile_url: "" },
  seoMeta: {
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
    ogImage: "",
    twitterCard: "",
  },

  schemaBlog: {
    "@context": "https://schema.org",
    "@type": "Blog",
    headline: "",
    image: [],
    datePublished: new Date().toISOString(),
    author: { "@type": "Person", name: "Admin Perkasa Racking" },
    publisher: {
      "@type": "Organization",
      name: "Perkasa Racking",
      logo: {
        "@type": "ImageObject",
        url: "https://cdn.perkasaracking.co.id/logo.png",
      },
    },
    description: "",
  },
});

async function salinId() {
  try {
    await navigator.clipboard.writeText(data.id_blog);
    copySuccess.value = true;

    // Reset status salin setelah 2 detik
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error("Gagal menyalin:", err);
    // Fallback untuk browser lama
    const textArea = document.createElement("textarea");
    textArea.value = data.id_blog;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  }
}

const addedit = computed(() => {
  return data.tambahedit === "add" ? "TAMBAH" : "EDIT";
});

async function tambahoredit() {
  if (data.tambahedit === "add") {
    saveBlogRealTime();
  } else {
    editBlogRealTime();
  }
}

async function openDialogAdd() {
  data.tambahedit = "add";
  data.dialogarticle = true;
}

async function saveBlogRealTime() {
  const parsedData = JSON.parse(data.lempar_json.data_json); // Pastikan JSON valid
  console.log(data.lempar_json.data_json, "data json");
  await blogRealTimeStore.saveBlog(parsedData);
  console.log("Artikel:", newProject.value);
  data.dialogarticle = false;
}

async function editBlogRealTime() {
  await blogRealTimeStore.updateBlog(newProject.value);
  data.dialogarticle = false;
}

async function hapusIndexBlogRealTime() {
  await blogRealTimeStore.deleteIndexBlog();
}

// Fucntion untuk JSON

async function opendialogjson(items: BlogM) {
  data.lempar_json.data_json = JSON.stringify(items, null, 2); // Mengubah data ke format JSON
  data.dialoglemparjson = true;
}

async function savejson() {
  try {
    const parsedData = JSON.parse(data.lempar_json.data_json); // Pastikan JSON valid
    console.log(parsedData, "data json");

    await blogRealTimeStore.saveBlog(parsedData); // Kirim ke backend atau store
    data.dialoglemparjson = false;
  } catch (error) {
    console.error("Format JSON tidak valid!", error);
  }
}

const hapusBlogRealTime = async (id: string) => {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Penghapusan dibatalkan");
  }

  await blogRealTimeStore.deleteBlog(id);
};
</script>

<style scoped>
:deep() thead th {
  font-weight: bold !important;
}

.dialog-header {
  background: linear-gradient(135deg, black, #ff0000);
  text-align: center;
  color: white;
  font-weight: bold;
  padding: 1rem;
}

.dialog-footer {
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.add-btn {
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.truncate-chip {
  max-width: 350px; /* atur sesuai kebutuhan */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
