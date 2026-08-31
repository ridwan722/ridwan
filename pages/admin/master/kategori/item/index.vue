<template>
  <ConfirmationDialog ref="confirmationDialog" />
  <!-- <v-btn @click="setstatus">set</v-btn> -->
  <v-dialog
    v-model="data.dialogAdd"
    :width="$vuetify.display.mdAndUp ? '1300px' : '90%'"
  >
    <v-card class="rounded-lg">
      <v-card-title
        class="px-4 text-subtitle-1 font-weight-bold bg-primary pa-3"
      >
        TAMBAH KATEGORI ITEM
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="5">
            <v-row>
              <v-col cols="12" sm="6">
                <a-select
                  v-model="newKategoriItem.id_perusahaan"
                  label="Nama Perusahaan"
                  :items="masterPerusahaanStore.getDataPerusahaan"
                  item-title="nama_perusahaan"
                  item-value="id"
                  class="mb-3"
                />

                <a-select
                  v-model="newKategoriItem.id_object_kategori"
                  label="Nama Kategori Object"
                  :items="masterKategoriItemStore.getDataObjectKategori"
                  item-title="nama"
                  item-value="id"
                  class="mb-3"
                />

                <a-date-picker
                  v-model="newKategoriItem.periode.mulai"
                  :onUpdate:modelValue="
                    (n: string) => (newKategoriItem.periode.mulai = n)
                  "
                  label="Periode (Mulai)"
                  class="mb-3"
                />

                <a-field-number
                  v-model="newKategoriItem.jumlahUnit"
                  label="Jumlah Unit"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <a-select
                  label="Nama Cabang Perusahaan"
                  item-title="nama_cabang"
                  item-value="id"
                  :items="masterPerusahaanStore.getDataCabang"
                  v-model="newKategoriItem.id_cabang"
                  class="mb-3"
                />

                <a-text-field
                  v-model="newKategoriItem.nama_kategori_object"
                  label="Kategori Object"
                  class="mb-3"
                  disabled
                />

                <a-date-picker
                  v-model="newKategoriItem.periode.selesai"
                  :onUpdate:modelValue="
                    (n: string) => (newKategoriItem.periode.selesai = n)
                  "
                  label="Periode (Selesai)"
                  class="mb-3"
                />

                <a-text-field
                  v-model="newKategoriItem.nama_kategori_item"
                  label="Nama Kategori item"
                  class="mb-3"
                />
              </v-col>
            </v-row>

            <div class="text-subtitle-2 mb-2">Ukuran</div>

            <v-row dense>
              <v-col cols="12" sm="10">
                <a-text-field
                  v-model="data.ukuranInput"
                  placeholder="Cth. 4 x 6 m"
                />
              </v-col>

              <v-col cols="12" sm="2">
                <v-btn
                  color="primary"
                  size="small"
                  @click="addUkuran"
                  class="mt-1 text-capitalize"
                >
                  Tambah
                </v-btn>
              </v-col>
            </v-row>

            <v-chip
              v-for="(u, i) in newKategoriItem.ukuran"
              :key="i"
              closable
              class="ma-1 my-4"
              @click:close="removeUkuran(i)"
            >
              {{ u }}
            </v-chip>

            <a-textarea
              v-model="newKategoriItem.keterangan"
              label="Keterangan"
              class="my-3"
            />
          </v-col>

          <v-col cols="12" sm="7">
            <div class="text-subtitle-2 mb-2">Document</div>
            <v-row>
              <v-col cols="12" sm="6">
                <a-autocomplete
                  v-model="newdokument.id_dokumen"
                  item-title="nama_dokumen"
                  item-value="id"
                  :items="masterdokumenstore.getDataDokumen"
                  placeholder="Nama Dokumen"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <a-text-field
                  v-model="newdokument.no_dokumen"
                  placeholder="No Dokumen"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="10">
                <upload-image />
              </v-col>

              <v-col cols="12" sm="2">
                <v-btn
                  color="primary"
                  size="small"
                  @click="adddokument"
                  class="mt-1 text-capitalize"
                >
                  Tambah
                </v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-data-table
                  hide-default-footer
                  :headers="data.headerdokument"
                  :items="newKategoriItem.dokumen"
                >
                  <template v-slot:item.no="{ index }">
                    {{ index + 1 }}
                  </template>
                  <template v-slot:item.aksi="{ index }">
                    <v-btn size="25" color="red" @click="removeDokument(index)"
                      ><v-icon size="13">mdi-trash-can</v-icon></v-btn
                    >
                  </template>
                  <template v-slot:item.file_dokumen="{ item }">
                    <v-btn
                      color="blue"
                      target="_blank"
                      :href="item.file_dokumen"
                      ><v-icon size="13">mdi-file</v-icon>File</v-btn
                    >
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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
          @click="saveItemKategori"
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
    v-model="data.dialogunmanage"
    :width="$vuetify.display.mdAndUp ? '380px' : '90%'"
  >
    <v-card class="rounded-lg">
      <v-card-title
        class="px-4 text-subtitle-1 font-weight-bold bg-primary pa-3"
      >
        UNMANAGE KATEGORI ITEM
      </v-card-title>

      <v-card-text>
        <a-select
          v-model="data.alasan_unmanage"
          label="Pilih Alasan"
          :items="[
            'Sudah Tidak Aktif',
            'Perubahan Regulasi',
            'Pengurusan Sendiri',
            'Perubahan Kebijakan Perusahaan',
            'Proyek Dibatalkan/Ditutup',
            'Lainnya (Tulis di Catatan)',
          ]"
          class="mb-3"
        />

        <a-textarea
          label="Catatan"
          v-if="data.alasan_unmanage == 'Lainnya (Tulis di Catatan)'"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-3 bg-grey-lighten-4">
        <v-btn
          variant="flat"
          color="grey-darken-2"
          @click="closeDialogUnManage"
          class="text-capitalize px-3"
          size="small"
        >
          Batal
        </v-btn>

        <v-btn
          color="primary"
          @click="saveUnManage"
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
    v-model="data.dialogEdit"
    :width="$vuetify.display.mdAndUp ? '1300px' : '90%'"
  >
    <v-card class="rounded-lg">
      <v-card-title
        class="px-4 text-subtitle-1 font-weight-bold bg-primary pa-3"
      >
        PERBARUI KATEGORI ITEM
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="5">
            <v-row>
              <v-col cols="12" sm="6">
                <a-select
                  v-model="editKategoriItem.id_perusahaan"
                  label="Nama Perusahaan"
                  :items="masterPerusahaanStore.getDataPerusahaan"
                  item-title="nama_perusahaan"
                  item-value="id"
                  class="mb-3"
                />

                <a-select
                  v-model="editKategoriItem.id_object_kategori"
                  label="Nama Kategori Object"
                  :items="masterKategoriItemStore.getDataObjectKategori"
                  item-title="nama"
                  item-value="id"
                  class="mb-3"
                />

                <a-date-picker
                  v-model="editKategoriItem.periode.mulai"
                  :onUpdate:modelValue="
                    (n: string) => (editKategoriItem.periode.mulai = n)
                  "
                  label="Periode (Mulai)"
                  class="mb-3"
                />

                <a-field-number
                  v-model="editKategoriItem.jumlahUnit"
                  label="Jumlah Unit / Wajib Lapor"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <a-select
                  label="Nama Cabang Perusahaan"
                  item-title="nama_cabang"
                  item-value="id"
                  :items="masterPerusahaanStore.getDataCabang"
                  v-model="editKategoriItem.id_cabang"
                  class="mb-3"
                />

                <a-text-field
                  v-model="editKategoriItem.nama_kategori_object"
                  label="Kategori Object"
                  class="mb-3"
                  disabled
                />

                <a-date-picker
                  v-model="editKategoriItem.periode.selesai"
                  :onUpdate:modelValue="
                    (n: string) => (editKategoriItem.periode.selesai = n)
                  "
                  label="Periode (Selesai)"
                  class="mb-3"
                />

                <a-textarea
                  v-model="editKategoriItem.nama_kategori_item"
                  label="Nama Kategori item"
                  class="mb-3"
                />
              </v-col>
            </v-row>

            <div class="text-subtitle-2 mb-2">Ukuran</div>

            <v-row dense>
              <v-col cols="12" sm="10">
                <a-text-field
                  v-model="data.ukuranInput"
                  placeholder="Contoh: 4 x 6 m"
                />
              </v-col>

              <v-col cols="12" sm="2">
                <v-btn
                  color="primary"
                  size="small"
                  @click="addUkuran"
                  class="mt-1 text-capitalize"
                >
                  Tambah
                </v-btn>
              </v-col>
            </v-row>

            <v-chip
              v-for="(u, i) in editKategoriItem.ukuran"
              :key="i"
              closable
              class="ma-1 my-4"
              @click:close="removeUkuran(i)"
            >
              {{ u }}
            </v-chip>

            <a-textarea
              v-model="editKategoriItem.keterangan"
              label="Keterangan"
              class="my-3"
            />
          </v-col>

          <v-col cols="12" sm="7">
            <div class="text-subtitle-2 mb-2">Document</div>
            <v-row>
              <v-col cols="12" sm="6">
                <a-autocomplete
                  v-model="newdokument.id_dokumen"
                  item-title="nama_dokumen"
                  item-value="id"
                  :items="masterdokumenstore.getDataDokumen"
                  placeholder="Nama Dokumen"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <a-text-field
                  v-model="newdokument.no_dokumen"
                  placeholder="No Dokumen"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="10">
                <upload-image />
              </v-col>

              <v-col cols="12" sm="2">
                <v-btn
                  color="primary"
                  size="small"
                  @click="editdokument"
                  class="mt-1 text-capitalize"
                >
                  Tambah
                </v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-data-table
                  hide-default-footer
                  :headers="data.headerdokument"
                  :items="editKategoriItem.dokumen"
                >
                  <template v-slot:item.no="{ index }">
                    {{ index + 1 }}
                  </template>
                  <template v-slot:item.aksi="{ index }">
                    <v-btn size="25" color="red" @click="removeDokument(index)"
                      ><v-icon size="13">mdi-trash-can</v-icon></v-btn
                    >
                  </template>
                  <template v-slot:item.file_dokumen="{ item }">
                    <v-btn
                      color="blue"
                      target="_blank"
                      :href="item.file_dokumen"
                      ><v-icon size="13">mdi-file</v-icon>File</v-btn
                    >
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-3 bg-grey-lighten-4">
        <v-btn
          variant="flat"
          color="grey-darken-2"
          @click="closeDialogEdit"
          class="text-capitalize px-3"
          size="small"
        >
          Batal
        </v-btn>

        <v-btn
          color="primary"
          @click="ubahKategoriItem"
          variant="flat"
          class="text-capitalize px-3"
          size="small"
        >
          Perbarui
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Main Content -->
  <v-row align="center">
    <v-col cols="9">
      <v-breadcrumbs>
        <v-breadcrumbs-item>
          <span class="font-weight-medium text-h5"> Master Kategori Item </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>

    <v-col cols="3">
      <v-btn
        size="28"
        variant="outlined"
        color="grey-darken-1"
        class="border mr-3"
        @click="refreshData"
      >
        <v-icon size="18" icon="mdi-refresh" />
        <v-tooltip activator="parent" location="top"> Refresh Data </v-tooltip>
      </v-btn>

      <v-btn
        color="primary"
        @click="openDialogAdd"
        variant="flat"
        size="small"
        class="text-capitalize px-3"
        prepend-icon="mdi-plus"
      >
        Tambah Kategori Item
      </v-btn>
    </v-col>
  </v-row>

  <v-card>
    <v-card-text>
      <!-- Header -->
      <v-row align="center" justify="space-between" class="mb-0">
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
          <v-row class="mt-1" align="end">
            <v-col cols="12" sm="2">
              <a-date-picker
                v-model="data.tanggal_awal"
                label="Tanggal Awal"
                :onUpdate:modelValue="(n: string) => (data.tanggal_awal = n)"
              />
            </v-col>

            <v-col cols="6" sm="2">
              <a-date-picker
                v-model="data.tanggal_akhir"
                label="Tanggal Akhir"
                :onUpdate:modelValue="(n: string) => (data.tanggal_akhir = n)"
              />
            </v-col>

            <v-col cols="6" sm="2">
              <a-select
                v-model="data.nama_perusahaan"
                label="Nama Perusahaan"
                :items="masterPerusahaanStore.getDataPerusahaan"
                item-title="nama_perusahaan"
                item-value="nama_perusahaan"
              />
            </v-col>

            <v-col cols="12" sm="2">
              <a-select
                v-model="data.nama_cabang"
                label="Cabang Perusahaan"
                :items="masterPerusahaanStore.getDataCabang"
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
                :items="['Draft', 'Penawaran', 'Invoice']"
              />
            </v-col>

            <v-col cols="auto" class="text-center">
              <v-btn
                size="small"
                color="primary"
                class="mt-4"
                @click="cekrekapanitemkategori"
              >
                Terapkan
              </v-btn>
            </v-col>
          </v-row>

          <!-- <v-divider class="my-4" /> -->
          <!-- <div class="mb-3">
            <h5 class="text-h6 font-weight-bold">Rekapitulasi Per Bulan</h5>
            <span class="text-grey">
              Pilih perusahaan, bulan untuk menampilkan data.
            </span>
          </div> -->
          <!-- <v-row align="center">
            <v-col cols="12" sm="6" md="2">
              <a-select
                v-model="data.nama_perusahaan_perbulan"
                label="Nama Perusahaan"
                :items="masterPerusahaanStore.getDataPerusahaan"
                item-title="nama_perusahaan"
                item-value="nama_perusahaan"
              />
            </v-col>

            <v-col cols="12" sm="6" md="2">
              <a-select
                v-model="data.nama_cabang_perbulan"
                label="Cabang Perusahaan"
                :items="masterPerusahaanStore.getDataCabang"
                item-title="nama_cabang"
                item-value="nama_cabang"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" sm="6" md="2">
              <a-select
                v-model="bulanDipilih"
                :items="bulanOptions"
                item-title="title"
                item-value="value"
                label="Bulan"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </v-col>

            <v-col cols="12" sm="6" md="2">
              <a-select
                v-model="tahunDipilih"
                :items="tahunOptions"
                item-title="title"
                item-value="value"
                label="Tahun"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </v-col>

            <v-col cols="12" sm="6" md="4" class="mt-5">
              <div class="d-flex justify-end align-center ga-2 flex-wrap">
                <div class="action-buttons">
                  <v-btn
                    class="btn-primary-modern"
                    prepend-icon="mdi-magnify"
                    @click="cekHabisMasaBerlaku"
                  >
                    Cek Data
                  </v-btn>

                  <v-btn
                    class="btn-secondary-modern"
                    prepend-icon="mdi-refresh"
                    @click="resetFilter"
                  >
                    Reset
                  </v-btn>

                  <v-btn
                    class="btn-success-modern"
                    prepend-icon="mdi-file-excel"
                    :disabled="hasilRekapan.length === 0"
                    @click="downloadExcel"
                  >
                    Unduh
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row> -->
        </div>
      </v-expand-transition>
    </v-card-text>
  </v-card>

  <br />
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
          Total:
          {{ masterKategoriItemStore.getDataItemKategori.length }} kategori item
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      :headers="data.headKategoriItem"
      :items="dataTable"
      :search="data.search"
      v-model:page="data.page"
      :items-per-page="data.itemsPerPage"
      density="comfortable"
      hover
    >
      <template v-slot:item.no="{ index }">
        <span class="text-caption font-weight-bold text-grey-darken-1">
          {{ (data.page - 1) * data.itemsPerPage + index + 1 }}
        </span>
      </template>

      <template v-slot:item.nama_kategori_item="{ item }">
        <div style="width: 250px">
          <span> {{ item.nama_kategori_item }}</span>
        </div>
      </template>

      <template v-slot:item.kode_kategori_item="{ item }">
        <v-chip
          size="x-small"
          color="grey-darken-1"
          variant="tonal"
          class="font-weight-medium rounded-sm px-2"
          style="font-family: monospace"
        >
          {{ item.kode_kategori_item }}
        </v-chip>
      </template>

      <template v-slot:item.nama_cabang="{ item }">
        <v-chip
          size="small"
          variant="tonal"
          color="success"
          rounded="lg"
          class="font-weight-bold cursor-pointer"
          style="border-bottom: 2px solid #2e7d32"
          :to="'/admin/master/kategori/item/' + item.id"
        >
          <v-icon start size="14" icon="mdi-eye" />
          {{ item.nama_cabang }}
          <v-tooltip activator="parent" location="top">Detail</v-tooltip>
        </v-chip>
      </template>

      <template v-slot:bottom>
        <v-divider />

        <div class="bg-grey-lighten-5 px-4 py-3">
          <v-row no-gutters align="center">
            <v-col
              cols="12"
              md="7"
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
                        kategoriWithDeadline.length,
                      )
                    }}
                  </strong>
                  <span class="text-red mx-1">/</span>
                  <strong>{{ kategoriWithDeadline.length }}</strong>
                  <span class="text-grey mx-1">Data</span>
                </span>
              </div>

              <v-divider
                vertical
                inset
                class="mr-1 d-none d-sm-flex"
                style="height: 20px"
              />

              <div
                class="d-flex align-center bg-white border rounded-lg px-1 py-1"
                style="gap: 4px"
              >
                <v-chip
                  size="x-small"
                  variant="text"
                  class="px-2"
                  color="grey-darken-2"
                >
                  <v-icon
                    start
                    icon="mdi-file-document-edit-outline"
                    size="14"
                  />
                  <span class="font-weight-black">{{
                    statusCounts.onProgress
                  }}</span>
                  <span class="ml-1 text-grey-darken-1 d-none d-sm-inline"
                    >Draft</span
                  >
                </v-chip>

                <v-divider vertical class="my-1" />

                <v-chip
                  size="x-small"
                  variant="text"
                  class="px-2"
                  color="blue-darken-2"
                >
                  <v-icon start icon="mdi-send-circle-outline" size="14" />
                  <span class="font-weight-black">{{
                    statusCounts.penawaran
                  }}</span>
                  <span class="ml-1 text-blue-darken-1 d-none d-sm-inline"
                    >Penawaran</span
                  >
                </v-chip>

                <v-divider vertical class="my-1" />

                <v-chip
                  size="x-small"
                  variant="text"
                  class="px-2"
                  color="orange-darken-3"
                >
                  <v-icon
                    start
                    icon="mdi-receipt-text-check-outline"
                    size="14"
                  />
                  <span class="font-weight-black">{{
                    statusCounts.invoice
                  }}</span>
                  <span class="ml-1 text-orange-darken-2 d-none d-sm-inline"
                    >Invoice</span
                  >
                </v-chip>
              </div>

              <v-chip
                v-if="statusCounts.overdue > 0"
                size="x-small"
                color="red-darken-1"
                variant="flat"
                class="font-weight-bold"
              >
                <v-icon start icon="mdi-alert-circle" size="14" />
                {{ statusCounts.overdue }} Deadline
              </v-chip>
            </v-col>

            <v-col
              cols="12"
              md="5"
              class="d-flex justify-md-end justify-center mt-3 mt-md-0"
            >
              <div
                class="d-flex align-center bg-white border rounded-lg px-2 py-1 shadow-sm"
              >
                <v-pagination
                  v-model="data.page"
                  :length="totalPages"
                  :total-visible="5"
                  density="compact"
                  variant="flat"
                  active-color="primary"
                  rounded="md"
                  class="my-0"
                />
              </div>
            </v-col>
          </v-row>
        </div>
      </template>

      <template v-slot:item.jumlah_unit="{ item }">
        <div v-if="item.jumlahUnit" class="d-flex align-center">
          <v-avatar size="24" color="primary-lighten-5" class="mr-2">
            <span class="text-caption font-weight-bold text-primary">{{
              item.jumlahUnit
            }}</span>
          </v-avatar>
          <span class="text-body-2 text-grey-darken-2">Unit</span>
        </div>

        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Kosong
        </span>
      </template>

      <template v-slot:item.ukuran="{ item }">
        <div
          v-if="item.ukuran && item.ukuran.length > 0"
          class="d-flex flex-wrap"
          style="gap: 4px"
        >
          <v-chip
            v-for="(u, i) in item.ukuran"
            :key="i"
            size="x-small"
            variant="outlined"
            color="secondary"
          >
            {{ u }}
          </v-chip>
        </div>
        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Kosong
        </span>
      </template>

      <template v-slot:item.periode="{ item }">
        <div
          v-if="item.periode && item.periode.mulai !== '-'"
          class="d-flex align-center pa-2"
        >
          <v-sheet
            rounded="s-lg"
            class="px-2 py-1 bg-grey-lighten-4 text-caption font-weight-bold border"
          >
            {{ item.periode.mulai }}
          </v-sheet>

          <v-sheet
            border="top bottom"
            class="px-1 bg-primary text-caption"
            style="height: 26px; line-height: 24px"
          >
            <v-icon size="12" color="white">mdi-arrow-right</v-icon>
          </v-sheet>

          <v-sheet
            border
            rounded="e-lg"
            class="px-2 py-1 bg-grey-lighten-4 text-caption font-weight-bold"
          >
            {{ item.periode.selesai }}
          </v-sheet>
        </div>
        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Tidak ada data
        </span>
      </template>

      <template v-slot:item.nominal="{ item }">
        <div v-if="item.nominal" class="font-weight-bold text-success">
          Rp {{ item.nominal.toLocaleString("id-ID") }}
        </div>
        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Tidak ada data
        </span>
      </template>

      <template v-slot:item.keterangan="{ item }">
        <p v-if="item.keterangan" class="font-italic text-caption">
          {{ item.keterangan }}
        </p>

        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Tidak ada data
        </span>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip
          :color="
            item.status == 'Draft'
              ? 'grey'
              : item.status == 'Penawaran'
                ? 'blue'
                : 'orange'
          "
          label
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.aksi="{ item }">
        <div class="d-flex justify-center">
          <v-btn
            size="27"
            variant="tonal"
            color="orange"
            class="rounded-lg mr-1"
            @click="openDialogUnManage(item)"
          >
            <v-icon icon="mdi-link-off" />
            <v-tooltip activator="parent" location="top">Unmanage</v-tooltip>
          </v-btn>

          <v-btn
            size="27"
            variant="tonal"
            color="info"
            class="rounded-lg mr-1"
            @click="openDialogEdit(item)"
          >
            <v-icon icon="mdi-pencil-outline" />
            <v-tooltip activator="parent" location="top">Edit</v-tooltip>
          </v-btn>

          <v-btn
            size="27"
            variant="tonal"
            color="error"
            class="rounded-lg"
            @click="hapusKategoriItem(item)"
          >
            <v-icon icon="mdi-trash-can-outline" />
            <v-tooltip activator="parent" location="top">Hapus</v-tooltip>
          </v-btn>
        </div>
      </template>

      <template v-slot:no-data>
        <div class="py-8 text-center text-grey-darken-1">
          <v-icon
            size="48"
            color="grey-lighten-1"
            class="mb-2"
            icon="mdi-shape-plus-outline"
          />

          <div class="text-body-1">Tidak ada data Kategori Item</div>
        </div>
      </template>

      <template v-slot:item.deadlineSort="{ item }">
        <div v-if="item.periode?.selesai && item.periode.selesai !== '-'">
          <!-- Progress Bar Container -->
          <div class="deadline-container">
            <!-- Progress Bar -->
            <div class="progress-wrapper">
              <v-progress-linear
                :model-value="calculateProgress(item.periode.selesai)"
                :color="
                  getProgressColor(calculateProgress(item.periode.selesai))
                "
                height="8"
                rounded
                class="progress-bar"
              />
            </div>

            <!-- Deadline Info -->
            <div class="deadline-info">
              <v-chip
                size="small"
                :color="getDeadlineColor(item.periode.selesai)"
                variant="flat"
                class="mr-2"
              >
                <v-icon start size="12"> mdi-calendar-clock </v-icon>
                {{ countdownday(item.periode.selesai) }}
              </v-chip>

              <!-- Deadline Date -->
              <span class="text-caption text-grey-darken-2">
                {{ formatDeadlineDate(item.periode.selesai) }}
              </span>
            </div>

            <!-- Progress Percentage -->
            <div class="progress-percentage">
              <span
                class="text-caption font-weight-bold"
                :class="
                  getProgressTextColor(calculateProgress(item.periode.selesai))
                "
              >
                {{ calculateProgress(item.periode.selesai) }}%
              </span>
            </div>
          </div>
        </div>
        <div v-else>
          <v-chip size="small" color="grey" variant="tonal">
            <v-icon start size="12">mdi-calendar-remove</v-icon>
            Tidak ada
          </v-chip>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import type { ConfirmationDialog } from "#components";
