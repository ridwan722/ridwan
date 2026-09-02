<script setup>
import _ from "lodash";
import { ref, computed, watchEffect } from "vue";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/stores/userStore";
import { getAuth, signOut } from "firebase/auth";
import { navigateTo } from "#app";

const { width } = useDisplay();
const useuser = useUserStore();

const drawer = ref(width.value > 500);

watchEffect(() => {
  if (width.value < 500) {
    drawer.value = false;
  }
});

const displayname = computed(() => useuser.getDisplayName || "Admin");
const role = computed(() => useuser.getRole || "Administrator");

const logout = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    useuser.setUser(null);
    navigateTo("/");
  } catch (error) {
    console.error("Logout gagal:", error);
  }
};
</script>

<template>
  <v-app-bar flat color="white" height="68" class="app-bar-border">
    <!-- Header Kiri: Logo + Title + Version -->
    <template v-slot:prepend>
      <div class="d-flex align-center ga-3 ml-2">
        <div class="logo-box d-flex align-center justify-center pa-2 rounded-lg">
          <img src="/public/Logo-SNS.png" alt="Logo" width="32" height="32" class="object-contain" />
        </div>
        
        <div class="d-flex flex-column">
          <span class="text-subtitle-2 font-weight-bold text-slate-900 line-height-tight">
            CV. SOLUSI NUSA SEGARA
          </span>
          <span class="text-caption text-slate-500 line-height-tight">
            Enterprise Management System
          </span>
        </div>

        <v-chip size="x-small" color="primary" variant="outlined" class="ml-1 shadow-sm">
          Update Version. 2
        </v-chip>
      </div>
    </template>

    <v-spacer />

    <!-- Header Kanan: Quick Actions & Profile Menu -->
    <template v-slot:append>
      <div class="d-flex align-center ga-2 mr-2">
        <!-- Elemen Tambahan: Icon Bell Notifikasi agar tidak sepi -->
        <v-btn icon variant="text" size="small" color="slate-600" class="rounded-lg">
          <v-badge dot color="error" offset-x="-2" offset-y="-2">
            <v-icon size="20">mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>

        <v-divider vertical inset class="my-4 mx-1 opacity-20" />

        <!-- User Profile Dropdown -->
        <v-menu
          rounded="xl"
          transition="slide-y-transition"
          :offset="[12, 0]"
          elevation="16"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              variant="text"
              v-bind="props"
              class="user-profile-btn px-2"
              height="48"
            >
              <v-avatar size="36" class="avatar-shadow border-2 border-white">
                <div class="avatar-placeholder text-uppercase font-weight-bold">
                  {{ displayname[0] }}
                </div>
              </v-avatar>

              <div class="text-left ml-3 d-none d-sm-block">
                <p class="user-name text-body-2 font-weight-bold mb-0">
                  {{ displayname }}
                </p>
                <p class="user-role text-caption text-slate-500 mb-0">
                  {{ role }}
                </p>
              </div>
              <v-icon size="18" class="ml-2 text-slate-400">mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-card min-width="260" class="profile-card border-thin overflow-hidden rounded-xl">
            <!-- Header Dropdown Card -->
            <div class="pa-4 profile-card-header d-flex align-center">
              <v-avatar size="44" class="mr-3 avatar-shadow border-2 border-white">
                <div class="avatar-placeholder text-h6 font-weight-bold">
                  {{ displayname[0] }}
                </div>
              </v-avatar>
              <div class="overflow-hidden">
                <div class="text-subtitle-2 font-weight-bold text-slate-900 text-truncate">
                  {{ displayname }}
                </div>
                <v-chip size="x-small" color="primary" variant="tonal" class="mt-1 font-weight-semibold">
                  {{ role }}
                </v-chip>
              </div>
            </div>

            <v-divider />

            <div class="pa-2">
              <v-list density="compact" nav class="bg-transparent pa-0">
                <v-list-item
                  prepend-icon="mdi-shield-account-outline"
                  title="User Management"
                  value="settings"
                  rounded="lg"
                  to="/admin/master/users"
                  class="menu-item py-2"
                />
              </v-list>
            </div>

            <v-divider />

            <div class="pa-2 bg-slate-50">
              <v-btn
                block
                variant="flat"
                color="error-lighten-5"
                class="logout-btn justify-start"
                @click="logout"
                rounded="lg"
              >
                <template v-slot:prepend>
                  <v-icon color="error">mdi-logout-variant</v-icon>
                </template>
                <span class="text-error font-weight-semibold">Keluar</span>
              </v-btn>
            </div>
          </v-card>
        </v-menu>
      </div>
    </template>
  </v-app-bar>
</template>

<style scoped>
/* Menyembunyikan Scrollbar */
:deep(.v-navigation-drawer__content) {
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

:deep(.v-navigation-drawer__content::-webkit-scrollbar) {
  display: none;
}

/* App Bar & Frame Styling */
.app-bar-border {
  border-bottom: 1px solid #f1f5f9 !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(8px);
}

.logo-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.line-height-tight {
  line-height: 1.25;
}

/* Avatar Gradient */
.avatar-placeholder {
  background: linear-gradient(135deg, #fc2626 0%, #b91c1c 100%);
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-shadow {
  box-shadow: 0 2px 6px rgba(220, 38, 38, 0.25);
}

/* Hover & Button Interactive Styles */
.user-profile-btn {
  text-transform: none !important;
  border-radius: 12px !important;
  transition: all 0.2s ease;
}

.user-profile-btn:hover {
  background-color: #f8fafc !important;
}

/* Profile Card Modal Dropdown */
.profile-card {
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04) !important;
}

.profile-card-header {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.menu-item {
  color: #475569 !important;
  font-size: 0.875rem !important;
  transition: all 0.15s ease;
}

.menu-item:hover {
  background-color: #f1f5f9 !important;
  color: #0f172a !important;
}

.logout-btn {
  text-transform: none !important;
  letter-spacing: 0;
  background-color: #fef2f2 !important;
  transition: background-color 0.2s ease;
}

.logout-btn:hover {
  background-color: #fee2e2 !important;
}

/* Color Palette Utility Classes */
.text-slate-400 { color: #94a3b8; }
.text-slate-500 { color: #64748b; }
.text-slate-600 { color: #475569; }
.text-slate-900 { color: #0f172a; }
.bg-slate-50 { background-color: #f8fafc; }
</style>