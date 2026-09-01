<script setup lang="ts">
import { useDisplay } from "vuetify";

definePageMeta({
  layout: "admin",
});
</script>

<template>
  <div class="mobile-app-page">
    <div class="content-inner">
      <!-- Dashboard Banner -->
      <div class="dashboard-banner">
        <div class="banner-icon">
          <v-icon icon="mdi-view-dashboard" size="26" color="#ffffff" />
        </div>

        <div class="banner-text">
          <span class="banner-title"> Dashboard & Menu </span>
          <span class="banner-sub"> Ringkasan data & statistik bisnis </span>
        </div>
      </div>

      <!-- ================= MASTER ================= -->
      <section class="menu-section">
        <div class="section-header">
          <span class="section-title"> MASTER </span>
        </div>

        <v-expand-transition>
          <div class="grid-container">
            <!-- Master Data -->
            <div class="menu-card-group">
              <div class="group-label">
                <div class="group-label-left">
                  <v-icon
                    icon="mdi-layers-outline"
                    size="18"
                    class="label-icon"
                  />
                  <span> Master Data </span>
                </div>
              </div>

              <div class="sub-grid">
                <NuxtLink to="/admin/master/users" class="app-card">
                  <div class="card-icon icon-blue">
                    <v-icon icon="mdi-account-group-outline" size="22" />
                  </div>
                  <span class="card-label"> System Users </span>
                </NuxtLink>
              </div>
              <div class="sub-grid mt-3">
                <NuxtLink to="/admin/master/client" class="app-card">
                  <div class="card-icon icon-blue">
                    <v-icon icon="mdi-corporate" size="22" />
                  </div>
                  <span class="card-label"> Client </span>
                </NuxtLink>
              </div>
            </div>

            <!-- Invoice -->
            <div class="menu-card-group">
              <div class="group-label clickable">
                <div class="group-label-left">
                  <v-icon
                    icon="mdi-receipt-text-outline"
                    size="18"
                    class="label-icon"
                  />
                  <span> Penawaran </span>
                </div>
              </div>

              <v-expand-transition>
                <div class="grid-3-col">
                  <NuxtLink to="/admin/penawaran" class="app-card">
                    <div class="card-icon icon-indigo">
                      <v-icon icon="mdi-file-document-outline" size="20" />
                    </div>
                    <span class="card-label"> Penawaran </span>
                  </NuxtLink>

                  <NuxtLink to="/admin/penawaran/dikirim" class="app-card">
                    <div class="card-icon icon-purple">
                      <v-icon icon="mdi-truck-delivery-outline" size="20" />
                    </div>
                    <span class="card-label"> Penawaran Dikirim </span>
                  </NuxtLink>

                  <NuxtLink to="/admin/penawaran/selesai" class="app-card">
                    <div class="card-icon icon-teal">
                      <v-icon icon="mdi-check-circle-outline" size="20" />
                    </div>
                    <span class="card-label"> Penawaran Selesai </span>
                  </NuxtLink>
                </div>
              </v-expand-transition>

              <div class="group-label clickable mt-2">
                <div class="group-label-left">
                  <v-icon
                    icon="mdi-receipt-text-outline"
                    size="18"
                    class="label-icon"
                  />
                  <span> Invoice </span>
                </div>
              </div>

              <v-expand-transition>
                <div class="grid-3-col">
                  <NuxtLink to="/admin/invoice" class="app-card">
                    <div class="card-icon icon-indigo">
                      <v-icon icon="mdi-file-document-outline" size="20" />
                    </div>
                    <span class="card-label"> Invoice </span>
                  </NuxtLink>

                  <NuxtLink to="/admin/invoice/dikirim" class="app-card">
                    <div class="card-icon icon-purple">
                      <v-icon icon="mdi-truck-delivery-outline" size="20" />
                    </div>
                    <span class="card-label"> Invoice Dikirim </span>
                  </NuxtLink>

                  <NuxtLink to="/admin/invoice/selesai" class="app-card">
                    <div class="card-icon icon-teal">
                      <v-icon icon="mdi-check-circle-outline" size="20" />
                    </div>
                    <span class="card-label"> Invoice Selesai </span>
                  </NuxtLink>
                </div>
              </v-expand-transition>
            </div>

            <!-- Petty Cash -->
            <div class="menu-card-group direct-menu">
              <div class="group-label clickable">
                <div class="group-label-left">
                  <v-icon
                    icon="mdi-cash-multiple"
                    size="18"
                    class="label-icon"
                  />
                  <span> Keuangan </span>
                </div>
              </div>

              <v-expand-transition>
                <div class="sub-grid">
                  <NuxtLink to="/admin/petty-cash" class="app-card">
                    <div class="card-icon icon-emerald">
                      <v-icon icon="mdi-cash-multiple" size="22" />
                    </div>
                    <span class="card-label"> Petty Cash </span>
                  </NuxtLink>
                </div>
              </v-expand-transition>
            </div>
          </div>
        </v-expand-transition>
      </section>
    </div>

    <!-- ================= BOTTOM NAV ================= -->
    <!-- <nav v-if="mobile" class="bottom-nav">
      <NuxtLink to="/admin/dashboard" class="nav-item active">
        <v-icon icon="mdi-home-variant" size="22" />
        <span> Beranda </span>
      </NuxtLink>

      <NuxtLink to="/admin/petty-cash" class="nav-item">
        <v-icon icon="mdi-wallet-outline" size="22" />
        <span> Keuangan </span>
      </NuxtLink>

      <NuxtLink to="/admin/" class="nav-item text-danger">
        <v-icon icon="mdi-logout" size="22" />
        <span> Keluar </span>
      </NuxtLink>
    </nav> -->
  </div>