import _ from "lodash";
import moment from "moment";
import { useMasterDokumenStore } from "~/stores/master/dokumenStore";
import { useMasterKategoriStore } from "~/stores/master/kategoriStore";
import { useMasterPerusahaanStore } from "~/stores/master/perusahaanStore";
import type { masterDokumenM } from "~/types/master/dokumenModel";
import type { ItemDokumenM, itemKategoriM } from "~/types/master/kategoriModel";
import type { unmanageM } from "~/types/unmanageModel";
import * as XLSX from "xlsx-js-style";

const downloadExcel = () => {
  const currentData = dataTable.value;

  if (!currentData || currentData.length === 0) {
    notificationStore.showError("Tidak ada data yang bisa diunduh");
    return;
  }

  const dataUntukExcel = currentData.map((item, index) => ({
    No: index + 1,
    "Nama Perusahaan": item.nama_perusahaan || "-",
    Cabang: item.nama_cabang || "-",
    Pekerjaan: item.nama_kategori_item || "-",
    "Jumlah Unit": item.jumlahUnit || 0,
    "Periode Awal": item.periode?.mulai || "-",
    "Periode Akhir": item.periode?.selesai || "-",
  }));

  const worksheet = XLSX.utils.aoa_to_sheet([]);

  const bulanAktif = bulanOptions.find((b) => b.value === bulanDipilih.value);

  const namaBulan = bulanAktif ? bulanAktif.title : "";
  const tahun = tahunDipilih.value || "";

  const perusahaan = data.nama_perusahaan_perbulan;
  const cabang = data.nama_cabang_perbulan;

  let teksJudul = "";

  if (perusahaan && cabang) {
    teksJudul = `REMINDER ${perusahaan} Cab. ${cabang}`;
  } else {
    teksJudul = `REMINDER BULAN ${namaBulan.toUpperCase()} ${tahun}`;
  }

  XLSX.utils.sheet_add_aoa(worksheet, [[""], [teksJudul], []], {
    origin: "A1",
  });

  XLSX.utils.sheet_add_json(worksheet, dataUntukExcel, {
    origin: "A4",
    skipHeader: false,
  });

  // Header berada di baris 4, sehingga data dimulai dari baris 5
  // Header berada di baris 4, sehingga data dimulai dari baris 5
  const startRow = 5;
  const endRow = startRow + dataUntukExcel.length - 1;

  // Header "Jumlah Unit" (E4) rata tengah
  if (worksheet["E4"]) {
    worksheet["E4"].s = {
      ...(worksheet["E4"].s || {}),
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    };
  }

  // Header "Periode Selesai" (F4) rata kanan
  if (worksheet["F4"]) {
    worksheet["F4"].s = {
      ...(worksheet["F4"].s || {}),
      alignment: {
        horizontal: "right",
        vertical: "center",
      },
    };
  }

  if (worksheet["A4"]) {
    worksheet["A4"].s = {
      ...(worksheet["A4"].s || {}),
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    };
  }

  if (worksheet["G4"]) {
    worksheet["G4"].s = {
      ...(worksheet["G4"].s || {}),
      alignment: {
        horizontal: "right",
        vertical: "center",
      },
    };
  }

  for (let row = startRow; row <= endRow; row++) {
    // Kolom E = Jumlah Unit (rata tengah)
    if (worksheet[`E${row}`]) {
      worksheet[`E${row}`].s = {
        ...(worksheet[`E${row}`].s || {}),
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }

    if (worksheet[`A${row}`]) {
      worksheet[`A${row}`].s = {
        ...(worksheet[`A${row}`].s || {}),
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }

    // Kolom F = Periode Selesai (rata kanan)
    if (worksheet[`F${row}`]) {
      worksheet[`F${row}`].s = {
        ...(worksheet[`F${row}`].s || {}),
        alignment: {
          horizontal: "right",
          vertical: "center",
        },
      };
    }

    if (worksheet[`G${row}`]) {
      worksheet[`G${row}`].s = {
        ...(worksheet[`G${row}`].s || {}),
        alignment: {
          horizontal: "right",
          vertical: "center",
        },
      };
    }
  }

  const lastRow = dataUntukExcel.length + 7;

  XLSX.utils.sheet_add_aoa(
    worksheet,
    [[], [`Generated by System Aresa - ${new Date().toLocaleString("id-ID")}`]],
    {
      origin: `A${lastRow}`,
    },
  );

  worksheet["!merges"] = [
    XLSX.utils.decode_range("A1:G1"),
    XLSX.utils.decode_range("A2:G2"),
    XLSX.utils.decode_range(`A${lastRow + 1}:G${lastRow + 1}`),
  ];

  ["A1", "A2", `A${lastRow + 1}`].forEach((cell) => {
    if (worksheet[cell]) {
      worksheet[cell].s = {
        ...(worksheet[cell].s || {}),
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
        font: {
          bold: true,
        },
      };
    }
  });

  const headers = Object.keys(dataUntukExcel[0]);

  worksheet["!cols"] = headers.map((key) => ({
    wch:
      Math.max(
        key.length,
        ...dataUntukExcel.map((row) => String(row[key] ?? "").length),
      ) + 5,
  }));

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Kategori Item");

  const now = new Date();

  const timestamp =
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    "_" +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  const fileName = `${teksJudul}.xlsx`;

  XLSX.writeFile(workbook, fileName);

  notificationStore.showSuccess("File Excel berhasil diunduh");
};

definePageMeta({
  layout: "admin",
});

const userStore = useUserStore();
const masterPerusahaanStore = useMasterPerusahaanStore();
const masterdokumenstore = useMasterDokumenStore();
const masterKategoriItemStore = useMasterKategoriStore();
const notificationStore = useNotificationStore();
const pictureStore = usePictureStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);
const unmanagestore = useunmanageStore();

const uploadstore = uploadStore();

onMounted(async () => {
  await masterKategoriItemStore.tarikDataItemKategoriAct();
  await masterPerusahaanStore.tarikDataCabangAct();
  await masterPerusahaanStore.tarikDataPerusahaanAct();
});
const showFilter = ref(true);

const newKategoriItem = ref<itemKategoriM>({
  id_object_kategori: "",
  kode_kategori_item: "",
  nama_kategori_item: "",
  jumlahUnit: 0,
  // nominal: 0,
  createdAt: 0,
  createdBy: "",
  dokumen: [],
  ukuran: [],
  periode: {
    mulai: "-",
    selesai: "-",
  },
  keterangan: "",
  id_cabang: "",
  nama_cabang: "",
  id_perusahaan: "",
  nama_perusahaan: "",
  nama_kategori_object: "",
  status: "Draft",
  nama_group_pt: "",
  dokumen_berkas: [],
  nama_object: "",
});

const newunmanage = ref<unmanageM>({
  id_cabang: "",
  nama_cabang: "",
  id_perusahaan: "",
  nama_perusahaan: "",
  id_object_kategori: "",
  nama_kategori_object: "",
  nama_kategori_item: "",
  kode_kategori_item: "",
  dokumen: [],
  alasan_unmanage: "",
  jumlahUnit: 0,
  periode: {
    mulai: "",
    selesai: "",
  },
  keterangan: "",
  createdAt: 0,
  createdBy: "",
  itemKategoriAt: 0,
  itemKategoriBy: "",
  nama_group_pt: "",
});

const newdokument = ref<ItemDokumenM>({
  id_dokumen: "",
  nama_dokumen: "",
  no_dokumen: "",
  file_dokumen: "",
});

const editKategoriItem = ref<itemKategoriM>({
  id_object_kategori: "",
  kode_kategori_item: "",
  nama_kategori_item: "",
  jumlahUnit: 0,
  // nominal: 0,
  createdAt: 0,
  createdBy: "",
  dokumen: [],
  ukuran: [],
  periode: {
    mulai: "-",
    selesai: "-",
  },
  keterangan: "",
  id_cabang: "",
  nama_cabang: "",
  id_perusahaan: "",
  nama_perusahaan: "",
  nama_kategori_object: "",
  status: "Draft",
  nama_group_pt: "",
  nama_object: "",
  dokumen_berkas: [],
});

const data = reactive({
  search: "",
  dialogunmanage: false,
  alasan_unmanage: "",
  dialogAdd: false,
  dialogEdit: false,
  page: 1,
  itemsPerPage: 10,
  ukuranInput: "",
  listKategoriItem: ["Reklame", "Disnaker", "Izin", "Biaya", "Jasa", "Lainnya"],
  tanggal_awal: "",
  tanggal_akhir: "",
  nama_perusahaan: "",
  nama_cabang: "",
  nama_perusahaan_perbulan: "",
  nama_cabang_perbulan: "",
  status: "",
  headKategoriItem: [
    {
      title: "No",
      value: "no",
      align: "center" as const,
      width: "50px",
    },
    // { title: "Kode", value: "kode_kategori_item", sortable: true },
    { title: "Nama", value: "nama_kategori_item", sortable: true },
    { title: "Nama Perusahaan", value: "nama_perusahaan", sortable: true },
    { title: "Nama Cabang", value: "nama_cabang", sortable: true },
    { title: "Jumlah", value: "jumlah_unit", sortable: true },
    { title: "Ukuran", value: "ukuran", sortable: true },
    { title: "Periode", value: "periode", sortable: true },
    { title: "Deadline", value: "deadlineSort", sortable: true },
    { title: "Status", value: "status", sortable: true },
    {
      title: "Aksi",
      value: "aksi",
      align: "center" as const,
      width: "50px",
      sortable: false,
    },
  ],

  headerdokument: [
    {
      title: "No",
      value: "no",
    },
    { title: "Nama Dokumen", value: "nama_dokumen", sortable: true },
    { title: "No Dokumen", value: "no_dokumen", sortable: true },
    { title: "File Dokumen", value: "file_dokumen", sortable: true },
    {
      title: "Aksi",
      value: "aksi",
    },
  ],
});

const totalPages = computed(() => {
  if (data.itemsPerPage === -1) return 1;
  return Math.ceil(kategoriWithDeadline.value.length / data.itemsPerPage);
});

const kategoriWithDeadline = computed(() => {
  return [...masterKategoriItemStore.getDataItemKategori]
    .map((item) => {
      const deadline =
        item.periode?.selesai && item.periode.selesai !== "-"
          ? new Date(item.periode.selesai).getTime()
          : Infinity; // biar "-" selalu di bawah

      return {
        ...item,
        deadlineSort: deadline,
      };
    })
    .sort((a, b) => {
      // TERLAMA → TERBARU
      return a.deadlineSort - b.deadlineSort;
    });
});

watch(
  () => newdokument.value.id_dokumen,

  (idDokumen) => {
    const dataDokumen = masterdokumenstore.getDataDokumen;

    const b = _.find(dataDokumen, (o: any) => o.id == idDokumen);
    // console.logb, 'si b')
    if (!_.isUndefined(b)) {
      newdokument.value.nama_dokumen = b!.nama_dokumen;
    }
  },
);

watch(
  () => newKategoriItem.value.id_object_kategori,

  (idObjectKategori) => {
    const dataObject = masterKategoriItemStore.getDataObjectKategori;

    const b = _.find(dataObject, (o: any) => o.id == idObjectKategori);
    // console.logb, 'si b')
    if (!_.isUndefined(b)) {
      newKategoriItem.value.nama_kategori_object = b!.kategori;
      newKategoriItem.value.nama_object = b!.nama;
    }
  },
);

watch(
  () => newKategoriItem.value.id_perusahaan,

  async (idperusahaan) => {
    const dataperusahaan = masterPerusahaanStore.getDataPerusahaan;

    const b = _.find(dataperusahaan, (o: any) => o.id == idperusahaan);
    // console.logb, 'si b')
    if (!_.isUndefined(b)) {
      newKategoriItem.value.nama_perusahaan = b!.nama_perusahaan;
      newKategoriItem.value.nama_group_pt = b!.nama_group_pt;
      await masterPerusahaanStore.tarikDataCabangPerusahaan(b.id!);
    }
  },
);

watch(
  () => newKategoriItem.value.id_cabang,

  async (idcabang) => {
    const datacabang = masterPerusahaanStore.getDataCabang;

    const b = _.find(datacabang, (o: any) => o.id == idcabang);
    // console.logb, 'si b')
    if (!_.isUndefined(b)) {
      newKategoriItem.value.nama_cabang = b!.nama_cabang;
    }
  },
);

watch(
  () => data.nama_perusahaan,

  async (idperusahaan) => {
    const dataperusahaan = masterPerusahaanStore.getDataPerusahaan;

    const b = _.find(
      dataperusahaan,
      (o: any) => o.nama_perusahaan == idperusahaan,
    );
    // console.logb, 'si b')
    if (!_.isUndefined(b)) {
      await masterPerusahaanStore.tarikDataCabangPerusahaan(b.id!);
    }
  },
);

watch(
  () => data.nama_cabang,

  async (idcabang) => {
    const datacabang = masterPerusahaanStore.getDataCabang;

    const b = _.find(datacabang, (o: any) => o.nama_cabang == idcabang);
    // console.logb, 'si b')
    if (!_.isUndefined(b)) {
    }
  },
);

watch(
  () => data.nama_perusahaan_perbulan,
  async (namaPerusahaan) => {
    if (!namaPerusahaan) {
      data.nama_cabang_perbulan = "";
      return;
    }

    const perusahaan = _.find(
      masterPerusahaanStore.getDataPerusahaan,
      (o: any) => o.nama_perusahaan === namaPerusahaan,
    );

    if (perusahaan) {
      data.nama_cabang_perbulan = ""; // reset pilihan cabang

      await masterPerusahaanStore.tarikDataCabangPerusahaan(perusahaan.id!);
    }
  },
);

watch(
  () => data.nama_cabang_perbulan,
  (namaCabang) => {
    const cabang = _.find(
      masterPerusahaanStore.getDataCabang,
      (o: any) => o.nama_cabang === namaCabang,
    );

    console.log("Cabang dipilih:", cabang);
  },
);

const bulanOptions = [
  { title: "Januari", value: 1 },
  { title: "Februari", value: 2 },
  { title: "Maret", value: 3 },
  { title: "April", value: 4 },
  { title: "Mei", value: 5 },
  { title: "Juni", value: 6 },
  { title: "Juli", value: 7 },
  { title: "Agustus", value: 8 },
  { title: "September", value: 9 },
  { title: "Oktober", value: 10 },
  { title: "November", value: 11 },
  { title: "Desember", value: 12 },
];

const bulanDipilih = ref<number | null>(null);
const hasilRekapan = ref<any[]>([]);
const tahunDipilih = ref<number>(new Date().getFullYear());
const filterAktif = ref(false);
const tahunOptions = computed(() => {
  const tahunSet = new Set<number>();

  masterKategoriItemStore.getDataItemKategori.forEach((item: any) => {
    if (item?.periode?.selesai) {
      tahunSet.add(new Date(item.periode.selesai).getFullYear());
    }
  });

  return Array.from(tahunSet)
    .sort((a, b) => b - a)
    .map((tahun) => ({
      title: String(tahun),
      value: tahun,
    }));
});

const cekHabisMasaBerlaku = () => {
  // if (!data.nama_perusahaan_perbulan || !data.nama_cabang_perbulan) {
  //   notificationStore.showError("Nama perusahaan atau cabang harus dipilih");
  //   return;
  // }
  if (!bulanDipilih.value || !tahunDipilih.value) {
    notificationStore.showError("Bulan dan tahun tidak boleh kosong");
    return;
  }

  filterAktif.value = true;

  hasilRekapan.value = masterKategoriItemStore.getDataItemKategori.filter(
    (item: any) => {
      if (!item?.periode?.selesai) return false;

      const tanggal = new Date(item.periode.selesai);

      if (isNaN(tanggal.getTime())) return false;

      const bulanSelesai = tanggal.getMonth() + 1;
      const tahunSelesai = tanggal.getFullYear();

      const cocokBulan = bulanSelesai === Number(bulanDipilih.value);

      const cocokTahun = tahunSelesai === Number(tahunDipilih.value);

      const cocokPerusahaan =
        !data.nama_perusahaan_perbulan ||
        item.nama_perusahaan === data.nama_perusahaan_perbulan;

      const cocokCabang =
        !data.nama_cabang_perbulan ||
        item.nama_cabang === data.nama_cabang_perbulan;

      return cocokBulan && cocokTahun && cocokPerusahaan && cocokCabang;
    },
  );

  if (hasilRekapan.value.length === 0) {
    notificationStore.showInfo("Tidak ada data yang sesuai dengan filter");
  }
};

const resetFilter = () => {
  bulanDipilih.value = null;
  tahunDipilih.value = null;
  hasilRekapan.value = [];
  filterAktif.value = false;
  data.nama_perusahaan_perbulan = "";
  data.nama_cabang_perbulan = "";
};
// const cekHabisMasaBerlaku = () => {
//   if (!bulanDipilih.value) {
//     hasilRekapan.value = [];
//     return;
//   }
//   console.log("Bulan dipilih:", bulanDipilih.value);
//   hasilRekapan.value = kategoriWithDeadline.value.filter((item) => {
//     const bulanSelesai = new Date(item.periode.selesai).getMonth() + 1;
//     return bulanSelesai === bulanDipilih.value;
//   });

//   console.log("bulan dipilih =", bulanDipilih.value);
//   console.log("type =", typeof bulanDipilih.value);
// };

const dataTable = computed(() => {
  if (hasilRekapan.value.length > 0) {
    return hasilRekapan.value;
  }
  return kategoriWithDeadline.value;
});

// Fungsi untuk menambah ukuran ke dalam array
const addUkuran = () => {
  if (!data.ukuranInput.trim()) {
    return notificationStore.showError(
      "Ukuran tidak boleh kosong jika ingin ditambahkan",
    );
  }

  // Inisialisasi array ukuran jika belum ada
  if (!newKategoriItem.value.ukuran) {
    newKategoriItem.value.ukuran = [];
  }

  // Tambahkan nilai baru
  newKategoriItem.value.ukuran.push(data.ukuranInput.trim());

  // Kosongkan kembali input teks
  data.ukuranInput = "";
};

// Fungsi untuk menghapus ukuran berdasarkan index
const removeUkuran = (index: number) => {
  if (newKategoriItem.value.ukuran) {
    newKategoriItem.value.ukuran.splice(index, 1);
  }
};

const editUkuran = () => {
  if (!data.ukuranInput.trim()) return;

  // Inisialisasi array ukuran jika belum ada
  if (!editKategoriItem.value.ukuran) {
    editKategoriItem.value.ukuran = [];
  }

  // Tambahkan nilai baru
  editKategoriItem.value.ukuran.push(data.ukuranInput.trim());

  // Kosongkan kembali input teks
  data.ukuranInput = "";
};

// Fungsi untuk menghapus ukuran berdasarkan index
const removeUkuranedit = (index: number) => {
  if (editKategoriItem.value.ukuran) {
    editKategoriItem.value.ukuran.splice(index, 1);
  }
};

const openDialogAdd = async () => {
  await masterdokumenstore.tarikDataMasterDokumenAct();
  await masterPerusahaanStore.tarikDataCabangAct();
  await masterPerusahaanStore.tarikDataPerusahaanAct();
  await masterKategoriItemStore.tarikDataObjectKategoriAct();
  data.dialogAdd = true;
};

const closeDialogAdd = () => {
  newKategoriItem.value = {
    id_object_kategori: "",
    kode_kategori_item: "",
    nama_kategori_item: "",
    jumlahUnit: 0,
    // nominal: 0,
    createdAt: 0,
    createdBy: "",
    dokumen: [],
    ukuran: [],
    periode: {
      mulai: "-",
      selesai: "-",
    },
    keterangan: "",
    id_cabang: "",
    nama_cabang: "",
    id_perusahaan: "",
    nama_perusahaan: "",
    nama_kategori_object: "",
    status: "Draft",
    nama_group_pt: "",
    nama_object: "",
    dokumen_berkas: [],
  };
  data.dialogAdd = false;
};

const saveItemKategori = () => {
  const itemKategoriSave = newKategoriItem.value;
  if (itemKategoriSave.id_perusahaan === "") {
    notificationStore.showError("Nama Perusahaan tidak boleh kosong");
    return;
  }

  if (itemKategoriSave.id_cabang === "") {
    notificationStore.showError("Nama Cabang tidak boleh kosong");
    return;
  }

  if (itemKategoriSave.nama_cabang === "") {
    notificationStore.showError("Nama Cabang tidak boleh kosong");
    return;
  }

  if (itemKategoriSave.id_object_kategori === "") {
    notificationStore.showError("Nama Kategori Object tidak boleh kosong");
    return;
  }

  if (itemKategoriSave.nama_kategori_object === "") {
    notificationStore.showError("Kategori Object tidak boleh kosong");
    return;
  }
  if (
    !itemKategoriSave.periode.mulai ||
    itemKategoriSave.periode.mulai === "-"
  ) {
    notificationStore.showError("Periode Mulai tidak boleh kosong");
    return;
  }
  if (
    !itemKategoriSave.periode.selesai ||
    itemKategoriSave.periode.selesai === "-"
  ) {
    notificationStore.showError("Periode Selesai tidak boleh kosong");
    return;
  }
  if (itemKategoriSave.jumlahUnit <= 0) {
    notificationStore.showError("Jumlah Unit / Wajib Lapor harus lebih dari 0");
    return;
  }

  if (itemKategoriSave.nama_kategori_item === "") {
    notificationStore.showError("Nama Kategori Item tidak boleh kosong");
    return;
  }

  if (
    !itemKategoriSave.periode.selesai ||
    itemKategoriSave.periode.selesai === "-"
  ) {
    notificationStore.showError("Periode Selesai tidak boleh kosong");
    return;
  }

  if (itemKategoriSave.dokumen.length === 0) {
    notificationStore.showError("Dokumen minimal harus diisi 1");
    return;
  }
  // Set metadata
  itemKategoriSave.createdAt = tanggalunixskrg();
  itemKategoriSave.createdBy = useUserStore().getEmail;
  itemKategoriSave.kode_kategori_item = makeSlug(
    itemKategoriSave.nama_kategori_item,
  );

  // Simpan
  masterKategoriItemStore.addMasterItemKategoriAct(itemKategoriSave);
  refreshData();
  closeDialogAdd();
};

const openDialogEdit = async (item: itemKategoriM) => {
  await masterdokumenstore.tarikDataMasterDokumenAct();
  await masterPerusahaanStore.tarikDataCabangAct();
  await masterPerusahaanStore.tarikDataPerusahaanAct();
  await masterKategoriItemStore.tarikDataObjectKategoriAct();
  editKategoriItem.value = _.assign({}, item);
  data.dialogEdit = true;
};

const closeDialogEdit = () => {
  editKategoriItem.value = {
    id_object_kategori: "",
    kode_kategori_item: "",
    nama_kategori_item: "",
    jumlahUnit: 0,
    // nominal: 0,
    createdAt: 0,
    createdBy: "",
    dokumen: [],
    ukuran: [],
    periode: {
      mulai: "-",
      selesai: "-",
    },
    keterangan: "",
    id_cabang: "",
    nama_cabang: "",
    id_perusahaan: "",
    nama_perusahaan: "",
    nama_kategori_object: "",
    status: "Draft",
    nama_group_pt: "",
    nama_object: "",
    dokumen_berkas: [],
  };
  data.dialogEdit = false;
};

const ubahKategoriItem = async () => {
  const itemKategoriEdit = editKategoriItem.value;

  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Edit",
    "Anda yakin ingin mengedit data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Perubahan dibatalkan");
  }

  itemKategoriEdit.updatedAt = tanggalunixskrg();
  itemKategoriEdit.updatedBy = userStore.getEmail;

  masterKategoriItemStore.updateMasterItemKategoriAct(itemKategoriEdit);
  refreshData();
  closeDialogEdit();
};

