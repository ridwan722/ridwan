<template>
  <v-card class="rounded-lg shadow-sm border" elevation="2">
    <v-card-item class="py-3 px-4">
      <div class="d-flex justify-space-between align-center">
        <div>
          <span class="text-subtitle-2 font-weight-bold text-grey-darken-3">
            {{ title }}
          </span>
          <div class="text-caption text-grey-darken-1 mt-1">
            {{ subtitle }}
          </div>
        </div>
        <v-menu location="bottom end" density="compact">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              size="small"
              variant="text"
              color="grey-darken-1"
            >
              <v-icon size="20">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list density="compact">
            <v-list-item
              v-for="item in menuItems"
              :key="item.value"
              :title="item.title"
              :prepend-icon="item.icon"
              @click="selectedMetric = item.value"
            />
          </v-list>
        </v-menu>
      </div>
    </v-card-item>

    <v-divider />

    <v-card-text class="pa-4">
      <div class="d-flex align-center" style="height: 165px">
        <!-- Chart Area -->
        <div class="chart-wrapper" style="width: 50%">
          <div v-if="!hasData" class="no-data-placeholder">
            <v-icon size="40" color="grey-lighten-1">mdi-chart-donut-variant</v-icon>
            <div class="text-caption text-grey mt-2">Tidak ada data</div>
          </div>
          <Doughnut v-else :data="chartData" :options="chartOptions" />
        </div>
        
        <!-- Stats & Legend -->
        <div class="stats-wrapper pl-4" style="width: 50%">
          <div class="total-display mb-3">
            <div class="text-h5 font-weight-bold text-grey-darken-3">
              {{ totalData }}
            </div>
            <div class="text-caption text-grey-darken-1 text-uppercase">
              Total {{ metricLabels[selectedMetric] }}
            </div>
          </div>
          
          <div class="legend-scroll">
            <div
              v-for="item in topLegendItems"
              :key="item.label"
              class="legend-item mb-2"
            >
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <div 
                    :style="{ backgroundColor: item.color }" 
                    class="color-indicator mr-2"
                  />
                  <span class="text-caption font-weight-medium text-grey-darken-2">
                    {{ item.label }}
                  </span>
                </div>
                <div class="text-right">
                  <div class="text-caption font-weight-bold text-grey-darken-3">
                    {{ item.count }}
                  </div>
                  <div class="text-caption text-grey">
                    {{ item.percentage }}%
                  </div>
                </div>
              </div>
              <v-progress-linear
                :model-value="item.percentage"
                height="4"
                :color="item.color"
                rounded
                class="mt-1"
              />
            </div>
            
            <div v-if="otherCount > 0" class="legend-item mt-3 pt-3 border-top">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <div class="color-indicator mr-2" style="background-color: #9E9E9E" />
                  <span class="text-caption font-weight-medium text-grey-darken-2">
                    Lainnya
                  </span>
                </div>
                <div class="text-right">
                  <div class="text-caption font-weight-bold text-grey-darken-3">
                    {{ otherCount }}
                  </div>
                  <div class="text-caption text-grey">
                    {{ otherPercentage }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>

    <!-- Deadline Stats Footer -->
    <v-card-actions class="px-4 py-3 bg-grey-lighten-4 border-top">
      <div class="d-flex justify-space-between w-100">
        <div class="text-center" v-for="stat in deadlineStats" :key="stat.label">
          <div class="text-body-2 font-weight-bold" :class="stat.color">
            {{ stat.value }}
          </div>
          <div class="text-caption text-grey-darken-1">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { computed, ref } from "vue";
import { useMasterKategoriStore } from "~/stores/master/kategoriStore";

ChartJS.register(ArcElement, Tooltip, Legend);

// Store
const kategoriStore = useMasterKategoriStore();

const selectedMetric = ref('deadline'); // 'deadline', 'status', 'kategori'

// Labels & Menu
const metricLabels = {
  deadline: 'Deadline',
  status: 'Status',
  kategori: 'Kategori'
};

const menuItems = [
  { title: 'Berdasarkan Deadline', value: 'deadline', icon: 'mdi-calendar-clock' },
  { title: 'Berdasarkan Status', value: 'status', icon: 'mdi-check-circle' },
  { title: 'Berdasarkan Kategori', value: 'kategori', icon: 'mdi-shape-outline' }
];

// Computed Properties
const title = computed(() => {
  return `Distribusi Pekerjaan - ${metricLabels[selectedMetric.value]}`;
});

const subtitle = computed(() => {
  if (selectedMetric.value === 'deadline') {
    return 'Berdasarkan status deadline';
  } else if (selectedMetric.value === 'status') {
    return 'Berdasarkan status pekerjaan';
  } else {
    return 'Berdasarkan kategori pekerjaan';
  }
});

const hasData = computed(() => {
  return kategoriStore.dataItemKategori?.length > 0;
});

// Data calculation
const metricData = computed(() => {
  if (selectedMetric.value === 'deadline') {
    return calculateDeadlineData();
  } else if (selectedMetric.value === 'status') {
    return calculateStatusData();
  } else {
    return calculateKategoriData();
  }
});

// Fungsi untuk menghitung data berdasarkan deadline
function calculateDeadlineData() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const stats = {
    'Deadline Mendekati (≤ 3 hari)': 0,
    'Deadline Jauh (> 3 hari)': 0,
    'Deadline Terlewat': 0,
    'Tanpa Deadline': 0
  };
  
  kategoriStore.dataItemKategori?.forEach(item => {
    if (!item.periode?.selesai || item.periode.selesai === "-") {
      stats['Tanpa Deadline']++;
      return;
    }
    
    const deadline = new Date(item.periode.selesai);
    deadline.setHours(0, 0, 0, 0);
    
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      stats['Deadline Terlewat']++;
    } else if (diffDays <= 3) {
      stats['Deadline Mendekati (≤ 3 hari)']++;
    } else {
      stats['Deadline Jauh (> 3 hari)']++;
    }
  });
  
  return stats;
}

