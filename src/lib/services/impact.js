import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getCountFromServer } from 'firebase/firestore';

const IMPACT_DOC_PATH = 'siteData/impact';

/**
 * Obtiene los datos de la sección de impacto social.
 * Si no existe, devuelve una estructura por defecto basada en los textos originales.
 */
export const getImpactData = async () => {
  try {
    const docRef = doc(db, IMPACT_DOC_PATH);
    const docSnap = await getDoc(docRef);
    
    // Obtener estadísticas reales de la plataforma
    const liveStats = await getLiveImpactStats();
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Mezclamos la estructura guardada con los valores reales frescos
      const mergedStats = (data.stats || []).map(stat => {
        if (stat.id === 2 && liveStats.artisans) return { ...stat, value: liveStats.artisans.toString() };
        if (stat.id === 3 && liveStats.products) return { ...stat, value: liveStats.products.toString() };
        return stat;
      });

      return { 
        id: docSnap.id, 
        ...data,
        stats: mergedStats
      };
    } else {
      // Datos iniciales por defecto (Seed)
      const defaultData = {
        hero: {
          subtitle: "Nuestro Propósito",
          title: "El Impacto de Made In Contumazá",
          description: "Conectamos la herencia viva de Contumazá con el mercado global, generando una economía autosostenible para nuestros artesanos y productores.",
          backgroundImage: "/images/impact/hero.png"
        },
        story1: {
          title: "El Reto en la Montaña",
          description1: "Durante décadas, el increíble talento de los artesanos y productores contumacinos estuvo limitado a mercados físicos locales, lo que reducía el valor de su arte y trabajo.",
          description2: "Esta pérdida gradual no solo afectaba sus ingresos, sino que amenazaba con silenciar un legado productivo y cultural transmitido por generaciones.",
          image: "/images/impact/story1.png"
        },
        story2: {
          title: "Nuestra Solución Tecnológica",
          description1: "Made In Contumazá actúa como un puente directo de Comercio Justo entre el consumidor internacional y la mesa de la artesana. Al digitalizar el catálogo, eliminamos por completo a los revendedores intermediarios.",
          description2: "El modelo no solo asegura el pago completo del precio de venta directamente a la tejedora, sino que utiliza las ganancias excedentes para reinvertir en herramientas, hilo de mayor calidad y empoderamiento tecnológico.",
          image: "/images/impact/story2.png"
        },
        stats: [
          { id: 1, icon: "HeartHandshake", value: "100%", label: "Ganancia Directa para el Productor y Artesano" },
          { id: 2, icon: "TrendingUp", value: "+40h", label: "De capacitación digital y negocios para la comunidad" },
          { id: 3, icon: "Award", value: "1", label: "Crecimiento Sostenible para Contumazá" }
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
 * Obtiene estadísticas reales de la plataforma para el impacto.
 */
export const getLiveImpactStats = async () => {
  try {
    const usersRef = collection(db, 'users');
    const productsRef = collection(db, 'products');
    const sectorsRef = collection(db, 'sectors');

    // Contar artesanas activas
    const artisansSnap = await getCountFromServer(query(usersRef, where('role', '==', 'seller'), where('status', '==', 'active')));
    
    // Contar productos totales
    const productsSnap = await getCountFromServer(productsRef);

    // Contar sectores
    const sectorsSnap = await getCountFromServer(sectorsRef);

    return {
      artisans: artisansSnap.data().count,
      products: productsSnap.data().count,
      sectors: sectorsSnap.data().count
    };
  } catch (error) {
    console.error("Error al obtener estadísticas reales:", error);
    return { artisans: null, products: null, sectors: null };
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
