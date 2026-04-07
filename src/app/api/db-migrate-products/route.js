import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export async function GET() {
  try {
    // 1. Obtener Sectores para mapear Nombres -> IDs Reales
    const sectorsRef = collection(db, 'sectors');
    const sectorsSnap = await getDocs(sectorsRef);
    const sectorMap = {};
    
    sectorsSnap.forEach(sDoc => {
      const data = sDoc.data();
      const normalizedName = (data.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      if (normalizedName.includes('artesania')) sectorMap['textile'] = sDoc.id;
      if (normalizedName.includes('alimento') || normalizedName.includes('agro')) sectorMap['food'] = sDoc.id;
      
      // Mapeo directo por nombre normalizado también por si acaso
      sectorMap[normalizedName] = sDoc.id;
    });

    console.log("=== MAPA DE MIGRACIÓN DE SECTORES ===", sectorMap);

    // 2. Obtener Productos y actualizar
    const productsRef = collection(db, 'products');
    const productsSnap = await getDocs(productsRef);
    let migratedCount = 0;

    for (const pDoc of productsSnap.docs) {
      const pData = pDoc.data();
      const currentSector = pData.sector;
      
      // Si el producto tiene un sector que está en nuestro mapa de "Legacy", lo actualizamos al ID Real
      if (currentSector && sectorMap[currentSector]) {
        const realId = sectorMap[currentSector];
        if (realId !== currentSector) {
          console.log(`Migrando producto "${pData.title}": ${currentSector} -> ${realId}`);
          await updateDoc(doc(db, 'products', pDoc.id), {
            sector: realId
          });
          migratedCount++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      migratedCount, 
      message: `Migración de ${migratedCount} productos completada con éxito.` 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
