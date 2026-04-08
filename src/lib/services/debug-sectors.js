import { getSectors } from './sectors';

export const debugSectors = async () => {
  const sectors = await getSectors();
  console.log("=== DEBUG SECTORES PE ===");
  sectors.forEach(s => {
    console.log(`ID: ${s.id} | NAME: "${s.name}" | COLOR: "${s.color}" | ICON: "${s.icon}"`);
  });
  return sectors;
};
