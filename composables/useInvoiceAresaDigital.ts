import { useFirestore } from "vuefire";
import { doc, runTransaction } from "firebase/firestore";
import type { invoiceAresaDigitalM } from "~/types/invoiceAresaDigitalModel";
import moment from "moment";
import { getAuth } from "firebase/auth";
import _ from "lodash";


export const createInvoiceAresaDigital = async (data: invoiceAresaDigitalM) => {
  const db = useFirestore();
  const auth = getAuth();
  const now = moment().unix();
  const email = auth.currentUser?.email ?? "system";

  return await runTransaction(db, async (transaction) => {
    const nomorInvRef = doc(db, "penomoran", "nomor");
    const getnomor = await transaction.get(nomorInvRef);

    if (!getnomor.exists()) {
      throw new Error("Dokumen penomoran/nomor tidak ditemukan");
    }

    const datanomor = getnomor.data();
    const newnumber = datanomor!.no_inv + 1;
    const stringnewnumber = _.toString(newnumber).padStart(5, "0");
    const no_inv_aresa = `${stringnewnumber}`;
    const id_invoice_aresa = `${stringnewnumber}`;
    const setdata: invoiceAresaDigitalM = {
      ...data,
      no_inv_aresa,
      id_invoice_aresa,
      createdAt: now,
      createdBy: email,
    };

    //Ref dokumen utama laporan
    const laporanRef = doc(db, "invoice_aresa_digital", id_invoice_aresa);
    // Simpan dokumen utama laporan
    transaction.set(laporanRef, setdata, { merge: true });
    transaction.update(nomorInvRef, { no_inv: newnumber });

    return { ...setdata, id: id_invoice_aresa };
  });
};
