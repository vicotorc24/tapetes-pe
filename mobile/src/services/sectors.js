import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION_NAME = 'sectors';

export const getSectors = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (error) {
    console.error("[ERROR] Fallo al cargar sectores:", error);
    return [];
  }
};
