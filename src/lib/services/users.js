import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'users';

export const getUsers = async (statusFilter = null) => {
  try {
    const usersRef = collection(db, COLLECTION_NAME);
    let q;
    
    if (statusFilter) {
      q = query(usersRef, where('status', '==', statusFilter), orderBy('createdAt', 'desc'));
    } else {
      q = query(usersRef, orderBy('createdAt', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting users: ", error);
    return [];
  }
};

export const addUser = async (userData) => {
  try {
    const { uid, ...data } = userData;
    const finalData = {
      ...data,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      photo: data.photo || `https://api.dicebear.com/7.x/notionists/svg?seed=${data.name || 'weaver'}`
    };

    if (uid) {
      // Si ya tiene UID (creado en Auth por Admin), usamos setDoc
      await setDoc(doc(db, COLLECTION_NAME, uid), finalData);
      return uid;
    } else {
      // Creación genérica
      const docRef = await addDoc(collection(db, COLLECTION_NAME), finalData);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error adding user: ", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const userRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating user: ", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, COLLECTION_NAME, userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting user: ", error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const usersRef = collection(db, COLLECTION_NAME);
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting user by email: ", error);
    return null;
  }
};
