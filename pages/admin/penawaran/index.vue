<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <v-dialog v-model="data.dialogPenawaran" width="1250px" persistent scrollable>
    <v-card class="rounded-lg">
      <v-card-title class="px-6 py-3 bg-primary d-flex align-center">
        <span class="text-subtitle-1 font-weight-bold text-white">
          BUAT PENAWARAN BARU
        </span>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4 bg-grey-lighten-5" style="max-height: 80vh">
        <div class="d-flex align-center mb-2 px-1">
          <v-icon
            size="18"
            color="primary"
            class="mr-2"
            icon="mdi-numeric-1-circle"
          />

          <span class="text-caption font-weight-black text-grey-darken-2">
            INFORMASI DOKUMEN
          </span>
        </div>

        <v-card variant="flat" border class="rounded-lg pa-4 mb-5 bg-white">
          <a-select
            label="Handle By"
            :items="[
              { label: 'Karya Aresa Mandiri (KAM)', value: 'KAM' },
              { label: 'Abdul Khalid (ABK)', value: 'ABK' },
            ]"
            v-model="newPenawaran.handle_by_aresa"
            class="mb-3"
          />
          <v-row>
            <v-col cols="12" sm="6">
              <a-select
                label="Perusahaan"
                item-title="nama_perusahaan"
                item-value="id"
                :items="perusahaanStore.getDataPerusahaan"
                v-model="newPenawaran.id_perusahaan"
                class="mb-3"
              />

              <a-select
                label="Cabang Perusahaan"
                item-title="nama_cabang"
                item-value="id"
                :items="masterCabangStore.getDataCabang"
                v-model="newPenawaran.id_cabang_perusahaan"
                class="mb-3"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <a-date-picker
                v-model="newPenawaran.tanggal"
                label="Tanggal Penawaran"
                class="mb-3"
              />

              <a-text-field
                label="No Telp Perusahaan"
                v-model="newPenawaran.telepon_perusahaan"
                class="mb-3"
              />
            </v-col>
          </v-row>

          <v-divider opacity="0"></v-divider>

          <a-select
            label="Nama Object"
            item-title="nama"
            item-value="id"
            :items="masterobjectstore.getDataObjectKategori"
            v-model="newPenawaran.id_object_kategori"
            class="mb-3"
          />

          <a-textarea
            label="Perihal"
            v-model="newPenawaran.perihal"
            class="mb-3"
          />
        </v-card>

        <div class="d-flex align-center mb-2 px-1">
          <v-icon
            size="18"
            color="primary"
            class="mr-2"
            icon="mdi-numeric-2-circle"
          />

          <span class="text-caption font-weight-black text-grey-darken-2">
            DAFTAR ITEM KATEGORI
          </span>
        </div>

        <v-card
          variant="flat"
          border
          class="rounded-lg overflow-hidden bg-white"
        >
          <div class="bg-grey-lighten-4 px-4 py-2 border-b d-flex align-center">
            <span class="text-caption font-weight-bold text-grey-darken-3"
              >ITEM LIST</span
            >
            <v-spacer />
            <v-chip
              size="x-small"
              color="#4F7DFF"
              variant="flat"
              class="font-weight-bold mr-2"
            >
              TOTAL UNIT : {{ totalUnit }}
            </v-chip>

            <v-chip
              size="x-small"
              color="primary"
              variant="flat"
              class="font-weight-bold"
            >
              TOTAL ITEM : {{ masterCabangStore.getDataItemKategori.length }}
            </v-chip>
          </div>

          <v-data-table
            :headers="data.headKategoriItem"
            :items="masterCabangStore.getDataItemKategori"
            density="compact"
            :sort-by="[{ key: 'createdAt', order: 'desc' }]"
            :hover="true"
            :items-per-page="data.itemsPerPageKategori"
            v-model:page="data.pageKategori"
            class="compact-table"
          >
            <template v-slot:item.no="{ index }">
              <span class="text-caption font-weight-medium text-grey-darken-1">
                {{ index + 1 }}
              </span>
            </template>

            <template v-slot:item.nama_kategori_item="{ item }">
              <div style="width: 200px">
                <span>
                  {{ item.nama_kategori_item }}
                </span>
                <br />
                <span v-if="item.ukuran && item.ukuran.length > 0">
                  Uk.
                  {{
                    Array.isArray(item.ukuran)
                      ? item.ukuran.join(", ")
                      : item.ukuran
                  }}
                  <br />
                </span>
              </div>
            </template>

            <template v-slot:item.jumlah_unit="{ item }">
              <v-chip
                v-if="item.jumlahUnit"
                size="x-small"
                color="blue-darken-1"
                variant="flat"
                class="font-weight-bold text-body-2"
              >
                {{ item.jumlahUnit }} Unit
              </v-chip>
              <span v-else class="text-body-2 text-disabled">0</span>
            </template>

            <template v-slot:item.periode="{ item }">
              <div
                v-if="item.periode && item.periode.mulai !== '-'"
                class="d-flex flex-column py-1"
              >
                <div class="d-flex align-center mb-n1">
                  <v-icon size="12" color="success" class="me-1"
                    >mdi-play-circle</v-icon
                  >
                  <span class="text-xxs text-grey-darken-3">{{
                    formatTanggal(item.periode.mulai)
                  }}</span>
                </div>
                <div class="d-flex align-center mt-1">
                  <v-icon size="12" color="error" class="me-1"
                    >mdi-stop-circle</v-icon
                  >
                  <span class="text-xxs text-error font-weight-bold">{{
                    formatTanggal(item.periode.selesai)
                  }}</span>
                </div>
              </div>
              <span v-else class="text-caption text-disabled">—</span>
            </template>

            <template v-slot:item.periode_penawaran="{ item }">
              <div class="d-flex align-center gap-2 py-1">
                <a-date-picker
                  label="Periode Awal"
                  v-model="item.periode_penawaran.mulai"
                />
                <a-date-picker
                  class="ml-2"
                  label="Periode Akhir"
                  v-model="item.periode_penawaran.selesai"
                />
              </div>
            </template>

            <template v-slot:item.nominal="{ item }">
              <div style="width: 140px" class="py-1">
                <a-text-field
                  v-model.number="item.nominal"
                  :disabled="addedItemIds.includes(item.id)"
                  placeholder="Rp."
                />
              </div>
            </template>

            <template v-slot:item.status="{ item }">
              <v-chip
                v-if="item.status"
                size="x-small"
                variant="tonal"
                class="font-weight-bold"
                :color="
                  item.status === 'Draft'
                    ? 'green'
                    : item.status === 'Penawaran'
                      ? 'blue'
                      : 'orange'
                "
              >
                {{ item.status }}
              </v-chip>
            </template>

            <template v-slot:item.select="{ item }">
              <!-- <div class="d-flex justify-center">
                <v-tooltip
                  v-if="item.status !== 'Draft'"
                  location="left"
                  text="Status harus Draft"
                >
                  <template #activator="{ props }">
                    <div v-bind="props">
                      <v-checkbox
                        disabled
                        density="compact"
                        hide-details
                        size="small"
                      />
                    </div>
                  </template>
                </v-tooltip>
                <v-checkbox
                  v-else
                  v-model="selectedItems"
                  :value="item.id"
                  density="compact"
                  color="primary"
                  hide-details
                />
              </div> -->
              <v-btn
                size="25"
                color="blue"
                @click="tambahItem(item)"
                :disabled="
                  item.status !== 'Draft' || addedItemIds.includes(item.id)
                "
                ><v-icon size="15">mdi-plus</v-icon></v-btn
              >
              <!-- !item.nominal ||
                  Number(item.nominal) <= 0 -->
            </template>

            <template v-slot:bottom>
              <v-divider />

              <div class="bg-grey-lighten-5 px-4 py-2">
                <v-row no-gutters align="center">
                  <v-col
                    cols="12"
                    md="8"
                    class="d-flex align-center flex-wrap"
                    style="gap: 8px"
                  >
                    <div
                      class="d-flex align-center bg-white border rounded-lg px-3 py-1 shadow-sm mr-2"
                    >
                      <v-icon
                        size="16"
                        color="primary"
                        icon="mdi-database-outline"
                        class="mr-2"
                      />
                      <span class="text-caption font-weight-medium">
                        <span class="text-grey">Menampilkan</span>
                        <strong class="text-primary ml-1">
                          {{
                            (data.page - 1) * data.itemsPerPageKategori + 1
                          }}-{{
                            Math.min(
                              data.page * data.itemsPerPageKategori,
                              masterCabangStore.getDataItemKategori.length,
                            )
                          }}
                        </strong>
                        <span class="text-grey mx-1">/</span>
                        <strong>{{
                          masterCabangStore.getDataItemKategori.length
                        }}</strong>
                        <span class="text-grey mx-1">Data</span>
                      </span>
                    </div>
                  </v-col>

                  <v-col
                    cols="12"
                    md="4"
                    class="d-flex justify-md-end justify-center mt-2 mt-md-0"
                  >
                    <div
                      class="d-flex align-center bg-white border rounded-lg px-3 py-0"
                      style="min-width: 140px; height: 32px"
                    >
                      <v-icon
                        size="14"
                        color="grey"
                        icon="mdi-layers-outline"
                        class="mr-2"
                      />
                      <span
                        class="text-caption text-grey-darken-1 mr-2"
                        style="white-space: nowrap"
                        >Tampilkan:</span
                      >

                      <v-select
                        v-model="data.itemsPerPageKategori"
                        :items="[
                          { title: '10', value: 10 },
                          { title: '25', value: 25 },
                          { title: '50', value: 50 },
                          { title: 'Semua', value: -1 },
                        ]"
                        variant="plain"
                        density="compact"
                        hide-details
                        class="mt-n2"
                        @update:model-value="data.page = 1"
                      >
                        <template v-slot:selection="{ item }">
                          <span
                            class="text-caption font-weight-black text-primary"
                            >{{ item.title }}</span
                          >
                        </template>
                      </v-select>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </template>

            <template v-slot:no-data>
              <div class="py-8 text-center text-grey-darken-1">
                <v-icon
                  size="48"
                  color="grey-lighten-1"
                  class="mb-2"
                  :icon="getNoDataIcon()"
                />
                <div class="text-body-1">{{ getNoDataMessage() }}</div>
                <div class="text-caption text-grey mt-1">
                  {{ getNoDataSubMessage() }}
                </div>
              </div>
            </template>
          </v-data-table>
        </v-card>
        <v-card class="mt-2">
          <v-card-text>
            <v-data-table
              :headers="data.headers_items"
              :items="newPenawaran.items"
              item-value="id"
              class="rounded-lg"
            >
              <template #item.nominal="{ item }">
                {{ rupiah(item.nominal) }}
              </template>

              <template #item.subtotal="{ item }">
                {{ rupiah(item.subtotal) }}
              </template>
              <template v-slot:item.jumlah_unit="{ item }">
                <v-chip
                  v-if="item.jumlahUnit"
                  size="x-small"
                  color="blue-darken-1"
                  variant="flat"
                  class="font-weight-bold text-body-2"
                >
                  {{ item.jumlahUnit }} Unit
                </v-chip>
                <span v-else class="text-body-2 text-disabled">0</span>
              </template>
              <template v-slot:item.periode_penawaran="{ item }">
                <div
                  v-if="
                    item.periode_penawaran &&
                    item.periode_penawaran.mulai !== '-'
                  "
                  class="d-flex flex-column py-1"
                >
                  <div class="d-flex align-center mb-n1">
                    <v-icon size="12" color="success" class="me-1"
                      >mdi-play-circle</v-icon
                    >
                    <span class="text-xxs text-grey-darken-3">
                      {{ formatTanggal(item.periode.mulai) }}</span
                    >
                  </div>
                  <div class="d-flex align-center mt-1">
                    <v-icon size="12" color="error" class="me-1"
                      >mdi-stop-circle</v-icon
                    >
                    <span class="text-xxs text-error font-weight-bold">{{
                      formatTanggal(item.periode.selesai)
                    }}</span>
                  </div>
                </div>
                <span v-else class="text-caption text-disabled">—</span>
              </template>

              <template #item.actions="{ index }">
                <v-btn
                  icon
                  size="x-small"
                  class="bg-red-darken-2"
                  @click="hapusitempenawaran(index)"
                >
                  <v-icon size="16" color="white">
                    mdi-trash-can-outline
                  </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <br />
        <div class="d-flex align-center mb-2 px-1">
          <v-icon
            size="18"
            color="primary"
            class="mr-2"
            icon="mdi-numeric-3-circle"
          />

          <div class="d-flex flex-column">
            <span class="text-caption font-weight-black text-grey-darken-2">
              DAFTAR ITEM TAMBAHAN
            </span>
            <span class="text-caption text-grey-darken-1">
              Cth. Jasa / Biaya Koordinasi / dll
            </span>
          </div>
        </div>

        <v-row>
          <v-col>
            <a-text-field
              label="Keterangan"
              v-model="newlisitemtambahan.keterangan_penawaran"
            />
          </v-col>

          <v-col cols="4">
            <a-field-number
              label="Nominal"
              v-model="newlisitemtambahan.nominal_tambahan"
            />
          </v-col>

          <v-col cols="1">
            <v-btn color="blue" size="25" @click="additemtambahan" class="mt-8">
              <v-icon size="25" color="white" icon="mdi-plus" />
            </v-btn>
          </v-col>
        </v-row>

        <v-card
          variant="flat"
          border
          class="rounded-lg overflow-hidden bg-white mt-3"
        >
          <div class="bg-grey-lighten-4 px-4 py-2 border-b d-flex align-center">
            <span class="text-caption font-weight-bold text-grey-darken-3"
              >ITEM TAMBAHAN</span
            >
          </div>

          <v-data-table
            :headers="data.headItemTambahan"
            :items="newPenawaran.item_tambahan"
            hide-default-footer
            density="compact"
            :hover="true"
            :items-per-page="data.itemsPerPageKategori"
            v-model:page="data.pageKategori"
            class="compact-table"
          >
            <template v-slot:item.no="{ index }">
              <span class="text-caption font-weight-medium text-grey-darken-1">
                {{ index + 1 }}
              </span>
            </template>
            <template v-slot:item.nominal_tambahan="{ item }">
              <span class="text-caption font-weight-medium text-grey-darken-1">
                Rp {{ rupiah(item.nominal_tambahan) }}
              </span>
            </template>
            <template v-slot:item.aksi="{ index }">
              <v-btn color="blue" size="20" @click="deleteitemtambahan(index)">
                <v-icon size="15" color="white">mdi-trash-can</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>

        <div class="mt-3 bg-grey-lighten-5">
          <v-card
            color="primary-lighten-5"
            variant="flat"
            class="pa-3 rounded-lg border-primary border-dashed border-sm"
          >
            <!-- <div class="d-flex justify-space-between text-caption">
                <span>Total Item Kategori</span>
                <span>Rp {{ rupiah(totalPenawaran - totalItemTambahan) }}</span>
              </div>

              <div class="d-flex justify-space-between text-caption">
                <span>Total Item Tambahan</span>
                <span>Rp {{ rupiah(totalItemTambahan) }}</span>
              </div> -->

            <!-- <v-divider class="my-2" /> -->

            <div class="d-flex justify-space-between font-weight-black">
              <span>Eestimasi Total Penawaran</span>
              <span>Rp {{ rupiah(totalPenawaran) }}</span>
            </div>
          </v-card>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-3">
        <!-- <v-checkbox
          v-model="newPenawaran.status_terkirim_email"
          label="Penawaran sudah dikirim email"
          hide-details
          density="compact"
          class="ma-0"
          color="blue"
        /> -->

        <v-btn
          variant="flat"
          color="grey-lighten-1"
          @click="data.dialogPenawaran = false"
          class="text-capitalize px-3"
        >
          Batal
        </v-btn>

        <v-btn
          color="primary"
          @click="savePenawaran"
          variant="flat"
          class="text-capitalize px-3"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-row align="center" class="mb-5 mt-2">
    <v-col cols="12" sm="8">
      <div class="d-flex align-center">
        <v-icon color="primary" size="36" class="me-3"
          >mdi-file-edit-outline</v-icon
        >
        <div>
          <h1
            class="text-h5 font-weight-black text-grey-darken-4"
            style="letter-spacing: -0.02em"
          >
            PENAWARAN
          </h1>
          <div class="d-flex align-center mt-1">
            <v-chip
              size="x-small"
              color="primary"
              variant="flat"
              class="font-weight-bold me-2"
              >ERP SYSTEM</v-chip
            >
            <span class="text-caption text-grey-darken-1 font-weight-medium"
              >Manajemen dokumen penawaran harga</span
            >
          </div>
        </div>
      </div>
    </v-col>

    <v-col cols="12" sm="4" class="text-sm-right">
      <v-btn
        color="#195de6"
        @click="openDialogAdd"
        elevation="0"
        height="34"
        class="text-capitalize font-weight-bold rounded-lg border shadow-sm"
        prepend-icon="mdi-plus-circle"
      >
        Buat Penawaran
      </v-btn>
    </v-col>
  </v-row>

  <v-card>
    <v-card-text>
      <!-- Header -->
      <v-row align="center" justify="space-between" class="mb-1">
        <v-col cols="auto">
          <h3 class="text-body-1 font-weight-medium text-grey-darken-1">
            Filter Pencarian
          </h3>
        </v-col>

        <v-col cols="auto">
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                size="small"
                color="primary"
                variant="flat"
                rounded="xl"
                class="d-flex align-center"
                @click="showFilter = !showFilter"
              >
                <v-icon size="x-large">
                  {{ showFilter ? "mdi-chevron-up" : "mdi-chevron-down" }}
                </v-icon>
              </v-btn>
            </template>
            <span>Tampilkan / Sembunyikan Filter</span>
          </v-tooltip>
        </v-col>
      </v-row>

      <v-divider />

      <!-- Filter -->
      <v-expand-transition>
        <div v-show="showFilter">
          <v-row class="mt-0" align="end">
            <v-col cols="12" sm="2">
              <a-date-picker
                v-model="data.tanggal_awal"
                label="Tanggal Awal"
                :onUpdate:modelValue="(n: string) => (data.tanggal_awal = n)"
              />
            </v-col>

            <v-col cols="12" sm="2">
              <a-date-picker
                v-model="data.tanggal_akhir"
                label="Tanggal Akhir"
                :onUpdate:modelValue="(n: string) => (data.tanggal_akhir = n)"
              />
            </v-col>

            <v-col cols="12" sm="2">
              <a-select
                v-model="data.nama_perusahaan"
                label="Nama Perusahaan"
                :items="perusahaanStore.getDataPerusahaan"
                item-title="nama_perusahaan"
                item-value="nama_perusahaan"
              />
            </v-col>

            <v-col cols="12" sm="2">
              <a-select
                v-model="data.nama_cabang"
                label="Cabang Perusahaan"
                :items="perusahaanStore.getDataCabang"
                item-title="nama_cabang"
                item-value="nama_cabang"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" sm="2">
              <a-select
                v-model="data.status"
                label="Status"
                variant="solo"
                :items="[
                  'Draft',
                  'Dikirim',
                  'Disetujui',
                  'Dibatalkan',
                  'Invoice',
                ]"
              />
            </v-col>

            <v-col cols="12" sm="2" class="d-flex justify-end">
              <v-btn
                size="small"
                color="primary"
                class="mt-4"
                @click="cekrekapan"
              >
                Terapkan
                <v-tooltip activator="parent" location="top">
                  Cek data Pesanan Pembelian
                </v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>
    </v-card-text>
  </v-card>
  <br />

  <v-card flat rounded="lg" class="border">
    <v-card-title class="pa-3">
      <v-row align="center">
        <v-col cols="12" md="9">
          <a-text-field
            v-model="data.search"
            placeholder="Search"
            style="max-width: 280px"
          />
        </v-col>

        <v-col cols="12" md="3">
          <div class="d-flex flex-column" style="gap: 6px">
            <span
              style="font-size: 12px; color: grey"
              class="font-weight-medium"
            >
              Jumlah Penawaran Keseluruhan :
              <strong>{{ penawaranStore.getDataPenawaran.length }}</strong>
            </span>

            <div class="d-flex" style="gap: 10px">
              <v-btn
                color="primary"
                size="small"
                variant="elevated"
                prepend-icon="mdi-cloud-download"
                class="rounded-lg font-weight-bold"
                @click="tarikSemuaPenawaran"
              >
                Tarik Semua Penawaran
              </v-btn>

              <v-btn
                color="grey-darken-2"
                size="small"
                variant="tonal"
                prepend-icon="mdi-refresh"
                class="rounded-lg font-weight-bold"
                @click="refreshData"
              >
                Refresh
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      :headers="data.headPenawaran"
      :search="data.search"
      :items="penawaranStore.dataPenawaranTampil"
      :sort-by="[{ key: 'createdAt', order: 'desc' }]"
      v-model:page="data.page"
      :items-per-page="data.itemsPerPage"
      density="compact"
      :hover="true"
      class="fixed-layout-table"
    >
      <template v-slot:item.no="{ index }">
        <span class="text-caption font-weight-bold text-grey-darken-1">
          {{ (data.page - 1) * data.itemsPerPage + index + 1 }}.
        </span>
      </template>
      <template v-slot:item.perihal="{ item }">
        <div style="width: 220px" class="text-wrap-column font-weight-medium">
          {{ item.perihal }}
        </div>
      </template>

      <template v-slot:item.total="{ item }">
        <div style="width: 100px">Rp {{ rupiah(item.total) }}</div>
      </template>

      <template v-slot:item.nama_cabang_perusahaan="{ item }">
        <v-chip
          size="small"
          variant="tonal"
          color="success"
          rounded="lg"
          class="font-weight-bold cursor-pointer"
          style="border-bottom: 2px solid #2e7d32"
          :to="'/admin/penawaran/' + item.id"
        >
          <v-icon start size="14" icon="mdi-eye" />
          {{ item.nama_cabang_perusahaan }}
          <v-tooltip activator="parent" location="top">Detail</v-tooltip>
        </v-chip>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip
          :color="
            {
              Draft: 'blue-darken-1',
              Terkirim: 'grey-darken-2',
              SPK: 'deep-purple-darken-1',
              Proses: 'warning',
              Pemberkasan: 'success',
              Disetujui: 'primary',
              Ditolak: 'error',
              Dibatalkan: 'error',
            }[item.status] || 'black'
          "
          size="small"
          rounded="lg"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.aksi="{ item }">
        <div class="d-flex justify-center pa-2">
          <v-btn
            size="27"
            variant="tonal"
            color="error"
            class="rounded-lg ml-2"
            @click="hapusPenawaran(item)"
          >
            <v-icon icon="mdi-trash-can-outline" />
            <v-tooltip activator="parent" location="top">Hapus</v-tooltip>
          </v-btn>
        </div>
      </template>

      <template v-slot:item.nama_perusahaan="{ item }">
        <v-chip
          size="small"
          variant="flat"
          color="blue-grey-lighten-5"
          class="text-blue-grey-darken-3 font-weight-bold border"
        >
          <v-avatar start color="blue-grey-darken-1" size="18">
            <span class="text-white" style="font-size: 8px">
              {{ item.nama_perusahaan.substring(0, 1) }}
            </span>
          </v-avatar>
          {{ item.nama_perusahaan.toUpperCase() }}
        </v-chip>
      </template>

      <template v-slot:item.deadline="{ item }">
        <div class="py-2" style="min-width: 120px">
          <div class="d-flex justify-space-between align-end mb-1">
            <div class="d-flex align-center">
              <v-icon
                :color="getDeadlineColor(item.tanggal)"
                size="14"
                class="me-1"
              >
                {{
                  countdownday(item.tanggal) <= 5
                    ? "mdi-alert-circle"
                    : "mdi-clock-outline"
                }}
              </v-icon>
              <span
                class="text-caption font-weight-black"
                :class="`text-${getDeadlineColor(item.tanggal)}`"
              >
                {{ countdownday(item.tanggal) }} Hari
              </span>
            </div>
            <span class="text-xxs text-grey-darken-1 font-weight-bold">
              {{ Math.round(calculateProgress(item.tanggal)) }}%
            </span>
          </div>

          <v-progress-linear
            :model-value="calculateProgress(item.tanggal)"
            :color="getDeadlineColor(item.tanggal)"
            height="10"
            rounded
            striped
            indeterminate-extension
            class="rounded-pill shadow-sm"
          >
            <template v-slot:default="{ value }"> </template>
          </v-progress-linear>
        </div>
      </template>

      <template v-slot:no-data>
        <div class="py-8 text-center text-grey-darken-1">
          <v-icon
            size="48"
            color="grey-lighten-1"
            class="mb-2"
            icon="mdi-file-document-plus-outline"
          />
          <div class="text-body-1">Tidak ada data Penawaran</div>
        </div>
      </template>

      <template v-slot:bottom>
        <v-divider />

        <div class="bg-grey-lighten-5 px-4 py-2">
          <v-row no-gutters align="center">
            <v-col
              cols="12"
              md="8"
              class="d-flex align-center flex-wrap"
              style="gap: 8px"
            >
              <div
                class="d-flex align-center bg-white border rounded-lg px-3 py-1 shadow-sm mr-2"
              >
                <v-icon
                  size="16"
                  color="primary"
                  icon="mdi-database-outline"
                  class="mr-2"
                />
                <span class="text-caption font-weight-medium">
                  <span class="text-grey">Menampilkan</span>
                  <strong class="text-primary ml-1">
                    {{ (data.page - 1) * data.itemsPerPage + 1 }}-{{
                      Math.min(
                        data.page * data.itemsPerPage,
                        penawaranStore.getDataPenawaran.length,
                      )
                    }}
                  </strong>
                  <span class="text-grey mx-1">/</span>
                  <strong>{{ penawaranStore.getDataPenawaran.length }}</strong>
                  <span class="text-grey mx-1">Data</span>
                </span>
              </div>

              <!-- <v-divider vertical class="mx-3 d-none d-sm-flex" />

              <div
                class="d-flex align-center flex-wrap mt-1 mt-sm-0"
                style="gap: 12px"
              >
                <div class="d-flex align-center">
                  <v-badge dot color="teal-accent-4" inline class="me-1" />
                  <span class="text-xxs text-grey-darken-1">Aman (>20 hr)</span>
                </div>
                <div class="d-flex align-center">
                  <v-badge dot color="amber-darken-2" inline class="me-1" />
                  <span class="text-xxs text-grey-darken-1"
                    >Mendekati (>5 hr)</span
                  >
                </div>
                <div class="d-flex align-center">
                  <v-badge dot color="red-accent-3" inline class="me-1" />
                  <span class="text-xxs text-grey-darken-1"
                    >Kritis (<5 hr)</span
                  >
                </div>
              </div> -->
            </v-col>

            <v-col
              cols="12"
              md="4"
              class="d-flex justify-md-end justify-center mt-2 mt-md-0"
            >
              <div
                class="d-flex align-center bg-white border rounded-lg px-3 py-0"
                style="min-width: 140px; height: 32px"
              >
                <v-icon
                  size="14"
                  color="grey"
                  icon="mdi-layers-outline"
                  class="mr-2"
                />
                <span
                  class="text-caption text-grey-darken-1 mr-2"
                  style="white-space: nowrap"
                  >Tampilkan:</span
                >

                <v-select
                  v-model="data.itemsPerPage"
                  :items="[
                    { title: '10', value: 10 },
                    { title: '25', value: 25 },
                    { title: '50', value: 50 },
                    { title: 'Semua', value: -1 },
                  ]"
                  variant="plain"
                  density="compact"
                  hide-details
                  class="mt-n2"
                  @update:model-value="data.page = 1"
                >
                  <template v-slot:selection="{ item }">
                    <span class="text-caption font-weight-black text-primary">{{
                      item.title
                    }}</span>
                  </template>
                </v-select>
              </div>
            </v-col>
          </v-row>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import type { ConfirmationDialog } from "#components";
