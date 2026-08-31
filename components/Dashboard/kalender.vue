<template>
  <ConfirmationDialog ref="confirmationDialog" />
  <v-dialog v-model="dialog" max-width="420">
    <v-card
      class="rounded-xl pa-5 border-neutral-100"
      elevation="6"
      style="
        box-shadow:
          0 20px 25px -5px rgb(0 0 0 / 0.05),
          0 8px 10px -6px rgb(0 0 0 / 0.05);
      "
    >
      <v-card-title
        class="text-h6 font-weight-black pt-1 pb-4 px-1 text-slate-800 d-flex align-center justify-between"
      >
        <span>Tambah Reminder</span>
        <v-icon
          size="8"
          color="amber-darken-2"
          icon="mdi-circle"
          class="ml-2"
        />
      </v-card-title>

      <v-card-text class="py-2 px-1 d-flex flex-column" style="gap: 5px">
        <a-date-picker
          v-model="new_reminder.tanggal_reminder"
          label="Tanggal"
        />

        <a-select
          label="Perusahaan"
          item-title="nama_perusahaan"
          item-value="id"
          :items="perusahaanStore.getDataPerusahaan"
          v-model="new_reminder.id_perusahaan"
        />

        <a-select
          label="Cabang Perusahaan"
          item-title="nama_cabang"
          item-value="id"
          :items="masterCabangStore.getDataCabang"
          v-model="new_reminder.id_cabang_perusahaan"
        />

        <a-textarea v-model="new_reminder.desc" label="keterangan reminder" />
      </v-card-text>

      <v-card-actions class="pt-6 pb-1 px-1">
        <v-spacer />
        <v-btn
          variant="text"
          ripple
          class="text-none font-weight-bold text-grey-darken-1 rounded-xl px-4"
          @click="dialog = false"
        >
          Batal
        </v-btn>
        <v-btn
          @click="addReminder"
          color="#1e293b"
          variant="flat"
          ripple
          class="text-none font-weight-bold rounded-xl px-6 text-white"
          style="letter-spacing: 0.3px"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div class="calendar-container" :class="{ 'has-sidebar': activeDateNotes }">
    <div class="calendar-wrapper">
      <div class="calendar-header">
        <div class="month-nav">
          <button class="nav-btn" @click="changeMonth(-1)">❮</button>

          <div class="title-group">
            <span style="font-size: 25px; font-weight: bold; color: black">
              {{ monthNames[currentMonth] }}
            </span>
            <br />
            <span style="font-size: 12px; color: black">
              {{ currentYear }}
            </span>
          </div>

          <button class="nav-btn" @click="changeMonth(1)">❯</button>
        </div>

        <div class="header-action">
          <v-btn
            @click="opendialogreminder()"
            color="primary"
            size="small"
            style="border-radius: 10px"
            >+ Reminder</v-btn
          >
        </div>
      </div>

      <div class="calendar-days">
        <div v-for="day in days" :key="day" class="day-name">
          {{ day }}
        </div>
      </div>

      <div class="calendar-grid">
        <div
          v-for="(date, index) in calendarDates"
          :key="index"
          class="date-card"
          :class="{
            empty: !date.day,
            'is-today': date.isToday,
            'cursor-pointer': date.day,
            active:
              activeDateNotes &&
              activeDateNotes.day === date.day &&
              !date.empty,
          }"
          @click="date.day ? opendialogreminder(date.dateKey) : null"
        >
          <template v-if="date.day">
            <div class="date-top">
              <span class="date-number">
                {{ date.day }}
              </span>

              <span
                v-if="date.notes?.length > 0"
                :class="{
                  'badge-orange': date.notes.some(
                    (n) => n.status?.toLowerCase() === 'pending',
                  ),
                  'badge-biru': date.notes.every(
                    (n) => n.status?.toLowerCase() === 'selesai',
                  ),
                }"
              >
                {{ date.notes.length }}
              </span>
            </div>

            <div class="notes">
              <div
                v-for="(note, i) in date.notes
                  ?.filter((n) => n.status?.toLowerCase() === 'pending')
                  .slice(0, 3)"
                :key="i"
                class="note"
              >
                <div
                  class="note-chip"
                  :style="{
                    backgroundColor:
                      note.jenis === 'expired'
                        ? '#dc2626'
                        : getPerusahaanColor(note.nama_perusahaan).bg,
                    color: 'white',
                  }"
                >
                  <template v-if="note.jenis === 'expired'">
                    ⚠ Expired
                  </template>

                  <template v-else> Reminder </template>

                  -
                  {{ note.nama_perusahaan }} - {{ note.cabang_perusahaan }}
                </div>
                <div class="note-desc">{{ note.desc }}</div>
              </div>

              <button
                v-if="date.notes?.length > 0"
                class="more-btn d-inline-flex align-center justify-center ga-2"
                @click.stop="openSidebar(date)"
              >
                <v-icon size="small">mdi-format-list-bulleted-square</v-icon>
                Lihat reminder
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div v-if="activeDateNotes" class="calendar-sidebar">
      <div class="sidebar-header">
        <div class="sidebar-title">
          <div class="d-flex align-center py-2">
            <v-icon color="grey-darken-1" class="mr-2 animate-bell mb-1"
              >mdi-bell-ring-outline</v-icon
            >
            <span
              class="text-uppercase text-caption font-weight-black text-grey-darken-1 mr-1"
              >Reminder</span
            >
            <v-icon size="small" color="grey" class="mr-1"
              >mdi-chevron-right</v-icon
            >
            <strong class="text-subtitle-2 font-weight-bold text-primary">
              {{ activeDateNotes.day }} {{ monthNames[currentMonth] }}
              {{ currentYear }}
            </strong>
          </div>
        </div>
        <button class="close-sidebar-btn" @click="activeDate = null">✕</button>
      </div>

      <div class="sidebar-content">
        <div
          v-for="(note, i) in activeDateNotes.notes?.filter(
            (n) => n.status?.toLowerCase() === 'pending',
          )"
          :key="'pending-' + i"
          class="sidebar-note-card"
        >
          <div
            class="sidebar-note"
            :style="{
              backgroundColor: getPerusahaanColor(note.nama_perusahaan).bg,
              color: getPerusahaanColor(note.nama_perusahaan).text,
            }"
          >
            {{ note.nama_perusahaan }} - {{ note.cabang_perusahaan }}
          </div>
          <div class="sidebar-note-desc">{{ note.desc }}</div>
          <div class="d-flex align-center w-100">
            <div v-if="note.createdBy" class="sidebar-status status-pending">
              {{ note.status }}
            </div>
            <div v-else class="sidebar-status status-expired">
              Expired
            </div>

            <v-btn
              @click="updateReminder(note.id)"
              :disabled="!note.createdBy"
              variant="outlined"
              class="ms-auto rounded-0 text-caption custom-btn"
              style="
                border: 1px solid #e0e0e0;
                color: #444;
                font-weight: 500;
                letter-spacing: 1px;
                text-transform: uppercase;
                height: 22px !important;
                font-size: 10px !important;
                transition: all 0.2s ease;
              "
              onmouseover="
                this.style.borderColor = '#000';
                this.style.color = '#000';
                this.style.backgroundColor = '#f9f9f9';
              "
              onmouseout="
                this.style.borderColor = '#e0e0e0';
                this.style.color = '#444';
                this.style.backgroundColor = 'transparent';
              "
            >
              selesai
            </v-btn>
            <v-btn
              :disabled="!note.createdBy"
              size="20"
              class="ml-2"
              elevation="0"
              @click="deleteReminder(note.id)"
            >
              <v-icon size="15" color="red">mdi-delete-outline</v-icon>
            </v-btn>
          </div>

          <div class="sidebar-note-by" v-if="note.createdBy">
            Note By : {{ note.createdBy || "master kategori item" }}
          </div>
          <div class="sidebar-note-by" v-else>from : kategori item</div>
        </div>

        <v-divider
          v-if="
            activeDateNotes.notes?.some(
              (n) => n.status?.toLowerCase() === 'selesai',
            )
          "
          class="my-1"
        />

        <div
          v-for="(note, i) in activeDateNotes.notes?.filter(
            (n) => n.status?.toLowerCase() === 'selesai',
          )"
          :key="'selesai-' + i"
          class="sidebar-note-card"
        >
          <div
            class="sidebar-note"
            :style="{
              backgroundColor: getPerusahaanColor(note.nama_perusahaan).bg,
              color: getPerusahaanColor(note.nama_perusahaan).text,
            }"
          >
            {{ note.nama_perusahaan }} - {{ note.cabang_perusahaan }}
          </div>
          <div class="sidebar-note-desc">{{ note.desc }}</div>
          <div class="sidebar-status status-selesai">
            {{ note.status }}
          </div>
          <div class="sidebar-note-by">Note By : {{ note.createdBy }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import { ref, computed, onMounted, watch } from "vue";
import { useMasterKategoriStore } from "~/stores/master/kategoriStore";
import { useMasterPerusahaanStore } from "~/stores/master/perusahaanStore";

const dialog = ref(false);
const activeDate = ref<number | null>(null);
const itemStore = useMasterKategoriStore();
const viewDate = ref(new Date());
const today = new Date();

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const currentMonth = computed(() => viewDate.value.getMonth());
const currentYear = computed(() => viewDate.value.getFullYear());

const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);
const reminderStore = useReminderStore();
const perusahaanStore = useMasterPerusahaanStore();
const masterCabangStore = useMasterPerusahaanStore();

