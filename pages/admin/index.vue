<template>
  <v-row class="mb-2">
    <v-col>
      <span class="font-weight-medium text-h5"> Dashboard</span>
    </v-col>
  </v-row>

  <v-row class="ga-3 flex-nowrap overflow-x-auto dashboard-row" no-gutters>
    <v-col  style="width: 100%">
      <v-card class="dashboard-card" elevation="0">

        <v-card-text class="pa-3">
          <div class="d-flex justify-space-between align-center">
            <div>
              <p class="card-label">ddd</p>

              <h2 class="card-value">
d
              </h2>
            </div>

            <div class="card-icon" >
              <v-icon size="18">dd</v-icon>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <dashboard-kalender />
    </v-col>

    <v-col cols="12" md="7">
      <dashboard-reminder-pekerjaan />
    </v-col>

    <v-col cols="12" md="5">
      <dashboard-invoice />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" sm="5">
      <Chart2 />
    </v-col>

    <v-col cols="12" sm="7">
      <Dashboard3 />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" sm="4">
      <Chart1 />
    </v-col>

    <v-col cols="12" sm="8">
      <Chart3 />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" sm="6">
      <Dashboard1 />
    </v-col>

    <v-col cols="12" sm="6">
      <Dashboard2 />
    </v-col>

    <!-- <v-col cols="12" sm="6">
      <Dashboard4 />
    </v-col> -->
  </v-row>
</template>

<script setup>


definePageMeta({
  layout: "admin",
});

</script>

<style scoped>
.dashboard-row {
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.dashboard-card {
  position: relative;
  overflow: hidden;
  border-radius: 18px !important;
  background: #fff;
  border: 1px solid #f1f1f1;
  transition: 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
  }
}

.card-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
  color: #111827;
}

.card-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  flex-shrink: 0;
}

.card-icon.purple {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
}

.card-icon.orange {
  background: linear-gradient(135deg, #f97316, #fb923c);
}

.card-icon.red {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

.card-icon.blue {
  background: linear-gradient(135deg, #2563eb, #60a5fa);
}

.card-icon.green {
  background: linear-gradient(135deg, #16a34a, #4ade80);
}

.card-glow {
  position: absolute;
  top: -25px;
  right: -25px;

  width: 70px;
  height: 70px;

  border-radius: 50%;
  opacity: 0.08;
}

.card-glow.purple {
  background: #9333ea;
}

.card-glow.orange {
  background: #f97316;
}

.card-glow.red {
  background: #ef4444;
}

.card-glow.blue {
  background: #2563eb;
}

.card-glow.green {
  background: #16a34a;
}

/* MOBILE */
@media (max-width: 768px) {
  .dashboard-row > .v-col {
    min-width: 180px;
  }

  .card-value {
    font-size: 20px;
  }

  .card-icon {
    width: 36px;
    height: 36px;
    border-radius: 12px;
  }
}
</style>
