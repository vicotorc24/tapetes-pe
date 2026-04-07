import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import { logAction } from './audit';

const COLLECTION_NAME = 'sectors';

export const getSectors = async () => {
  try {
    const sectorsRef = collection(db, COLLECTION_NAME);
    const q = query(sectorsRef, orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting sectors: ", error);
    return [];
  }
};

export const addSector = async (sectorData, user) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...sectorData,
      createdAt: new Date().toISOString()
    });
    
    if (user) {
      logAction(user, `Creó el sector productivo "${sectorData.name}"`, 'Sistema', 'success', { sectorId: docRef.id });
    }
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding sector: ", error);
    throw error;
  }
};

export const updateSector = async (sectorId, sectorData, user) => {
  try {
    const sectorRef = doc(db, COLLECTION_NAME, sectorId);
    
    await updateDoc(sectorRef, {
      ...sectorData,
      updatedAt: new Date().toISOString()
    });
    
    if (user) {
      logAction(user, `Actualizó el sector "${sectorData.name}"`, 'Sistema', 'info', { sectorId });
    }
  } catch (error) {
    console.error("Error updating sector: ", error);
    throw error;
  }
};

export const deleteSector = async (sectorId, sectorName, user) => {
  try {
    const sectorRef = doc(db, COLLECTION_NAME, sectorId);
    await deleteDoc(sectorRef);
    
    if (user) {
      logAction(user, `Eliminó el sector "${sectorName}"`, 'Sistema', 'warning', { sectorId });
    }
  } catch (error) {
    console.error("Error deleting sector: ", error);
    throw error;
  }
};