const hapusKategoriItem = async (item: itemKategoriM) => {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("Penghapusan dibatalkan");
  }

  masterKategoriItemStore.deleteMasterItemKategoriAct(item);
  refreshData();
};

function adddokument() {
  newdokument.value.file_dokumen = uploadstore.getUrlRef;
  if (!newdokument.value.nama_dokumen) {
    return notificationStore.showError("Silakan pilih dokumen terlebih dahulu");
  }
  if (!newdokument.value.no_dokumen) {
    return notificationStore.showError("no dokumen tidak boleh kosong");
  }
  if (!newdokument.value.file_dokumen) {
    return notificationStore.showError("file dokumen tidak boleh kosong");
  }
  console.log("Tambah dokument", newdokument.value);
  newKategoriItem.value.dokumen.push(newdokument.value);
  uploadstore.setReset();
  newdokument.value = {
    id_dokumen: "",
    nama_dokumen: "",
    no_dokumen: "",
    file_dokumen: "",
  };
}

function editdokument() {
  newdokument.value.file_dokumen = uploadstore.getUrlRef;
  if (!newdokument.value.nama_dokumen) {
    return notificationStore.showError("Silakan pilih dokumen terlebih dahulu");
  }
  if (!newdokument.value.no_dokumen) {
    return notificationStore.showError("no dokumen tidak boleh kosong");
  }
  if (!newdokument.value.file_dokumen) {
    return notificationStore.showError("file dokumen tidak boleh kosong");
  }
  console.log("Tambah dokument", newdokument.value);
  editKategoriItem.value.dokumen.push(newdokument.value);
  uploadstore.setReset();
  newdokument.value = {
    id_dokumen: "",
    nama_dokumen: "",
    no_dokumen: "",
    file_dokumen: "",
  };
}

