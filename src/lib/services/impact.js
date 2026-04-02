import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const IMPACT_DOC_PATH = 'siteData/impact';

/**
 * Obtiene los datos de la sección de impacto social.
 * Si no existe, devuelve una estructura por defecto basada en los textos originales.
 */
export const getImpactData = async () => {
  try {
    const docRef = doc(db, IMPACT_DOC_PATH);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // Datos iniciales por defecto (Seed)
      const defaultData = {
        hero: {
          subtitle: "Nuestro Motor de Desarrollo",
          title: "El Impacto de Tapetes.pe",
          description: "Conectamos la herencia viva de Contumazá con el mercado digital, generando una economía autosostenible para nuestras mujeres tejedoras.",
          backgroundImage: "/images/landmarks/plaza_armas.jpg"
        },
        story1: {
          title: "El Reto en la Montaña",
          description1: "Durante décadas, el increíble talento de las artesanas contumacinas estuvo limitado a mercados físicos locales, lo que reducía el valor de su arte y obligaba a muchas mujeres a abandonar el tejido para dedicarse a otras labores menos rentables.",
          description2: "Esta pérdida gradual no solo afectaba sus ingresos, sino que amenazaba con silenciar un legado cultural transmitido de abuelas a madres durante siglos.",
          image: "/images/fb_1.jpg"
        },
        story2: {
          title: "Nuestra Solución Tecnológica",
          description1: "Tapetes.pe actúa como un puente directo de Comercio Justo entre el consumidor internacional y la mesa de la artesana. Al digitalizar el catálogo, eliminamos por completo a los revendedores intermediarios.",
          description2: "El modelo no solo asegura el pago completo del precio de venta directamente a la tejedora, sino que utiliza las ganancias excedentes para reinvertir en herramientas, hilo de mayor calidad y empoderamiento tecnológico.",
          image: "/images/fb_3.jpg"
        },
        stats: [
          { id: 1, icon: "HeartHandshake", value: "100%", label: "Ganancia Directa a la Artesana Creadora" },
          { id: 2, icon: "TrendingUp", value: "+40h", label: "De capacitación digital y negocios por año" },
          { id: 3, icon: "Award", value: "1", label: "Legado Asegurado para Contumazá" }
        ],
        extraSections: [],
        updatedAt: new Date().toISOString()
      };
      
      // Opcional: Guardar los por defecto si no existen
      await setDoc(docRef, defaultData);
      return defaultData;
    }
  } catch (error) {
    console.error("Error al obtener datos de impacto:", error);
    throw error;
  }
};

/**
 * Actualiza los datos de la sección de impacto.
 */
export const updateImpactData = async (data) => {
  try {
    const docRef = doc(db, IMPACT_DOC_PATH);
    
    // Limpiamos el objeto para no reenviar el 'id' de Firestore como un campo de datos
    const { id, ...cleanData } = data;
    
    const payload = {
      ...cleanData,
      updatedAt: new Date().toISOString()
    };
    
    // Usamos setDoc con merge para mayor robustez al crear nuevos campos como 'extraSections'
    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (error) {
    console.error("Error al actualizar datos de impacto:", error);
    throw error;
  }
};
