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
import { logAction, getDetailedAction } from './audit';

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

export const addProduct = async (productData, user) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...productData,
      createdAt: new Date().toISOString()
    });
    
    // Log the action
    if (user) {
      logAction(user, `Creó el producto "${productData.title}"`, 'Catálogo', 'success', { productId: docRef.id });
    }
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error;
  }
};

export const updateProduct = async (productId, productData, user) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, productId);
    
    // 1. Obtener estado previo para el log detallado
    let oldData = null;
    try {
      const snap = await getDoc(productRef);
      if (snap.exists()) oldData = snap.data();
    } catch (e) {}

    // 2. Actualizar documento
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date().toISOString()
    });
    
    // 3. Log detallado del cambio
    if (user) {
      const detail = getDetailedAction(oldData, productData, 'product');
      const actionMessage = detail 
        ? `${detail} de "${productData.title || (oldData && oldData.title) || productId}"`
        : `Actualizó el producto "${productData.title || (oldData && oldData.title) || productId}"`;
        
      logAction(user, actionMessage, 'Catálogo', 'info', { productId });
    }
  } catch (error) {
    console.error("Error updating product: ", error);
    throw error;
  }
};

export const deleteProduct = async (productId, user) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, productId);
    
    // Optional: Fetch product name before delete for better logging
    let productName = productId;
    try {
      const snap = await getDoc(productRef);
      if (snap.exists()) productName = snap.data().title;
    } catch (e) {}

    await deleteDoc(productRef);
    
    // Log the action
    if (user) {
      logAction(user, `Eliminó el producto "${productName}"`, 'Catálogo', 'warning', { productId });
    }
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