</template>

<style scoped>
/* =========================================================
   BASE & MOBILE FIRST (0px - 767px)
========================================================= */

.mobile-app-page {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
}

/* CONTENT */
.content-scroll {
  position: relative;
  z-index: 2;
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 100px;
}

.content-inner {
  width: 100%;
  max-width: 1180px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* DASHBOARD BANNER */
.dashboard-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, #eb2525 0%, #d81d1d 100%);
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.dashboard-banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.28);
}

.banner-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.banner-title {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}

.banner-sub {
  margin-top: 2px;
  font-size: 11px;
  color: #bfdbfe;
}

.banner-arrow {
  color: #ffffff;
}

/* SECTION */
.menu-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  cursor: pointer;
}

.section-title {
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
}

/* =========================================================
   GRID RESPONSIVE (MOBILE FIX)
========================================================= */

/* Default Mobile: Standard 1 Kolom */
.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.menu-card-group {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.direct-menu {
  height: fit-content;
}

.group-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
}

.group-label-left {
  display: flex;
  align-items: center;
}

.label-icon {
  color: #eb2525;
  margin-right: 6px;
}

.clickable {
  cursor: pointer;
}

.sub-grid {
  display: grid;
  grid-template-columns: 1fr;
}

/* Grid 3 Kolom di Mobile disesuaikan ke 2-3 kolom otomatis berdasarkan lebar */
.grid-3-col {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 10px;
}

/* APP CARD */
.app-card {
  height: 100%;
  min-height: 90px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.app-card:hover {
  transform: translateY(-2px);
  border-color: #cbd5e1;
  background: #f8fafc;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
}

.app-card:active {
  transform: scale(0.97);
}

.card-label {
  font-size: 11px;
  font-weight: 600;
  color: #334155;
  text-align: center;
  line-height: 1.2;
}

/* ICONS */
.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-blue {
  background: #eff6ff;
  color: #2563eb;
}

.icon-emerald {
  background: #ecfdf5;
  color: #059669;
}

.icon-indigo {
  background: #e0e7ff;
  color: #4f46e5;
}

.icon-purple {
  background: #faf5ff;
  color: #9333ea;
}

.icon-teal {
  background: #ccfbf1;
  color: #0d9488;
}

/* BOTTOM NAV */
.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-around;
  padding: 10px 0 14px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.03);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 600;
}

.nav-item.active {
  color: #eb2525;
}

.text-danger {
  color: #ef4444;
}

/* =========================================================
   TABLET (min-width: 640px / 768px)
========================================================= */

@media (min-width: 640px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .content-scroll {
    padding: 24px 24px 110px;
  }

  .dashboard-banner {
    padding: 20px;
  }

  .banner-title {
    font-size: 17px;
  }

  .banner-sub {
    font-size: 12px;
  }

  .grid-container {
    gap: 16px;
  }

  .menu-card-group {
    padding: 18px;
  }

  .app-card {
    min-height: 110px;
    padding: 14px 10px;
  }

  .card-label {
    font-size: 11.5px;
  }

  .card-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
  }
}

/* =========================================================
   DESKTOP (min-width: 1024px)
========================================================= */

@media (min-width: 1024px) {
  .content-scroll {
    padding: 32px 32px 40px;
  }

  .content-inner {
    max-width: 1180px;
    gap: 24px;
  }

  .dashboard-banner {
    min-height: 86px;
    padding: 20px 24px;
    border-radius: 18px;
  }

  .banner-icon {
    width: 50px;
    height: 50px;
    border-radius: 15px;
  }

  .banner-title {
    font-size: 17px;
  }

  .banner-sub {
    font-size: 12px;
  }

  .section-title {
    font-size: 13px;
  }

  /* Desktop layout 3 kolom */
  .grid-container {
    grid-template-columns: 1fr 1.5fr 0.7fr;
    align-items: start;
    gap: 16px;
  }

  .menu-card-group {
    min-height: 170px;
    padding: 18px;
    border-radius: 18px;
  }

  .app-card {
    min-height: 115px;
    border-radius: 14px;
  }

  .bottom-nav {
    position: fixed;
    top: 0;
    right: 0;
    bottom: auto;
    left: auto;
    width: auto;
    height: 76px;
    padding: 0 32px;
    background: transparent;
    border: 0;
    box-shadow: none;
    gap: 20px;
    justify-content: flex-end;
    pointer-events: none;
  }

  .nav-item {
    pointer-events: auto;
    display: flex;
    flex-direction: row;
    gap: 6px;
    padding: 9px 14px;
    border-radius: 10px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    font-size: 11px;
  }
}

/* =========================================================
   LARGE DESKTOP (min-width: 1400px)
========================================================= */

@media (min-width: 1400px) {
  .content-inner {
    max-width: 1280px;
  }

  .content-scroll {
    padding-top: 36px;
  }

  .app-card {
    min-height: 125px;
  }
}
</style>
