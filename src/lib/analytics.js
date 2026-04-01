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
    item_id: product.id,
    item_name: product.title,
    item_category: product.category,
    value: parseFloat(product.price) || 0,
    currency: 'PEN',
    seller_name: seller.name,
    seller_email: seller.email
  }),
  PROFILE_VIEW: (artisan) => trackEvent('artisan_profile_view', {
    artisan_id: artisan.id,
    artisan_name: artisan.name,
    specialty: artisan.specialty
  }),
  PRODUCT_VIEW: (product) => trackEvent('view_item', {
    item_id: product.id,
    item_name: product.title,
    item_category: product.category,
    value: parseFloat(product.price) || 0,
    currency: 'PEN'
  }),
  SEARCH: (query) => trackEvent('search', {
    search_term: query
  }),
  FILTER: (category, technique) => trackEvent('filter_usage', {
    category_filter: category || 'todas',
    technique_filter: technique || 'todas'
  }),
  ADD_TO_CART: (product) => trackEvent('add_to_cart', {
    item_id: product.id,
    item_name: product.title,
    value: parseFloat(product.price) || 0,
    currency: 'PEN'
  })
};
