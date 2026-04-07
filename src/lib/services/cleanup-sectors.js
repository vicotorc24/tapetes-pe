import { collection, getDocs, updateDoc, doc, deleteField } from 'firebase/firestore';
import { db } from '../firebase';

export const cleanupSectorIds = async () => {
  const sectorsRef = collection(db, 'sectors');
  const snapshot = await getDocs(sectorsRef);
  
  console.log(`=== INICIANDO LIMPIEZA DE ${snapshot.size} SECTORES ===`);
  
  for (const sDoc of snapshot.docs) {
    const data = sDoc.data();
    if (data.id) {
      console.log(`Limpiando ID interno "${data.id}" del sector "${data.name}" (ID Real: ${sDoc.id})...`);
      await updateDoc(doc(db, 'sectors', sDoc.id), {
        id: deleteField()
      });
    }
  }
  
  console.log("=== LIMPIEZA COMPLETADA ===");
  return true;
};
