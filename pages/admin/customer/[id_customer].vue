<script setup lang="ts">
import _ from "lodash";
import moment from "moment";

definePageMeta({
  layout: "admin",
});

const leadsStore = useLeadsStore();
const route = useRoute();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

// Ref untuk area print

onMounted(async () => {
  const id = route.params.id_customer;
  await leadsStore.tarikDetailLeadsAct(_.toString(id));
});

const detailleads = computed(() => {
  return leadsStore.getDetailLeads;
});
</script>

<template>
  <div v-if="detailleads">
    <ConfirmationDialog ref="confirmationDialog" />
    <v-card rounded="lg" class="pa-2 mb-7 border" flat>
      <!-- HEADER -->
      <v-card-title class="py-1 px-2 d-flex justify-space-between align-center">
        <div>
          <div class="text-subtitle-2 font-weight-bold">
            Lead ID : {{ detailleads.id }}
          </div>
        </div>

        <v-chip color="primary" variant="flat" class="font-weight-bold">
          {{ detailleads.status }}
        </v-chip>
      </v-card-title>

      <v-divider />

      <!-- INFORMASI CUSTOMER -->
      <v-card-text class="py-2 px-2">
        <v-row dense>
          <v-col cols="12" md="4">
            <div class="text-caption text-grey">Nama Customer</div>
            <div class="text-body-2 font-weight-medium">
              {{ detailleads.nama_customer }}
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <div class="text-caption text-grey">Perusahaan</div>
            <div class="text-body-2">
              {{ detailleads.nama_pt }}
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <div class="text-caption text-grey">No. Telepon</div>
            <div class="text-body-2">
              {{ detailleads.no_telfon }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <!-- INFORMASI LOKASI -->
      <v-card-text class="py-2 px-2">
        <v-row dense>
          <v-col cols="12" md="4">
            <div class="text-caption text-grey">Alamat</div>
            <div class="text-body-2">
              {{ detailleads.address_leads }}
            </div>
          </v-col>

          <v-col cols="6" md="4">
            <div class="text-caption text-grey">Kota</div>
            <div class="text-body-2">
              {{ detailleads.city_leads }}
            </div>
          </v-col>

          <v-col cols="6" md="4">
            <div class="text-caption text-grey">Negara</div>
            <div class="text-body-2">
              {{ detailleads.country_leads }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <!-- META -->
      <v-card-text class="py-1 px-2">
        <div class="text-caption text-grey">
          Dibuat oleh: {{ detailleads.createdBy }}
        </div>
        <div class="text-caption text-grey">
          Dibuat pada:
          {{ new Date(detailleads.createdAt * 1000).toLocaleString() }}
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
