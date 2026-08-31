<script setup>
import { ref, computed, onMounted } from "vue";
import { getAuth } from "firebase/auth"; // Diperlukan untuk membaca email user Firebase yang sedang login

const invoicestore = useInvoiceStore();
const useuser = useUserStore(); // Memanggil user store sesuai dengan modul Anda

const showNominal = ref(false);
const showPelunasan = ref(false);
const isLoading = ref(true);

// Mengambil email user aktif secara langsung dan reaktif dari Firebase Auth
const userEmail = computed(() => {
  const auth = getAuth();
  return auth.currentUser?.email || "";
});

// Cek apakah email yang sedang login sesuai hak akses khusus
const isAuthorizedForPelunasan = computed(() => {
  return userEmail.value === "abidalkhalid69@gmail.com";
});

onMounted(async () => {
  try {
    await invoicestore.tarikDataInvoiceAct();
  } catch (error) {
    console.error("Gagal memuat data invoice:", error);
  } finally {
    isLoading.value = false;
  }
});

const allInvoices = computed(() => {
  return invoicestore.getDataInvoice || [];
});

const invoiceList = computed(() => {
  return allInvoices.value.filter((item) => item.status !== "Diterima");
});

const invoiceLimited = computed(() => {
  return invoiceList.value.slice(0, 3);
});

const totalPelunasan = computed(() => {
  return allInvoices.value
    .filter((item) => item.status === "Selesai")
    .reduce((acc, curr) => acc + (Number(curr.grandtotal) || 0), 0);
});

const totalOutstanding = computed(() => {
  return invoiceList.value.reduce(
    (acc, curr) => acc + (Number(curr.grandtotal) || 0),
    0,
  );
});

const checkDueStatus = (dueDate) => {
  if (!dueDate) return "Aman";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dueDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Terlewat";
  if (diffDays === 0) return "Hari Ini";
  if (diffDays <= 7) return "Mepet";
  return "Aman";
};

const totalPendingCount = computed(() => {
  return invoiceList.value.filter(
    (i) => checkDueStatus(i.jatuhTempo) !== "Aman",
  ).length;
});

const totalTerlewatCount = computed(() => {
  return invoiceList.value.filter(
    (i) => checkDueStatus(i.jatuhTempo) === "Terlewat",
  ).length;
});

const getTempoStatusText = (dueDate) => {
  if (!dueDate) return "-";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dueDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `Terlewat ${Math.abs(diffDays)}H`;
  if (diffDays === 0) return "Hari Ini";
  return `${diffDays} Hari Lagi`;
};

const getIndicatorClass = (dueDate) => {
  const status = checkDueStatus(dueDate);
  if (status === "Terlewat") return "bg-danger";
  if (status === "Hari Ini") return "bg-warning-dark";
  if (status === "Mepet") return "bg-warning";
  return "bg-info";
};

const getTextColorClass = (dueDate) => {
  const status = checkDueStatus(dueDate);
  if (status === "Terlewat") return "badge-danger";
  if (status === "Hari Ini") return "badge-warning-dark";
  if (status === "Mepet") return "badge-warning";
  return "badge-success";
};

const formatCurrency = (value) => {
  if (!value) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};
</script>

