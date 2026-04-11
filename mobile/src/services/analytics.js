import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Registra un evento de analítica de gestión en Firestore.
 * @param {string} eventName - Nombre del evento (ej: 'product_created', 'dashboard_view')
 * @param {object} params - Parámetros adicionales (user_id, product_id, etc.)
 */
export const trackArtisanEvent = async (eventName, params = {}) => {
  try {
    await addDoc(collection(db, 'artisan_analytics'), {
      event: eventName,
      ...params,
      platform: 'mobile',
      timestamp: serverTimestamp()
    });
    
    if (__DEV__) {
      console.log(`📈 Analytics Mobile [${eventName}]:`, params);
    }
  } catch (error) {
    console.error('❌ Error recording artisan analytics:', error);
  }
};

/**
 * Eventos Predefinidos para la App de Gestión
 */
export const ArtisanEvents = {
  LOGIN: (userId, email) => trackArtisanEvent('login', { userId, email }),
  
  DASHBOARD_VIEW: (userId) => trackArtisanEvent('dashboard_view', { userId }),
  
  PRODUCT_CREATE_START: (userId) => trackArtisanEvent('product_create_start', { userId }),
  PRODUCT_CREATED: (userId, productId, sector) => trackArtisanEvent('product_created', { userId, productId, sector }),
  
  PRODUCT_EDIT_START: (userId, productId) => trackArtisanEvent('product_edit_start', { userId, productId }),
  PRODUCT_UPDATED: (userId, productId) => trackArtisanEvent('product_updated', { userId, productId }),
  
  PROFILE_UPDATE_START: (userId) => trackArtisanEvent('profile_update_start', { userId }),
  PROFILE_UPDATED: (userId) => trackArtisanEvent('profile_updated', { userId }),
  
  PHOTO_UPLOAD: (userId, type) => trackArtisanEvent('photo_upload', { userId, type })
};
