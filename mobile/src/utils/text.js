/**
 * Normaliza una cadena de texto para comparaciones robustas:
 * - Elimina tildes y diacríticos.
 * - Convierte a minúsculas.
 * - Recorta espacios.
 */
export const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

/**
 * Lógica de coincidencia de sectores heredada de la web
 */
export const isSectorMatch = (catSector, targetSectorId, targetSectorName) => {
  if (!catSector || !targetSectorId) return false;
  
  const catSectorNorm = normalizeText(catSector);
  const targetIdNorm = normalizeText(targetSectorId);
  const targetNameNorm = normalizeText(targetSectorName);
  
  // 1. Coincidencia exacta por ID
  if (catSector === targetSectorId) return true;
  
  // 2. Coincidencia por nombre normalizado
  if (catSectorNorm === targetNameNorm) return true;
  
  // 3. Mapeo Legacy
  const isArtesania = targetNameNorm.includes('artesania') || targetIdNorm === 'textile';
  const isAlimentos = targetNameNorm.includes('alimento') || targetNameNorm.includes('agro') || targetIdNorm === 'food';
  const isTurismo = targetNameNorm.includes('turismo') || targetIdNorm === 'tourism';

  if (isArtesania && (catSectorNorm === 'textile' || catSectorNorm === 'artesania' || catSectorNorm.includes('artesania'))) return true;
  if (isAlimentos && (catSectorNorm === 'food' || catSectorNorm === 'alimentos' || catSectorNorm.includes('alimento') || catSectorNorm.includes('agro'))) return true;
  if (isTurismo && (catSectorNorm === 'tourism' || catSectorNorm === 'turismo' || catSectorNorm.includes('turismo'))) return true;

  return false;
};