onMounted(async () => {
  await reminderStore.tarikDataReminderAct();
});

const new_reminder = ref<import("~/types/reminderModel").reminderM>({
  createdBy: "",
  nama_perusahaan: "",
  cabang_perusahaan: "",
  desc: "",
  status: "Pending",
  id_perusahaan: "",
  id_cabang_perusahaan: "",
  tanggal_reminder: "",
});

watch(
  () => new_reminder.value.id_perusahaan,
  async (idperusahaan) => {
    const dataperusahaan = perusahaanStore.getDataPerusahaan;
    const b = _.find(dataperusahaan, (o: any) => o.id == idperusahaan);

    if (!_.isUndefined(b)) {
      new_reminder.value.nama_perusahaan = b!.nama_perusahaan;

      await masterCabangStore.tarikDataCabangPerusahaan(b.id!);

      if (masterCabangStore.getDataCabang.length > 0) {
        notificationStore.showSuccess(
          `Berhasil memuat ${masterCabangStore.getDataCabang.length} cabang`,
        );
      }
    }
  },
);

watch(
  () => new_reminder.value.id_cabang_perusahaan,
  async (idcabang) => {
    const datacabang = masterCabangStore.getDataCabang;
    const b = _.find(datacabang, (o: any) => o.id == idcabang);

    if (!_.isUndefined(b)) {
      new_reminder.value.cabang_perusahaan = b!.nama_cabang;

      notificationStore.showInfo(
        "Silakan pilih Object untuk melihat item kategori",
      );
    }
  },
);