function removeDokument(index: number) {
  newKategoriItem.value.dokumen.splice(index, 1);
}

function removeDokumentedit(index: number) {
  editKategoriItem.value.dokumen.splice(index, 1);
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_item_kategori");
  await masterKategoriItemStore.tarikDataItemKategoriAct();
  useloadingStore().setLoading(false);
  notificationStore.showSuccess("Data berhasil diperbarui");
}

const cekrekapanitemkategori = () => {
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
  masterKategoriItemStore.queryrekapanitemkategori(
    tanggal_awal,
    tanggal_akhir,
    nama_perusahaan,
    nama_cabang,
    status,
  );
};

// async function setstatus() {
//   for (const element of masterKategoriItemStore.getDataItemKategori) {
//     await updatedatabase("m_item_kategori", element.id!, {
//       status: "Draft",
//     });
//     await updatedatabase(
//       `m_cabang/${element.id_cabang}/m_item_kategori`,
//       element.id!,
//       { status: "Draft" }
//     );
//     notificationStore.showSuccess("set " + element.id!);
//   }
// }

// Fungsi untuk menghitung progress deadline
const calculateProgress = (deadlineDate: string) => {
  if (!deadlineDate || deadlineDate === "-") return 0;

  const now = new Date();
  const deadline = new Date(deadlineDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Jika deadline sudah lewat
  if (deadline < today) return 100;

  // Hitung total hari dari sekarang sampai deadline
  const totalDays = Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Asumsi waktu pengerjaan standar 30 hari
  const standardDays = 30;

  // Jika kurang dari standardDays, hitung progress
  if (totalDays > standardDays) {
    return 0; // Masih awal
  }

  const progress = ((standardDays - totalDays) / standardDays) * 100;
  const roundedProgress = Math.round(progress); // Membulatkan ke bilangan bulat terdekat

  return Math.min(Math.max(roundedProgress, 0), 100);
};

// Fungsi untuk menentukan warna progress bar
const getProgressColor = (progress: number) => {
  if (progress >= 80) return "red";
  if (progress >= 60) return "orange";
  if (progress >= 30) return "blue";
  return "green";
};

// Fungsi untuk menentukan warna teks progress
const getProgressTextColor = (progress: number) => {
  if (progress >= 80) return "text-red-darken-2";
  if (progress >= 60) return "text-orange-darken-2";
  if (progress >= 30) return "text-blue-darken-2";
  return "text-green-darken-2";
};

// Fungsi untuk format tanggal deadline
const formatDeadlineDate = (dateString: string) => {
  if (!dateString || dateString === "-") return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Update fungsi countdownday jika belum ada
const countdownday = (deadlineDate: string) => {
  if (!deadlineDate || deadlineDate === "-") return "-";

  const now = new Date();
  const deadline = new Date(deadlineDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Set waktu ke 00:00:00 untuk perbandingan yang akurat
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hari ini";
  if (diffDays < 0) return `${Math.abs(diffDays)} hari lewat`;
  return `${diffDays} hari lagi`;
};

// Fungsi getDeadlineColor tetap sama
const getDeadlineColor = (deadlineDate: string) => {
  if (!deadlineDate || deadlineDate === "-") return "grey";

  const now = new Date();
  const deadline = new Date(deadlineDate);
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "red"; // Sudah lewat
  if (diffDays === 0) return "orange"; // Hari ini
  if (diffDays <= 3) return "orange"; // 3 hari lagi
  if (diffDays <= 7) return "yellow"; // 7 hari lagi
  return "green"; // Masih lama
};

// Fungsi untuk menghitung jumlah berdasarkan status
const countByStatus = (status: string) => {
  return masterKategoriItemStore.getDataItemKategori.filter(
    (item) => item.status === status,
  ).length;
};

// Fungsi untuk menghitung item dengan deadline mendekati (≤ 3 hari)
const countApproachingDeadline = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return masterKategoriItemStore.getDataItemKategori.filter((item) => {
    if (!item.periode?.selesai || item.periode.selesai === "-") return false;

    const deadline = new Date(item.periode.selesai);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= 3;
  }).length;
};

// Atau alternatif yang lebih ringkas:
const normalizeDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const statusCounts = computed(() => {
  const counts = {
    onProgress: 0,
    penawaran: 0,
    invoice: 0,
    approachingDeadline: 0,
    overdue: 0, // 🔥 tambahan
  };

  const today = normalizeDate(new Date());

  masterKategoriItemStore.getDataItemKategori.forEach((item) => {
    //status utama
    if (item.status === "Draft") counts.onProgress++;
    if (item.status === "Penawaran") counts.penawaran++;
    if (item.status === "Invoice") counts.invoice++;

    //deadline
    if (item.periode?.selesai && item.periode.selesai !== "-") {
      const deadlineRaw = new Date(item.periode.selesai);

      if (isNaN(deadlineRaw.getTime())) return;

      const deadline = normalizeDate(deadlineRaw);

      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      //DEADLINE DEKAT (0–3 hari)
      if (diffDays >= 0 && diffDays <= 3) {
        counts.approachingDeadline++;
      }

      //SUDAH LEWAT
      if (diffDays < 0) {
        counts.overdue++;
      }
    }
  });

  return counts;
});

function closeDialogUnManage() {
  data.dialogunmanage = false;
  data.alasan_unmanage = "";
}
async function saveUnManage() {
  if (data.alasan_unmanage == "") {
    return notificationStore.showError("pilih alasan terlebih dahulu");
  }
  newunmanage.value.alasan_unmanage = data.alasan_unmanage;
  newunmanage.value.createdAt = moment().unix();
  newunmanage.value.createdBy = useUserStore().getEmail;
  console.log(newunmanage.value, "save data unmanage");
  await unmanagestore.addunmanageAct(newunmanage.value);
  sessionStorage.removeItem("m_item_kategori");
  await masterKategoriItemStore.tarikDataItemKategoriAct();
  data.alasan_unmanage = "";
  data.dialogunmanage = false;
}
function openDialogUnManage(item: itemKategoriM) {
  newunmanage.value.dokumen = item.dokumen;
  newunmanage.value.itemKategoriAt = item.createdAt;
  newunmanage.value.itemKategoriBy = item.createdBy;
  newunmanage.value.id_kategori_item = item.id;
  newunmanage.value.id_object_kategori = item.id_object_kategori;
  newunmanage.value.id_cabang = item.id_cabang;
  newunmanage.value.id_perusahaan = item.id_perusahaan;
  newunmanage.value.jumlahUnit = item.jumlahUnit;
  newunmanage.value.keterangan = item.keterangan;
  newunmanage.value.kode_kategori_item = item.kode_kategori_item;
  newunmanage.value.nama_cabang = item.nama_cabang;
  newunmanage.value.nama_kategori_item = item.nama_kategori_item;
  newunmanage.value.nama_kategori_object = item.nama_kategori_object;
  newunmanage.value.nama_perusahaan = item.nama_perusahaan;
  newunmanage.value.nama_group_pt = item.nama_group_pt;
  newunmanage.value.periode = item.periode;
  newunmanage.value.status = item.status;
  newunmanage.value.ukuran = item.ukuran;
  console.log(newunmanage.value, "open data unmanage");
  // newunmanage.value.updatedAt = item.updatedAt;
  // newunmanage.value.updatedBy = item.updatedBy;
  data.dialogunmanage = true;
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

.deadline-container {
  width: 200px;
  max-width: 100%;
}

.progress-wrapper {
  position: relative;
  margin-bottom: 4px;
}

.progress-bar {
  width: 100%;
}

.deadline-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
}

.progress-percentage {
  text-align: right;
  margin-top: 2px;
}

/* Style untuk table cell */
:deep() .v-data-table__td {
  padding: 8px 16px;
}

:deep() .v-chip {
  font-size: 11px;
  height: 20px;
}

:deep() .v-progress-linear {
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.action-buttons .v-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
  border-radius: 12px;
  height: 38px;
  padding: 0 15px;
  transition: all 0.2s ease;
  box-shadow: none;
}

/* Primary */
.btn-primary-modern {
  background: #2563eb !important;
  color: #fff !important;
}

.btn-primary-modern:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.18);
}

/* Secondary */
.btn-secondary-modern {
  background: #f5f5f5 !important;
  color: #4b5563 !important;
  border: 1px solid #e5e7eb;
}

.btn-secondary-modern:hover {
  background: #ececec !important;
}

/* Success */
.btn-success-modern {
  background: #16a34a !important;
  color: #fff !important;
}

.btn-success-modern:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(22, 163, 74, 0.18);
}

/* Disabled */
.action-buttons .v-btn--disabled {
  opacity: 0.55;
  transform: none !important;
  box-shadow: none !important;
}
</style>
