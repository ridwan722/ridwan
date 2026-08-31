export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUserStore();

  // 🔥 Tunggu Firebase Auth rehydrate
  if (!user.__authReady) {
    await untilAuthIsReady(user);
  }

  const publicPaths = ["/", "/login", "/lupa-password"];

  // 🚫 Belum login → hanya boleh halaman publik
  if (!user.isLoggedIn && !publicPaths.includes(to.path)) {
    return navigateTo("/login");
  }
});

function untilAuthIsReady(user: any) {
  return new Promise((resolve) => {
    if (!process.client) {
      // ❗ Di server kita tidak punya Firebase Auth async
      // jadi langsung lanjut saja
      return resolve(true);
    }

    const interval = setInterval(() => {
      if (user.__authReady) {
        clearInterval(interval);
        resolve(true);
      }
    }, 30);
  });
}
