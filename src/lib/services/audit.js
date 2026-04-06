import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'audit_logs';

/**
 * Logs an administrative action to Firestore.
 * @param {Object} user - The user performing the action {uid, name, role}
 * @param {string} action - Description of the action (e.g., 'Actualizó precio de Tapete Mirador')
 * @param {string} category - Category (Catálogo, Usuarios, Seguridad, Sistema)
 * @param {string} level - Level (info, success, warning)
 * @param {Object} metadata - Optional extra data (e.g., productId, oldVal, newVal)
 */
export const logAction = async (user, action, category = 'Sistema', level = 'info', metadata = {}) => {
  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      userId: user?.uid || 'system',
      userName: user?.name || user?.displayName || 'Sistema',
      action,
      category,
      level,
      metadata,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error("Error logging action:", error);
  }
};

/**
 * Subscribes to real-time audit logs.
 * @param {Function} callback - Function called with the logs array
 * @param {number} limitValue - Max number of logs to fetch
 */
export const subscribeToLogs = (callback, limitValue = 50) => {
  const logsRef = collection(db, COLLECTION_NAME);
  const q = query(logsRef, orderBy('timestamp', 'desc'), limit(limitValue));

  return onSnapshot(q, (querySnapshot) => {
    const logs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamp to readable string or Date
      timestamp: doc.data().timestamp?.toDate().toLocaleString('es-PE') || 'Reciente'
    }));
    callback(logs);
  });
};

/**
 * Fetches logs with optional filtering (demo version)
 */
export const getFilteredLogs = (callback, filters = {}, limitValue = 50) => {
  const logsRef = collection(db, COLLECTION_NAME);
  let constraints = [orderBy('timestamp', 'desc'), limit(limitValue)];

  if (filters.category && filters.category !== 'Todas') {
    constraints.unshift(where('category', '==', filters.category));
  }
  
  if (filters.level && filters.level !== 'Todos') {
    constraints.unshift(where('level', '==', filters.level));
  }

  const q = query(logsRef, ...constraints);

  return onSnapshot(q, (querySnapshot) => {
    const logs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toLocaleString('es-PE') || 'Reciente'
    }));
    callback(logs);
  });
};
