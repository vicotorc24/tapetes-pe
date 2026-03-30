"use client";
import React, { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideChevronRight, LucideHome } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show on home page
  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter(item => item !== '');
  
  const breadcrumbMap = {
    'nosotras': 'Nosotras',
    'historia': 'Nuestra Historia',
    'impacto': 'Impacto Social',
    'admin': 'Panel Administrativo',
    'producto': 'Catálogo',
    'login': 'Ingreso'
  };

  return (
    <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-2 text-xs font-medium text-stone-400">
      <Link href="/" className="hover:text-andeansky-700 flex items-center gap-1 transition-colors">
        <LucideHome size={14} />
        <span>Inicio</span>
      </Link>
      
      {pathSegments.map((segment, index) => {
        const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        const label = breadcrumbMap[segment] || (segment.charAt(0).toUpperCase() + segment.slice(1));

        return (
          <Fragment key={url}>
            <LucideChevronRight size={12} className="text-stone-300" />
            {isLast ? (
              <span className="text-stone-600 font-bold">{label}</span>
            ) : (
              <Link href={url} className="hover:text-andeansky-700 transition-colors">
                {label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
