import React from 'react';

// Icono: Cerro El Calvario (Turismo) - Redibujado más robusto
export const IconTurismo = ({ className, color = 'currentColor' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Masa del cerro más sólida */}
    <path d="M15 80L40 30L55 55L75 15L90 80H15Z" fill={color} fillOpacity="0.15" />
    <path d="M15 80L40 30L55 55L75 15L90 80" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    {/* Cruces más gruesas y visibles */}
    <path d="M40 20V35M35 27.5H45" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <path d="M75 5V20M70 12.5H80" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <path d="M55 45V60M50 52.5H60" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <path d="M15 80H90" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Icono: Vasija y Abeja (Alimentos)
export const IconAlimentos = ({ className, color = 'currentColor' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M35 85C30 85 25 80 25 70C25 55 35 45 35 35H65C65 45 75 55 75 70C75 80 70 85 65 85H35Z" fill={color} fillOpacity="0.2" />
    <path d="M35 85C30 85 25 80 25 70C25 55 35 45 35 35H65C65 45 75 55 75 70C75 80 70 85 65 85H35Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M40 35V30H60V35" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Abeja */}
    <circle cx="75" cy="30" r="5" fill={color} />
    <path d="M75 25C78 20 85 20 88 25" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M72 27L68 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Icono: Ganchillo y Telar (Artesanía)
export const IconArtesania = ({ className, color = 'currentColor' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M30 40H75V85H30V40Z" fill={color} fillOpacity="0.2" />
    <path d="M30 40H75V85H30V40Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M35 50H70M35 60H70M35 70H70M35 80H70" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
    {/* Ganchillo */}
    <path d="M20 25L85 45" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <path d="M20 25C18 25 15 28 17 31" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Icono: Sello de Origen (Todos)
export const IconTodos = ({ className, color = 'currentColor' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="2.5" strokeDasharray="2 6" />
    <path d="M40 50L50 40L60 50L50 60L40 50Z" fill={color} />
    <path d="M30 50H70M50 30V70" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
