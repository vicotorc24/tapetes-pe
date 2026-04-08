import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export async function GET() {
  try {
    // 1. Obtener todos los usuarios para tener el mapeo de email -> photo
    const usersSnap = await getDocs(collection(db, 'users'));
    const userPhotoMap = {};
    usersSnap.forEach(u => {
      const data = u.data();
      if (data.email) {
        userPhotoMap[data.email.toLowerCase()] = data.photo || '';
      }
    });

    // 2. Obtener todos los productos
    const productsSnap = await getDocs(collection(db, 'products'));
    let updatedCount = 0;
    let skippedCount = 0;

    const updates = productsSnap.docs.map(async (productDoc) => {
      const p = productDoc.data();
      const email = p.sellerEmail?.toLowerCase();
      
      if (email && userPhotoMap[email]) {
        const photo = userPhotoMap[email];
        // Solo actualizar si no tiene la foto o es diferente
        if (p.sellerPhoto !== photo) {
          await updateDoc(doc(db, 'products', productDoc.id), {
            sellerPhoto: photo
          });
          updatedCount++;
        } else {
          skippedCount++;
        }
      } else {
        skippedCount++;
      }
    });

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: 'Sincronización de fotos completada.',
      stats: {
        totalProducts: productsSnap.size,
        updated: updatedCount,
        skipped: skippedCount
      }
    });
  } catch (error) {
    console.error("Migration Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
