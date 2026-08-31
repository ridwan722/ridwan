<template>
  <div v-if="detailinvoice">
    <ConfirmationDialog ref="confirmationDialog" />

    <v-dialog v-model="data.dialogkirim" max-width="500" scrollable>
      <v-card>
        <v-card-title class="px-6 py-3 bg-primary">
          <span
            class="d-flex align-center text-subtitle-1 font-weight-bold text-white"
          >
            KIRIM INVOICE & KWITANSI
          </span>
        </v-card-title>

        <v-card-text class="pa-6">
          <upload-image typefolder="invoice_terkirim" label="Invoice" />

          <v-expand-transition>
            <v-card
              v-if="uploadstore.getUrlRef"
              elevation="1"
              class="pa-3 d-flex align-center justify-space-between rounded-lg mb-6"
              style="transition: all 0.3s ease; border: 1px solid #e5e7eb"
            >
              <div class="d-flex align-center overflow-hidden">
                <v-avatar size="38" color="blue-lighten-5" class="mr-3">
                  <v-icon color="blue-darken-2"
                    >mdi-file-document-outline</v-icon
                  >
                </v-avatar>

                <a
                  :href="uploadstore.getUrlRef"
                  target="_blank"
                  class="file-link text-caption font-weight-medium text-primary"
                >
                  {{ getFileName(uploadstore.getUrlRef) }}
                  <v-icon size="14" class="ml-1">mdi-open-in-new</v-icon>
                </a>
              </div>

              <div class="d-flex align-center gap-2 ml-2">
                <v-btn
                  color="red"
                  size="small"
                  variant="text"
                  @click="uploadstore.setReset()"
                  icon
                >
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
              </div>
            </v-card>
          </v-expand-transition>

          <v-divider class="my-4"></v-divider>

          <upload-image2 typefolder="kwitansi_terkirim" label="Kwitansi" />

          <v-expand-transition>
            <v-card
              v-if="uploadstore.getUrlRef2"
              elevation="1"
              class="pa-3 d-flex align-center justify-space-between rounded-lg"
              style="transition: all 0.3s ease; border: 1px solid #e5e7eb"
            >
              <div class="d-flex align-center overflow-hidden">
                <v-avatar size="38" color="blue-lighten-5" class="mr-3">
                  <v-icon color="blue-darken-2"
                    >mdi-file-document-outline</v-icon
                  >
                </v-avatar>

                <a
                  :href="uploadstore.getUrlRef2"
                  target="_blank"
                  class="file-link text-caption font-weight-medium text-primary"
                >
                  {{ getFileName(uploadstore.getUrlRef2) }}
                  <v-icon size="14" class="ml-1">mdi-open-in-new</v-icon>
                </a>
              </div>

              <div class="d-flex align-center gap-2 ml-2">
                <v-btn
                  color="red"
                  size="small"
                  variant="text"
                  @click="uploadstore.setReset2()"
                  icon
                >
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
              </div>
            </v-card>
          </v-expand-transition>
        </v-card-text>

        <v-card-actions>
          <v-btn color="error" @click="data.dialogkirim = false">Batal</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-send"
            @click="dikirim"
          >
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="data.dialogrevisi" max-width="1050" scrollable>
      <v-card class="rounded-lg">
        <v-card-title class="bg-orange text-center">
          <span class="font-weight-bold text-white"> Revisi Invoice </span>
        </v-card-title>

        <v-divider />

        <v-card-text class="bg-grey-lighten-5">
          <v-row dense>
            <v-col cols="12" class="mb-1 d-flex align-center">
              <v-icon
                size="16"
                color="primary"
                class="mr-2"
                icon="mdi-account-box"
              />

              <span
                class="text-caption font-weight-bold text-grey-darken-2 text-uppercase"
                style="letter-spacing: 1px"
              >
                Data Customer
              </span>
            </v-col>

            <v-col cols="12" md="6">
              <a-text-field
                v-model="detailinvoice.nama_group_pt"
                label="Nama Group"
                disabled
              />
            </v-col>

            <v-col cols="12" md="6">
              <a-text-field
                v-model="detailinvoice.nama_perusahaan"
                label="Nama Perusahaan"
                disabled
              />
            </v-col>

            <v-col cols="12" md="6">
              <a-text-field
                v-model="detailinvoice.nama_cabang_perusahaan"
                label="Nama Cabang"
                disabled
              />
            </v-col>

            <v-col cols="12" md="6">
              <a-text-field
                v-model="detailinvoice.telepon_perusahaan"
                label="Telepon Perusahaan"
                disabled
              />
            </v-col>

            <v-divider class="mt-3 mb-1"></v-divider>

            <v-col cols="12">
              <a-textarea
                v-model="detailinvoice.perihal_invoice"
                placeholder="Cth. Pembayaran Pengurusan..."
                label="Perihal Invoice"
              />

              <a-text-field
                class="mt-2"
                v-model="detailinvoice.pic"
                label="UP"
                placeholder="Bpk."
              />
            </v-col>

            <v-col cols="12" class="mt-4 mb-1 d-flex align-center">
              <v-icon
                size="16"
                color="primary"
                class="mr-2"
                icon="mdi-calendar-clock"
              />

              <span
                class="text-caption font-weight-bold text-grey-darken-2 text-uppercase"
                style="letter-spacing: 1px"
              >
                Item Invoice
              </span>
            </v-col>

            <v-col cols="12" md="6">
              <a-date-picker
                v-model="detailinvoice.tanggal"
                :onUpdate:modelValue="
                  (n: string) => (detailinvoice.tanggal = n)
                "
                label="Tanggal Invoice"
              />
            </v-col>

            <v-col cols="12" md="6">
              <a-date-picker
                v-model="detailinvoice.jatuhTempo"
                :onUpdate:modelValue="
                  (n: string) => (detailinvoice.jatuhTempo = n)
                "
                label="Jatuh Tempo"
              />
            </v-col>

            <div
              style="border: grey solid 1px; border-radius: 10px"
              class="mt-3"
            >
              <v-col cols="12">
                <v-sheet border rounded class="overflow-hidden">
                  <v-table density="compact" class="compact-invoice-table">
                    <thead class="bg-grey-lighten-4">
                      <tr>
                        <th
                          class="text-center font-weight-bold text-caption"
                          width="110"
                        >
                          No
                        </th>
                        <th
                          class="text-left font-weight-bold text-caption"
                          width="320"
                        >
                          PEKERJAAN
                        </th>
                        <th
                          class="text-center font-weight-bold text-caption"
                          width="120"
                        >
                          Qty
                        </th>
                        <th
                          class="text-center font-weight-bold text-caption"
                          width="170"
                        >
                          Harga /Unit
                        </th>
                        <th
                          class="text-right font-weight-bold text-caption"
                          width="130"
                        >
                          SUB TOTAL
                        </th>

                        <!-- <th
                        class="text-right font-weight-bold text-caption"
                        width="120"
                      >
                        SELECTED
                      </th> -->

                        <th
                          class="text-center font-weight-bold text-caption"
                          width="120"
                        >
                          PPN & PPh
                        </th>

                        <!-- <th
                          class="text-center font-weight-bold text-caption"
                          width="120"
                        >
                          PPH
                        </th> -->
                      </tr>
                    </thead>
                    <tbody class="text-caption">
                      <tr
                        v-for="(item, index) in detailinvoice.items"
                        :key="index"
                      >
                        <td class="text-center text-grey-darken-1">
                          {{ index + 1 }}
                        </td>
                        <td class="font-weight-medium">
                          {{ item.nama_kategori_item }}
                        </td>
                        <td class="text-center">{{ item.jumlahUnit }}</td>
                        <!-- <td class="text-right">
                          Rp {{ rupiah(item.nominal) }}
                        </td> -->
                        <td class="text-right">
                          <div class="mt-1">
                            <div
                              v-if="!item.isEdit"
                              class="d-flex align-center justify-end"
                            >
                              <span
                                v-if="
                                  item.nominal_edit !== null &&
                                  item.nominal_edit !== undefined &&
                                  item.nominal_edit !== ''
                                "
                                >Rp {{ rupiah(item.nominal_edit) }}</span
                              >
                              <span v-else>Rp {{ rupiah(item.nominal) }}</span>
                              <v-btn
                                icon="mdi-pencil"
                                size="x-small"
                                variant="text"
                                color="primary"
                                class="ml-1"
                                @click="startEdit(item)"
                              />
                            </div>

                            <!-- EDIT MODE -->
                            <v-expand-transition>
                              <div
                                v-if="item.isEdit"
                                class="d-flex align-center justify-end"
                              >
                                <a-text-field
                                  v-model.number="item.nominal_edit"
                                  density="compact"
                                  hide-details
                                  style="max-width: 120px"
                                  @keyup.enter="saveEdit(item)"
                                />

                                <v-tooltip
                                  text="Kembali ke nominal awal"
                                  location="top"
                                >
                                  <template #activator="{ props }">
                                    <v-btn
                                      v-bind="props"
                                      icon="mdi-cancel"
                                      size="x-small"
                                      variant="text"
                                      class="ml-1"
                                      color="red"
                                      @click="cancelEdit(item)"
                                    />
                                  </template>

                                  <span style="font-size: 11px">
                                    Kembali ke harga awal
                                  </span>
                                </v-tooltip>
                              </div>
                            </v-expand-transition>
                          </div>
                        </td>
                        <td class="text-right font-weight-bold">
                          Rp {{ rupiah(getHarga(item) * item.jumlahUnit) }}
                        </td>

                        <!-- <td>
                        <div class="d-flex justify-center">
                          <a-checkbox
                            v-model="selectedItems"
                            :value="`${item.id}-${index}`"
                            density="compact"
                            hide-details
                            size="small"
                          />
                        </div>
                      </td> -->

                        <!-- <td>
                          <div class="d-flex justify-center">
                            <a-checkbox
                              v-model="selectedPpnItems"
                              :value="`${item.id}-${index}`"
                              density="compact"
                              hide-details
                              size="small"
                            />
                          </div>
                        </td>

                        <td>
                          <div class="d-flex justify-center">
                            <a-checkbox
                              v-model="selectedPphItems"
                              :value="`${item.id}-${index}`"
                              density="compact"
                              hide-details
                              size="small"
                            />
                          </div>
                        </td> -->

                        <td class="pa-1" v-if="isKAM">
                          <div class="d-flex flex-column ga-0">
                            <v-checkbox
                              v-model="selectedPpnPphItems"
                              :value="`${item.id}-${index}`"
                              @change="handleSelectItem(item, index)"
                              density="compact"
                              hide-details
                              color="primary"
                              class="ma-0 pa-0"
                              style="
                                min-height: 22px;
                                margin-top: -6px !important;
                              "
                            >
                              <template #label>
                                <span
                                  class="text-caption"
                                  style="line-height: 1; font-size: 11px"
                                  >PPN & PPh</span
                                >
                              </template>
                            </v-checkbox>
                          </div>
                        </td>

                        <td class="pa-1" v-if="isABK">
                          <div class="d-flex flex-column ga-0">
                            <v-checkbox
                              :model-value="isAllSelected"
                              :indeterminate="isIndeterminate"
                              @click="toggleAllItems"
                              density="compact"
                              hide-details
                              color="primary"
                              class="ma-0 pa-0"
                              style="min-height: 22px"
                            >
                              <template #label>
                                <span
                                  class="text-caption"
                                  style="line-height: 1; font-size: 11px"
                                  >Pilih</span
                                >
                              </template>
                            </v-checkbox>

                            <v-checkbox
                              :disabled="
                                !selectedItems.includes(`${item.id}-${index}`)
                              "
                              v-model="selectedPpnItems"
                              :value="`${item.id}-${index}`"
                              density="compact"
                              hide-details
                              color="primary"
                              class="ma-0 pa-0"
                              style="
                                min-height: 22px;
                                margin-top: -6px !important;
                              "
                            >
                              <template #label>
                                <span
                                  class="text-caption"
                                  style="line-height: 1; font-size: 11px"
                                  >PPN & PPh</span
                                >
                              </template>
                            </v-checkbox>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <!-- <tfoot class="bg-grey-lighten-5 border-t-sm">
                    <tr>
                      <td
                        colspan="6"
                        class="text-right font-weight-bold text-caption py-2"
                      >
                        TOTAL ITEM
                      </td>
                      <td
                        class="text-right font-weight-bold text-caption py-2 text-primary"
                      >
                        Rp {{ rupiah(detailinvoice.total) }}
                      </td>
                    </tr>
                  </tfoot> -->
                  </v-table>
                </v-sheet>
              </v-col>

              <!-- // DIPAKE LAGI \\ -->
              <v-col cols="12" class="mb-2">
                <div class="d-flex align-center mb-1">
                  <v-icon size="18" color="primary" class="mr-2">
                    mdi-cash-plus
                  </v-icon>
                  <span
                    class="text-caption font-weight-medium text-grey-darken-2 text-uppercase"
                    style="letter-spacing: 1px"
                  >
                    Biaya Tambahan Lainnya
                  </span>
                </div>

                <div class="d-flex align-center ga-2">
                  <div style="flex: 1">
                    <a-text-field
                      v-model.number="newlisitemtambahan.keterangan_penawaran"
                      label="Keterangan"
                      placeholder="isi"
                      density="compact"
                    />
                  </div>

                  <div style="flex: 1">
                    <a-field-number
                      v-model.number="newlisitemtambahan.nominal_tambahan"
                      label="Nominal"
                      placeholder="0"
                      density="compact"
                    />
                  </div>

                  <v-btn color="primary" size="32" class="mt-5">
                    <v-icon size="13" @click="additemtambahanlainya"
                      >mdi-plus</v-icon
                    >
                  </v-btn>
                </div>
              </v-col>

              <!-- // DIPAKE LAGI \\ -->

              <v-col cols="12">
                <v-sheet border rounded class="overflow-hidden">
                  <v-table density="compact" class="compact-invoice-table">
                    <thead class="bg-grey-lighten-4">
                      <tr>
                        <th
                          class="text-center font-weight-bold text-caption"
                          width="20"
                        >
                          No
                        </th>
                        <th class="font-weight-bold text-caption" width="260">
                          Tambahan
                        </th>
                        <th class="font-weight-bold text-caption" width="160">
                          Nominal
                        </th>
                        <th class="font-weight-bold text-caption" width="10">
                          Tindakan
                        </th>
                      </tr>
                    </thead>
                    <tbody class="text-caption">
                      <tr
                        v-for="(item, index) in detailinvoice.item_tambahan"
                        :key="index"
                      >
                        <td class="text-center text-grey-darken-1">
                          {{ index + 1 }}.
                        </td>
                        <td class="font-weight-medium">
                          {{ item.keterangan_penawaran }}
                        </td>
                        <td>{{ rupiah(item.nominal_tambahan) }}</td>

                        <td>
                          <div class="d-flex align-center ga-3">
                            <a-checkbox
                              v-model="selectedItemTambahan"
                              :value="`${item.id}-${index}`"
                              @change="
                                handleItemTambahanChange(`${item.id}-${index}`)
                              "
                              density="compact"
                              label="Pilih"
                            />
                            <!-- Checkbox Pajak -->
                            <a-checkbox
                              v-if="
                                selectedItemTambahan.includes(
                                  `${item.id}-${index}`,
                                )
                              "
                              v-model="selectedTaxItemTambahan"
                              :value="`${item.id}-${index}`"
                              density="compact"
                              label="PPN & PPh"
                            />

                            <!-- Tombol Hapus -->
                            <v-tooltip text="Hapus item" location="top">
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  color="red"
                                  size="20"
                                  variant="text"
                                  class="ml-auto"
                                  @click="deleteitemtambahanlainya(index)"
                                >
                                  <v-icon size="16"
                                    >mdi-trash-can-outline</v-icon
                                  >
                                </v-btn>
                              </template>
                            </v-tooltip>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-sheet>
              </v-col>
            </div>

            <v-col cols="12" class="mt-4">
              <v-card
                variant="outlined"
                class="bg-white border-dashed rounded-lg"
              >
                <div class="pa-4">
                  <div class="d-flex justify-space-between text-caption mb-2">
                    <span class="text-grey-darken-1 font-weight-medium"
                      >Sub Total</span
                    >
                    <span class="font-weight-bold text-grey-darken-4"
                      >Rp {{ rupiah(subtotal) }}</span
                    >
                  </div>
                  <div class="d-flex justify-space-between text-caption mb-2">
                    <span class="text-grey-darken-1 font-weight-medium"
                      >PPN 11%</span
                    >
                    <span class="font-weight-bold text-green-darken-2"
                      >+ Rp {{ rupiah(ppn) }}
                    </span>
                  </div>
                  <div class="d-flex justify-space-between text-caption mb-2">
                    <span class="text-grey-darken-1 font-weight-medium"
                      >PPH 2%</span
                    >
                    <span class="font-weight-bold text-orange-darken-2"
                      >- Rp {{ rupiah(pph) }}</span
                    >
                  </div>
                  <v-divider />
                  <div class="d-flex justify-space-between align-center py-1">
                    <span class="text-subtitle-2 font-weight-black"
                      >GRAND TOTAL</span
                    >
                    <span class="text-h6 font-weight-black text-primary"
                      >Rp {{ rupiah(grandtotal) }}</span
                    >
                  </div>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" class="mt-2">
              <a-textarea
                v-model="detailinvoice.remark"
                label="Keterangan Inv"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3 bg-grey-lighten-4">
          <v-btn
            variant="flat"
            color="grey-darken-2"
            @click="data.dialogrevisi = false"
            class="text-capitalize px-3"
          >
            Batal
          </v-btn>

          <v-btn
            color="primary"
            variant="flat"
            class="text-capitalize px-3"
            @click="saverevisiinvoice"
          >
            Simpan Revisi
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="data.dialogpemberkasan" max-width="1250" scrollable>
      <v-card rounded="lg">
        <v-card-title class="px-6 py-3 bg-primary">
          <span
            class="d-flex align-center text-subtitle-1 font-weight-bold text-white"
          >
            TAMBAH BERKAS
          </span>
        </v-card-title>

        <v-card-text class="pa-0">
          <v-row no-gutters>
            <v-col cols="5" class="pa-6 border-e bg-grey-lighten-5">
              <div class="mb-4">
                <a-text-field
                  label="No Penawaran"
                  v-model="detailinvoice.id_penawaran"
                  disabled
                  density="compact"
                  variant="outlined"
                  bg-color="white"
                />
                <a-textarea
                  label="Perihal"
                  v-model="detailinvoice.perihal"
                  disabled
                  density="compact"
                  variant="outlined"
                  bg-color="white"
                  rows="2"
                  class="mt-3"
                />
              </div>

              <v-divider class="my-6"></v-divider>

              <div class="text-subtitle-2 mb-3 font-weight-bold">
                KODE BAYAR
              </div>
              <a-text-field
                v-model="data.new_kodebayar.kode_bayar"
                label="Kode Bayar"
                placeholder="kode bayar"
                density="compact"
                variant="outlined"
                bg-color="white"
                class="mb-3"
              />
              <upload-image2 label="Doc" class="mb-3" />
              <v-btn
                color="success"
                size="small"
                block
                elevation="1"
                @click="addkodebayar"
                >Tambah</v-btn
              >

              <div class="mt-4 border rounded bg-white">
                <v-data-table-virtual
                  :headers="data.headerkodebayar"
                  :items="detailinvoice.item_kode_bayar"
                  height="165"
                  density="compact"
                >
                  <template v-slot:item.no="{ index }">
                    <span class="text-caption">{{ index + 1 }}.</span>
                  </template>

                  <template v-slot:item.aksi="{ index }">
                    <v-btn @click="deletekodebayar(index)" size="25" color="red"
                      ><v-icon color="white" size="15"
                        >mdi-delete</v-icon
                      ></v-btn
                    >
                  </template>

                  <template v-slot:item.file_kode_bayar="{ item }">
                    <v-btn
                      color="blue"
                      target="_blank"
                      size="small"
                      v-if="item.file_kode_bayar"
                      :href="item.file_kode_bayar"
                      ><v-icon>mdi-file-image</v-icon></v-btn
                    >
                  </template>
                </v-data-table-virtual>
              </div>
            </v-col>

            <v-col cols="7" class="pa-6">
              <div class="text-subtitle-2 mb-4 font-weight-bold">
                Berkas Tambahan
              </div>

              <v-row dense>
                <v-col cols="12">
                  <a-select
                    label="Pilih Item Kategori"
                    v-model="data.new_pemberkasan.id_kategori_item"
                    :items="detailinvoice.items"
                    item-title="nama_kategori_item"
                    item-value="id_kategori_item"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6">
                  <a-text-field
                    label="Periode Awal"
                    v-model="data.new_pemberkasan.periode_mulai"
                    disabled
                    placeholder="----/--/--"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6">
                  <a-text-field
                    label="Periode Akhir"
                    v-model="data.new_pemberkasan.periode_selesai"
                    disabled
                    placeholder="----/--/--"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6">
                  <a-select
                    label="Jenis dokumen"
                    v-model="data.new_pemberkasan.id_dokumen"
                    :items="masterdokumenstore.getDataDokumen"
                    item-title="nama_dokumen"
                    item-value="id"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6">
                  <a-text-field
                    label="No Dokumen"
                    placeholder="Cth. 0123"
                    v-model="data.new_pemberkasan.no_dokumen"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
              </v-row>

              <v-row align="center" class="mt-0">
                <v-col cols="7" class="mt-1">
                  <upload-image label="Upload" />
                </v-col>
                <v-col>
                  <a-select
                    label="Status Dokumen"
                    class="mb-2"
                    v-model="data.new_pemberkasan.status_dokumen"
                    :items="['Asli', 'Copy']"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="success"
                    size="small"
                    @click="adddocpemberkasan"
                    prepend-icon="mdi-plus"
                  >
                    Add
                  </v-btn>
                </v-col>
              </v-row>

              <v-card class="pa-2">
                <v-data-table-virtual
                  :headers="data.headerberkas"
                  :items="detailinvoice.berkas"
                  height="250"
                  fixed-header
                  density="compact"
                >
                  <template v-slot:item.no="{ index }">
                    <span class="text-caption">{{ index + 1 }}.</span>
                  </template>

                  <template v-slot:item.periode="{ item }">
                    {{ item.periode_mulai }} - {{ item.periode_selesai }}
                  </template>

                  <template v-slot:item.file_dokumen="{ item }">
                    <v-btn
                      color="info"
                      size="small"
                      variant="text"
                      icon="mdi-file-eye-outline"
                      :href="item.file_dokumen"
                      target="_blank"
                    ></v-btn>
                    <span style="font-size: 11px; color: grey">{{
                      item.status_dokumen
                    }}</span>
                  </template>

                  <template v-slot:item.aksi="{ index }">
                    <v-btn
                      color="error"
                      size="small"
                      variant="text"
                      icon="mdi-delete-outline"
                      @click="deletedocpemberkasan(index)"
                    ></v-btn>
                  </template>
                </v-data-table-virtual>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-3 bg-white">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="data.dialogpemberkasan = false"
            class="px-4"
            >Batal</v-btn
          >
          <v-btn color="primary" variant="flat" @click="addberkas" class="px-8"
            >Simpan Berkas</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- // DETAIL INVOICE SETELAH STATUS SELESAI \\ -->
    <v-card
      v-if="
        detailinvoice.status == 'Diterima' || detailinvoice.status == 'Selesai'
      "
      variant="outlined"
      class="mb-4 rounded-lg"
      style="border-color: #e0e0e0"
    >
      <v-sheet
        color="grey-lighten-4"
        class="px-4 py-3 d-flex align-center border-b"
      >
        <div class="text-h6 font-weight-bold mr-4">
          INVOICE #{{ detailinvoice.no_inv }}
        </div>

        <v-spacer></v-spacer>
        <v-chip
          color="success"
          size="small"
          variant="flat"
          class="font-weight-bold px-3"
        >
          {{ detailinvoice.status.toUpperCase() }}
        </v-chip>
      </v-sheet>

      <v-card-text class="pa-0">
        <v-row no-gutters>
          <v-col cols="12" md="8" class="pa-4 border-e">
            <v-row dense>
              <v-col cols="12" class="mb-2">
                <div
                  class="text-caption text-grey text-uppercase font-weight-bold"
                >
                  Informasi Perusahaan
                </div>
                <div class="text-subtitle-1 font-weight-bold text-primary">
                  {{ detailinvoice.nama_group_pt }}
                  {{ detailinvoice.nama_perusahaan }}
                </div>
                <div class="text-body-2">
                  Cab. {{ detailinvoice.nama_cabang_perusahaan }}
                </div>
              </v-col>

              <v-divider cols="12" class="my-2"></v-divider>

              <v-col cols="6" sm="4">
                <div class="text-caption text-grey">ID Penawaran</div>
                <div class="text-body-1 font-weight-medium">
                  <a
                    :href="'/admin/penawaran/' + detailinvoice.id_penawaran"
                    class="text-black"
                  >
                    {{ detailinvoice.id_penawaran }}
                    <v-icon size="14" class="ml-2">mdi-open-in-new</v-icon>
                  </a>
                </div>
              </v-col>
            </v-row>

            <!-- PENAWARAN -->
            <v-row class="mt-3 invoice-status-row" dense>
              <v-col cols="12" sm="6">
                <div class="info-card">
                  <div class="icon-box">
                    <v-icon size="18">mdi-pencil-outline</v-icon>
                  </div>

                  <div class="info-content">
                    <div class="info-label">Penawaran Dibuat</div>
                    <div class="info-value">
                      {{ rubahtanggalunix(detailinvoice.createdAt) }}
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-card">
                  <div class="icon-box">
                    <v-icon size="18">mdi-hexagon-multiple-outline</v-icon>
                  </div>

                  <div class="info-content">
                    <div class="info-label">Terbit SPK</div>
                    <div class="info-value">
                      {{ rubahtanggalunix(detailinvoice.disetujuiAt) }}
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-card">
                  <div class="icon-box">
                    <v-icon size="18">mdi-clipboard-text-clock-outline</v-icon>
                  </div>

                  <div class="info-content">
                    <div class="info-label">Diproses</div>
                    <div class="info-value">
                      {{ rubahtanggalunix(detailinvoice.dikirimAt) }}
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div
                  class="info-card d-flex align-center justify-space-between"
                >
                  <div class="d-flex align-center">
                    <div class="icon-box mr-3">
                      <v-icon size="18">mdi-folder-open-outline</v-icon>
                    </div>

                    <div class="info-content">
                      <div class="info-label">Pemberkasan</div>
                      <div class="info-value">
                        {{ rubahtanggalunix(detailinvoice.tanda_terima_at) }}
                      </div>
                    </div>
                  </div>

                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    :href="'/admin/penawaran/' + detailinvoice.id_penawaran"
                  >
                    <v-icon size="16">mdi-eye-outline</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>

            <!-- INVOICE -->
            <div class="mt-4 mb-1 text-grey">
              <v-icon size="small">mdi-invoice-outline</v-icon
              ><span class="ml-1">INVOICE</span>
            </div>
            <v-row class="invoice-status-row" dense>
              <v-col cols="12" sm="6">
                <div class="info-card">
                  <div class="icon-box">
                    <v-icon size="18">mdi-file-document-outline</v-icon>
                  </div>

                  <div class="info-content">
                    <div class="info-label">Invoice Dibuat</div>
                    <div class="info-value">
                      {{ rubahtanggalunix(detailinvoice.createdAt) }}
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-card">
                  <div class="icon-box">
                    <v-icon size="18">mdi-check-decagram-outline</v-icon>
                  </div>

                  <div class="info-content">
                    <div class="info-label">Invoice Disetujui</div>
                    <div class="info-value">
                      {{ rubahtanggalunix(detailinvoice.disetujuiAt) }}
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-card">
                  <div class="icon-box">
                    <v-icon size="18">mdi-truck-delivery-outline</v-icon>
                  </div>

                  <div class="info-content">
                    <div class="info-label">Invoice Dikirim</div>
                    <div class="info-value">
                      {{ rubahtanggalunix(detailinvoice.dikirimAt) }}
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-card">
                  <div class="icon-box">
                    <v-icon size="18">mdi-check-circle-outline</v-icon>
                  </div>

                  <div class="info-content">
                    <div class="info-label">Invoice Diterima</div>
                    <div class="info-value">
                      {{ rubahtanggalunix(detailinvoice.tanda_terima_at) }}
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" md="4" class="pa-4 bg-grey-lighten-5">
            <div
              class="text-caption text-grey text-uppercase font-weight-bold mb-2"
            >
              Rincian Pembayaran
            </div>

            <div class="d-flex justify-space-between mb-1">
              <span class="text-body-2">Jatuh Tempo</span>
              <span class="text-body-2 font-weight-medium">
                {{ rubahtanggallengkap(detailinvoice.jatuhTempo) }}</span
              >
            </div>

            <v-divider class="my-3 border-opacity-50"></v-divider>

            <div class="d-flex justify-space-between mb-1">
              <span class="text-body-2">Subtotal</span>
              <span class="text-body-2 font-weight-medium"
                >Rp {{ rupiah(detailinvoice.subtotal) }}</span
              >
            </div>
            <div class="d-flex justify-space-between mb-1">
              <span class="text-body-2">PPN</span>
              <span class="text-body-2 font-weight-medium"
                >Rp {{ rupiah(detailinvoice.ppn) }}</span
              >
            </div>
            <div class="d-flex justify-space-between mb-1">
              <span class="text-body-2 font-italic">PPH</span>
              <span class="text-body-2 font-weight-medium font-italic"
                >Rp {{ rupiah(detailinvoice.pph) }}</span
              >
            </div>

            <v-divider class="my-3 border-opacity-50"></v-divider>

            <div class="d-flex justify-space-between align-center">
              <span class="text-subtitle-1 font-weight-bold">Grand Total</span>
              <span class="text-h6 font-weight-black">
                Rp {{ rupiah(detailinvoice.grandtotal) }}
              </span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions class="pa-3">
        <template v-if="detailinvoice?.tanda_terima_invoice?.length">
          <v-btn
            v-for="(link, index) in detailinvoice.tanda_terima_invoice"
            :key="'tt-' + index"
            :href="link"
            target="_blank"
            variant="outlined"
            color="grey-darken-2"
            append-icon="mdi-open-in-new"
            class="text-none font-weight-bold px-4 mr-2"
          >
            Tanda Terima
            {{ detailinvoice.tanda_terima_invoice.length > 1 ? index + 1 : "" }}
          </v-btn>
        </template>

        <v-spacer></v-spacer>

        <div
          v-if="
            detailinvoice?.invoice_terkirim || detailinvoice?.kwitansi_terkirim
          "
          class="d-flex align-center ga-3 flex-wrap"
        >
          <v-btn
            v-if="detailinvoice?.invoice_terkirim"
            :href="detailinvoice.invoice_terkirim"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            variant="flat"
            prepend-icon="mdi-file-document-outline"
            class="text-none font-weight-medium px-5"
          >
            Invoice
          </v-btn>

          <v-btn
            v-if="detailinvoice?.kwitansi_terkirim"
            :href="detailinvoice.kwitansi_terkirim"
            target="_blank"
            rel="noopener noreferrer"
            color="success"
            variant="flat"
            prepend-icon="mdi-receipt-text-outline"
            class="text-none font-weight-medium px-5"
          >
            Kwitansi
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>

    <!-- // TINDAKAN \\ -->
    <v-sheet
      border="t"
      class="d-flex align-center justify-space-between py-6 px-4 bg-grey-lighten-5"
    >
      <v-btn
        variant="text"
        color="grey-darken-2"
        prepend-icon="mdi-arrow-left"
        class="text-none font-weight-bold px-4"
        rounded="0"
        @click="$router.back()"
      >
        Kembali
      </v-btn>

      <div class="d-flex align-center ga-3">
        <template v-if="detailinvoice.status === 'Draft'">
          <v-btn
            variant="text"
            color="red-darken-1"
            prepend-icon="mdi-close-circle-outline"
            class="text-none font-weight-bold px-4"
            rounded="0"
            @click="ditolak"
          >
            Tolak
          </v-btn>

          <v-btn
            elevation="2"
            color="amber-darken-3"
            theme="dark"
            prepend-icon="mdi-file-document-edit-outline"
            class="text-none font-weight-bold px-6"
            rounded="0"
            @click="opendialogrevisi"
          >
            Revisi
          </v-btn>

          <v-btn
            elevation="4"
            color="indigo-darken-3"
            theme="dark"
            prepend-icon="mdi-check-decagram"
            class="text-none font-weight-black px-10"
            rounded="0"
            @click="disetujui"
          >
            Konfirmasi Setuju
          </v-btn>
        </template>

        <v-btn
          v-if="detailinvoice.status === 'Disetujui'"
          elevation="2"
          color="amber-darken-3"
          theme="dark"
          prepend-icon="mdi-file-document-edit-outline"
          class="text-none font-weight-bold px-6"
          rounded="0"
          @click="opendialogrevisi"
        >
          Revisi
        </v-btn>

        <v-btn
          v-if="detailinvoice.status === 'Disetujui'"
          elevation="4"
          color="blue-darken-4"
          theme="dark"
          size="large"
          prepend-icon="mdi-send-variant-outline"
          class="text-none font-weight-black px-12"
          rounded="0"
          @click="opendialogkirim"
        >
          Kirim Invoice & Kwitansi
        </v-btn>

        <v-btn
          v-if="detailinvoice.status === 'Diterima'"
          block
          size="large"
          rounded="lg"
          elevation="0"
          class="btn-selesai text-none font-weight-bold"
          @click="selesai"
        >
          <v-icon start size="20">mdi-check-circle</v-icon>
          Tandai Selesai
        </v-btn>
      </div>
    </v-sheet>

    <!-- REVISI INVOICE -->
    <div
      class="my-3 mb-6"
      v-if="
        (invoicestore.getDataRevisiInvoice?.length &&
          detailinvoice.status == 'Draft') ||
        detailinvoice.status == 'Disetujui'
      "
    >
      <span class="text-caption">󠁯•󠁏 Revisi invoice</span> <br />
      <v-btn-toggle
        density="compact"
        class="border-0 mt-1 mr-2"
        background-color="transparent"
      >
        <v-btn
          v-for="item in invoicestore.getDataRevisiInvoice"
          :key="item.id"
          size="x-small"
          variant="outlined"
          color="grey-lighten-1"
          class="text-grey-darken-2 px-2 text-none mt-1 btn-revisi mr-2"
          @click="saverevisitoinvoice(item)"
        >
          <strong>
            {{
              item.id.split("-").pop() === "01"
                ? "Invoice Awal"
                : `Revisi ${item.id.split("-").pop()}`
            }}
          </strong>
        </v-btn>
      </v-btn-toggle>

      <v-divider class="mt-3" />
    </div>

    <!-- // TAB \\ -->
    <div
      class="d-flex justify-center mb-8 no-print mt-5"
      v-if="
        detailinvoice.status != 'Diterima' && detailinvoice.status != 'Selesai'
      "
    >
      <v-btn-toggle
        v-model="activeTab"
        mandatory
        color="#265ffc"
        variant="outlined"
        divided
        class="custom-toggle"
      >
        <v-btn value="invoice" prepend-icon="mdi-file-document-outline">
          Invoice
        </v-btn>
        <v-btn value="kwitansi" prepend-icon="mdi-cash-register">
          Kwitansi
        </v-btn>
        <!-- v-if="detailinvoice.nama_kategori_object != 'Disnaker'" -->
        <v-btn value="tanda-terima" prepend-icon="mdi-clipboard-check-outline">
          Tanda Terima
        </v-btn>
        <v-btn
          v-if="detailinvoice.nama_kategori_object == 'Disnaker'"
          value="tanda-terima-sertifikasi-disnaker"
          prepend-icon="mdi-certificate-outline"
        >
          Tanda Terima (Disnaker)
        </v-btn>
      </v-btn-toggle>
    </div>

    <!-- // SURAT INVOICE \\ -->
    <div v-if="activeTab === 'invoice'">
      <div
        class="preview-container d-flex justify-center"
        v-if="
          activeTab === 'invoice' &&
          detailinvoice.status != 'Diterima' &&
          detailinvoice.status != 'Selesai'
        "
      >
        <div ref="printArea" class="invoice-paper-wrapper">
          <v-card width="850" class="pa-10 invoice-paper elevation-2">
            <div class="d-flex justify-space-between align-start mb-4">
              <div v-if="detailinvoice.handle_by_aresa == 'KAM'">
                <img src="/public/aresa_typo.png" height="130" />
                <div class="company-address">
                  <strong>PT. KARYA ARESA MANDIRI</strong><br />
                  Jl. Kebagusan Raya, Mawar No. 54, Pasar Minggu<br />
                  Jakarta Selatan 12520 Indonesia<br />
                  Phone : +6221 2179 8064
                </div>
              </div>
              <div class="invoice-title">INVOICE</div>
            </div>

            <div class="info-grid mb-4">
              <div class="info-box-left">
                <table class="w-100">
                  <tbody>
                    <tr>
                      <td width="80">Customer</td>
                      <td width="10">:</td>
                      <td>
                        <span
                          ><span v-if="showPt">{{
                            detailinvoice.nama_group_pt
                          }}</span>
                          <br v-if="showPt" />
                          {{ detailinvoice.nama_perusahaan }}</span
                        >
                        <v-chip
                          v-if="!showPt"
                          @click="showPt = !showPt"
                          style="cursor: pointer"
                          link
                          v-ripple
                          size="x-small"
                          class="ml-1 no-print"
                        >
                          <v-icon start size="16">
                            {{
                              showPt
                                ? "mdi-eye-off-outline"
                                : "mdi-undo-variant"
                            }}
                          </v-icon>

                          {{
                            showPt
                              ? "Tampilkan Nama PT saja"
                              : "Group / PT / Cab."
                          }}
                        </v-chip>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>
                        <span v-if="showPt"
                          >Cab. {{ detailinvoice.nama_cabang_perusahaan }}</span
                        >
                        <br />
                        <v-chip
                          v-if="showPt"
                          @click="showPt = !showPt"
                          style="cursor: pointer"
                          link
                          v-ripple
                          size="x-small"
                          class="ml-1 no-print"
                        >
                          <v-icon start size="16">
                            {{
                              showPt
                                ? "mdi-eye-off-outline"
                                : "mdi-undo-variant"
                            }}
                          </v-icon>

                          {{ showPt ? "Tampilkan Nama PT saja" : "Kembalikan" }}
                        </v-chip>
                      </td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td>:</td>
                      <td>{{ detailinvoice.telepon_perusahaan || "-" }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="info-box-right">
                <table class="w-100">
                  <tbody>
                    <tr>
                      <td width="100">Number</td>
                      <td width="10">:</td>
                      <td v-if="detailinvoice.id_penawaran">
                        #{{ detailinvoice.no_inv }}
                        <!-- #{{ detailinvoice.no_inv.replace(/-/g, "/") }} -->
                      </td>
                    </tr>
                    <tr>
                      <td>Inv Date</td>
                      <td>:</td>
                      <td>
                        {{ formatinvDate(detailinvoice.tanggal) }}
                      </td>
                    </tr>
                    <tr>
                      <td>Currency</td>
                      <td>:</td>
                      <td>IDR – (Rupiah)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <table class="main-table">
              <thead>
                <tr>
                  <th width="65%">DESCRIPTION</th>
                  <th colspan="2" width="35%">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="desc-cell">
                    <div class="text-center font-weight-bold">
                      <span style="white-space: pre-line">
                        {{ detailinvoice.perihal_invoice }}
                      </span>
                    </div>
                    <div class="text-center">
                      <span class="font-weight-bold"
                        >{{ detailinvoice.nama_perusahaan }} </span
                      ><br />
                      <div
                        class="d-flex align-center justify-center"
                        v-if="showPeriode"
                      >
                        <span class="mr-2">Periode :</span>
                        <div v-if="detailinvoice.items?.length">
                          {{
                            rubahtanggallengkap(
                              detailinvoice.items[0].periode_penawaran?.mulai,
                            )
                          }}
                          s/d
                          {{
                            rubahtanggallengkap(
                              detailinvoice.items[0].periode_penawaran?.selesai,
                            )
                          }}
                        </div>
                      </div>
                      <v-chip
                        @click="showPeriode = !showPeriode"
                        style="cursor: pointer"
                        link
                        v-ripple
                        size="x-small"
                        class="ml-1 no-print"
                      >
                        <v-icon start size="16">
                          {{
                            showPeriode
                              ? "mdi-eye-off-outline"
                              : "mdi-undo-variant"
                          }}
                        </v-icon>

                        {{
                          showPeriode
                            ? "Sembunyikan Periode"
                            : "Tampilkan Periode"
                        }}
                      </v-chip>
                    </div>
                  </td>
                  <td colspan="2" class="amount-cell v-align-middle">
                    <div class="d-flex justify-space-between align-center">
                      <span>Rp</span>
                      <span v-if="!showJasa"
                        >{{ rupiah(detailinvoice.subtotal) }}
                      </span>
                      <span v-else
                        >{{
                          rupiah(
                            detailinvoice.subtotal_pekerjaan +
                              detailinvoice.subtotal_item_tambahan,
                          )
                        }}
                      </span>
                    </div>

                    <!-- v-if="detailinvoice.items?.[0]?.status_item === true" -->
                    <!-- <template
                      v-else
                      v-for="item in detailinvoice.item_tambahan"
                      :key="item.id"
                    >
                      <div class="d-flex justify-space-between align-center">
                        <span>Rp</span>
                        <span>{{ rupiah(item.nominal_tambahan) }}</span>
                      </div>
                    </template> -->
                  </td>
                </tr>
                <v-chip
                  :prepend-icon="
                    showJasa ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                  "
                  size="x-small"
                  class="no-print my-1"
                  @click="showJasa = !showJasa"
                >
                  {{
                    showJasa
                      ? "Sembunyikan Item Tambahan"
                      : "Tampilkan Item Tambahan"
                  }}
                </v-chip>
                <template
                  v-if="
                     showJasa
                  "
                  v-for="item in detailinvoice.item_tambahan"
                  :key="item.id"
                >
                  <tr v-if="item.status_item_tambahan === true">
                    <td class="text-center">{{ item.keterangan_penawaran }}</td>
                    <td colspan="2" class="amount-cell">
                      <div class="d-flex justify-space-between">
                        <span>Rp</span>
                        <span>{{ rupiah(item.nominal_tambahan) }}</span>
                      </div>
                    </td>
                  </tr>
                </template>

                <tr>
                  <td
                    rowspan="4"
                    class="remark-cell"
                    v-if="detailinvoice.handle_by_aresa == 'KAM'"
                  >
                    <div class="remark-border-box">
                      <strong>REMARK :</strong>
                      <ul class="remark-list-style">
                        <li>
                          <strong
                            >Pembayaran dapat di Transfer melalui Bank
                            BCA.</strong
                          >
                        </li>
                        <li>
                          <strong>
                            Harap konfirmasi kembali apabila sudah melakukan
                            pembayaran.
                          </strong>
                        </li>
                      </ul>
                    </div>
                  </td>
                  <td
                    class="footer-label"
                    v-if="detailinvoice.handle_by_aresa == 'KAM'"
                  >
                    <strong>SUB TOTAL</strong>
                  </td>
                  <td
                    class="footer-value"
                    v-if="detailinvoice.handle_by_aresa == 'KAM'"
                  >
                    <div class="d-flex justify-space-between">
                      <span>Rp</span
                      ><span>{{ rupiah(detailinvoice.subtotal) }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-if="detailinvoice.handle_by_aresa == 'KAM'">
                  <td class="footer-label"><strong>PPn 11%</strong></td>
                  <td class="footer-value">
                    <div class="d-flex justify-space-between">
                      <span>Rp</span
                      ><span>{{ rupiah(detailinvoice.ppn!) }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-if="detailinvoice.handle_by_aresa == 'KAM'">
                  <td class="footer-label"><strong>PPh 2%</strong></td>
                  <td class="footer-value">
                    <div class="d-flex justify-space-between italic-text">
                      <span>Rp</span
                      ><span>{{ rupiah(detailinvoice.pph!) }}</span>
                    </div>
                  </td>
                </tr>
                <tr class="bg-blue-total">
                  <td class="footer-label">
                    <strong>TOTAL</strong>
                  </td>
                  <td class="footer-value">
                    <div class="d-flex justify-space-between font-weight-bold">
                      <span>Rp</span
                      ><span>{{ rupiah(detailinvoice.grandtotal!) }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="terbilang-strip">
              <strong
                >Terbilang : #{{
                  jadirupiah(detailinvoice.grandtotal!) || "-"
                }}
                Rupiah #</strong
              >
            </div>

            <div v-if="detailinvoice.handle_by_aresa == 'ABK'">
              <strong class="d-block mb-1">NOTED :</strong>
              <ul style="font-size: 13px; font-weight: bold; margin-left: 10px">
                <li>Pembayaran dapat di Transfer melalui Bank Permata.</li>
                <li>
                  Harap konfirmasi kembali apabila sudah melakukan pembayaran.
                </li>
              </ul>
            </div>

            <div class="d-flex justify-space-between mt-6">
              <div class="d-flex justify-space-between">
                <div class="bank-details">
                  <div v-if="detailinvoice.handle_by_aresa == 'KAM'">
                    <strong class="d-block mb-1"
                      >BCA BANK ( RUPIAH/IDR )</strong
                    >
                    <table class="bank-table">
                      <tbody>
                        <tr>
                          <td>Cabang</td>
                          <td>:</td>
                          <td>Arkadia</td>
                        </tr>
                        <tr>
                          <td>ACC NO</td>
                          <td>:</td>
                          <td>540 5142 888</td>
                        </tr>
                        <tr>
                          <td>AN</td>
                          <td>:</td>
                          <td>PT. KARYA ARESA MANDIRI</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div v-else>
                    <strong class="d-block mb-1"
                      >Please Remit Payment By Cheque / Transfer To :</strong
                    >
                    <table class="bank-table">
                      <tbody>
                        <tr>
                          <td style="width: 100px">Acc Name</td>
                          <td>:</td>
                          <td>Abdul Khalid</td>
                        </tr>
                        <tr>
                          <td style="width: 100px">Bank Name</td>
                          <td>:</td>
                          <td>Bank Permata</td>
                        </tr>
                        <tr>
                          <td style="width: 100px">Acc Number</td>
                          <td>:</td>
                          <td>4121 5181 50</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="text-center signature-area">
                Hormat Kami,<br /><br /><br /><br /><br /><br />
                <strong>( Abdul Khalid )</strong>
              </div>
            </div>
          </v-card>
        </div>
      </div>

      <div
        class="text-center mt-4"
        v-if="
          detailinvoice.status != 'Diterima' &&
          detailinvoice.status != 'Selesai'
        "
      >
        <v-btn
          prepend-icon="mdi-printer"
          color="indigo"
          variant="elevated"
          @click="printInvoice"
        >
          Print Invoice
        </v-btn>
      </div>
    </div>
  </div>

  <kwitansi
    v-if="
      activeTab === 'kwitansi' &&
      detailinvoice &&
      detailinvoice.status != 'Diterima' &&
      detailinvoice.status != 'Selesai'
    "
    :datainv="detailinvoice"
  />

  <tanda-terima
    v-if="
      activeTab === 'tanda-terima' &&
      detailinvoice &&
      detailinvoice.status != 'Diterima' &&
      detailinvoice.status != 'Selesai'
    "
    :datainv="detailinvoice"
  />

  <tanda-terima-sertifikasi-disnaker
    v-if="
      activeTab === 'tanda-terima-sertifikasi-disnaker' &&
      detailinvoice &&
      detailinvoice.status != 'Diterima'
    "
    :datainv="detailinvoice"
  />
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { ref } from "vue";
import { useMasterDokumenStore } from "~/stores/master/dokumenStore";
import type { invoiceM } from "~/types/InvoiceModel";
import type { listitemtambahanPenawaranM } from "~/types/penawaranModel";

// Definisikan variabel activeTab di sini
const activeTab = ref("invoice");
definePageMeta({
  layout: "admin",
});

const showPeriode = ref(true);
const showJasa = ref(true);
const showPt = ref(true);
const invoicestore = useInvoiceStore();
const route = useRoute();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);
const masterdokumenstore = useMasterDokumenStore();
const pictureStore = usePictureStore();
const uploadstore = uploadStore();

onMounted(async () => {
  const id = route.params.id;
  await invoicestore.tarikDetailInvoiceAct(_.toString(id));
  await invoicestore.tarikdatarevisiinvoice(_.toString(id));
});

const detailinvoice = computed(() => {
  return invoicestore.getDetailInvoice;
});

const formatinvDate = (tanggal: string) => {
  if (!tanggal) return "";

  const [tahun, bulan, hari] = tanggal.split("-");
  return `${hari}-${bulan}-${tahun}`;
};

watch(
  () => detailinvoice.value?.items,
  (items) => {
    if (!items || items.length === 0) return;

    const selected: string[] = [];
    const selectedTax: string[] = [];

    items.forEach((item: any, index: number) => {
      const key = `${item.id}-${index}`;

      if (item.status_item === true) {
        selected.push(key);
      }

      if (item.kena_ppn === true || item.kena_pph === true) {
        selectedTax.push(key);
      }
    });

    selectedItems.value = selected;
    selectedPpnItems.value = selectedTax;
    selectedPpnPphItems.value = selectedTax;
  },
  { immediate: true },
);

watch(
  () => detailinvoice.value?.item_tambahan,
  (items) => {
    if (!items || items.length === 0) return;

    const selected: string[] = [];
    const selectedTax: string[] = [];

    items.forEach((item: any, index: number) => {
      const key = `${item.id}-${index}`;

      // ✅ checklist utama
      if (item.status_item_tambahan === true) {
        selected.push(key);
      }

      // ✅ checklist pajak
      if (item.kena_ppn === true || item.kena_pph === true) {
        selectedTax.push(key);
      }
    });

    selectedItemTambahan.value = selected;
    selectedTaxItemTambahan.value = selectedTax;
  },
  { immediate: true },
);

const subtotal = computed(() => {
  const subtotalItems = (detailinvoice.value.items || [])
    .filter((item: any, index: number) =>
      selectedItems.value.includes(`${item.id}-${index}`),
    )
    .reduce(
      (sum: number, item: any) =>
        sum + getHarga(item) * Number(item.jumlahUnit),
      0,
    );

  const tambahan = (detailinvoice.value.item_tambahan || [])
    .filter((item: any, index: number) =>
      selectedItemTambahan.value.includes(`${item.id}-${index}`),
    )
    .reduce(
      (sum: number, item: any) => sum + Number(item.nominal_tambahan || 0),
      0,
    );

  return subtotalItems + tambahan;
});

const subtotal_pekerjaan = computed(() => {
  const subtotalItems = (detailinvoice.value.items || [])
    .filter((item: any, index: number) =>
      selectedItems.value.includes(`${item.id}-${index}`),
    )
    .reduce(
      (sum: number, item: any) =>
        sum + getHarga(item) * Number(item.jumlahUnit),
      0,
    );

  return subtotalItems;
});

// const subtotal_pekerjaan = computed(() => {
//   const subtotalItems = (detailinvoice.value.items || []).reduce(
//     (sum: number, item: any) => sum + Number(item.subtotal),
//     0,
//   );

//   return subtotalItems;
// });

const dasarPajakItems = computed(() => {
  return detailinvoice.value.items
    .filter((item: any) => item.kena_pajak)
    .reduce(
      (sum: number, item: any) => sum + item.nominal * item.jumlahUnit,
      0,
    );
});

const dasarNominalItemTamabahan = computed(() => {
  return (detailinvoice.value.item_tambahan || []).reduce(
    (sum: number, item: any) => sum + Number(item.nominal_tambahan),
    0,
  );
});

// const dasarPajakItemTambahan = computed(() => {
//   return (detailinvoice.value.item_tambahan || [])
//     .filter((item: any) => item.status_item_tambahan && item.kena_ppn)
//     .reduce((sum: number, item: any) => sum + Number(item.nominal_tambahan), 0);
// });

// const dasarPajakTotal = computed(() => {
//   return dasarPajakItems.value + dasarPajakItemTambahan.value;
// });

const newlisitemtambahan = ref<listitemtambahanPenawaranM>({
  keterangan_penawaran: "",
  nominal_tambahan: 0,
  kena_ppn: false,
  kena_pph: false,
  ppn_tambahan: 0,
  pph_tambahan: 0,
  status_item_tambahan: false,
});

function additemtambahan() {
  if (newlisitemtambahan.value.keterangan_penawaran.trim() === "") {
    return notificationStore.showError("Keterangan tambahan wajib diisi");
  }
  if (newlisitemtambahan.value.nominal_tambahan <= 0) {
    return notificationStore.showError("Nominal tambahan harus lebih dari 0");
  }
  detailinvoice.value.item_tambahan.push(newlisitemtambahan.value);
  newlisitemtambahan.value = {
    keterangan_penawaran: "",
    nominal_tambahan: 0,
    kena_ppn: false,
    kena_pph: false,
    ppn_tambahan: 0,
    pph_tambahan: 0,
    status_item_tambahan: false,
  };
}

function deleteitemtambahan(index: number) {
  _.pullAt(detailinvoice.value.item_tambahan, index);
}

function handlePajakItem(item: any) {
  if (item.kena_pajak) {
    item.kena_ppn = true;
    item.kena_pph = true;
  } else {
    item.kena_ppn = false;
    item.kena_pph = false;
  }
}

function handleStatusTambahan(item: any, val: boolean) {
  if (!val) {
    item.kena_pph = false;
    item.kena_ppn = false;
  }
}

function handlePpnItemTambahan(item: any, val: boolean) {
  item.kena_ppn = val;
  item.kena_pph = val;
}

const ppn = computed(() => dasarPajakTotal.value * 0.11);
const pph = computed(() => dasarPajakTotal.value * 0.02);
const grandtotal = computed(() => {
  return subtotal.value + ppn.value - pph.value;
});
const data = reactive({
  dialogkirim: false,
  dialogrevisi: false,
  documents_terkirim: [] as string[],
  activeTab: "invoice",

  dialogpemberkasan: false,
  new_pemberkasan: {
    id_dokumen: "",
    nama_dokumen: "",
    file_dokumen: "",
    no_dokumen: "",
    id_kategori_item: "",
    nama_kategori_item: "",
    periode_mulai: "",
    periode_selesai: "",
    status_dokumen: "Asli",
  },

  new_kodebayar: {
    kode_bayar: "",
    file_kode_bayar: "",
  },

  headerberkas: [
    { title: "No", value: "no" },
    { title: "Nama Kategori Item", value: "nama_kategori_item" },
    { title: "Jenis Dokumen", value: "nama_dokumen" },
    { title: "No Dokumen", value: "no_dokumen" },
    { title: "File Dokumen", value: "file_dokumen" },
    { title: "Aksi", value: "aksi" },
  ],

  headerkodebayar: [
    { title: "No.", value: "no" },
    { title: "Kode Bayar", value: "kode_bayar" },
    { title: "File Dokumen", value: "file_kode_bayar" },
    { title: "Aksi", value: "aksi" },
  ],
});

watch(
  () => data.new_pemberkasan.id_dokumen,

  (idDokumen) => {
    const dataDokumen = masterdokumenstore.getDataDokumen;

    const b = _.find(dataDokumen, (o: any) => o.id == idDokumen);
    // console.logb, 'si b')
    if (!_.isUndefined(b)) {
      data.new_pemberkasan.nama_dokumen = b!.nama_dokumen;
    }
  },
);

watch(
  () => data.new_pemberkasan.id_kategori_item,
  (id) => {
    const b = _.find(
      detailinvoice.value.items,
      (o: any) => o.id_kategori_item === id,
    );
    if (!_.isUndefined(b)) {
      data.new_pemberkasan.nama_kategori_item = b!.nama_kategori_item;
      // ensure we always assign a string (fallback to empty string if undefined)
      data.new_pemberkasan.periode_mulai = b!.periode_penawaran?.mulai ?? "-";
      data.new_pemberkasan.periode_selesai =
        b!.periode_penawaran?.selesai ?? "-";
    }
  },
);

function adddocpemberkasan() {
  data.new_pemberkasan.file_dokumen = uploadstore.getUrlRef;
  if (data.new_pemberkasan.id_kategori_item == "") {
    return notificationStore.showError("pilih kategori item terlebih dahulu");
  }
  if (data.new_pemberkasan.id_dokumen == "") {
    return notificationStore.showError("pilih jenis dokumen terlebih dahulu");
  }
  if (data.new_pemberkasan.no_dokumen == "") {
    return notificationStore.showError("input no dokumen terlebih dahulu");
  }
  if (data.new_pemberkasan.file_dokumen == "") {
    return notificationStore.showError("upload dokumen berkas terlebih dahulu");
  }
  detailinvoice.value.berkas.push(data.new_pemberkasan);
  data.new_pemberkasan = {
    id_dokumen: "",
    nama_dokumen: "",
    file_dokumen: "",
    no_dokumen: "",
    id_kategori_item: "",
    nama_kategori_item: "",
    periode_mulai: "",
    periode_selesai: "",
    status_dokumen: "Asli",
  };
  uploadstore.setReset();
}

function deletedocpemberkasan(index: number) {
  _.pullAt(detailinvoice.value.berkas, index);
}

async function addkodebayar() {
  data.new_kodebayar.file_kode_bayar = uploadstore.getUrlRef2;
  if (data.new_kodebayar.kode_bayar == "") {
    return notificationStore.showError("Kode Bayar tidak boleh kosong");
  }
  if (data.new_kodebayar.file_kode_bayar == "") {
    return notificationStore.showError(
      "Doc wajib diisi untuk menambahkan ke list",
    );
  }

  detailinvoice.value.item_kode_bayar.push(data.new_kodebayar);
  data.new_kodebayar = {
    kode_bayar: "",
    file_kode_bayar: "",
  };
  uploadstore.setReset2();
}

async function deletekodebayar(index: number) {
  _.pullAt(detailinvoice.value.item_kode_bayar, index);
}

function opendialogpemberkasan() {
  data.dialogpemberkasan = true;
}

async function addberkas() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi simpan Berkas",
    "Anda yakin ingin menyimpan berkas untuk penawaran ini?",
  );
  if (!confirmed) {
    return notificationStore.showError("Pemberkasan dibatalkan");
  }

  useloadingStore().setLoading(true);
  const dataset = detailinvoice.value;
  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;

  const c = await uploadPemberkasanPenawaran(dataset);
  if (c == "ok") {
    notificationStore.showSuccess("Pemberkasan berhasil disimpan");
    data.dialogpemberkasan = false;
  } else {
    notificationStore.showError("Pemberkasan Gagal disimpan");
  }
  useloadingStore().setLoading(false);
}

