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
    const bodyText = await request.text();
    if (!bodyText) return NextResponse.json({ error: 'Body vacío' }, { status: 400 });
    
    const { type, productId, artisanId } = JSON.parse(bodyText);
    const headersList = await headers();
    
    // Captura de ubicación desde Vercel Edge Headers
    let country = headersList.get('x-vercel-ip-country') || 'Desconocido';
    let city = headersList.get('x-vercel-ip-city') || 'Desconocido';
    let region = headersList.get('x-vercel-ip-country-region') || 'Desconocido';

    // Detector de entorno de prueba (Limpiamos nombres para que sean compatibles con Firestore)
    if (country === 'Desconocido' && process.env.NODE_ENV === 'development') {
        country = 'Local_Test';
        city = 'Entorno_Local';
    }

    // Sanitización ESTRICTA: Solo letras, números y espacios
    const cleanCity = city.replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'Ciudad_Desconocida';
    const cleanCountry = country.replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'Pais_Desconocido';

    if (!productId && !artisanId) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    // Estructura de actualización atómica
    const baseField = type === 'click' ? 'clicks' : 'views';
    const updatePayload = {
      [`countries.${cleanCountry}.${baseField}`]: increment(1),
      [`cities.${cleanCity}.${baseField}`]: increment(1)
    };

    // 1. Actualizar estadísticas del producto (si aplica)
    if (productId) {
      try {
        const productRef = doc(db, 'products', productId);
        const pField = type === 'click' ? 'stats.whatsappClicks' : 'stats.views';
        await updateDoc(productRef, { [pField]: increment(1) });
      } catch (e) { console.warn(`Error updating product ${productId}:`, e.message); }
    }

    // 2. Actualizar estadísticas de la artesana (Regional)
    if (artisanId) {
      try {
        const userRef = doc(db, 'users', artisanId);
        const userGeoRef = doc(db, 'users', artisanId, 'stats', 'locations');
        const field = type === 'click' ? 'whatsappClicks' : 'profileViews';
        
        await updateDoc(userRef, { [field]: increment(1) }).catch(() => {});
        
        // REPARACIÓN: Usamos updateDoc para dot-notation puro. Si falla, usamos setDoc estructurado.
        await updateDoc(userGeoRef, updatePayload).catch(async () => {
          await setDoc(userGeoRef, {
            cities: { [cleanCity]: { [baseField]: 1 } },
            countries: { [cleanCountry]: { [baseField]: 1 } }
          }, { merge: true });
        });
      } catch (e) { console.error('Error in artisan analytics:', e); }
    }

    // 3. Registro Geográfico Global (Solo para Dashboard)
    try {
      const statsRef = doc(db, 'stats', 'locations');
      await updateDoc(statsRef, updatePayload).catch(async () => {
        await setDoc(statsRef, {
          cities: { [cleanCity]: { [baseField]: 1 } },
          countries: { [cleanCountry]: { [baseField]: 1 } }
        }, { merge: true });
      });
    } catch (e) { console.error('Error in global analytics:', e); }

    return NextResponse.json({ 
      success: true, 
      geo: { country, city, region } 
    });

  } catch (error) {
    console.error('CRITICAL Error en API de estadísticas:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
