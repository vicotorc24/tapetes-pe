/**
 * Limpia el texto de etiquetas HTML y entidades como &nbsp;, &quot;, etc.
 */
export const cleanHtml = (text) => {
  if (!text) return "";

  // 1. Eliminar etiquetas HTML
  let cleanText = text.replace(/<[^>]*>/g, '');

  // 2. Reemplazar entidades HTML comunes
  const entities = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&iexcl;': '¡',
    '&iquest;': '¿',
    '&aacute;': 'á',
    '&eacute;': 'é',
    '&iacute;': 'í',
    '&oacute;': 'ó',
    '&uacute;': 'ú',
    '&ntilde;': 'ñ',
    '&Aacute;': 'Á',
    '&Eacute;': 'É',
    '&Iacute;': 'Í',
    '&Oacute;': 'Ó',
    '&Uacute;': 'Ú',
    '&Ntilde;': 'Ñ',
    '&#x20;': ' ',
  };

  Object.keys(entities).forEach(entity => {
    const regex = new RegExp(entity, 'g');
    cleanText = cleanText.replace(regex, entities[entity]);
  });

  // 3. Limpiar espacios extra
  return cleanText.trim();
};
