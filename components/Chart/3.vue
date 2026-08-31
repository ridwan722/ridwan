<template>
  <v-card class="mx-auto rounded-lg shadow-sm d-flex flex-column" elevation="2">
    <v-card-item class="py-2 px-3 flex-grow-0">
      <div class="d-flex justify-space-between align-center">
        <span class="text-subtitle-2 font-weight-bold">{{
          getChartTitle
        }}</span>

        <v-menu location="bottom end" density="compact">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              size="small"
              class="text-caption text-grey-darken-1 px-1"
              height="24"
            >
              {{ getFilterLabel }}
              <v-icon size="x-small" icon="mdi-chevron-down" class="ml-1" />
            </v-btn>
          </template>
          <v-list density="compact">
            <!-- Tahun Filter -->
            <v-list-subheader>Tahun</v-list-subheader>
            <v-list-item
              v-for="year in yearOptions"
              :key="`year-${year}`"
              :title="'Tahun ' + year"
              :value="year"
              @click="handleYearSelect(year)"
              :active="currentYear === year"
            >
              <template v-slot:prepend>
                <v-icon
                  v-if="currentYear === year"
                  size="small"
                  color="primary"
                >
                  mdi-check
                </v-icon>
              </template>
            </v-list-item>

            <v-divider class="my-1" />

            <!-- Data Type Filter -->
            <v-list-subheader>Tipe Data</v-list-subheader>
            <v-list-item
              v-for="type in dataTypes"
              :key="`type-${type.value}`"
              :title="type.label"
              :value="type.value"
              @click="handleDataTypeSelect(type.value)"
              :active="selectedDataType === type.value"
            >
              <template v-slot:prepend>
                <v-icon size="small" :color="type.color">
                  {{ type.icon }}
                </v-icon>
              </template>
              <template v-slot:append v-if="selectedDataType === type.value">
                <v-icon size="small" color="primary">mdi-check</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card-item>

    <v-divider />

    <!-- Quick Stats -->
    <v-row no-gutters class="border-b">
      <v-col cols="4" class="border-e pa-2 text-center">
        <div class="text-subtitle-2 font-weight-bold" :class="getTotalColor">
          {{ formatCurrency(getTotalValue) }}
        </div>
        <div
          style="font-size: 0.65rem"
          class="text-grey-darken-1 text-uppercase font-weight-bold"
        >
          {{ getTotalLabel }}
        </div>
      </v-col>

      <v-col cols="4" class="border-e pa-2 text-center">
        <div class="text-subtitle-2 font-weight-bold text-warning">
          {{ getCountValue }}
        </div>
        <div
          style="font-size: 0.65rem"
          class="text-grey-darken-1 text-uppercase font-weight-bold"
        >
          {{ getCountLabel }}
        </div>
      </v-col>

      <v-col cols="4" class="pa-2 text-center">
        <div class="text-subtitle-2 font-weight-bold" :class="growthClass">
          {{ growthPercentage }}%
        </div>
        <div
          style="font-size: 0.65rem"
          class="text-grey-darken-1 text-uppercase font-weight-bold"
        >
          {{ getGrowthLabel }}
        </div>
      </v-col>
    </v-row>

    <!-- Chart Area -->
    <v-card-text class="pa-3 flex-grow-1 d-flex align-center">
      <div
        v-if="!hasData"
        style="height: 200px; width: 100%"
        class="d-flex align-center justify-center text-grey"
      >
        <div class="text-center">
          <v-icon size="large" class="mb-2">mdi-chart-line</v-icon>
          <div>Tidak ada data penawaran atau invoice</div>
          <div class="text-caption mt-1">
            Data akan muncul setelah ada penawaran atau invoice
          </div>
        </div>
      </div>
      <div v-else style="height: 200px; width: 100%; position: relative">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </v-card-text>

    <!-- Legend -->
    <v-card-actions
      class="pa-2 border-t d-flex justify-center bg-grey-lighten-5 flex-grow-0"
    >
      <div
        v-for="item in legendItems"
        :key="item.label"
        class="d-flex align-center mx-2"
      >
        <div
          :style="{ backgroundColor: item.color }"
          class="legend-dot mr-1"
        ></div>
        <span
          style="font-size: 0.7rem"
          class="font-weight-bold text-grey-darken-2"
        >
          {{ item.label }}
        </span>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";
