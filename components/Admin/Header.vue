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
  <v-app-bar flat color="white" height="64" class="app-bar-border">
    <template v-slot:prepend>
      <div class="d-flex align-center ml-2">
        <img src="/public/Logo-SNS.png" alt="Logo" width="40" class="ml-4" />
      </div>
      <div class="text-center">
        <v-chip variant="outlined" class="text-primary"
          ><strong>V 1</strong></v-chip
        >
      </div>
    </template>

    <v-spacer />

    <template v-slot:append>
      <v-menu
        rounded="lg"
        transition="slide-y-transition"
        :offset="[12, 0]"
        elevation="20"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            v-bind="props"
            class="user-profile-btn px-2"
            height="44"
          >
            <v-avatar size="32" class="avatar-shadow">
              <div class="avatar-placeholder text-uppercase">
                {{ displayname[0] }}
              </div>
            </v-avatar>

            <div class="text-left ml-3 d-none d-sm-block">
              <p class="user-name text-body-2 font-weight-bold mb-0">
                {{ displayname }}
              </p>
              <p class="user-role text-caption mb-0">{{ role }}</p>
            </div>
            <v-icon size="16" class="ml-2 text-grey-darken-1"
              >mdi-chevron-down</v-icon
            >
          </v-btn>
        </template>

        <v-card min-width="240" class="profile-card border-thin">
          <div class="pa-4 d-flex align-center">
            <v-avatar size="48" class="mr-3 avatar-shadow">
              <div class="avatar-placeholder-large text-h6">
                {{ displayname[0] }}
              </div>
            </v-avatar>
            <div>
              <div class="text-subtitle-2 font-weight-bold text-slate-900">
                {{ displayname }}
              </div>
              <div class="text-caption text-slate-500 font-medium">
                {{ role }}
              </div>
            </div>
          </div>

          <v-divider />

          <div class="pa-2">
            <v-list density="compact" nav class="bg-transparent pa-0">
              <!-- <v-list-item 
            prepend-icon="mdi-account-outline" 
            title="Profil Saya" 
            value="profile"
            rounded="md"
            class="menu-item"
          ></v-list-item> -->
              <v-list-item
                prepend-icon="mdi-cog-outline"
                title="User Management"
                value="settings"
                rounded="md"
                to="/admin/master/users"
                class="menu-item"
              ></v-list-item>
            </v-list>
          </div>

          <v-divider />

          <div class="pa-2">
            <v-btn
              block
              variant="text"
              color="error"
              prepend-icon="mdi-logout-variant"
              class="justify-start logout-btn"
              @click="logout"
              rounded="md"
            >
              Keluar
            </v-btn>
          </div>
        </v-card>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<style scoped>

/* MENYEMBUNYIKAN SCROLLBAR */
:deep(.v-navigation-drawer__content) {
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

:deep(.v-navigation-drawer__content::-webkit-scrollbar) {
  display: none; /* Chrome, Safari, Opera */
}

/* UI Components */
.app-bar-border {
  border-bottom: 1px solid #e2e8f0 !important;
  box-shadow: 0 2px 12px rgba(30, 58, 138, 0.08) !important;
}

.logo-container {
  height: 80px;
  padding: 0 16px;
  transition: all 0.3s ease;
}

.logo-img {
  max-width: 100%;
  max-height: 60px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  transition: all 0.3s ease;
}

.logo-rail {
  max-height: 32px;
}

.avatar-gradient {
  background: linear-gradient(135deg, #eb2525 0%, #d81d1d 100%) !important;
}

.logout-item {
  background: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
}

.text-slate-500 {
  color: #64748b;
}
.text-slate-800 {
  color: #1e293b;
}

:deep(.v-list-item--active) {
  background: rgba(255, 255, 255, 0.2) !important;
  border-left: 4px solid white;
}

/* Button Styling */
.user-profile-btn {
  text-transform: none !important;
  letter-spacing: normal !important;
  border-radius: 8px !important;
  transition: all 0.2s ease;
}

.user-profile-btn:hover {
  background-color: rgba(0, 0, 0, 0.04) !important;
}

/* Avatar Styling */
.avatar-placeholder {
  background: linear-gradient(135deg, #fc2626 0%, #e01f1f 100%);
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.avatar-placeholder-large {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #fc2626;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.avatar-shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Typography */
.user-name {
  color: #1e293b; /* Slate 800 */
  line-height: 1.2;
}

.user-role {
  color: #64748b; /* Slate 500 */
}

/* Dropdown Card */
.profile-card {
  border: 1px solid #e2e8f0 !important;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

.menu-item {
  color: #475569 !important;
  font-size: 0.875rem !important;
}

.menu-item:hover {
  background-color: #f1f5f9 !important;
  color: #1e293b !important;
}

.logout-btn {
  text-transform: none !important;
  font-weight: 600;
  letter-spacing: 0;
}

/* Helper Class */
.text-slate-500 {
  color: #64748b;
}
.text-slate-900 {
  color: #0f172a;
}
</style>