//
const printArea = ref<HTMLElement | null>(null);

function printInvoice() {
  const content = printArea.value;
  if (!content) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const styles = Array.from(
    document.querySelectorAll('style, link[rel="stylesheet"]'),
  )
    .map((style) => style.outerHTML)
    .join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>INV - ${detailinvoice.value?.no_inv} ${detailinvoice.value?.perihal_invoice}</title>
        ${styles}
        <style>
          body { background: white !important; margin: 0; padding: 0; }
          .invoice-paper { border: none !important; box-shadow: none !important; width: 100% !important; max-width: 100% !important; }
          @page { margin: 0.5cm; }
        </style>
      </head>
      <body>
        ${content.innerHTML}
        <script>
          window.onload = () => {
            window.print();
            window.close();
          };
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// Logika Bisnis Anda (Tetap Utuh)
async function disetujui() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Setujui Invoice",
    "Anda yakin ingin menyetujui Invoice ini?",
  );
  if (!confirmed) return notificationStore.showError("Tindakan dibatalkan");
  useloadingStore().setLoading(true);
  const dataset = detailinvoice.value;
  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;
  dataset.disetujuiAt = moment().unix();
  dataset.disetujuiBy = useUserStore().getEmail;
  dataset.status = "Disetujui";
  const c = await updateinvoice(dataset);
  if (c == "ok")
    notificationStore.showSuccess("Data Invoice Berhasil Disetujui");
  else notificationStore.showError("Data Invoice Gagal Disetujui");
  useloadingStore().setLoading(false);
}

