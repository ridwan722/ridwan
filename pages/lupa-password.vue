<script setup lang="ts">
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

definePageMeta({
  layout: "blank",
});

const auth = getAuth();
const notificationStore = useNotificationStore();
const loadingStore = useloadingStore();

const email = ref("");

// ===============================
// 📧 FUNGSI RESET PASSWORD
// ===============================
const handleResetPassword = async () => {
  if (!email.value) {
    notificationStore.showError("Silakan masukkan email Anda");
    return;
  }

  loadingStore.setLoading(true);

  try {
    // Firebase mengirimkan email reset password otomatis
    await sendPasswordResetEmail(auth, email.value);

    notificationStore.showSuccess(
      "Link reset password telah dikirim ke email Anda. Silakan cek Inbox atau Spam."
    );

    // Redirect kembali ke login setelah 3 detik agar user sempat membaca notifikasi
    setTimeout(() => {
      navigateTo("/login"); // Sesuaikan dengan route login Anda
    }, 3500);
  } catch (error: any) {
    console.error("Reset password error:", error);

    if (error.code === "auth/user-not-found") {
      notificationStore.showError("Email tidak terdaftar di sistem kami");
    } else if (error.code === "auth/invalid-email") {
      notificationStore.showError("Format email tidak valid");
    } else {
      notificationStore.showError("Terjadi kesalahan, coba lagi nanti");
    }
  } finally {
    loadingStore.setLoading(false);
  }
};
</script>

<template>
  <div class="welcome-page">
    <div class="header-wrapper">
      <div class="header-triangle border-layer"></div>
      <div class="header-triangle main-layer">
        <img
          src="https://imagedelivery.net/_tN3dTar-XzU6X9_PBgTbA/ce75ea4b-2d01-4d6c-d59f-4ba28e301b00/heromobile"
          alt="Aresa Logo"
          :width="$vuetify.display.smAndDown ? 180 : 250"
          class="logo"
        />
      </div>
    </div>

    <div class="content-area">
      <form class="form-container" @submit.prevent="handleResetPassword">
        <div class="title-container">
          <p class="title">Pemulihan Akses</p>
          <span class="subtitle">
            Masukkan email akun admin Anda. Kami akan mengirimkan instruksi
            untuk mengatur ulang kata sandi.
          </span>
        </div>

        <div class="input-container">
          <label class="input-label" for="email_field"
            >Email Admin Terdaftar</label
          >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            class="icon"
          >
            <path
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="1.5"
              stroke="#007bff"
              d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5"
            ></path>
            <path
              stroke-linejoin="round"
              stroke-width="1.5"
              stroke="#007bff"
              d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"
            ></path>
          </svg>
          <input
            v-model="email"
            placeholder="contoh: admin@aresa.id"
            type="email"
            id="email_field"
            class="input-field"
            required
          />
        </div>

        <button
          type="submit"
          class="reset-btn"
          :disabled="loadingStore.isLoading"
        >
          <span v-if="!loadingStore.isLoading">Kirim Instruksi Reset</span>
          <v-progress-circular v-else indeterminate size="20" color="white" />
        </button>

        <div class="back-link">
          <NuxtLink to="/login" class="text-caption">
            <v-icon icon="mdi-chevron-left" start /> Kembali ke Halaman Login
          </NuxtLink>
        </div>

        <p class="note">© 2026 SNS Admin System</p>
      </form>
    </div>

    <footer class="footer-bar">SNS © 2026</footer>
  </div>
</template>

<style scoped>
/* ===============================
 * STRUKTUR & LAYOUT DASAR
 * =============================== */
.welcome-page {
  position: relative;
  min-height: 100vh;
  overflow-y: auto; /* Izinkan scroll jika layar pendek */
  background-color: #f1f3f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow-x: hidden;
}

/* ===============================
 * HEADER (Segitiga)
 * =============================== */
.header-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
}

.header-triangle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 78%, 50% 95%, 0 78%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.border-layer {
  background: #2196f3;
  transform: translateY(10px);
  z-index: 1;
}

.main-layer {
  background: linear-gradient(180deg, #007bff 0%, #005ad1 100%);
  z-index: 2;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.logo {
  margin-top: -30px;
}

@media (min-width: 600px) {
  .header-wrapper {
    height: 280px;
  }
  .border-layer {
    transform: translateY(14px);
  }
}

/* ===============================
 * FORM CONTAINER
 * =============================== */
.content-area {
  padding: 15px 20px;
  z-index: 3;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: -80px; /* Menumpuk di atas header */
}

.form-container {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px;
  background-color: #ffffff;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-family: "Inter", sans-serif;
}

.title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #212121;
}

.subtitle {
  font-size: 0.85rem;
  color: #6c757d;
  line-height: 1.4;
  display: block;
  margin-top: 8px;
}

/* ===============================
 * INPUTS
 * =============================== */
.input-container {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;
}

.icon {
  position: absolute;
  left: 12px;
  bottom: 12px;
  z-index: 5;
}

.input-label {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 600;
}

.input-field {
  width: 100%;
  height: 48px;
  padding: 0 15px 0 40px;
  border-radius: 8px;
  outline: none;
  border: 1px solid #ced4da;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
}

.input-field:focus {
  border: 1px solid #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  background-color: #ffffff;
}

/* ===============================
 * BUTTONS & LINKS
 * =============================== */
.reset-btn {
  width: 100%;
  height: 45px;
  background: #007bff;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.reset-btn:hover:not(:disabled) {
  background: #0056b3;
}

.reset-btn:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.back-link {
  margin-top: 5px;
}

.back-link a {
  text-decoration: none;
  color: #6c757d !important;
  font-weight: 600;
  transition: color 0.2s;
}

.back-link a:hover {
  color: #007bff !important;
}

/* ===============================
 * FOOTER
 * =============================== */
.note {
  font-size: 0.7rem;
  color: #adb5bd;
  margin-top: 10px;
}

.footer-bar {
  width: 100%;
  background-color: #007bff;
  color: #fff;
  text-align: center;
  font-size: 11px;
  padding: 8px 0;
  margin-top: auto;
}
</style>
