import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export async function GET() {
  try {
    // 1. Obtener Sectores para mapear Nombres/Legacy -> IDs Reales
    const sectorsRef = collection(db, 'sectors');
    const sectorsSnap = await getDocs(sectorsRef);
    const sectorMap = {};
    
    sectorsSnap.forEach(sDoc => {
      const data = sDoc.data();
      const normalizedName = (data.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      if (normalizedName.includes('artesania')) sectorMap['textile'] = sDoc.id;
      if (normalizedName.includes('alimento') || normalizedName.includes('agro')) sectorMap['food'] = sDoc.id;
      if (normalizedName.includes('turismo') || normalizedName.includes('hotel')) sectorMap['turismo'] = sDoc.id;
      
      sectorMap[normalizedName] = sDoc.id;
    });

    // 2. Obtener Categorías y actualizar su campo 'sector'
    const categoriesRef = collection(db, 'categories');
    const categoriesSnap = await getDocs(categoriesRef);
    let migratedCount = 0;

    for (const cDoc of categoriesSnap.docs) {
      const cData = cDoc.data();
      const currentSector = cData.sector;
      
      if (currentSector && sectorMap[currentSector]) {
        const realId = sectorMap[currentSector];
        if (realId !== currentSector) {
          console.log(`Migrando categoría "${cData.name}": sector ${currentSector} -> ${realId}`);
          await updateDoc(doc(db, 'categories', cDoc.id), {
            sector: realId
          });
          migratedCount++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      migratedCount, 
      message: `Migración de ${migratedCount} categorías completada con éxito.` 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