async function ditolak() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Ditolak",
    "Anda yakin ingin menolak invoice ini?",
  );
  if (!confirmed) return notificationStore.showError("Invoice batal ditolak");
  useloadingStore().setLoading(true);
  const dataset = detailinvoice.value;
  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;
  dataset.ditolakAt = moment().unix();
  dataset.ditolakBy = useUserStore().getEmail;
  dataset.status = "Ditolak";
  const c = await updateinvoice(dataset);
  if (c == "ok") notificationStore.showSuccess("Invoice Berhasil ditolak");
  else notificationStore.showError("Invoice Gagal ditolak");
  useloadingStore().setLoading(false);
}

async function dikirim() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Upload Invoice & Kwitansi",
    "Anda yakin ingin Upload Invoice & Kwitansi ini?",
  );
  if (!confirmed) return notificationStore.showError("Invoice dibatalkan");
  useloadingStore().setLoading(true);
  const dataset = detailinvoice.value;
  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;
  dataset.dikirimAt = moment().unix();
  dataset.dikirimBy = useUserStore().getEmail;
  dataset.status = "Dikirim";
  dataset.invoice_terkirim = uploadstore.getUrlRef;
  dataset.kwitansi_terkirim = uploadstore.getUrlRef2;
  const c = await updateinvoice(dataset);
  if (c == "ok") notificationStore.showSuccess("Data Invoice Berhasil Diubah");
  else notificationStore.showError("Data Invoice Gagal Diubah");
  useloadingStore().setLoading(false);
  uploadstore.setReset();
  pictureStore.reset();
  data.documents_terkirim = [];
  data.dialogkirim = false;
  navigateTo("/admin/invoice/dikirim");
}

