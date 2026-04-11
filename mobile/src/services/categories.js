import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION_NAME = 'categories';

export const getCategories = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    // Devolvemos ordenado por el campo 'order'
    return data.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error("[ERROR] Fallo al cargar categorías:", error);
    return [];
  }
};
