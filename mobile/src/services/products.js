import { 
  collection, 
  addDoc,
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
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

/**
 * Actualiza los datos de un producto
 */
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error en mobile/updateProduct:", error);
    throw error;
  }
};

/**
 * Crea un nuevo producto en el catálogo
 */
export const addProduct = async (productData) => {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: { views: 0, whatsappClicks: 0 } // Inicializar stats
    });
    return docRef.id;
  } catch (error) {
    console.error("Error en mobile/addProduct:", error);
    throw error;
  }
};