async function selesai() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Selesai",
    "Anda yakin ingin menyelesaikan invoice ini?",
  );
  if (!confirmed)
    return notificationStore.showError("Konfirmasi Selesai dibatalkan");
  useloadingStore().setLoading(true);
  const dataset = detailinvoice.value;
  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;
  dataset.selesaiAt = moment().unix();
  dataset.selesaiBy = useUserStore().getEmail;
  dataset.status = "Selesai";
  const c = await updateinvoiceselesai(dataset);
  if (c == "ok") notificationStore.showSuccess("Invoice Telah Selesai");
  else notificationStore.showError("Konfirmasi Selesai Gagal");
  useloadingStore().setLoading(false);
}

function getFileName(url: string) {
  try {
    const decoded = decodeURIComponent(url);
    return decoded.split("/").pop()?.split("?")[0] || "file";
  } catch {
    return "file";
  }
}

const addpic = () => {
  if (uploadstore.getUrlRef == "") {
    return notificationStore.showError("Foto tidak boleh kosong");
  }
  data.documents_terkirim.push(uploadstore.getUrlRef);
  pictureStore.pushPic(uploadstore.getUrlRef);
  uploadstore.setReset();
};

function opendialogkirim() {
  data.dialogkirim = true;
}

function opendialogrevisi() {
  detailinvoice.value.items = detailinvoice.value.items.map(
    (item: any, index: number) => {
      return {
        ...item,
        isEdit: false,
      };
    },
  );
  data.dialogrevisi = true;
}

