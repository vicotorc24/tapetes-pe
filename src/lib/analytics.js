import { sendGTMEvent } from '@next/third-parties/google';

/**
 * Registra un evento personalizado en Google Analytics
 * @param {string} eventName - Nombre del evento (ej: 'whatsapp_click')
 * @param {object} params - Parámetros adicionales (ej: { product_name: 'Alfombra' })
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * Eventos Predefinidos para Tapetes.pe
 */
export const AnalyticsEvents = {
  WHATSAPP_CLICK: (product, seller) => trackEvent('whatsapp_interaction', {
    product_id: product.id,
    product_title: product.title,
    seller_name: seller.name,
    seller_email: seller.email
  }),
  PROFILE_VIEW: (artisan) => trackEvent('artisan_profile_view', {
    artisan_id: artisan.id,
    artisan_name: artisan.name
  }),
  PRODUCT_VIEW: (product) => trackEvent('product_detail_view', {
    product_id: product.id,
    product_title: product.title,
    category: product.category
  })
};
