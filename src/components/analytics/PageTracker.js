"use client";
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { recordPageView } from '@/lib/services/stats';

/**
 * Componente que rastrea cambios de página y registra la visita.
 */
export function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Detectar si el usuario tiene una conexión lenta o el modo "Ahorro de Datos" activo
    if (typeof navigator !== 'undefined') {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      // Si es 2g, 3g o tiene activado el ahorro de datos, no rastreamos para ahorrarle megas y batería
      if (conn && (conn.saveData || conn.effectiveType === '2g' || conn.effectiveType === '3g')) {
        if (process.env.NODE_ENV === 'development') {
          console.log('📉 Conexión lenta o ahorro de datos detectado. Omitiendo analíticas internas.');
        }
        return;
      }
    }

    // Evitamos registrar el panel de administración
    if (pathname.startsWith('/admin')) return;

    // Mapeo de rutas a IDs legibles
    const getPageId = (path) => {
      if (path === '/') return 'Inicio';
      if (path.includes('/nosotras')) return 'Sobre Nosotros';
      if (path.includes('/historia')) return 'Herencia Cultural';
      if (path.includes('/impacto')) return 'Nuestro Impacto';
      if (path.includes('/unete')) return 'Unirse a Comunidad';
      if (path.includes('/producto/')) return 'Detalle de Producto';
      if (path.includes('/login')) return 'Acceso';
      return 'Otra';
    };

    const pageId = getPageId(pathname);
    
    // Pequeño retardo para asegurar que la página cargó y evitar duplicados por re-renders
    const timer = setTimeout(() => {
      recordPageView(pageId);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