import _ from "lodash";
import moment from "moment";
import { useMasterKategoriStore } from "~/stores/master/kategoriStore";
import { useMasterPerusahaanStore } from "~/stores/master/perusahaanStore";
import type {
  listitemtambahanPenawaranM,
  penawaranItemM,
  penawaranM,
} from "~/types/penawaranModel";

definePageMeta({
  layout: "admin",
});

const penawaranStore = usePenawaranStore();
const perusahaanStore = useMasterPerusahaanStore();
const notificationStore = useNotificationStore();
const masterCabangStore = useMasterPerusahaanStore();
const masterobjectstore = useMasterKategoriStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

onMounted(async () => {
  useloadingStore().setLoading(true); // Aktifkan loading
  try {
    await penawaranStore.tarikDataPenawaranAct();
    await penawaranStore.tarikdatapenawaranbystatus("Draft");
    await perusahaanStore.tarikDataCabangAct();
    await perusahaanStore.tarikDataPerusahaanAct();
  } finally {
    useloadingStore().setLoading(false); // Matikan loading setelah semua selesai
  }
});

const tarikSemuaPenawaran = async () => {
  useloadingStore().setLoading(true); // Aktifkan loading panel
  try {
    // Menarik semua data penawaran dari server
    await penawaranStore.tarikDataPenawaranAct();
  } catch (error) {
    console.error("Gagal menarik semua data penawaran:", error);
  } finally {
    useloadingStore().setLoading(false); // Matikan loading panel
  }
};

