import { db } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

/**
 * Registra una vista de perfil para una artesana
 * @param {string} artisanId - El ID del documento del usuario en Firestore
 */
export const recordProfileView = async (artisanId) => {
  if (!artisanId) return;
  try {
    const userRef = doc(db, 'users', artisanId);
    await updateDoc(userRef, {
      profileViews: increment(1)
    });
  } catch (error) {
    console.error("Error recording profile view:", error);
  }
};

/**
 * Registra un clic en el botón de WhatsApp
 * @param {string} artisanEmail - El email de la artesana (para buscarla si no tenemos el ID)
 * @param {string} artisanId - El ID opcional de la artesana
 */
export const recordWhatsappClick = async (artisanId) => {
  if (!artisanId) return;
  try {
    const userRef = doc(db, 'users', artisanId);
    await updateDoc(userRef, {
      whatsappClicks: increment(1)
    });
  } catch (error) {
    console.error("Error recording whatsapp click:", error);
  }
};
