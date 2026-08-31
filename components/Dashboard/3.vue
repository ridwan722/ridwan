<template>
  <v-card class="mx-auto rounded-lg shadow-sm border d-flex flex-column">
    <v-card-item class="py-3 px-4 flex-grow-0">
      <div class="d-flex justify-space-between align-center">
        <span class="text-subtitle-1 font-weight-bold text-grey-darken-3">
          Pekerjaan Terbaru
        </span>
        <v-menu location="bottom end" density="compact">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              size="small"
              class="text-caption text-grey-darken-1 px-1"
              height="24"
            >
              {{ getTimeFilterLabel }}
              <v-icon size="x-small" icon="mdi-chevron-down" class="ml-1" />
            </v-btn>
          </template>
          <v-list density="compact">
            <v-list-item
              v-for="filter in timeFilterOptions"
              :key="filter.value"
              :title="filter.label"
              :value="filter.value"
              @click="activeTimeFilter = filter.value"
              :active="activeTimeFilter === filter.value"
            >
              <template v-slot:prepend>
                <v-icon size="small" :color="filter.color">
                  {{ filter.icon }}
                </v-icon>
              </template>
              <template v-slot:append v-if="activeTimeFilter === filter.value">
                <v-icon size="small" color="primary">mdi-check</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card-item>

    <v-divider />

    <!-- Stats Summary -->
    <div class="py-3 px-4 bg-grey-lighten-5 border-b">
      <div class="d-flex justify-space-between align-center mb-2">
        <div class="text-caption font-weight-medium text-grey-darken-2">
          Pekerjaan {{ getTimeFilterLabel.toLowerCase() }}
        </div>
        <div class="text-caption font-weight-bold" :class="getStatsColor">
          {{ filteredItems.length }} item
        </div>
      </div>
      <div class="d-flex align-center">
        <div class="flex-grow-1">
          <div class="d-flex justify-space-between text-caption mb-1">
            <span class="text-grey-darken-1">Progress</span>
            <span class="font-weight-bold"
              >{{ getStatusStats.active }} aktif</span
            >
          </div>
          <v-progress-linear
            :model-value="getProgressPercentage"
            height="6"
            :color="getProgressColor"
            rounded
          />
        </div>
        <div class="text-right ml-3">
          <div class="text-caption font-weight-bold text-grey-darken-3">
            {{ getStatusStats.total }}
          </div>
          <div class="text-caption text-grey">total</div>
        </div>
      </div>
    </div>

    <!-- Pekerjaan List -->
    <div class="pekerjaan-list-container">
      <div v-if="!hasData" class="text-center py-6">
        <v-icon size="large" color="grey-lighten-1" class="mb-2"
          >mdi-briefcase-outline</v-icon
        >
        <div class="text-body-2 text-grey">Tidak ada data pekerjaan</div>
        <div class="text-caption text-grey mt-1">
          Data akan muncul setelah ada pekerjaan ditambahkan
        </div>
      </div>

      <div v-else-if="filteredItems.length === 0" class="text-center py-6">
        <v-icon size="large" color="green-lighten-1" class="mb-2"
          >mdi-check-circle-outline</v-icon
        >
        <div class="text-body-2 text-grey">
          Tidak ada pekerjaan {{ getTimeFilterLabel.toLowerCase() }}
        </div>
        <div class="text-caption text-green-darken-1 mt-1">
          Semua pekerjaan sudah diproses!
        </div>
      </div>

      <div v-else class="pa-0">
        <div
          v-for="item in displayedItems"
          :key="item.id"
          class="pekerjaan-item py-3 px-4 border-b"
          @click="viewItemDetail(item)"
        >
          <div class="d-flex justify-space-between align-start mb-2">
            <div class="d-flex align-start" style="flex: 1">
              <div class="date-badge mr-3">
                <div
                  class="day text-center font-weight-bold text-grey-darken-3"
                >
                  {{ formatDay(item.createdAt) }}
                </div>
                <div
                  class="month text-center text-caption font-weight-medium text-grey-darken-1"
                >
                  {{ formatMonth(item.createdAt) }}
                </div>
              </div>
              <div style="flex: 1">
                <div
                  class="text-body-2 font-weight-bold text-grey-darken-3 mb-1"
                >
                  {{ item.nama_kategori_item || "Pekerjaan tanpa nama" }}
                </div>
                <div class="text-caption text-grey-darken-1 text-truncate">
                  {{ item.nama_perusahaan }}
                </div>
                <div class="text-caption text-grey">
                  {{ item.nama_cabang }} • {{ item.nama_kategori_object }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div
                class="text-body-2 font-weight-bold text-grey-darken-3"
                v-if="item.nominal"
              >
                Rp {{ formatCurrency(item.nominal) }}
              </div>
              <div v-else class="text-body-2 text-grey">-</div>
              <div class="text-caption text-grey">
                {{ formatTimeAgo(item.createdAt) }}
              </div>
            </div>
          </div>

          <div class="d-flex justify-space-between align-center mt-2">
            <div>
              <v-chip
                :color="getStatusColor(item.status)"
                size="x-small"
                class="font-weight-medium px-2 mr-2"
                variant="flat"
                label
              >
                {{ getStatusLabel(item.status) }}
              </v-chip>
              <v-chip
                v-if="item.periode"
                size="x-small"
                :color="getPeriodColor(item.periode)"
                class="font-weight-medium px-2"
                variant="outlined"
                label
              >
                {{ formatPeriod(item.periode) }}
              </v-chip>
            </div>
            <div
              class="text-caption font-weight-medium"
              :class="getActionColor(item)"
            >
              {{ getActionLabel(item) }}
            </div>
          </div>

          <!-- Dokumen info -->
          <div v-if="item.dokumen && item.dokumen.length > 0" class="mt-2">
            <div class="d-flex align-center">
              <v-icon size="small" color="blue" class="mr-1"
                >mdi-file-multiple</v-icon
              >
              <span class="text-caption text-blue-darken-1">
                {{ item.dokumen.length }} dokumen
              </span>
              <v-chip
                v-for="(doc, idx) in item.dokumen.slice(0, 2)"
                :key="idx"
                size="x-small"
                class="ml-1"
                variant="tonal"
              >
                {{ doc.nama_dokumen }}
              </v-chip>
              <span
                v-if="item.dokumen.length > 2"
                class="text-caption text-grey ml-1"
              >
                +{{ item.dokumen.length - 2 }} lainnya
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <v-card-actions class="px-4 py-3 border-t bg-grey-lighten-5 flex-grow-0">
      <v-btn
        variant="text"
        color="primary"
        size="small"
        prepend-icon="mdi-eye-outline"
        @click="viewAllItems"
        class="text-capitalize"
      >
        Lihat Semua
      </v-btn>
      <v-spacer />
      <div class="text-caption text-grey">
        {{ displayedItems.length }} dari {{ filteredItems.length }} ditampilkan
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useMasterKategoriStore } from "~/stores/master/kategoriStore";