const refreshData = async () => {
  useloadingStore().setLoading(true);
  try {
    // Memanggil ulang data spesifik status Draft seperti di onMounted
    await penawaranStore.tarikdatapenawaranbystatus("Draft");
  } catch (error) {
    console.error("Gagal merefresh data:", error);
  } finally {
    useloadingStore().setLoading(false);
  }
};

const data = reactive({
  search: "",
  addedit: "",
  nama_id: "",
  new_item: "",
  tanggal_awal: "",
  tanggal_akhir: "",
  status: "",
  nama_perusahaan: "",
  nama_cabang: "",
  id_penawaran: "",
  dialogPenawaran: false,
  dialogEdit: false,
  page: 1,
  itemsPerPage: 10,
  pageKategori: 1,
  itemsPerPageKategori: 10,
  items_kategori: [],

  header: [
    { title: "No", value: "no" },
    { title: "Item", value: "new_item" },
  ],

  headers_items: [
    { title: "Nama", key: "nama_kategori_item" },
    { title: "Periode Penawaran", value: "periode_penawaran", sortable: true },
    { title: "Nominal", key: "nominal" },
    { title: "Jumlah", key: "jumlahUnit" },
    { title: "Subtotal", key: "subtotal" },
    { title: "Aksi", key: "actions", sortable: false },
  ],

  headPenawaran: [
    { title: "No", value: "no", width: "50px" },
    { title: "Tanggal", value: "tanggal", sortable: true },
    { title: "No. Penawaran", value: "no_penawaran", sortable: true },
    { title: "Perusahaan", value: "nama_perusahaan", sortable: true },
    { title: "Cabang", value: "nama_cabang_perusahaan", sortable: true },
    { title: "Perihal", value: "perihal", sortable: true },
    { title: "Nominal", value: "total", sortable: true },

    // {
    //   title: "Deadline",
    //   value: "deadline",
    //   sortable: true,
    //   align: "center" as const,
    // },
    {
      title: "Status",
      value: "status",
      sortable: true,
      align: "center" as const,
    },
    { title: "Aksi", value: "aksi", align: "center" as const, width: "50px" },
  ],

  headKategoriItem: [
    {
      title: "No",
      value: "no",
      align: "center" as const,
      width: "50px",
    },
    { title: "Nama", value: "nama_kategori_item", sortable: true },
    { title: "Jumlah", value: "jumlah_unit", sortable: true, width: "50px" },
    { title: "Periode Terakhir", value: "periode", sortable: true },
    { title: "Periode Penawaran", value: "periode_penawaran", sortable: true },
    { title: "Nominal", value: "nominal", sortable: true },
    { title: "Status", value: "status", sortable: true },
    {
      title: "Pilih",
      value: "select",
      align: "center" as const,
      width: "50px",
    },
  ],
  headItemTambahan: [
    {
      title: "No",
      value: "no",
      align: "center" as const,
      width: "50px",
    },
    { title: "Keterangan", value: "keterangan_penawaran", sortable: true },
    { title: "Nominal", value: "nominal_tambahan", sortable: true },
    { title: "Aksi", value: "aksi", width: "50px" },
  ],
});

