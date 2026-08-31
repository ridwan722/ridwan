<template>
  <v-card class="mx-auto rounded-lg shadow-sm d-flex flex-column" elevation="2">
    <v-card-item class="py-2 px-3 flex-grow-0">
      <div class="d-flex justify-space-between align-center">
        <span class="text-subtitle-2 font-weight-bold">Closing Deals</span>
        <v-select
          v-model="filter"
          :items="['Closed Deals', 'Open Deals', 'Pending']"
          density="compact"
          variant="outlined"
          hide-details
          class="compact-select"
        ></v-select>
      </div>
    </v-card-item>

    <v-divider />

    <v-card-text class="pa-0 flex-grow-1 overflow-y-auto custom-scrollbar">
      <v-table density="compact" class="compact-table">
        <thead>
          <tr>
            <th class="text-caption font-weight-bold">Deal Name</th>
            <th class="text-caption font-weight-bold">Sales Rep</th>
            <th class="text-caption font-weight-bold">Amount</th>
            <th class="text-caption font-weight-bold">Close Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(deal, index) in closingDeals" :key="index">
            <td class="text-caption font-weight-medium">{{ deal.name }}</td>
            <td>
              <div class="d-flex align-center py-1">
                <v-avatar size="22" class="me-2">
                  <v-img :src="deal.avatar"></v-img>
                </v-avatar>
                <span class="text-caption font-weight-bold">{{
                  deal.rep
                }}</span>
              </div>
            </td>
            <td class="text-caption font-weight-bold text-grey-darken-3">
              {{ deal.amount }}
            </td>
            <td class="text-caption text-grey-darken-1">
              {{ deal.date }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from "vue";

const filter = ref("Closed Deals");

const closingDeals = [
  {
    name: "Acme Inc Install",
    rep: "Donald Risher",
    avatar: "https://i.pravatar.cc/150?u=1",
    amount: "$96k",
    date: "Today",
  },
  {
    name: "Save lots Stores",
    rep: "Jansh Brown",
    avatar: "https://i.pravatar.cc/150?u=2",
    amount: "$55.7k",
    date: "30 Dec 2021",
  },
  {
    name: "William PVT",
    rep: "Ayaan Hudda",
    avatar: "https://i.pravatar.cc/150?u=3",
    amount: "$102k",
    date: "25 Nov 2021",
  },
  {
    name: "Raitech Soft",
    rep: "Julia William",
    avatar: "https://i.pravatar.cc/150?u=4",
    amount: "$89.5k",
    date: "20 Sep 2021",
  },
  {
    name: "Absternet LLC",
    rep: "Vitoria Rodrigues",
    avatar: "https://i.pravatar.cc/150?u=5",
    amount: "$89.5k",
    date: "20 Sep 2021",
  },
  {
    name: "Global Tech",
    rep: "Luis Rocha",
    avatar: "https://i.pravatar.cc/150?u=6",
    amount: "$120k",
    date: "15 Sep 2021",
  },
];
</script>

<style scoped>
/* Styling Dropdown Header */
.compact-select {
  max-width: 130px;
}
:deep(.compact-select .v-field__input) {
  min-height: 28px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  font-size: 0.75rem !important;
}

/* Styling Tabel agar compact */
.compact-table :deep(th) {
  background-color: #f8f9fa !important;
  height: 32px !important;
  text-transform: capitalize;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}
.compact-table :deep(td) {
  height: 44px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

/* Scrollbar halus */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 10px;
}
</style>
