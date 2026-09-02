import { useFirestore } from "vuefire";
import { doc, runTransaction } from "firebase/firestore";
import type { invoiceM } from "~/types/invoice";
import moment from "moment";
import { getAuth } from "firebase/auth";
import _ from "lodash";


export const createInvoice = async (data: invoiceM) => {
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
    const no_inv = `${stringnewnumber}`;
    const id_invoice = `${stringnewnumber}`;
    const setdata: invoiceM = {
      ...data,
      no_inv,
      id_invoice,
      createdAt: now,
      createdBy: email,
    };

    //Ref dokumen utama laporan
    const beritaAcaraRef = doc(db, "invoice", id_invoice);
    // Simpan dokumen utama laporan
    transaction.set(beritaAcaraRef, setdata, { merge: true });
    transaction.update(nomorInvRef, { no_inv: newnumber });

    return { ...setdata, id: id_invoice };
  });
};