const newlisitemtambahan = ref<listitemtambahanPenawaranM>({
  keterangan_penawaran: "",
  nominal_tambahan: 0,
  kena_ppn: false,
  kena_pph: false,
  ppn_tambahan: 0,
  pph_tambahan: 0,
  status_item_tambahan: false,
});
const newPenawaran = ref<penawaranM>({
  id_perusahaan: "",
  id_cabang_perusahaan: "",
  nomor: "",
  tanggal: "",
  perihal: "",
  items: [],
  catatan: [],
  total: 0,
  terbilang: "",
  status: "Draft",
  createdAt: 0,
  createdBy: "",
  nama_cabang_perusahaan: "",
  nama_perusahaan: "",
  nama_group_pt: "",
  nama_surat: "",
  id_object_kategori: "",
  nama_kategori_object: "",
  kategori_object: "",
  telepon_perusahaan: "",
  item_tambahan: [],
  handle_by_aresa: "",
  // status_terkirim_email: false,
  jumlah_revisi: 1,
  berkas: [],
  item_kode_bayar: [],
});

const itemForm = ref<penawaranItemM>({
  nama: "",
  qty: 0,
  harga: 0,
  subtotal: 0,
});

async function openDialogAdd() {
  await masterobjectstore.tarikDataObjectKategoriAct();
  await perusahaanStore.tarikDataPerusahaanAct();
  await masterCabangStore.tarikDataCabangAct();
  masterCabangStore.clearDataItemKategori();
  selectedItems.value = [];
  selectAll.value = false;

  // Reset pagination
  data.pageKategori = 1;

  data.addedit = "add";
  data.dialogPenawaran = true;

  newPenawaran.value = {
    id_perusahaan: "",
    id_cabang_perusahaan: "",
    nomor: "",
    tanggal: "",
    perihal: "",
    items: [],
    catatan: [],
    total: 0,
    terbilang: "",
    status: "Draft",
    createdAt: 0,
    createdBy: "",
    nama_cabang_perusahaan: "",
    nama_perusahaan: "",
    nama_group_pt: "",
    nama_surat: "",
    id_object_kategori: "",
    nama_kategori_object: "",
    kategori_object: "",
    telepon_perusahaan: "",
    handle_by_aresa: "",
    // status_terkirim_email: false,
    berkas: [],
    item_kode_bayar: [],
    item_tambahan: [],
    jumlah_revisi: 1,
  };
}

