import { db } from '../lib/firebase';
import { 
  doc, 
  updateDoc, 
  increment, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

/**
 * SERVICIO DE INTERACCIONES ROBUSTAS (Paridad Web)
 * Actualiza estadísticas de Producto, Productor y Globales.
 */
export const recordInteraction = async (productId, metric, producerId = null, legacyId = null) => {
  if (!productId && !legacyId) return;

  try {
    const type = metric === 'whatsappClicks' ? 'click' : 'view';
    const baseField = type === 'click' ? 'clicks' : 'views';
    
    if (__DEV__) {
      console.log(`[INTERACTION] Recording ${type} for product ${productId}...`);
    }

    // 1. Actualizar Estadísticas del Producto
    if (productId) {
      const productRef = doc(db, 'products', productId);
      const pField = type === 'click' ? 'stats.whatsappClicks' : 'stats.views';
      await updateDoc(productRef, { [pField]: increment(1) }).catch(err => {
        console.warn(`[INTERACTION] Product stats update failed:`, err.message);
      });
    }

    // 2. Actualizar Estadísticas del Productor (Si tenemos el ID)
    if (producerId) {
      const userRef = doc(db, 'users', producerId);
      const field = type === 'click' ? 'whatsappClicks' : 'profileViews';
      
      await updateDoc(userRef, { [field]: increment(1) }).catch(err => {
        console.warn(`[INTERACTION] Producer stats update failed for ${producerId}:`, err.message);
      });
    }

    // 3. Registro Global (Para el Dashboard del Admin)
    const statsRef = doc(db, 'stats', 'locations');
    const platformField = `platforms.mobile.${baseField}`;
    
    if (productId) {
      await updateDoc(statsRef, {
        [platformField]: increment(1),
        [`total_${baseField}`]: increment(1)
      }).catch(async () => {
        await setDoc(statsRef, {
          platforms: { mobile: { [baseField]: 1 } },
          [`total_${baseField}`]: 1
        }, { merge: true });
      });
    }

    // 4. Registro de Legado Cultural (Si aplica)
    if (legacyId) {
      const cleanLegacyId = legacyId.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, '').trim();
      const legacyStatsRef = doc(db, 'stats', 'legacy');
      await updateDoc(legacyStatsRef, {
        [`views.${cleanLegacyId}`]: increment(1)
      }).catch(async () => {
        await setDoc(legacyStatsRef, {
          views: { [cleanLegacyId]: 1 }
        }, { merge: true });
      });
    }

    if (__DEV__) {
      console.log(`[INTERACTION] ✅ Successfully synchronized all metrics for ${type}`);
    }

  } catch (error) {
    console.error('[INTERACTION] ❌ Critical Error:', error);
  }
};

/**
 * Helper para encontrar el ID de un productor por su email (Retrocompatibilidad)
 */
export const getProducerIdByEmail = async (email) => {
  if (!email) return null;
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email.toLowerCase().trim()));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }
    return null;
  } catch (error) {
    console.error("[INTERACTION] Error resolving producer ID:", error);
    return null;
  }
};