async function setterimainv() {
  if (data.documents_terkirim.length == 0) {
    return notificationStore.showError("upload file terlebih dahulu");
  }
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Terima",
    "Anda yakin ingin terima invoice ini?",
  );
  if (!confirmed)
    return notificationStore.showError("Terima invoice dibatalkan");
  useloadingStore().setLoading(true);
  const dataset = detailinvoice.value;
  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;
  dataset.diterimaAt = moment().unix();
  dataset.diterimaBy = useUserStore().getEmail;
  dataset.status = "Diterima";
  // dataset.terima_invoice_kwitansi = data.documents_terkirim;

  const c = await updateinvoice(dataset);
  if (c == "ok") notificationStore.showSuccess("Data Invoice Berhasil Diubah");
  else notificationStore.showError("Data Invoice Gagal Diubah");
  useloadingStore().setLoading(false);
  uploadstore.setReset();
  pictureStore.reset();
  data.documents_terkirim = [];
  data.dialogkirim = false;
}

async function saverevisiinvoice() {
  const dataset = detailinvoice.value;
  dataset.updatedAt = moment().unix();
  dataset.updatedBy = useUserStore().getEmail;

  dataset.items = dataset.items.map((item: any, index: number) => {
    const key = `${item.id}-${index}`;
    return {
      ...item,
      jumlahUnit: Number(item.jumlahUnit),
      kena_ppn: selectedPpnItems.value.includes(key),
      kena_pph: selectedPpnItems.value.includes(key),
    };
  });

  dataset.item_tambahan = dataset.item_tambahan.map(
    (item: any, index: number) => {
      const key = `${item.id}-${index}`;

      const isSelected = selectedItemTambahan.value.includes(key);
      const isTax = isSelected && selectedTaxItemTambahan.value.includes(key);

      const nominal = Number(item.nominal_tambahan || 0);

      return {
        ...item,
        status_item_tambahan: isSelected,
        kena_ppn: isTax,
        kena_pph: isTax,
        ppn_tambahan: isTax ? nominal * 0.11 : 0,
        pph_tambahan: isTax ? nominal * 0.02 : 0,
      };
    },
  );

  dataset.subtotal = subtotal.value;
  dataset.subtotal_pekerjaan = subtotal_pekerjaan.value;
  dataset.ppn = ppn.value;
  dataset.pph = pph.value;
  dataset.grandtotal = grandtotal.value;
  console.log("dataset revisi", dataset);
  const c = await setrevisiinvoice(dataset);
  if (c == "ok") {
    await invoicestore.tarikDetailInvoiceAct(_.toString(route.params.id));
    await invoicestore.tarikdatarevisiinvoice(_.toString(route.params.id));
    notificationStore.showSuccess("Data Penawaran Berhasil Di Revisi");
  } else {
    notificationStore.showError("Data Penawaran Gagal Di Revisi");
  }
  const id = route.params.id;
  await invoicestore.tarikDetailInvoiceAct(_.toString(id));
  data.dialogrevisi = false;
}

