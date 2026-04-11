import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

/**
 * Sube una imagen a Firebase Storage y devuelve la URL pública
 * @param {string} uri URI local del archivo (de image-picker)
 * @param {string} path Carpeta en el storage (ej: 'products', 'profiles')
 */
export const uploadImage = async (uri, path = 'products') => {
  if (!uri) return null;

  try {
    const filename = uri.split('/').pop() || `img_${Date.now()}.jpg`;
    const storageRef = ref(storage, `${path}/${Date.now()}_${filename}`);

    // Convertir URI a Blob compatible
    const response = await fetch(uri);
    const blob = await response.blob();

    // Subir
    await uploadBytes(storageRef, blob);

    // Obtener URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("[STORAGE] Error al subir imagen:", error);
    throw error;
  }
};