// Diubah agar menerima string tanggal opsional (format: YYYY-MM-DD)
async function opendialogreminder(selectedDate?: string) {
  dialog.value = true;

  if (selectedDate) {
    new_reminder.value.tanggal_reminder = selectedDate;
  } else {
    new_reminder.value.tanggal_reminder = "";
  }

  await perusahaanStore.tarikDataPerusahaanAct();
  await perusahaanStore.tarikDataCabangAct();
}

async function addReminder() {
  if (new_reminder.value.tanggal_reminder == "") {
    return notificationStore.showError("Tanggal Reminder tidak boleh kosong");
  }

  if (new_reminder.value.id_perusahaan == "") {
    return notificationStore.showError("Perusahaan harus dipilih");
  }

  if (new_reminder.value.id_cabang_perusahaan == "") {
    return notificationStore.showError("Cabang Perusahaan harus dipilih");
  }

  if (new_reminder.value.desc == "") {
    return notificationStore.showError(
      "Keterangan Reminder tidak boleh kosong",
    );
  }

  // const confirmed = await confirmationDialog.value?.show(
  //   "Konfirmasi Simpan",
  //   "Anda yakin ingin menyimpan reminder ini?",
  // );

  // if (!confirmed) {
  //   return notificationStore.showError("Simpan Reminder Dibatalkan");
  // }

  new_reminder.value.createdBy = useUserStore().getEmail;
  reminderStore.addReminderAct(new_reminder.value);
  await reminderStore.tarikDataReminderAct();
  dialog.value = false;

  new_reminder.value = {
    createdBy: "",
    nama_perusahaan: "",
    cabang_perusahaan: "",
    desc: "",
    status: "Pending",
    id_perusahaan: "",
    id_cabang_perusahaan: "",
    tanggal_reminder: "",
  };
}

