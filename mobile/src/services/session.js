import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@madeincontumaza_user_session';

/**
 * Guarda la sesión del usuario en el almacenamiento local
 */
export const saveSession = async (userData) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(SESSION_KEY, jsonValue);
    console.log("[SESSION] Sesión guardada exitosamente");
  } catch (e) {
    console.error("[SESSION] Error al guardar sesión:", e);
  }
};

/**
 * Recupera la sesión guardada
 */
export const getSession = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(SESSION_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("[SESSION] Error al recuperar sesión:", e);
    return null;
  }
};

/**
 * Elimina la sesión del almacenamiento local (Logout)
 */
export const clearSession = async () => {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
    console.log("[SESSION] Sesión eliminada");
  } catch (e) {
    console.error("[SESSION] Error al eliminar sesión:", e);
  }
};