<template>
  <div class="dashboard-container vertical-split">
    <header class="dashboard-header">
      <div>
        <div class="header-inline">
          <h1 class="header-title">Invoice & Kwitansi Terkirim</h1>
          <span v-if="isLoading" class="skeleton skeleton-badge shimmer"></span>
          <span v-else class="header-badge badge-info"
            >{{ totalPendingCount }} Pending</span
          >
        </div>
      </div>
    </header>

    <section class="summary-grid">
      <div class="summary-card status-info">
        <div class="summary-inner">
          <span class="summary-label">Outstanding</span>
          <div v-if="isLoading" class="skeleton skeleton-value shimmer"></div>
          <strong v-else class="summary-value"
            >Rp
            <span v-if="showNominal">{{ rupiah(totalOutstanding) }}</span>
            <span v-else>••••••</span>
            <v-icon
              size="x-small"
              class="cursor-pointer ml-2"
              @click="showNominal = !showNominal"
            >
              {{ showNominal ? "mdi-eye-outline" : "mdi-eye-off" }}
            </v-icon>
          </strong>
        </div>
      </div>

      <div class="summary-card status-success">
        <div class="summary-inner">
          <span class="summary-label">Total Pelunasan</span>
          <div v-if="isLoading" class="skeleton skeleton-value shimmer"></div>
          <template v-else>
            <!-- v-if="isAuthorizedForPelunasan" -->
            <strong  class="summary-value"
              >Rp
              <span v-if="showPelunasan">{{ rupiah(totalPelunasan) }}</span>
              <span v-else>••••••</span>
              <v-icon
                size="x-small"
                class="cursor-pointer ml-2"
                @click="showPelunasan = !showPelunasan"
              >
                {{ showPelunasan ? "mdi-eye-outline" : "mdi-eye-off" }}
              </v-icon>
            </strong>
            <!-- <strong v-else class="summary-value">
              Rp <span>••••••</span>
            </strong> -->
          </template>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-inner">
          <span class="summary-label">Terlewat</span>
          <div v-if="isLoading" class="skeleton skeleton-value shimmer"></div>
          <strong v-else class="summary-value">
            {{ totalTerlewatCount }} <span class="summary-unit">Doc</span>
          </strong>
        </div>
      </div>
    </section>

    <div v-if="isLoading">
      <section class="reminder-grid">
        <div
          v-for="n in 3"
          :key="'skeleton-' + n"
          class="compact-reminder-card"
        >
          <div class="card-indicator skeleton-indicator-shimmer"></div>
          <div class="card-body">
            <div class="main-info">
              <div class="skeleton skeleton-tag shimmer"></div>
              <div class="skeleton skeleton-title shimmer"></div>
            </div>
            <div class="date-info">
              <div class="data-group text-right">
                <div class="skeleton skeleton-price shimmer"></div>
                <div class="skeleton skeleton-badge-status shimmer"></div>
              </div>
            </div>
            <div class="action-zone">
              <div class="skeleton skeleton-btn-sm shimmer"></div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-else-if="invoiceLimited.length === 0" class="empty-state-compact">
      <svg
        class="empty-icon text-success"
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
        >Belum ada rekaman data invoice aktif saat ini.</span
      >
    </div>

    <div v-else>
      <section class="reminder-grid">
        <div
          v-for="item in invoiceLimited"
          :key="item.id"
          class="compact-reminder-card"
        >
          <div
            class="card-indicator"
            :class="getIndicatorClass(item.jatuhTempo)"
          ></div>

          <div class="card-body">
            <div class="main-info">
              <span class="category-tag">{{ item.no_inv || "-" }}</span>
              <h4 class="branch-title" :title="item.nama_perusahaan">
                {{ item.nama_perusahaan }}
                <span v-if="item.nama_cabang_perusahaan" class="branch-sub"
                  >({{ item.nama_cabang_perusahaan }})</span
                >
              </h4>
            </div>

            <div class="date-info">
              <div class="data-group text-right">
                <span class="data-value font-bold">{{
                  formatCurrency(item.grandtotal)
                }}</span>
                <span
                  class="data-status-badge"
                  :class="getTextColorClass(item.jatuhTempo)"
                >
                  {{ getTempoStatusText(item.jatuhTempo) }}
                </span>
              </div>
            </div>

            <div class="action-zone">
              <NuxtLink
                class="btn-action-sm"
                :to="`/admin/invoice`"
                title="Kelola"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <div class="action-footer">
        <NuxtLink to="/admin/invoice" class="btn-view-more">
          <span>Lihat Semua Daftar Invoice</span>
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

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.dashboard-container {
  border: 1px solid rgb(225, 225, 225);
  border-radius: 10px;
}

.dashboard-container.vertical-split {
  font-family: "Inter", sans-serif;
  color: #1e293b;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 1rem;
}

