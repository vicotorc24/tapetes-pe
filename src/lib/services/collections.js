import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const COLLECTION_NAME = 'collections';

export const getCollections = async () => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const addCollection = async (data) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    createdAt: new Date().toISOString()
  });
};

export const updateCollection = async (id, data) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return await updateDoc(docRef, data);
};

export const deleteCollection = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return await deleteDoc(docRef);
};