async function deleteReminder(id: string) {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus reminder ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Hapus Reminder Dibatalkan");
  }

  await reminderStore.deleteReminderAct(id);
  await reminderStore.tarikDataReminderAct();
}

async function updateReminder(id: string) {
  await reminderStore.updateReminderAct("Selesai", id, useUserStore().getEmail);
  await reminderStore.tarikDataReminderAct();
}

const notesData = computed(() => {
  const grouped: Record<string, any[]> = {};

  reminderStore.getDataReminder.forEach((item: any) => {
    if (!item.tanggal_reminder) return;

    const date = new Date(item.tanggal_reminder);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push({
      createdBy: item.createdBy || "",
      nama_perusahaan:
        item.nama_perusahaan ||
        perusahaanStore.getDataPerusahaan.find(
          (p) => p.id === item.id_perusahaan,
        )?.nama_perusahaan ||
        "-",

      cabang_perusahaan:
        item.cabang_perusahaan ||
        masterCabangStore.getDataCabang.find(
          (c) => c.id === item.id_cabang_perusahaan,
        )?.nama_cabang ||
        "-",

      desc: item.keterangan_reminder || "",
      status: item.status || "pending",
    });
  });

  return grouped;
});

const changeMonth = (step) => {
  activeDateNotes.value = null;
  const newDate = new Date(viewDate.value);
  newDate.setMonth(newDate.getMonth() + step);
  viewDate.value = newDate;
};

const calendarDates = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const result = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    result.push({ empty: true });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    const reminderNotes = reminderStore.getDataReminder
      .filter((item: any) => item.tanggal_reminder === dateKey)
      .map((item: any) => ({
        ...item,
        jenis: "reminder",
      }));

    const expiredNotes = itemStore.getDataItemKategori
      .filter((item: any) => item.periode?.selesai === dateKey)
      .map((item: any) => ({
        id: item.id,
        nama_perusahaan: item.nama_perusahaan,
        cabang_perusahaan: item.nama_cabang,
        desc: `${item.nama_kategori_item} habis masa berlaku`,
        status: "Pending",
        jenis: "expired",
      }));

    const notes = [...reminderNotes, ...expiredNotes];

    result.push({
      day,
      notes,
      isToday,
      dateKey, // Disertakan ke dalam object data untuk dipassing ke dialog
    });
  }

  return result;
});

const activeDateNotes = computed(() => {
  if (!activeDate.value) return null;

  return calendarDates.value.find((d) => d.day === activeDate.value);
});

function openSidebar(date: any) {
  activeDate.value = date.day;
}

const colorPalette = [
  "darkslategray",
  "indigo",
  "navy",
  "purple",
  "teal",
  "darkgreen",
  "maroon",
  "saddlebrown",
  "crimson",
  "darkblue",
  "darkolivegreen",
  "darkmagenta",
  "chocolate",
  "cadetblue",
  "dimgray",
];

const getPerusahaanColor = (companyName: string) => {
  if (!companyName) return { bg: "grey", text: "white" };

  const cleanName = companyName.split("-")[0].trim().toUpperCase();

  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colorPalette.length;
  const selectedColor = colorPalette[index];

  return {
    bg: selectedColor,
    text: "white",
  };
};
</script>

