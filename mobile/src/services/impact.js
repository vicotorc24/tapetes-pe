import { doc, getDoc, collection, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';

const IMPACT_DOC_PATH = 'siteData/impact';

/**
 * Obtiene estadísticas reales de la plataforma para el impacto
 */
export const getLiveImpactStats = async () => {
  try {
    const usersRef = collection(db, 'users');
    const productsRef = collection(db, 'products');
    const sectorsRef = collection(db, 'sectors');

    const [artisansSnap, productsSnap, sectorsSnap] = await Promise.all([
      getCountFromServer(query(usersRef, where('role', '==', 'seller'), where('status', '==', 'active'))),
      getCountFromServer(productsRef),
      getCountFromServer(sectorsRef)
    ]);

    return {
      artisans: artisansSnap.data().count,
      products: productsSnap.data().count,
      sectors: sectorsSnap.data().count
    };
  } catch (error) {
    console.error("[ERROR] getLiveImpactStats:", error);
    return { artisans: 0, products: 0, sectors: 0 };
  }
};

/**
 * Obtiene los datos de impacto dinámicos
 */
export const getImpactData = async () => {
  try {
    const docRef = doc(db, IMPACT_DOC_PATH);
    const docSnap = await getDoc(docRef);
    const liveStats = await getLiveImpactStats();

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Mezclar métricas reales en el array de stats
      const mergedStats = (data.stats || []).map(stat => {
        // Asumiendo que id: 2 es artesanas e id: 3 es productos (como en la web)
        if (stat.id === 2 && liveStats.artisans) return { ...stat, value: liveStats.artisans.toString() };
        if (stat.id === 3 && liveStats.products) return { ...stat, value: liveStats.products.toString() };
        return stat;
      });

      return {
        ...data,
        stats: mergedStats
      };
    } else {
      // Fallback si no existe el documento
      return {
        hero: {
          title: "El Impacto de Made In Contumazá",
          description: "Conectamos la herencia viva de Contumazá con el mercado global.",
          backgroundImage: "https://images.unsplash.com/photo-1542332101-da79cce02298?auto=format&fit=crop&w=1200&q=80"
        },
        stats: [
          { id: 1, icon: "Heart", value: "100%", label: "Ganancia Directa" },
          { id: 2, icon: "Users", value: liveStats.artisans.toString(), label: "Artesanas Activas" },
          { id: 3, icon: "Award", value: liveStats.products.toString(), label: "Productos de Identidad" }
        ],
        story1: { title: "El Reto", description1: "Apoyamos el desarrollo local.", image: "https://via.placeholder.com/800" },
        story2: { title: "Nuestra Solución", description1: "Tecnología con propósito.", image: "https://via.placeholder.com/800" }
      };
    }
  } catch (error) {
    console.error("[ERROR] getImpactData:", error);
    throw error;
  }
};
