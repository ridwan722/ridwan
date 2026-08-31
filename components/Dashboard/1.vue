<template>
  <v-card class="rounded-lg shadow-sm border">
    <v-card-item class="py-3 px-4">
      <div class="d-flex justify-space-between align-center">
        <span class="text-subtitle-1 font-weight-bold text-grey-darken-3">
          Deadline Penawaran
        </span>
        <v-menu density="compact">
          <template v-slot:activator="{ props }">
            <div 
              v-bind="props" 
              class="text-caption text-grey-darken-1 cursor-pointer font-weight-medium d-flex align-center"
            >
              {{ getFilterLabel }}
              <v-icon size="small" class="ml-1">mdi-chevron-down</v-icon>
            </div>
          </template>
          <v-list density="compact">
            <v-list-item 
              v-for="filter in filterOptions" 
              :key="filter.value"
              :title="filter.label"
              @click="handleFilterSelect(filter.value)"
            >
              <template v-slot:prepend v-if="activeFilter === filter.value">
                <v-icon size="small" color="primary">mdi-check</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card-item>

    <!-- Stats Summary -->
    <v-row no-gutters class="border-y bg-grey-lighten-5">
      <v-col cols="6" class="border-e pa-3 text-center">
        <div class="text-h5 font-weight-bold text-warning">
          {{ deadlineCount }}
        </div>
        <div class="text-caption text-grey-darken-1">
          Deadline Mendekati
        </div>
      </v-col>
      <v-col cols="6" class="pa-3 text-center">
        <div class="text-h5 font-weight-bold text-grey-darken-3">
          Rp {{ formatCurrency(totalNilai) }}
        </div>
        <div class="text-caption text-grey-darken-1">
          Total Nilai
        </div>
      </v-col>
    </v-row>

    <!-- Table -->
    <div class="penawaran-table-container">
      <v-table density="comfortable" class="penawaran-table">
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="text-subtitle-2 font-weight-bold text-grey-darken-2">No. Penawaran</th>
            <th class="text-subtitle-2 font-weight-bold text-grey-darken-2">Perusahaan</th>
            <th class="text-subtitle-2 font-weight-bold text-grey-darken-2">Deadline</th>
            <th class="text-subtitle-2 font-weight-bold text-grey-darken-2">Status</th>
            <th class="text-subtitle-2 font-weight-bold text-grey-darken-2 text-right">Nilai</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="penawaran in displayedPenawaran" :key="penawaran.id">
            <td class="text-body-2 font-weight-medium text-grey-darken-3">
              <div class="d-flex align-center">
                <v-icon 
                  size="small" 
                  :color="getPenawaranIconColor(penawaran)" 
                  class="me-2"
                >
                  {{ getPenawaranIcon(penawaran) }}
                </v-icon>
                {{ penawaran.no_penawaran || 'PEN-' + penawaran.id?.slice(0, 8) }}
              </div>
            </td>
            <td class="text-body-2 text-grey-darken-1">
              <div class="text-truncate" style="max-width: 150px">
                {{ penawaran.nama_perusahaan }}
              </div>
              <div class="text-caption text-grey">
                {{ penawaran.nama_cabang_perusahaan }}
              </div>
            </td>
            <td>
              <div class="text-body-2" :class="getDeadlineClass(penawaran)">
                {{ getEarliestDeadline(penawaran) }}
              </div>
              <div class="text-caption text-grey">
                {{ getDaysRemainingText(penawaran) }}
              </div>
            </td>
            <td>
              <v-chip
                :color="getStatusColor(penawaran.status)"
                size="x-small"
                class="font-weight-bold px-2"
                variant="flat"
                label
              >
                {{ getStatusLabel(penawaran.status) }}
              </v-chip>
            </td>
            <td class="text-body-2 font-weight-bold text-grey-darken-3 text-right">
              Rp {{ formatCurrency(penawaran.total) }}
            </td>
          </tr>
        </tbody>
      </v-table>
      
      <!-- Empty State -->
      <div v-if="!hasPenawaran" class="text-center py-8">
        <v-icon size="large" color="grey-lighten-1" class="mb-3">mdi-file-document-outline</v-icon>
        <div class="text-body-2 text-grey">Tidak ada data penawaran</div>
      </div>
      
      <!-- No Deadline State -->
      <div v-if="hasPenawaran && deadlinePenawaran.length === 0" class="text-center py-8">
        <v-icon size="large" color="green-lighten-1" class="mb-3">mdi-check-circle-outline</v-icon>
        <div class="text-body-2 text-grey">Tidak ada penawaran mendekati deadline</div>
        <div class="text-caption text-green-darken-1 mt-1">Semua penawaran masih dalam periode aman</div>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-8">
        <v-progress-circular indeterminate size="32" color="primary"></v-progress-circular>
        <div class="text-body-2 text-grey mt-3">Memuat data...</div>
      </div>
    </div>

    <!-- Footer Actions -->
    <v-card-actions class="px-4 py-3 border-t bg-grey-lighten-5">
      <v-btn 
        variant="text" 
        color="primary" 
        size="small"
        prepend-icon="mdi-eye-outline"
        @click="viewAllPenawaran"
      >
        Lihat Semua
      </v-btn>
      <v-spacer />
      <div class="text-caption text-grey">
        Menampilkan {{ displayedPenawaran.length }} dari {{ deadlinePenawaran.length }} penawaran
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