import { computed, ref, watch, onMounted } from "vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

// Store imports
const invoiceStore = useInvoiceStore();
const penawaranStore = usePenawaranStore();

// State
const currentYear = ref(new Date().getFullYear());
const selectedDataType = ref("both"); // 'invoice', 'penawaran', or 'both'

// Data untuk menu
const yearOptions = ref([
  currentYear.value,
  currentYear.value - 1,
  currentYear.value - 2,
  currentYear.value - 3,
]);

const dataTypes = ref([
  {
    label: "Invoice",
    value: "invoice",
    icon: "mdi-currency-usd",
    color: "#4CAF50",
  },
  {
    label: "Penawaran",
    value: "penawaran",
    icon: "mdi-file-document-outline",
    color: "#2196F3",
  },
  {
    label: "Keduanya",
    value: "both",
    icon: "mdi-chart-multiple",
    color: "#9C27B0",
  },
]);

// Computed untuk UI
const getChartTitle = computed(() => {
  if (selectedDataType.value === "invoice") return "Trend Invoice";
  if (selectedDataType.value === "penawaran") return "Trend Penawaran";
  return "Perbandingan Invoice & Penawaran";
});

const getFilterLabel = computed(() => {
  return `Tahun ${currentYear.value}`;
});

const getTotalLabel = computed(() => {
  if (selectedDataType.value === "invoice") return "Total Invoice";
  if (selectedDataType.value === "penawaran") return "Total Penawaran";
  return "Total Keseluruhan";
});

const getCountLabel = computed(() => {
  if (selectedDataType.value === "invoice") return "Jumlah Invoice";
  if (selectedDataType.value === "penawaran") return "Jumlah Penawaran";
  return "Total Transaksi";
});

const getGrowthLabel = computed(() => {
  return "Pertumbuhan";
});

const getTotalColor = computed(() => {
  if (selectedDataType.value === "invoice") return "text-success";
  if (selectedDataType.value === "penawaran") return "text-primary";
  return "text-info";
});

// Data computations
const hasData = computed(() => {
  return (
    invoiceStore?.dataInvoice?.length > 0 ||
    penawaranStore?.dataPenawaran?.length > 0
  );
});

// Mengambil data bulanan untuk invoice dan penawaran
const getMonthlyData = computed(() => {
  const invoiceData = Array(12).fill(0);
  const penawaranData = Array(12).fill(0);
  const invoiceCount = Array(12).fill(0);
  const penawaranCount = Array(12).fill(0);

  let totalInvoice = 0;
  let totalPenawaran = 0;
  let countInvoice = 0;
  let countPenawaran = 0;

  // Proses data invoice
  if (invoiceStore?.dataInvoice?.length) {
    invoiceStore.dataInvoice.forEach((item) => {
      try {
        if (!item.tanggal) return;

        const itemDate = new Date(item.tanggal);
        if (isNaN(itemDate.getTime())) return;

        if (itemDate.getFullYear() === currentYear.value) {
          const month = itemDate.getMonth();
          const value = item.total || 0;

          invoiceData[month] += value;
          invoiceCount[month]++;
          totalInvoice += value;
          countInvoice++;
        }
      } catch (error) {
        console.error("Error processing invoice data:", error);
      }
    });
  }

  // Proses data penawaran
  if (penawaranStore?.dataPenawaran?.length) {
    penawaranStore.dataPenawaran.forEach((item) => {
      try {
        if (!item.tanggal) return;

        const itemDate = new Date(item.tanggal);
        if (isNaN(itemDate.getTime())) return;

        if (itemDate.getFullYear() === currentYear.value) {
          const month = itemDate.getMonth();
          const value = item.total || 0;

          penawaranData[month] += value;
          penawaranCount[month]++;
          totalPenawaran += value;
          countPenawaran++;
        }
      } catch (error) {
        console.error("Error processing penawaran data:", error);
      }
    });
  }

  return {
    invoice: {
      values: invoiceData,
      counts: invoiceCount,
      total: totalInvoice,
      count: countInvoice,
    },
    penawaran: {
      values: penawaranData,
      counts: penawaranCount,
      total: totalPenawaran,
      count: countPenawaran,
    },
  };
});

