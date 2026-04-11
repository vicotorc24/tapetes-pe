import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION_NAME = 'products';

/**
 * Obtiene todos los productos del catálogo
 */
export const getProducts = async (category = 'Todas') => {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    let q;
    
    if (category && category !== 'Todas') {
      q = query(
        productsRef, 
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(productsRef, orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
  } catch (error) {
    console.error("Error en mobile/getProducts: ", error);
    return [];
  }
};

/**
 * Obtiene el detalle de un producto por su ID
 */
export const getProductById = async (productId) => {
  if (!productId) return null;
  
  try {
    const productRef = doc(db, COLLECTION_NAME, productId);
    const snap = await getDoc(productRef);
    
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error en mobile/getProductById:", error);
    return null;
  }
};