async function saverevisitoinvoice(item: invoiceM) {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Invoice",
    "Anda yakin ingin menggunakan Invoice ini?",
  );
  if (!confirmed) return notificationStore.showError("Revisi dibatalkan");
  const loading = useloadingStore();
  loading.setLoading(true);
  try {
    const result = await setrevisitoinvoice(item, detailinvoice.value);
    console.log("HASILREVISI", result);
    console.log("DATARIVISI", item);
    if (result === "ok") {
      notificationStore.showSuccess("Invoice berhasil Diterapkan");
    } else {
      notificationStore.showError(result || "Invoice Gagal Diterapkan");
    }
  } catch (error) {
    console.error(error);
    notificationStore.showError("Terjadi kesalahan sistem");
  } finally {
    loading.setLoading(false);
  }
}

const selectedPpnPphItems = ref<string[]>([]);
const selectedTaxItemTambahan = ref<string[]>([]);
const selectedItemTambahan = ref<string[]>([]);
const selectedItems = ref<string[]>([]);
const selectedPpnItems = ref<string[]>([]);

const handleItemTambahanChange = (key: string) => {
  if (!selectedItemTambahan.value.includes(key)) {
    selectedTaxItemTambahan.value = selectedTaxItemTambahan.value.filter(
      (k) => k !== key,
    );
  }
};