// Store
const penawaranStore = usePenawaranStore();
const router = useRouter();

// State
const activeFilter = ref('deadline'); // 'deadline', 'expired', 'all'
const isLoading = ref(false);

// Filter options
const filterOptions = ref([
  { label: 'Mendekati Deadline', value: 'deadline' },
  { label: 'Sudah Expired', value: 'expired' },
  { label: 'Semua Periode', value: 'all' }
]);

// Computed
const getFilterLabel = computed(() => {
  return filterOptions.value.find(f => f.value === activeFilter.value)?.label || 'Mendekati Deadline';
});

const hasPenawaran = computed(() => {
  return penawaranStore?.dataPenawaran?.length > 0;
});

// Analisis periode item untuk setiap penawaran
const penawaranWithDeadline = computed(() => {
  if (!hasPenawaran.value) return [];
  
  return penawaranStore.dataPenawaran.map(penawaran => {
    // Cari deadline terdekat dari items
    let earliestDeadline = null;
    let daysRemaining = null;
    let isExpired = false;
    
    if (penawaran.items && penawaran.items.length > 0) {
      // Cari periode selesai terdekat dari semua items
      const deadlines = penawaran.items
        .map(item => {
          if (item.periode && item.periode.selesai) {
            try {
              const endDate = new Date(item.periode.selesai);
              if (!isNaN(endDate.getTime())) {
                return endDate;
              }
            } catch (error) {
              console.error("Error parsing date:", error);
            }
          }
          return null;
        })
        .filter(date => date !== null);
      
      if (deadlines.length > 0) {
        // Cari yang paling dekat
        earliestDeadline = new Date(Math.min(...deadlines.map(d => d.getTime())));
        const today = new Date();
        const diffTime = earliestDeadline.getTime() - today.getTime();
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        isExpired = daysRemaining < 0;
      }
    }
    
    return {
      ...penawaran,
      earliestDeadline,
      daysRemaining,
      isExpired,
      deadlineText: earliestDeadline 
        ? earliestDeadline.toLocaleDateString('id-ID') 
        : 'Tidak ada deadline'
    };
  });
});

// Filter berdasarkan deadline
const deadlinePenawaran = computed(() => {
  const penawaranList = penawaranWithDeadline.value;
  
  switch (activeFilter.value) {
    case 'deadline':
      // Penawaran dengan deadline dalam 30 hari ke depan
      return penawaranList.filter(p => 
        p.daysRemaining !== null && 
        p.daysRemaining >= 0 && 
        p.daysRemaining <= 30
      ).sort((a, b) => a.daysRemaining - b.daysRemaining);
      
    case 'expired':
      // Penawaran yang sudah expired
      return penawaranList.filter(p => 
        p.isExpired === true
      ).sort((a, b) => b.daysRemaining - a.daysRemaining); // Most expired first
      
    case 'all':
      // Semua penawaran yang punya deadline
      return penawaranList.filter(p => 
        p.earliestDeadline !== null
      ).sort((a, b) => a.daysRemaining - b.daysRemaining);
      
    default:
      return [];
  }
});

// Ambil 5 penawaran pertama untuk ditampilkan
const displayedPenawaran = computed(() => {
  return deadlinePenawaran.value.slice(0, 5);
});

