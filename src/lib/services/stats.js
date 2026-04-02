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
    // Silenciamos errores de red en analíticas para no interrumpir al usuario
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Analytics Critical Error:', error);
    }
  }
};