const isKAM = computed(() => {
  return detailinvoice.value?.handle_by_aresa === "KAM";
});

const isABK = computed(() => {
  return detailinvoice.value?.handle_by_aresa != "KAM";
});
const handleSelectItem = (item: any, index: number) => {
  const key = `${item.id}-${index}`;

  if (selectedPpnPphItems.value.includes(key)) {
    // jika dicentang → pastikan masuk
    if (!selectedPpnPphItems.value.includes(key)) {
      selectedPpnPphItems.value.push(key);
    }
  } else {
    // jika dilepas → hapus
    selectedPpnPphItems.value = selectedPpnPphItems.value.filter(
      (i) => i !== key,
    );
  }
};

watch(
  selectedPpnItems,
  (val) => {
    selectedPpnPphItems.value = [...val];
  },
  { deep: true },
);

const isAllSelected = computed(() => {
  const total = detailinvoice.value.items.length;
  return selectedItems.value.length === total;
});

const isIndeterminate = computed(() => {
  const total = detailinvoice.value.items.length;
  return selectedItems.value.length > 0 && selectedItems.value.length < total;
});

const toggleAllItems = () => {
  if (isAllSelected.value) {
    // reset semua
    selectedItems.value = [];
    selectedPpnItems.value = [];
    selectedPpnPphItems.value = [];
  } else {
    const allKeys = detailinvoice.value.items.map(
      (item: any, index: number) => `${item.id}-${index}`,
    );

    // ✅ hanya pilih item
    selectedItems.value = [...allKeys];

    // ❌ JANGAN auto pajak
    selectedPpnItems.value = [];
    selectedPpnPphItems.value = [];
  }
};

