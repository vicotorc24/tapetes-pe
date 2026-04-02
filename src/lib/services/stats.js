import { db } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

/**
 * Registra una interacción atómica para un producto
 * @param {string} productId - ID del producto
 * @param {'views' | 'whatsappClicks'} metric - Tipo de métrica a incrementar
 */
export const recordInteraction = async (productId, metric) => {
  if (!productId) return;
  
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      [`stats.${metric}`]: increment(1),
      lastInteractionAt: new Date().toISOString()
    });
  } catch (error) {
    // Si el error es 'NOT_FOUND', significa que es un producto legacy o incompleto
    // Silenciamos este error para no afectar la experiencia del usuario final
    console.error(`Error recording ${metric} for product ${productId}:`, error);
  }
};