// Untuk quick stats
const getTotalValue = computed(() => {
  const data = getMonthlyData.value;
  if (selectedDataType.value === "invoice") return data.invoice.total;
  if (selectedDataType.value === "penawaran") return data.penawaran.total;
  return data.invoice.total + data.penawaran.total;
});

const getCountValue = computed(() => {
  const data = getMonthlyData.value;
  if (selectedDataType.value === "invoice") return data.invoice.count;
  if (selectedDataType.value === "penawaran") return data.penawaran.count;
  return data.invoice.count + data.penawaran.count;
});

const growthPercentage = computed(() => {
  const currentData = getMonthlyData.value;

  if (selectedDataType.value === "invoice") {
    const currentTotal = currentData.invoice.total;
    if (currentTotal === 0) return 0;

    // Hitung pertumbuhan dari bulan sebelumnya (sederhana)
    const currentMonth = new Date().getMonth();
    const prevMonth = currentMonth > 0 ? currentMonth - 1 : 11;
    const currentMonthValue = currentData.invoice.values[currentMonth] || 0;
    const prevMonthValue = currentData.invoice.values[prevMonth] || 0;

    if (prevMonthValue === 0) return 100;
    return (
      ((currentMonthValue - prevMonthValue) / prevMonthValue) *
      100
    ).toFixed(1);
  }

  if (selectedDataType.value === "penawaran") {
    const currentTotal = currentData.penawaran.total;
    if (currentTotal === 0) return 0;

    // Hitung pertumbuhan dari bulan sebelumnya
    const currentMonth = new Date().getMonth();
    const prevMonth = currentMonth > 0 ? currentMonth - 1 : 11;
    const currentMonthValue = currentData.penawaran.values[currentMonth] || 0;
    const prevMonthValue = currentData.penawaran.values[prevMonth] || 0;

    if (prevMonthValue === 0) return 100;
    return (
      ((currentMonthValue - prevMonthValue) / prevMonthValue) *
      100
    ).toFixed(1);
  }

  // Untuk "both", hitung pertumbuhan total
  const currentTotal = currentData.invoice.total + currentData.penawaran.total;
  if (currentTotal === 0) return 0;

  // Hitung pertumbuhan dari bulan sebelumnya
  const currentMonth = new Date().getMonth();
  const prevMonth = currentMonth > 0 ? currentMonth - 1 : 11;

  const currentMonthInvoice = currentData.invoice.values[currentMonth] || 0;
  const currentMonthPenawaran = currentData.penawaran.values[currentMonth] || 0;
  const currentMonthTotal = currentMonthInvoice + currentMonthPenawaran;

  const prevMonthInvoice = currentData.invoice.values[prevMonth] || 0;
  const prevMonthPenawaran = currentData.penawaran.values[prevMonth] || 0;
  const prevMonthTotal = prevMonthInvoice + prevMonthPenawaran;

  if (prevMonthTotal === 0) return 100;
  return (
    ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) *
    100
  ).toFixed(1);
});

const growthClass = computed(() => {
  const growth = parseFloat(growthPercentage.value);
  return growth >= 0 ? "text-success" : "text-error";
});

