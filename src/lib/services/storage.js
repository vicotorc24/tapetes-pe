/**
 * Cloudinary Storage Service
 * Replaces Firebase Storage to avoid billing requirements.
 */

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/db8rixls1/image/upload';
const UPLOAD_PRESET = 'tapetes_unsigned';

/**
 * Resizes an image before uploading to optimize storage space and credits.
 */
const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    console.log("Iniciando lectura de archivo para compresión...");
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      console.log("Archivo leído, cargando imagen...");
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Canvas to Blob failed'));
          }
        }, 'image/jpeg', quality);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

/**
 * Uploads a file to Cloudinary using the Unsigned Upload API.
 */
export const uploadFile = async (file, path = 'general', onProgress = null) => {
  try {
    let fileToUpload = file;
    if (file.type.startsWith('image/')) {
      console.log("Comprimiendo imagen...");
      fileToUpload = await compressImage(file);
      console.log("Imagen comprimida exitosamente");
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `tapetespe/${path}`);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', CLOUDINARY_URL, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = (event.loaded / event.total) * 100;
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log("Subida a Cloudinary exitosa:", response.secure_url);
          resolve(response.secure_url);
        } else {
          console.error("Error en Cloudinary API:", xhr.responseText);
          reject(new Error(`Cloudinary Upload Error: ${xhr.statusText}`));
        }
      };

      xhr.onerror = (err) => {
        console.error("Error de red en Cloudinary:", err);
        reject(err);
      };

      xhr.send(formData);
    });
  } catch (error) {
    console.error("Storage Service Error:", error);
    throw error;
  }
};

/**
 * Cloudinary doesn't support easy client-side deletion for unsigned uploads
 * without a signed backend, so we'll leave this as a no-op or handle it later.
 */
export const deleteFile = async (url) => {
  console.log("Borrado de archivo solicitado (no soportado en unsigned client-side):", url);
};