const selectedTaxDetailItems = computed(() => {
  return detailinvoice.value.items.filter((item: any, index: number) =>
    selectedPpnPphItems.value.includes(`${item.id}-${index}`),
  );
});

const selectedTaxDetailItemTambahan = computed(() => {
  return (detailinvoice.value.item_tambahan || []).filter(
    (item: any, index: number) =>
      selectedTaxItemTambahan.value.includes(`${item.id}-${index}`),
  );
});

const dasarPajakItemTambahan = computed(() => {
  return selectedTaxDetailItemTambahan.value.reduce(
    (sum, item) => sum + Number(item.nominal_tambahan || 0),
    0,
  );
});

const dasarPajak = computed(() => {
  return selectedTaxDetailItems.value.reduce((sum, item) => {
    return sum + getHarga(item) * item.jumlahUnit;
  }, 0);
});

const dasarPajakTotal = computed(
  () => dasarPajak.value + dasarPajakItemTambahan.value,
);

function isNominalSame(item: any) {
  return (
    item.nominal_edit !== null &&
    item.nominal_edit !== undefined &&
    item.nominal_edit !== "" &&
    Number(item.nominal_edit) === Number(item.nominal)
  );
}

const getHarga = (item: any) => {
  if (
    item.nominal_edit !== null &&
    item.nominal_edit !== undefined &&
    item.nominal_edit !== "" &&
    item.nominal_edit !== 0 // 🔥 TAMBAHAN PENTING
  ) {
    return Number(item.nominal_edit);
  }
  return Number(item.nominal);
};

function additemtambahanlainya() {
  const item = newlisitemtambahan.value;

  if (!item.keterangan_penawaran || item.keterangan_penawaran.trim() === "") {
    return notificationStore.showError(
      "Keterangan tambahan tidak boleh kosong",
    );
  }

  if (!item.nominal_tambahan || item.nominal_tambahan <= 0) {
    return notificationStore.showError("Nominal tidak boleh 0");
  }

  detailinvoice.value.item_tambahan.push({
    ...item,
    nominal_tambahan: Number(item.nominal_tambahan),
  });
  newlisitemtambahan.value = {
    keterangan_penawaran: "",
    nominal_tambahan: 0,
    kena_ppn: false,
    kena_pph: false,
    ppn_tambahan: 0,
    pph_tambahan: 0,
    status_item_tambahan: false,
  };
}
function deleteitemtambahanlainya(index: number) {
  _.pullAt(detailinvoice.value.item_tambahan, index);
}

const startEdit = (item) => {
  item.nominal_edit = item.nominal;
  item.isEdit = true;
};

const saveEdit = (item) => {
  item.nominal = item.nominal_edit;
  item.isEdit = false;
};

const cancelEdit = (item) => {
  item.nominal_edit = item.nominal; // reset
  item.isEdit = false;
};
</script>

<style scoped>
.invoice-paper {
  font-family: "Arial", sans-serif;
  color: #000;
  line-height: 1.3;
}

.invoice-title {
  font-size: 32px;
  font-weight: bold;
  border-bottom: none;
}
.company-address {
  font-size: 13px;
  margin-top: 5px;
}

.info-grid {
  display: flex;
  border: 2px solid #000;
}
.info-box-left,
.info-box-right {
  padding: 10px;
  font-size: 14px;
  width: 50%;
}
.info-box-right {
  border-left: 2px solid #000;
}

.main-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}
.main-table th {
  background-color: #b8cce4 !important;
  border: 2px solid #000;
  padding: 8px;
  font-weight: bold;
}
.main-table td {
  border: 2px solid #000;
  padding: 6px;
  font-size: 14px;
}

.bg-light-blue {
  background-color: #b8cce4 !important;
}
.remark-box {
  vertical-align: top;
  font-size: 12px;
}
.amount-cell {
  padding-left: 10px !important;
  padding-right: 10px !important;
}

@media print {
  .no-print {
    display: none !important;
  }
}

.terbilang-strip {
  border-top: 2px solid #000;
  border-bottom: 2px solid #000;
  padding: 5px 10px;
  margin: 15px 0;
  font-style: italic;
  font-size: 14px;
}

.bank-details,
.signature-area {
  font-size: 14px;
}
.bank-table {
  border-collapse: collapse;
  font-size: 14px;
}

.bank-table td {
  border: none !important; /* Menghilangkan border dari style main-table jika terbawa */
  padding: 0px 4px 0px 0px !important;
  vertical-align: top;
  line-height: 1.4;
}

/* Mengatur lebar kolom label agar titik dua sejajar sempurna */
.bank-table td:first-child {
  width: 70px;
  font-weight: bold;
}

/* Memastikan teks "BCA BANK" ada jarak sedikit dengan tabel di bawahnya */
.d-block {
  display: block;
}
@media print {
  .bg-light-blue,
  th {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

.main-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

.main-table th,
.main-table td {
  border: 1px solid #000;
  padding: 6px;
  font-size: 14px;
}

.main-table th {
  background-color: #b8cce4 !important;
  font-weight: bold;
  border: 2px solid #000;
}

.desc-cell {
  padding: 15px !important;
}

.amount-cell {
  vertical-align: top;
  width: 35%;
}

.remark-cell {
  width: 65%;
  vertical-align: middle;
  padding: 8px !important;
}

.remark-border-box {
  border: 1px solid #000;
  padding: 8px;
  min-height: 80px;
  height: 100px;
}

.remark-list-style {
  list-style: none;
  padding-left: 0;
  margin: 5px 0 0 0;
  font-size: 12px;
}

.remark-list-style li::before {
  content: "* ";
  font-weight: bold;
}

.footer-label {
  width: 15%;
  text-align: right;
  padding-right: 10px !important;
  white-space: nowrap;
}

.footer-value {
  width: 20%;
}

.bg-blue-total {
  background-color: #b8cce4 !important;
}

.d-flex {
  display: flex;
}
.justify-space-between {
  justify-content: space-between;
}
.text-center {
  text-align: center;
}
.font-weight-bold {
  font-weight: bold;
}
.italic-text {
  font-style: italic;
}
.v-align-top {
  vertical-align: top;
}

@media print {
  .bg-blue-total,
  .main-table th {
    background-color: #b8cce4 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

.align-center {
  align-items: center;
}

.v-align-middle {
  vertical-align: middle !important;
}

.invoice-status-row .v-col {
  padding-top: 6px;
  padding-bottom: 6px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e8e8e8;
}

.icon-box {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #f4f6f8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box i {
  color: #555;
}

.info-label {
  font-size: 11px;
  color: #8a8a8a;
}

.info-value {
  font-size: 13px;
  font-weight: 600;
  color: #2c2c2c;
}

.custom-toggle {
  background-color: white !important;
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.custom-toggle .v-btn {
  text-transform: none !important; /* Menghilangkan Uppercase otomatis */
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 0 20px !important;
  transition: all 0.3s ease;
}

/* Memberikan efek hover */
.custom-toggle .v-btn:hover {
  background-color: #f5f5f5;
}

/* Styling khusus untuk button yang aktif */
.v-btn--active {
  background-color: #265ffc !important; /* Indigo Darken 4 */
  color: white !important;
}

.info-card {
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  .v-btn {
    opacity: 0.6;
    transition: 0.2s;

    &:hover {
      opacity: 1;
    }
  }
}

.btn-selesai {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  letter-spacing: 0.5px;
  height: 52px;
  transition: all 0.25s ease;

  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(34, 197, 94, 0.35);
    filter: brightness(1.05);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4px 10px rgba(34, 197, 94, 0.2);
  }
}
</style>