// Chart data
const chartData = computed(() => {
  const monthlyData = getMonthlyData.value;

  // Konversi ke juta (JT) untuk display
  const invoiceDataInJT = monthlyData.invoice.values.map(
    (val) => val / 1000000
  );
  const penawaranDataInJT = monthlyData.penawaran.values.map(
    (val) => val / 1000000
  );

  const labels = [
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

  const datasets = [];

  // Tambahkan dataset berdasarkan tipe data yang dipilih
  if (
    selectedDataType.value === "invoice" ||
    selectedDataType.value === "both"
  ) {
    datasets.push({
      label: "Invoice (Rp)",
      data: invoiceDataInJT,
      borderColor: "#4CAF50",
      backgroundColor: "rgba(76, 175, 80, 0.1)",
      fill: selectedDataType.value === "invoice",
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: "#4CAF50",
      pointBorderColor: "#fff",
      pointBorderWidth: 1,
      borderWidth: 2,
    });
  }

  if (
    selectedDataType.value === "penawaran" ||
    selectedDataType.value === "both"
  ) {
    datasets.push({
      label: "Penawaran (Rp)",
      data: penawaranDataInJT,
      borderColor: "#2196F3",
      backgroundColor: "rgba(33, 150, 243, 0.1)",
      fill: selectedDataType.value === "penawaran",
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: "#2196F3",
      pointBorderColor: "#fff",
      pointBorderWidth: 1,
      borderWidth: 2,
    });
  }

  // Jika tidak ada data, beri contoh data dummy untuk demo
  const hasAnyData =
    invoiceDataInJT.some((val) => val > 0) ||
    penawaranDataInJT.some((val) => val > 0);

  if (!hasAnyData && hasData.value) {
    // Data dummy untuk demo
    if (
      selectedDataType.value === "invoice" ||
      selectedDataType.value === "both"
    ) {
      datasets[0].data = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
    }
    if (
      selectedDataType.value === "penawaran" ||
      selectedDataType.value === "both"
    ) {
      const penawaranIndex = datasets.length - 1;
      datasets[penawaranIndex].data = [
        1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23,
      ];
    }
  }

  return {
    labels: labels,
    datasets: datasets,
  };
});

const legendItems = computed(() => {
  const items = [];

  if (selectedDataType.value === "invoice") {
    items.push({ label: "Invoice", color: "#4CAF50" });
  } else if (selectedDataType.value === "penawaran") {
    items.push({ label: "Penawaran", color: "#2196F3" });
  } else {
    items.push({ label: "Invoice", color: "#4CAF50" });
    items.push({ label: "Penawaran", color: "#2196F3" });
  }

  return items;
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (context) {
          const label = context.dataset.label || "";
          const value = context.raw || 0;
          const actualValue = value * 1000000; // Convert back from JT
          return `${label}: Rp ${formatCurrency(actualValue)}`;
        },
      },
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 10,
      cornerRadius: 6,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (v) => `Rp ${v}JT`,
        stepSize: 10,
        font: {
          size: 8,
          family: "'Roboto', sans-serif",
        },
        color: "#666",
      },
      grid: {
        color: "#f5f5f5",
        drawBorder: false,
      },
    },
    x: {
      ticks: {
        font: {
          size: 9,
          family: "'Roboto', sans-serif",
        },
        color: "#666",
      },
      grid: {
        color: "#f5f5f5",
        drawBorder: false,
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
};

// Helper functions
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

// Handler functions untuk menu
function handleYearSelect(year) {
  currentYear.value = year;
}

function handleDataTypeSelect(type) {
  selectedDataType.value = type;
}

// Load data awal
onMounted(async () => {
  try {
    // Load data dari store jika belum ada
    if (invoiceStore.dataInvoice.length === 0) {
      await invoiceStore.tarikDataInvoiceAct();
    }
    if (penawaranStore.dataPenawaran.length === 0) {
      await penawaranStore.tarikDataPenawaranAct();
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
});

// Watch for changes
watch(currentYear, () => {
  console.log("Year changed to:", currentYear.value);
});

watch(selectedDataType, () => {
  console.log("Data type changed to:", selectedDataType.value);
});
</script>

<style scoped>
.border-e {
  border-right: 1px solid rgba(0, 0, 0, 0.05) !important;
}
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.text-success {
  color: #4caf50 !important;
}

.text-primary {
  color: #2196f3 !important;
}

.text-info {
  color: #9c27b0 !important;
}

.text-error {
  color: #f44336 !important;
}

.text-warning {
  color: #ff9800 !important;
}
</style>
