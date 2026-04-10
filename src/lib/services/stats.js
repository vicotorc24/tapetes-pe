/**
 * Registra una interacción atómica con geolocalización integrada a través del servidor.
 * @param {string} productId - ID del producto
 * @param {'views' | 'whatsappClicks'} metric - Tipo de métrica a incrementar
 * @param {string} artisanId - Opcional. ID de la artesana propietaria.
 */
export const recordInteraction = async (productId, metric, artisanId) => {
  if (!productId) return;
  
  const type = metric === 'whatsappClicks' ? 'click' : 'view';

  try {
    // Usamos fetch hacia nuestra API interna para capturar la IP/Geolocalización en el servidor (Vercel)
    const response = await fetch('/api/interaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type, 
        productId, 
        artisanId 
      }),
    });

    if (process.env.NODE_ENV === 'development') {
      const data = await response.json();
      console.log(`📊 Analytics (${type}):`, data.success ? '✅ Success' : '❌ Failed', data.geo);
    }

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Analytics Critical Error:', error);
    }
  }
};

/**
 * Registra la visita a una página institucional.
 * @param {string} pageId - ID legible de la página (ej: 'home', 'nosotras')
 */
export const recordPageView = async (pageId) => {
  if (!pageId) return;

  try {
    // 1. Intentar usar sendBeacon (Tecnología No-Bloqueante)
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify({ type: 'view', pageId })], { type: 'application/json' });
      const sent = navigator.sendBeacon('/api/interaction', blob);
      if (sent) {
        if (process.env.NODE_ENV === 'development') console.log(`🚀 Beacon Sent (${pageId})`);
        return;
      }
    }

    // 2. Fallback a Fetch (mantenemos el modo asíncrono)
    const response = await fetch('/api/interaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'view', 
        pageId 
      }),
    });

    if (process.env.NODE_ENV === 'development') {
      const data = await response.json();
      console.log(`👁️ Page View (${pageId}):`, data.success ? '✅ Registered' : '❌ Failed');
    }
  } catch (error) {
    // Silenciamos errores en producción
  }
};

/**
 * Registra el interés en un personaje o sitio del Legado Cultural.
 * @param {string} legacyId - ID del personaje o sitio
 */
export const recordLegacyInteraction = async (legacyId) => {
  if (!legacyId) return;

  try {
    // 1. Intentar usar sendBeacon
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify({ type: 'view', legacyId })], { type: 'application/json' });
      const sent = navigator.sendBeacon('/api/interaction', blob);
      if (sent) return;
    }

    // 2. Fallback a Fetch
    await fetch('/api/interaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'view', 
        legacyId 
      }),
    });
  } catch (error) {
    // Silenciamos errores
  }
};