// Stats
const deadlineCount = computed(() => {
  return deadlinePenawaran.value.length;
});

const totalNilai = computed(() => {
  return deadlinePenawaran.value.reduce((sum, p) => sum + (p.total || 0), 0);
});

// Helper functions
function getStatusLabel(status) {
  const statusMap = {
    'draft': 'Draft',
    'sent': 'Terkirim',
    'terkirim': 'Terkirim',
    'approved': 'Disetujui',
    'disetujui': 'Disetujui',
    'rejected': 'Ditolak',
    'ditolak': 'Ditolak'
  };
  
  return statusMap[status?.toLowerCase()] || status || 'Unknown';
}

function getStatusColor(status) {
  const statusLower = status?.toLowerCase();
  
  switch (statusLower) {
    case 'draft': return 'grey-lighten-3 text-grey-darken-2'
    case 'sent':
    case 'terkirim': return 'blue-lighten-5 text-blue-darken-2'
    case 'approved':
    case 'disetujui': return 'green-lighten-5 text-green-darken-2'
    case 'rejected':
    case 'ditolak': return 'red-lighten-5 text-red-darken-1'
    default: return 'orange-lighten-5 text-orange-darken-2'
  }
}

function getPenawaranIcon(penawaran) {
  if (penawaran.isExpired) return 'mdi-alert-circle-outline';
  if (penawaran.daysRemaining <= 7) return 'mdi-clock-alert-outline';
  if (penawaran.daysRemaining <= 14) return 'mdi-clock-fast';
  return 'mdi-clock-outline';
}

function getPenawaranIconColor(penawaran) {
  if (penawaran.isExpired) return 'error';
  if (penawaran.daysRemaining <= 7) return 'warning';
  if (penawaran.daysRemaining <= 14) return 'orange';
  return 'primary';
}

function getEarliestDeadline(penawaran) {
  return penawaran.deadlineText;
}

function getDeadlineClass(penawaran) {
  if (penawaran.isExpired) return 'text-error font-weight-bold';
  if (penawaran.daysRemaining <= 3) return 'text-error font-weight-bold';
  if (penawaran.daysRemaining <= 7) return 'text-warning font-weight-bold';
  if (penawaran.daysRemaining <= 14) return 'text-orange-darken-2';
  return 'text-grey-darken-2';
}

function getDaysRemainingText(penawaran) {
  if (penawaran.daysRemaining === null) return 'Tidak ada deadline';
  if (penawaran.isExpired) return `${Math.abs(penawaran.daysRemaining)} hari lewat`;
  if (penawaran.daysRemaining === 0) return 'Hari ini';
  if (penawaran.daysRemaining === 1) return '1 hari lagi';
  return `${penawaran.daysRemaining} hari lagi`;
}

function formatCurrency(value) {
  if (!value && value !== 0) return "0";
  
  const numValue = Number(value);
  if (isNaN(numValue)) return "0";
  
  if (numValue >= 1000000000) {
    return (numValue / 1000000000).toFixed(1).replace('.', ',') + "M";
  } else if (numValue >= 1000000) {
    return (numValue / 1000000).toFixed(1).replace('.', ',') + "JT";
  } else if (numValue >= 1000) {
    return (numValue / 1000).toFixed(1).replace('.', ',') + "RB";
  } else {
    return Math.round(numValue).toLocaleString('id-ID');
  }
}

// Handler functions
function handleFilterSelect(filter) {
  activeFilter.value = filter;
}

function viewAllPenawaran() {
  router.push('/admin/penawaran');
}
</script>

<style scoped>
.border {
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}
.border-y {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
.border-e {
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.penawaran-table-container {
  max-height: 340px;
  overflow-y: auto;
}

.penawaran-table :deep(th) {
  height: 48px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
  position: sticky;
  top: 0;
  background-color: #fafafa;
  z-index: 1;
}
.penawaran-table :deep(td) {
  height: 60px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03) !important;
}
.penawaran-table :deep(tbody tr:hover) {
  background-color: rgba(0, 0, 0, 0.02) !important;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cursor-pointer {
  cursor: pointer;
}

.text-error {
  color: #F44336 !important;
}
.text-warning {
  color: #FF9800 !important;
}
.text-success {
  color: #4CAF50 !important;
}
.text-orange {
  color: #FF5722 !important;
}
</style>