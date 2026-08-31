<template>
  <v-dialog class="bg-dialog" v-model="isLoading" max-width="300" persistent>
    <v-card
      rounded="xl"
      elevation="0"
      height="300"
      class="loading-card d-flex flex-column align-center justify-center"
    >
      <div class="typewriter-3d">
        <div class="typewriter-body">
          <div class="slide"><i></i></div>
          <div class="paper-slot">
            <div class="paper"></div>
          </div>
          <div class="keyboard">
            <div class="keys-container">
              <div class="key row1-1"></div>
              <div class="key row1-2"></div>
              <div class="key row1-3"></div>
              <div class="key row1-4"></div>
              <div class="key row1-5"></div>
              <div class="key row1-6"></div>
              <div class="key row2-1"></div>
              <div class="key row2-2"></div>
              <div class="key row2-3"></div>
              <div class="key row2-4"></div>
              <div class="key row2-5"></div>
              <div class="key row2-6"></div>
            </div>
          </div>
        </div>
      </div>

      <span class="text-center roboto mt-7">
        Harap tunggu sebentar, <br />
        data sedang disiapkan
      </span>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from "vue";
import { useloadingStore } from "~/stores/loadingStore";

const loadingstore = useloadingStore();
const isLoading = computed(() => loadingstore.getLoading);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,700;1,700&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap");

.bg-dialog {
  /* Menggunakan backdrop-filter pada container dialog */
  backdrop-filter: blur(2px) !important;
  -webkit-backdrop-filter: blur(8px);

  /* Memberikan warna gelap transparan sebagai dasarnya */
  background-color: rgba(36, 36, 36, 0.3) !important;
}
.roboto {
  font-family: "Roboto", serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
  font-variation-settings: "wdth" 100;
}

.loading-card {
  /* Menggunakan rgba putih dengan opacity rendah agar efek blur terlihat */
  background: rgba(255, 255, 255, 0.4) !important;

  /* Efek blur utama */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Untuk kecocokan Safari */

  /* Opsional: Beri sedikit border tipis agar efek kaca lebih tegas */
  border: 1px solid rgba(255, 255, 255, 0.3);

  padding: 24px;
  min-width: 280px;
  position: relative;
  overflow: visible;
  perspective: 1500px;
}

/* --- 3D Typewriter CSS --- */

/* Main container with deep perspective */
.typewriter-3d {
  --blue: #005bac;
  --blue-dark: #003f7f;
  --key: #fff;
  --paper: #eef0fd;
  --text: #00000049;
  --tool: #005bac;
  --duration: 3s;

  position: relative;
  width: 130px; /* Slightly wider for the 3D body */
  height: 100px;
  perspective: 1000px; /* Perspective for the typewriter body */
  transform-style: preserve-3d;
  /* Re-add the bounce animation */
  animation: bounce05 var(--duration) linear infinite;
}

/* The actual 3D body of the typewriter */
.typewriter-body {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotateX(15deg) rotateY(-10deg); /* Initial 3D tilt */
  transform-style: preserve-3d;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  border-radius: 8px;
  /* Add a base/shadow underneath for depth */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Back of the typewriter, containing the slide and paper */
.typewriter-body::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px; /* Back panel height */
  background: var(--blue-dark);
  transform: translateZ(-5px); /* Push it back slightly */
  border-radius: 8px 8px 0 0;
}

/* Slide mechanism - Now on the back of the body */
.typewriter-body .slide {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 92px;
  height: 20px;
  border-radius: 3px;
  background: linear-gradient(var(--blue), var(--blue-dark));
  transform-style: preserve-3d;
  /* Slide animation remains on the body/x-axis */
  animation: slide05 var(--duration) ease infinite;
}

/* Slide details (platen knob, etc.) using pseudo-elements */
.typewriter-body .slide:before,
.typewriter-body .slide:after,
.typewriter-body .slide i:before {
  content: "";
  position: absolute;
  background: var(--tool);
}

/* Knob on the right side of the slide */
.typewriter-body .slide:after {
  left: 94px;
  top: 3px;
  height: 14px;
  width: 6px;
  border-radius: 3px;
  transform: translateZ(2px); /* Add slight depth */
}

/* Paper feed slot area */
.paper-slot {
  position: absolute;
  top: -5px; /* Offset paper for visual hierarchy */
  left: 20px;
  width: 50px;
  height: 50px;
  perspective: 500px;
  transform-style: preserve-3d;
}

