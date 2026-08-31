<script setup>
import { ref } from "vue";

definePageMeta({
  layout: "blank",
});

// State untuk toggle accordion section
const isMasterOpen = ref(true);
const isInvOpen = ref(true);
</script>

<template>
  <div class="mobile-app-page">
    <!-- Top Header Profile -->
    <header class="app-header">
      <div class="user-profile">
        <v-avatar color="primary" size="42" class="avatar-shadow">
          <span class="text-subtitle-2 font-weight-bold text-white">AD</span>
        </v-avatar>
        <div class="user-info">
          <span class="greeting">Selamat Datang,</span>
          <h3 class="user-name">Administrator</h3>
        </div>
      </div>
      <div class="header-actions">
        <v-btn icon variant="flat" class="icon-btn">
          <v-icon icon="mdi-bell-outline" size="20" color="#64748b" />
        </v-btn>
      </div>
    </header>

    <!-- Scroll Content Area -->
    <main class="content-scroll">
      <!-- Quick Dashboard Hero Banner -->
      <NuxtLink to="/admin/dashboard" class="dashboard-banner">
        <div class="banner-icon">
          <v-icon icon="mdi-view-dashboard" size="26" color="#ffffff" />
        </div>
        <div class="banner-text">
          <span class="banner-title">Dashboard Utama</span>
          <span class="banner-sub">Ringkasan data & statistik bisnis</span>
        </div>
        <v-icon icon="mdi-chevron-right" class="banner-arrow" />
      </NuxtLink>

      <!-- SECTION: MASTER -->
      <section class="menu-section">
        <div class="section-header" @click="isMasterOpen = !isMasterOpen">
          <span class="section-title">MASTER</span>
          <v-icon :icon="isMasterOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="18" color="#94a3b8" />
        </div>

        <div v-show="isMasterOpen" class="grid-container">
          <!-- Master Data Group -->
          <div class="menu-card-group">
            <div class="group-label">
              <v-icon icon="mdi-layers-outline" size="18" class="label-icon" />
              <span>Master Data</span>
            </div>
            <div class="sub-grid">
              <NuxtLink to="/admin/master/user-management" class="app-card">
                <div class="card-icon icon-blue">
                  <v-icon icon="mdi-account-group-outline" size="22" />
                </div>
                <span class="card-label">User Management</span>
              </NuxtLink>
            </div>
          </div>

          <!-- INV Solusi Nusa Group -->
          <div class="menu-card-group">
            <div class="group-label" @click.stop="isInvOpen = !isInvOpen">
              <div class="d-flex align-center">
                <v-icon icon="mdi-receipt-text-outline" size="18" class="label-icon" />
                <span>INV Solusi Nusa ...</span>
              </div>
              <v-icon :icon="isInvOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="16" color="#94a3b8" />
            </div>

            <div v-show="isInvOpen" class="grid-3-col">
              <NuxtLink to="/admin/invoice" class="app-card">
                <div class="card-icon icon-indigo">
                  <v-icon icon="mdi-file-document-outline" size="20" />
                </div>
                <span class="card-label">Invoice</span>
              </NuxtLink>

              <NuxtLink to="/admin/invoice/dikirim" class="app-card">
                <div class="card-icon icon-purple">
                  <v-icon icon="mdi-truck-delivery-outline" size="20" />
                </div>
                <span class="card-label">Dikirim</span>
              </NuxtLink>

              <NuxtLink to="/admin/invoice/selesai" class="app-card">
                <div class="card-icon icon-teal">
                  <v-icon icon="mdi-check-circle-outline" size="20" />
                </div>
                <span class="card-label">Selesai</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Direct Menu Cards -->
          <div >
            <NuxtLink to="/admin/petty-cash" class="app-card">
              <div class="card-icon icon-emerald">
                <v-icon icon="mdi-cash-multiple" size="22" />
              </div>
              <span class="card-label">Petty Cash</span>
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <!-- Bottom Navigation Bar -->
    <nav class="bottom-nav">
      <NuxtLink to="/admin/dashboard" class="nav-item active">
        <v-icon icon="mdi-home-variant" size="22" />
        <span>Beranda</span>
      </NuxtLink>
      <NuxtLink to="/admin/petty-cash" class="nav-item">
        <v-icon icon="mdi-wallet-outline" size="22" />
        <span>Keuangan</span>
      </NuxtLink>
      <NuxtLink to="/admin/" class="nav-item text-danger">
        <v-icon icon="mdi-logout" size="22" />
        <span>Keluar</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
/* Base Layout Light Mode */
.mobile-app-page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: #f8fafc; /* Warm Light Gray */
  color: #0f172a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header App */
.app-header {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-shadow {
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.greeting {
  font-size: 11px;
  color: #64748b;
}

.user-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.2;
}

.icon-btn {
  background: #f1f5f9 !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 12px !important;
}

/* Scroll Area */
.content-scroll {
  position: relative;
  z-index: 2;
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 90px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Dashboard Banner Card */
.dashboard-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  padding: 16px;
  border-radius: 20px;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
}

.banner-icon {
  background: rgba(255, 255, 255, 0.2);
  width: 44px;
  height: 44px;
  border-radius: 14px;
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
  font-size: 11px;
  color: #93c5fd;
}

.banner-arrow {
  color: #ffffff;
}

/* Sections & Collapsible */
.menu-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
  cursor: pointer;
}

.section-title {
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
}

.grid-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Menu Card Group */
.menu-card-group {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.group-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 12px;
}

.label-icon {
  color: #2563eb;
  margin-right: 6px;
}

/* Grid Layouts */
.grid-2-col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.grid-3-col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.sub-grid {
  display: flex;
  flex-direction: column;
}

/* App Card Button */
.app-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 14px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

.app-card:active {
  transform: scale(0.96);
  background: #f8fafc;
}

.card-label {
  font-size: 11.5px;
  font-weight: 600;
  color: #334155;
  text-align: center;
  line-height: 1.2;
}

/* Icon Soft Colors */
.card-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-blue { background: #eff6ff; color: #2563eb; }
.icon-emerald { background: #ecfdf5; color: #059669; }
.icon-amber { background: #fffbeb; color: #d97706; }
.icon-indigo { background: #e0e7ff; color: #4f46e5; }
.icon-purple { background: #faf5ff; color: #9333ea; }
.icon-teal { background: #ccfbf1; color: #0d9488; }

/* Bottom Nav Bar */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
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
  color: #2563eb;
}

.text-danger {
  color: #ef4444;
}
</style>