// function tambahItem() {
//   const itemBaru = {
//     id: Date.now(),
//     nama_item: formItem.nama_item,
//     qty: formItem.qty,
//     harga: formItem.harga,
//     total: formItem.qty * formItem.harga,
//     createdAt: moment().unix(),
//   };

//   // ⬇️ ini yang bikin langsung muncul di table
//   newPenawaran.value.items.push(itemBaru);

//   // reset form (opsional)
//   formItem.nama_item = "";
//   formItem.qty = 0;
//   formItem.harga = 0;
// }

watch(
  () => masterCabangStore.getDataItemKategori,
  (items) => {
    items.forEach((item: any) => {
      if (!item.periode_penawaran) {
        item.periode_penawaran = {
          mulai: "",
          selesai: "",
        };
      }
    });
  },
  { deep: true },
);
const addedItemIds = ref<number[]>([]);

function tambahItem(item: any) {
  // const exists = newPenawaran.value.items.find(
  //   (i: any) => i.id_kategori_item === item.id,
  // );

  // if (exists) {
  //   return notificationStore.showInfo("Item sudah ditambahkan");
  // }

  // 1. Validasi Keberadaan Data Periode
  if (!item.periode_penawaran?.mulai || !item.periode_penawaran?.selesai) {
    // Anda bisa mengganti alert ini dengan snackbar/toast library Anda
    notificationStore.showError(
      "Harap isi Periode Awal dan Periode Akhir terlebih dahulu!",
    );
    return;
  }

  // 2. Validasi Logika Tanggal (Selesai tidak boleh sebelum Mulai)
  const tglMulai = item.periode_penawaran.mulai;
  const tglSelesai = item.periode_penawaran.selesai;

  if (tglSelesai < tglMulai) {
    notificationStore.showError(
      "Tanggal Akhir tidak boleh lebih kecil dari Tanggal Awal!",
    );
    return;
  }

  // Cek status item
  if (item.status !== "Draft") {
    return notificationStore.showError(
      "Item dengan status selain Draft tidak bisa ditambahkan",
    );
  }

  // Cek jika sudah ditambahkan sebelumnya
  if (addedItemIds.value.includes(item.id)) {
    return notificationStore.showInfo("Item sudah ditambahkan");
  }

  const itemBaru = {
    id_kategori_item: item.id,
    id_object_kategori: item.id_object_kategori,
    id_perusahaan: item.id_perusahaan,
    id_cabang_perusahaan: item.id_cabang,
    nama_kategori_item: item.nama_kategori_item,
    nama_kategori_object: item.nama_kategori_object,
    nama_perusahaan: item.nama_perusahaan,
    nama_group_pt: item.nama_group_pt,
    nama_cabang: item.nama_cabang,
    kode_kategori_item: item.kode_kategori_item,
    jumlahUnit: item.jumlahUnit,
    ukuran: item.ukuran ?? [],
    periode: item.periode ?? { mulai: "-", selesai: "-" },
    periode_penawaran: item.periode_penawaran ?? { mulai: "-", selesai: "-" },
    keterangan: item.keterangan ?? "-",
    dokumen: item.dokumen ?? [],
    nominal: Number(item.nominal) || 0,
  };
  console.log(itemBaru, "itembaru");
  console.log(newPenawaran.value.items, "cek items");
  newPenawaran.value.items.push(itemBaru);
  addedItemIds.value.push(item.id); // tandai sudah ditambahkan
}

