import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';

/**
 * API para registrar interacciones con geolocalización nativa de Vercel.
 * Optimizado para el plan gratuito de Firebase (mínimas lecturas/escrituras).
 */
export async function POST(request) {
  try {
    const { type, productId, artisanId } = await request.json();
    const headersList = await headers();
    
    // Captura de ubicación desde Vercel Edge Headers
    const country = headersList.get('x-vercel-ip-country') || 'Desconocido';
    const city = headersList.get('x-vercel-ip-city') || 'Desconocido';
    const region = headersList.get('x-vercel-ip-country-region') || 'Desconocido';

    if (!productId && !artisanId) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    // 1. Actualizar estadísticas del producto (si aplica)
    if (productId) {
      const productRef = doc(db, 'products', productId);
      const field = type === 'click' ? 'stats.whatsappClicks' : 'stats.views';
      await updateDoc(productRef, {
        [field]: increment(1)
      });
    }

    // 2. Actualizar estadísticas de la artesana (si aplica)
    if (artisanId) {
      const userRef = doc(db, 'users', artisanId);
      const userGeoRef = doc(db, 'users', artisanId, 'stats', 'locations');
      const field = type === 'click' ? 'whatsappClicks' : 'profileViews';
      
      // Actualizamos contadores básicos en el perfil
      await updateDoc(userRef, {
        [field]: increment(1)
      });

      // Guardamos la ubicación específica para esta artesana
      await setDoc(userGeoRef, updatePayload, { merge: true });
    }

    // 3. Registro Geográfico Global (Solo para Superadmin)
    const statsRef = doc(db, 'stats', 'locations');
    await setDoc(statsRef, updatePayload, { merge: true });

    return NextResponse.json({ 
      success: true, 
      geo: { country, city, region } 
    });

  } catch (error) {
    console.error('Error en API de estadísticas:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
