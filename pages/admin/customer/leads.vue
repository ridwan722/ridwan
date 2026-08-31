<template>
  <v-dialog
    v-model="data.dialogAdd"
    :width="$vuetify.display.mdAndUp ? '380px' : '90%'"
  >
    <v-card class="rounded-lg">
      <v-card-title
        class="px-4 text-subtitle-1 font-weight-bold bg-primary pa-3"
      >
        TAMBAH LEADS
      </v-card-title>

      <v-card-text class="pa-8">
        <a-text-field
          v-model="newLeads.nama_customer"
          label="Nama Lengkap"
          placeholder="Nama lengkap"
          class="mb-3"
        />

        <a-text-field
          v-model="newLeads.no_telfon"
          label="No Telepon"
          placeholder="Nomor telepon"
          class="mb-3"
        />

        <a-text-field
          v-model="newLeads.nama_pt"
          label="Nama Perusahaan"
          placeholder="Nama perusahaan"
          class="mb-3"
        />

        <v-divider class="my-3" />

        <h4 class="mb-3">Informasi Tambahan</h4>

        <a-textarea
          v-model="newLeads.address_leads"
          label="Alamat"
          placeholder="Alamat lengkap"
          class="mb-3"
        />

        <a-text-field
          v-model="newLeads.country_leads"
          label="Negara"
          placeholder="Negara"
          class="mb-3"
        />

        <a-text-field
          v-model="newLeads.city_leads"
          label="Kota"
          placeholder="Kota"
          class="mb-3"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-3 bg-grey-lighten-4">
        <v-btn
          variant="flat"
          color="grey-darken-2"
          @click="closeDialogAdd"
          class="text-capitalize px-3"
          size="small"
        >
          Batal
        </v-btn>

        <v-btn
          color="primary"
          @click="saveLeads"
          variant="flat"
          class="text-capitalize px-3"
          size="small"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="data.dialogContact"
    :width="$vuetify.display.mdAndUp ? '380px' : '90%'"
  >
    <v-card class="rounded-lg">
      <v-card-title
        class="px-4 text-subtitle-1 font-weight-bold bg-primary pa-3"
      >
        ADD TO CONTACT
      </v-card-title>

      <v-card-text>
        <a-text-field
          v-model="newContact.nama_customer"
          disabled
          label="Nama"
          class="mb-3"
        />

        <a-text-field
          v-model="newContact.status"
          class="mb-3"
          label="Status"
          disabled
        />

        <v-divider class="my-3" />

        <h4 class="mb-3">Informasi Tambahan</h4>

        <a-textarea
          v-model="newContact.address_leads"
          class="mb-3"
          label="Alamat"
          placeholder="Alamat Lengkap"
        />

        <a-text-field
          v-model="newContact.country_leads"
          class="mb-3"
          label="Negara"
          placeholder="Negara"
        />

        <a-text-field
          v-model="newContact.city_leads"
          class="mb-3"
          label="Kota"
          placeholder="Kota"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-3 bg-grey-lighten-4">
        <v-btn
          variant="flat"
          color="grey-darken-2"
          @click="closeDialogContact"
          class="text-capitalize px-3"
          size="small"
        >
          Batal
        </v-btn>

        <v-btn
          color="primary"
          @click="saveContact"
          variant="flat"
          class="text-capitalize px-3"
          size="small"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-row align="center">
    <v-col cols="9">
      <v-breadcrumbs>
        <v-breadcrumbs-item>
          <span class="font-weight-medium text-h5"> Leads </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>

    <v-col cols="3">
      <v-btn
        color="primary"
        @click="openDialogAdd"
        variant="flat"
        size="small"
        class="text-capitalize px-3"
        prepend-icon="mdi-plus"
      >
        Tambah Leads
      </v-btn>
    </v-col>
  </v-row>

  <v-card flat rounded="lg" class="border">
    <v-card-title class="pa-3">
      <v-row align="center">
        <v-col cols="12" sm="10">
          <a-text-field
            v-model="data.search"
            placeholder="Search"
            style="max-width: 280px"
          />
        </v-col>

        <v-col cols="12" sm="2" class="text-caption text-grey-darken-1">
          Total: {{ leadsStore.getDataLeads.length }} leads
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      :headers="data.headLeads"
      :items="leadsStore.getDataLeads"
      :search="data.search"
      density="compact"
      :hover="true"
      v-model:page="data.page"
      :items-per-page="data.itemsPerPage"
      :sort-by="[{ key: 'createdAt', order: 'desc' }]"
    >
      <template v-slot:item.no="{ index }">
        <span class="text-caption font-weight-bold text-grey-darken-1">
          {{ (data.page - 1) * data.itemsPerPage + index + 1 }}
        </span>
      </template>

      <template v-slot:item.createdAt="{ item }">
        <v-icon icon="mdi-calendar-range" size="20" />
        {{ rubahtanggalunix(item.createdAt) }}
      </template>

      <template v-slot:item.id="{ item }">
        <v-chip
          size="x-small"
          color="grey-darken-1"
          variant="tonal"
          class="font-weight-medium rounded-sm px-2"
          style="font-family: monospace"
        >
          {{ item.id }}
        </v-chip>
      </template>

      <template v-slot:item.nama_pt="{ item }">
        <v-chip
          size="small"
          variant="flat"
          color="blue-grey-lighten-5"
          class="text-blue-grey-darken-3 font-weight-bold border"
        >
          <v-avatar start color="blue-grey-darken-1" size="18">
            <span class="text-white" style="font-size: 8px">
              {{ item.nama_pt.substring(0, 1) }}
            </span>
          </v-avatar>
          {{ item.nama_pt.toUpperCase() }}
        </v-chip>
      </template>

      <!-- <template v-slot:item.no_telfon="{ item }">
        <v-chip
          v-if="item.no_telfon"
          size="x-small"
          variant="outlined"
          color="success"
          prepend-icon="mdi-phone"
          class="font-weight-medium"
        >
          {{ item.no_telfon }}
        </v-chip>

        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Tidak ada data
        </span>
      </template> -->

      <template v-slot:item.status="{ item }">
        <v-chip
          color="#E0E0E0"
          text-color="white"
          class="text-capitalize rounded-lg"
          size="small"
          label
          variant="flat"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.aksi="{ item }">
        <div class="d-flex justify-center">
          <v-btn
            size="27"
            variant="tonal"
            color="primary"
            class="rounded-lg"
            @click="openDialogContact(item)"
          >
            <v-icon icon="mdi-account-plus-outline" />
            <v-tooltip activator="parent" location="top">Add Contact</v-tooltip>
          </v-btn>
        </div>
      </template>

      <template v-slot:no-data>
        <div class="py-8 text-center text-grey-darken-1">
          <v-icon
            size="48"
            color="grey-lighten-1"
            class="mb-2"
            icon="mdi-bullseye-arrow"
          />

          <div class="text-body-1">Tidak ada data leads</div>
        </div>
      </template>

      <template v-slot:bottom>
        <v-divider />

        <v-row class="pa-3" align="center" justify="space-between">
          <!-- Info -->
          <v-col cols="12" sm="6" class="text-caption text-grey-darken-1">
            Menampilkan
            <strong>
              {{ (data.page - 1) * data.itemsPerPage + 1 }}
            </strong>
            –
            <strong>
              {{
                Math.min(
                  data.page * data.itemsPerPage,
                  leadsStore.getDataLeads.length
                )
              }}
            </strong>
            dari
            <strong>
              {{ leadsStore.getDataLeads.length }}
            </strong>
            leads
          </v-col>

          <!-- Pagination -->
          <v-col cols="12" sm="6" class="d-flex justify-end">
            <v-pagination
              v-model="data.page"
              :length="
                Math.ceil(leadsStore.getDataLeads.length / data.itemsPerPage)
              "
              total-visible="5"
              density="comfortable"
              size="small"
              rounded="lg"
              active-color="primary"
            />
          </v-col>
        </v-row>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import type { leadsM } from "~/types/leads";
