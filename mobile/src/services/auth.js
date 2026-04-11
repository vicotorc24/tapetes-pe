import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  query, 
  where,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION_NAME = 'users';

/**
 * Intenta iniciar sesión buscando el usuario en Firestore
 */
export const login = async (email, password) => {
  try {
    const usersRef = collection(db, COLLECTION_NAME);
    const q = query(usersRef, where('email', '==', email.toLowerCase().trim()));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("El usuario no existe.");
    }

    const userData = querySnapshot.docs[0].data();
    const userId = querySnapshot.docs[0].id;

    // Emulación de contraseña (si el campo existe, comparamos; si no, aceptamos temporalmente)
    // En producción esto usaría Firebase Auth
    if (userData.password && userData.password !== password) {
      throw new Error("Contraseña incorrecta.");
    }

    if (userData.status === 'inactive') {
      throw new Error("Esta cuenta ha sido desactivada. Contacte con soporte.");
    }
    
    if (userData.status === 'pending') {
      throw new Error("Su cuenta está en proceso de validación por la Municipalidad de Contumazá. Se le notificará una vez aprobada.");
    }

    return { 
      id: userId, 
      ...userData 
    };
  } catch (error) {
    console.error("[AUTH] Error en login:", error);
    throw error;
  }
};

/**
 * Registra un nuevo artesano en la base de datos real
 */
export const register = async (userData) => {
  try {
    // Verificar si ya existe
    const usersRef = collection(db, COLLECTION_NAME);
    const q = query(usersRef, where('email', '==', userData.email.toLowerCase().trim()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Este correo ya está registrado.");
    }

    const finalData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      role: 'seller', 
      status: 'pending',
      sector: userData.sector || 'General',
      brandName: userData.brandName || '',
      phone: userData.phone || '',
      location: userData.location || 'Contumazá, Cajamarca',
      createdAt: new Date().toISOString(),
      photo: `https://api.dicebear.com/7.x/notionists/svg?seed=${userData.firstName}`
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), finalData);
    
    return {
      id: docRef.id,
      ...finalData
    };
  } catch (error) {
    console.error("[AUTH] Error en registro:", error);
    throw error;
  }
};

/**
 * Actualiza el perfil de un usuario
 */
export const updateProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("[AUTH] Error al actualizar perfil:", error);
    throw error;
  }
};
