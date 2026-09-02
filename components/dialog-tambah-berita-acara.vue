<template>
  <div class="page-shell">
    <form class="form-container" @submit.prevent="submitBeritaAcara">
      <header class="top-bar">
        <h1 class="page-title">
          {{
            mode === "create" ? "Buat Berita Acara Baru" : "Update Berita Acara"
          }}
        </h1>
        <div class="top-bar-actions">
          <button type="button" class="btn btn-danger" @click="emit('close')">
            Batal
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loadingSubmit"
          >
            {{ loadingSubmit ? "Memproses..." : "Simpan Berita Acara" }}
          </button>
        </div>
      </header>

      <section class="panel-card">
        <div class="panel-header"><h2>Informasi Berita Acara</h2></div>
        <div class="panel-body">
          <div class="form-grid">
            <div class="form-field full-width">
              <label for="judul_berita_acara">Judul Berita Acara</label>
              <input
                id="judul_berita_acara"
                v-model.trim="form.judul_berita_acara"
                class="input-control"
                type="text"
                placeholder="Masukkan judul berita acara"
                required
              />
            </div>

            <div class="form-field full-width">
              <label>Customer</label>
              <v-autocomplete
                v-model="form.id_customer"
                :items="customerStore.getDataCustomer"
                item-title="nama"
                item-value="id"
                placeholder="Pilih customer"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                clearable
              />
            </div>

            <div class="form-field">
              <a-date-picker-new
                v-model="form.tanggal_berita_acara"
              ></a-date-picker-new>
            </div>

            <div class="form-field">
              <label for="nama_customer">Nama Customer</label>
              <input
                id="nama_customer"
                v-model.trim="form.nama_customer"
                class="input-control"
                type="text"
                required
              />
            </div>
            <div class="form-field">
              <label for="pic">PIC</label>
              <input
                id="pic"
                v-model.trim="form.pic"
                class="input-control"
                type="text"
                required
              />
            </div>
            <div class="form-field">
              <label for="no_telp">Nomor Telepon</label>
              <input
                id="no_telp"
                v-model.trim="form.no_telp"
                class="input-control"
                type="tel"
                required
              />
            </div>
            <div class="form-field full-width">
              <label for="alamat">Alamat</label>
              <textarea
                id="alamat"
                v-model.trim="form.alamat"
                class="input-control textarea-control"
                rows="4"
                required
              />
            </div>
          </div>
        </div>
      </section>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useBeritaAcaraStore } from "~/stores/beritaAcaraStore";
import { usecustomerStore } from "~/stores/customerStore";
import type { CompanyInspectionReport } from "~/types/beritaAcaraModel";

const props = withDefaults(
  defineProps<{
    mode?: "create" | "edit";
    dataEdit?: CompanyInspectionReport | null;
  }>(),
  { mode: "create", dataEdit: null },
);

const emit = defineEmits<{ close: []; saved: [] }>();
const beritaAcaraStore = useBeritaAcaraStore();
const customerStore = usecustomerStore();
const notificationStore = useNotificationStore();
const loadingSubmit = ref(false);

const emptyForm = (): CompanyInspectionReport => ({
  id_customer: "",
  nama_customer: "",
  judul_berita_acara: "",
  pic: "",
  no_telp: "",
  alamat: "",
  tanggal_berita_acara: "",
});

const form = reactive<CompanyInspectionReport>(emptyForm());

const applyEditData = (data?: CompanyInspectionReport | null) => {
  Object.assign(form, emptyForm());
  delete form.id;
  if (!data) return;

  Object.assign(form, {
    id: data.id,
    id_customer: data.id_customer,
    nama_customer: data.nama_customer,
    judul_berita_acara: data.judul_berita_acara,
    pic: data.pic,
    no_telp: data.no_telp,
    alamat: data.alamat,
  });
};

watch(() => props.dataEdit, applyEditData, { immediate: true });

watch(
  () => form.id_customer,
  (idCustomer) => {
    const customer = customerStore.getDataCustomer.find(
      (item) => item.id === idCustomer,
    );
    if (!customer) return;
    form.nama_customer = customer.nama;
    form.pic = customer.pic;
    form.no_telp = customer.no_telp;
    form.alamat = customer.alamat;
  },
);

onMounted(() => customerStore.tarikDataCustomerAct());

const submitBeritaAcara = async () => {
  if (
    !form.id_customer ||
    !form.nama_customer.trim() ||
    !form.judul_berita_acara.trim() ||
    !form.pic.trim() ||
    !form.no_telp.trim() ||
    !form.alamat.trim()
  ) {
    notificationStore.showError("Semua data berita acara wajib diisi");
    return;
  }

  const payload: CompanyInspectionReport = {
    ...(form.id ? { id: form.id } : {}),
    id_customer: form.id_customer,
    nama_customer: form.nama_customer,
    judul_berita_acara: form.judul_berita_acara,
    pic: form.pic,
    no_telp: form.no_telp,
    alamat: form.alamat,
    tanggal_berita_acara: form.tanggal_berita_acara,
  };

  loadingSubmit.value = true;
  try {
    const saved =
      props.mode === "create"
        ? await beritaAcaraStore.addBeritaAcaraAct(payload)
        : await beritaAcaraStore.updateBeritaAcaraAct(payload);
    if (!saved) return;
    emit("saved");
    emit("close");
  } finally {
    loadingSubmit.value = false;
  }
};
</script>

<style scoped>
.page-shell {
  min-height: 100%;
  padding: 24px;
  background: #f8fafc;
  color: #0f172a;
}
.form-container {
  max-width: 960px;
  margin: 0 auto;
}
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.page-title {
  margin: 0;
  font-size: 24px;
}
.top-bar-actions {
  display: flex;
  gap: 10px;
}
.panel-card {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: white;
  box-shadow: 0 4px 16px rgb(15 23 42 / 6%);
}
.panel-header {
  padding: 18px 22px;
  border-bottom: 1px solid #e2e8f0;
}
.panel-header h2 {
  margin: 0;
  font-size: 17px;
}
.panel-body {
  padding: 22px;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.form-field label {
  font-size: 14px;
  font-weight: 600;
}
.full-width {
  grid-column: 1 / -1;
}
.input-control {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: white;
  color: inherit;
  font: inherit;
}
.input-control:focus {
  border-color: #2563eb;
  outline: 2px solid rgb(37 99 235 / 12%);
}
.textarea-control {
  resize: vertical;
}
.btn {
  min-height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}
.btn:disabled {
  cursor: wait;
  opacity: 0.65;
}
.btn-primary {
  background: #2563eb;
}
.btn-danger {
  background: #dc2626;
}

@media (max-width: 640px) {
  .page-shell {
    padding: 16px;
  }
  .top-bar {
    align-items: stretch;
    flex-direction: column;
  }
  .top-bar-actions,
  .top-bar-actions .btn {
    flex: 1;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: auto;
  }
}
</style>
