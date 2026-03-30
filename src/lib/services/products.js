import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'products';

export const getProducts = async (user = null) => {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    let q;
    
    // If user is seller, only get their products. If superadmin, get all.
    if (user && user.role === 'seller') {
      q = query(
        productsRef, 
        where('sellerEmail', '==', user.email),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(productsRef, orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting products: ", error);
    return [];
  }
};

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...productData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating product: ", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  if (!productId) return null;
  
  try {
    // 1. Acceso directo por Document ID (Lo más común para URLs persistentes)
    const productRef = doc(db, COLLECTION_NAME, productId);
    const directSnap = await getDoc(productRef);
    
    if (directSnap.exists()) {
      return { id: directSnap.id, ...directSnap.data() };
    }

    // 2. Fallback: Búsqueda por campo interno 'id' (si existiera)
    const productsRef = collection(db, COLLECTION_NAME);
    const q = query(productsRef, where('id', '==', productId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    
    return null;
  } catch (error) {
    console.error("Error en getProductById:", error);
    return null;
  }
};
