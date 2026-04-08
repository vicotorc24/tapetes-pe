"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updatePassword
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [impersonatedUser, setImpersonatedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const effectiveUser = impersonatedUser || user;

  const startImpersonating = (targetUser) => {
    if (user?.role === 'superadmin') {
      setImpersonatedUser(targetUser);
      return true;
    }
    return false;
  };

  const stopImpersonating = () => {
    setImpersonatedUser(null);
  };

  const refreshAuthUser = async () => {
    try {
      if (impersonatedUser) {
        const docRef = doc(db, "users", impersonatedUser.id || impersonatedUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setImpersonatedUser({ id: docSnap.id, ...docSnap.data() });
      } else if (user) {
        // Si es un usuario real por UID
        if (user.uid !== 'admin-override') {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setUser({ uid: user.uid, email: user.email, ...docSnap.data() });
        } else {
          // Caso especial: Admin Override (buscar por email)
          const { collection, query, where, getDocs } = await import('firebase/firestore');
          const q = query(collection(db, "users"), where("email", "==", user.email));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const d = snap.docs[0];
            setUser({ uid: 'admin-override', email: user.email, ...d.data() });
          }
        }
      }
    } catch (e) {
      console.error("Error refreshing auth user:", e);
    }
  };

  useEffect(() => {
    // Escuchar cambios en la sesión de Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Redundancia: si hay usuario real, limpiamos cualquier suplantación o bypass previo
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...docSnap.data()
          });
        } else {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'guest' });
        }
      } else {
        // Si no hay firebaseUser, PERO el usuario actual es el Admin Bypass, no cerramos sesión
        // Solo cerramos sesión si no estamos en modo bypass
        setUser(prev => (prev?.uid === 'admin-override' ? prev : null));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    // Override de Emergencia para la cuenta Admin de Demo
    // Solo para uso de desarrollo cuando no hay acceso al correo real
    if (email === 'admin@tapetes.pe' && password === 'TapetesAdmin2026') {
      setUser({
        uid: 'admin-override',
        email: 'admin@tapetes.pe',
        role: 'superadmin',
        name: 'Super Admin (Bypass)',
        status: 'active',
        photo: 'https://placehold.co/100/purple/white?text=SA'
      });
      return { success: true };
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // La redirección la maneja el componente o el useEffect
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      // Crear documento en Firestore (Estado pendiente por defecto)
      const { setDoc, doc } = await import('firebase/firestore');
      await setDoc(doc(db, "users", uid), {
        ...userData,
        email,
        uid,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        // Mantenemos name para compatibilidad con código antiguo hasta terminar migración
        name: userData.name || `${userData.firstName} ${userData.lastName}`.trim(),
        status: userData.status || 'pending',
        role: userData.role || 'seller',
        createdAt: new Date().toISOString()
      });

      return { success: true, uid };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    router.push('/');
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUserPassword = async (newPassword) => {
    try {
      if (!auth.currentUser) throw new Error("No hay una sesión activa.");
      await updatePassword(auth.currentUser, newPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.code || error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      effectiveUser,
      impersonatedUser,
      loading,
      login,
      logout,
      resetPassword,
      register,
      startImpersonating,
      stopImpersonating,
      refreshAuthUser,
      updateUserPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);