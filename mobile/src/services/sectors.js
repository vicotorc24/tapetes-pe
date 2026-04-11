import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION_NAME = 'sectors';

/**
 * Obtiene todos los sectores productivos (Rubros)
 */
export const getSectors = async () => {
  try {
    const sectorsRef = collection(db, COLLECTION_NAME);
    const q = query(sectorsRef, orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
  } catch (error) {
    console.error("[ERROR] Fallo al cargar sectores:", error);
    return [];
  }
};
