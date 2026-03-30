import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const COLLECTION_NAME = 'categories';

export const getCategories = async () => {
  const q = query(collection(db, COLLECTION_NAME));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  // Ordenar en memoria para no excluir documentos sin el campo 'order'
  return data.sort((a, b) => (a.order || 0) - (b.order || 0));
};

export const addCategory = async (data) => {
  const existing = await getCategories();
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    order: existing.length,
    createdAt: new Date().toISOString()
  });
};

export const deleteCategory = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return await deleteDoc(docRef);
};
