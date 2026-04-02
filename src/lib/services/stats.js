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
    // No esperamos la respuesta para no bloquear la UI del usuario (Fire and forget)
    fetch('/api/interaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type, 
        productId, 
        artisanId 
      }),
    }).catch(err => console.warn('Silent analytics error:', err));

  } catch (error) {
    // Silenciamos errores de red en analíticas para no interrumpir al usuario
    console.debug('Analytics failed:', error);
  }
};
