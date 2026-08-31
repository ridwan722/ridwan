<template>
  <v-card class="mx-auto rounded-lg shadow-sm border d-flex flex-column">
    <v-card-item class="py-3 px-4 flex-grow-0">
      <div class="d-flex justify-space-between align-center">
        <span class="text-subtitle-1 font-weight-bold text-grey-darken-3"
          >Status Invoice</span
        >
        <v-menu location="bottom end" density="compact">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              size="small"
              class="text-caption text-grey-darken-1 px-1"
              height="24"
            >
              {{ getActiveFilter.label }}
              <v-icon size="x-small" icon="mdi-chevron-down" class="ml-1" />
            </v-btn>
          </template>
          <v-list density="compact">
            <v-list-item
              v-for="filter in filterOptions"
              :key="filter.value"
              :title="filter.label"
              :value="filter.value"
              @click="activeFilter = filter.value"
              :active="activeFilter === filter.value"
            >
              <template v-slot:prepend>
                <v-icon size="small" :color="filter.color">
                  {{ filter.icon }}
                </v-icon>
              </template>
              <template v-slot:append v-if="activeFilter === filter.value">
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
          {{ getCountLabel }}
        </div>
        <div class="text-caption font-weight-bold" :class="getCountColor">
          {{ getFilteredCount }} / {{ totalInvoiceCount }}
        </div>
      </div>
      <v-progress-linear
        :model-value="getProgressPercentage"
        height="6"
        :color="getProgressColor"
        rounded
      />
    </div>

    <!-- Invoice List -->
    <div class="invoice-list-container">
      <div v-if="!hasInvoices" class="text-center py-6">
        <v-icon size="large" color="grey-lighten-1" class="mb-2"
          >mdi-file-document-outline</v-icon
        >
        <div class="text-body-2 text-grey">Tidak ada data invoice</div>
        <div class="text-caption text-grey mt-1">
          Data akan muncul setelah ada invoice
        </div>
      </div>

      <div v-else-if="filteredInvoices.length === 0" class="text-center py-6">
        <v-icon size="large" color="green-lighten-1" class="mb-2"
          >mdi-check-circle-outline</v-icon
        >
        <div class="text-body-2 text-grey">
          Tidak ada invoice {{ getActiveFilter.label.toLowerCase() }}
        </div>
        <div class="text-caption text-green-darken-1 mt-1">
          Semua invoice sudah diproses!
        </div>
      </div>

      <div v-else class="pa-0">
        <div
          v-for="invoice in displayedInvoices"
          :key="invoice.id"
          class="invoice-item py-3 px-4 border-b"
        >
          <div class="d-flex justify-space-between align-start mb-2">
            <div class="d-flex align-start" style="flex: 1">
              <v-icon
                size="small"
                :color="getInvoiceIconColor(invoice)"
                class="mr-2 mt-1"
              >
                {{ getInvoiceIcon(invoice) }}
              </v-icon>
              <div style="flex: 1">
                <div
                  class="text-body-2 font-weight-bold text-grey-darken-3 mb-1"
                >
                  {{ invoice.no_inv || "INV-" + invoice.id?.slice(0, 6) }}
                </div>
                <div class="text-caption text-grey-darken-1 text-truncate">
                  {{ invoice.nama_perusahaan }}
                </div>
                <div class="text-caption text-grey">
                  {{ invoice.nama_cabang_perusahaan }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-body-2 font-weight-bold text-grey-darken-3">
                Rp {{ formatCurrency(invoice.total) }}
              </div>
              <div class="text-caption" :class="getDateClass(invoice)">
                {{ getDateLabel(invoice) }}
              </div>
            </div>
          </div>

          <div class="d-flex justify-space-between align-center mt-2">
            <v-chip
              :color="getStatusColor(invoice.status)"
              size="x-small"
              class="font-weight-medium px-2"
              variant="flat"
              label
            >
              {{ getStatusLabel(invoice.status) }}
            </v-chip>
            <div
              class="text-caption font-weight-medium"
              :class="getActionColor(invoice)"
            >
              {{ getActionLabel(invoice) }}
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
        @click="viewAllInvoices"
        class="text-capitalize"
      >
        Lihat Semua
      </v-btn>
      <v-spacer />
      <div class="text-caption text-grey">
        {{ displayedInvoices.length }} dari
        {{ filteredInvoices.length }} ditampilkan
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

// Store
const invoiceStore = useInvoiceStore();
const router = useRouter();

// State
const activeFilter = ref("jatuh_tempo"); // 'jatuh_tempo', 'terbaru', 'draft', 'disetujui'

// Filter options
const filterOptions = ref([
  {
    label: "Jatuh Tempo",
    value: "jatuh_tempo",
    icon: "mdi-calendar-clock",
    color: "#F44336",
  },
  {
    label: "Terbaru",
    value: "terbaru",
    icon: "mdi-clock-outline",
    color: "#2196F3",
  },
  {
    label: "Draft",
    value: "draft",
    icon: "mdi-file-edit-outline",
    color: "#9E9E9E",
  },
  {
    label: "Disetujui",
    value: "disetujui",
    icon: "mdi-check-circle-outline",
    color: "#4CAF50",
  },
  {
    label: "Dikirim",
    value: "dikirim",
    icon: "mdi-send-outline",
    color: "#FF9800",
  },
]);

// Computed
const getActiveFilter = computed(() => {
  return (
    filterOptions.value.find((f) => f.value === activeFilter.value) ||
    filterOptions.value[0]
  );
});

const getCountLabel = computed(() => {
  const filter = getActiveFilter.value;
  return `${filter.label} Tersisa`;
});

const getCountColor = computed(() => {
  const percentage = getProgressPercentage.value;
  if (percentage >= 80) return "text-success";
  if (percentage >= 50) return "text-warning";
  return "text-error";
});

const getProgressColor = computed(() => {
  const percentage = getProgressPercentage.value;
  if (percentage >= 80) return "success";
  if (percentage >= 50) return "warning";
  return "error";
});

const hasInvoices = computed(() => {
  return invoiceStore?.dataInvoice?.length > 0;
});

const totalInvoiceCount = computed(() => {
  return invoiceStore?.dataInvoice?.length || 0;
});

// Filter invoices
const filteredInvoices = computed(() => {
  if (!hasInvoices.value) return [];

  const invoices = invoiceStore.dataInvoice;

  switch (activeFilter.value) {
    case "jatuh_tempo":
      // Invoice yang belum selesai dan jatuh tempo dalam 14 hari
      const today = new Date();
      const fourteenDaysFromNow = new Date();
      fourteenDaysFromNow.setDate(today.getDate() + 14);

      return invoices
        .filter((invoice) => {
          try {
            if (!invoice.jatuhTempo) return false;

            const dueDate = new Date(invoice.jatuhTempo);
            if (isNaN(dueDate.getTime())) return false;

            const isUnpaid = !["selesai", "paid"].includes(
              invoice.status?.toLowerCase()
            );
            const isDueSoon = dueDate <= fourteenDaysFromNow;

            return isUnpaid && isDueSoon;
          } catch (error) {
            return false;
          }
        })
        .sort((a, b) => new Date(a.jatuhTempo) - new Date(b.jatuhTempo));

    case "terbaru":
      // Invoice terbaru (createdAt terbaru)
      return [...invoices]
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .slice(0, 10);

    case "draft":
      // Invoice dengan status draft
      return invoices
        .filter((invoice) => invoice.status?.toLowerCase() === "draft")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    case "disetujui":
      // Invoice dengan status disetujui
      return invoices
        .filter((invoice) => invoice.status?.toLowerCase() === "disetujui")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    case "dikirim":
      // Invoice dengan status dikirim
      return invoices
        .filter((invoice) => invoice.status?.toLowerCase() === "dikirim")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    default:
      return invoices;
  }
});

const getFilteredCount = computed(() => {
  return filteredInvoices.value.length;
});

const getProgressPercentage = computed(() => {
  const total = totalInvoiceCount.value;
  const filtered = getFilteredCount.value;

  if (total === 0) return 0;

  // Untuk "Jatuh Tempo", progress adalah % yang BELUM jatuh tempo
  // Untuk lainnya, progress adalah % yang sesuai dengan filter
  if (activeFilter.value === "jatuh_tempo") {
    const overdueCount = filteredInvoices.value.filter((invoice) => {
      try {
        if (!invoice.jatuhTempo) return false;
        const dueDate = new Date(invoice.jatuhTempo);
        return dueDate < new Date();
      } catch {
        return false;
      }
    }).length;

    return Math.round((overdueCount / total) * 100);
  }

  return Math.round((filtered / total) * 100);
});

const displayedInvoices = computed(() => {
  return filteredInvoices.value.slice(0, 4); // Tampilkan 4 item saja
});

// Helper functions
function getInvoiceIcon(invoice) {
  const status = invoice.status?.toLowerCase();

  if (activeFilter.value === "jatuh_tempo") {
    try {
      if (!invoice.jatuhTempo) return "mdi-calendar-question";

      const dueDate = new Date(invoice.jatuhTempo);
      const today = new Date();

      if (dueDate < today) return "mdi-alert-circle-outline";
      if (dueDate.getDate() === today.getDate()) return "mdi-calendar-today";
      return "mdi-calendar-clock";
    } catch {
      return "mdi-calendar";
    }
  }

  switch (status) {
    case "draft":
      return "mdi-file-edit-outline";
    case "disetujui":
      return "mdi-check-circle-outline";
    case "dikirim":
      return "mdi-send-outline";
    case "selesai":
    case "paid":
      return "mdi-check-circle";
    default:
      return "mdi-file-document-outline";
  }
}

function getInvoiceIconColor(invoice) {
  const status = invoice.status?.toLowerCase();

  if (activeFilter.value === "jatuh_tempo") {
    try {
      if (!invoice.jatuhTempo) return "grey";

      const dueDate = new Date(invoice.jatuhTempo);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "error";
      if (diffDays <= 3) return "warning";
      if (diffDays <= 7) return "orange";
      return "primary";
    } catch {
      return "grey";
    }
  }

  switch (status) {
    case "draft":
      return "grey";
    case "disetujui":
      return "success";
    case "dikirim":
      return "warning";
    case "selesai":
    case "paid":
      return "green";
    default:
      return "blue";
  }
}

function getStatusLabel(status) {
  const statusMap = {
    draft: "Draft",
    disetujui: "Disetujui",
    dikirim: "Dikirim",
    selesai: "Dibayar",
    paid: "Dibayar",
  };

  return statusMap[status?.toLowerCase()] || status || "Unknown";
}

function getStatusColor(status) {
  const statusLower = status?.toLowerCase();

  switch (statusLower) {
    case "draft":
      return "grey-lighten-3 text-grey-darken-2";
    case "disetujui":
      return "blue-lighten-5 text-blue-darken-2";
    case "dikirim":
      return "orange-lighten-5 text-orange-darken-2";
    case "selesai":
    case "paid":
      return "green-lighten-5 text-green-darken-2";
    default:
      return "red-lighten-5 text-red-darken-1";
  }
}

function getDateLabel(invoice) {
  if (activeFilter.value === "jatuh_tempo") {
    if (!invoice.jatuhTempo) return "-";

    try {
      const dueDate = new Date(invoice.jatuhTempo);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return `${Math.abs(diffDays)} hari lewat`;
      if (diffDays === 0) return "Hari ini";
      if (diffDays === 1) return "Besok";
      return `${diffDays} hari lagi`;
    } catch {
      return formatDate(invoice.jatuhTempo);
    }
  } else {
    return formatDate(invoice.tanggal);
  }
}

function getDateClass(invoice) {
  if (activeFilter.value === "jatuh_tempo") {
    if (!invoice.jatuhTempo) return "text-grey";

    try {
      const dueDate = new Date(invoice.jatuhTempo);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "text-error font-weight-bold";
      if (diffDays <= 3) return "text-warning font-weight-medium";
      return "text-grey-darken-1";
    } catch {
      return "text-grey";
    }
  }

  return "text-grey-darken-1";
}

function getActionLabel(invoice) {
  const status = invoice.status?.toLowerCase();

  switch (status) {
    case "draft":
      return "Perlu Review";
    case "disetujui":
      return "Kirim Invoice";
    case "dikirim":
      return "Follow Up";
    case "selesai":
    case "paid":
      return "Selesai";
    default:
      return "Perlu Aksi";
  }
}

function getActionColor(invoice) {
  const status = invoice.status?.toLowerCase();

  switch (status) {
    case "draft":
      return "text-warning";
    case "disetujui":
      return "text-primary";
    case "dikirim":
      return "text-orange";
    default:
      return "text-grey";
  }
}

function formatDate(dateString) {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  } catch (error) {
    return "-";
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
function viewAllInvoices() {
  router.push("/admin/invoice");
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

.invoice-list-container {
  max-height: 300px;
  overflow-y: auto;
  flex: 1;
}

.invoice-item {
  transition: background-color 0.2s;
}
.invoice-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
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
</style>
