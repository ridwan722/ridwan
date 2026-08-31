export default defineNuxtRouteMiddleware(async () => {
  const user = useUserStore();

  // 🔥 Tunggu Firebase Auth rehydrate
  if (!user.__authReady) {
    await untilAuthIsReady(user);
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