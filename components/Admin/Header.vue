```vue
<script setup>
import { ref, computed, watchEffect } from "vue";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/stores/userStore";
import { getAuth, signOut } from "firebase/auth";
import { navigateTo } from "#app";

const { width } = useDisplay();
const useuser = useUserStore();

/* =========================
   DRAWER
========================= */

const drawer = ref(width.value > 500);

watchEffect(() => {
  if (width.value < 500) {
    drawer.value = false;
  }
});

/* =========================
   USER
========================= */

const displayname = computed(() => useuser.getDisplayName || "Admin");

const role = computed(() => useuser.getRole || "Administrator");

/* =========================
   LOGOUT
========================= */

const logout = async () => {
  const auth = getAuth();

  try {
    await signOut(auth);

    useuser.setUser(null);

    await navigateTo("/");
  } catch (error) {
    console.error("Logout gagal:", error);
  }
};
</script>

<template>
  <v-app-bar flat color="white" height="68" class="app-bar-border">
    <!-- =====================================================
         HEADER KIRI
    ====================================================== -->
    <template #prepend>
      <div class="header-left">
        <!-- LOGO -->
        <div class="logo-box">
          <img
            src="/public/Logo-SNS.png"
            alt="CV. Solusi Nusa Segara"
            class="logo-img"
          />
        </div>

        <!-- COMPANY INFO -->
        <div class="company-info">
          <!-- Desktop -->
          <span class="company-name desktop-company">
            CV. SOLUSI NUSA SEGARA
          </span>

          <!-- Mobile -->
          <span class="company-name mobile-company">
            CV. SOLUSI NUSA SEGARA
          </span>

          <span class="company-subtitle"> Enterprise Management System </span>
        </div>

        <!-- VERSION -->
        <v-chip
          size="x-small"
          color="primary"
          variant="outlined"
          class="version-chip"
        >
          Update Version. 2
        </v-chip>

        <v-btn
    variant="outlined"
    color="primary"
    size="small"
    prepend-icon="mdi-home-outline"
    to="/admin"
    class="text-capitalize font-weight-bold"
  >
    Home
  </v-btn>
      </div>
    </template>

    <v-spacer />

    <!-- =====================================================
         HEADER KANAN
    ====================================================== -->
    <template #append>
      <div class="header-right">
        <!-- =================================================
             NOTIFICATION
        ================================================== -->
        <v-btn
          icon
          variant="text"
          size="small"
          color="slate-600"
          class="notification-btn"
        >
          <v-badge dot color="error" offset-x="-2" offset-y="-2">
            <v-icon size="20"> mdi-bell-outline </v-icon>
          </v-badge>
        </v-btn>

        <!-- DIVIDER -->
        <v-divider vertical inset class="header-divider" />

        <!-- =================================================
             USER PROFILE
        ================================================== -->
        <v-menu
          rounded="xl"
          transition="slide-y-transition"
          :offset="[12, 0]"
          elevation="16"
        >
          <!-- ACTIVATOR -->
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              class="user-profile-btn"
              height="48"
            >
              <!-- AVATAR -->
              <v-avatar size="36" class="avatar-shadow">
                <div class="avatar-placeholder text-uppercase font-weight-bold">
                  {{ displayname[0] }}
                </div>
              </v-avatar>

              <!-- USER INFORMATION -->
              <div class="user-info">
                <p class="user-name">
                  {{ displayname }}
                </p>

                <p class="user-role">
                  {{ role }}
                </p>
              </div>

              <!-- CHEVRON -->
              <v-icon size="18" class="profile-chevron">
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </template>

          <!-- =================================================
               PROFILE DROPDOWN
          ================================================== -->
          <v-card
            min-width="260"
            class="profile-card border-thin overflow-hidden rounded-xl"
          >
            <!-- PROFILE HEADER -->
            <div class="pa-4 profile-card-header d-flex align-center">
              <v-avatar size="44" class="mr-3 avatar-shadow">
                <div class="avatar-placeholder text-h6 font-weight-bold">
                  {{ displayname[0] }}
                </div>
              </v-avatar>

              <div class="overflow-hidden">
                <div
                  class="text-subtitle-2 font-weight-bold text-slate-900 text-truncate"
                >
                  {{ displayname }}
                </div>

                <v-chip
                  size="x-small"
                  color="primary"
                  variant="tonal"
                  class="mt-1 font-weight-semibold"
                >
                  {{ role }}
                </v-chip>
              </div>
            </div>

            <v-divider />

            <!-- MENU -->
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

            <!-- LOGOUT -->
            <div class="pa-2 bg-slate-50">
              <v-btn
                block
                variant="flat"
                color="error-lighten-5"
                class="logout-btn justify-start"
                rounded="lg"
                to="/"
              >
                <template #prepend>
                  <v-icon color="error"> mdi-logout-variant </v-icon>
                </template>

                <span class="text-error font-weight-semibold"> Keluar </span>
              </v-btn>
            </div>
          </v-card>
        </v-menu>
      </div>
    </template>
  </v-app-bar>
</template>

<style scoped>
/* =========================================================
   APP BAR
========================================================= */

.app-bar-border {
  border-bottom: 1px solid #f1f5f9 !important;

  background: rgba(255, 255, 255, 0.96) !important;

  backdrop-filter: blur(8px);

  padding: 0 8px !important;
}

/* =========================================================
   HEADER LEFT
========================================================= */

.header-left {
  display: flex;

  align-items: center;

  gap: 12px;

  min-width: 0;
}

/* =========================================================
   LOGO
========================================================= */

.logo-box {
  width: 40px;
  height: 40px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 5px;

  border-radius: 10px;
}

.logo-img {
  width: 30px;
  height: 30px;

  object-fit: contain;
}

/* =========================================================
   COMPANY
========================================================= */

.company-info {
  display: flex;

  flex-direction: column;

  min-width: 0;

  line-height: 1.2;
}

.company-name {
  font-size: 14px;

  font-weight: 700;

  color: #0f172a;

  white-space: nowrap;
}

.company-subtitle {
  margin-top: 2px;

  font-size: 11px;

  color: #64748b;

  white-space: nowrap;
}

/* =========================================================
   VERSION
========================================================= */

.version-chip {
  flex-shrink: 0;

  margin-left: 2px;
}

/* =========================================================
   HEADER RIGHT
========================================================= */

.header-right {
  display: flex;

  align-items: center;

  gap: 4px;
}

.notification-btn {
  border-radius: 10px !important;
}

.header-divider {
  height: 28px;

  margin: 0 6px;

  opacity: 0.2;
}

/* =========================================================
   USER PROFILE
========================================================= */

.user-profile-btn {
  text-transform: none !important;

  border-radius: 12px !important;

  padding: 4px 8px !important;

  min-width: auto !important;

  transition: background-color 0.2s ease;
}

.user-profile-btn:hover {
  background-color: #f8fafc !important;
}

/* =========================================================
   USER INFO
========================================================= */

.user-info {
  text-align: left;

  margin-left: 10px;

  min-width: 0;
}

.user-name {
  margin: 0;

  font-size: 13px;

  font-weight: 700;

  color: #0f172a;

  max-width: 140px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.user-role {
  margin: 2px 0 0;

  font-size: 11px;

  color: #64748b;

  max-width: 140px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.profile-chevron {
  margin-left: 6px;

  color: #94a3b8;
}

/* =========================================================
   AVATAR
========================================================= */

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

/* =========================================================
   PROFILE CARD
========================================================= */

.profile-card {
  border: 1px solid #e2e8f0 !important;

  box-shadow:
    0 20px 25px -5px rgba(15, 23, 42, 0.08),
    0 8px 10px -6px rgba(15, 23, 42, 0.04) !important;
}

.profile-card-header {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

/* =========================================================
   MENU ITEM
========================================================= */

.menu-item {
  color: #475569 !important;

  font-size: 0.875rem !important;

  transition: all 0.15s ease;
}

.menu-item:hover {
  background-color: #f1f5f9 !important;

  color: #0f172a !important;
}

/* =========================================================
   LOGOUT
========================================================= */

.logout-btn {
  text-transform: none !important;

  letter-spacing: 0;

  background-color: #fef2f2 !important;

  transition: background-color 0.2s ease;
}

.logout-btn:hover {
  background-color: #fee2e2 !important;
}

/* =========================================================
   COLOR UTILITY
========================================================= */

.text-slate-400 {
  color: #94a3b8;
}

.text-slate-500 {
  color: #64748b;
}

.text-slate-600 {
  color: #475569;
}

.text-slate-900 {
  color: #0f172a;
}

.bg-slate-50 {
  background-color: #f8fafc;
}

/* =========================================================
   DEFAULT
========================================================= */

.mobile-company {
  display: none;
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 800px) {
  .header-left {
    gap: 9px;
  }

  .company-name {
    font-size: 13px;
  }

  .version-chip {
    display: none;
  }

  .user-name {
    max-width: 100px;
  }

  .user-role {
    max-width: 100px;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .app-bar-border {
    padding: 0 4px !important;
  }

  /* LEFT */

  .header-left {
    gap: 8px;
  }

  /* LOGO */

  .logo-box {
    width: 36px;

    height: 36px;

    padding: 4px;

    border-radius: 9px;
  }

  .logo-img {
    width: 27px;

    height: 27px;
  }

  /* COMPANY */

  .desktop-company {
    display: none;
  }

  .mobile-company {
    display: inline;
  }

  .company-name {
    font-size: 13px;
  }

  /* VERSION */

  .version-chip {
    display: none;
  }

  /* RIGHT */

  .header-right {
    gap: 0;
  }

  /* NOTIFICATION */

  .notification-btn {
    display: none;
  }

  /* DIVIDER */

  .header-divider {
    display: none;
  }

  /* PROFILE */

  .user-profile-btn {
    padding: 4px !important;

    min-width: 42px !important;

    width: 42px !important;
  }

  /* USER INFO */

  .user-info {
    display: none;
  }

  /* CHEVRON */

  .profile-chevron {
    display: none;
  }
}

/* =========================================================
   SMALL PHONE
========================================================= */

@media (max-width: 380px) {
  .company-name {
    font-size: 12px;
  }

  .header-left {
    gap: 6px;
  }

  .logo-box {
    width: 34px;

    height: 34px;
  }

  .logo-img {
    width: 25px;

    height: 25px;
  }
}
</style>
```