function hapusData(index: number) {
  const removedItem = newPenawaran.value.items[index];
  // Hapus dari addedItemIds supaya bisa ditambahkan lagi
  addedItemIds.value = addedItemIds.value.filter(
    (id) => id !== removedItem.id_kategori_item,
  );
  // Hapus dari list penawaran
  _.pullAt(newPenawaran.value.items, index);

  notificationStore.showSuccess("Item berhasil dihapus");
}

watch(
  () => newPenawaran.value.id_object_kategori,
  async (idobject) => {
    const dataobject = masterobjectstore.getDataObjectKategori;

    const b = _.find(dataobject, (o: any) => o.id == idobject);
    if (!_.isUndefined(b)) {
      newPenawaran.value.nama_kategori_object = b!.nama;
      newPenawaran.value.kategori_object = b!.kategori;

      // Reset selected items ketika object berubah
      selectedItems.value = [];
      selectAll.value = false;

      // Reset pagination
      data.pageKategori = 1;

      // Cek apakah perusahaan dan cabang sudah dipilih
      if (!newPenawaran.value.id_perusahaan) {
        notificationStore.showInfo("Silakan pilih Perusahaan terlebih dahulu");
        masterCabangStore.clearDataItemKategori();
        return;
      }

      if (!newPenawaran.value.id_cabang_perusahaan) {
        notificationStore.showInfo("Silakan pilih Cabang terlebih dahulu");
        masterCabangStore.clearDataItemKategori();
        return;
      }

      // Tunggu sampai data selesai dimuat
      await masterCabangStore.tarikDataItemKategori(
        newPenawaran.value.id_perusahaan,
        newPenawaran.value.id_cabang_perusahaan,
        b.id!,
      );

      // Berikan notifikasi jika berhasil memuat data
      if (masterCabangStore.getDataItemKategori.length > 0) {
        notificationStore.showSuccess(
          `Berhasil memuat ${masterCabangStore.getDataItemKategori.length} item kategori`,
        );
      } else {
        notificationStore.showInfo(
          "Tidak ada item kategori untuk kombinasi ini",
        );
      }
    } else {
      // Jika object dikosongkan
      masterCabangStore.clearDataItemKategori();
      selectedItems.value = [];
      selectAll.value = false;
    }
  },
);

watch(
  () => newPenawaran.value.id_perusahaan,
  async (idperusahaan) => {
    const dataperusahaan = perusahaanStore.getDataPerusahaan;
    const b = _.find(dataperusahaan, (o: any) => o.id == idperusahaan);

    if (!_.isUndefined(b)) {
      newPenawaran.value.nama_perusahaan = b!.nama_perusahaan;
      newPenawaran.value.nama_surat = b!.nama_surat!;
      newPenawaran.value.telepon_perusahaan = b!.telepon_perusahaan;
      newPenawaran.value.nama_group_pt = b!.nama_group_pt;

      // Reset cabang dan item kategori ketika perusahaan berubah
      newPenawaran.value.id_cabang_perusahaan = "";
      newPenawaran.value.id_object_kategori = "";
      masterCabangStore.clearDataItemKategori();
      selectedItems.value = [];
      selectAll.value = false;
      data.pageKategori = 1;

      await masterCabangStore.tarikDataCabangPerusahaan(b.id!);

      // Berikan notifikasi jika berhasil memuat cabang
      if (masterCabangStore.getDataCabang.length > 0) {
        notificationStore.showSuccess(
          `Berhasil memuat ${masterCabangStore.getDataCabang.length} cabang`,
        );
      }
    }
  },
);

// Tambahkan watch untuk cabang
watch(
  () => newPenawaran.value.id_cabang_perusahaan,
  async (idcabang) => {
    const datacabang = masterCabangStore.getDataCabang;
    const b = _.find(datacabang, (o: any) => o.id == idcabang);

    if (!_.isUndefined(b)) {
      newPenawaran.value.nama_cabang_perusahaan = b!.nama_cabang;
      newPenawaran.value.alamat_cabang = b!.alamat_cabang;
      // Reset object dan item kategori ketika cabang berubah
      newPenawaran.value.id_object_kategori = "";
      masterCabangStore.clearDataItemKategori();
      selectedItems.value = [];
      selectAll.value = false;
      data.pageKategori = 1;

      notificationStore.showInfo(
        "Silakan pilih Object untuk melihat item kategori",
      );
    }
  },
);

watch(
  () => data.nama_perusahaan,

  async (idperusahaan) => {
    const dataperusahaan = perusahaanStore.getDataPerusahaan;

    const b = _.find(
      dataperusahaan,
      (o: any) => o.nama_perusahaan == idperusahaan,
    );
    // console.logb, 'si b')
    if (!_.isUndefined(b)) {
      await perusahaanStore.tarikDataCabangPerusahaan(b.id!);
    }
  },
);

watch(
  () => data.nama_cabang,

  async (idcabang) => {
    const datacabang = perusahaanStore.getDataCabang;

    const b = _.find(datacabang, (o: any) => o.nama_cabang == idcabang);
    // console.logb, 'si b')
    if (!_.isUndefined(b)) {
    }
  },
);

const selectedItems = ref<number[]>([]);
const selectAll = ref(false);

