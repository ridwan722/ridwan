<template>
  <v-card class="rounded-lg border-thin">
    <v-card-item class="py-2 px-3">
      <div class="d-flex justify-space-between align-center">
        <span
          class="text-caption font-weight-black text-uppercase text-grey-darken-2"
        >
          Status Penawaran
        </span>

        <v-menu transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              density="compact"
              class="text-none text-caption px-1"
              color="primary"
              append-icon="mdi-chevron-down"
            >
              {{ activeFilterLabel }}
            </v-btn>
          </template>

          <v-list density="compact">
            <v-list-item
              v-for="filter in filterOptions"
              :key="filter.value"
              :value="filter.value"
              @click="handleFilterChange(filter)"
              :active="selectedFilter === filter.value"
            >
              <v-list-item-title class="text-caption">{{
                filter.title
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card-item>

    <v-divider />

    <v-card-text class="pa-3">
      <div style="height: 180px; position: relative">
        <div v-if="isLoading" class="d-flex align-center justify-center h-100">
          <v-progress-circular
            indeterminate
            color="primary"
            size="30"
            width="3"
          />
        </div>

        <template v-else>
          <Bar v-if="hasData" :data="chartData" :options="chartOptions" />

          <div
            v-else
            class="d-flex align-center justify-center h-100 bg-grey-lighten-5 rounded"
          >
            <div class="text-center text-grey">
              <v-icon size="small">mdi-chart-bar-off</v-icon>
              <div class="text-caption">Kosong</div>
            </div>
          </div>
        </template>
      </div>

      <div class="d-flex align-center justify-center mt-2">
        <div class="text-center bg-grey-lighten-4 px-3 py-1 rounded-pill">
          <span class="text-caption font-weight-bold text-grey-darken-2">
            Total: {{ totalPenawaran }}
          </span>
        </div>
      </div>
    </v-card-text>

    <v-divider />
    <v-card-actions class="pa-1 bg-grey-lighten-5 justify-center flex-wrap">
      <div
        v-for="item in legendItems"
        :key="item.label"
        class="d-flex align-center mx-2 py-1"
      >
        <v-icon size="8" :color="item.color" class="mr-1">mdi-circle</v-icon>
        <span
          style="font-size: 0.65rem"
          class="font-weight-bold text-grey-darken-1"
        >
          {{ item.label }} ({{ item.count }})
        </span>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { computed, ref, onMounted } from "vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const isLoading = ref(true);
const hasData = ref(false);
const penawaranStore = usePenawaranStore();

// --- Filter Logic ---
const selectedFilter = ref("month");
const filterOptions = [
  { title: "Minggu Ini", value: "week" },
  { title: "Bulan Ini", value: "month" },
  { title: "Tahun Ini", value: "year" },
];

const activeFilterLabel = computed(() => {
  return (
    filterOptions.find((f) => f.value === selectedFilter.value)?.title ||
    "Filter"
  );
});

const handleFilterChange = async (filter) => {
  if (selectedFilter.value === filter.value) return;

  selectedFilter.value = filter.value;
  isLoading.value = true;

  try {
    // Panggil fungsi store jika ada parameter filter
    // await penawaranStore.tarikDataPenawaranAct(filter.value);
    await penawaranStore.tarikDataPenawaranAct();
  } finally {
    isLoading.value = false;
  }
};

// --- Data Mapping (Logic Tetap Sama) ---
const statusCounts = computed(() => {
  const counts = { draft: 0, terkirim: 0, disetujui: 0, ditolak: 0 };
  if (Array.isArray(penawaranStore.dataPenawaran)) {
    penawaranStore.dataPenawaran.forEach((item) => {
      const status = item.status?.toLowerCase() || "";
      if (status.includes("draft")) counts.draft++;
      else if (status.includes("terkirim") || status.includes("sent"))
        counts.terkirim++;
      else if (status.includes("disetujui") || status.includes("approved"))
        counts.disetujui++;
      else if (status.includes("ditolak") || status.includes("rejected"))
        counts.ditolak++;
    });
  }
  return counts;
});

const totalPenawaran = computed(() =>
  Array.isArray(penawaranStore.dataPenawaran)
    ? penawaranStore.dataPenawaran.length
    : 0
);

const legendItems = computed(() => [
  { label: "Draft", color: "#9e9e9e", count: statusCounts.value.draft },
  { label: "Sent", color: "#fb8c00", count: statusCounts.value.terkirim },
  { label: "Approved", color: "#4caf50", count: statusCounts.value.disetujui },
  { label: "Rejected", color: "#f44336", count: statusCounts.value.ditolak },
]);

const chartData = computed(() => ({
  labels: ["Status"],
  datasets: [
    {
      label: "Draft",
      backgroundColor: "#9e9e9e",
      data: [statusCounts.value.draft],
      barPercentage: 0.7,
      categoryPercentage: 0.8,
    },
    {
      label: "Sent",
      backgroundColor: "#fb8c00",
      data: [statusCounts.value.terkirim],
      barPercentage: 0.7,
      categoryPercentage: 0.8,
    },
    {
      label: "Approved",
      backgroundColor: "#4caf50",
      data: [statusCounts.value.disetujui],
      barPercentage: 0.7,
      categoryPercentage: 0.8,
    },
    {
      label: "Rejected",
      backgroundColor: "#f44336",
      data: [statusCounts.value.ditolak],
      barPercentage: 0.7,
      categoryPercentage: 0.8,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      padding: 8,
      bodyFont: { size: 11 },
      displayColors: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { display: true, color: "#f0f0f0", drawBorder: false },
      ticks: { stepSize: 1, font: { size: 9 } },
    },
    x: { display: false },
  },
};

onMounted(async () => {
  try {
    if (penawaranStore?.tarikDataPenawaranAct) {
      await penawaranStore.tarikDataPenawaranAct();
    }
    hasData.value =
      Array.isArray(penawaranStore.dataPenawaran) &&
      penawaranStore.dataPenawaran.length > 0;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
