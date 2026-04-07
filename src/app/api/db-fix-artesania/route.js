import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const ARTESANIA_SECTOR_ID = 'j0xk99eU7jyPLn9Zi8WU';
    const ALIMENTOS_SECTOR_ID = 'a2z1ewWmF5lDEJz4sFcl';
    
    let productsUpdated = 0;
    let categoriesUpdated = 0;
    const updates = [];

    // 1. Reparar Productos
    productsSnapshot.docs.forEach(productDoc => {
      const data = productDoc.data();
      const isActuallyArtesania = !data.sector || data.sector === '' || data.sector === 'textile';
      
      if (isActuallyArtesania) {
        const productRef = doc(db, 'products', productDoc.id);
        updates.push(updateDoc(productRef, { sector: ARTESANIA_SECTOR_ID }));
        productsUpdated++;
      }
    });

    // 2. Reparar Categorías
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    categoriesSnapshot.docs.forEach(catDoc => {
      const data = catDoc.data();
      const sectorStr = (data.sector || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      let newSectorId = null;
      if (sectorStr === 'textile' || sectorStr === 'artesania' || !data.sector) {
        newSectorId = ARTESANIA_SECTOR_ID;
      } else if (sectorStr === 'food' || sectorStr === 'alimentos' || sectorStr.includes('agro')) {
        newSectorId = ALIMENTOS_SECTOR_ID;
      }

      if (newSectorId && data.sector !== newSectorId) {
        const catRef = doc(db, 'categories', catDoc.id);
        updates.push(updateDoc(catRef, { sector: newSectorId }));
        categoriesUpdated++;
      }
    });

    await Promise.all(updates);
    
    return NextResponse.json({ 
      success: true,
      summary: {
        productsRepaired: productsUpdated,
        categoriesRepaired: categoriesUpdated
      },
      message: `Se han reparado ${productsUpdated} productos y ${categoriesUpdated} categorías.`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
