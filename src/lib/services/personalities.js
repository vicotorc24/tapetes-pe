import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'personalities';

export const getPersonalities = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching personalities:", error);
    return [];
  }
};

export const getPersonalityBySlug = async (slug) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  } catch (error) {
    console.error("Error fetching personality by slug:", error);
    return null;
  }
};

export const addPersonality = async (personalityData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...personalityData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...personalityData };
  } catch (error) {
    console.error("Error adding personality:", error);
    throw error;
  }
};

export const updatePersonality = async (id, personalityData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...personalityData,
      updatedAt: new Date().toISOString()
    });
    return { id, ...personalityData };
  } catch (error) {
    console.error("Error updating personality:", error);
    throw error;
  }
};

export const deletePersonality = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error("Error deleting personality:", error);
    throw error;
  }
};
