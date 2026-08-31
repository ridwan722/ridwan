<template>
  <div class="loader-wrapper">
    <div class="glass-card">
      <div class="glow-sphere"></div>
      
      <div class="visual-section">
        <div class="icon-orb">
          <svg viewBox="0 0 24 24" class="gmail-svg">
            <path class="path-blue" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
            <path class="path-red" d="M22 6l-10 7L2 6" />
          </svg>
        </div>
        <div class="orbit-ring"></div>
      </div>

      <div class="text-content">
        <div class="badge-mini">
          <span class="dot"></span>
          Secure Transmission
        </div>
        <h3 class="main-title">Mengirim Email</h3>
        <p class="desc">Proses ini membutuhkan waktu 2–3 menit, harap menunggu</p>
      </div>

      <div class="loading-track">
        <div class="loading-fill"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

.loader-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  backdrop-filter: blur(2px);
  justify-content: center;
  font-family: 'Inter', sans-serif;
  z-index: 9999;
}

.glass-card {
  position: relative;
  width: 340px;
  padding: 48px 32px;
  background: rgb(255, 255, 255);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 40px 40px 40px 40px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

/* Floating Glow Behind Icon */
.glow-sphere {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(66, 133, 244, 0.15) 0%, rgba(234, 67, 53, 0.1) 100%);
  filter: blur(30px);
  z-index: 0;
}

.visual-section {
  position: relative;
  margin-bottom: 32px;
  z-index: 1;
}

.icon-orb {
  width: 72px;
  height: 72px;
  background: white;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  animation: float 3s ease-in-out infinite;
}

.gmail-svg {
  width: 32px;
  height: 32px;
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.path-blue { stroke: #4285f4; }
.path-red { 
  stroke: #ea4335; 
  stroke-dasharray: 30;
  animation: dash 2s ease-in-out infinite;
}

.orbit-ring {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px solid transparent;
  border-top-color: rgba(66, 133, 244, 0.2);
  border-right-color: rgba(234, 67, 53, 0.2);
  border-radius: 50%;
  animation: rotate 4s linear infinite;
}

.text-content {
  text-align: center;
  margin-bottom: 32px;
}

.badge-mini {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f1f5f9;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.dot {
  width: 4px;
  height: 4px;
  background: #34a853; /* Google Green */
  border-radius: 50%;
  box-shadow: 0 0 8px #34a853;
}

.main-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.desc {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
  font-weight: 400;
}

/* Aesthetic Progress Bar */
.loading-track {
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 100px;
  overflow: hidden;
}

.loading-fill {
  height: 100%;
  width: 40%;
  background: linear-gradient(90deg, #4285f4, #ea4335, #fbbc05, #34a853);
  background-size: 300% 100%;
  border-radius: 100px;
  animation: progressMove 2s ease-in-out infinite;
}

/* Animations */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes dash {
  0%, 100% { stroke-dashoffset: 30; }
  50% { stroke-dashoffset: 0; }
}

@keyframes progressMove {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(50%); }
  100% { transform: translateX(200%); }
}
</style>