// Store
const kategoriStore = useMasterKategoriStore();
const router = useRouter();

// State
const activeTimeFilter = ref("today"); // 'today', 'week', 'month', 'all'

// Time filter options
const timeFilterOptions = ref([
  {
    label: "Hari Ini",
    value: "today",
    icon: "mdi-calendar-today",
    color: "#2196F3",
  },
  {
    label: "Minggu Ini",
    value: "week",
    icon: "mdi-calendar-week",
    color: "#4CAF50",
  },
  {
    label: "Bulan Ini",
    value: "month",
    icon: "mdi-calendar-month",
    color: "#FF9800",
  },
  {
    label: "Semua",
    value: "all",
    icon: "mdi-calendar",
    color: "#9E9E9E",
  },
]);

// Computed
const getTimeFilterLabel = computed(() => {
  return (
    timeFilterOptions.value.find((f) => f.value === activeTimeFilter.value)
      ?.label || "Hari Ini"
  );
});

const getStatsColor = computed(() => {
  const count = filteredItems.value.length;
  if (count === 0) return "text-grey";
  if (count <= 3) return "text-success";
  if (count <= 10) return "text-warning";
  return "text-error";
});

const getProgressColor = computed(() => {
  const percentage = getProgressPercentage.value;
  if (percentage >= 80) return "success";
  if (percentage >= 50) return "warning";
  return "error";
});

const hasData = computed(() => {
  return kategoriStore?.dataItemKategori?.length > 0;
});

// Filter items berdasarkan waktu
const filteredItems = computed(() => {
  if (!hasData.value) return [];

  const items = kategoriStore.dataItemKategori;
  const now = new Date();

  switch (activeTimeFilter.value) {
    case "today":
      // Item dibuat hari ini
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const todayEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      return items
        .filter((item) => {
          const createdAt = new Date(item.createdAt * 1000);
          return createdAt >= todayStart && createdAt < todayEnd;
        })
        .sort((a, b) => b.createdAt - a.createdAt);

    case "week":
      // Item dibuat dalam 7 hari terakhir
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return items
        .filter((item) => {
          const createdAt = new Date(item.createdAt * 1000);
          return createdAt >= weekAgo;
        })
        .sort((a, b) => b.createdAt - a.createdAt);

    case "month":
      // Item dibuat dalam 30 hari terakhir
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return items
        .filter((item) => {
          const createdAt = new Date(item.createdAt * 1000);
          return createdAt >= monthAgo;
        })
        .sort((a, b) => b.createdAt - a.createdAt);

    case "all":
      // Semua item, diurutkan dari terbaru
      return [...items].sort((a, b) => b.createdAt - a.createdAt);

    default:
      return [];
  }
});

const displayedItems = computed(() => {
  return filteredItems.value.slice(0, 4); // Tampilkan 4 item saja
});

