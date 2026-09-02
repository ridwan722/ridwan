<template>
  <div class="page-shell">
    <form @submit.prevent="simpanBeritaAcara" class="form-container">
      
      <header class="top-bar">
        <div class="top-bar-left">
          <nav class="breadcrumbs">
            <a href="/admin/perusahaan">Data Berita Acara</a>
            <span class="divider">/</span>
            <span class="active">Tambah Berita Acara</span>
          </nav>
          <h1 class="page-title">Buat Berita Acara Baru</h1>
        </div>

        <div class="top-bar-actions">
          <a href="/admin/berita_acara" class="btn btn-ghost">Batal</a>
          <button type="submit" class="btn btn-primary" :disabled="loadingSubmit">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            {{ loadingSubmit ? 'Saving...' : 'Simpan Laporan' }}
          </button>
        </div>
      </header>

      <div class="vertical-stack">
        
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title">
              <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Informasi Utama</span>
            </div>
          </div>

          <div class="panel-body">
            <div class="info-form-grid">
              <div class="form-field">
                <label class="label">Nama Perusahaan <span class="dot-required">*</span></label>
                <div class="select-wrapper">
                  <select v-model="form.id_perusahaan" class="input-control select-control" required>
                    <option value="" disabled selected>Pilih Perusahaan...</option>
                    <option v-for="item in perusahaanStore.getDataPerusahaan" :key="item.id" :value="item.id">
                      {{ item.nama_perusahaan }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-field">
                <label class="label">Cabang Perusahaan <span class="dot-required">*</span></label>
                <div class="select-wrapper">
                  <select v-model="form.id_cabang" class="input-control select-control" required :disabled="!form.id_perusahaan">
                    <option value="" disabled selected>Pilih Cabang...</option>
                    <option v-for="item in perusahaanStore.getDataCabang" :key="item.id" :value="item.id">
                      {{ item.nama_cabang }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-field">
                <label class="label">Judul Laporan <span class="dot-required">*</span></label>
                <input type="text" v-model="form.judul_berita_acara" placeholder="Contoh: RANGKUMAN HASIL INSPEKSI" class="input-control" required />
              </div>

              <div class="form-field">
                <label class="label">Tanggal Berita Acara <span class="dot-required">*</span></label>
                <input type="date" v-model="tanggalInput" class="input-control" required />
              </div>
            </div>
          </div>
        </section>

        <section class="panel-card">
          <div class="panel-header flex-between">
            <div class="panel-title">
              <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Daftar Hasil Inspeksi Alat</span>
              <span class="counter-pill">{{ form.daftar_alat.length }} Item</span>
            </div>

            <button type="button" class="btn btn-secondary" @click="tambahBarisAlat">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Alat
            </button>
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
                  <tr v-for="(item, index) in form.daftar_alat" :key="index" class="table-row">
                    <td class="td-num">
                      <span class="num-badge">{{ index + 1 }}</span>
                    </td>

                    <td>
                      <input type="text" v-model="item.alat" placeholder="Nama alat/instalasi..." class="cell-input" required />
                    </td>

                    <td>
                      <input type="text" v-model="item.kapasitas" placeholder="e.g. 3000 KG" class="cell-input" />
                    </td>

                    <td>
                      <input type="text" v-model="item.merk_serial" placeholder="e.g. BISHAMON" class="cell-input" />
                    </td>

                    <td>
                      <div class="status-select-wrap" :class="item.kesimpulan === 'memenuhi persyaratan K3' ? 'is-pass' : 'is-fail'">
                        <select v-model="item.kesimpulan" class="cell-input select-status" required>
                          <option value="memenuhi persyaratan K3">Memenuhi K3</option>
                          <option value="Tidak memenuhi persyaratan K3">Tidak Memenuhi K3</option>
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
                      <button type="button" class="action-btn-danger" :disabled="form.daftar_alat.length === 1" @click="hapusBarisAlat(index)" title="Hapus Baris">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="empty-state">
              <div class="empty-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3>Belum ada item inspeksi</h3>
              <p>Tambahkan setidaknya satu item alat untuk melengkapi laporan ini.</p>
              <button type="button" class="btn btn-secondary" @click="tambahBarisAlat">
                + Tambah Alat Pertama
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

definePageMeta({ layout: "admin" });

const perusahaanStore = useMasterPerusahaanStore();
const beritaAcaraStore = useBeritaAcaraStore();
const loadingSubmit = ref(false);
const tanggalInput = ref(moment().format("YYYY-MM-DD"));

const form = reactive<CompanyInspectionReport>({
  id_perusahaan: "",
  nama_perusahaan: "",
  id_cabang: "",
  nama_cabang: "",
  judul_berita_acara: "RANGKUMAN HASIL INSPEKSI",
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
  id_kategori_item: "",
  nama_kategori_item: ""
});

onMounted(async () => {
  await perusahaanStore.tarikDataPerusahaanAct();
});

watch(() => form.id_perusahaan, async (newIdPerusahaan) => {
  form.id_cabang = "";
  form.nama_cabang = "";
  const dataPerusahaan = perusahaanStore.getDataPerusahaan;
  const perusahaanTerpilih = _.find(dataPerusahaan, (o: any) => o.id == newIdPerusahaan);
  if (!_.isUndefined(perusahaanTerpilih)) {
    form.nama_perusahaan = perusahaanTerpilih.nama_perusahaan;
    await perusahaanStore.tarikDataCabangPerusahaan(perusahaanTerpilih.id!);
  }
});

watch(() => form.id_cabang, (newIdCabang) => {
  const dataCabang = perusahaanStore.getDataCabang;
  const cabangTerpilih = _.find(dataCabang, (o: any) => o.id == newIdCabang);
  if (!_.isUndefined(cabangTerpilih)) {
    form.nama_cabang = cabangTerpilih.nama_cabang;
  }
});

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
  form.daftar_alat.forEach((item, idx) => { item.no = idx + 1; });
};

const simpanBeritaAcara = async () => {
  if (!form.id_perusahaan || !form.id_cabang || !form.judul_berita_acara) {
    alert("Lengkapi field mandatory terlebih dahulu!");
    return;
  }

  try {
    loadingSubmit.value = true;
    const payload = _.cloneDeep(form);
    await beritaAcaraStore.addBeritaAcaraAct(payload);
    await navigateTo("/admin/berita_acara");
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
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
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #0f172a;
}

/* Header & Top Bar */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 4px;
}

.breadcrumbs a {
  color: #64748b;
  text-decoration: none;
  transition: color 0.15s ease;
}

.breadcrumbs a:hover { color: #2563eb; }
.breadcrumbs .divider { color: #cbd5e1; }
.breadcrumbs .active { color: #0f172a; font-weight: 600; }

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
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 1px 2px -1px rgba(0, 0, 0, 0.02);
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

.dot-required { color: #ef4444; }

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
  content: '';
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
  padding: 9px 16px;
  font-size: 0.875rem;
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

.btn-primary:hover { background-color: #1d4ed8; }

.btn-secondary {
  background-color: #10b981;
  color: #ffffff;
}

.btn-secondary:hover { background-color: #059669; }

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
  width: 16px;
  height: 16px;
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

.th-num, .td-num { width: 44px; text-align: center; }
.th-act, .td-act { width: 50px; text-align: center; }

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
</style>