const selectedKategoriItems = computed(() => {
  return masterCabangStore.getDataItemKategori
    .filter((item) => selectedItems.value.includes(item.id))
    .map((item) => ({
      // id_kategori_item: item.id,
      // nama_kategori_item: item.nama_kategori_item,
      // nominal: Number(item.nominal) || 0,

      // relasi
      id_kategori_item: item.id,
      id_object_kategori: item.id_object_kategori,
      id_perusahaan: item.id_perusahaan,
      id_cabang_perusahaan: item.id_cabang,

      // nama
      nama_kategori_item: item.nama_kategori_item,
      nama_kategori_object: item.nama_kategori_object,
      nama_perusahaan: item.nama_perusahaan,
      nama_cabang: item.nama_cabang,

      // detail item
      kode_kategori_item: item.kode_kategori_item,
      jumlahUnit: item.jumlahUnit,
      ukuran: item.ukuran ?? [],
      periode: item.periode ?? { mulai: "-", selesai: "-" },
      keterangan: item.keterangan ?? "-",

      // dokumen (🔥 penting)
      dokumen: item.dokumen ?? [],

      // harga
      nominal: Number(item.nominal) || 0,
    }));
});

// watch(selectAll, (val) => {
//   selectedItems.value = val
//     ? masterCabangStore.getDataItemKategori.map((i) => i.id)
//     : [];
// });

// watch(
//   selectedKategoriItems.value,
//   (val) => {
//     data.items_kategori = val;
//     newPenawaran.value.total = totalPenawaran.value;

//     // Berikan notifikasi jika total 0 tapi ada item yang dipilih
//     if (val.length > 0 && totalPenawaran.value === 0) {
//       notificationStore.showInfo("Mohon isi nominal sebelum menyimpan data");
//     }
//   },
//   { deep: true },
// );

const totalUnit = computed(() => {
  return _.sumBy(masterCabangStore.getDataItemKategori, "jumlahUnit");
});

watch(
  () => newPenawaran.value.items,
  (val) => {
    newPenawaran.value.total = totalPenawaran.value;

    // notificationStore.showInfo("Berhasil ditambahkan");
  },
  { deep: true },
);

watch(
  () => newPenawaran.value.items,
  (items) => {
    items.forEach((item: any) => {
      item.subtotal = Number(item.nominal || 0) * Number(item.jumlahUnit || 0);
    });
  },
  { deep: true },
);

const totalPenawaran = computed(() => {
  const totalItem = _.sumBy(newPenawaran.value.items ?? [], (item: any) => {
    return Number(item.nominal || 0) * Number(item.jumlahUnit || 0);
  });

  const totalTambahan = _.sumBy(
    newPenawaran.value.item_tambahan ?? [],
    (item: any) => Number(item.nominal_tambahan || 0),
  );

  return totalItem + totalTambahan;
});

// const totalItemTambahan = computed(() => {
//   return _.sumBy(
//     newPenawaran.value.item_tambahan,
//     (item) => Number(item.nominal_tambahan) || 0,
//   );
// });

// const totalPenawaran = computed(() => {
//   const totalKategori = _.sumBy(
//     selectedKategoriItems.value,
//     (item) => item.nominal * item.jumlahUnit!,
//   );

//   return totalKategori + totalItemTambahan.value;
// });

// async function savePenawaran() {
//   if (!newPenawaran.value.tanggal)
//     return notificationStore.showError("Tanggal wajib diisi");
//   if (!newPenawaran.value.id_perusahaan)
//     return notificationStore.showError("Perusahaan wajib dipilih");
//   if (!newPenawaran.value.id_cabang_perusahaan)
//     return notificationStore.showError("Cabang wajib dipilih");
//   if (!newPenawaran.value.id_object_kategori)
//     return notificationStore.showError("Object wajib dipilih");
//   // if (!newPenawaran.value.nomor.trim())
//   //   return notificationStore.showError("Nomor penawaran wajib diisi");
//   if (!newPenawaran.value.items.length) {
//     return notificationStore.showError("Pilih minimal satu item");
//   }
//   // if (!selectedKategoriItems.value.length) {
//   //   return notificationStore.showError("Pilih minimal satu item");
//   // }

//   // newPenawaran.value.items = selectedKategoriItems.value;
//   newPenawaran.value.total = totalPenawaran.value;
//   newPenawaran.value.createdAt = moment().unix();
//   newPenawaran.value.createdBy = useUserStore().getEmail;
//   console.log(newPenawaran.value, "ini new penawaran");
//   useloadingStore().setLoading(true);
//   console.log(newPenawaran.value, "cek new penawaran");
//   const c = await setipenawaran(newPenawaran.value);
//   if (c == "ok") {
//     newPenawaran.value = {
//       id_perusahaan: "",
//       id_cabang_perusahaan: "",
//       nomor: "",
//       tanggal: "",
//       perihal: "",
//       items: [],
//       catatan: [],
//       total: 0,
//       terbilang: "",
//       status: "Draft",
//       createdAt: 0,
//       createdBy: "",
//       nama_cabang_perusahaan: "",
//       nama_perusahaan: "",
//       nama_surat: "",
//       id_object_kategori: "",
//       nama_kategori_object: "",
//       telepon_perusahaan: "",
//       item_tambahan: [],
//     };
//     sessionStorage.removeItem("m_item_kategori");
//     notificationStore.showSuccess("Penawaran berhasil ditambahkan");
//   } else {
//     notificationStore.showError("Gagal menambahkan penawaran");
//   }
//   await penawaranStore.tarikDataPenawaranAct();
//   data.dialogPenawaran = false;
//   masterCabangStore.clearDataItemKategori();
//   selectedItems.value = [];
//   selectAll.value = false;
//   useloadingStore().setLoading(false);
// }
type PenawaranFn = (payload: any) => Promise<any>;

function getSetPenawaranFn(nama?: string): PenawaranFn {
  const key = nama?.trim();

  return ["KAM"].includes(key || "")
    ? setipenawaran
    : setipenawaranauto2000danpeugeot;
}

async function savePenawaran() {
  if (!newPenawaran.value.tanggal)
    return notificationStore.showError("Tanggal wajib diisi");

  if (!newPenawaran.value.handle_by_aresa)
    return notificationStore.showError("Handle By wajib dipilih");

  if (!newPenawaran.value.id_perusahaan)
    return notificationStore.showError("Perusahaan wajib dipilih");

  if (!newPenawaran.value.id_cabang_perusahaan)
    return notificationStore.showError("Cabang wajib dipilih");

  if (!newPenawaran.value.id_object_kategori)
    return notificationStore.showError("Object wajib dipilih");
  if (!newPenawaran.value.items.length)
    return notificationStore.showError("Pilih minimal satu item");

  newPenawaran.value.total = totalPenawaran.value;
  newPenawaran.value.createdAt = moment().unix();
  newPenawaran.value.createdBy = useUserStore().getEmail;

  console.log("Nama Perusahaan:", newPenawaran.value.nama_perusahaan);
  console.log("Object Kategori:", newPenawaran.value.id_object_kategori);

  useloadingStore().setLoading(true);

  try {
    const setFn = getSetPenawaranFn(newPenawaran.value.handle_by_aresa);
    const result = await setFn(newPenawaran.value);
    if (result === "ok") {
      newPenawaran.value = {
        id_perusahaan: "",
        id_cabang_perusahaan: "",
        nomor: "",
        tanggal: "",
        perihal: "",
        items: [],
        catatan: [],
        total: 0,
        terbilang: "",
        status: "Draft",
        createdAt: 0,
        createdBy: "",
        nama_cabang_perusahaan: "",
        nama_perusahaan: "",
        nama_group_pt: "",
        nama_surat: "",
        id_object_kategori: "",
        nama_kategori_object: "",
        kategori_object: "",
        telepon_perusahaan: "",
        item_tambahan: [],
        jumlah_revisi: 1,
        berkas: [],
        item_kode_bayar: [],
      };

      sessionStorage.removeItem("m_item_kategori");
      notificationStore.showSuccess("Penawaran berhasil ditambahkan");
    } else {
      notificationStore.showError("Gagal menambahkan penawaran");
    }

    await penawaranStore.tarikDataPenawaranAct();
    data.dialogPenawaran = false;
    masterCabangStore.clearDataItemKategori();
    selectedItems.value = [];
    selectAll.value = false;
  } catch (error) {
    console.error(error);
    notificationStore.showError("Terjadi kesalahan saat menyimpan penawaran");
  } finally {
    useloadingStore().setLoading(false);
  }
}