/* The Paper - Now needs perspective and 3D positioning */
.typewriter-body .paper {
  position: absolute;
  width: 40px;
  height: 46px;
  border-radius: 5px;
  background: var(--paper);
  transform: translateZ(5px) translateY(46px) rotateX(-5deg); /* Positioned forward and tilted */
  transform-style: preserve-3d;
  /* Re-add the paper animation */
  animation: paper05 var(--duration) linear infinite;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Lines on paper */
.typewriter-body .paper:before {
  content: "";
  position: absolute;
  left: 6px;
  right: 6px;
  top: 7px;
  border-radius: 2px;
  height: 4px;
  transform: scaleY(0.8);
  background: var(--text);
  box-shadow:
    0 12px 0 var(--text),
    0 24px 0 var(--text),
    0 36px 0 var(--text);
}

/* Keyboard Section - Front face of the 3D body */
.typewriter-body .keyboard {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px; /* Increase height for key area */
  transform-style: preserve-3d;
  background: linear-gradient(to bottom, var(--blue), var(--blue-dark));
  border-radius: 0 0 8px 8px;
  transform: translateZ(10px) rotateX(-5deg); /* Place forward and slightly tilted back */
}

/* Front surface of the keys, where they sit */
.typewriter-body .keyboard::after {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  transform: translateZ(1px); /* Slight depth */
}

/* Container for individual key elements */
.keys-container {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 15px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 4px;
  transform-style: preserve-3d;
  transform: translateZ(3px); /* Raise keys off the surface */
}

/* Style for individual keys */
.key {
  background: var(--key);
  border-radius: 2px;
  width: 10px;
  height: 10px;
  transform-style: preserve-3d;
  transition: transform 0.1s; /* Add slight key press animation */
  /* Add individual keyboard animation */
  animation: keyPress05 var(--duration) linear infinite;
  /* Simulate key top face and side depth */
  box-shadow: 0 1px 0px rgba(0, 0, 0, 0.2);
}

/* --- Keep original keyframes --- */
@keyframes bounce05 {
  85%,
  92%,
  100% {
    transform: translateY(0);
  }

  89% {
    transform: translateY(-4px);
  }

  95% {
    transform: translateY(2px);
  }
}

/* Slide keyframes (remain the same) */
@keyframes slide05 {
  5% {
    transform: translateX(14px);
  }

  15%,
  30% {
    transform: translateX(6px);
  }

  40%,
  55% {
    transform: translateX(0);
  }

  65%,
  70% {
    transform: translateX(-4px);
  }

  80%,
  89% {
    transform: translateX(-12px);
  }

  100% {
    transform: translateX(14px);
  }
}

/* Paper keyframes (remain the same) */
@keyframes paper05 {
  5% {
    transform: translateY(46px);
  }

  20%,
  30% {
    transform: translateY(34px);
  }

  40%,
  55% {
    transform: translateY(22px);
  }

  65%,
  70% {
    transform: translateY(10px);
  }

  80%,
  85% {
    transform: translateY(0);
  }

  92%,
  100% {
    transform: translateY(46px);
  }
}

/* --- Define new key press animation for individual keys --- */
@keyframes keyPress05 {
  5%,
  12%,
  21%,
  30%,
  39%,
  48%,
  57%,
  66%,
  75%,
  84%,
  100% {
    transform: translateZ(0); /* Default raised state */
  }

  /* Specific keys "pressed" at different intervals */
  9%,
  45% {
    transform: translateZ(-2px); /* Key pressed down */
  }

  18%,
  54% {
    transform: translateZ(-2px);
  }

  27%,
  63% {
    transform: translateZ(-2px);
  }

  36%,
  72% {
    transform: translateZ(-2px);
  }

  81% {
    transform: translateZ(-2px);
  }
}

/* Define which keys (via animation-delay or different keyframes) get "pressed" */
/* We'll use random delays to simulate real typing across the grid */
.key.row1-1 {
  animation-delay: 0.1s;
}
.key.row1-2 {
  animation-delay: 0.3s;
}
.key.row1-3 {
  animation-delay: 0.5s;
}
.key.row1-4 {
  animation-delay: 0.2s;
}
.key.row1-5 {
  animation-delay: 0.6s;
}
.key.row1-6 {
  animation-delay: 0.4s;
}
.key.row2-1 {
  animation-delay: 0.7s;
}
.key.row2-2 {
  animation-delay: 0.1s;
}
.key.row2-3 {
  animation-delay: 0.4s;
}
.key.row2-4 {
  animation-delay: 0.8s;
}
.key.row2-5 {
  animation-delay: 0.3s;
}
.key.row2-6 {
  animation-delay: 0.5s;
}

/* The previous keyboard box-shadow animation is no longer needed 
   as we are animating the actual keys */
</style>