const getStatusStats = computed(() => {
  const items = filteredItems.value;
  const active = items.filter(
    (item) =>
      item.status?.toLowerCase().includes("progress") ||
      item.status === "On Progres"
  ).length;

  return {
    total: items.length,
    active: active,
    completed: items.length - active,
  };
});

const getProgressPercentage = computed(() => {
  const total = getStatusStats.value.total;
  const completed = getStatusStats.value.completed;

  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
});

// Helper functions
function getStatusLabel(status) {
  const statusMap = {
    "on progres": "On Progress",
    "on progress": "On Progress",
    penawaran: "Penawaran",
    invoice: "Invoice",
    selesai: "Selesai",
    completed: "Selesai",
  };

  return statusMap[status?.toLowerCase()] || status || "Draft";
}

function getStatusColor(status) {
  const statusLower = status?.toLowerCase();

  switch (statusLower) {
    case "on progres":
    case "on progress":
      return "blue-lighten-5 text-blue-darken-2";
    case "penawaran":
      return "orange-lighten-5 text-orange-darken-2";
    case "invoice":
      return "purple-lighten-5 text-purple-darken-2";
    case "selesai":
    case "completed":
      return "green-lighten-5 text-green-darken-2";
    default:
      return "grey-lighten-3 text-grey-darken-2";
  }
}

function getPeriodColor(periode) {
  if (!periode || !periode.selesai) return "grey";

  try {
    const endDate = new Date(periode.selesai);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "red";
    if (diffDays <= 7) return "orange";
    if (diffDays <= 30) return "yellow";
    return "green";
  } catch {
    return "grey";
  }
}

function getActionLabel(item) {
  const status = item.status?.toLowerCase();

  switch (status) {
    case "on progres":
    case "on progress":
      return "Buat Penawaran";
    case "penawaran":
      return "Buat Invoice";
    case "invoice":
      return "Follow Up";
    case "selesai":
    case "completed":
      return "Selesai";
    default:
      return "Review";
  }
}

function getActionColor(item) {
  const status = item.status?.toLowerCase();

  switch (status) {
    case "on progres":
    case "on progress":
      return "text-primary";
    case "penawaran":
      return "text-orange";
    case "invoice":
      return "text-purple";
    case "selesai":
    case "completed":
      return "text-success";
    default:
      return "text-grey";
  }
}

function formatDay(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.getDate().toString().padStart(2, "0");
}

function formatMonth(timestamp) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const date = new Date(timestamp * 1000);
  return months[date.getMonth()];
}

function formatTimeAgo(timestamp) {
  const now = new Date();
  const date = new Date(timestamp * 1000);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

function formatPeriod(periode) {
  if (!periode || !periode.selesai) return "Tidak ada periode";

  try {
    const endDate = new Date(periode.selesai);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} hari lewat`;
    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Besok";
    if (diffDays <= 7) return `${diffDays} hari`;
    return endDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return "Invalid date";
  }
}

function formatCurrency(value) {
  if (!value && value !== 0) return "0";

  const numValue = Number(value);
  if (isNaN(numValue)) return "0";

  if (numValue >= 1000000000) {
    return (numValue / 1000000000).toFixed(1).replace(".", ",") + "M";
  } else if (numValue >= 1000000) {
    return (numValue / 1000000).toFixed(1).replace(".", ",") + "JT";
  } else if (numValue >= 1000) {
    return (numValue / 1000).toFixed(1).replace(".", ",") + "RB";
  } else {
    return Math.round(numValue).toLocaleString("id-ID");
  }
}

// Navigation
function viewItemDetail(item) {
  router.push(`/admin/master/kategori/item/${item.id}`);
}

function viewAllItems() {
  router.push("/admin/master/kategori/item");
}
</script>

<style scoped>
.border {
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.pekerjaan-list-container {
  max-height: 300px;
  overflow-y: auto;
  flex: 1;
}

.pekerjaan-item {
  transition: background-color 0.2s;
  cursor: pointer;
}
.pekerjaan-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.date-badge {
  width: 40px;
  min-width: 40px;
  background: #f5f5f5;
  border-radius: 6px;
  padding: 6px 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.date-badge .day {
  font-size: 14px;
  line-height: 1;
}
.date-badge .month {
  font-size: 10px;
  line-height: 1.2;
  margin-top: 2px;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.text-error {
  color: #f44336 !important;
}
.text-warning {
  color: #ff9800 !important;
}
.text-success {
  color: #4caf50 !important;
}
.text-primary {
  color: #2196f3 !important;
}
.text-orange {
  color: #ff5722 !important;
}
.text-purple {
  color: #9c27b0 !important;
}

/* Custom scrollbar */
.pekerjaan-list-container::-webkit-scrollbar {
  width: 6px;
}
.pekerjaan-list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.pekerjaan-list-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
.pekerjaan-list-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
