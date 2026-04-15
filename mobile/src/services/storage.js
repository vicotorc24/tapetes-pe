import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

/**
 * Sube una imagen a Firebase Storage y devuelve la URL pública
 * Utiliza XMLHttpRequest para convertir la URI local a Blob de forma robusta en React Native
 * @param {string} uri URI local del archivo (de image-picker)
 * @param {string} path Carpeta en el storage (ej: 'products', 'profiles')
 */
export const uploadImage = async (uri, path = 'products') => {
  if (!uri) return null;
 
  try {
    // 1. Preparar la referencia
    const filename = uri.split('/').pop() || `img_${Date.now()}.jpg`;
    const storageRef = ref(storage, `${path}/${Date.now()}_${filename}`);

    // 2. Convertir URI a Blob usando XMLHttpRequest (Método más estable en RN)
    console.log("[STORAGE] Iniciando conversión de URI:", uri);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        console.log("[STORAGE] Blob obtenido. Tamaño:", xhr.response.size);
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.error("[STORAGE] Error en XHR conversion:", e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    // 3. Subir el Blob
    console.log("[STORAGE] Subiendo blob a:", storageRef.fullPath);
    await uploadBytes(storageRef, blob);
    console.log("[STORAGE] Subida completada.");

    // 4. Liberar recurso del blob para optimizar memoria
    if (blob.close) blob.close();

    // 5. Obtener URL de descarga
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("[STORAGE] Error crítico al subir imagen:", error);
    throw error;
  }
};