const hapusPenawaran = async (items: penawaranM) => {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus Penawaran",
    "Anda yakin ingin menghapus data ini? Pastikan Tindakan ini Benar-benar Dibutuhkan",
  );

  if (!confirmed) {
    return notificationStore.showError("Penghapusan Penawaran dibatalkan");
  }
  sessionStorage.removeItem("m_item_kategori");
  penawaranStore.deletePenawaranAct(items);
};

// Fungsi untuk menghitung sisa hari (Pastikan Moment.js sudah terinstall)
const countdownday = (tanggal: string) => {
  if (!tanggal) return 0;
  const target = moment(tanggal);
  const sekarang = moment();
  const selisih = target.diff(sekarang, "days");
  return selisih > 0 ? selisih : 0;
};

// Fungsi menghitung progress (Asumsi 30 hari adalah jangka waktu maksimal penawaran)
const calculateProgress = (tanggal: string) => {
  const sisa = countdownday(tanggal);
  const max = 30; // Batas durasi dalam hari
  const progress = (sisa / max) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

// Warna yang lebih "Vibrant" untuk UI modern
const getDeadlineColor = (tanggal: string) => {
  const hari = countdownday(tanggal);
  if (hari > 20) return "teal-accent-4"; // Masih sangat aman
  if (hari > 10) return "light-blue-darken-1"; // Aman
  if (hari > 5) return "amber-darken-2"; // Perlu diperhatikan
  return "red-accent-3"; // Segera/Kritis
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // Menggunakan notificationStore (asumsi menggunakan method success/show)
    notificationStore.showSuccess(`Nomor Penomoran ${text} berhasil disalin`);
  } catch (err) {
    notificationStore.showError("Gagal menyalin nomor Penomoran");
    console.error("Gagal menyalin: ", err);
  }
};

const showFilter = ref(true);

const cekrekapan = () => {
  const { tanggal_awal, tanggal_akhir, nama_perusahaan, nama_cabang, status } =
    data;

  // 1. Semua filter kosong
  if (
    !tanggal_awal &&
    !tanggal_akhir &&
    !nama_perusahaan &&
    !nama_cabang &&
    !status
  ) {
    notificationStore.showError("Minimal isi salah satu filter pencarian");
    return;
  }

  // 2. Validasi tanggal harus berpasangan
  if ((tanggal_awal && !tanggal_akhir) || (!tanggal_awal && tanggal_akhir)) {
    notificationStore.showError(
      "Tanggal Awal dan Tanggal Akhir harus diisi bersamaan",
    );
    return;
  }
  console.log(nama_perusahaan, "nama_perusahaan");
  console.log(nama_cabang, "nama_cabang");
  // 3. Eksekusi query
  penawaranStore.queryrekapanpenawaran(
    tanggal_awal,
    tanggal_akhir,
    nama_perusahaan,
    nama_cabang,
    status,
  );
};

const getNoDataMessage = () => {
  if (!newPenawaran.value.id_perusahaan) {
    return "Silakan pilih Perusahaan terlebih dahulu";
  }
  if (!newPenawaran.value.id_cabang_perusahaan) {
    return "Silakan pilih Cabang terlebih dahulu";
  }
  if (!newPenawaran.value.id_object_kategori) {
    return "Silakan pilih Object untuk melihat item kategori";
  }
  return "Tidak ada item kategori yang tersedia";
};

const getNoDataSubMessage = () => {
  if (!newPenawaran.value.id_perusahaan) {
    return "Pilih perusahaan dari dropdown di atas untuk melanjutkan";
  }
  if (!newPenawaran.value.id_cabang_perusahaan) {
    return "Pilih cabang dari dropdown setelah memilih perusahaan";
  }
  if (!newPenawaran.value.id_object_kategori) {
    return "Pilih object dari dropdown setelah memilih cabang";
  }
  return "Pastikan Anda telah memilih perusahaan, cabang, dan object yang tepat";
};

const getNoDataIcon = () => {
  if (!newPenawaran.value.id_perusahaan) {
    return "mdi-office-building-outline";
  }
  if (!newPenawaran.value.id_cabang_perusahaan) {
    return "mdi-map-marker-outline";
  }
  if (!newPenawaran.value.id_object_kategori) {
    return "mdi-cube-outline";
  }
  return "mdi-package-variant";
};

function additemtambahan() {
  if (newlisitemtambahan.value.keterangan_penawaran.trim() === "") {
    return notificationStore.showError("Keterangan tambahan wajib diisi");
  }
  if (newlisitemtambahan.value.nominal_tambahan <= 0) {
    return notificationStore.showError("Nominal tambahan harus lebih dari 0");
  }
  newPenawaran.value.item_tambahan.push(newlisitemtambahan.value);
  newlisitemtambahan.value = {
    keterangan_penawaran: "",
    nominal_tambahan: 0,
  };
}

function deleteitemtambahan(index: number) {
  _.pullAt(newPenawaran.value.item_tambahan, index);
}

async function setnamagrouppt() {
  for (const element of penawaranStore.getDataPenawaran) {
    await updatedatabase("penawaran", element.id!, {
      nama_group_pt: "PT. Astra International Tbk",
    });
    for (const elementitem of element.items) {
      await updatedatabase(
        "m_item_kategori/" + elementitem.id_kategori_item + "/penawaran",
        element.id!,
        {
          nama_group_pt: "PT. Astra International Tbk",
        },
      );
    }
    notificationStore.showSuccess(
      "Berhasil memperbarui nama group PT",
      element.id,
    );
  }
}

const formatTanggal = (tanggal: string) => {
  if (!tanggal) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(tanggal));
};

async function hapusitempenawaran(index: number) {
  if (!confirmationDialog.value)
    return notificationStore.showError("Dialog tidak tersedia");

  const confirmed = await confirmationDialog.value.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) return notificationStore.showError("Penghapusan dibatalkan");

  if (index < 0 || index >= newPenawaran.value.items.length) {
    return notificationStore.showError("Index item tidak valid");
  }
  const item = newPenawaran.value.items[index];

  try {
    _.pullAt(newPenawaran.value.items, index);
    // 🔥 WAJIB hapus dari addedItemIds juga
    _.pull(addedItemIds.value, item.id_kategori_item);
    notificationStore.showSuccess("Item penawaran berhasil dihapus");
  } catch (error: any) {
    console.error(error);
    notificationStore.showError(
      error.message || "Gagal menghapus item penawaran",
    );
  }
}
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

.text-xxs {
  font-size: 0.75rem !important;
  line-height: 1rem;
}

.text-wrap-column {
  width: 200px; /* Tentukan lebar */
  white-space: normal; /* Memaksa teks turun ke bawah */
  word-break: break-word; /* Memutus kata yang terlalu panjang */
  line-height: 1.4; /* Memberi spasi antar baris agar enak dibaca */
  padding: 8px 0; /* Memberi ruang atas bawah */
}
</style>
