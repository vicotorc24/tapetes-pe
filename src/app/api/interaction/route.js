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

    // Sanitización mejorada: Soporta acentos y eñes, elimina caracteres prohibidos ([ ] / . ~ * )
    const sanitize = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, '').trim();
    
    const cleanCity = sanitize(city) || 'Ciudad_Desconocida';
    const cleanCountry = sanitize(country) || 'Pais_Desconocido';

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
      const productRef = doc(db, 'products', productId);
      const pField = type === 'click' ? 'stats.whatsappClicks' : 'stats.views';
      await updateDoc(productRef, { [pField]: increment(1) }).catch(err => {
        console.warn(`Warning: Product stats update failed for ${productId}:`, err.message);
      });
    }

    // 2. Actualizar estadísticas de la artesana (Regional)
    if (artisanId) {
      const userRef = doc(db, 'users', artisanId);
      const userGeoRef = doc(db, 'users', artisanId, 'stats', 'locations');
      const field = type === 'click' ? 'whatsappClicks' : 'profileViews';
      
      // Actualizamos contador básico
      await updateDoc(userRef, { [field]: increment(1) }).catch(() => {});
      
      // Registro geográfico por artesana
      await updateDoc(userGeoRef, updatePayload).catch(async () => {
        await setDoc(userGeoRef, {
          cities: { [cleanCity]: { [baseField]: 1 } },
          countries: { [cleanCountry]: { [baseField]: 1 } }
        }, { merge: true });
      });
    }

    // 3. Registro Geográfico Global (Solo para Dashboard)
    // Lanzaremos error si esto falla para verlo en los logs de Vercel como un 500
    const statsRef = doc(db, 'stats', 'locations');
    await updateDoc(statsRef, updatePayload).catch(async (err) => {
      console.log("Global update failed, attempting setDoc...", err.message);
      await setDoc(statsRef, {
        cities: { [cleanCity]: { [baseField]: 1 } },
        countries: { [cleanCountry]: { [baseField]: 1 } }
      }, { merge: true });
    });

    return NextResponse.json({ 
      success: true, 
      geo: { country, city, region } 
    });

  } catch (error) {
    console.error('CRITICAL Error en API de estadísticas:', error);
    // IMPORTANTE: En producción, queremos ver el error real
    return NextResponse.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