// Fungsi untuk menghitung data berdasarkan status pekerjaan
function calculateStatusData() {
  const stats = {
    'Draft': 0,
    'Penawaran': 0,
    'Invoice': 0,
    'Selesai': 0
  };
  
  kategoriStore.dataItemKategori?.forEach(item => {
    const status = item.status || 'Draft';
    if (status in stats) {
      stats[status]++;
    } else {
      stats['Draft']++;
    }
  });
  
  return stats;
}

// Fungsi untuk menghitung data berdasarkan kategori
function calculateKategoriData() {
  const stats = {};
  kategoriStore.dataItemKategori?.forEach(item => {
    const kategori = item.nama_kategori_object || 'Lainnya';
    stats[kategori] = (stats[kategori] || 0) + 1;
  });
  return stats;
}

const totalData = computed(() => {
  const data = metricData.value;
  return Object.values(data).reduce((sum, count) => sum + count, 0);
});

// Chart Data
const chartData = computed(() => {
  const data = metricData.value;
  const entries = Object.entries(data).filter(([_, count]) => count > 0);
  
  if (entries.length === 0) {
    return {
      labels: ['No Data'],
      datasets: [{
        data: [1],
        backgroundColor: ['#E0E0E0'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    };
  }
  
  // Warna khusus untuk data deadline
  let colorPalette = [
    '#FF6B6B', // Red untuk deadline mendekati/terlewat
    '#FFD166', // Yellow untuk deadline jauh
    '#06D6A0', // Green untuk tanpa deadline
    '#118AB2', // Blue untuk lainnya
    '#073B4C', // Dark blue
    '#EF476F', // Pink
    '#8AC926', // Light green
    '#1982C4', // Light blue
  ];
  
  // Custom color untuk metric deadline
  if (selectedMetric.value === 'deadline') {
    colorPalette = [
      '#EF5350', // Red untuk deadline mendekati
      '#FFB74D', // Orange untuk deadline jauh
      '#F44336', // Dark red untuk deadline terlewat
      '#9E9E9E', // Grey untuk tanpa deadline
    ];
  } else if (selectedMetric.value === 'status') {
    colorPalette = [
      '#9E9E9E', // Grey untuk Draft
      '#2196F3', // Blue untuk Penawaran
      '#FF9800', // Orange untuk Invoice
      '#4CAF50', // Green untuk Selesai
    ];
  }
  
  return {
    labels: entries.map(([label]) => label),
    datasets: [{
      data: entries.map(([, count]) => count),
      backgroundColor: entries.map((_, index) => colorPalette[index % colorPalette.length]),
      borderColor: '#fff',
      borderWidth: 3,
      cutout: '75%',
      radius: '90%'
    }]
  };
});

// Legend Items (max 4 shown, others grouped)
const legendItems = computed(() => {
  const data = metricData.value;
  const entries = Object.entries(data).filter(([_, count]) => count > 0);
  const total = totalData.value;
  
  let colorPalette = [
    '#FF6B6B', '#FFD166', '#06D6A0', '#118AB2',
    '#073B4C', '#EF476F', '#8AC926', '#1982C4'
  ];
  
  // Custom color untuk metric deadline
  if (selectedMetric.value === 'deadline') {
    colorPalette = [
      '#EF5350', '#FFB74D', '#F44336', '#9E9E9E'
    ];
  } else if (selectedMetric.value === 'status') {
    colorPalette = [
      '#9E9E9E', '#2196F3', '#FF9800', '#4CAF50'
    ];
  }
  
  return entries
    .map(([label, count], index) => ({
      label,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: colorPalette[index % colorPalette.length]
    }))
    .sort((a, b) => b.count - a.count);
});

const topLegendItems = computed(() => {
  return legendItems.value.slice(0, 4);
});

const otherCount = computed(() => {
  return legendItems.value.slice(4).reduce((sum, item) => sum + item.count, 0);
});

const otherPercentage = computed(() => {
  return totalData.value > 0 ? Math.round((otherCount.value / totalData.value) * 100) : 0;
});

// Deadline Statistics
const deadlineStats = computed(() => {
  if (selectedMetric.value === 'deadline') {
    // Ambil data langsung dari metricData
    const data = metricData.value;
    return [
      { 
        label: 'Mendekati (≤3 hari)', 
        value: data['Deadline Mendekati (≤ 3 hari)'] || 0,
        color: 'text-red-darken-2'
      },
      { 
        label: 'Terlewat', 
        value: data['Deadline Terlewat'] || 0,
        color: 'text-orange-darken-2'
      },
      { 
        label: 'Dengan Deadline', 
        value: (data['Deadline Mendekati (≤ 3 hari)'] || 0) + 
               (data['Deadline Jauh (> 3 hari)'] || 0) + 
               (data['Deadline Terlewat'] || 0),
        color: 'text-blue-darken-2'
      }
    ];
  } else if (selectedMetric.value === 'status') {
    const data = metricData.value;
    return [
      { 
        label: 'Draft', 
        value: data['Draft'] || 0,
        color: 'text-grey-darken-2'
      },
      { 
        label: 'Penawaran', 
        value: data['Penawaran'] || 0,
        color: 'text-blue-darken-2'
      },
      { 
        label: 'Invoice', 
        value: data['Invoice'] || 0,
        color: 'text-orange-darken-2'
      }
    ];
  } else {
    const data = metricData.value;
    const entries = Object.entries(data);
    // Ambil 3 kategori teratas
    const sorted = entries.sort((a, b) => b[1] - a[1]).slice(0, 3);
    
    return sorted.map(([label, count], index) => ({
      label: label.length > 12 ? label.substring(0, 12) + '...' : label,
      value: count,
      color: index === 0 ? 'text-green-darken-2' : 
             index === 1 ? 'text-blue-darken-2' : 'text-purple-darken-2'
    }));
  }
});

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 12,
      cornerRadius: 6,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      callbacks: {
        label: (context) => {
          const label = context.label || '';
          const value = context.raw || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
          return `${label}: ${value} item (${percentage}%)`;
        }
      }
    }
  },
  cutout: '75%'
};
</script>

<style scoped>
.border {
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}
.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.chart-wrapper {
  position: relative;
  height: 180px;
}

.no-data-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.stats-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.total-display {
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
}

.legend-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  max-height: 100px;
}

.legend-scroll::-webkit-scrollbar {
  width: 4px;
}

.legend-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
}

.legend-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}

.legend-item {
  padding: 4px 0;
}

.color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

/* Deadline status colors */
.text-red-darken-2 {
  color: #D32F2F !important;
}
.text-orange-darken-2 {
  color: #F57C00 !important;
}
.text-blue-darken-2 {
  color: #1976D2 !important;
}
.text-green-darken-2 {
  color: #388E3C !important;
}
.text-grey-darken-2 {
  color: #616161 !important;
}
.text-purple-darken-2 {
  color: #7B1FA2 !important;
}
</style>