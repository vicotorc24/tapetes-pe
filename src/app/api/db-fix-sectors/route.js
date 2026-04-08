import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

/**
 * GET /api/db-fix-sectors
 * 
 * Normaliza el campo `sector` de todos los productos y categorías,
 * reemplazando cualquier valor legacy (nombre de texto, ID viejo como
 * 'textile' / 'food' / 'turismo', etc.) por el ID real de Firestore.
 *
 * Sectores reales en Firestore:
 *   j0xk99eU7jyPLn9Zi8WU → Artesanía
 *   a2z1ewWmF5lDEJz4sFcl → Alimentos / Agro
 *   aiA7GR53X1nSUO7Gf3Ox → Turismo y Hotelería
 */
export async function GET() {
  try {
    // 1. Construir mapa dinámico desde la colección 'sectors'
    const sectorsSnap = await getDocs(collection(db, 'sectors'));

    // Map: cualquier string legacy → ID real de Firestore
    const normalize = (str) =>
      (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    const sectorById = {}; // id real → id real (para detectar valores ya correctos)
    const legacyMap  = {}; // string legacy normalizado → id real

    sectorsSnap.forEach((sDoc) => {
      const { name } = sDoc.data();
      const id       = sDoc.id;
      const normName = normalize(name);

      // El propio ID ya es válido
      sectorById[id] = id;

      // Nombre completo normalizado
      legacyMap[normName] = id;

      // Aliases semánticos según palabras clave
      if (normName.includes('artesania') || normName.includes('tejido')) {
        legacyMap['textile']   = id;
        legacyMap['artesania'] = id;
        legacyMap['artesania (tejidos)'] = id;
      }
      if (normName.includes('alimento') || normName.includes('agro')) {
        legacyMap['food']              = id;
        legacyMap['alimentos']         = id;
        legacyMap['alimentos y agro']  = id;
        legacyMap['alimentos / agro']  = id;
        legacyMap['agro']              = id;
      }
      if (normName.includes('turismo') || normName.includes('hotel')) {
        legacyMap['turismo']              = id;
        legacyMap['turismo y hoteleria']  = id;
        legacyMap['hoteleria']            = id;
      }
    });

    console.log('=== MAPA DE SECTORES ===', legacyMap);

    const resolveId = (rawValue) => {
      if (!rawValue) return null;
      // Si ya es un ID real de Firestore, no tocamos
      if (sectorById[rawValue]) return null;
      // Buscar en el mapa de aliases
      const resolved = legacyMap[normalize(rawValue)];
      return resolved || null;
    };

    const updates = [];
    const log = [];

    // 2. Normalizar Productos
    const productsSnap = await getDocs(collection(db, 'products'));
    productsSnap.forEach((pDoc) => {
      const { sector, title } = pDoc.data();
      const newId = resolveId(sector);
      if (newId) {
        updates.push(updateDoc(doc(db, 'products', pDoc.id), { sector: newId }));
        log.push({ collection: 'products', title, from: sector, to: newId });
      }
    });

    // 3. Normalizar Categorías
    const categoriesSnap = await getDocs(collection(db, 'categories'));
    categoriesSnap.forEach((cDoc) => {
      const { sector, name } = cDoc.data();
      const newId = resolveId(sector);
      if (newId) {
        updates.push(updateDoc(doc(db, 'categories', cDoc.id), { sector: newId }));
        log.push({ collection: 'categories', name, from: sector, to: newId });
      }
    });

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      totalFixed: updates.length,
      message: `Se normalizaron ${updates.length} documentos (${log.filter(l => l.collection === 'products').length} productos, ${log.filter(l => l.collection === 'categories').length} categorías).`,
      details: log,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('db-fix-sectors error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