import type { ConfirmationDialog } from "#components";
import moment from "moment";
import _ from "lodash";

definePageMeta({
  layout: "admin",
});

const userStore = useUserStore();
const leadsStore = useLeadsStore();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null
);

onMounted(async () => {
  await leadsStore.tarikDataLeadsByStatusAct("New");
});

const newLeads = ref<leadsM>({
  nama_customer: "",
  nama_pt: "",
  no_telfon: "",
  createdAt: 0,
  createdBy: "",
  status: "New",
});

const newContact = ref<leadsM>({
  nama_customer: "",
  nama_pt: "",
  no_telfon: "",
  createdAt: 0,
  createdBy: "",
  status: "",
});

const data = reactive({
  search: "",
  dialogAdd: false,
  dialogContact: false,
  page: 1,
  itemsPerPage: 10,

  headLeads: [
    { title: "No", value: "no", width: "50px" },
    // { title: "Tanggal", value: "createdAt", sortable: true },
    { title: "Nama", value: "nama_customer", sortable: true },
    { title: "Nama Perusahaan", value: "nama_pt", sortable: true },
    { title: "No Telp", value: "no_telfon", sortable: true },
    {
      title: "Status",
      value: "status",
      align: "center" as const,
      sortable: true,
    },
    {
      title: "Aksi",
      align: "center" as const,
      value: "aksi",
      width: "50px",
    },
  ],
});

const openDialogAdd = () => {
  data.dialogAdd = true;
};

const closeDialogAdd = () => {
  newLeads.value = {
    nama_customer: "",
    nama_pt: "",
    no_telfon: "",
    createdAt: 0,
    createdBy: "",
  };
  data.dialogAdd = false;
};

const saveLeads = async () => {
  if (newLeads.value.nama_customer == "") {
    return notificationStore.showError("nama lengkap tidak boleh kosong");
  }

  if (newLeads.value.no_telfon == "") {
    return notificationStore.showError("notelfon tidak boleh kosong");
  }

  if (newLeads.value.nama_pt == "") {
    return notificationStore.showError("nama pt tidak boleh kosong");
  }
  newLeads.value.createdAt = moment().unix();
  newLeads.value.createdBy = useUserStore().getEmail;
  leadsStore.addLeadsAct(newLeads.value);
  await leadsStore.tarikDataLeadsByStatusAct("New");

  data.dialogAdd = false;
};

const openDialogContact = (item: leadsM) => {
  data.dialogContact = true;
  newContact.value = _.assign({}, item);
  newContact.value.status = "Contacted";
};

const closeDialogContact = () => {
  newContact.value = {
    nama_customer: "",
    nama_pt: "",
    no_telfon: "",
    createdAt: 0,
    createdBy: "",
  };
  data.dialogContact = false;
};

const saveContact = () => {
  leadsStore.addContactLeadsAct(newContact.value);
  closeDialogContact();
};
</script>

<style scoped>
:deep() thead th {
  font-weight: bold !important;
  border: 1px solid #cbcbcb !important;
  background-color: #dddddd !important;
}

:deep() tbody td {
  border-right: 1px solid #e0e0e0 !important;
}
</style>