.dashboard-header {
  margin-bottom: 1rem;
}
.header-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.header-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.header-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}
.badge-info {
  background-color: #e0f2fe;
  color: #0369a1;
  border: 1px solid #bae6fd;
}
.header-subtitle {
  font-size: 0.775rem;
  color: #64748b;
  margin: 0.2rem 0 0 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.summary-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
}
.status-info {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.status-success {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.summary-inner {
  display: flex;
  flex-direction: column;
}
.summary-label {
  font-size: 0.55rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  white-space: nowrap;
}
.status-info .summary-label {
  color: #0369a1;
}
.status-success .summary-label {
  color: #16a34a;
}
.summary-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  margin-top: 0.125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.blurNominal {
  filter: blur(5px);
  user-select: none;
  transition: 0.2s ease;
}
.blurPelunasan {
  filter: blur(5px);
  user-select: none;
  transition: 0.2s ease;
}
.status-info .summary-value {
  color: #0284c7;
}
.status-success .summary-value {
  color: #15803d;
}
.summary-unit {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
}

.reminder-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.compact-reminder-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
}
.card-indicator {
  width: 4px;
  flex-shrink: 0;
}

.bg-danger {
  background-color: #ef4444;
}
.bg-warning-dark {
  background-color: #ea580c;
}
.bg-warning {
  background-color: #f59e0b;
}
.bg-info {
  background-color: #3b82f6;
}

.card-body {
  padding: 0.5rem 0.75rem;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
}

.main-info {
  flex: 1.2;
  min-width: 0;
}
.category-tag {
  font-size: 0.6rem;
  font-weight: 700;
  color: #64748b;
  display: block;
}
.branch-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0.05rem 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.branch-sub {
  font-weight: 400;
  color: #64748b;
}

.date-info {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  min-width: 0;
}
.data-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.15rem;
  min-width: 0;
}
.text-right {
  text-align: right;
}
.data-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
}

.data-status-badge {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.05rem 0.3rem;
  border-radius: 4px;
  white-space: nowrap;
}
.badge-danger {
  background: #fef2f2;
  color: #dc2626;
}
.badge-warning-dark {
  background: #fff7ed;
  color: #ea580c;
}
.badge-warning {
  background: #fffbeb;
  color: #d97706;
}
.badge-success {
  background: #f0fdf4;
  color: #16a34a;
}

.font-bold {
  font-weight: 600;
}

.action-zone {
  flex-shrink: 0;
}
.btn-action-sm {
  background: #f1f5f9;
  color: #334155;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  padding: 0.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-action-sm span {
  display: none;
}
.btn-action-sm:hover {
  background: #e2e8f0;
  color: #0f172a;
}
.btn-action-sm svg {
  width: 12px;
  height: 12px;
}

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
  color: #0f172a;
}
.btn-view-more svg {
  width: 12px;
  height: 12px;
}

.empty-state-compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
}
.empty-icon {
  width: 14px;
  height: 14px;
}
.empty-text {
  font-size: 0.75rem;
  color: #475569;
}

@media (max-width: 360px) {
  .card-body {
    gap: 0.25rem;
    padding: 0.5rem;
  }
  .branch-title {
    font-size: 0.75rem;
  }
  .data-value {
    font-size: 0.75rem;
  }
}

.skeleton {
  background: #e2e8f0;
  border-radius: 4px;
  display: inline-block;
}

.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 20%,
    rgba(255, 255, 255, 0.6) 60%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmerAnimation 2s infinite;
  content: "";
}

@keyframes shimmerAnimation {
  100% {
    transform: translateX(100%);
  }
}

.skeleton-badge {
  width: 55px;
  height: 15px;
}

.skeleton-value {
  width: 80%;
  height: 1.1rem;
  margin-top: 0.25rem;
}

.skeleton-indicator-shimmer {
  width: 4px;
  background: #cbd5e1;
  flex-shrink: 0;
}

.skeleton-tag {
  width: 70px;
  height: 0.6rem;
  margin-bottom: 0.25rem;
}

.skeleton-title {
  width: 140px;
  height: 0.8rem;
  display: block;
}

.skeleton-price {
  width: 85px;
  height: 0.8rem;
  margin-bottom: 0.25rem;
}

.skeleton-badge-status {
  width: 60px;
  height: 0.7rem;
}

.skeleton-btn-sm {
  width: 26px;
  height: 26px;
  border-radius: 6px;
}
</style>
