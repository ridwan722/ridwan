<script setup lang="ts">
definePageMeta({
  layout: "blank",
});

import { reactive } from "vue";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNotificationStore } from "../stores/notificationStore";
import { useloadingStore } from "../stores/loadingStore";
import { createUserApi } from "../composables/api-user";

const data = reactive({
  nama_perusahaan: "usaha alip",
  nama_admin: "alip",
  email_admin: "alipusman@yahoo.com",
  password: "123456",
});

const notificationStore = useNotificationStore();
const loadingStore = useloadingStore();

const daftarUser = async (e: Event) => {
  e.preventDefault();
  const auth = getAuth();

  try {
    loadingStore.setLoading(true);
    console.log("📝 Form data:", data);

    // 1️⃣ Buat akun Auth di Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email_admin,
      data.password
    );
    const user = userCredential.user;
    console.log("✅ Firebase user created:", user.uid);

    // 2️⃣ Kirim email verifikasi
await sendEmailVerification(user, {
  url: `http://localhost:8080/activate`, // halaman di Nuxt kamu
  handleCodeInApp: true,
});
    console.log("📧 Email verifikasi dikirim ke:", user.email);

    // 3️⃣ Kirim data pendaftaran ke backend (tanpa password)
    const result = await createUserApi(
      data.nama_perusahaan,
      data.nama_admin,
      data.email_admin,
      user.uid
    );

    if (result.error === 0) {
      notificationStore.showSuccess(
        "Akun berhasil dibuat! Silakan cek email Anda untuk verifikasi."
      );

      // 4️⃣ Reset form
      Object.assign(data, {
        nama_perusahaan: "",
        nama_admin: "",
        email_admin: "",
        password: "",
      });
    } else {
      notificationStore.showError("Gagal menyimpan pendaftaran: " + result.message);
    }
  } catch (error: any) {
    console.error("🚫 Error daftar user:", error);
    if (error.code === "auth/email-already-in-use") {
      notificationStore.showError("Email sudah digunakan.");
    } else {
      notificationStore.showError(error.message || "Terjadi kesalahan saat mendaftar.");
    }
  } finally {
    loadingStore.setLoading(false);
  }
};
</script>



<template>
  <div class="welcome-page">
    <div class="content-area">
      <form class="form-container" @submit="daftarUser">
        <div class="title-container">
          <p class="title">Daftar</p>
          <span class="subtitle">Silakan daftar untuk melanjutkan.</span>
        </div>

        <!-- NAMA PERUSAHAAN -->
        <div class="input-container">
          <label class="input-label" for="company_name_field">Nama Perusahaan</label>
          <input
            v-model="data.nama_perusahaan"
            placeholder="Nama Perusahaan"
            type="text"
            id="company_name_field"
            class="input-field"
            required
          />
        </div>

        <!-- NAMA ADMIN -->
        <div class="input-container">
          <label class="input-label" for="name_field">Nama Admin</label>
          <input
            v-model="data.nama_admin"
            placeholder="Nama Admin"
            type="text"
            id="name_field"
            class="input-field"
            required
          />
        </div>

        <!-- EMAIL -->
        <div class="input-container">
          <label class="input-label" for="email_field">Email</label>
          <input
            v-model="data.email_admin"
            placeholder="Email"
            type="email"
            id="email_field"
            class="input-field"
            required
          />
        </div>

        <!-- PASSWORD -->
        <div class="input-container">
          <label class="input-label" for="password_field">Password</label>
          <input
            v-model="data.password"
            placeholder="Password"
            type="password"
            id="password_field"
            class="input-field"
            required
          />
        </div>

        <button type="submit" class="login-btn">
          <span>Daftar</span>
          <v-icon icon="mdi-chevron-right" end />
        </button>

        <p class="note">© 2026 Aresa Accounting System | Terms of Use</p>
      </form>
    </div>

    <footer class="footer-bar">Aresa © 2026</footer>
  </div>
</template>

<style scoped>
/* ===============================
 * STRUKTUR & LAYOUT DASAR
 * =============================== */
.welcome-page {
  position: relative;
  min-height: 100vh;
  overflow-y: hidden;
  background-color: #f1f3f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow-x: hidden;
}

/* ===============================
 * AREA KONTEN UTAMA (Container Form)
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
  margin-top: -60px;
}

/* ===============================
 * FORM CONTAINER
 * =============================== */
.form-container {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 25px 30px;
  background-color: #ffffff;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-family: "Inter", sans-serif;
}

/* ===============================
 * TITLE/SUBTITLE
 * =============================== */
.title-container {
  text-align: center;
  margin-bottom: 5px;
}

.title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #212121;
}

.subtitle {
  font-size: 0.8rem;
  color: #6c757d;
  line-height: 1.3rem;
}

/* ===============================
 * INPUT FIELDS
 * =============================== */
.input-container {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-label {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 600;
  text-align: left;
}

.input-field {
  width: 100%;
  height: 48px;
  padding: 0 15px;
  border-radius: 8px;
  outline: none;
  border: 1px solid #ced4da;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  font-size: 0.9rem;
}

.input-field:focus {
  border: 1px solid #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  background-color: #ffffff;
}

/* ===============================
 * TOMBOL LOGIN/DAFTAR
 * =============================== */
.login-btn {
  width: 100%;
  height: 42px;
  border: 0;
  background: #007bff;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  font-weight: 600;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
  margin-top: 10px;
}

.login-btn:hover {
  background: #0056b3;
}

/* ===============================
 * FOOTER & NOTE
 * =============================== */
.note {
  font-size: 0.7rem;
  color: #adb5bd;
  text-decoration: none;
  text-align: center;
  margin-top: 15px;
}

.footer-bar {
  width: 100%;
  background-color: #007bff;
  color: #fff;
  text-align: center;
  font-size: 11px;
  padding: 6px 0;
  z-index: 10;
  margin-top: auto;
}
</style>
/* semua CSS kamu tetap s*