<style scoped>
/* Menambahkan kursor pointer pada kolom tanggal agar user tahu bisa diklik */
.date-card.cursor-pointer {
  cursor: pointer;
}
.date-card.cursor-pointer:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.calendar-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;
  transition: all 0.3s ease;
}

.calendar-container.has-sidebar {
  grid-template-columns: 1fr 260px;
}

.calendar-wrapper {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #eee;
}

.calendar-header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  margin-top: 8px;
}

.month-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-action {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.title-group {
  text-align: center;
  line-height: 20px;
}

.nav-btn {
  background-color: #0071e3;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  background: #0054a9;
}

.title-group {
  text-align: center;
  width: 180px;
}

.calendar-header h2 {
  font-size: 13px;
  margin: 0;
  font-weight: 800;
  text-transform: uppercase;
}

.calendar-header span {
  font-size: 10px;
  color: #999;
}

.add-btn {
  border: none;
  background: #3c83f6;
  color: white;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
  border-bottom: 1px solid #f9f9f9;
}

.day-name {
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  color: #a8a8a8;
  padding: 6px 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.date-card {
  min-height: 80px;
  border-radius: 8px;
  padding: 5px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}

.date-card.is-today {
  background: #ededed;
  border-color: #3c83f6;
}

.date-card.is-today .date-number {
  color: #000;
  background: #fff;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.date-card.active {
  border-color: #111;
}

.date-card.empty {
  background: transparent;
  border: none;
}

.date-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.date-number {
  font-size: 11px;
  font-weight: 800;
  color: #444;
}

.badge-orange {
  font-size: 8px;
  background: #f97407;
  color: white;
  border-radius: 4px;
  padding: 1px 4px;
  line-height: 1.2;
}

.badge-biru {
  font-size: 8px;
  background-color: #2196f3;
  color: white;
  border-radius: 4px;
  padding: 1px 4px;
  line-height: 1.2;
}

.notes {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex-grow: 1;
  justify-content: flex-end;
}

.note {
  border-radius: 4px;
  padding: 3px;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.note-chip {
  color: white;
  font-size: 9px;
  font-weight: 600;
  padding: 1px 4px;
  border-radius: 3px;
  margin-bottom: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.note-desc {
  font-size: 10px;
  color: #666;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.more-btn {
  border: none;
  background: transparent;
  color: #0066cc;
  font-size: 8.5px;
  font-weight: 800;
  cursor: pointer;
  padding-top: 2px;
}

.calendar-sidebar {
  background: #fff;
  border-radius: 12px;
  border: 2px solid #dfdfdf;
  padding: 12px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 5px;
  padding-bottom: 4px;
}

.sidebar-title {
  font-size: 11px;
  line-height: 1.4;
  color: #111;
}

.close-sidebar-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #ccc;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.sidebar-note-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid #f0f0f0;
}

.sidebar-note {
  background: #525252;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 1px 4px;
  border-radius: 3px;
  margin-bottom: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.sidebar-note-desc {
  font-size: 12px;
  color: #444;
  margin-top: 4px;
  margin-bottom: 7px;
  line-height: 1.4;
}

.sidebar-note-by {
  font-size: 10px;
  color: #a3a3a3;
  margin-top: 4px;
}

.sidebar-status {
  display: inline-block;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
}

.status-pending {
  color: #7c5e10;
  background-color: #fef3c7;
}

.status-expired {
  color: #7c5e10;
  background-color: #fec7c7;
}

.status-selesai {
  color: #166534;
  background-color: #dcfce7;
}

@media (max-width: 900px) {
  .calendar-container.has-sidebar {
    grid-template-columns: 1fr;
  }
  .calendar-grid,
  .calendar-days {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 600px) {
  .calendar-grid,
  .calendar-days {
    grid-template-columns: repeat(2, 1fr);
  }
}

.custom-btn:hover {
  border-color: #1976d2 !important; /* Warna border biru */
  color: #1976d2 !important; /* Warna teks biru */
  background-color: #e3f2fd !important; /* Warna background biru sangat muda */
}
</style>
