import { sendGTMEvent } from '@next/third-parties/google';
import { recordInteraction } from './services/stats';

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
 * Eventos Predefinidos para Made In Contumazá
 */
export const AnalyticsEvents = {
  WHATSAPP_CLICK: (product, seller) => {
    // Registro GA4
    trackEvent('whatsapp_interaction', {
      item_id: product.id,
      item_name: product.title,
      item_category: product.category,
      value: parseFloat(product.price) || 0,
      currency: 'PEN',
      seller_name: seller.name,
      seller_email: seller.email
    });
    // Registro Firestore para Dashboard Interno (via API con Geo)
    recordInteraction(product.id, 'whatsappClicks', seller?.id);
  },
  PROFILE_VIEW: (artisan) => trackEvent('artisan_profile_view', {
    artisan_id: artisan.id,
    artisan_name: artisan.name,
    specialty: artisan.specialty
  }),
  PRODUCT_VIEW: (product, artisan) => {
    // Registro GA4
    trackEvent('view_item', {
      item_id: product.id,
      item_name: product.title,
      item_category: product.category,
      value: parseFloat(product.price) || 0,
      currency: 'PEN',
      seller_name: artisan?.name || 'Unknown'
    });
    // Registro Firestore para Dashboard Interno (via API con Geo)
    recordInteraction(product.id, 'views', artisan?.id);
  },
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
  }),
  LEGACY_VIEW: (item) => trackEvent('legacy_interaction', {
    legacy_id: item.id || item.slug,
    legacy_name: item.name,
    legacy_category: item.category
  }),
  LOGIN: (method, status) => trackEvent('login', {
    method: method || 'email',
    status: status || 'success'
  }),
  JOIN_INTERACTION: (type) => trackEvent('join_community_click', {
    cta_type: type || 'artisan_registration'
  }),
  ABOUT_SECTION_VIEW: (section) => trackEvent('about_us_engagement', {
    section_name: section
  }),
  REMOVE_FROM_CART: (product) => trackEvent('remove_from_cart', {
    item_id: product.id,
    item_name: product.title,
    value: parseFloat(product.price) || 0,
    currency: 'PEN'
  }),
  BEGIN_CHECKOUT: (total, method) => trackEvent('begin_checkout', {
    value: total,
    currency: 'PEN',
    payment_type: method
  }),
  IMPACT_VIEW: (section) => trackEvent('social_impact_engagement', {
    section_name: section
  }),
  trackEvent: (eventName, params) => trackEvent(eventName, params)
};
