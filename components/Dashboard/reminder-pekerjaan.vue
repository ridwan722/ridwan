<template>
  <div class="dashboard-container pa-4">
    <header class="dashboard-header">
      <div>
        <div class="header-inline">
          <h1 class="header-title">REMINDER - Masa Berlaku Pekerjaan</h1>
          <span class="header-badge">{{ pajakExpired.length }} Overdue</span>
        </div>
        <!-- <p class="header-subtitle">
          Daftar pekerjaan expired yang memerlukan penawaran baru segera.
        </p> -->
      </div>
    </header>

    <section class="summary-grid">
      <div class="summary-card status-critical">
        <div class="summary-inner">
          <span class="summary-label">Total Expired</span>
          <strong class="summary-value"
            >{{ pajakExpired.length }}
            <span class="summary-unit">Item</span></strong
          >
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-inner">
          <span class="summary-label">Keterlambatan Tertinggi</span>
          <strong class="summary-value"
            >{{ maxExpiredDay }} <span class="summary-unit">Hari</span></strong
          >
        </div>
      </div>
    </section>

    <div v-if="pajakExpired.length === 0" class="empty-state-compact">
      <svg
        class="empty-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span class="empty-text"
        >Semua data aman. Tidak ada periode yang expired saat ini.</span
      >
    </div>

    <div v-else>
      <section class="reminder-grid">
        <div
          v-for="item in pajakExpiredLimited"
          :key="item.id"
          class="compact-reminder-card"
        >
          <div class="card-indicator"></div>

          <div class="card-body">
            <div class="main-info">
              <span class="category-tag">{{ item.nama_kategori_item }}</span>
              <h4 class="branch-title" :title="item.nama_cabang">
                {{ item.nama_cabang }}
              </h4>
            </div>

            <div class="date-info">
              <div class="data-group">
                <span class="data-label">Selesai</span>
                <span class="data-value">{{
                  item.periode?.selesai || "-"
                }}</span>
              </div>
              <div class="data-group">
                <span class="data-label text-danger">Overdue</span>
                <span class="data-value text-danger font-bold">
                  {{ countExpiredDays(item.periode?.selesai) }}
                </span>
              </div>
            </div>

            <div class="action-zone">
            <v-btn
  :to="'/admin/master/kategori/item/' + item.id"
  icon
  size="x-small"
  variant="text"
  color="grey-darken-1"
  class="minimal-btn"
>
  <v-icon size="16">mdi-eye</v-icon>
</v-btn>
            </div>
          </div>
        </div>
      </section>

      <div class="action-footer">
        <NuxtLink to="/admin/master/kategori/item" class="btn-view-more">
          <span>Lihat Semua Data Pekerjaan</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useMasterKategoriStore } from "~/stores/master/kategoriStore";

const masterKategoriItemStore = useMasterKategoriStore();

onMounted(async () => {
  await masterKategoriItemStore.tarikDataItemKategoriAct();
});

const kategoriWithDeadline = computed(() => {
  return masterKategoriItemStore.dataItemKategori || [];
});

const isExpired = (tanggalSelesai) => {
  if (!tanggalSelesai) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(tanggalSelesai);
  endDate.setHours(0, 0, 0, 0);
  return endDate < today;
};

const pajakExpired = computed(() => {
  return kategoriWithDeadline.value
    .filter((item) => item.periode?.selesai && isExpired(item.periode.selesai))
    .sort((a, b) => new Date(a.periode.selesai) - new Date(b.periode.selesai));
});

const pajakExpiredLimited = computed(() => {
  return pajakExpired.value.slice(0, 2);
});

const countExpiredDays = (tanggalSelesai) => {
  if (!tanggalSelesai) return "-";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(tanggalSelesai);
  endDate.setHours(0, 0, 0, 0);
  return `${Math.floor((today - endDate) / (1000 * 60 * 60 * 24))} Hari`;
};

const maxExpiredDay = computed(() => {
  if (!pajakExpired.value.length) return 0;
  const days = pajakExpired.value.map((item) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(item.periode.selesai);
    endDate.setHours(0, 0, 0, 0);
    return Math.floor((today - endDate) / (1000 * 60 * 60 * 24));
  });
  return Math.max(...days);
});

const buatPenawaran = (item) => {
  console.log("Buat Penawaran :", item);
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.dashboard-container {
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  color: #1e293b;
  margin: 0rem 0;
  border: 1px solid rgb(225, 225, 225);
  border-radius: 10px;
}

/* Tight Header Layout */
.dashboard-header {
  margin-bottom: 1rem;
}
.header-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.header-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0f172a;
  margin: 0;
}
.header-badge {
  font-size: 0.7rem;
  font-weight: 700;
  background-color: #fee2e2;
  color: #991b1b;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #fca5a5;
}
.header-subtitle {
  font-size: 0.825rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
}

/* High Density Summary Widget */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}
.summary-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.625rem 0.875rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}
.status-critical {
  background: #fff5f5;
  border-color: #fee2e2;
}
.summary-inner {
  display: flex;
  flex-direction: column;
}
.summary-label {
  font-size: 0.6rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.status-critical .summary-label {
  color: #991b1b;
}
.summary-value {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-top: 0.125rem;
}
.status-critical .summary-value {
  color: #dc2626;
}
.summary-unit {
  font-size: 0.6rem;
  font-weight: 500;
  color: #64748b;
}

/* High Density Grid */
.reminder-grid {
  display: grid;
  grid-template-columns: 1fr; /* Stack horizontal bars */
  gap: 0.5rem;
}

/* Slim Horizontal Card Look */
.compact-reminder-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  transition: all 0.2s ease;
}
.compact-reminder-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  transform: translateY(-1px);
}
.card-indicator {
  width: 4px;
  background-color: #ef4444;
  flex-shrink: 0;
}
.card-body {
  padding: 0.625rem 1rem;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

/* Item details styling */
.main-info {
  flex: 2;
  min-width: 0;
}
.category-tag {
  font-size: 0.65rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  display: block;
}
.branch-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0.125rem 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Middle Splits for Data Alignment */
.date-info {
  flex: 2;
  display: flex;
  gap: 2rem;
  justify-content: flex-start;
}
.data-group {
  display: flex;
  flex-direction: column;
}
.data-label {
  font-size: 0.65rem;
  color: #94a3b8;
  font-weight: 500;
}
.data-value {
  font-size: 0.8rem;
  font-weight: 500;
  color: #334155;
  margin-top: 0.125rem;
}
.text-danger {
  color: #dc2626;
}
.font-bold {
  font-weight: 600;
}

/* Micro Small Action Button */
.action-zone {
  flex: 0 0 auto;
}
.minimal-btn {
  min-width: 28px !important;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    transform: scale(1.05);
  }
}

/* Compact Footer Action */
.action-footer {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.btn-view-more {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  text-decoration: none;
  width: 100%;
  justify-content: center;
}
.btn-view-more:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #0f172a;
}
.btn-view-more svg {
  width: 14px;
  height: 14px;
}

/* Clean Micro Empty State */
.empty-state-compact {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 0.75rem 1rem;
}
.empty-icon {
  width: 16px;
  height: 16px;
  color: #059669;
}
.empty-text {
  font-size: 0.8rem;
  color: #475569;
}
</style>
