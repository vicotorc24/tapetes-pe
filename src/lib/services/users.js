import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import { logAction, getDetailedAction } from './audit';

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

export const addUser = async (userData, adminUser) => {
  try {
    const { uid, ...data } = userData;
    const finalData = {
      ...data,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      photo: data.photo || `https://api.dicebear.com/7.x/notionists/svg?seed=${data.name || 'weaver'}`
    };

    let resultId;
    if (uid) {
      await setDoc(doc(db, COLLECTION_NAME, uid), finalData);
      resultId = uid;
    } else {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), finalData);
      resultId = docRef.id;
    }

    if (adminUser) {
      logAction(adminUser, `Registró al usuario "${userData.name}"`, 'Usuarios', 'success', { userId: resultId });
    }
    return resultId;
  } catch (error) {
    console.error("Error adding user: ", error);
    throw error;
  }
};

export const updateUser = async (userId, userData, adminUser) => {
  try {
    const userRef = doc(db, COLLECTION_NAME, userId);
    
    // 1. Obtener estado previo para el log detallado
    let oldData = null;
    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) oldData = snap.data();
    } catch (e) {}

    // 2. Actualizar documento
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString()
    });

    // 3. Log detallado del cambio
    if (adminUser) {
      const detail = getDetailedAction(oldData, userData, 'user');
      const actionMessage = detail 
        ? `${detail} para "${userData.name || (oldData && oldData.name) || userId}"`
        : `Actualizó datos del usuario "${userData.name || (oldData && oldData.name) || userId}"`;

      logAction(adminUser, actionMessage, 'Usuarios', 'info', { userId });
    }
  } catch (error) {
    console.error("Error updating user: ", error);
    throw error;
  }
};

export const deleteUser = async (userId, adminUser) => {
  try {
    const userRef = doc(db, COLLECTION_NAME, userId);
    
    let userName = userId;
    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) userName = snap.data().name;
    } catch (e) {}

    await deleteDoc(userRef);

    if (adminUser) {
      logAction(adminUser, `Eliminó al usuario "${userName}"`, 'Usuarios', 'warning', { userId });
    }
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
