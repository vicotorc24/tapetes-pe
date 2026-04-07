import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc, deleteField } from 'firebase/firestore';

export async function GET() {
  try {
    const sectorsRef = collection(db, 'sectors');
    const snapshot = await getDocs(sectorsRef);
    let cleanedCount = 0;
    
    for (const sDoc of snapshot.docs) {
      if (sDoc.data().id) {
        await updateDoc(doc(db, 'sectors', sDoc.id), {
          id: deleteField()
        });
        cleanedCount++;
      }
    }
    
    console.log(`=== LIMPIEZA FINALIZADA: ${cleanedCount} SECTORES LIMPIOS ===`);
    return NextResponse.json({ success: true, cleanedCount });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
